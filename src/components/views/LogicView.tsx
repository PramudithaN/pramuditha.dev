import { useRef, useState, useCallback, type RefObject } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, type Variants } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Palette, Mountain, Clapperboard, ChevronRight } from 'lucide-react';
import type { PageType, ThemeMode, PortfolioContent } from '../../types';
import SubpageHeader from '../common/SubpageHeader';
import SubpageQuickNav from '../common/SubpageQuickNav';
import ScrollToTopButton from '../common/ScrollToTopButton';

import TestimonialCard from '../common/TestimonialCard';
import TimelineItem from '../common/TimelineItem';
import GitHubContributionGraph from '../common/GitHubContributionGraph';
import { ProjectsShowcase } from '../projects';
import { skillsList } from '../../constants/skills';
import { beyondCodeData } from '../../constants/beyondCode';
import { EXTERNAL_LINKS } from '../../constants/links';
import { useScrollTop } from '../../hooks/useScrollTop';


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

const heroCardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.75, delay: 0.28, ease: [0.16, 1, 0.3, 1] }
  }
};

const workGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.38
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

const skillsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1
    }
  }
};

const skillPillVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
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

const sectionItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
  }
};

interface LogicViewProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onNavigate: (page: PageType) => void;
  portfolioContent: PortfolioContent;
  subpageRef: RefObject<HTMLDivElement | null>;
}

