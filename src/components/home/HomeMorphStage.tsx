import { useEffect, useRef, useCallback, useMemo } from 'react';
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
// TUNABLE TIMELINE PARAMETERS (Adjust to customize feel)
// ============================================================================
export const SCROLL_LENGTH_VH = 400;      // Total scroll runway height (vh)
export const SCRUB_LAG = 0.8;             // ScrollTrigger scrub smoothing (seconds)
export const MORPH_BLUR_PX = 3.5;         // Mid-flip blur intensity (px)
export const RED_GLOW_FADE_END = 0.38;    // Hero central red glow fade end
export const WIPE_START = 0.35;           // Split surface wipe begins (0.0 - 1.0)
export const WIPE_END = 0.92;             // Split surface wipe completes (0.0 - 1.0)
export const LINE_DRAW_START = 0.58;      // Divider line begins drawing
export const LINE_DRAW_END = 0.84;        // Divider line completes drawing
export const CHROME_OUT_END = 0.28;       // Hero UI chrome completely fades out
export const CHROME_IN_START = 0.72;      // Split UI chrome starts fading in

// Glyph scrambling set during 3D departure-board flip
const SCRAMBLE_GLYPHS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  '&', '0', '1', '7', '9'
];

function getPseudoRandomGlyph(slotIndex: number, tick: number): string {
  const hash = Math.abs(Math.sin(slotIndex * 137.5 + tick * 31.7) * 10000);
  return SCRAMBLE_GLYPHS[Math.floor(hash) % SCRAMBLE_GLYPHS.length];
}

interface MorphSlotConfig {
  index: number;
  startChar: string;
  targetChar: string;
  tStart: number;
  tEnd: number;
  isExpander: boolean;
  naturalWidthCh: number;
}

// Top Word Slots: "PRAMUDITHA" -> "LOGIC & SYSTEMS" (15 characters)
// Center-outward stagger wave (center flips first, rippling outward, complete by ~0.72)
const TOP_SLOTS: MorphSlotConfig[] = [
  { index: 0, startChar: 'P', targetChar: 'L', tStart: 0.52, tEnd: 0.70, isExpander: false, naturalWidthCh: 0.82 },
  { index: 1, startChar: 'R', targetChar: 'O', tStart: 0.46, tEnd: 0.65, isExpander: false, naturalWidthCh: 0.88 },
  { index: 2, startChar: 'A', targetChar: 'G', tStart: 0.40, tEnd: 0.59, isExpander: false, naturalWidthCh: 0.88 },
  { index: 3, startChar: 'M', targetChar: 'I', tStart: 0.34, tEnd: 0.53, isExpander: false, naturalWidthCh: 0.42 },
  { index: 4, startChar: 'U', targetChar: 'C', tStart: 0.28, tEnd: 0.47, isExpander: false, naturalWidthCh: 0.82 },
  { index: 5, startChar: '\u00A0', targetChar: '\u00A0', tStart: 0.24, tEnd: 0.40, isExpander: true, naturalWidthCh: 0.4 },
  { index: 6, startChar: '&', targetChar: '&', tStart: 0.24, tEnd: 0.42, isExpander: true, naturalWidthCh: 0.75 },
  { index: 7, startChar: '\u00A0', targetChar: '\u00A0', tStart: 0.24, tEnd: 0.40, isExpander: true, naturalWidthCh: 0.4 },
  { index: 8, startChar: 'D', targetChar: 'S', tStart: 0.28, tEnd: 0.47, isExpander: false, naturalWidthCh: 0.78 },
  { index: 9, startChar: 'I', targetChar: 'Y', tStart: 0.34, tEnd: 0.53, isExpander: false, naturalWidthCh: 0.82 },
  { index: 10, startChar: 'T', targetChar: 'S', tStart: 0.40, tEnd: 0.59, isExpander: false, naturalWidthCh: 0.78 },
  { index: 11, startChar: 'H', targetChar: 'T', tStart: 0.46, tEnd: 0.65, isExpander: false, naturalWidthCh: 0.74 },
  { index: 12, startChar: 'A', targetChar: 'E', tStart: 0.52, tEnd: 0.70, isExpander: false, naturalWidthCh: 0.75 },
  { index: 13, startChar: 'M', targetChar: 'M', tStart: 0.55, tEnd: 0.71, isExpander: true, naturalWidthCh: 1.05 },
  { index: 14, startChar: 'S', targetChar: 'S', tStart: 0.58, tEnd: 0.72, isExpander: true, naturalWidthCh: 0.78 }
];

