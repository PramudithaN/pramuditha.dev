import type { RefObject } from 'react';
import type { PageType, ThemeMode, PortfolioContent } from '../../types';
import SubpageHeader from '../common/SubpageHeader';
import SubpageQuickNav from '../common/SubpageQuickNav';
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
          {/* Subpage Background Watermarks & Ambient Motion Telemetry Stream */}
          <div className="subpage-bg-watermark right-watermark">
            <span>PRAMUDITHA NADUN | DESIGNER</span>
          </div>

          <div className="aesthetics-bg-telemetry-watermark" aria-hidden="true">
            <div className="telemetry-column left-telemetry">
              <pre>
{`[CAM_REC: 01:24:18:09] // 24.000 FPS // 4K DCI
ISO 800 // 5600K // SHUTTER 180.0° // T2.8
COLOR: ACEScg -> Rec.709 // ARRI_LogC3_FilmPrint
ASPECT_RATIO: 2.39:1 ANAMORPHIC // 35mm PRIME

// MOTION GRAPHICS KERNEL
const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

bezier_curve: cubic-bezier(0.16, 1, 0.3, 1)
velocity_damping: 0.88 // frame_rate: 60Hz

COMP_01 // SCENE_04 // TAKE_03
KEYFRAME_DATA: [
  scale: 1.000 -> 1.085,
  rotation_z: -1.4deg -> 0.0deg,
  motion_blur_shutter: 0.50
]`}
              </pre>
            </div>
            <div className="telemetry-column right-telemetry">
              <pre>
{`RENDER_ENGINE: ACES D65 // BIT_DEPTH: 32-bit Float
COLOR_GRADE:
  lift: [0.002, 0.001, -0.004]
  gamma: [1.020, 0.995, 0.980]
  gain: [1.050, 1.020, 0.940]
  saturation: 1.12 // contrast: 1.08

VFX_NODE_GRAPH:
  [INPUT_RAW] -> [DENOISE_35MM]
  [DENOISE_35MM] -> [ANAMORPHIC_FLARE]
  [ANAMORPHIC_FLARE] -> [OPTICAL_GLOW]
  [OPTICAL_GLOW] -> [ACES_TONEMAP] -> [OUTPUT_DCI]

AUDIO_MASTER: 48.000 kHz // 24-bit PCM
LUFS_TARGET: -14.0 LKFS // TRUE_PEAK: -1.0 dBTP`}
              </pre>
            </div>
          </div>

          {/* Subpage Header */}
          <SubpageHeader
            theme={theme}
            onToggleTheme={onToggleTheme}
            onNavigateHome={() => onNavigate('home')}
            onBack={() => onNavigate('home')}
            currentPage="aesthetics"
            onNavigate={onNavigate}
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

          {/* Quick Navigation to Other Sections */}
          <SubpageQuickNav currentPage="aesthetics" onNavigate={onNavigate} theme={theme} />
        </div>
      </div>

      <ScrollToTopButton visible={showScrollTop} onClick={scrollToTop} />
    </>
  );
}
