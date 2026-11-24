import type { RefObject } from 'react';
import type { PageType, ThemeMode, PortfolioContent } from '../../types';
import SubpageHeader from '../common/SubpageHeader';
import ScrollToTopButton from '../common/ScrollToTopButton';
import AboutScrapbookSection from '../home/AboutScrapbookSection';
import { useScrollTop } from '../../hooks/useScrollTop';

interface AboutViewProps {
  theme: ThemeMode;
  onToggleTheme: (event?: React.MouseEvent<HTMLElement> | MouseEvent | { clientX?: number; clientY?: number }) => void;
  onNavigate: (page: PageType) => void;
  prevPage: PageType;
  portfolioContent?: PortfolioContent;
  subpageRef: RefObject<HTMLDivElement | null>;
  onOpenSearch?: () => void;
}

export default function AboutView({
  theme,
  onToggleTheme,
  onNavigate,
  prevPage,
  subpageRef,
  onOpenSearch
}: AboutViewProps) {
  const { showScrollTop, scrollToTop } = useScrollTop('about', subpageRef);

  return (
    <>
      <div
        ref={subpageRef as RefObject<HTMLDivElement>}
        className={`subpage-container about-subpage ${theme}-theme`}
      >
        <div className="subpage-scroll-content">
          {/* Subpage Header */}
          <SubpageHeader
            theme={theme}
            onToggleTheme={onToggleTheme}
            onNavigateHome={() => onNavigate('home')}
            onBack={() => onNavigate(prevPage)}
            currentPage="about"
            onNavigate={onNavigate}
            onOpenSearch={onOpenSearch}
          />

          {/* Revamped Editorial About Me Section */}
          <AboutScrapbookSection onNavigate={onNavigate} />
        </div>
      </div>

      <ScrollToTopButton visible={showScrollTop} onClick={scrollToTop} />
    </>
  );
}
