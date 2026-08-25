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
import './index.css';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { page, prevPage, navigateTo, section2Ref, subpageRef } = useNavigation();
  const [portfolioContent, setPortfolioContent] = useState<PortfolioContent>(getStoredContent);

  // Listen for storage updates across tabs/components
  useEffect(() => {
    const handleContentUpdate = () => {
      setPortfolioContent(getStoredContent());
    };
    window.addEventListener('portfolio_content_updated', handleContentUpdate);
    return () => window.removeEventListener('portfolio_content_updated', handleContentUpdate);
  }, []);

  // Admin View
  if (page === 'admin') {
    return <AdminPanel onNavigateHome={() => navigateTo('home')} />;
  }

  // About Me Subpage
  if (page === 'about') {
    return (
      <AboutView
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigate={navigateTo}
        prevPage={prevPage}
        portfolioContent={portfolioContent}
        subpageRef={subpageRef}
      />
    );
  }

  // Logic & Systems Subpage
  if (page === 'logic') {
    return (
      <LogicView
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigate={navigateTo}
        portfolioContent={portfolioContent}
        subpageRef={subpageRef}
      />
    );
  }

  // Aesthetics & Motion Subpage
  if (page === 'aesthetics') {
    return (
      <AestheticsView
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigate={navigateTo}
        portfolioContent={portfolioContent}
        subpageRef={subpageRef}
      />
    );
  }

  // Main Home Layout (Section 1: Hero & Section 2: Split Portals)
  return (
    <div className="scroll-container">
      <HomeView
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigate={navigateTo}
        section2Ref={section2Ref}
      />
      <Analytics />
    </div>
  );
}
