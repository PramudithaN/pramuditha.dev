import { useState, useCallback, useEffect, useRef } from 'react';
import { createInkTransition, type InkTransition, type Point } from '@pramuditha/theme.changer';
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
 * Returns the default theme ('light') so editorial light/paper sections
 * remain consistent regardless of local time, while still allowing manual toggle.
 */
export function getAutoTheme(): ThemeMode {
  return 'light';
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
  const inkRef = useRef<InkTransition | null>(null);

  // Keep DOM data-theme and classes in sync with theme state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark-theme', theme === 'dark');
    document.documentElement.classList.toggle('light-theme', theme === 'light');
  }, [theme]);

  // Initialize and mount @pramuditha/theme.changer WebGL2 transition engine
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const ink = createInkTransition({
        preset: 'ink',
        captureMode: 'viewport'
      });
      inkRef.current = ink;
    } catch (err) {
      console.warn('[theme.changer] Could not initialize WebGL2 InkTransition:', err);
    }

    // Synchronize React state whenever theme.changer updates dataset.theme
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          const nextTheme = document.documentElement.dataset.theme as ThemeMode;
          if (nextTheme === 'dark' || nextTheme === 'light') {
            setTheme(nextTheme);

            const autoTheme = getAutoTheme();
            try {
              if (nextTheme === autoTheme) {
                sessionStorage.removeItem('portfolio_theme');
              } else {
                sessionStorage.setItem('portfolio_theme', nextTheme);
              }
            } catch {
              // ignore storage errors
            }
          }
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleTheme = useCallback(
    (event?: React.MouseEvent<HTMLElement> | MouseEvent | Point | { clientX?: number; clientY?: number }) => {
      if (inkRef.current) {
        if (
          event &&
          'clientX' in event &&
          typeof event.clientX === 'number' &&
          typeof event.clientY === 'number'
        ) {
          inkRef.current.toggle({ x: event.clientX, y: event.clientY });
        } else if (event && 'x' in event && typeof event.x === 'number') {
          inkRef.current.toggle(event as Point);
        } else {
          inkRef.current.toggle();
        }
        return;
      }

      // Fallback if InkTransition is not available
      setTheme((prev) => {
        const nextTheme: ThemeMode = prev === 'light' ? 'dark' : 'light';
        const autoTheme = getAutoTheme();
        try {
          if (nextTheme === autoTheme) {
            sessionStorage.removeItem('portfolio_theme');
          } else {
            sessionStorage.setItem('portfolio_theme', nextTheme);
          }
        } catch {
          // ignore storage errors
        }
        return nextTheme;
      });
    },
    []
  );

  // Update theme when crossing day/night boundary if no manual session preference is active
  useEffect(() => {
    const checkAutoTheme = () => {
      try {
        const saved = sessionStorage.getItem('portfolio_theme');
        if (!saved) {
          const autoTheme = getAutoTheme();
          if (document.documentElement.dataset.theme !== autoTheme) {
            if (inkRef.current) {
              inkRef.current.toggle();
            } else {
              setTheme(autoTheme);
            }
          }
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

  return { theme, toggleTheme, ink: inkRef.current };
}
