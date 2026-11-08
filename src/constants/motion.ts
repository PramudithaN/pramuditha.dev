import type { Variants, Transition } from 'motion/react';

// ============================================================================
// MOTION PHYSICS & SPRING PRESETS
// ============================================================================

export const springs = {
  /** Snappy & responsive: for tabs, cursor highlights, button clicks */
  snappy: {
    type: 'spring',
    stiffness: 420,
    damping: 32,
    mass: 0.8
  } as const satisfies Transition,

  /** Smooth & fluid: for modal windows, card expansions, accordions */
  smooth: {
    type: 'spring',
    stiffness: 280,
    damping: 28,
    mass: 1
  } as const satisfies Transition,

  /** Gentle & floating: for large layout shifts, page cross-slides */
  gentle: {
    type: 'spring',
    stiffness: 180,
    damping: 24,
    mass: 1.1
  } as const satisfies Transition,

  /** Bouncy & lively: for badges, notifications, celebratory micro-interactions */
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 18,
    mass: 0.9
  } as const satisfies Transition
};

// ============================================================================
// CURATED TIMING EASINGS (Cubic Bezier)
// ============================================================================

export const easings = {
  /** The signature Awwwards luxury deceleration curve */
  luxurious: [0.16, 1, 0.3, 1] as const,
  /** Quick entry with natural mechanical friction */
  smoothOut: [0.25, 0.9, 0.3, 1] as const,
  /** Subtle anticipation before swift dispatch */
  anticipate: [0.38, 0.005, 0.215, 1] as const
};

// ============================================================================
// SHARED LAYOUT IDENTIFIERS (Eliminates typo bugs in layoutId)
// ============================================================================

export const MOTION_LAYOUT_IDS = {
  SUBPAGE_ACTIVE_TAB: 'subpage-header-active-pill',
  SUBPAGE_HOVER_TAB: 'subpage-header-hover-pill',
  PROJECT_CATEGORY_ACTIVE: 'project-showcase-active-category',
  GALLERY_CATEGORY_ACTIVE: 'video-showcase-active-category',
  COMMAND_PALETTE_SELECTION: 'command-palette-selected-pill'
} as const;

// ============================================================================
// STANDARD REUSABLE ANIMATION VARIANTS
// ============================================================================

export const fadeInUpVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easings.luxurious
    }
  }
};

export const fadeInScaleVariant: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: easings.luxurious
    }
  }
};

export const staggerContainerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export const fastStaggerContainerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05
    }
  }
};
