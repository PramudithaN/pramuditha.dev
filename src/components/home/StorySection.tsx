import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { PageType, ThemeMode } from '../../types';
import './story-section.css';

export interface StorySectionProps {
  theme: ThemeMode;
  onNavigate?: (page: PageType) => void;
}

const WAVEFORM_BARS = [
  10, 18, 12, 24, 14, 28, 16, 22, 11, 26, 15, 20, 12, 18, 9,
];

export default function StorySection({ theme, onNavigate }: StorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const scrollRoot = el.closest<HTMLElement>('.scroll-container');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.disconnect();
            break;
          }
        }
      },
      {
        root: scrollRoot ?? null,
        threshold: 0.25,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`story-section ${isRevealed ? 'is-revealed' : ''} ${
        isPlaying ? 'is-playing' : ''
      }`}
      data-theme={theme}
      aria-label="What's The Story — Beyond Engineering"
    >
      <div className="story-section__grid">
        {/* Lockup 1: WHAT'S THE STORY? + Speech-Bubble Yellow Underline */}
        <div className="story-lockup story-lockup--question">
          <div className="story-question__eyebrow">WHAT&apos;S THE</div>
          <div className="story-question__word">
            <span>STORY</span>
            <span className="story-question__mark">?</span>
          </div>
          <svg
            className="story-question__underline"
            viewBox="0 0 280 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              pathLength={1}
              d="M4 8H62L62 28L94 8H276"
              stroke="#facc15"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Lockup 2: Play + Waveform + Speech Pill + Beyond Engineering */}
        <div className="story-lockup story-lockup--beyond">
          <div className="story-beyond__bar">
            <button
              type="button"
              className="story-beyond__play"
              onClick={() => setIsPlaying((prev) => !prev)}
              aria-label={isPlaying ? 'Pause waveform' : 'Play waveform'}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={11} fill="#facc15" stroke="#facc15" />
              ) : (
                <Play size={11} fill="#facc15" stroke="#facc15" />
              )}
            </button>

            <div className="story-beyond__wave" aria-hidden="true">
              {WAVEFORM_BARS.map((height, idx) => (
                <span
                  key={idx}
                  className="story-beyond__wave-bar"
                  style={
                    {
                      '--bar-h': `${height}px`,
                      '--bar-i': idx,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>

            <button
              type="button"
              className="story-beyond__pill"
              onClick={() => onNavigate?.('about')}
              title="Read Pramuditha's story"
            >
              <span>Pram&apos;s Corner</span>
              <span className="story-beyond__pill-tail" aria-hidden="true" />
            </button>
          </div>

          <h2 className="story-beyond__title">
            <span>Beyond</span>
            <span>Engineering</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
