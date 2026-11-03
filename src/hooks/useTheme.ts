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
 * Resolves the theme based on:
 * 1. Saved localStorage preference if explicitly set by the user
 * 2. Night-time detection (dark mode between 18:00 and 06:00)
 * 3. Fallback to 'light' (daytime)
 */
export function getPreferredTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem('portfolio_theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // ignore localStorage errors
  }

  if (isNightTime()) {
    return 'dark';
  }

  return 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(getPreferredTheme);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const nextTheme: ThemeMode = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('portfolio_theme', nextTheme);
      } catch {
        // ignore
      }
      return nextTheme;
    });
  }, []);

  // Update theme when crossing day/night boundary if no manual preference is stored
  useEffect(() => {
    const checkAutoTheme = () => {
      try {
        const saved = localStorage.getItem('portfolio_theme');
        if (!saved) {
          const autoTheme = getPreferredTheme();
          setTheme(autoTheme);
        }
      } catch {
        // ignore
      }
    };

    const interval = setInterval(checkAutoTheme, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { theme, toggleTheme };
}
