import { useId, useMemo, useState } from 'react';
import './year-in-days.css';

interface YearProgress {
  year: number;
  totalDays: number;
  daysPassed: number;
  daysRemain: number;
}

function getYearProgress(): YearProgress {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const startOfNextYear = new Date(year + 1, 0, 1);
  const totalDays = Math.round(
    (startOfNextYear.getTime() - startOfYear.getTime()) / 86_400_000
  );
  const today = new Date(year, now.getMonth(), now.getDate());
  const daysPassed = Math.min(
    totalDays,
    Math.max(1, Math.floor((today.getTime() - startOfYear.getTime()) / 86_400_000) + 1)
  );
  const daysRemain = Math.max(0, totalDays - daysPassed);
  return { year, totalDays, daysPassed, daysRemain };
}

function formatDayOfYear(year: number, dayIndex: number): string {
  const d = new Date(year, 0, dayIndex + 1);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function YearInDaysSection() {
  const uid = useId().replace(/:/g, '');
  const grainId = `yd-grain-${uid}`;
  const { year, totalDays, daysPassed, daysRemain } = useMemo(getYearProgress, []);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const dots = useMemo(
    () => Array.from({ length: totalDays }, (_, i) => i),
    [totalDays]
  );

  return (
    <section
      className="year-days"
      aria-label={`${year} In Days Progress`}
    >
      {/* Film Grain Overlay */}
      <svg className="year-days__grain" aria-hidden="true">
        <filter id={grainId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${grainId})`} />
      </svg>

      {/* Subtle Powerlines Across Sky */}
      <svg
        className="year-days__wires"
        viewBox="0 0 1000 800"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path d="M0 325 Q 500 342 1000 330" stroke="#1e1e20" strokeWidth="1" />
        <path d="M0 368 Q 500 385 1000 374" stroke="#1e1e20" strokeWidth="1" />
        <path d="M0 495 Q 500 508 1000 498" stroke="#1e1e20" strokeWidth="0.9" />
      </svg>

      <div className="year-days__ground" aria-hidden="true" />

      {/* Top 3-Star Sparkle */}
      <svg
        className="year-days__sparkles"
        width="54"
        height="26"
        viewBox="0 0 54 26"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 6L13 11L18 12L13 13L12 18L11 13L6 12L11 11Z" opacity="0.7" />
        <path d="M27 1L28.8 9.2L37 11L28.8 12.8L27 21L25.2 12.8L17 11L25.2 9.2Z" />
        <path d="M42 6L43 11L48 12L43 13L42 18L41 13L36 12L41 11Z" opacity="0.7" />
      </svg>

      {/* 365-Dot Matrix */}
      <div className="year-days__center">
        <h2 className="year-days__title">{year} IN DAYS</h2>

        <div
          className="year-days__grid"
          onMouseLeave={() => setHoveredDay(null)}
        >
          {dots.map((dayIdx) => {
            const isPassed = dayIdx < daysPassed;
            return (
              <span
                key={dayIdx}
                className={`year-days__dot ${
                  isPassed ? 'year-days__dot--passed' : ''
                }`}
                onMouseEnter={() => setHoveredDay(dayIdx)}
                title={`Day ${dayIdx + 1} · ${formatDayOfYear(year, dayIdx)}`}
              />
            );
          })}
        </div>

        <div className="year-days__counts">
          <span>{daysRemain} REMAIN</span>
          <span>{daysPassed} PASSED</span>
        </div>

        <p className="year-days__hover-readout" aria-live="polite">
          {hoveredDay !== null
            ? `Day ${hoveredDay + 1} of ${totalDays} · ${formatDayOfYear(year, hoveredDay)}`
            : `Consistent shipping · ${Math.round((daysPassed / totalDays) * 100)}% of ${year}`}
        </p>
      </div>

      {/* Lone Runner Silhouette on the Horizon */}
      <div className="year-days__runner-wrap" aria-hidden="true">
        <svg
          className="year-days__runner-svg"
          viewBox="0 0 64 76"
          fill="currentColor"
        >
          {/* Head */}
          <circle cx="31" cy="11" r="4.8" />
          {/* Torso leaning forward */}
          <path d="M28 17 L36 18 L34 39 L26 38 Z" />
          {/* Left & Right Pumping Arms */}
          <path d="M29 19 L20 26 L24 34 L27 32 L24 27 L31 22 Z" />
          <path d="M35 19 L44 25 L41 33 L38 31 L40 26 L33 22 Z" />
          {/* Striding Legs */}
          <path d="M32 37 L42 52 L53 68 L49 71 L38 55 L29 41 Z" />
          <path d="M27 38 L22 54 L12 67 L15 70 L26 56 L31 40 Z" />
        </svg>
      </div>

      {/* Bottom Brand Footer */}
      <footer className="year-days__footer">
        <p className="year-days__brand">PRAMUDITHA.DEV</p>
        <p className="year-days__sub">LOLC Fusion X · UOW · Open Source</p>
      </footer>
    </section>
  );
}
