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
      <button
        type="button"
        className="floating-theme-btn floating-search-btn"
        onClick={handleClick}
        title={title}
        aria-label={title}
      >
        <Search size={14} />
        <span>Search</span>
        <kbd className="ctrl-kbd-badge">⌘K</kbd>
      </button>
    );
  }

  return (
    <button
      type="button"
      className="theme-mode-toggle-btn header-search-btn"
      onClick={handleClick}
      title={title}
      aria-label={title}
    >
      <Search size={15} />
    </button>
  );
}
