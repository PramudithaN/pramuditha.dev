import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { ThemeMode } from '../../types/portfolio';
import type { MascotOptions } from '../../types/seasonal';

interface PeekingSantaProps {
  theme: ThemeMode;
  config: MascotOptions;
}

interface Sparkle {
  id: number;
  tx: number;
  ty: number;
  char: string;
}

export const PeekingSanta: React.FC<PeekingSantaProps> = ({ theme, config }) => {
  const [status, setStatus] = useState<'hidden' | 'peeking' | 'excited'>('hidden');
  const [currentPhrase, setCurrentPhrase] = useState<string>('');
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const peekTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const phraseIndexRef = useRef<number>(0);

  // Pick next festive quote
  const getNextPhrase = useCallback(() => {
    if (!config.phrases || config.phrases.length === 0) return 'Merry Christmas! 🎅';
    const phrase = config.phrases[phraseIndexRef.current % config.phrases.length];
    phraseIndexRef.current += 1;
    return phrase;
  }, [config.phrases]);

  // Schedule Santa's periodic appearance
  const schedulePeek = useCallback(() => {
    if (peekTimeoutRef.current) clearTimeout(peekTimeoutRef.current);

    const minMs = config.minPeekIntervalSec * 1000;
    const maxMs = config.maxPeekIntervalSec * 1000;
    const randomInterval = minMs + Math.random() * (maxMs - minMs);

    peekTimeoutRef.current = window.setTimeout(() => {
      setStatus('peeking');

      // Schedule retreat
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = window.setTimeout(() => {
        setStatus('hidden');
        schedulePeek();
      }, config.peekDurationSec * 1000);
    }, randomInterval);
  }, [config.minPeekIntervalSec, config.maxPeekIntervalSec, config.peekDurationSec]);

  useEffect(() => {
    if (!config.enabled) {
      setStatus('hidden');
      return;
    }

    // Initial peek shortly after loading (e.g. 8-12 seconds)
    const initialDelay = 8000 + Math.random() * 4000;
    peekTimeoutRef.current = window.setTimeout(() => {
      setStatus('peeking');
      hideTimeoutRef.current = window.setTimeout(() => {
        setStatus('hidden');
        schedulePeek();
      }, config.peekDurationSec * 1000);
    }, initialDelay);

    return () => {
      if (peekTimeoutRef.current) clearTimeout(peekTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [config.enabled, config.peekDurationSec, schedulePeek]);

  // Interactive click handler
  const handleSantaClick = () => {
    if (status === 'hidden') return;

    setStatus('excited');
    setCurrentPhrase(getNextPhrase());

    // Generate playful burst sparkles
    const symbols = ['✨', '❄️', '⭐', '🎄', '🎁'];
    const newSparkles: Sparkle[] = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      tx: (Math.random() - 0.5) * 80,
      ty: -30 - Math.random() * 50,
      char: symbols[Math.floor(Math.random() * symbols.length)]
    }));
    setSparkles(newSparkles);

    setTimeout(() => {
      setSparkles([]);
    }, 1200);

    // Keep Santa excited for a moment, then retreat smoothly
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = window.setTimeout(() => {
      setStatus('hidden');
      schedulePeek();
    }, 3800);
  };

  if (!config.enabled) return null;

  return (
    <div
      className={`peeking-santa-wrapper ${status}`}
      onClick={handleSantaClick}
      title="Santa says hi! Click him for holiday cheer!"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleSantaClick();
        }
      }}
      aria-label="Festive Santa Claus greeting"
    >
      {/* Speech Bubble */}
      {status === 'excited' && currentPhrase && (
        <div className={`santa-speech-bubble ${theme === 'light' ? 'light-theme' : ''}`}>
          {currentPhrase}
        </div>
      )}

      {/* Sparkle Particles on Click */}
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="santa-sparkle"
          style={
            {
              '--tx': `${s.tx}px`,
              '--ty': `${s.ty}px`
            } as React.CSSProperties
          }
        >
          {s.char}
        </span>
      ))}

      {/* Handcrafted Vector Santa Claus SVG */}
      <svg
        className="santa-svg"
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="santaRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff3838" />
            <stop offset="100%" stopColor="#b80c0c" />
          </linearGradient>
          <linearGradient id="santaBeardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <radialGradient id="cheeksGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff7b7b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff7b7b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Santa Body / Red Coat */}
        <path
          d="M25 140 C25 105 115 105 115 140 Z"
          fill="url(#santaRedGrad)"
        />
        {/* Coat White Trim */}
        <path
          d="M58 115 L82 115 L82 140 L58 140 Z"
          fill="#f8fafc"
        />

        {/* Santa Head Base */}
        <circle cx="70" cy="85" r="30" fill="#fde2d2" />

        {/* Rosy Cheeks */}
        <circle cx="50" cy="88" r="8" fill="url(#cheeksGrad)" />
        <circle cx="90" cy="88" r="8" fill="url(#cheeksGrad)" />

        {/* Big Fluffy Beard */}
        <path
          d="M38 88 C34 115 48 138 70 138 C92 138 106 115 102 88 C94 92 84 94 70 94 C56 94 46 92 38 88 Z"
          fill="url(#santaBeardGrad)"
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
        />

        {/* Mustache */}
        <path
          d="M70 91 C62 86 44 87 42 98 C54 99 64 94 70 91 Z"
          fill="#ffffff"
        />
        <path
          d="M70 91 C78 86 96 87 98 98 C86 99 76 94 70 91 Z"
          fill="#ffffff"
        />

        {/* Cute Button Nose */}
        <ellipse cx="70" cy="86" rx="6" ry="4.5" fill="#f87171" />

        {/* Blinking Eyes */}
        <g className="santa-eye">
          <circle cx="56" cy="78" r="3.2" fill="#1e293b" />
          <circle cx="57" cy="76.8" r="1.1" fill="#ffffff" />
        </g>
        <g className="santa-eye">
          <circle cx="84" cy="78" r="3.2" fill="#1e293b" />
          <circle cx="85" cy="76.8" r="1.1" fill="#ffffff" />
        </g>

        {/* Santa Hat Cone */}
        <path
          d="M38 68 C42 35 78 20 102 32 C115 40 120 54 116 66 Z"
          fill="url(#santaRedGrad)"
        />
        {/* Hat Tip Falling to Right */}
        <path
          d="M102 32 C112 36 122 48 118 64 C116 68 110 70 108 66 Z"
          fill="#b80c0c"
        />

        {/* Hat Fluffy White Cuff */}
        <rect
          x="34"
          y="62"
          width="74"
          height="14"
          rx="7"
          fill="#f8fafc"
          filter="drop-shadow(0 2px 3px rgba(0,0,0,0.12))"
        />

        {/* Hat Pom-Pom (Animated wobble) */}
        <g className="santa-pom-pom">
          <circle cx="118" cy="67" r="9" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
        </g>

        {/* Waving Mitten Hand (Left Side) */}
        <g className="santa-hand">
          {/* Glove White Cuff */}
          <rect x="18" y="96" width="16" height="8" rx="4" fill="#f8fafc" />
          {/* Red Mitten */}
          <path
            d="M20 98 C16 93 18 84 25 84 C31 84 34 90 32 98 Z"
            fill="url(#santaRedGrad)"
          />
          {/* Thumb */}
          <path
            d="M30 89 C34 89 36 93 33 96 Z"
            fill="url(#santaRedGrad)"
          />
        </g>
      </svg>
    </div>
  );
};
