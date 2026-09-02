import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { getStoredContent, type PortfolioContent } from './services/contentStore';
import { useTheme } from './hooks/useTheme';
import { useNavigation } from './hooks/useNavigation';
import HomeView from './components/views/HomeView';
import AboutView from './components/views/AboutView';
import LogicView from './components/views/LogicView';
import AestheticsView from './components/views/AestheticsView';
import ReminderReleaseView from './components/views/ReminderReleaseView';
import AdminPanel from './components/AdminPanel';
import PageTransitionOverlay from './components/common/PageTransitionOverlay';
import './index.css';

export default function App() {
  const { theme, toggleTheme } = useTheme();
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

  // Listen for storage updates across tabs/components
  useEffect(() => {
    const handleContentUpdate = () => {
      setPortfolioContent(getStoredContent());
    };
    window.addEventListener('portfolio_content_updated', handleContentUpdate);
    return () => window.removeEventListener('portfolio_content_updated', handleContentUpdate);
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
    script.async = true;
    script.onload = function () {
      const evt = document.createEvent('Event');
      evt.initEvent('DOMContentLoaded', false, false);
      window.dispatchEvent(evt);
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

      {/* Admin View */}
      {page === 'admin' && (
        <AdminPanel onNavigateHome={() => navigateTo('home')} />
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

      {/* Main Home Layout */}
      {page === 'home' && (
        <div className="scroll-container">
          <HomeView
            theme={theme}
            onToggleTheme={toggleTheme}
            onNavigate={navigateTo}
            section2Ref={section2Ref}
          />
          <Analytics />
        </div>
      )}
    </>
  );
}
