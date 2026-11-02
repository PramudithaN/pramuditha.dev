import React, { useState, useEffect, useCallback } from 'react';
import type { ThemeMode } from '../../types/portfolio';
import type { SeasonalConfig } from '../../types/seasonal';
import {
  CHRISTMAS_CONFIG,
  isChristmasSeasonActive,
  isSeasonalEffectsEnabled,
  setSeasonalEffectsEnabled
} from '../../constants/seasonal';
import { SnowfallCanvas } from './SnowfallCanvas';
import { PeekingSanta } from './PeekingSanta';
import { SeasonalToggle } from './SeasonalToggle';

interface SeasonalExperienceProps {
  theme: ThemeMode;
  config?: SeasonalConfig;
  isHomePage?: boolean;
}

export const SeasonalExperience: React.FC<SeasonalExperienceProps> = ({
  theme,
  config = CHRISTMAS_CONFIG,
  isHomePage = true
}) => {
  const [isActiveSeason, setIsActiveSeason] = useState<boolean>(isChristmasSeasonActive);
  const [isEnabled, setIsEnabled] = useState<boolean>(isSeasonalEffectsEnabled);

  useEffect(() => {
    const handlePrefChange = () => {
      setIsActiveSeason(isChristmasSeasonActive());
      setIsEnabled(isSeasonalEffectsEnabled());
    };

    window.addEventListener('seasonal_preference_changed', handlePrefChange);

    // Periodically re-check calendar date boundary (e.g. crossing midnight into Dec 28)
    const interval = setInterval(handlePrefChange, 60000);

    return () => {
      window.removeEventListener('seasonal_preference_changed', handlePrefChange);
      clearInterval(interval);
    };
  }, []);

  const handleToggle = useCallback(() => {
    const nextState = !isEnabled;
    setIsEnabled(nextState);
    setSeasonalEffectsEnabled(nextState);
  }, [isEnabled]);

  // If season itself is disabled in config or expired by date (Dec 28+), don't render anything
  if (!config.enabled || !isActiveSeason) return null;

  return (
    <>
      {/* Interactive Snowfall Particle Canvas */}
      {isEnabled && config.snowfall.enabled && (
        <SnowfallCanvas theme={theme} config={config.snowfall} isHomePage={isHomePage} />
      )}

      {/* Peeking Santa Mascot */}
      {isEnabled && config.mascot.enabled && (
        <PeekingSanta theme={theme} config={config.mascot} />
      )}

      {/* Optional Visitor Seasonal Toggle Switch */}
      {config.showSeasonalBadge && (
        <SeasonalToggle enabled={isEnabled} onToggle={handleToggle} />
      )}
    </>
  );
};
