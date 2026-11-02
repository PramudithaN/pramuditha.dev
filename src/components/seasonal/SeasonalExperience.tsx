import React, { useState, useEffect, useCallback } from 'react';
import type { ThemeMode } from '../../types/portfolio';
import type { SeasonalConfig } from '../../types/seasonal';
import {
  CHRISTMAS_CONFIG,
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
  const [isEnabled, setIsEnabled] = useState<boolean>(isSeasonalEffectsEnabled);

  useEffect(() => {
    const handlePrefChange = () => {
      setIsEnabled(isSeasonalEffectsEnabled());
    };

    window.addEventListener('seasonal_preference_changed', handlePrefChange);
    return () => window.removeEventListener('seasonal_preference_changed', handlePrefChange);
  }, []);

  const handleToggle = useCallback(() => {
    const nextState = !isEnabled;
    setIsEnabled(nextState);
    setSeasonalEffectsEnabled(nextState);
  }, [isEnabled]);

  // If season itself is disabled in config, don't render anything
  if (!config.enabled) return null;

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