// Bottom Word Slots: "NADUN" -> "AESTHETICS & MOTION" (19 characters)
// Left-to-right stagger wave (left flips first, rippling across, complete by ~0.74)
const BOTTOM_SLOTS: MorphSlotConfig[] = [
  { index: 0, startChar: 'N', targetChar: 'A', tStart: 0.26, tEnd: 0.42, isExpander: false, naturalWidthCh: 0.8 },
  { index: 1, startChar: 'A', targetChar: 'E', tStart: 0.28, tEnd: 0.44, isExpander: false, naturalWidthCh: 0.75 },
  { index: 2, startChar: 'D', targetChar: 'S', tStart: 0.30, tEnd: 0.46, isExpander: false, naturalWidthCh: 0.75 },
  { index: 3, startChar: 'U', targetChar: 'T', tStart: 0.32, tEnd: 0.48, isExpander: false, naturalWidthCh: 0.75 },
  { index: 4, startChar: 'N', targetChar: 'H', tStart: 0.34, tEnd: 0.50, isExpander: false, naturalWidthCh: 0.8 },
  { index: 5, startChar: 'E', targetChar: 'E', tStart: 0.37, tEnd: 0.53, isExpander: true, naturalWidthCh: 0.75 },
  { index: 6, startChar: 'T', targetChar: 'T', tStart: 0.40, tEnd: 0.56, isExpander: true, naturalWidthCh: 0.75 },
  { index: 7, startChar: 'I', targetChar: 'I', tStart: 0.43, tEnd: 0.59, isExpander: true, naturalWidthCh: 0.42 },
  { index: 8, startChar: 'C', targetChar: 'C', tStart: 0.46, tEnd: 0.62, isExpander: true, naturalWidthCh: 0.8 },
  { index: 9, startChar: 'S', targetChar: 'S', tStart: 0.49, tEnd: 0.64, isExpander: true, naturalWidthCh: 0.75 },
  { index: 10, startChar: '\u00A0', targetChar: '\u00A0', tStart: 0.51, tEnd: 0.65, isExpander: true, naturalWidthCh: 0.4 },
  { index: 11, startChar: '&', targetChar: '&', tStart: 0.52, tEnd: 0.66, isExpander: true, naturalWidthCh: 0.72 },
  { index: 12, startChar: '\u00A0', targetChar: '\u00A0', tStart: 0.53, tEnd: 0.67, isExpander: true, naturalWidthCh: 0.4 },
  { index: 13, startChar: 'M', targetChar: 'M', tStart: 0.55, tEnd: 0.68, isExpander: true, naturalWidthCh: 1.05 },
  { index: 14, startChar: 'O', targetChar: 'O', tStart: 0.57, tEnd: 0.70, isExpander: true, naturalWidthCh: 0.85 },
  { index: 15, startChar: 'T', targetChar: 'T', tStart: 0.59, tEnd: 0.71, isExpander: true, naturalWidthCh: 0.75 },
  { index: 16, startChar: 'I', targetChar: 'I', tStart: 0.61, tEnd: 0.72, isExpander: true, naturalWidthCh: 0.42 },
  { index: 17, startChar: 'O', targetChar: 'O', tStart: 0.63, tEnd: 0.73, isExpander: true, naturalWidthCh: 0.85 },
  { index: 18, startChar: 'N', targetChar: 'N', tStart: 0.65, tEnd: 0.74, isExpander: true, naturalWidthCh: 0.8 }
];

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
  const heroGlowRef = useRef<HTMLDivElement>(null);
  const splitBgRef = useRef<HTMLDivElement>(null);
  const dividerLineRef = useRef<HTMLDivElement>(null);
  const watermarksRef = useRef<HTMLDivElement>(null);

  // Chrome refs
  const chromeStateARef = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useRef<HTMLDivElement>(null);
  const chromeStateBRef = useRef<HTMLDivElement>(null);
  const themeToggleWrapRef = useRef<HTMLDivElement>(null);
  const crosshairsRef = useRef<HTMLDivElement>(null);

  // Morph tracks refs
  const topTrackRef = useRef<HTMLDivElement>(null);
  const bottomTrackRef = useRef<HTMLDivElement>(null);

  // Portal hit-zone refs
  const topHitZoneRef = useRef<HTMLDivElement>(null);
  const bottomHitZoneRef = useRef<HTMLDivElement>(null);

  // Arrow indicator refs
  const topArrowRef = useRef<SVGSVGElement | null>(null);
  const bottomArrowRef = useRef<SVGSVGElement | null>(null);

  // Arrays of element references for individual character cells & flippers
  const topCellRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const topFlipperRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const topGlyphRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const bottomCellRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const bottomFlipperRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const bottomGlyphRefs = useRef<Array<HTMLSpanElement | null>>([]);

  // Lenis instance ref for programmatic scrolling
  const lenisRef = useRef<Lenis | null>(null);

  // Check prefers-reduced-motion once
  const prefersReducedMotion = useMemo(() => {
    return typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
  }, []);

  // Scroll to top handler
  const handleScrollToTop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.4 });
    } else {
      const scrollContainer = document.querySelector('.scroll-container');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, []);

  const isInitiallySplit = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const searchParams = new URLSearchParams(window.location.search);
    return window.location.hash.toLowerCase() === '#split' || searchParams.get('progress') === '1';
  }, []);

  // Update morph letter cells directly via refs for maximum performance
  const updateLetterSlots = useCallback(
    (
      progress: number,
      slots: MorphSlotConfig[],
      cellRefs: Array<HTMLSpanElement | null>,
      flipperRefs: Array<HTMLSpanElement | null>,
      glyphRefs: Array<HTMLSpanElement | null>
    ) => {
      const tick = Math.floor(progress * 240);

      // Dynamically morph font family between tall hero Harmera and display Bebas Neue
      if (topTrackRef.current) {
        topTrackRef.current.style.fontFamily =
          progress >= 0.45
            ? "var(--font-tall, 'Bebas Neue', sans-serif)"
            : "'Harmera', 'Gondens DEMO', var(--font-tall, sans-serif)";
      }

      slots.forEach((slot, i) => {
        const cell = cellRefs[i];
        const flipper = flipperRefs[i];
        const glyph = glyphRefs[i];
        if (!cell || !flipper || !glyph) return;

        const { startChar, targetChar, tStart, tEnd, isExpander, naturalWidthCh } = slot;

        // Clean boundary snaps for progress near 0% and 100% to guarantee flawless endpoints
        if (progress >= 0.85) {
          flipper.style.transform = 'rotateX(0deg) translateY(0px)';
          flipper.style.filter = 'none';
          glyph.textContent = targetChar;
          if (isExpander) {
            cell.style.maxWidth = 'none';
            cell.style.opacity = '1';
            cell.style.transform = 'scaleX(1)';
          }
          return;
        }

        if (progress <= 0.05) {
          flipper.style.transform = 'rotateX(0deg) translateY(0px)';
          flipper.style.filter = 'none';
          glyph.textContent = startChar;
          if (isExpander) {
            cell.style.maxWidth = '0px';
            cell.style.opacity = '0';
            cell.style.transform = 'scaleX(0)';
          }
          return;
        }

        // 1. Width & Opacity Expansion for slots that begin collapsed at p=0
        if (isExpander) {
          if (progress < tStart) {
            cell.style.maxWidth = '0px';
            cell.style.opacity = '0';
            cell.style.transform = 'scaleX(0)';
          } else if (progress < tEnd) {
            const u = (progress - tStart) / (tEnd - tStart);
            const easeU = Math.sin((u * Math.PI) / 2); // Smooth sine ease out
            cell.style.maxWidth = `${(easeU * naturalWidthCh).toFixed(3)}ch`;
            cell.style.opacity = u.toFixed(3);
            cell.style.transform = `scaleX(${easeU.toFixed(3)})`;
          } else {
            cell.style.maxWidth = 'none';
            cell.style.opacity = '1';
            cell.style.transform = 'scaleX(1)';
          }
        }

        // Reduced motion: simple crossfade without 3D rotation/scramble
        if (prefersReducedMotion) {
          glyph.textContent = progress >= (tStart + tEnd) / 2 ? targetChar : startChar;
          return;
        }

        // 2. 3D Departure-Board Flip & Glyph Scramble
        const tMid = (tStart + tEnd) / 2;

        if (progress < tStart) {
          flipper.style.transform = 'rotateX(0deg) translateY(0px)';
          flipper.style.filter = 'none';
          glyph.textContent = startChar;
        } else if (progress < tMid) {
          const f = (progress - tStart) / (tMid - tStart);
          const rotX = f * 90;
          const blur = Math.sin(f * Math.PI) * MORPH_BLUR_PX;
          const yOff = -4 * Math.sin(f * Math.PI);

          flipper.style.transform = `rotateX(${rotX.toFixed(2)}deg) translateY(${yOff.toFixed(2)}px)`;
          flipper.style.filter = blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : 'none';
          glyph.textContent = f < 0.45 ? startChar : getPseudoRandomGlyph(slot.index, tick);
        } else if (progress <= tEnd) {
          const g = (progress - tMid) / (tEnd - tMid);
          const rotX = -90 * (1 - g);
          const blur = Math.sin((1 - g) * Math.PI) * MORPH_BLUR_PX;
          const yOff = 4 * Math.sin((1 - g) * Math.PI);

          flipper.style.transform = `rotateX(${rotX.toFixed(2)}deg) translateY(${yOff.toFixed(2)}px)`;
          flipper.style.filter = blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : 'none';
          glyph.textContent = g < 0.65 ? getPseudoRandomGlyph(slot.index, tick + 7) : targetChar;
        } else {
          flipper.style.transform = 'rotateX(0deg) translateY(0px)';
          flipper.style.filter = 'none';
          glyph.textContent = targetChar;
        }
      });
    },
    [prefersReducedMotion]
  );

  // Master Timeline & ScrollTrigger Setup
  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>('.scroll-container');
    if (!runwayRef.current || !stageRef.current) return;

    // Enable home-morph-active class on scroll-container to disable CSS scroll-snap
    if (scrollContainer) {
      scrollContainer.classList.add('home-morph-active');
    }

    // Initialize Lenis for inertial smooth scrubbing
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

    // Master GSAP Timeline pinned along the runway
    const masterTl = gsap.timeline({
      defaults: { ease: 'none' }
    });

    // ── Phase 1: 0.0 to 0.35 (Hero Elements Fade & Background Dims) ──
    if (heroGlowRef.current) {
      masterTl.to(
        heroGlowRef.current,
        {
          opacity: 0,
          scale: 0.5,
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

    // ── Phase 2: 0.35 to 0.92 (Split Surface Wipe & Divider Line) ──
    if (splitBgRef.current) {
      masterTl.fromTo(
        splitBgRef.current,
        { clipPath: 'inset(50% 0% 50% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: WIPE_END - WIPE_START,
          ease: 'power2.inOut'
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

    // ── Phase 3: Morph Top Track (PRAMUDITHA -> LOGIC & SYSTEMS) ──
    // Center (top: 50%) -> Top half (top: 25%)
    if (topTrackRef.current) {
      masterTl.fromTo(
        topTrackRef.current,
        {
          top: '50%',
          scaleY: 1.75,
          scaleX: 0.924,
          color: '#ffffff',
          textShadow: '0 10px 45px rgba(0, 0, 0, 0.95)',
          letterSpacing: '0.05em'
        },
        {
          top: '25%',
          scaleY: 1.9,
          scaleX: 1.0,
          color: '#e51d1d',
          textShadow: '0 0 0 rgba(0, 0, 0, 0)',
          letterSpacing: '-0.02em',
          duration: 0.72,
          ease: 'power2.inOut'
        },
        0.20
      );
    }

    // ── Phase 4: Morph Bottom Track (NADUN -> AESTHETICS & MOTION) ──
    // Center (top: 50%, huge 35vw with scale 3.333) -> Bottom half (top: 75%, 10.5vw with scale 1.0)
    if (bottomTrackRef.current) {
      masterTl.fromTo(
        bottomTrackRef.current,
        {
          top: '50%',
          scale: 3.333,
          scaleY: 1.368,
          scaleX: 1.65,
          color: '#920303',
          opacity: 0.55,
          letterSpacing: '-0.04em'
        },
        {
          top: '75%',
          scale: 1.0,
          scaleY: 1.9,
          scaleX: 1.0,
          color: theme === 'dark' ? '#E8E3DD' : '#111111',
          opacity: 1.0,
          letterSpacing: '-0.02em',
          duration: 0.76,
          ease: 'power2.inOut'
        },
        0.18
      );
    }

    // ── Phase 5: 0.72 to 1.0 (State B UI Chrome, Telemetry & Crosshairs) ──
    if (watermarksRef.current) {
      masterTl.fromTo(
        watermarksRef.current,
        { opacity: 0 },
        {
          opacity: 0.038,
          duration: 0.25,
          ease: 'power1.out'
        },
        0.75
      );
    }

    if (chromeStateBRef.current) {
      masterTl.fromTo(
        chromeStateBRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.0 - CHROME_IN_START,
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
        0.78
      );
    }

    if (crosshairsRef.current) {
      masterTl.fromTo(
        crosshairsRef.current,
        { opacity: 0 },
        {
          opacity: 0.35,
          duration: 0.22,
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
          duration: 0.28,
          ease: 'power1.out'
        },
        0.72
      );
    }

    const applyProgress = (p: number) => {
      // Drive character flippers
      updateLetterSlots(p, TOP_SLOTS, topCellRefs.current, topFlipperRefs.current, topGlyphRefs.current);
      updateLetterSlots(p, BOTTOM_SLOTS, bottomCellRefs.current, bottomFlipperRefs.current, bottomGlyphRefs.current);

      // Toggle portal interactive hit-zones when progress reaches 92%
      const isSplitInteractive = p >= 0.92;
      if (topHitZoneRef.current) {
        topHitZoneRef.current.style.pointerEvents = isSplitInteractive ? 'auto' : 'none';
      }
      if (bottomHitZoneRef.current) {
        bottomHitZoneRef.current.style.pointerEvents = isSplitInteractive ? 'auto' : 'none';
      }

      // Toggle CTA button hit-zone when progress < 25%
      if (ctaBtnRef.current) {
        ctaBtnRef.current.style.pointerEvents = p < 0.25 ? 'auto' : 'none';
      }
    };

    // Master ScrollTrigger (tracks runway scroll and scrubs the persistent fixed stage)
    const trigger = ScrollTrigger.create({
      trigger: runwayRef.current,
      scroller: scrollContainer || window,
      start: 'top top',
      end: 'bottom bottom',
      scrub: SCRUB_LAG,
      animation: masterTl,
      onUpdate: (self) => {
        applyProgress(self.progress);
      }
    });

    // Check if deep linking to split view via hash or query param (e.g. ?progress=1 or #split)
    const searchParams = new URLSearchParams(window.location.search);
    const progressParam = searchParams.get('progress');
    const isSplitHash = window.location.hash.toLowerCase() === '#split';
    const targetP = (isSplitHash || progressParam !== null)
      ? (progressParam !== null ? Math.min(1, Math.max(0, parseFloat(progressParam))) : 1)
      : 0;

    const setTarget = (p: number) => {
      const maxScroll = (runwayRef.current?.offsetHeight || 3000) - window.innerHeight;
      if (scrollContainer) {
        scrollContainer.scrollTop = p * maxScroll;
      }
      if (lenis) {
        lenis.scrollTo(p * maxScroll, { immediate: true });
      }
      trigger.scroll(p * maxScroll);
      masterTl.progress(p);
      applyProgress(p);
    };

    // Apply initial state synchronously
    setTarget(targetP);

    if (targetP > 0) {
      setTimeout(() => setTarget(targetP), 50);
      setTimeout(() => setTarget(targetP), 200);
    }

    // Refresh ScrollTrigger after custom web fonts finish loading
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
  }, [theme, updateLetterSlots, isInitiallySplit]);

  return (
    <div
      className="home-morph-runway"
      ref={runwayRef}
      style={{ height: `${SCROLL_LENGTH_VH}vh` }}
    >
      {/* Pinned Persistent Full-Viewport Stage */}
      <div className={`home-morph-stage ${theme}-theme`} ref={stageRef}>
        {/* Accessible Headings */}
        <h1 className="sr-only">Pramuditha Nadun - Software Engineer &amp; Designer</h1>
        <h2 className="sr-only">Logic &amp; Systems - Software Engineer</h2>
        <h2 className="sr-only">Aesthetics &amp; Motion - Visual Designer</h2>

        {/* ── Layer A: Hero Deep Crimson Background ── */}
        <div className="morph-bg-hero" aria-hidden="true">
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

        {/* ── Layer B: Split View Light Warm Grey Surface (Wipe) ── */}
        <div
          className="morph-bg-split"
          ref={splitBgRef}
          aria-hidden="true"
          style={{ clipPath: isInitiallySplit ? 'inset(0% 0% 0% 0%)' : 'inset(50% 0% 50% 0%)' }}
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
          {/* Top Half Code Watermarks */}
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

          {/* Bottom Half Telemetry Watermarks */}
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
          onMouseEnter={() => soundEngine.playHoverSound()}
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
          onMouseEnter={() => soundEngine.playHoverSound()}
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
            fontSize: 'clamp(3rem, 10.5vw, 9.5rem)',
            top: isInitiallySplit ? '75%' : '50%',
            transform: isInitiallySplit
              ? 'translate(-50%, -50%) scale(1.0) scaleY(1.9)'
              : 'translate(-50%, -50%) scale(3.333) scaleY(1.368) scaleX(1.65)',
            color: isInitiallySplit ? (theme === 'dark' ? '#E8E3DD' : '#111111') : '#920303',
            opacity: isInitiallySplit ? 1 : 0.55,
            letterSpacing: isInitiallySplit ? '-0.02em' : '-0.04em'
          }}
        >
          {BOTTOM_SLOTS.map((slot, i) => (
            <span
              key={`bottom-slot-${i}`}
              className="morph-char-cell"
              ref={(el) => {
                bottomCellRefs.current[i] = el;
              }}
              style={{
                maxWidth: isInitiallySplit ? 'none' : (slot.isExpander ? '0ch' : `${slot.naturalWidthCh}ch`),
                opacity: isInitiallySplit ? 1 : (slot.isExpander ? 0 : 1)
              }}
              aria-hidden="true"
            >
              <span
                className="morph-char-flipper"
                ref={(el) => {
                  bottomFlipperRefs.current[i] = el;
                }}
              >
                <span
                  className="morph-char-glyph"
                  ref={(el) => {
                    bottomGlyphRefs.current[i] = el;
                  }}
                >
                  {isInitiallySplit ? slot.targetChar : slot.startChar}
                </span>
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
        </div>

        {/* ── Top Morph Track: PRAMUDITHA -> LOGIC & SYSTEMS ── */}
        <div
          className="morph-top-track"
          ref={topTrackRef}
          aria-label="LOGIC & SYSTEMS"
          style={{
            fontSize: 'clamp(3.6rem, 13.2vw, 12rem)',
            top: isInitiallySplit ? '25%' : '50%',
            transform: isInitiallySplit
              ? 'translate(-50%, -50%) scale(1.0) scaleY(1.9)'
              : 'translate(-50%, -50%) scaleY(1.75) scaleX(0.924)',
            color: isInitiallySplit ? '#e51d1d' : '#ffffff',
            textShadow: isInitiallySplit ? '0 0 0 rgba(0,0,0,0)' : '0 10px 45px rgba(0, 0, 0, 0.95)',
            letterSpacing: isInitiallySplit ? '-0.02em' : '0.05em'
          }}
        >
          {TOP_SLOTS.map((slot, i) => (
            <span
              key={`top-slot-${i}`}
              className="morph-char-cell"
              ref={(el) => {
                topCellRefs.current[i] = el;
              }}
              style={{
                maxWidth: isInitiallySplit ? 'none' : (slot.isExpander ? '0ch' : `${slot.naturalWidthCh}ch`),
                opacity: isInitiallySplit ? 1 : (slot.isExpander ? 0 : 1)
              }}
              aria-hidden="true"
            >
              <span
                className="morph-char-flipper"
                ref={(el) => {
                  topFlipperRefs.current[i] = el;
                }}
              >
                <span
                  className="morph-char-glyph"
                  ref={(el) => {
                    topGlyphRefs.current[i] = el;
                  }}
                >
                  {isInitiallySplit ? slot.targetChar : slot.startChar}
                </span>
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
        </div>
        <div
          className="morph-chrome-state-a"
          ref={chromeStateARef}
          style={{
            opacity: isInitiallySplit ? 0 : 1,
            pointerEvents: isInitiallySplit ? 'none' : 'auto'
          }}
        >
          {/* Top Section */}
          <div className="top-section">
            <div className="brand-subtitle">Software Engineer | Designer</div>
          </div>

          {/* Left Vertical Socials */}
          <SocialLinks variant="vertical" />

          {/* Right Vertical Scroll Prompt */}
          <div className="right-scroll-vertical">Scroll Down</div>

          {/* Bottom Section */}
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

        {/* The Mind Behind CTA Button (Centered beneath PRAMUDITHA) */}
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
          {/* Scroll to Top Link */}
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

          {/* Top Half Telemetry Tag */}
          <div className="portal-telemetry-tag morph-telemetry-tag-top">
            <span className="telemetry-bracket">[</span>
            <span>// 01 ARCHITECTURE &amp; SYSTEMS · SOFTWARE ENGINEER</span>
            <span className="telemetry-bracket">]</span>
          </div>

          {/* Bottom Half Telemetry Tag */}
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
