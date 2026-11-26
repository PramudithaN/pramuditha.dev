import { useRef, useState } from 'react';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Code2,
  GraduationCap,
  MousePointerClick,
  Sparkles,
} from 'lucide-react';
import type { PageType, ThemeMode } from '../../types';
import './manifesto-section.css';

export interface ManifestoSectionProps {
  theme: ThemeMode;
  onNavigate?: (page: PageType) => void;
  isRevealed?: boolean;
}

interface BioCardItem {
  id: string;
  tag: string;
  title: string;
  copy: string;
  meta: string;
  target: PageType;
  actionLabel: string;
}

const BIO_CARDS: BioCardItem[] = [
  {
    id: 'role',
    tag: 'LOLC Fusion X',
    title: 'Pramuditha Nadun · Software Engineer',
    copy: 'Engineering core banking & enterprise lending systems at LOLC Technologies (2022 – Present).',
    meta: 'Nugegoda, Sri Lanka · Full-Stack & Systems',
    target: 'about',
    actionLabel: 'Open About',
  },
  {
    id: 'education',
    tag: 'Westminster · IIT',
    title: 'BSc (Hons) Software Engineering',
    copy: 'Upper Second Class Honours (2022 – 2026). Bridging AI/ML pipelines, static analysis & cloud systems.',
    meta: 'University of Westminster / IIT Colombo',
    target: 'logic',
    actionLabel: 'Explore Logic',
  },
  {
    id: 'craft',
    tag: 'Dual Discipline',
    title: 'Clean Code × Intentional Motion',
    copy: 'Crafting 3D desktop companions, developer tooling, and cinematic visual interfaces.',
    meta: 'React · TypeScript · Spring Boot · Python · 3D',
    target: 'aesthetics',
    actionLabel: 'View Aesthetics',
  },
];

function CardPreviewIcon({ id }: { id: string }) {
  if (id === 'education') return <GraduationCap size={26} strokeWidth={1.75} />;
  if (id === 'craft') return <Sparkles size={26} strokeWidth={1.75} />;
  return <Code2 size={26} strokeWidth={1.75} />;
}

export default function ManifestoSection({
  theme,
  onNavigate,
  isRevealed = false,
}: ManifestoSectionProps) {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const pointerStartX = useRef<number | null>(null);
  const currentCard = BIO_CARDS[activeCardIndex];

  const cycleCard = () => {
    setActiveCardIndex((prev) => (prev + 1) % BIO_CARDS.length);
  };

  const prevCard = () => {
    setActiveCardIndex((prev) => (prev - 1 + BIO_CARDS.length) % BIO_CARDS.length);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;
    const deltaX = e.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        cycleCard();
      } else {
        prevCard();
      }
    }
  };

  const goTo = (page: PageType) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <section
      className={`manifesto-section ${isRevealed ? 'is-revealed' : ''}`}
      data-theme={theme}
      aria-label="About Pramuditha Nadun"
    >
      {/* Woven Subpixel Grid Backdrop */}
      <div className="manifesto-grid-bg" aria-hidden="true" />

      {/* Centered Acid-Lime Floating Bubble Card */}
      <div className="manifesto-bubble-wrap">
        <div
          className="manifesto-bubble"
          key={currentCard.id}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          {/* Top-right circular dark action button (cycles through profile cards) */}
          <button
            type="button"
            className="manifesto-bubble__cycle-btn"
            onClick={cycleCard}
            aria-label="Next profile highlight"
            title="Next highlight"
          >
            <ArrowUpRight size={15} strokeWidth={2.4} />
          </button>

          {/* Left dark inset preview box */}
          <button
            type="button"
            className="manifesto-bubble__preview"
            onClick={() => goTo(currentCard.target)}
            aria-label={currentCard.actionLabel}
            title={currentCard.actionLabel}
          >
            <span className="manifesto-bubble__preview-chevron" aria-hidden="true">
              &rsaquo;
            </span>
            <span className="manifesto-bubble__preview-icon">
              <CardPreviewIcon id={currentCard.id} />
              <MousePointerClick
                size={15}
                strokeWidth={2.2}
                className="manifesto-bubble__cursor"
                aria-hidden="true"
              />
            </span>
            <span className="manifesto-bubble__preview-tag">{currentCard.tag}</span>
          </button>

          {/* Right authentic bio copy */}
          <div className="manifesto-bubble__content">
            <h2 className="manifesto-bubble__title">{currentCard.title}</h2>
            <p className="manifesto-bubble__copy">{currentCard.copy}</p>
            <div className="manifesto-bubble__meta-row">
              <span className="manifesto-bubble__meta">{currentCard.meta}</span>
              <button
                type="button"
                className="manifesto-bubble__link"
                onClick={() => goTo(currentCard.target)}
              >
                {currentCard.actionLabel} &rarr;
              </button>
            </div>
          </div>

          {/* Bottom speech-bubble pointer notch */}
          <span className="manifesto-bubble__notch" aria-hidden="true" />
        </div>

        {/* Swipe / Tap Controls & Indicator Dots below notch */}
        <div className="manifesto-bubble__controls">
          <button
            type="button"
            className="manifesto-bubble__nav-btn"
            onClick={prevCard}
            aria-label="Previous highlight"
          >
            <ChevronLeft size={14} />
          </button>

          <div className="manifesto-bubble__dots" role="tablist" aria-label="Profile highlights">
            {BIO_CARDS.map((card, idx) => (
              <button
                key={card.id}
                type="button"
                role="tab"
                aria-selected={idx === activeCardIndex}
                aria-label={card.title}
                className={`manifesto-bubble__dot ${
                  idx === activeCardIndex ? 'is-active' : ''
                }`}
                onClick={() => setActiveCardIndex(idx)}
              />
            ))}
          </div>

          <button
            type="button"
            className="manifesto-bubble__nav-btn"
            onClick={cycleCard}
            aria-label="Next highlight"
          >
            <ChevronRight size={14} />
          </button>
        </div>
        <span className="manifesto-bubble__swipe-hint">
          Swipe card or scroll to explore
        </span>
      </div>
    </section>
  );
}
