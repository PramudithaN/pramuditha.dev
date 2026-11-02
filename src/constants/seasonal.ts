import type { SeasonalConfig } from '../types/seasonal';

export const CHRISTMAS_CONFIG: SeasonalConfig = {
  season: 'christmas',
  enabled: true,
  snowfall: {
    enabled: true,
    densityDesktop: 85,
    densityMobile: 35,
    subpageDensityDesktop: 20,
    subpageDensityMobile: 8,
    minSize: 1.5,
    maxSize: 4.5,
    fallSpeed: 1.1,
    windForce: 4.0,
    interactionRadius: 130,
    glowInDark: true
  },
  mascot: {
    enabled: true,
    type: 'santa',
    minPeekIntervalSec: 18,
    maxPeekIntervalSec: 32,
    peekDurationSec: 4.2,
    phrases: [
      'Ho Ho Ho! Merry Christmas! 🎅✨',
      'Warm holiday wishes from Pramuditha! ❄️',
      'Checking my list... you are awesome! 📜🎁',
      'Delightfully frosty today, stay warm! ⛄',
      'Wishing you peace, joy and clean code! 🎄'
    ]
  },
  showHatOnBranding: true,
  showSeasonalBadge: true
};

const STORAGE_KEY = 'portfolio_seasonal_effects_enabled';

/**
 * Checks if seasonal effects are active and enabled by the user.
 */
export function isSeasonalEffectsEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      return saved === 'true';
    }
  } catch {
    // ignore localStorage errors
  }
  return CHRISTMAS_CONFIG.enabled;
}

/**
 * Saves visitor's preference to toggle seasonal effects on or off.
 */
export function setSeasonalEffectsEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(enabled));
    window.dispatchEvent(new Event('seasonal_preference_changed'));
  } catch {
    // ignore
  }
}
