import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import type { PageType, ThemeMode } from '../../types';
import ThemeToggle from './ThemeToggle';
import MusicButton from './MusicButton';
import SearchButton from './SearchButton';
import { ChristmasHat } from '../seasonal';
import { CHRISTMAS_CONFIG, isChristmasSeasonActive } from '../../constants/seasonal';

interface SubpageHeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onNavigateHome: () => void;
  onBack: () => void;
  currentPage?: PageType;
  onNavigate?: (page: PageType) => void;
  hideNav?: boolean;
  hideBack?: boolean;
  centerText?: string;
  onOpenSearch?: () => void;
}

interface NavTab {
  id: PageType;
  label: string;
  shortLabel: string;
  icon: string;
}

const NAV_TABS: NavTab[] = [
  {
    id: 'logic',
    label: 'Logic & Systems',
    shortLabel: 'Logic',
    icon: 'mdi:code-braces'
  },
  {
    id: 'aesthetics',
    label: 'Aesthetics & Motion',
    shortLabel: 'Aesthetics',
    icon: 'mdi:palette-outline'
  },
  {
    id: 'about',
    label: 'About',
    shortLabel: 'About',
    icon: 'mdi:account-outline'
  }
];

export default function SubpageHeader({
  theme,
  onToggleTheme,
  onNavigateHome,
  onBack,
  currentPage,
  onNavigate,
  hideNav = false,
  hideBack = false,
  centerText,
  onOpenSearch
}: SubpageHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const scrollContainer = document.querySelector('.subpage-container');
    const handleScroll = () => {
      const currentScroll = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
      setIsScrolled(currentScroll > 25);
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogoClick = () => {
    onNavigateHome();
    setTimeout(() => {
      const scrollContainer = document.querySelector('.scroll-container');
      if (scrollContainer) scrollContainer.scrollTo({ top: 0 });
    }, 50);
  };

  const handleTabClick = (tabId: PageType) => {
    if (tabId === currentPage) {
      const subpage = document.querySelector('.subpage-container');
      if (subpage) {
        subpage.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (onNavigate) {
      onNavigate(tabId);
    }
  };

  return (
    <div
      className={`top-header-row subpage-header-extended ${
        isScrolled ? 'is-scrolled' : 'is-initial'
      }`}
    >
      {/* Left: Brand Logo */}
      <div className="stacked-logo" onClick={handleLogoClick} title="Return to Home" style={{ position: 'relative' }}>
        {CHRISTMAS_CONFIG.showHatOnBranding && isChristmasSeasonActive() && (
          <ChristmasHat style={{ top: '-14px', left: '-10px', width: '26px', height: '26px' }} />
        )}
        <span>PR</span>
        <span>NA</span>
      </div>

      {/* Center: Info text OR Cross-Subpage Quick Nav Switcher */}
      {centerText ? (
        <div className="header-center-info-pill">
          <span className="info-pulse-dot" />
          <span>{centerText}</span>
        </div>
      ) : (
        !hideNav && onNavigate && (
          <nav className="header-quick-nav" aria-label="Subpage navigation">
            {NAV_TABS.map((tab) => {
              const isActive = tab.id === currentPage;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`header-nav-pill ${isActive ? 'active' : ''}`}
                  onClick={() => handleTabClick(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  title={`Navigate to ${tab.label}`}
                >
                  <Icon icon={tab.icon} className="header-nav-icon" />
                  <span className="header-nav-label-full">{tab.label}</span>
                  <span className="header-nav-label-short">{tab.shortLabel}</span>
                  {isActive && <span className="header-nav-active-dot" />}
                </button>
              );
            })}
          </nav>
        )
      )}

      {/* Right: Search, Music, Theme Toggle, Back Button & Mobile Hamburger */}
      <div className="header-buttons">
        {onOpenSearch && <SearchButton onClick={onOpenSearch} variant="header" />}
        <MusicButton variant="header" />
        <ThemeToggle theme={theme} onToggle={onToggleTheme} variant="header" />
        {!hideBack && (
          <button
            type="button"
            className="theme-toggle-btn header-back-btn"
            onClick={onBack}
            title="Back to Home"
            aria-label="Back to Home"
          >
            <span className="header-back-text-full">
              <span className="back-chevron" aria-hidden="true">‹</span>
              <span>Back</span>
            </span>
            <span className="header-back-text-short">‹</span>
          </button>
        )}
        <button
          type="button"
          className={`theme-mode-toggle-btn header-hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          title={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <Icon
            icon={isMobileMenuOpen ? 'mdi:close' : 'mdi:menu'}
            className="header-hamburger-icon"
          />
        </button>
      </div>

      {/* Mobile Hamburger Dropdown Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="mobile-nav-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            className="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-nav-section-title">Sections</div>
            <div className="mobile-nav-items">
              {NAV_TABS.map((tab) => {
                const isActive = tab.id === currentPage;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleTabClick(tab.id);
                    }}
                  >
                    <div className="mobile-nav-item-content">
                      <Icon icon={tab.icon} className="mobile-nav-item-icon" />
                      <span className="mobile-nav-item-label">{tab.label}</span>
                    </div>
                    {isActive && <span className="mobile-nav-active-pill">Active</span>}
                  </button>
                );
              })}
            </div>

            <div className="mobile-nav-divider" />

            <button
              type="button"
              className="mobile-nav-item mobile-nav-back-item"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onBack();
              }}
            >
              <div className="mobile-nav-item-content">
                <span className="mobile-nav-back-chevron">‹</span>
                <span className="mobile-nav-item-label">Back to Home</span>
              </div>
            </button>
          </nav>
        </>
      )}
    </div>
  );
}
