import React from 'react';

interface SeasonalToggleProps {
  enabled: boolean;
  onToggle: () => void;
  isHomePage?: boolean;
}

export const SeasonalToggle: React.FC<SeasonalToggleProps> = ({ enabled, onToggle, isHomePage = true }) => {
  return (
    <button
      type="button"
      className={`seasonal-toggle-btn ${enabled ? 'active' : ''}${isHomePage ? '' : ' subpage-mode'}`}
      onClick={onToggle}
      title={enabled ? 'Turn off holiday snowfall' : 'Turn on holiday snowfall'}
      aria-label={enabled ? 'Turn off holiday snowfall' : 'Turn on holiday snowfall'}
    >
      <span className="seasonal-toggle-icon" aria-hidden="true">
        ❄️
      </span>
      <span>{enabled ? 'Holiday Mode' : 'Snow Off'}</span>
    </button>
  );
};
