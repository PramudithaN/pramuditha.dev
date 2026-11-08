import { motion, AnimatePresence } from 'motion/react';
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
    <motion.button
      type="button"
      className={className}
      onClick={onToggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      title={label}
      aria-label={label}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {theme === 'dark' ? (
            <Sun className="theme-toggle-icon" size={15} />
          ) : (
            <Moon className="theme-toggle-icon" size={15} />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
