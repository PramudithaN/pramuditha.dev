import type { RefObject } from 'react';
import type { PageType, ThemeMode, PortfolioContent } from '../../types';
import SubpageHeader from '../common/SubpageHeader';
import SubpageQuickNav from '../common/SubpageQuickNav';
import ScrollToTopButton from '../common/ScrollToTopButton';
import VideoShowcase from '../showcase/VideoShowcase';
import AestheticsCollageSection from '../home/AestheticsCollageSection';
import GraphicTimelineSection from '../home/GraphicTimelineSection';
import TestimonialsEditorialSection from '../home/TestimonialsEditorialSection';
import SignatureFooterSection from '../home/SignatureFooterSection';
import { useScrollTop } from '../../hooks/useScrollTop';

interface AestheticsViewProps {
  theme: ThemeMode;
  onToggleTheme: (event?: React.MouseEvent<HTMLElement> | MouseEvent | { clientX?: number; clientY?: number }) => void;
  onNavigate: (page: PageType) => void;
  portfolioContent: PortfolioContent;
  subpageRef: RefObject<HTMLDivElement | null>;
  onOpenSearch?: () => void;
}

export default function AestheticsView({
  theme,
  onToggleTheme,
  onNavigate,
  portfolioContent,
  subpageRef,
  onOpenSearch,
}: AestheticsViewProps) {
  const { showScrollTop, scrollToTop } = useScrollTop('aesthetics', subpageRef);
  const visibleReels = portfolioContent.videoReels.filter((r) => !r.hidden);

  return (
    <>
      <div
        ref={subpageRef as RefObject<HTMLDivElement>}
        className={`subpage-container aesthetics-subpage ${theme}-theme`}
      >
        <div className="subpage-scroll-content">
          <SubpageHeader
            theme={theme}
            onToggleTheme={onToggleTheme}
            onNavigateHome={() => onNavigate('home')}
            onBack={() => onNavigate('home')}
            currentPage="aesthetics"
            onNavigate={onNavigate}
            onOpenSearch={onOpenSearch}
          />

          <SubpageQuickNav
            currentPage="aesthetics"
            onNavigate={onNavigate}
          />

          <AestheticsCollageSection />

          <GraphicTimelineSection />

          {visibleReels.length > 0 && (
            <section
              style={{
                width: '100%',
                maxWidth: '1120px',
                margin: '0 auto',
                padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.25rem, 4vw, 3rem)',
              }}
              aria-label="Video Editing & Motion Reels"
            >
              <VideoShowcase reels={visibleReels} />
            </section>
          )}

          <TestimonialsEditorialSection
            theme={theme}
            testimonials={portfolioContent.aestheticsTestimonials}
          />

          <SignatureFooterSection theme={theme} onNavigate={onNavigate} />

          <ScrollToTopButton visible={showScrollTop} onClick={scrollToTop} />
        </div>
      </div>
    </>
  );
}
