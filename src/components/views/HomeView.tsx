import type { RefObject } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import type { PageType, ThemeMode } from '../../types';
import SocialLinks from '../common/SocialLinks';
import ThemeToggle from '../common/ThemeToggle';

interface HomeViewProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onNavigate: (page: PageType) => void;
  section2Ref: RefObject<HTMLElement | null>;
}

export default function HomeView({
  theme,
  onToggleTheme,
  onNavigate,
  section2Ref
}: HomeViewProps) {
  const scrollToHome = () => {
    const scrollContainer = document.querySelector('.scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* SECTION 1: HOME PAGE (Always Dark Cinematic Theme) */}
      <section className="scroll-section">
        {/* Left Side Socials Vertical */}
        <SocialLinks variant="vertical" />

        {/* Right Scroll Vertical */}
        <div className="right-scroll-vertical">Scroll Down</div>

        {/* Section 1 Background */}
        <div className="portfolio-bg">
          {/* Giant background text: NADUN */}
          <motion.div
            className="bg-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          >
            NADUN
          </motion.div>
        </div>

        {/* Section 1 Content */}
        <div className="portfolio-container">
          {/* Top Header */}
          <motion.div
            className="top-section"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          >
            <div className="brand-subtitle">Software Engineer | Designer</div>
          </motion.div>

          {/* Hero Section */}
          <div className="hero-section">
            <div className="fg-text-container">
              {/* White Text: PRAMUDITHA */}
              <motion.h1
                className="fg-text"
                initial={{ opacity: 0, y: 40, scaleY: 1.4 }}
                animate={{ opacity: 1, y: 0, scaleY: 1.75 }}
                transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                PRAMUDITHA
              </motion.h1>
              <motion.button
                type="button"
                className="home-about-cta-btn"
                onClick={() => onNavigate('about')}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              >
                <span className="cta-dot" aria-hidden="true"></span>
                <span>What's wrong with me?</span>
                <span className="cta-arrow" aria-hidden="true">
                  ›
                </span>
              </motion.button>
            </div>
          </div>

          {/* Bottom Section */}
          <motion.div
            className="bottom-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          >
            {/* Mobile Scroll Down Prompt */}
            <div className="mobile-scroll-down-prompt">
              <span>Scroll Down</span>
              <Icon icon="mdi:chevron-down" className="bouncing-arrow" />
            </div>

            <p className="description-text">
              PRAMUDITHA NADUN IS A SOFTWARE ENGINEER &amp; DESIGNER WITH A PASSION FOR CREATING
              WEB APPLICATIONS. EXPERIENCED IN BOTH FRONT-END AND BACK-END DEVELOPMENT, ALWAYS EAGER
              TO MASTER NEW SYSTEMS, COLLABORATE WITH CROSS-FUNCTIONAL TEAMS, AND ARCHITECT
              MEANINGFUL DIGITAL SOLUTIONS.
            </p>

            <SocialLinks variant="footer" />
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: PORTALS (Horizontal Split Screen Layout) */}
      <section
        ref={section2Ref as RefObject<HTMLDivElement>}
        className={`scroll-section split-scroll-section ${theme}-theme`}
      >
        {/* Section 2 Background */}
        <div className="portfolio-bg" />

        {/* Scroll back to Home link */}
        <div className="home-guide-link" onClick={scrollToHome} title="Scroll to Top">
          <Icon icon="mdi:chevron-up" className="home-guide-icon" />
          <span className="home-guide-text">SCROLL TO TOP</span>
        </div>

        {/* Floating theme toggle button */}
        <ThemeToggle theme={theme} onToggle={onToggleTheme} variant="floating" />

        {/* Top Half: Logic & Systems */}
        <div className="split-half top-half" onClick={() => onNavigate('logic')}>
          {/* Ambient Code Lines Stream for Logic Portal */}
          <div className="split-bg-code-watermark" aria-hidden="true">
            <div className="code-column left-code">
              <pre>
{`01  import { State, Engine, Architecture } from '@pramuditha/core';
02  import { DistributedLedger, Consensus } from '@fintech/systems';
03  
04  export class FintechPipeline<T extends Transaction> {
05    private readonly queue: AsyncQueue<T>;
06    public async processBatch(batch: T[]): Promise<Report> {
07      return await this.queue.map(batch, async (tx) => {
08        return await DistributedLedger.atomicCommit(tx.stateHash);
09      });
10    }
11  }`}
              </pre>
            </div>
            <div className="code-column right-code">
              <pre>
{`12  // Reactive State & Neural Kernel Pipeline
13  const renderLoop = (timestamp: number) => {
14    gl.uniform1f(uTimeLocation, timestamp * 0.001);
15    simulation.step(deltaTime);
16    particles.updateBuffers(simulation.getPositions());
17    requestAnimationFrame(renderLoop);
18  };`}
              </pre>
            </div>
          </div>

          <div className="split-title-wrapper">
            <motion.h2
              className="split-half-title"
              initial={{ opacity: 0, y: -40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="title-line line-1">Logic &amp; </span>
              <span className="title-line line-2">Systems</span>
            </motion.h2>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="arrow-indicator"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </div>
        </div>

        {/* Bottom Half: Aesthetics & Motion */}
        <div className="split-half bottom-half" onClick={() => onNavigate('aesthetics')}>
          {/* Ambient Cinematography & Motion Telemetry for Aesthetics Portal */}
          <div className="split-bg-telemetry-watermark" aria-hidden="true">
            <div className="telemetry-column left-telemetry">
              <pre>
{`[CAM_REC: 01:24:18:09] // 24.000 FPS // 4K DCI
ISO 800 // 5600K // SHUTTER 180.0° // T2.8
COLOR: ACEScg -> Rec.709 // ARRI_LogC3_FilmPrint
bezier_curve: cubic-bezier(0.16, 1, 0.3, 1)
KEYFRAME_DATA: [scale: 1.00 -> 1.08, blur: 0.50]`}
              </pre>
            </div>
            <div className="telemetry-column right-telemetry">
              <pre>
{`RENDER_ENGINE: ACES D65 // BIT_DEPTH: 32-bit Float
VFX_GRAPH: [INPUT_RAW] -> [OPTICAL_GLOW] -> [ACES_TONEMAP]
AUDIO_MASTER: 48.000 kHz // 24-bit PCM // -14.0 LKFS`}
              </pre>
            </div>
          </div>

          <div className="split-title-wrapper">
            <motion.h2
              className="split-half-title"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="title-line line-1">Aesthetics </span>
              <span className="title-line line-2">&amp; Motion</span>
            </motion.h2>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="arrow-indicator"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </div>
        </div>
      </section>
    </>
  );
}
