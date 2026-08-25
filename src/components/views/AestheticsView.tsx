import type { RefObject } from 'react';
import type { PageType, ThemeMode, PortfolioContent } from '../../types';
import SubpageHeader from '../common/SubpageHeader';
import ScrollToTopButton from '../common/ScrollToTopButton';
import TestimonialCard from '../common/TestimonialCard';
import TimelineItem from '../common/TimelineItem';
import VideoShowcase from '../showcase/VideoShowcase';
import { useScrollTop } from '../../hooks/useScrollTop';

interface AestheticsViewProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onNavigate: (page: PageType) => void;
  portfolioContent: PortfolioContent;
  subpageRef: RefObject<HTMLDivElement | null>;
}

export default function AestheticsView({
  theme,
  onToggleTheme,
  onNavigate,
  portfolioContent,
  subpageRef
}: AestheticsViewProps) {
  const { showScrollTop, scrollToTop } = useScrollTop('aesthetics', subpageRef);

  const visibleAestheticsExperience = portfolioContent.aestheticsExperience.filter(
    (e) => !e.hidden
  );

  return (
    <>
      <div
        ref={subpageRef as RefObject<HTMLDivElement>}
        className={`subpage-container aesthetics-subpage ${theme}-theme`}
      >
        <div className="subpage-scroll-content">
          {/* Subpage Background Watermarks */}
          <div className="subpage-bg-watermark right-watermark">
            <span>PRAMUDITHA NADUN | DESIGNER</span>
          </div>

          {/* Subpage Header */}
          <SubpageHeader
            theme={theme}
            onToggleTheme={onToggleTheme}
            onNavigateHome={() => onNavigate('home')}
            onBack={() => onNavigate('home')}
          />

          {/* Subpage Intro */}
          <h1 className="subpage-title">Aesthetics &amp; Motion</h1>
          <p className="subpage-subtitle">Graphic Design &amp; Cinematography</p>

          {/* Video Showcase: Graphic Design / Video Editing reels */}
          <VideoShowcase reels={portfolioContent.videoReels} />

          <div className="section-divider" />
          <h2 className="section-title">Creative Journey</h2>
          <div className="timeline-container">
            {visibleAestheticsExperience.map((exp, index) => (
              <TimelineItem
                key={exp.id || index}
                duration={exp.duration}
                title={exp.title}
                company={exp.company}
                role={exp.role}
                accomplishments={exp.accomplishments}
              />
            ))}
          </div>

          <div className="section-divider" />
          <h2 className="section-title">Client Feedback</h2>
          <div className="testimonials-grid">
            {portfolioContent.aestheticsTestimonials.map((testimonial, idx) => (
              <TestimonialCard
                key={testimonial.id || idx}
                name={testimonial.name}
                role={testimonial.role}
                avatarUrl={testimonial.avatarUrl}
                text={testimonial.text}
                withToggle={false}
              />
            ))}
          </div>

          <div className="section-divider" />
          {/* Work Grid */}
          <div className="work-grid">
            <div className="work-card">
              <div>
                <div className="work-item-meta">01 / Brand Identity</div>
                <h3 className="work-item-title">Typographic Layouts</h3>
                <p className="work-item-desc">
                  Shaping minimalist design frameworks, poster schemes, custom type identities, and
                  vector palettes for brands.
                </p>
              </div>
              <span className="work-item-tag">Figma / Adobe</span>
            </div>

            <div className="work-card">
              <div>
                <div className="work-item-meta">02 / Video Production</div>
                <h3 className="work-item-title">Cinematic Motion Reels</h3>
                <p className="work-item-desc">
                  Editing editorial promos, typography animations, and color grading reels to present
                  dynamic products.
                </p>
              </div>
              <span className="work-item-tag">Premiere / After Effects</span>
            </div>

            <div className="work-card">
              <div>
                <div className="work-item-meta">03 / Visual Systems</div>
                <h3 className="work-item-title">Interactive Art Canvas</h3>
                <p className="work-item-desc">
                  Generating procedural patterns, 3D abstract compositions, and loop animations
                  that blur art with code.
                </p>
              </div>
              <span className="work-item-tag">Generative / 3D</span>
            </div>
          </div>
        </div>
      </div>

      <ScrollToTopButton visible={showScrollTop} onClick={scrollToTop} />
    </>
  );
}
