import type { SeasonalConfig } from '../types/seasonal';

export const CHRISTMAS_CONFIG: SeasonalConfig = {
  season: 'christmas',
  enabled: true,
  autoExpiryDate: {
    month: 12, // December
    day: 28    // Automatically turns off on December 28th (00:00:00)
  },
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
 * Automatically checks whether the seasonal theme is currently active based on the calendar date.
 * Active through December 27th (23:59:59); automatically deactivates on December 28th (00:00:00).
 */
export function isChristmasSeasonActive(date: Date = new Date()): boolean {
  if (!CHRISTMAS_CONFIG.enabled) return false;

  const expiry = CHRISTMAS_CONFIG.autoExpiryDate;
  if (!expiry) return true;

  const currentMonth = date.getMonth() + 1; // 1 - 12 (Jan = 1, Nov = 11, Dec = 12)
  const currentDay = date.getDate();        // 1 - 31

  // If in December and day is 28 or later, the holiday season has concluded
  if (currentMonth === expiry.month && currentDay >= expiry.day) {
    return false;
  }

  // If before the holiday season (January to October), keep inactive
  if (currentMonth < 11) {
    return false;
  }

  return true;
}

/**
 * Checks if seasonal effects are active and enabled by the user.
 * Always returns false if the season has concluded based on date (Dec 28+).
 */
export function isSeasonalEffectsEnabled(): boolean {
  if (!isChristmasSeasonActive()) {
    return false;
  }

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
