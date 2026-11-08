import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface SearchButtonProps {
  onClick: () => void;
  variant?: 'header' | 'floating';
}

export default function SearchButton({ onClick, variant = 'header' }: SearchButtonProps) {
  const handleClick = () => {
    soundEngine.playClickSound();
    onClick();
  };

  const title = 'Quick Search (⌘K / Ctrl+K)';

  if (variant === 'floating') {
    return (
      <motion.button
        type="button"
        className="floating-theme-btn floating-search-btn"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={handleClick}
        title={title}
        aria-label={title}
      >
        <Search size={14} />
        <span>Search</span>
        <kbd className="ctrl-kbd-badge">⌘K</kbd>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      className="theme-mode-toggle-btn header-search-btn"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={handleClick}
      title={title}
      aria-label={title}
    >
      <Search size={15} />
    </motion.button>
  );
}
