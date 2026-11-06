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

  // Authentic Section 1 (Hero) and Section 2 (Split View) frame refs
  const authenticHeroRef = useRef<HTMLDivElement>(null);
  const authenticSplitRef = useRef<HTMLDivElement>(null);
  const morphLayerRef = useRef<HTMLDivElement>(null);

  // Morph transition background and decor refs
  const heroGlowRef = useRef<HTMLDivElement>(null);
  const splitBgRef = useRef<HTMLDivElement>(null);
  const dividerLineRef = useRef<HTMLDivElement>(null);
  const watermarksRef = useRef<HTMLDivElement>(null);
  const crosshairsRef = useRef<HTMLDivElement>(null);

  // Morph tracks refs
  const topTrackRef = useRef<HTMLDivElement>(null);
  const bottomTrackRef = useRef<HTMLDivElement>(null);

  // Arrow indicator refs
  const topArrowRef = useRef<SVGSVGElement | null>(null);
  const bottomArrowRef = useRef<SVGSVGElement | null>(null);

  // Floating controls refs
  const themeToggleWrapRef = useRef<HTMLDivElement>(null);

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

  // Check if initially split
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

  // Update departure-board character flippers and glyphs driven by scroll progress
  const updateLetterSlots = useCallback(
    (
      progress: number,
      slots: MorphSlotConfig[],
      cellEls: Array<HTMLSpanElement | null>,
      flipperEls: Array<HTMLSpanElement | null>,
      glyphEls: Array<HTMLSpanElement | null>
    ) => {
      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        const cell = cellEls[i];
        const flipper = flipperEls[i];
        const glyph = glyphEls[i];
        if (!cell || !flipper || !glyph) continue;

        if (prefersReducedMotion) {
          // Simple graceful crossfade when user requested reduced motion
          if (progress < slot.tStart) {
            glyph.textContent = slot.startChar;
            cell.style.opacity = slot.isExpander ? '0' : '1';
            cell.style.maxWidth = slot.isExpander ? '0px' : `${slot.naturalWidthCh}ch`;
          } else if (progress > slot.tEnd) {
            glyph.textContent = slot.targetChar;
            cell.style.opacity = '1';
            cell.style.maxWidth = 'none';
          } else {
            const t = (progress - slot.tStart) / (slot.tEnd - slot.tStart);
            glyph.textContent = t < 0.5 ? slot.startChar : slot.targetChar;
            cell.style.opacity = slot.isExpander ? `${t}` : '1';
            cell.style.maxWidth = slot.isExpander ? `${slot.naturalWidthCh * t}ch` : `${slot.naturalWidthCh}ch`;
          }
          continue;
        }

        // Before this slot's flip window begins
        if (progress < slot.tStart) {
          if (slot.isExpander) {
            cell.style.maxWidth = '0px';
            cell.style.opacity = '0';
            cell.style.overflow = 'hidden';
            glyph.textContent = '';
          } else {
            cell.style.maxWidth = `${slot.naturalWidthCh}ch`;
            cell.style.opacity = '1';
            cell.style.overflow = 'visible';
            glyph.textContent = slot.startChar;
          }
          flipper.style.transform = 'rotateX(0deg)';
          flipper.style.filter = 'none';
          continue;
        }

        // After this slot's flip window completes
        if (progress >= slot.tEnd) {
          cell.style.maxWidth = 'none';
          cell.style.opacity = '1';
          cell.style.overflow = 'visible';
          glyph.textContent = slot.targetChar;
          flipper.style.transform = 'rotateX(0deg)';
          flipper.style.filter = 'none';
          continue;
        }

        // Inside this slot's flip window [slot.tStart -> slot.tEnd]
        const pSlot = (progress - slot.tStart) / (slot.tEnd - slot.tStart);

        // Smooth width and opacity expansion for letters not in the original word
        if (slot.isExpander) {
          const expandEase = Math.min(1, pSlot * 1.5);
          cell.style.maxWidth = `${slot.naturalWidthCh * expandEase}ch`;
          cell.style.opacity = `${expandEase}`;
          cell.style.overflow = 'visible';
        } else {
          cell.style.maxWidth = `${slot.naturalWidthCh}ch`;
          cell.style.opacity = '1';
          cell.style.overflow = 'visible';
        }

        // 3D rotation: 0° -> 90° -> 0° (or 0° -> 180° with backface culling)
        const rotX = pSlot < 0.5 ? pSlot * 2 * 90 : (1 - (pSlot - 0.5) * 2) * 90;

        // Departure-board glyph swapping and soft scramble at midpoint
        if (pSlot < 0.42) {
          glyph.textContent = slot.startChar;
        } else if (pSlot >= 0.70) {
          glyph.textContent = slot.targetChar;
        } else {
          const scrambleTick = Math.floor(progress * 120);
          glyph.textContent = getPseudoRandomGlyph(i, scrambleTick);
        }

        // Soft midpoint blur
        const blurAmount = Math.sin(pSlot * Math.PI) * MORPH_BLUR_PX;
        const yOffset = Math.sin(pSlot * Math.PI) * -4;

        flipper.style.transform = `translateY(${yOffset}px) rotateX(${rotX}deg)`;
        flipper.style.filter = blurAmount > 0.4 ? `blur(${blurAmount.toFixed(1)}px)` : 'none';
      }
    },
    [prefersReducedMotion]
  );

  // Master Timeline & ScrollTrigger Setup
  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>('.scroll-container');
    if (!runwayRef.current || !stageRef.current) return;

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

    // Master GSAP Timeline
    const masterTl = gsap.timeline({
      defaults: { ease: 'none' }
    });

    // ── Phase 1: 0.0 to 0.38 (Hero Glow Dims) ──
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
          scaleX: 0.9242,
          scaleY: 1.75,
          color: '#ffffff',
          textShadow: '0 10px 45px rgba(0, 0, 0, 0.95)',
          letterSpacing: '0.05em'
        },
        {
          top: '25%',
          scaleX: 1.0,
          scaleY: 1.9,
          color: '#e51d1d',
          textShadow: '0 0 0 rgba(0, 0, 0, 0)',
          letterSpacing: '-0.02em',
          duration: 0.72,
          ease: 'power2.inOut'
        },
        0.18
      );
    }

    // ── Phase 4: Morph Bottom Track (NADUN -> AESTHETICS & MOTION) ──
    // Center (top: 50%, huge 35vw edge-to-edge) -> Bottom half (top: 75%, 10.5vw)
    if (bottomTrackRef.current) {
      masterTl.fromTo(
        bottomTrackRef.current,
        {
          top: '50%',
          scaleX: 5.5,
          scaleY: 8.6667,
          color: '#920303',
          opacity: 0.55,
          letterSpacing: '-0.04em'
        },
        {
          top: '75%',
          scaleX: 1.0,
          scaleY: 1.9,
          color: theme === 'dark' ? '#E8E3DD' : '#111111',
          opacity: 1.0,
          letterSpacing: '-0.02em',
          duration: 0.76,
          ease: 'power2.inOut'
        },
        0.16
      );
    }

    // ── Phase 5: 0.72 to 1.0 (Watermarks, Crosshairs & Arrows) ──
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
          duration: 0.25,
          ease: 'power1.out'
        },
        0.75
      );
    }

    // Core progress application driven by ScrollTrigger
    const applyProgress = (p: number) => {
      // 1. Update departure-board character slots
      updateLetterSlots(p, TOP_SLOTS, topCellRefs.current, topFlipperRefs.current, topGlyphRefs.current);
      updateLetterSlots(p, BOTTOM_SLOTS, bottomCellRefs.current, bottomFlipperRefs.current, bottomGlyphRefs.current);

      // 2. Seamless crossfade between Authentic Hero (p <= 0.05), Morph Layer, and Authentic Split View (p >= 0.95)
      if (authenticHeroRef.current) {
        if (p <= 0.005) {
          authenticHeroRef.current.style.opacity = '1';
          authenticHeroRef.current.style.pointerEvents = 'auto';
          authenticHeroRef.current.style.visibility = 'visible';
        } else if (p < 0.05) {
          const heroOpacity = 1 - (p - 0.005) / 0.045;
          authenticHeroRef.current.style.opacity = `${heroOpacity}`;
          authenticHeroRef.current.style.pointerEvents = 'none';
          authenticHeroRef.current.style.visibility = 'visible';
        } else {
          authenticHeroRef.current.style.opacity = '0';
          authenticHeroRef.current.style.pointerEvents = 'none';
          authenticHeroRef.current.style.visibility = 'hidden';
        }
      }

      if (morphLayerRef.current) {
        if (p <= 0.005) {
          morphLayerRef.current.style.opacity = '0';
          morphLayerRef.current.style.visibility = 'hidden';
        } else if (p < 0.05) {
          const morphInOpacity = (p - 0.005) / 0.045;
          morphLayerRef.current.style.opacity = `${morphInOpacity}`;
          morphLayerRef.current.style.visibility = 'visible';
        } else if (p <= 0.95) {
          morphLayerRef.current.style.opacity = '1';
          morphLayerRef.current.style.visibility = 'visible';
        } else if (p < 0.995) {
          const morphOutOpacity = 1 - (p - 0.95) / 0.045;
          morphLayerRef.current.style.opacity = `${morphOutOpacity}`;
          morphLayerRef.current.style.visibility = 'visible';
        } else {
          morphLayerRef.current.style.opacity = '0';
          morphLayerRef.current.style.visibility = 'hidden';
        }
      }

      if (authenticSplitRef.current) {
        if (p < 0.95) {
          authenticSplitRef.current.style.opacity = '0';
          authenticSplitRef.current.style.pointerEvents = 'none';
          authenticSplitRef.current.style.visibility = 'hidden';
        } else if (p < 0.995) {
          const splitOpacity = (p - 0.95) / 0.045;
          authenticSplitRef.current.style.opacity = `${splitOpacity}`;
          authenticSplitRef.current.style.pointerEvents = 'none';
          authenticSplitRef.current.style.visibility = 'visible';
        } else {
          authenticSplitRef.current.style.opacity = '1';
          authenticSplitRef.current.style.pointerEvents = 'auto';
          authenticSplitRef.current.style.visibility = 'visible';
        }
      }

      // 3. Floating Theme Toggle appearance (hidden at hero, visible at split view)
      if (themeToggleWrapRef.current) {
        if (p <= 0.70) {
          themeToggleWrapRef.current.style.opacity = '0';
          themeToggleWrapRef.current.style.pointerEvents = 'none';
          themeToggleWrapRef.current.style.transform = 'scale(0.8)';
        } else if (p < 0.90) {
          const t = (p - 0.70) / 0.20;
          themeToggleWrapRef.current.style.opacity = `${t}`;
          themeToggleWrapRef.current.style.pointerEvents = 'auto';
          themeToggleWrapRef.current.style.transform = `scale(${0.8 + 0.2 * t})`;
        } else {
          themeToggleWrapRef.current.style.opacity = '1';
          themeToggleWrapRef.current.style.pointerEvents = 'auto';
          themeToggleWrapRef.current.style.transform = 'scale(1)';
        }
      }
    };

    // Master ScrollTrigger
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
      document.documentElement.scrollTop = targetScroll;
      document.body.scrollTop = targetScroll;

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
      setTimeout(() => setTarget(targetP), 500);
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

        {/* ===================================================================
            LAYER 1: AUTHENTIC STATE A (HERO SECTION)
            Matches original Section 1 with 100% pixel-perfect fidelity.
            =================================================================== */}
        <div
          className="scroll-section home-section-1 morph-authentic-frame hero-frame"
          ref={authenticHeroRef}
          style={{
            opacity: isInitiallySplit ? 0 : 1,
            pointerEvents: isInitiallySplit ? 'none' : 'auto',
            visibility: isInitiallySplit ? 'hidden' : 'visible'
          }}
        >
          {/* Section 1 Background */}
          <div className="portfolio-bg">
            <div className="bg-text">NADUN</div>
          </div>

          {/* Section 1 Content */}
          <div className="portfolio-container">
            {/* Top Subtitle */}
            <div className="top-section">
              <div className="brand-subtitle">Software Engineer | Designer</div>
            </div>

            {/* Hero Main Heading & CTA */}
            <div className="hero-section">
              <div className="fg-text-container">
                <h1 className="fg-text">PRAMUDITHA</h1>
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
            </div>

            {/* Bottom Description & Footer */}
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

          {/* Left Vertical Social Links */}
          <SocialLinks variant="vertical" />

          {/* Right Vertical Scroll Prompt */}
          <div className="right-scroll-vertical">Scroll Down</div>
        </div>

        {/* ===================================================================
            LAYER 2: MORPH TRANSITION LAYER (0.01 < p < 0.99)
            Executes the 3D departure-board flip, letter travel, and surface wipe.
            =================================================================== */}
        <div
          className="morph-layer-transition"
          ref={morphLayerRef}
          style={{
            opacity: 0,
            visibility: 'hidden'
          }}
          aria-hidden="true"
        >
          {/* Hero Deep Crimson Background */}
          <div className="morph-bg-hero">
            <div className="morph-hero-glow" ref={heroGlowRef} />
            <div className="morph-hero-vignette" />
          </div>

          {/* Split View Light Warm Grey Surface (Wipe) */}
          <div className="morph-bg-split" ref={splitBgRef} />

          {/* Center Horizontal Divider Line */}
          <div className="morph-split-divider-line" ref={dividerLineRef} />

          {/* Split View Watermarks (Code & Telemetry) */}
          <div className="morph-split-watermarks" ref={watermarksRef}>
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

          {/* Bottom Morph Track: NADUN -> AESTHETICS & MOTION */}
          <div
            className="morph-bottom-track"
            ref={bottomTrackRef}
            style={{
              top: '50%',
              transform: 'translate(-50%, -50%) scaleX(5.5) scaleY(8.6667)',
              color: '#920303',
              opacity: 0.55,
              letterSpacing: '-0.04em'
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
                  maxWidth: slot.isExpander ? '0px' : `${slot.naturalWidthCh}ch`,
                  opacity: slot.isExpander ? 0 : 1
                }}
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
                    {slot.startChar}
                  </span>
                </span>
              </span>
            ))}

            <svg
              ref={bottomArrowRef}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="morph-arrow-indicator"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </div>

          {/* Top Morph Track: PRAMUDITHA -> LOGIC & SYSTEMS */}
          <div
            className="morph-top-track"
            ref={topTrackRef}
            style={{
              top: '50%',
              transform: 'translate(-50%, -50%) scaleX(0.9242) scaleY(1.75)',
              color: '#ffffff',
              textShadow: '0 10px 45px rgba(0, 0, 0, 0.95)',
              letterSpacing: '0.05em'
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
                  maxWidth: slot.isExpander ? '0px' : `${slot.naturalWidthCh}ch`,
                  opacity: slot.isExpander ? 0 : 1
                }}
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
                    {slot.startChar}
                  </span>
                </span>
              </span>
            ))}

            <svg
              ref={topArrowRef}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="morph-arrow-indicator"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </div>

          {/* Corner Crosshairs */}
          <div className="morph-crosshairs" ref={crosshairsRef}>
            <div className="portal-hud-crosshair top-left">+</div>
            <div className="portal-hud-crosshair top-right">+</div>
            <div className="portal-hud-crosshair bottom-left">+</div>
            <div className="portal-hud-crosshair bottom-right">+</div>
          </div>
        </div>

        {/* ===================================================================
            LAYER 3: AUTHENTIC STATE B (SPLIT VIEW SECTION)
            Matches original Section 2 with 100% pixel-perfect fidelity.
            =================================================================== */}
        <div
          className={`scroll-section split-scroll-section ${theme}-theme morph-authentic-frame split-frame`}
          ref={authenticSplitRef}
          style={{
            opacity: isInitiallySplit ? 1 : 0,
            pointerEvents: isInitiallySplit ? 'auto' : 'none',
            visibility: isInitiallySplit ? 'visible' : 'hidden'
          }}
        >
          {/* Scroll to Top Link */}
          <div
            className="home-guide-link"
            onClick={handleScrollToTop}
            title="Scroll to Top"
            role="button"
            tabIndex={0}
          >
            <Icon icon="mdi:chevron-up" className="home-guide-icon" />
            <span className="home-guide-text">SCROLL TO TOP</span>
          </div>

          {/* Precision Corner Crosshairs */}
          <div className="portal-hud-crosshair top-left">+</div>
          <div className="portal-hud-crosshair top-right">+</div>
          <div className="portal-hud-crosshair bottom-left">+</div>
          <div className="portal-hud-crosshair bottom-right">+</div>

          {/* Top Half: Logic & Systems (Software Engineer Portal) */}
          <div
            className="split-half top-half"
            onClick={() => {
              soundEngine.playClickSound();
              onNavigate('logic');
            }}
            onMouseEnter={() => soundEngine.playHoverSound()}
            role="button"
            tabIndex={0}
            aria-label="Explore Logic and Systems"
          >
            <div className="split-laser-accent top" aria-hidden="true" />

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

            <div className="split-content-wrapper">
              <div className="portal-telemetry-tag">
                <span className="telemetry-bracket">[</span>
                <span>// 01 ARCHITECTURE &amp; SYSTEMS · SOFTWARE ENGINEER</span>
                <span className="telemetry-bracket">]</span>
              </div>

              <div className="split-title-wrapper">
                <h2 className="split-half-title">
                  <span className="title-line line-1">Logic &amp; </span>
                  <span className="title-line line-2">Systems</span>
                </h2>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="arrow-indicator"
                  aria-hidden="true"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom Half: Aesthetics & Motion (Graphic Designer Portal) */}
          <div
            className="split-half bottom-half"
            onClick={() => {
              soundEngine.playClickSound();
              onNavigate('aesthetics');
            }}
            onMouseEnter={() => soundEngine.playHoverSound()}
            role="button"
            tabIndex={0}
            aria-label="Explore Aesthetics and Motion"
          >
            <div className="split-laser-accent bottom" aria-hidden="true" />

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

            <div className="split-content-wrapper">
              <div className="portal-telemetry-tag">
                <span className="telemetry-bracket">[</span>
                <span>// 02 MOTION &amp; SPATIAL DESIGN · GRAPHIC DESIGNER</span>
                <span className="telemetry-bracket">]</span>
              </div>

              <div className="split-title-wrapper">
                <h2 className="split-half-title">
                  <span className="title-line line-1">Aesthetics </span>
                  <span className="title-line line-2">&amp; Motion</span>
                </h2>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="arrow-indicator"
                  aria-hidden="true"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            FLOATING CONTROLS GROUP (TOP-RIGHT)
            Search, Music, and Theme Toggle fixed throughout.
            =================================================================== */}
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
