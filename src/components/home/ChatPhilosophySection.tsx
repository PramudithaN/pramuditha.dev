import { useEffect, useRef, useState } from 'react';
import type { PageType, ThemeMode } from '../../types';
import './chat-philosophy-section.css';

export interface ChatPhilosophySectionProps {
  theme: ThemeMode;
  onNavigate?: (page: PageType) => void;
}

const CHAT_MESSAGES = [
  'Call me obsessed, but...',
  'Clean code should feel just as good as it runs.',
  'Systems by day, motion & 3D by night.',
] as const;

export default function ChatPhilosophySection({
  theme,
  onNavigate,
}: ChatPhilosophySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const scrollRoot = el.closest<HTMLElement>('.scroll-container');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHasStarted(true);
            observer.disconnect();
            break;
          }
        }
      },
      {
        root: scrollRoot ?? null,
        threshold: 0.35,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setVisibleCount(CHAT_MESSAGES.length);
      return;
    }

    const timers = [
      window.setTimeout(() => setVisibleCount(1), 850),
      window.setTimeout(() => setVisibleCount(2), 1950),
      window.setTimeout(() => setVisibleCount(3), 3150),
    ];

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [hasStarted]);

  return (
    <section
      ref={sectionRef}
      className={`chat-philosophy ${hasStarted ? 'is-started' : ''}`}
      data-theme={theme}
      aria-label="Engineering and Design Mindset"
    >
      <div className="chat-philosophy__stack">
        {CHAT_MESSAGES.map((text, idx) => {
          const isShown = idx < visibleCount;
          if (!isShown) return null;
          return (
            <div key={text} className="chat-philosophy__bubble">
              <span>{text}</span>
            </div>
          );
        })}

        {/* Pending Typing Dots Bubble with trailing thought circles */}
        <div
          className="chat-philosophy__typing-wrap"
          aria-label={
            visibleCount < CHAT_MESSAGES.length
              ? 'Typing next message'
              : 'Ready to connect'
          }
        >
          <div className="chat-philosophy__typing-bubble">
            <span className="chat-philosophy__dot" />
            <span className="chat-philosophy__dot" />
            <span className="chat-philosophy__dot" />
          </div>
          <span className="chat-philosophy__trail chat-philosophy__trail--md" aria-hidden="true" />
          <span className="chat-philosophy__trail chat-philosophy__trail--sm" aria-hidden="true" />
        </div>

        {visibleCount >= CHAT_MESSAGES.length && (
          <button
            type="button"
            className="chat-philosophy__cta"
            onClick={() => onNavigate?.('about')}
          >
            More about Pramuditha &rarr;
          </button>
        )}
      </div>
    </section>
  );
}
