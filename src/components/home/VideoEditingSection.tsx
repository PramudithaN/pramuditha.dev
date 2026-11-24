import { useRef, useState } from 'react';
import type { PageType, ThemeMode } from '../../types';
import './video-editing-section.css';

export interface VideoEditingSectionProps {
  theme: ThemeMode;
  onNavigate?: (page: PageType) => void;
}

const WAVEFORM_BARS = [
  18, 28, 22, 34, 42, 26, 52, 38, 24, 62, 48, 30, 56, 74, 44, 36, 68, 86, 52, 40,
  92, 76, 48, 64, 88, 54, 38, 72, 96, 60, 42, 80, 66, 36, 58, 70, 44, 28, 48, 34,
  24, 38, 26, 18, 24, 16, 12, 10,
] as const;

export default function VideoEditingSection({ theme, onNavigate }: VideoEditingSectionProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [playheadPct, setPlayheadPct] = useState<number>(43);
  const [isClapActive, setIsClapActive] = useState<boolean>(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = timelineRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setPlayheadPct(Math.max(4, Math.min(96, pct)));
  };

  const handleOpenReels = () => {
    if (onNavigate) {
      onNavigate('aesthetics');
    }
  };

  return (
    <section
      className="video-edit-section"
      data-theme={theme}
      aria-label="Video Editing and Motion Reels"
    >
      {/* Top Clapperboard Toggle Mark */}
      <header className="video-edit-section__brand">
        <button
          type="button"
          className="video-edit-section__clap-mark"
          data-active={isClapActive}
          onClick={() => setIsClapActive((prev) => !prev)}
          aria-label="Toggle VFX & Motion Studio mark"
        >
          {/* Tilted SVG Cinema Clapperboard Arm */}
          <svg
            className="video-edit-section__clap-arm"
            viewBox="0 0 120 24"
            fill="none"
            aria-hidden="true"
          >
            <rect width="120" height="22" rx="3" fill="currentColor" />
            <path d="M18 0H32L24 22H10L18 0Z" fill="var(--ve-bg)" />
            <path d="M44 0H58L50 22H36L44 0Z" fill="var(--ve-bg)" />
            <path d="M70 0H84L76 22H62L70 0Z" fill="var(--ve-bg)" />
            <path d="M96 0H110L102 22H88L96 0Z" fill="var(--ve-bg)" />
            <circle cx="8" cy="11" r="3" fill="var(--ve-bg)" />
          </svg>

          <span>l</span>
          <span className="video-edit-section__toggle-oo" aria-hidden="true">
            <span className="video-edit-section__toggle-knob" />
            <span className="video-edit-section__toggle-label">
              {isClapActive ? 'FX' : 'CUT'}
            </span>
          </span>
          <span>p</span>
        </button>
        <p className="video-edit-section__tagline">VFX &amp; DESIGN STUDIO</p>
      </header>

      {/* Center Headline + Interactive NLE Timeline */}
      <div className="video-edit-section__center">
        <h2 className="video-edit-section__headline">
          Crafted <span className="video-edit-section__headline-accent">Video Editing</span> &amp; VFX
        </h2>

        <div
          ref={timelineRef}
          className="video-edit-section__timeline"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setPlayheadPct(43)}
          role="presentation"
        >
          {/* Timecode Tick Marks */}
          <div className="video-edit-section__ticks" aria-hidden="true">
            <span className="video-edit-section__tick" />
            <span className="video-edit-section__tick" />
            <span className="video-edit-section__tick" />
            <span className="video-edit-section__tick" />
            <span className="video-edit-section__tick" />
          </div>

          <div className="video-edit-section__tracks">
            {/* Track 1: Primary Video Sequence */}
            <div className="video-edit-section__track-row">
              <div className="video-edit-section__clip video-edit-section__clip--main-left">
                <span className="video-edit-section__clip-label">EDITING</span>
              </div>
              <div className="video-edit-section__clip video-edit-section__clip--main-right" />
            </div>

            {/* Track 2: B-Roll & Cutaways */}
            <div className="video-edit-section__track-row">
              <div className="video-edit-section__clip video-edit-section__clip--broll-left" />
              <div className="video-edit-section__clip video-edit-section__clip--broll-mid" />
            </div>

            {/* Track 3: Audio Clip with Waveform & Red Trim Handle */}
            <div className="video-edit-section__track-row">
              <div className="video-edit-section__clip video-edit-section__clip--audio-trim">
                <svg
                  className="video-edit-section__mini-wave"
                  viewBox="0 0 240 28"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  {WAVEFORM_BARS.slice(0, 32).map((h, idx) => (
                    <rect
                      key={idx}
                      x={idx * 7.5}
                      y={14 - h * 0.12}
                      width="3.5"
                      height={h * 0.24}
                      fill="currentColor"
                    />
                  ))}
                </svg>
              </div>
            </div>

            {/* Track 4: Master Audio Waveform */}
            <svg
              className="video-edit-section__master-wave"
              viewBox="0 0 480 64"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {WAVEFORM_BARS.map((h, idx) => (
                <rect
                  key={idx}
                  x={idx * 10}
                  y={32 - h * 0.3}
                  width="5"
                  height={h * 0.6}
                  rx="1"
                  fill="currentColor"
                />
              ))}
            </svg>
          </div>

          {/* Interactive Crimson Playhead */}
          <div
            className="video-edit-section__playhead"
            style={{ left: `${playheadPct}%` }}
            aria-hidden="true"
          >
            <span className="video-edit-section__playhead-cap" />
          </div>
        </div>

        {/* Bottom CTA & Disciplines */}
        <div className="video-edit-section__cta-block">
          <button
            type="button"
            className="video-edit-section__pill-btn"
            onClick={handleOpenReels}
          >
            Watch the reels
          </button>

          <p className="video-edit-section__disciplines">
            MOTION GRAPHICS &nbsp;|&nbsp; VFX COMPOSITING &nbsp;|&nbsp; COLOR GRADING
          </p>

          <a
            href="mailto:pramudithanadun@gmail.com"
            className="video-edit-section__email"
          >
            pramudithanadun@gmail.com
          </a>
        </div>
      </div>

      {/* Bottom Location Row */}
      <footer className="video-edit-section__location">
        <span>VFX &amp; Motion</span>
        <svg
          className="video-edit-section__pin"
          viewBox="0 0 24 28"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 2C7.58 2 4 5.58 4 10C4 15.8 12 24 12 24C12 24 20 15.8 20 10C20 5.58 16.42 2 12 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx="12" cy="25.5" rx="6" ry="1.5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <span>Nugegoda, LK</span>
      </footer>
    </section>
  );
}
