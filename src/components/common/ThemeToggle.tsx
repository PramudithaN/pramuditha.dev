import { Sun, Moon } from 'lucide-react';
import type { ThemeMode } from '../../types';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
  variant?: 'header' | 'floating';
}

export default function ThemeToggle({ theme, onToggle, variant = 'header' }: ThemeToggleProps) {
  const className = variant === 'floating' ? 'floating-theme-btn' : 'theme-mode-toggle-btn';
  const label = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';

  return (
    <button
      type="button"
      className={className}
      onClick={onToggle}
      title={label}
      aria-label={label}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="theme-toggle-icon" size={13} />
          <span>LIGHT</span>
        </>
      ) : (
        <>
          <Moon className="theme-toggle-icon" size={13} />
          <span>DARK</span>
        </>
      )}
    </button>
  );
}
