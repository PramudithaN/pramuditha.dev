import type { PageType, ThemeMode } from '../../types';
import SilhouettePortrait from './SilhouettePortrait';
import './hero-section.css';

export interface HeroSectionProps {
  theme: ThemeMode;
  onNavigate?: (page: PageType) => void;
}

interface VisionTileProps {
  src: string;
  alt: string;
  badge: string;
  onClick: () => void;
}

function VisionTile({ src, alt, badge, onClick }: VisionTileProps) {
  return (
    <button
      type="button"
      className="hero-vision__tile"
      onClick={onClick}
      aria-label={badge}
    >
      <img src={src} alt={alt} className="hero-vision__img" loading="eager" />
      <span className="hero-vision__badge" aria-hidden="true">
        {badge}
      </span>
    </button>
  );
}

export default function HeroSection({ theme, onNavigate }: HeroSectionProps) {
  const goTo = (page: PageType) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <section
      className="hero-vision"
      data-theme={theme}
      aria-label="Hero Section"
    >
      <div className="hero-vision__cluster">
        {/* Left Vertical Typewriter Note */}
        <p className="hero-vision__note hero-vision__note-left" aria-hidden="true">
          Stay focused on
          <br />
          your goals.
        </p>

        {/* Top-Center Typewriter Note */}
        <p className="hero-vision__note hero-vision__note-top" aria-hidden="true">
          Live in the
          <br />
          moment.
        </p>

        {/* Tile 1: Top-Left Tall Portrait -> About Me (Profile Silhouette) */}
        <div className="hero-vision__slot-tl">
          <button
            type="button"
            className="hero-vision__tile"
            onClick={() => goTo('about')}
            aria-label="About Me ↗"
          >
            <SilhouettePortrait />
            <span className="hero-vision__badge" aria-hidden="true">
              About Me ↗
            </span>
          </button>
        </div>

        {/* Tile 3: Center-Top Tall Portrait -> Logic & Systems */}
        <div className="hero-vision__slot-ct">
          <VisionTile
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80"
            alt="Software Engineering and Code Systems"
            badge="Logic & Systems ↗"
            onClick={() => goTo('logic')}
          />
        </div>

        {/* Right Column Stack: Compact Square + Wide Landscape */}
        <div className="hero-vision__slot-right-stack">
          <div className="hero-vision__slot-rt-tile">
            <VisionTile
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=900&q=80"
              alt="Localization Check Developer Tooling"
              badge="Localization Check ↗"
              onClick={() => goTo('localization')}
            />
          </div>
          <div className="hero-vision__slot-rm-tile">
            <VisionTile
              src="https://images.unsplash.com/photo-1742837442755-caf3f540c30d?auto=format&fit=crop&w=1200&q=80"
              alt="Aesthetics, Video Editing & VFX"
              badge="Aesthetics & Motion ↗"
              onClick={() => goTo('aesthetics')}
            />
          </div>
        </div>

        {/* Tile 2: Bottom-Left Landscape -> Education / Journey + Handwritten Script */}
        <div className="hero-vision__slot-bl">
          <VisionTile
            src="/images/about/UOW.webp"
            alt="University of Westminster & Journey"
            badge="Journey & Education ↗"
            onClick={() => goTo('about')}
          />
          <header className="hero-vision__script-wrap">
            <h1 className="hero-vision__script-title">Pramuditha Nadun</h1>
            <p className="hero-vision__script-role">Software Engineer · LOLC</p>
          </header>
        </div>

        {/* Tile 4: Center-Bottom Square -> Reminder.afk */}
        <div className="hero-vision__slot-cb">
          <VisionTile
            src="https://images.unsplash.com/photo-1755436613066-066d20f6445a?auto=format&fit=crop&w=900&q=80"
            alt="Reminder.afk Desktop Companion"
            badge="Reminder.afk ↗"
            onClick={() => goTo('reminder')}
          />
        </div>

        {/* Bottom-Right Vertical Typewriter Note */}
        <p className="hero-vision__note hero-vision__note-right" aria-hidden="true">
          Build with
          <br />
          purpose.
        </p>
      </div>

      {/* Minimal Direct Section Links */}
      <nav className="hero-vision__nav" aria-label="Portfolio sections">
        <button
          type="button"
          className="hero-vision__nav-link"
          onClick={() => goTo('about')}
        >
          About
        </button>
        <span aria-hidden="true">·</span>
        <button
          type="button"
          className="hero-vision__nav-link"
          onClick={() => goTo('logic')}
        >
          Logic &amp; Systems
        </button>
        <span aria-hidden="true">·</span>
        <button
          type="button"
          className="hero-vision__nav-link"
          onClick={() => goTo('aesthetics')}
        >
          Aesthetics
        </button>
        <span aria-hidden="true">·</span>
        <button
          type="button"
          className="hero-vision__nav-link"
          onClick={() => goTo('reminder')}
        >
          Reminder.afk
        </button>
        <span aria-hidden="true">·</span>
        <button
          type="button"
          className="hero-vision__nav-link"
          onClick={() => goTo('localization')}
        >
          Localization Check
        </button>
      </nav>
    </section>
  );
}
