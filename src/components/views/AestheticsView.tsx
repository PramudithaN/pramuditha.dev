import { useRef, useState, useCallback, type RefObject } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValueEvent, type Variants } from 'framer-motion';
import type { PageType, ThemeMode, PortfolioContent } from '../../types';
import SubpageHeader from '../common/SubpageHeader';
import SubpageQuickNav from '../common/SubpageQuickNav';
import ScrollToTopButton from '../common/ScrollToTopButton';
import TestimonialCard from '../common/TestimonialCard';
import TimelineItem from '../common/TimelineItem';
import VideoShowcase from '../showcase/VideoShowcase';
import { useScrollTop } from '../../hooks/useScrollTop';


const hudBarVariants: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }
  }
};

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }
  }
};

const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }
  }
};

const workGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15
    }
  }
};

const staggeredSectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.12
    }
  }
};

const workCardVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }
};



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

  const creativeStartYear = 2020;
  const creativeYears = Math.max(1, new Date().getFullYear() - creativeStartYear);

  const visibleAestheticsExperience = portfolioContent.aestheticsExperience.filter(
    (e) => !e.hidden
  );

  const [activeStep, setActiveStep] = useState(0);
  const [scrollProgressPercent, setScrollProgressPercent] = useState(0);
  const pinnedWrapperRef = useRef<HTMLDivElement>(null);

  const totalExperience = visibleAestheticsExperience.length;

  const { scrollYProgress } = useScroll({
    container: subpageRef as RefObject<HTMLElement>,
    target: pinnedWrapperRef,
    offset: ['start start', 'end end']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001
  });

  const progressBarWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%']);
  const railProgressHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setScrollProgressPercent(Math.round(latest * 100));
    if (totalExperience <= 1) return;
    const stepRatio = 0.98 / totalExperience;
    const computedStep = Math.min(
      Math.floor(latest / stepRatio),
      totalExperience - 1
    );
    setActiveStep(computedStep);
  });

  const jumpToStep = useCallback((idx: number) => {
    setActiveStep(idx);
    if (!pinnedWrapperRef.current || !subpageRef.current) return;
    const container = subpageRef.current;
    const wrapper = pinnedWrapperRef.current;
    const currentScroll = container.scrollTop;
    const wrapperRect = wrapper.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const absoluteWrapperTop = currentScroll + (wrapperRect.top - containerRect.top);
    const scrollableDistance = wrapper.offsetHeight - container.clientHeight;
    if (scrollableDistance <= 0 || totalExperience <= 1) return;
    const targetScroll = absoluteWrapperTop + (idx / (totalExperience - 1)) * scrollableDistance;
    container.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }, [totalExperience, subpageRef]);

  const currentExp = visibleAestheticsExperience[activeStep] || visibleAestheticsExperience[0];

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

          {/* Cinematography & Motion Viewfinder HUD Bar (Inspired by F1 Telemetry) */}
          <motion.div className="aesthetics-viewfinder-hud-bar" aria-label="Cinematography and Motion Telemetry" variants={hudBarVariants} initial="hidden" animate="visible">
            <div className="viewfinder-bar-left">
              <span className="viewfinder-rec-dot" aria-hidden="true" />
              <span className="viewfinder-mono-tag">CAM_REC: 01:24:18:09</span>
              <span className="viewfinder-divider">//</span>
              <span className="viewfinder-mono-tag">FPS: 24.000 // 4K DCI</span>
              <span className="viewfinder-divider">//</span>
              <span className="viewfinder-mono-tag">SHUTTER: 180.0°</span>
            </div>
            <div className="viewfinder-bar-right">
              <span className="viewfinder-mono-tag">COLOR: ACEScg &gt; Rec.709</span>
              <span className="viewfinder-divider">//</span>
              <span className="viewfinder-mono-metric">STAGE: P3 WIDE GAMUT</span>
            </div>
          </motion.div>

          {/* Subpage Intro */}
          <motion.h1 className="subpage-title" variants={titleVariants} initial="hidden" animate="visible">Aesthetics &amp; Motion</motion.h1>
          <motion.p className="subpage-subtitle" variants={subtitleVariants} initial="hidden" animate="visible">Graphic Design &amp; Cinematography</motion.p>

          {/* Video Showcase: Graphic Design / Video Editing reels */}
          <VideoShowcase reels={portfolioContent.videoReels} />

          {/* Creative Experience Tree (Pinned Sticky Reveal) */}
          <div className="section-divider" />
          <div
            className="journey-pinned-wrapper"
            ref={pinnedWrapperRef}
            style={{ height: `${Math.max(180, totalExperience * 90)}vh` }}
          >
            <div className="journey-sticky-frame">
              <div className="journey-sticky-header">
                <div className="journey-header-block">
                  <h2 className="section-title">Creative Journey</h2>
                  <p className="journey-subtitle">
                    {creativeYears}+ Years of Graphic Design, Visual Identity &amp; Motion Direction
                  </p>
                </div>

                {/* HUD Telemetry Scrubber Bar */}
                <div className="journey-hud-bar">
                  <div className="journey-hud-pill">
                    <span className="hud-phase-label">
                      PHASE 0{activeStep + 1} // 0{totalExperience}
                    </span>
                    <span className="hud-divider">|</span>
                    <span className="hud-company-label">
                      {currentExp ? currentExp.company : 'Creative Direction'}
                    </span>
                  </div>

                  <div className="journey-hud-actions">
                    <button
                      type="button"
                      className="journey-nav-btn prev"
                      onClick={() => jumpToStep(Math.max(0, activeStep - 1))}
                      disabled={activeStep === 0}
                      aria-label="Previous milestone"
                      title="Previous milestone"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      className="journey-nav-btn next"
                      onClick={() => jumpToStep(Math.min(totalExperience - 1, activeStep + 1))}
                      disabled={activeStep === totalExperience - 1}
                      aria-label="Next milestone"
                      title="Next milestone"
                    >
                      →
                    </button>
                    <span className="hud-percent-text">
                      {scrollProgressPercent}%
                    </span>
                  </div>
                </div>

                <div className="journey-progress-track">
                  <motion.div
                    className="journey-progress-fill"
                    style={{ width: progressBarWidth }}
                  />
                </div>
              </div>

              {/* Main Stage: Left Rail & Right Spotlight Card */}
              <div className="journey-stage">
                <div className="journey-rail">
                  <div className="journey-rail-track-bg" />
                  <motion.div
                    className="journey-rail-track-fill"
                    style={{ height: railProgressHeight }}
                  />

                  {visibleAestheticsExperience.map((exp, idx) => {
                    const isCurrent = idx === activeStep;
                    const isPassed = idx < activeStep;
                    return (
                      <button
                        key={exp.id || idx}
                        type="button"
                        className={`journey-rail-node${isCurrent ? ' active' : ''}${isPassed ? ' passed' : ''}`}
                        onClick={() => jumpToStep(idx)}
                        aria-label={`Jump to Phase ${idx + 1}: ${exp.title} at ${exp.company}`}
                      >
                        <div className="rail-node-dot-wrap">
                          <span className="rail-node-dot" />
                          {isCurrent && <span className="rail-node-pulse" />}
                        </div>
                        <div className="rail-node-text">
                          <span className="rail-node-phase">PHASE 0{idx + 1}</span>
                          <b className="rail-node-company">{exp.company}</b>
                          <span className="rail-node-role">{exp.title}</span>
                          <small className="rail-node-duration">{exp.duration}</small>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Spotlight Card */}
                <div className="journey-spotlight-area">
                  <AnimatePresence mode="wait">
                    {currentExp && (
                      <motion.div
                        key={currentExp.id || activeStep}
                        className="journey-spotlight-card"
                        initial={{ opacity: 0, y: 28, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -22, scale: 0.98 }}
                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <TimelineItem
                          duration={currentExp.duration}
                          title={currentExp.title}
                          company={currentExp.company}
                          role={currentExp.role}
                          accomplishments={currentExp.accomplishments}
                          index={activeStep}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Sticky Guidance Indicator */}
              {activeStep < totalExperience - 1 && (
                <div className="journey-sticky-hint" aria-live="polite">
                  <span className="hint-scroll-next">
                    ↓ SCROLL TO REVEAL NEXT MILESTONE (PHASE 0{activeStep + 2})
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="section-divider" />
          <h2 className="section-title">Client Feedback</h2>
          <motion.div
            className="testimonials-grid"
            variants={staggeredSectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {portfolioContent.aestheticsTestimonials.map((testimonial, idx) => (
              <TestimonialCard
                key={testimonial.id || idx}
                name={testimonial.name}
                role={testimonial.role}
                avatarUrl={testimonial.avatarUrl}
                text={testimonial.text}
              />
            ))}
          </motion.div>

          <div className="section-divider" />
          {/* Work Grid */}
          <motion.div className="work-grid" variants={workGridVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
            <motion.div className="work-card" variants={workCardVariants} whileHover={{ y: -6 }}>
              <div>
                <div className="work-item-meta-row">
                  <span className="work-item-meta">01 / Brand Identity</span>
                  <span className="work-status-badge">[BRAND DIRECTION]</span>
                </div>
                <h3 className="work-item-title">Typographic Layouts</h3>
                <p className="work-item-desc">
                  Shaping minimalist design frameworks, poster schemes, custom type identities, and
                  vector palettes for brands.
                </p>
              </div>
              <span className="work-item-tag">Figma / Adobe</span>
            </motion.div>

            <motion.div className="work-card" variants={workCardVariants} whileHover={{ y: -6 }}>
              <div>
                <div className="work-item-meta-row">
                  <span className="work-item-meta">02 / Video Production</span>
                  <span className="work-status-badge">[CINEMATIC REELS]</span>
                </div>
                <h3 className="work-item-title">Cinematic Motion Reels</h3>
                <p className="work-item-desc">
                  Editing editorial promos, typography animations, and color grading reels to present
                  dynamic products.
                </p>
              </div>
              <span className="work-item-tag">Premiere / After Effects</span>
            </motion.div>

            <motion.div className="work-card" variants={workCardVariants} whileHover={{ y: -6 }}>
              <div>
                <div className="work-item-meta-row">
                  <span className="work-item-meta">03 / Visual Systems</span>
                  <span className="work-status-badge">[GENERATIVE / 3D]</span>
                </div>
                <h3 className="work-item-title">Interactive Art Canvas</h3>
                <p className="work-item-desc">
                  Generating procedural patterns, 3D abstract compositions, and loop animations
                  that blur art with code.
                </p>
              </div>
              <span className="work-item-tag">Generative / 3D</span>
            </motion.div>
          </motion.div>

          {/* Quick Navigation to Other Sections */}
          <SubpageQuickNav currentPage="aesthetics" onNavigate={onNavigate} theme={theme} />
        </div>
      </div>

      <ScrollToTopButton visible={showScrollTop} onClick={scrollToTop} />
    </>
  );
}
