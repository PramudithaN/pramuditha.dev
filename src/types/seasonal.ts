export type SeasonId = 'christmas' | 'newyear' | 'halloween' | 'spring' | 'none';

export interface SnowfallOptions {
  enabled: boolean;
  densityDesktop: number;
  densityMobile: number;
  subpageDensityDesktop?: number;
  subpageDensityMobile?: number;
  minSize: number;
  maxSize: number;
  fallSpeed: number;
  windForce: number;
  interactionRadius: number;
  glowInDark: boolean;
}

export interface MascotOptions {
  enabled: boolean;
  type: 'santa';
  minPeekIntervalSec: number;
  maxPeekIntervalSec: number;
  peekDurationSec: number;
  phrases: string[];
}

export interface SeasonalConfig {
  season: SeasonId;
  enabled: boolean;
  snowfall: SnowfallOptions;
  mascot: MascotOptions;
  showHatOnBranding: boolean;
  showSeasonalBadge: boolean;
}