export default function LogicView({
  theme,
  onToggleTheme,
  onNavigate,
  portfolioContent,
  subpageRef
}: LogicViewProps) {
  const devStartYear = 2022;
  const experienceYears = Math.max(1, new Date().getFullYear() - devStartYear);

  const { showScrollTop, scrollToTop } = useScrollTop('logic', subpageRef);

  const visibleLogicExperience = portfolioContent.logicExperience.filter((e) => !e.hidden);

  const [activeStep, setActiveStep] = useState(0);
  const mobileTimelineRef = useRef<HTMLDivElement>(null);
  const desktopSwipeStartX = useRef<number | null>(null);

  const totalExperience = visibleLogicExperience.length;
  const railProgressPercent = totalExperience > 1 ? (activeStep / (totalExperience - 1)) * 100 : 100;

  const { scrollYProgress: mobileTimelineProgress } = useScroll({
    container: subpageRef as RefObject<HTMLElement>,
    target: mobileTimelineRef,
    offset: ['start 85%', 'end 35%']
  });

  const smoothMobileTimelineProgress = useSpring(mobileTimelineProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001
  });

  const mobileTimelineBeamHeight = useTransform(smoothMobileTimelineProgress, [0, 1], ['0%', '100%']);
  const mobileTracerOpacity = useTransform(smoothMobileTimelineProgress, [0, 0.03, 0.98, 1], [0, 1, 1, 0.8]);

  const jumpToMobileMilestone = useCallback((idx: number) => {
    const el = document.getElementById(`logic-mobile-milestone-${idx}`);
    if (el && subpageRef.current) {
      const container = subpageRef.current;
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const targetScroll = container.scrollTop + (elRect.top - containerRect.top) - 75;
      container.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }, [subpageRef]);

  const jumpToStep = useCallback((idx: number) => {
    setActiveStep(Math.max(0, Math.min(totalExperience - 1, idx)));
  }, [totalExperience]);

  const currentExp = visibleLogicExperience[activeStep] || visibleLogicExperience[0];

  const renderBeyondIcon = (iconName: string) => {
    switch (iconName) {
      case 'palette':
        return <Palette className="beyond-icon" />;
      case 'mountain':
        return <Mountain className="beyond-icon" />;
      case 'clapperboard':
        return <Clapperboard className="beyond-icon" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div
        ref={subpageRef as RefObject<HTMLDivElement>}
        className={`subpage-container logic-subpage ${theme}-theme`}
      >
        <div className="subpage-scroll-content">
          {/* Subpage Background Watermarks & Ambient Code Stream */}
          <div className="subpage-bg-watermark right-watermark">
            <span>PRAMUDITH NADUN | DEVELOPER</span>
          </div>

          <div className="logic-bg-code-watermark" aria-hidden="true">
            <div className="code-column left-code">
              <pre>
{`01  import { State, Engine, Architecture } from '@pramuditha/core';
02  import { DistributedLedger, Consensus } from '@fintech/systems';
03  
04  interface SystemConfig<T> {
05    clusterId: string;
06    nodes: Array<Node<T>>;
07    throughput: RateLimit;
08    latencyTargetMs: number;
09    faultTolerance: 'Byzantine' | 'Raft';
10  }
11  
12  export class FintechPipeline<T extends Transaction> implements Pipeline {
13    private readonly queue: AsyncQueue<T>;
14    private readonly metrics: TelemetryCollector;
15  
16    constructor(private readonly config: SystemConfig<T>) {
17      this.queue = new AsyncQueue({ concurrency: 64 });
18      this.metrics = new TelemetryCollector('fintech-core');
19    }
20  
21    public async processBatch(batch: T[]): Promise<ExecutionReport> {
22      const trace = this.metrics.startSpan('processBatch');
23      return await this.queue.map(batch, async (tx) => {
24        const verified = await Consensus.verifySignature(tx.payload);
25        if (!verified) throw new InvalidSignatureError(tx.id);
26        return await this.persistState(tx);
27      });
28    }
29  
30    private async persistState(tx: T): Promise<CommitResult> {
31      return DistributedLedger.atomicCommit(tx.stateHash);
32    }
33  }`}
              </pre>
            </div>
            <div className="code-column right-code">
              <pre>
{`34  // Reactive State & Neural Core Pipeline
35  const renderLoop = (timestamp: DOMHighResTimeStamp) => {
36    const deltaTime = Math.min((timestamp - lastFrame) / 1000, 0.1);
37    gl.uniform1f(uTimeLocation, timestamp * 0.001);
38    gl.uniform2f(uResolutionLocation, canvas.width, canvas.height);
39    
40    simulation.step(deltaTime);
41    particles.updateBuffers(simulation.getPositions());
42    
43    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, particleCount);
44    requestAnimationFrame(renderLoop);
45  };
46  
47  export const useKernelStream = <T,>(stream: Observable<T>) => {
48    const [buffer, setBuffer] = useState<T[]>([]);
49    useEffect(() => {
50      const sub = stream.pipe(debounceTime(16)).subscribe((chunk) => {
51        setBuffer((prev) => [...prev.slice(-128), chunk]);
52      });
53      return () => sub.unsubscribe();
54    }, [stream]);
55    return buffer;
56  };`}
              </pre>
            </div>
          </div>

          {/* Subpage Header */}
          <SubpageHeader
            theme={theme}
            onToggleTheme={onToggleTheme}
            onNavigateHome={() => onNavigate('home')}
            onBack={() => onNavigate('home')}
            currentPage="logic"
            onNavigate={onNavigate}
          />

          {/* Subpage Intro */}
          <motion.h1 className="subpage-title" variants={titleVariants} initial="hidden" animate="visible">Logic &amp; Systems</motion.h1>
          <motion.p className="subpage-subtitle" variants={subtitleVariants} initial="hidden" animate="visible">Systems Architecture &amp; Interactive Code</motion.p>

          {/* Dynamic Experience & Interactive CV Card */}
          <motion.div className="logic-experience-card" variants={heroCardVariants} initial="hidden" animate="visible">

            <div className="logic-card-topbar">
              <div className="logic-exp-pill">
                <span className="badge-pulse-dot"></span>
                <span>{experienceYears}+ Years Exp · Web Dev</span>
              </div>
              <a
                href={EXTERNAL_LINKS.INTERACTIVE_CV}
                target="_blank"
                rel="noopener noreferrer"
                className="logic-cv-pill-btn"
                title="Open Pramuditha's Interactive CV"
              >
                <Icon icon="mdi:file-document-outline" width="15" height="15" />
                <span>Interactive CV</span>
                <span className="cv-arrow">↗</span>
              </a>
            </div>

            <h3 className="logic-card-headline">Full-Stack &amp; Enterprise Systems</h3>

            <p className="logic-card-desc">
              {experienceYears}+ years of web development experience architecting scalable
              enterprise platforms, interactive frontend architectures, and high-performance
              full-stack applications.
            </p>

            <div className="logic-card-tags">
              <span className="logic-stat-tag">React / Next.js</span>
              <span className="logic-stat-tag">TypeScript</span>
              <span className="logic-stat-tag">Spring Boot</span>
              <span className="logic-stat-tag">CI/CD Deployments</span>
              <span className="logic-stat-tag telemetry-stat-pill">100% STRICT TYPED</span>
              <span className="logic-stat-tag telemetry-stat-pill">EDGE LATENCY &lt;12ms</span>
            </div>
          </motion.div>

          {/* Work Grid */}
          <motion.div
            className="work-grid"
            variants={workGridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <motion.div className="work-card" variants={workCardVariants} whileHover={{ y: -6 }}>
              <div>
                <div className="work-item-meta-row">
                  <span className="work-item-meta">01 / ASSOCIATE SOFTWARE ENGINEER</span>
                  <span className="work-status-badge">[ENTERPRISE PROD]</span>
                </div>
                <h3 className="work-item-title">Enterprise Web Apps</h3>
                <p className="work-item-desc">
                  Architecting and optimizing modern web platforms with React, TypeScript, and
                  Redux, managing CI/CD deployments and user access control at LOLC Technologies.
                </p>
              </div>
              <span className="work-item-tag">React / Redux</span>
            </motion.div>

            <motion.div className="work-card" variants={workCardVariants} whileHover={{ y: -6 }}>
              <div>
                <div className="work-item-meta-row">
                  <span className="work-item-meta">02 / TRAINEE SOFTWARE ENGINEER</span>
                  <span className="work-status-badge">[UI/UX &amp; SYSTEMS]</span>
                </div>
                <h3 className="work-item-title">UI/UX &amp; Systems</h3>
                <p className="work-item-desc">
                  Designing interactive frontend components in Figma and building database reporting
                  features with Java, Oracle Forms, and Jasper Reports.
                </p>
              </div>
              <span className="work-item-tag">Figma / Java</span>
            </motion.div>

            <motion.div className="work-card" variants={workCardVariants} whileHover={{ y: -6 }}>
              <div>
                <div className="work-item-meta-row">
                  <span className="work-item-meta">03 / FREELANCE DEVELOPMENT</span>
                  <span className="work-status-badge">[GLOBAL CLIENTS]</span>
                </div>
                <h3 className="work-item-title">Fullstack Solutions</h3>
                <p className="work-item-desc">
                  Delivering high-performance, custom mobile-first applications using React,
                  Next.js, Node.js, and Spring Boot for diverse global clients.
                </p>
              </div>
              <span className="work-item-tag">Next.js / Spring Boot</span>
            </motion.div>
          </motion.div>

          {/* Skills & Technologies Data */}
          <div className="section-divider" />
          <div className="skills-badge-header-wrapper">
            <span className="skills-badge-header">Skills</span>
          </div>
          <p className="skills-subtitle">The skills, tools and technologies I am really good at:</p>
          <motion.div
            className="skills-gallery"
            variants={skillsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {skillsList.map((skill) => (
              <motion.div key={skill.text} className="skills-gallery-item" variants={skillPillVariants}>
                <Icon icon={skill.logo} className="skills-gallery-icon" />
                <span className="skills-gallery-text">{skill.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Experience Tree (Desktop Showcase & Mobile Stream) */}
          <div className="section-divider" />
          <div className="journey-desktop-showcase">
            <div className="journey-desktop-frame">
              <div className="journey-sticky-header">
                <div className="journey-header-block">
                  <h2 className="section-title">Developer Journey</h2>
                  <p className="journey-subtitle">
                    {experienceYears}+ Years of Full-Stack Web Development &amp; Systems Engineering
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
                      {currentExp ? currentExp.company : 'Engineering'}
                    </span>
                  </div>


                </div>


              </div>

              {/* Main Stage: Left Rail & Right Spotlight Card */}
              <div className="journey-stage">
                <div className="journey-rail">
                  <div className="journey-rail-track-bg" />
                  <motion.div
                    className="journey-rail-track-fill"
                    animate={{ height: `${railProgressPercent}%` }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {visibleLogicExperience.map((exp, idx) => {
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
                  <div
                    className="journey-spotlight-inner"
                    onPointerDown={(e) => { desktopSwipeStartX.current = e.clientX; }}
                    onPointerUp={(e) => {
                      if (desktopSwipeStartX.current !== null) {
                        const diff = e.clientX - desktopSwipeStartX.current;
                        if (diff < -50) jumpToStep((activeStep + 1) % totalExperience);
                        else if (diff > 50 && activeStep > 0) jumpToStep(activeStep - 1);
                        desktopSwipeStartX.current = null;
                      }
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {currentExp && (
                        <motion.div
                          key={currentExp.id || activeStep}
                          className="journey-spotlight-card"
                          initial={{ opacity: 0, y: 20, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -16, scale: 0.98 }}
                          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <TimelineItem
                            duration={currentExp.duration}
                            title={currentExp.title}
                            company={currentExp.company}
                            role={currentExp.role}
                            accomplishments={currentExp.accomplishments}
                            tech={currentExp.tech}
                            index={activeStep}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </div>

                {/* Next Move Circle Button - Centered to Stage */}
                {totalExperience > 1 && (
                  <div className="journey-stage-action">
                    <button
                      type="button"
                      className="journey-card-next-circle-btn"
                      onClick={() => jumpToStep((activeStep + 1) % totalExperience)}
                      aria-label={activeStep < totalExperience - 1 ? `Next: Phase 0${activeStep + 2}` : 'Back to Phase 01'}
                      title={activeStep < totalExperience - 1 ? `Next: Phase 0${activeStep + 2}` : 'Back to Phase 01'}
                    >
                      <ChevronRight size={22} strokeWidth={2.4} className="card-chevron-icon" />
                    </button>
                  </div>
                )}
              </div>

              {/* Guidance Hint */}
              <div className="journey-sticky-hint" aria-live="polite">
                <span className="hint-milestone-nav">
                  Select a milestone or use arrows to explore • Scroll down to continue
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Experience Timeline (max-width: 768px) */}
          <div className="journey-mobile-section">
            <div className="journey-header-block">
              <h2 className="section-title">Developer Journey</h2>
              <p className="journey-subtitle">
                {experienceYears}+ Years of Full-Stack Web Development &amp; Systems Engineering
              </p>
            </div>

            {/* Quick Navigation Chips */}
            {totalExperience > 1 && (
              <div className="journey-mobile-chips" aria-label="Jump to milestone">
                {visibleLogicExperience.map((exp, idx) => (
                  <button
                    key={exp.id || idx}
                    type="button"
                    className="journey-mobile-chip"
                    onClick={() => jumpToMobileMilestone(idx)}
                  >
                    <span className="chip-phase">PHASE 0{idx + 1}</span>
                    <span className="chip-company">{exp.company}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="timeline-container" ref={mobileTimelineRef}>
              {/* Scroll-Driven Laser Progress Track */}
              <motion.div
                className="timeline-laser-track"
                style={{ height: mobileTimelineBeamHeight }}
              >
                <motion.div
                  className="timeline-tracer-head"
                  style={{ opacity: mobileTracerOpacity }}
                >
                  <span className="tracer-core" />
                  <span className="tracer-ring" />
                </motion.div>
              </motion.div>

              {visibleLogicExperience.map((exp, index) => (
                <div key={exp.id || index} id={`logic-mobile-milestone-${index}`}>
                  <TimelineItem
                    duration={exp.duration}
                    title={exp.title}
                    company={exp.company}
                    role={exp.role}
                    accomplishments={exp.accomplishments}
                    tech={exp.tech}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* GitHub Commit & Activity Graph */}
          <div className="section-divider" />
          <h2 className="section-title">GitHub Activity</h2>
          <p className="skills-subtitle">Open-source contributions and commit frequency:</p>
          <GitHubContributionGraph theme={theme} />

          {/* Projects & Systems Showcase */}
          <div className="section-divider" />
          <ProjectsShowcase portfolioContent={portfolioContent} />

          {/* Beyond the Code Section */}
          <div className="section-divider" />
          <h2 className="section-title">Beyond the Code</h2>
          <motion.div className="beyond-grid" variants={staggeredSectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
            {beyondCodeData.map((item, index) => {
              const isClickable = Boolean(item.link);
              return (
                <motion.div
                  key={index}
                  className={`beyond-card${isClickable ? ' interactive' : ''}`}
                  variants={sectionItemVariants}
                  whileHover={isClickable ? { y: -4 } : undefined}
                  onClick={isClickable && item.link ? () => onNavigate(item.link!) : undefined}
                  role={isClickable ? 'button' : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  onKeyDown={
                    isClickable && item.link
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            onNavigate(item.link!);
                          }
                        }
                      : undefined
                  }
                  title={isClickable ? 'View in Aesthetics & Motion' : undefined}
                >
                  <div className="beyond-card-header">
                    {renderBeyondIcon(item.icon)}
                    <h3 className="beyond-card-title">{item.title}</h3>
                    {isClickable && <span className="beyond-card-arrow">↗</span>}
                  </div>
                  <p className="beyond-card-desc">{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Testimonials Section */}
          <div className="section-divider" />
          <h2 className="section-title">Testimonials</h2>
          <motion.div
            className="testimonials-grid"
            variants={staggeredSectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {portfolioContent.logicTestimonials.map((t, index) => (
              <motion.div key={t.id || index} variants={sectionItemVariants}>
                <TestimonialCard
                  key={t.id || index}
                  name={t.name}
                  role={t.role}
                  avatarUrl={t.avatarUrl}
                  text={t.text}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Navigation to Other Sections */}
          <SubpageQuickNav currentPage="logic" onNavigate={onNavigate} theme={theme} />
        </div>
      </div>

      <ScrollToTopButton visible={showScrollTop} onClick={scrollToTop} />
    </>
  );
}
