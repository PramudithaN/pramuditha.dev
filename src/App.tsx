import { useState, useEffect, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { getStoredContent, type PortfolioContent, soundEngine } from './services';
import { useTheme, useNavigation } from './hooks';
import { THEME_PALETTES } from './hooks/useTheme';
import {
  HomeView,
  AboutView,
  LogicView,
  AestheticsView,
  ReminderReleaseView,
  LocalizationReleaseView,
  AdminPanelView
} from './components/views';
import { PageTransitionOverlay, CommandPalette } from './components/common';
import MaintenanceView from './components/views/MaintenanceView';
import './index.css';

// Show maintenance view in deployed production builds (unless VITE_MAINTENANCE_MODE=false),
// or locally when ?maintenance=1 is in the URL for previewing.
const IS_MAINTENANCE_PREVIEW =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('maintenance') === '1';

const IS_MAINTENANCE_MODE =
  IS_MAINTENANCE_PREVIEW ||
  (import.meta.env.PROD && import.meta.env.VITE_MAINTENANCE_MODE !== 'false');

export default function App() {
  if (IS_MAINTENANCE_MODE) {
    return (
      <>
        <MaintenanceView />
        <Analytics />
      </>
    );
  }

  return <PortfolioApp />;
}

function PortfolioApp() {
  const { theme, toggleTheme, palette, setPalette } = useTheme();
  const {
    page,
    prevPage,
    navigateTo,
    isTransitioning,
    transitionPhase,
    section2Ref,
    subpageRef
  } = useNavigation();
  const [portfolioContent, setPortfolioContent] = useState<PortfolioContent>(getStoredContent);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Listen for storage updates across tabs/components
  useEffect(() => {
    const handleContentUpdate = () => {
      setPortfolioContent(getStoredContent());
    };
    window.addEventListener('portfolio_content_updated', handleContentUpdate);
    return () => window.removeEventListener('portfolio_content_updated', handleContentUpdate);
  }, []);

  const handleToggleMusic = useCallback(() => {
    soundEngine.toggleMusic();
  }, []);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        soundEngine.playClickSound();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Buy Me a Coffee Widget
  useEffect(() => {
    const script = document.createElement('script');
    script.setAttribute('data-name', 'BMC-Widget');
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';
    script.setAttribute('data-id', 'PramudithaN');
    script.setAttribute('data-description', 'Support me on Buy me a coffee!');
    script.setAttribute('data-message', '');
    script.setAttribute('data-color', '#e51d1d');
    script.setAttribute('data-position', 'Right');
    script.setAttribute('data-x_margin', '18');
    script.setAttribute('data-y_margin', '18');
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'strict-origin-when-cross-origin';
    script.async = true;
    script.onload = function () {
      try {
        const evt = document.createEvent('Event');
        evt.initEvent('DOMContentLoaded', false, false);
        window.dispatchEvent(evt);
      } catch (err) {
        console.warn('BMC Widget init handled:', err);
      }
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      const bmcBtn = document.getElementById('bmc-wbtn');
      if (bmcBtn) {
        bmcBtn.remove();
      }
      document.querySelectorAll('iframe').forEach(iframe => {
        if (iframe.src.includes('buymeacoffee')) {
          const parent = iframe.parentElement;
          if (parent && parent.id && parent.id.includes('bmc')) {
            parent.remove();
          } else {
            iframe.remove();
          }
        }
      });
    };
  }, []);

  return (
    <>
      {/* 3 Staggered Rectangles Page Transition Overlay */}
      <PageTransitionOverlay
        isTransitioning={isTransitioning}
        transitionPhase={transitionPhase}
        theme={theme}
      />

      {/* Global Command Palette (Cmd+K) */}
      {page !== 'admin' && (
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onNavigate={navigateTo}
          onToggleTheme={toggleTheme}
          onToggleMusic={handleToggleMusic}
          theme={theme}
        />
      )}

      {/* Admin View */}
      {page === 'admin' && (
        <AdminPanelView onNavigateHome={() => navigateTo('home')} />
      )}

      {/* About Me Subpage */}
      {page === 'about' && (
        <AboutView
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigate={navigateTo}
          prevPage={prevPage}
          portfolioContent={portfolioContent}
          subpageRef={subpageRef}
        />
      )}

      {/* Logic & Systems Subpage */}
      {page === 'logic' && (
        <LogicView
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigate={navigateTo}
          portfolioContent={portfolioContent}
          subpageRef={subpageRef}
        />
      )}

      {/* Aesthetics & Motion Subpage */}
      {page === 'aesthetics' && (
        <AestheticsView
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigate={navigateTo}
          portfolioContent={portfolioContent}
          subpageRef={subpageRef}
        />
      )}

      {/* Reminder.afk Product Release Subpage */}
      {page === 'reminder' && (
        <ReminderReleaseView
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigate={navigateTo}
          subpageRef={subpageRef}
        />
      )}

      {/* Localization Check VS Code Extension Subpage */}
      {page === 'localization' && (
        <LocalizationReleaseView
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigate={navigateTo}
          subpageRef={subpageRef}
        />
      )}

      {/* Main Home Layout */}
      {page === 'home' && (
        <div className="scroll-container">
          <HomeView
            theme={theme}
            onToggleTheme={toggleTheme}
            onNavigate={navigateTo}
            section2Ref={section2Ref}
            onOpenSearch={() => setIsCommandPaletteOpen(true)}
          />
          <Analytics />
        </div>
      )}

      {/* Global JP3N-Style Color Palette Switcher Dock */}
      {page !== 'admin' && (
        <div className="site-theme-dock" role="region" aria-label="Color palette switcher">
          <div className="site-palette-dots" role="radiogroup" aria-label="Color palette">
            {THEME_PALETTES.map((item) => (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={palette === item.id}
                aria-label={`${item.label} palette`}
                title={item.label}
                className={`site-palette-dot ${palette === item.id ? 'is-active' : ''}`}
                style={{ backgroundColor: item.primary }}
                onClick={() => setPalette(item.id)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
