import type { ThemeMode } from '../../types';
import ThemeToggle from './ThemeToggle';

interface SubpageHeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onNavigateHome: () => void;
  onBack: () => void;
}

export default function SubpageHeader({
  theme,
  onToggleTheme,
  onNavigateHome,
  onBack
}: SubpageHeaderProps) {
  const handleLogoClick = () => {
    onNavigateHome();
    setTimeout(() => {
      const scrollContainer = document.querySelector('.scroll-container');
      if (scrollContainer) scrollContainer.scrollTo({ top: 0 });
    }, 50);
  };

  return (
    <div className="top-header-row">
      <div className="stacked-logo" onClick={handleLogoClick}>
        <span>PR</span>
        <span>NA</span>
      </div>
      <div className="header-buttons">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} variant="header" />
        <button type="button" className="theme-toggle-btn" onClick={onBack}>
          ‹ Back
        </button>
      </div>
    </div>
  );
}
