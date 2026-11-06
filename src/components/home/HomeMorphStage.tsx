import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Icon } from '@iconify/react';
import type { PageType, ThemeMode } from '../../types';
import SocialLinks from '../common/SocialLinks';
import ThemeToggle from '../common/ThemeToggle';
import MusicButton from '../common/MusicButton';
import SearchButton from '../common/SearchButton';
import { soundEngine } from '../../services/soundEngine';
import './home-morph.css';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// TUNABLE TIMELINE PARAMETERS
// ============================================================================
export const SCROLL_LENGTH_VH = 350;      // Scroll runway length
export const SCRUB_LAG = 0.65;            // Smooth scrub lag (seconds)
export const RED_GLOW_FADE_END = 0.32;    // Hero glow fade out
export const CHROME_OUT_END = 0.22;       // Hero UI chrome completely fades out
export const WIPE_START = 0.16;           // Split surface dissolve begins
export const WIPE_END = 0.65;             // Split surface dissolve completes
export const LINE_DRAW_START = 0.38;      // Divider line begins drawing
export const LINE_DRAW_END = 0.70;        // Divider line completes
export const CHROME_IN_START = 0.70;      // Split UI chrome begins fading in
export const CHROME_IN_END = 0.95;        // Split UI chrome completes

// Smoothstep cubic easing helper for natural mechanical deceleration
const smoothstep = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
};

// Dual-flap character sets (Authentic kerning without spacer gaps)
const TOP_OUTGOING_CHARS = ['P', 'R', 'A', 'M', 'U', 'D', 'I', 'T', 'H', 'A'];
const TOP_INCOMING_LINE1 = ['L', 'O', 'G', 'I', 'C', '\u00A0', '&'];
const TOP_INCOMING_LINE2 = ['S', 'Y', 'S', 'T', 'E', 'M', 'S'];

const BOTTOM_OUTGOING_CHARS = ['N', 'A', 'D', 'U', 'N'];
const BOTTOM_INCOMING_LINE1 = ['A', 'E', 'S', 'T', 'H', 'E', 'T', 'I', 'C', 'S', '\u00A0', '&'];
const BOTTOM_INCOMING_LINE2 = ['M', 'O', 'T', 'I', 'O', 'N'];

export interface HomeMorphStageProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onNavigate: (page: PageType) => void;
  onOpenSearch?: () => void;
}

