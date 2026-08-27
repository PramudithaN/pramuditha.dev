import type { ThemeMode } from '../../types';

interface PageTransitionOverlayProps {
  isTransitioning: boolean;
  transitionPhase: 'idle' | 'enter' | 'exit';
  theme: ThemeMode;
}

export default function PageTransitionOverlay({
  isTransitioning,
  transitionPhase,
  theme
}: PageTransitionOverlayProps) {
  if (!isTransitioning || transitionPhase === 'idle') {
    return null;
  }

  return (
    <div
      className={`page-transition-overlay-container ${transitionPhase} ${theme}-theme`}
      aria-hidden="true"
    >
      {/* 3 Staggered smooth rectangles moving at different speeds */}
      <div className="transition-rect rect-1" />
      <div className="transition-rect rect-2" />
      <div className="transition-rect rect-3" />

      {/* Central PR NA Branding Monogram */}
      <div className="transition-center-badge">
        <div className="transition-logo-monogram">
          <span>PR</span>
          <span>NA</span>
        </div>
      </div>
    </div>
  );
}
