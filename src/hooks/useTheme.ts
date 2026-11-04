import { useState, useCallback, useEffect } from 'react';
import type { ThemeMode } from '../types';

/**
 * Determines if the current local time is night time (6:00 PM to 6:00 AM / 18:00 to 06:00).
 */
export function isNightTime(): boolean {
  if (typeof window === 'undefined') return false;
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
}

/**
 * Returns the automatic time-based theme:
 * 'dark' between 18:00 and 06:00, 'light' otherwise.
 */
export function getAutoTheme(): ThemeMode {
  return isNightTime() ? 'dark' : 'light';
}

/**
 * Resolves the theme based on:
 * 1. Saved sessionStorage preference if explicitly set by the user during this session
 * 2. Automatic time-based theme (light during daytime, dark at night)
 *
 * Also clears any legacy persistent localStorage preference so users aren't locked into past overrides.
 */
export function getPreferredTheme(): ThemeMode {
  if (typeof window !== 'undefined') {
    // Clear legacy persistent localStorage item to prevent locking users into old overrides
    try {
      if (localStorage.getItem('portfolio_theme')) {
        localStorage.removeItem('portfolio_theme');
      }
    } catch {
      // ignore storage errors
    }

    try {
      const saved = sessionStorage.getItem('portfolio_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore storage errors
    }
  }

  return getAutoTheme();
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(getPreferredTheme);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const nextTheme: ThemeMode = prev === 'light' ? 'dark' : 'light';
      const autoTheme = getAutoTheme();
      try {
        if (nextTheme === autoTheme) {
          // If the user toggled back to match the natural time-based theme,
          // remove the session override to return to auto-theming
          sessionStorage.removeItem('portfolio_theme');
        } else {
          sessionStorage.setItem('portfolio_theme', nextTheme);
        }
      } catch {
        // ignore storage errors
      }
      return nextTheme;
    });
  }, []);

  // Update theme when crossing day/night boundary if no manual session preference is active
  useEffect(() => {
    const checkAutoTheme = () => {
      try {
        const saved = sessionStorage.getItem('portfolio_theme');
        if (!saved) {
          const autoTheme = getAutoTheme();
          setTheme(autoTheme);
        }
      } catch {
        // ignore storage errors
      }
    };

    const interval = setInterval(checkAutoTheme, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { theme, toggleTheme };
}