export default function HomeMorphStage({
  theme,
  onToggleTheme,
  onNavigate,
  onOpenSearch
}: HomeMorphStageProps) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Background and decor refs
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroGlowRef = useRef<HTMLDivElement>(null);
  const splitBgRef = useRef<HTMLDivElement>(null);
  const dividerLineRef = useRef<HTMLDivElement>(null);
  const watermarksRef = useRef<HTMLDivElement>(null);
  const crosshairsRef = useRef<HTMLDivElement>(null);

  // Chrome refs
  const chromeStateARef = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useRef<HTMLDivElement>(null);
  const chromeStateBRef = useRef<HTMLDivElement>(null);
  const themeToggleWrapRef = useRef<HTMLDivElement>(null);

  // Morph tracks refs
  const topTrackRef = useRef<HTMLDivElement>(null);
  const bottomTrackRef = useRef<HTMLDivElement>(null);
  const bottomOutTrackRef = useRef<HTMLDivElement>(null);

  // Portal hover state for interactive zoom and accent color at 100%
  const [hoveredPortal, setHoveredPortal] = useState<'top' | 'bottom' | null>(null);

  // Arrow indicator refs
  const topArrowRef = useRef<SVGSVGElement | null>(null);
  const bottomArrowRef = useRef<SVGSVGElement | null>(null);

  // Portal hit-zones refs
  const topHitZoneRef = useRef<HTMLDivElement>(null);
  const bottomHitZoneRef = useRef<HTMLDivElement>(null);

  // Character cell & flipper refs for dual departure flaps
  const topOutFlipperRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const topInFlipperRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const bottomOutFlipperRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const bottomInFlipperRefs = useRef<Array<HTMLSpanElement | null>>([]);

  // Lenis instance ref
  const lenisRef = useRef<Lenis | null>(null);

  const prefersReducedMotion = useMemo(() => {
    return typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
  }, []);

  const isInitiallySplit = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('progress') === '1' || window.location.hash.toLowerCase() === '#split';
  }, []);

  // Scroll to Top action handler
  const handleScrollToTop = useCallback(() => {
    soundEngine.playClickSound();
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.4 });
    } else {
      const scrollContainer = document.querySelector<HTMLElement>('.scroll-container');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, []);

  // Smooth 3D dual-board departure flap updater with motion blur and smoothstep easing
  const updateDepartureFlaps = useCallback(
    (progress: number) => {
      // 1. Top Outgoing ("PRAMUDITHA"): Center-outward flap down (0deg -> 90deg)
      for (let i = 0; i < TOP_OUTGOING_CHARS.length; i++) {
        const flipper = topOutFlipperRefs.current[i];
        if (!flipper) continue;
        const dist = Math.abs(i - 4.5) / 4.5;
        const tStart = 0.18 + 0.14 * dist;
        const tEnd = tStart + 0.18;

        if (prefersReducedMotion) {
          flipper.style.opacity = progress >= tStart ? '0' : '1';
          continue;
        }

        if (progress <= tStart) {
          flipper.style.transform = 'rotateX(0deg)';
          flipper.style.opacity = '1';
          flipper.style.filter = 'none';
        } else if (progress >= tEnd) {
          flipper.style.transform = 'rotateX(90deg)';
          flipper.style.opacity = '0';
          flipper.style.filter = 'none';
        } else {
          const pLocal = (progress - tStart) / (tEnd - tStart);
          const pEased = smoothstep(pLocal);
          const blur = Math.sin(pLocal * Math.PI) * 2.2;
          flipper.style.transform = `rotateX(${pEased * 90}deg)`;
          flipper.style.opacity = `${1 - pEased}`;
          flipper.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : 'none';
        }
      }

      // 2. Top Incoming ("LOGIC & SYSTEMS"): Center-outward flap down (-90deg -> 0deg)
      const totalTopIn = TOP_INCOMING_LINE1.length + TOP_INCOMING_LINE2.length;
      for (let j = 0; j < totalTopIn; j++) {
        const flipper = topInFlipperRefs.current[j];
        if (!flipper) continue;
        const mid = (totalTopIn - 1) / 2;
        const dist = Math.abs(j - mid) / mid;
        const tStart = 0.22 + 0.14 * dist;
        const tEnd = tStart + 0.18;

        if (prefersReducedMotion) {
          flipper.style.opacity = progress >= tEnd ? '1' : '0';
          continue;
        }

        if (progress <= tStart) {
          flipper.style.transform = 'rotateX(-90deg)';
          flipper.style.opacity = '0';
          flipper.style.filter = 'none';
        } else if (progress >= tEnd) {
          flipper.style.transform = 'rotateX(0deg)';
          flipper.style.opacity = '1';
          flipper.style.filter = 'none';
        } else {
          const pLocal = (progress - tStart) / (tEnd - tStart);
          const pEased = smoothstep(pLocal);
          const blur = Math.sin(pLocal * Math.PI) * 2.2;
          flipper.style.transform = `rotateX(${-90 + pEased * 90}deg)`;
          flipper.style.opacity = `${pEased}`;
          flipper.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : 'none';
        }
      }

      // 3. Bottom Outgoing ("NADUN"): Left-to-right flap down (0deg -> 90deg)
      for (let i = 0; i < BOTTOM_OUTGOING_CHARS.length; i++) {
        const flipper = bottomOutFlipperRefs.current[i];
        if (!flipper) continue;
        const tStart = 0.18 + i * 0.04;
        const tEnd = tStart + 0.18;

        if (prefersReducedMotion) {
          flipper.style.opacity = progress >= tStart ? '0' : '0.55';
          continue;
        }

        if (progress <= tStart) {
          flipper.style.transform = 'rotateX(0deg)';
          flipper.style.opacity = '1';
          flipper.style.filter = 'none';
        } else if (progress >= tEnd) {
          flipper.style.transform = 'rotateX(90deg)';
          flipper.style.opacity = '0';
          flipper.style.filter = 'none';
        } else {
          const pLocal = (progress - tStart) / (tEnd - tStart);
          const pEased = smoothstep(pLocal);
          const blur = Math.sin(pLocal * Math.PI) * 2.2;
          flipper.style.transform = `rotateX(${pEased * 90}deg)`;
          flipper.style.opacity = `${1 - pEased}`;
          flipper.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : 'none';
        }
      }

      // 4. Bottom Incoming ("AESTHETICS & MOTION"): Left-to-right flap down (-90deg -> 0deg)
      const totalBottomIn = BOTTOM_INCOMING_LINE1.length + BOTTOM_INCOMING_LINE2.length;
      for (let j = 0; j < totalBottomIn; j++) {
        const flipper = bottomInFlipperRefs.current[j];
        if (!flipper) continue;
        const tStart = 0.22 + (j / (totalBottomIn - 1)) * 0.18;
        const tEnd = tStart + 0.18;

        if (prefersReducedMotion) {
          flipper.style.opacity = progress >= tEnd ? '1' : '0';
          continue;
        }

        if (progress <= tStart) {
          flipper.style.transform = 'rotateX(-90deg)';
          flipper.style.opacity = '0';
          flipper.style.filter = 'none';
        } else if (progress >= tEnd) {
          flipper.style.transform = 'rotateX(0deg)';
          flipper.style.opacity = '1';
          flipper.style.filter = 'none';
        } else {
          const pLocal = (progress - tStart) / (tEnd - tStart);
          const pEased = smoothstep(pLocal);
          const blur = Math.sin(pLocal * Math.PI) * 2.2;
          flipper.style.transform = `rotateX(${-90 + pEased * 90}deg)`;
          flipper.style.opacity = `${pEased}`;
          flipper.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : 'none';
        }
      }
    },
    [prefersReducedMotion]
  );

  // Master GSAP Timeline & ScrollTrigger Setup
  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>('.scroll-container');
    if (!runwayRef.current || !stageRef.current) return;

    if (scrollContainer) {
      scrollContainer.classList.add('home-morph-active');
    }

    const lenis = new Lenis({
      wrapper: scrollContainer || window,
      content: runwayRef.current,
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    const masterTl = gsap.timeline({
      defaults: { ease: 'none' }
    });

    // ── Master Scrub Timeline (Locked in sync with letter flaps) ──
    const progressProxy = { p: 0 };
    masterTl.to(
      progressProxy,
      {
        p: 1,
        duration: 1,
        ease: 'none',
        onUpdate: () => {
          updateDepartureFlaps(progressProxy.p);
        }
      },
      0
    );

    // ── Phase 1: 0.0 to 0.50 (Hero Glow, Background & Chrome Smooth Exit) ──
    if (heroBgRef.current) {
      masterTl.to(
        heroBgRef.current,
        {
          opacity: 0,
          duration: 0.50,
          ease: 'power1.inOut'
        },
        0.16
      );
    }

    if (heroGlowRef.current) {
      masterTl.to(
        heroGlowRef.current,
        {
          opacity: 0,
          scale: 0.6,
          duration: RED_GLOW_FADE_END,
          ease: 'power2.in'
        },
        0
      );
    }

    if (chromeStateARef.current) {
      masterTl.to(
        chromeStateARef.current,
        {
          opacity: 0,
          y: -20,
          duration: CHROME_OUT_END,
          ease: 'power1.out'
        },
        0
      );
    }

    if (ctaBtnRef.current) {
      masterTl.to(
        ctaBtnRef.current,
        {
          opacity: 0,
          scale: 0.85,
          duration: CHROME_OUT_END * 0.8,
          ease: 'power1.out'
        },
        0
      );
    }

    // ── Phase 2: 0.16 to 0.65 (Split Surface Dissolve & Divider Line) ──
    if (splitBgRef.current) {
      masterTl.fromTo(
        splitBgRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: WIPE_END - WIPE_START,
          ease: 'power1.inOut'
        },
        WIPE_START
      );
    }

    if (dividerLineRef.current) {
      masterTl.fromTo(
        dividerLineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: LINE_DRAW_END - LINE_DRAW_START,
          ease: 'expo.inOut'
        },
        LINE_DRAW_START
      );
    }

    // ── Phase 3: Top Track ("PRAMUDITHA" -> "LOGIC & SYSTEMS") ──
    // Glides smoothly from center (top: 50%) to top half (top: 25%)
    // Font-size transitions smoothly from 12.2vw to 13.2vw, scaleY from 1.75 to 1.0
    if (topTrackRef.current) {
      masterTl.fromTo(
        topTrackRef.current,
        {
          top: '50%',
          fontSize: '12.2vw',
          scaleY: 1.75
        },
        {
          top: '25%',
          fontSize: '13.2vw',
          scaleY: 1.0,
          duration: 0.78,
          ease: 'power2.inOut'
        },
        0.12
      );
    }

    // ── Phase 4: Bottom Track ("NADUN" -> "AESTHETICS & MOTION") ──
    // Bottom Track container glides smoothly from center (top: 50%) to bottom half (top: 75%)
    if (bottomTrackRef.current) {
      masterTl.fromTo(
        bottomTrackRef.current,
        { top: '50%' },
        {
          top: '75%',
          duration: 0.80,
          ease: 'power2.inOut'
        },
        0.10
      );
    }

    // NADUN shrinks from giant background size down to standard title scale while flipping
    if (bottomOutTrackRef.current) {
      masterTl.fromTo(
        bottomOutTrackRef.current,
        {
          fontSize: '35vw',
          scaleX: 1.65,
          scaleY: 2.6,
          opacity: 0.55
        },
        {
          fontSize: '10.5vw',
          scaleX: 1.0,
          scaleY: 1.0,
          opacity: 0,
          duration: 0.45,
          ease: 'power2.inOut'
        },
        0.12
      );
    }

    // ── Phase 5: Split View UI Chrome, Watermarks, Crosshairs & Arrows ──
    if (watermarksRef.current) {
      masterTl.fromTo(
        watermarksRef.current,
        { opacity: 0 },
        {
          opacity: 0.038,
          duration: 0.22,
          ease: 'power1.out'
        },
        0.72
      );
    }

    if (chromeStateBRef.current) {
      masterTl.fromTo(
        chromeStateBRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: CHROME_IN_END - CHROME_IN_START,
          ease: 'power2.out'
        },
        CHROME_IN_START
      );
    }

    if (themeToggleWrapRef.current) {
      masterTl.fromTo(
        themeToggleWrapRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.22,
          ease: 'back.out(1.5)'
        },
        0.76
      );
    }

    if (crosshairsRef.current) {
      masterTl.fromTo(
        crosshairsRef.current,
        { opacity: 0 },
        {
          opacity: 0.35,
          duration: 0.20,
          ease: 'power1.out'
        },
        0.78
      );
    }

    if (topArrowRef.current && bottomArrowRef.current) {
      masterTl.fromTo(
        [topArrowRef.current, bottomArrowRef.current],
        { opacity: 0 },
        {
          opacity: 0.45,
          duration: 0.22,
          ease: 'power1.out'
        },
        0.76
      );
    }

    const applyProgress = (p: number) => {
      updateDepartureFlaps(p);

      // Toggle portal hit-zones at end of scroll
      const isSplitInteractive = p >= 0.92;
      if (topHitZoneRef.current) {
        topHitZoneRef.current.style.pointerEvents = isSplitInteractive ? 'auto' : 'none';
      }
      if (bottomHitZoneRef.current) {
        bottomHitZoneRef.current.style.pointerEvents = isSplitInteractive ? 'auto' : 'none';
      }

      // Toggle CTA button hit-zone at start of scroll
      if (ctaBtnRef.current) {
        ctaBtnRef.current.style.pointerEvents = p < 0.20 ? 'auto' : 'none';
      }
    };

    const trigger = ScrollTrigger.create({
      trigger: runwayRef.current,
      scroller: scrollContainer || window,
      start: 'top top',
      end: 'bottom bottom',
      scrub: SCRUB_LAG,
      animation: masterTl,
      onUpdate: () => {
        const p = masterTl.progress();
        applyProgress(p);

        // Keep URL hash in sync with scroll progress so split view state is preserved
        if (p >= 0.88) {
          if (window.location.hash.toLowerCase() !== '#split') {
            window.history.replaceState(null, '', '#split');
          }
        } else if (p < 0.20) {
          if (window.location.hash.toLowerCase() === '#split') {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }
      }
    });

    // Check deep linking
    const searchParams = new URLSearchParams(window.location.search);
    const progressParam = searchParams.get('progress');
    const isSplitHash = window.location.hash.toLowerCase() === '#split';
    const targetP = (isSplitHash || progressParam !== null)
      ? (progressParam !== null ? Math.min(1, Math.max(0, parseFloat(progressParam))) : 1)
      : 0;

    const setTarget = (p: number) => {
      const maxScroll = (runwayRef.current?.offsetHeight || 3000) - window.innerHeight;
      const targetScroll = p * maxScroll;
      if (scrollContainer) {
        scrollContainer.scrollTop = targetScroll;
      }
      window.scrollTo(0, targetScroll);

      if (lenis) {
        lenis.scrollTo(targetScroll, { immediate: true });
      }
      trigger.scroll(targetScroll);
      masterTl.progress(p);
      applyProgress(p);
    };

    setTarget(targetP);

    if (targetP > 0) {
      setTimeout(() => setTarget(targetP), 50);
      setTimeout(() => setTarget(targetP), 200);
    }

    if (document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.classList.remove('home-morph-active');
      }
      lenis.destroy();
      gsap.ticker.remove(tickerCb);
      trigger.kill();
      masterTl.kill();
    };
  }, [updateDepartureFlaps, isInitiallySplit]);

  return (
    <div
      className="home-morph-runway"
      ref={runwayRef}
      style={{ height: `${SCROLL_LENGTH_VH}vh` }}
    >
      {/* Pinned Persistent Full-Viewport Stage */}
      <div className={`home-morph-stage ${theme}-theme`} ref={stageRef}>
        <h1 className="sr-only">Pramuditha Nadun - Software Engineer &amp; Designer</h1>
        <h2 className="sr-only">Logic &amp; Systems - Software Engineer</h2>
        <h2 className="sr-only">Aesthetics &amp; Motion - Visual Designer</h2>

        {/* ── Layer A: Hero Deep Crimson Background ── */}
        <div className="morph-bg-hero" ref={heroBgRef} aria-hidden="true">
          <div
            className="morph-hero-glow"
            ref={heroGlowRef}
            style={{ opacity: isInitiallySplit ? 0 : 0.95 }}
          />
          <div
            className="morph-hero-vignette"
            style={{ opacity: isInitiallySplit ? 0 : 1 }}
          />
        </div>

        {/* ── Layer B: Split View Light Warm Grey Surface (Smooth Dissolve) ── */}
        <div
          className="morph-bg-split"
          ref={splitBgRef}
          aria-hidden="true"
          style={{ opacity: isInitiallySplit ? 1 : 0 }}
        />

        {/* ── Center Horizontal Divider Line ── */}
        <div
          className="morph-split-divider-line"
          ref={dividerLineRef}
          aria-hidden="true"
          style={{ transform: isInitiallySplit ? 'translateY(-50%) scaleX(1)' : 'translateY(-50%) scaleX(0)' }}
        />

        {/* ── Split View Watermarks (Code & Telemetry) ── */}
        <div
          className="morph-split-watermarks"
          ref={watermarksRef}
          aria-hidden="true"
          style={{ opacity: isInitiallySplit ? 0.038 : 0 }}
        >
          <div className="split-bg-code-watermark">
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

          <div className="split-bg-telemetry-watermark">
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
        </div>

        {/* ── Interactive Portal Hit-Zones (Enabled at Progress >= 92%) ── */}
        <div
          ref={topHitZoneRef}
          className="morph-portal-hit-zone top-portal"
          onClick={() => {
            soundEngine.playClickSound();
            onNavigate('logic');
          }}
          onMouseEnter={() => {
            soundEngine.playHoverSound();
            setHoveredPortal('top');
          }}
          onMouseLeave={() => setHoveredPortal(null)}
          role="button"
          tabIndex={0}
          aria-label="Explore Logic & Systems"
          style={{ pointerEvents: isInitiallySplit ? 'auto' : 'none' }}
        />

        <div
          ref={bottomHitZoneRef}
          className="morph-portal-hit-zone bottom-portal"
          onClick={() => {
            soundEngine.playClickSound();
            onNavigate('aesthetics');
          }}
          onMouseEnter={() => {
            soundEngine.playHoverSound();
            setHoveredPortal('bottom');
          }}
          onMouseLeave={() => setHoveredPortal(null)}
          role="button"
          tabIndex={0}
          aria-label="Explore Aesthetics & Motion"
          style={{ pointerEvents: isInitiallySplit ? 'auto' : 'none' }}
        />

        {/* ── Bottom Morph Track: NADUN -> AESTHETICS & MOTION ── */}
        <div
          className="morph-bottom-track"
          ref={bottomTrackRef}
          aria-label="AESTHETICS & MOTION"
          style={{
            top: isInitiallySplit ? '75%' : '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Outgoing Word: NADUN */}
          <div
            className="morph-word-outgoing bottom-outgoing"
            ref={bottomOutTrackRef}
            style={{
              fontSize: isInitiallySplit ? '10.5vw' : '35vw',
              transform: isInitiallySplit
                ? 'translate(-50%, -50%) scale(1)'
                : 'translate(-50%, -50%) scale(1.65, 2.6)',
              opacity: isInitiallySplit ? 0 : 0.55,
              color: '#920303'
            }}
          >
            {BOTTOM_OUTGOING_CHARS.map((char, i) => (
              <span key={`bot-out-${i}`} className="morph-char-cell" aria-hidden="true">
                <span
                  className="morph-char-flipper"
                  ref={(el) => {
                    bottomOutFlipperRefs.current[i] = el;
                  }}
                  style={{
                    transform: isInitiallySplit ? 'rotateX(90deg)' : 'rotateX(0deg)',
                    opacity: isInitiallySplit ? 0 : 0.55
                  }}
                >
                  <span className="morph-char-glyph">{char}</span>
                </span>
              </span>
            ))}
          </div>

          {/* Incoming Word: AESTHETICS & MOTION */}
          <div
            className={`morph-word-incoming bottom-incoming ${hoveredPortal === 'bottom' ? 'is-hovered' : ''}`}
            style={{
              fontSize: '10.5vw',
              color: theme === 'dark' ? '#E8E3DD' : '#111111'
            }}
          >
            <span className="morph-line-group line-1">
              {BOTTOM_INCOMING_LINE1.map((char, idx) => (
                <span key={`bot-in-1-${idx}`} className="morph-char-cell" aria-hidden="true">
                  <span
                    className="morph-char-flipper"
                    ref={(el) => {
                      bottomInFlipperRefs.current[idx] = el;
                    }}
                    style={{
                      transform: isInitiallySplit ? 'rotateX(0deg)' : 'rotateX(-90deg)',
                      opacity: isInitiallySplit ? 1 : 0
                    }}
                  >
                    <span className="morph-char-glyph">{char}</span>
                  </span>
                </span>
              ))}
            </span>

            <span className="morph-line-group line-2">
              {BOTTOM_INCOMING_LINE2.map((char, idx) => (
                <span key={`bot-in-2-${idx}`} className="morph-char-cell" aria-hidden="true">
                  <span
                    className="morph-char-flipper"
                    ref={(el) => {
                      bottomInFlipperRefs.current[BOTTOM_INCOMING_LINE1.length + idx] = el;
                    }}
                    style={{
                      transform: isInitiallySplit ? 'rotateX(0deg)' : 'rotateX(-90deg)',
                      opacity: isInitiallySplit ? 1 : 0
                    }}
                  >
                    <span className="morph-char-glyph">{char}</span>
                  </span>
                </span>
              ))}

              {/* External Link Arrow Indicator */}
              <svg
                ref={bottomArrowRef}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="morph-arrow-indicator"
                aria-hidden="true"
                style={{ opacity: isInitiallySplit ? 0.45 : 0 }}
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </span>
          </div>
        </div>

        {/* ── Top Morph Track: PRAMUDITHA -> LOGIC & SYSTEMS ── */}
        <div
          className="morph-top-track"
          ref={topTrackRef}
          aria-label="LOGIC & SYSTEMS"
          style={{
            top: isInitiallySplit ? '25%' : '50%',
            fontSize: isInitiallySplit ? '13.2vw' : '12.2vw',
            transform: `translate(-50%, -50%) scaleY(${isInitiallySplit ? 1.0 : 1.75})`
          }}
        >
          {/* Outgoing Word: PRAMUDITHA */}
          <div
            className="morph-word-outgoing top-outgoing"
            style={{
              color: '#ffffff',
              textShadow: '0 10px 45px rgba(0, 0, 0, 0.95)'
            }}
          >
            {TOP_OUTGOING_CHARS.map((char, i) => (
              <span key={`top-out-${i}`} className="morph-char-cell" aria-hidden="true">
                <span
                  className="morph-char-flipper"
                  ref={(el) => {
                    topOutFlipperRefs.current[i] = el;
                  }}
                  style={{
                    transform: isInitiallySplit ? 'rotateX(90deg)' : 'rotateX(0deg)',
                    opacity: isInitiallySplit ? 0 : 1
                  }}
                >
                  <span className="morph-char-glyph">{char}</span>
                </span>
              </span>
            ))}
          </div>

          {/* Incoming Word: LOGIC & SYSTEMS */}
          <div
            className={`morph-word-incoming top-incoming ${hoveredPortal === 'top' ? 'is-hovered' : ''}`}
            style={{
              fontSize: '13.2vw',
              color: theme === 'dark' ? '#E8E3DD' : '#111111'
            }}
          >
            <span className="morph-line-group line-1">
              {TOP_INCOMING_LINE1.map((char, idx) => (
                <span key={`top-in-1-${idx}`} className="morph-char-cell" aria-hidden="true">
                  <span
                    className="morph-char-flipper"
                    ref={(el) => {
                      topInFlipperRefs.current[idx] = el;
                    }}
                    style={{
                      transform: isInitiallySplit ? 'rotateX(0deg)' : 'rotateX(-90deg)',
                      opacity: isInitiallySplit ? 1 : 0
                    }}
                  >
                    <span className="morph-char-glyph">{char}</span>
                  </span>
                </span>
              ))}
            </span>

            <span className="morph-line-group line-2">
              {TOP_INCOMING_LINE2.map((char, idx) => (
                <span key={`top-in-2-${idx}`} className="morph-char-cell" aria-hidden="true">
                  <span
                    className="morph-char-flipper"
                    ref={(el) => {
                      topInFlipperRefs.current[TOP_INCOMING_LINE1.length + idx] = el;
                    }}
                    style={{
                      transform: isInitiallySplit ? 'rotateX(0deg)' : 'rotateX(-90deg)',
                      opacity: isInitiallySplit ? 1 : 0
                    }}
                  >
                    <span className="morph-char-glyph">{char}</span>
                  </span>
                </span>
              ))}

              {/* External Link Arrow Indicator */}
              <svg
                ref={topArrowRef}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="morph-arrow-indicator"
                aria-hidden="true"
                style={{ opacity: isInitiallySplit ? 0.45 : 0 }}
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </span>
          </div>
        </div>

        {/* ── State A UI Chrome (Hero: Subtitle, Socials, Scroll Down, Description) ── */}
        <div
          className="morph-chrome-state-a"
          ref={chromeStateARef}
          style={{
            opacity: isInitiallySplit ? 0 : 1,
            pointerEvents: isInitiallySplit ? 'none' : 'auto'
          }}
        >
          <div className="top-section">
            <div className="brand-subtitle">Software Engineer | Designer</div>
          </div>

          <SocialLinks variant="vertical" />

          <div className="right-scroll-vertical">Scroll Down</div>

          <div className="bottom-section">
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
          </div>
        </div>

        {/* The Mind Behind CTA Button */}
        <div
          className="morph-cta-wrapper"
          ref={ctaBtnRef}
          style={{
            opacity: isInitiallySplit ? 0 : 1,
            pointerEvents: isInitiallySplit ? 'none' : 'auto'
          }}
        >
          <button
            type="button"
            className="home-about-cta-btn"
            onClick={() => {
              soundEngine.playClickSound();
              onNavigate('about');
            }}
          >
            <span className="cta-dot" aria-hidden="true" />
            <span>The Mind Behind</span>
            <span className="cta-arrow" aria-hidden="true">
              ›
            </span>
          </button>
        </div>

        {/* ── State B UI Chrome (Split View: Telemetry Tags, Scroll to Top) ── */}
        <div
          className="morph-chrome-state-b"
          ref={chromeStateBRef}
          style={{
            opacity: isInitiallySplit ? 1 : 0,
            pointerEvents: isInitiallySplit ? 'auto' : 'none'
          }}
        >
          <div
            className="home-guide-link morph-scroll-to-top"
            onClick={handleScrollToTop}
            title="Scroll to Top"
            role="button"
            tabIndex={0}
          >
            <Icon icon="mdi:chevron-up" className="home-guide-icon" />
            <span className="home-guide-text">SCROLL TO TOP</span>
          </div>

          <div className="portal-telemetry-tag morph-telemetry-tag-top">
            <span className="telemetry-bracket">[</span>
            <span>// 01 ARCHITECTURE &amp; SYSTEMS · SOFTWARE ENGINEER</span>
            <span className="telemetry-bracket">]</span>
          </div>

          <div className="portal-telemetry-tag morph-telemetry-tag-bottom">
            <span className="telemetry-bracket">[</span>
            <span>// 02 MOTION &amp; SPATIAL DESIGN · GRAPHIC DESIGNER</span>
            <span className="telemetry-bracket">]</span>
          </div>
        </div>

        {/* Precision Corner Crosshairs (State B) */}
        <div
          className="morph-crosshairs"
          ref={crosshairsRef}
          aria-hidden="true"
          style={{ opacity: isInitiallySplit ? 0.35 : 0 }}
        >
          <div className="portal-hud-crosshair top-left">+</div>
          <div className="portal-hud-crosshair top-right">+</div>
          <div className="portal-hud-crosshair bottom-left">+</div>
          <div className="portal-hud-crosshair bottom-right">+</div>
        </div>

        {/* ── Floating Controls Group (Top-Right): Fixed throughout ── */}
        <div className="floating-controls-group">
          {onOpenSearch && <SearchButton onClick={onOpenSearch} variant="floating" />}
          <MusicButton variant="floating" />
          <div
            className="morph-theme-toggle-wrap"
            ref={themeToggleWrapRef}
            style={{ opacity: isInitiallySplit ? 1 : 0 }}
          >
            <ThemeToggle theme={theme} onToggle={onToggleTheme} variant="floating" />
          </div>
        </div>
      </div>
    </div>
  );
}
