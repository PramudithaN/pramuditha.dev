import { useState, useEffect, useRef, useCallback, type RefObject } from 'react';
import {
  ArrowLeft,
  Gamepad2,
  Music2,
  RotateCcw,
  Sparkles,
  Target,
} from 'lucide-react';
import type { PageType, ThemeMode } from '../../types';
import { soundEngine } from '../../services/soundEngine';
import ThemeToggle from '../common/ThemeToggle';
import './playground-view.css';

interface PlaygroundViewProps {
  theme: ThemeMode;
  onToggleTheme: (
    event?:
      | React.MouseEvent<HTMLElement>
      | MouseEvent
      | { clientX?: number; clientY?: number }
  ) => void;
  onNavigate: (page: PageType) => void;
  searchQuery?: string;
  subpageRef?: RefObject<HTMLDivElement | null>;
}

interface SynthPad {
  key: string;
  label: string;
  freq: number;
}

const SYNTH_PADS: ReadonlyArray<SynthPad> = [
  { key: '1', label: 'C4', freq: 261.63 },
  { key: '2', label: 'D4', freq: 293.66 },
  { key: '3', label: 'E4', freq: 329.63 },
  { key: '4', label: 'G4', freq: 392.0 },
  { key: '5', label: 'A4', freq: 440.0 },
  { key: '6', label: 'C5', freq: 523.25 },
  { key: '7', label: 'D5', freq: 587.33 },
  { key: '8', label: 'E5', freq: 659.25 },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function PlaygroundView({
  theme,
  onToggleTheme,
  onNavigate,
  searchQuery,
  subpageRef,
}: PlaygroundViewProps) {
  // --- 1. Procedural Synth State ---
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [activePad, setActivePad] = useState<string | null>(null);

  const playNote = useCallback((pad: SynthPad) => {
    try {
      const AudioContextCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextCtor) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextCtor();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pad.freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.46);

      setActivePad(pad.key);
      window.setTimeout(() => {
        setActivePad((prev) => (prev === pad.key ? null : prev));
      }, 180);
    } catch {
      // Ignore Web Audio errors in restricted environments
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const pad = SYNTH_PADS.find((p) => p.key === e.key);
      if (pad) {
        playNote(pad);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (audioCtxRef.current) {
        void audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [playNote]);

  // --- 2. Reflex Target Mini-Game State ---
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [targetPos, setTargetPos] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });

  useEffect(() => {
    if (!gameActive) return;
    if (timeLeft <= 0) {
      setGameActive(false);
      setBestScore((prev) => Math.max(prev, score));
      return;
    }
    const timer = window.setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [gameActive, timeLeft, score]);

  const startReflexGame = () => {
    soundEngine.playClickSound();
    setScore(0);
    setTimeLeft(20);
    setTargetPos({
      x: 15 + Math.random() * 70,
      y: 18 + Math.random() * 64,
    });
    setGameActive(true);
  };

  const hitTarget = () => {
    if (!gameActive) return;
    soundEngine.playHoverSound();
    setScore((prev) => prev + 1);
    setTargetPos({
      x: 12 + Math.random() * 76,
      y: 16 + Math.random() * 68,
    });
  };

  // --- 3. Interactive Particle Constellation Canvas ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width));
      canvas.height = Math.max(1, Math.floor(rect.height));
    };
    resize();
    window.addEventListener('resize', resize);

    particlesRef.current = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      radius: 2 + Math.random() * 2,
    }));

    let rafId = 0;
    const render = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const accent =
        getComputedStyle(document.documentElement)
          .getPropertyValue('--site-primary')
          .trim() || '#e51d1d';
      const dotColor = theme === 'dark' ? '#f8fafc' : '#18181b';

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x <= 0 || p.x >= width) p.vx *= -1;
        if (p.y <= 0 || p.y >= height) p.vy *= -1;

        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 110 && dist > 1) {
            p.vx += (dx / dist) * 0.04;
            p.vy += (dy / dist) * 0.04;
          }
        }

        p.vx = Math.max(-2.2, Math.min(2.2, p.vx));
        p.vy = Math.max(-2.2, Math.min(2.2, p.vy));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? accent : dotColor;
        ctx.globalAlpha = i % 3 === 0 ? 0.9 : 0.45;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 95) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = accent;
            ctx.globalAlpha = (1 - d / 95) * 0.35;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  const spawnBurst = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    soundEngine.playClickSound();
    for (let i = 0; i < 6; i += 1) {
      if (particlesRef.current.length > 52) {
        particlesRef.current.shift();
      }
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 3.2,
        vy: (Math.random() - 0.5) * 3.2,
        radius: 2 + Math.random() * 2.5,
      });
    }
  };

  return (
    <div
      ref={subpageRef}
      className="subpage-container playground-page"
      data-theme={theme}
    >
      <header className="playground-header">
        <button
          type="button"
          className="playground-back-btn"
          onClick={() => {
            soundEngine.playClickSound();
            onNavigate('home');
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Search</span>
        </button>

        <div className="playground-header__actions">
          <button
            type="button"
            className="playground-nav-pill"
            onClick={() => onNavigate('logic')}
          >
            Logic &amp; Systems
          </button>
          <button
            type="button"
            className="playground-nav-pill"
            onClick={() => onNavigate('aesthetics')}
          >
            Aesthetics
          </button>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </header>

      <main className="playground-main">
        <div className="playground-hero">
          <span className="playground-badge">
            <Gamepad2 size={14} />
            <span>Off the Portfolio Map</span>
          </span>
          <h1 className="playground-title">
            {searchQuery ? (
              <>
                No results for{' '}
                <span className="playground-query">&ldquo;{searchQuery}&rdquo;</span>
                .
              </>
            ) : (
              'Welcome to the Fun Zone.'
            )}
          </h1>
          <p className="playground-subtitle">
            That search took you off the beaten path — hang out here and play
            with a procedural synth, a reflex target game, and an interactive
            constellation canvas.
          </p>
        </div>

        <div className="playground-grid">
          {/* Card 1: Pentatonic Synth */}
          <section className="playground-card" aria-label="Procedural Synth">
            <div className="playground-card__head">
              <span className="playground-card__icon">
                <Music2 size={18} />
              </span>
              <div>
                <h2 className="playground-card__title">Procedural Synth</h2>
                <p className="playground-card__desc">
                  Click pads or press keys 1–8 to play Web Audio tones.
                </p>
              </div>
            </div>

            <div className="playground-synth-grid">
              {SYNTH_PADS.map((pad) => (
                <button
                  key={pad.key}
                  type="button"
                  className={`playground-synth-pad ${
                    activePad === pad.key ? 'is-active' : ''
                  }`}
                  onClick={() => playNote(pad)}
                >
                  <span className="playground-synth-note">{pad.label}</span>
                  <span className="playground-synth-key">{pad.key}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Card 2: Neon Reflex Target Game */}
          <section className="playground-card" aria-label="Reflex Target Game">
            <div className="playground-card__head">
              <span className="playground-card__icon">
                <Target size={18} />
              </span>
              <div>
                <h2 className="playground-card__title">Reflex Arena</h2>
                <p className="playground-card__desc">
                  Hit as many targets as you can in 20 seconds.
                </p>
              </div>
            </div>

            <div className="playground-stats">
              <span>
                Score: <strong>{score}</strong>
              </span>
              <span>
                Time: <strong>{timeLeft}s</strong>
              </span>
              <span>
                Best: <strong>{bestScore}</strong>
              </span>
            </div>

            <div className="playground-arena">
              {gameActive ? (
                <button
                  type="button"
                  className="playground-target"
                  style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
                  onClick={hitTarget}
                  aria-label="Hit target"
                />
              ) : (
                <button
                  type="button"
                  className="playground-start-btn"
                  onClick={startReflexGame}
                >
                  <RotateCcw size={15} />
                  <span>{score > 0 ? 'Play Again' : 'Start 20s Run'}</span>
                </button>
              )}
            </div>
          </section>

          {/* Card 3: Particle Constellation */}
          <section
            className="playground-card playground-card--wide"
            aria-label="Particle Constellation"
          >
            <div className="playground-card__head">
              <span className="playground-card__icon">
                <Sparkles size={18} />
              </span>
              <div>
                <h2 className="playground-card__title">Particle Lab</h2>
                <p className="playground-card__desc">
                  Move your cursor to attract nodes, or click anywhere to spawn
                  a burst.
                </p>
              </div>
            </div>

            <canvas
              ref={canvasRef}
              className="playground-canvas"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                mouseRef.current = {
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                  active: true,
                };
              }}
              onMouseLeave={() => {
                mouseRef.current.active = false;
              }}
              onClick={spawnBurst}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
