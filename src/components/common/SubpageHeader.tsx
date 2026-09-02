import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import type { PageType, ThemeMode } from '../../types';
import ThemeToggle from './ThemeToggle';

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
  centerText
}: SubpageHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

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
      <div className="stacked-logo" onClick={handleLogoClick} title="Return to Home">
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

      {/* Right: Theme Toggle (aligned to corner) & Back Button */}
      <div className="header-buttons">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} variant="header" />
        {!hideBack && (
          <button
            type="button"
            className="theme-toggle-btn header-back-btn"
            onClick={onBack}
            title="Back to Home"
            aria-label="Back to Home"
          >
            <span className="header-back-text-full">‹ Back</span>
            <span className="header-back-text-short">‹</span>
          </button>
        )}
      </div>
    </div>
  );
}
