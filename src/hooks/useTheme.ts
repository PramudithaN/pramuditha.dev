import { useState, useCallback } from 'react';
import type { ThemeMode } from '../types';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('portfolio_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore localStorage errors
    }
    return 'light';
  });

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

  return { theme, toggleTheme };
}
