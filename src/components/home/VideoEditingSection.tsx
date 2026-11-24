import type { PageType, ThemeMode } from '../../types';
import { defaultVideoReels } from '../../services/contentStore';
import './video-editing-section.css';

export interface VideoEditingSectionProps {
  theme: ThemeMode;
  onNavigate?: (page: PageType) => void;
}

export default function VideoEditingSection({
  theme,
  onNavigate,
}: VideoEditingSectionProps) {
  const reelOne = defaultVideoReels[0];
  const reelTwo = defaultVideoReels[1] || defaultVideoReels[0];
  const reelThree = defaultVideoReels[2] || defaultVideoReels[0];

  return (
    <section
      id="video-editing"
      className="video-triptych"
      data-theme={theme}
      aria-label="Video Editing and VFX Reels"
    >
      {/* Band 1: Warm Golden / Emerald Spotlight */}
      <a
        href={reelOne.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="video-triptych__band"
        aria-label={`Watch ${reelOne.title}`}
      >
        <img
          src={reelOne.thumbnail}
          alt={reelOne.title}
          className="video-triptych__bg"
          loading="lazy"
        />
        <div
          className="video-triptych__overlay video-triptych__overlay--heaven"
          aria-hidden="true"
        />

        <div className="video-triptych__inner">
          <div className="video-triptych__title-block">
            <span className="video-triptych__kicker">
              01 // {reelOne.year} &middot; {reelOne.duration}
            </span>
            <h2 className="video-triptych__title">
              ADSYNC
              <br />
              PITCH
            </h2>
          </div>

          <p className="video-triptych__desc video-triptych__desc--right">
            {reelOne.description}
          </p>
        </div>
      </a>

      {/* Band 2: Monochrome Backlit Halo */}
      <a
        href={reelTwo.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="video-triptych__band"
        aria-label={`Watch ${reelTwo.title}`}
      >
        <img
          src={reelTwo.thumbnail}
          alt={reelTwo.title}
          className="video-triptych__bg"
          loading="lazy"
        />
        <div
          className="video-triptych__overlay video-triptych__overlay--past"
          aria-hidden="true"
        />

        <div className="video-triptych__inner">
          <p className="video-triptych__desc">
            {reelTwo.description}
          </p>

          <div className="video-triptych__title-block video-triptych__title-block--right">
            <span className="video-triptych__kicker">
              02 // {reelTwo.year} &middot; {reelTwo.duration}
            </span>
            <h2 className="video-triptych__title">THE DREAM</h2>
          </div>
        </div>
      </a>

      {/* Band 3: Crimson / Active Primary Backlit */}
      <a
        href={reelThree.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="video-triptych__band"
        aria-label={`Watch ${reelThree.title}`}
      >
        <img
          src={reelThree.thumbnail}
          alt={reelThree.title}
          className="video-triptych__bg"
          loading="lazy"
        />
        <div
          className="video-triptych__overlay video-triptych__overlay--crimson"
          aria-hidden="true"
        />

        <div className="video-triptych__inner">
          <div className="video-triptych__title-block">
            <span className="video-triptych__kicker">
              03 // {reelThree.year} &middot; {reelThree.duration}
            </span>
            <h2 className="video-triptych__title">
              <span className="video-triptych__title--spaced">MOTION</span>
              <br />
              REELS
            </h2>
          </div>

          <p className="video-triptych__desc video-triptych__desc--right">
            {reelThree.description}
          </p>
        </div>
      </a>

      {/* Bottom Full-Width Action Bar */}
      <div className="video-triptych__watch-all">
        <span className="video-triptych__meta">
          Motion Graphics &middot; VFX Compositing &middot; Color Grading
        </span>

        <button
          type="button"
          className="video-triptych__cta"
          onClick={() => onNavigate?.('aesthetics')}
        >
          Watch All Reels in Aesthetics ↗
        </button>
      </div>
    </section>
  );
}
