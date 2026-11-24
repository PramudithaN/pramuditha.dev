import { useEffect, useRef, useState } from 'react';

export interface SilhouettePortraitProps {
  className?: string;
}

const FRAMES = [
  '/images/about/pramuditha-f1.jpg',
  '/images/about/pramuditha-f2.jpg',
  '/images/about/pramuditha-f3.jpg',
  '/images/about/pramuditha-f4.jpg',
] as const;

const SHUTTER_SEQUENCE = [0, 1, 0, 2, 3, 1] as const;

/**
 * Replicates jp3N-dwelling's Meet the Team slow-shutter 4-frame
 * silhouette portrait with vignette and rotating 6-pointed star emblem.
 */
export default function SilhouettePortrait({ className }: SilhouettePortraitProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [activeFrame, setActiveFrame] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || isHovered) {
      setActiveFrame(0);
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let step = 0;
    const timer = window.setInterval(() => {
      step = (step + 1) % SHUTTER_SEQUENCE.length;
      setActiveFrame(SHUTTER_SEQUENCE[step]);
    }, 190);

    return () => window.clearInterval(timer);
  }, [isVisible, isHovered]);

  return (
    <div
      ref={wrapRef}
      className={`jp3n-silhouette ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {FRAMES.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt={idx === 0 ? 'Pramuditha Nadun monochrome silhouette portrait' : ''}
          aria-hidden={idx !== 0 ? 'true' : undefined}
          className={`jp3n-silhouette__img ${
            activeFrame === idx ? 'jp3n-silhouette__img--active' : ''
          }`}
          loading="eager"
          decoding="async"
        />
      ))}

      <div className="jp3n-silhouette__vignette" aria-hidden="true" />

      <span className="jp3n-silhouette__star" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 1L14.2 8.2L21.5 6.5L16.4 12L21.5 17.5L14.2 15.8L12 23L9.8 15.8L2.5 17.5L7.6 12L2.5 6.5L9.8 8.2L12 1Z"
            fill="#FFFFFF"
          />
        </svg>
      </span>
    </div>
  );
}
