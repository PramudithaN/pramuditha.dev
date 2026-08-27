import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { getStoredContent, type PortfolioContent } from './services/contentStore';
import { useTheme } from './hooks/useTheme';
import { useNavigation } from './hooks/useNavigation';
import HomeView from './components/views/HomeView';
import AboutView from './components/views/AboutView';
import LogicView from './components/views/LogicView';
import AestheticsView from './components/views/AestheticsView';
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
