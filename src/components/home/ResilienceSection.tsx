import { useState } from 'react';
import type { PageType } from '../../types';
import './resilience-section.css';

export interface ResilienceSectionProps {
  onNavigate?: (page: PageType) => void;
}

interface DisciplineMode {
  id: 'minimalist' | 'random' | 'design';
  label: string;
  headlineTop: string;
  headlineBottom: string;
  subhead: string;
  menuTitle: string;
  items: readonly string[];
  captionTop: string;
  captionBottom: string;
}

const DISCIPLINE_MODES: readonly DisciplineMode[] = [
  {
    id: 'minimalist',
    label: 'Minimalist',
    headlineTop: 'THE FIGHT',
    headlineBottom: "ISN'T OVER",
    subhead: 'Even in defeat, keep fighting',
    menuTitle: 'Quit',
    items: ['Fall.', 'Break.', 'Rise again.', 'Keep fighting.', 'Never surrender.'],
    captionTop: 'Surreal',
    captionBottom: 'conceptual',
  },
  {
    id: 'random',
    label: 'Random',
    headlineTop: 'THE FIGHT',
    headlineBottom: "ISN'T OVER",
    subhead: 'Even in failure, keep shipping',
    menuTitle: 'Abort',
    items: ['Trace.', 'Debug.', 'Refactor.', 'Deploy clean.', 'Never surrender.'],
    captionTop: 'Systems',
    captionBottom: 'engineering',
  },
  {
    id: 'design',
    label: 'Design',
    headlineTop: 'THE FIGHT',
    headlineBottom: "ISN'T OVER",
    subhead: 'Even in defeat, keep fighting',
    menuTitle: 'Quit',
    items: ['Fall.', 'Break.', 'Rise again.', 'Keep fighting.', 'Never surrender.'],
    captionTop: 'Surreal',
    captionBottom: 'conceptual',
  },
];

export default function ResilienceSection({ onNavigate }: ResilienceSectionProps) {
  const [activeModeId, setActiveModeId] = useState<DisciplineMode['id']>('design');

  const activeMode =
    DISCIPLINE_MODES.find((m) => m.id === activeModeId) || DISCIPLINE_MODES[2];

  return (
    <section
      className="resilience-section"
      aria-label="Resilience Mindset Poster"
    >
      {/* Top Bar */}
      <header className="resilience-section__topbar">
        <nav className="resilience-section__tabs" aria-label="Poster themes">
          {DISCIPLINE_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={`resilience-section__tab ${
                activeModeId === mode.id ? 'resilience-section__tab--active' : ''
              }`}
              onClick={() => setActiveModeId(mode.id)}
            >
              {mode.label}
            </button>
          ))}
        </nav>

        <svg
          className="resilience-section__bookmark"
          viewBox="0 0 28 28"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M8 5C8 3.9 8.9 3 10 3H20C21.1 3 22 3.9 22 5V21L17 18.2V7C17 6.45 16.55 6 16 6H8V5Z"
            opacity="0.72"
          />
          <path d="M5 8C5 6.9 5.9 6 7 6H15C16.1 6 17 6.9 17 8V24L11 20.5L5 24V8Z" />
        </svg>
      </header>

      {/* Center Poster Stage */}
      <div className="resilience-section__stage">
        <div className="resilience-section__headline-block">
          <h2 className="resilience-section__headline">
            {activeMode.headlineTop}
            <br />
            {activeMode.headlineBottom}
          </h2>
          <p className="resilience-section__subhead">{activeMode.subhead}</p>
        </div>

        <div className="resilience-section__figure-wrap">
          <img
            src="/images/resilience-knight.png"
            alt="Armored knight kneeling with arrows"
            className="resilience-section__knight-img"
            loading="lazy"
          />

          {/* Floating Context Menu Card */}
          <aside className="resilience-section__menu" aria-label="Mindset principles">
            <div className="resilience-section__menu-bar">{activeMode.menuTitle}</div>
            <ul className="resilience-section__menu-list">
              {activeMode.items.map((item) => (
                <li key={item} className="resilience-section__menu-item">
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>

      {/* Bottom Bar */}
      <footer className="resilience-section__bottombar">
        <p className="resilience-section__caption">
          {activeMode.captionTop}
          <br />
          {activeMode.captionBottom}
        </p>

        <button
          type="button"
          className="resilience-section__next-btn"
          onClick={() => onNavigate?.('logic')}
          aria-label="Explore Logic & Systems"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M6 3.5L10.5 8L6 12.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </footer>
    </section>
  );
}
