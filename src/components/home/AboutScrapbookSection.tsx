import { useId } from 'react';
import type { PageType } from '../../types';
import './about-scrapbook.css';

export interface AboutScrapbookSectionProps {
  onNavigate?: (page: PageType) => void;
}

export default function AboutScrapbookSection({
  onNavigate,
}: AboutScrapbookSectionProps) {
  const uid = useId().replace(/:/g, '');
  const grainId = `as-grain-${uid}`;

  return (
    <section
      className="about-scrapbook"
      aria-label="About Me Scrapbook"
    >
      {/* Film Grain Overlay */}
      <svg className="about-scrapbook__grain" aria-hidden="true">
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

      {/* Top-Left Torn Paper Scrap */}
      <div className="about-scrapbook__torn-corner" aria-hidden="true">
        <span className="about-scrapbook__torn-meta">
          Pramuditha Nadun · Software Engineer
        </span>
      </div>

      <div className="about-scrapbook__stage">
        {/* Left Column: Brush Title + Hero Polaroid + Lined Notebook */}
        <div className="about-scrapbook__left">
          <h2 className="about-scrapbook__brush-title">
            Pramuditha Nadun
            <br />
            Software{' '}
            <span className="about-scrapbook__brush-underline">
              Engineer
              <svg viewBox="0 0 180 24" fill="none" aria-hidden="true">
                <path
                  d="M4 16C48 8 118 6 176 14"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          <button
            type="button"
            className="about-scrapbook__polaroid"
            onClick={() => onNavigate?.('about')}
            aria-label="Open full About Me page"
          >
            <div className="about-scrapbook__photo-wrap">
              <img
                src="/images/about/pramuditha-suit.jpg"
                alt="Pramuditha Nadun — Software Engineer"
                className="about-scrapbook__photo"
                loading="lazy"
              />
              <span className="about-scrapbook__stamp-badge">
                <span className="about-scrapbook__stamp-x" aria-hidden="true">
                  X
                </span>
                LOLC FUSION X
              </span>
            </div>

            <p className="about-scrapbook__polaroid-copy">
              A builder of resilient systems.
              <br />
              Frontend craft. Backend rigor.
              <br />
              BSc (Hons) Software Engineering · UOW.
              <br />
              Always shipping, always learning.
            </p>
          </button>

          {/* Lined Notebook Scrap */}
          <div className="about-scrapbook__notebook">
            <span
              className="about-scrapbook__tape-strip about-scrapbook__tape-strip--top"
              aria-hidden="true"
            />
            <span
              className="about-scrapbook__tape-strip about-scrapbook__tape-strip--bot"
              aria-hidden="true"
            />
            <p className="about-scrapbook__notebook-lines">
              2024–Present · Software Engineer
              <br />
              2023–2024 · Associate SE
              <br />
              2022–2023 · SE Intern @ LOLC
              <br />
              Nugegoda, Sri Lanka
            </p>
            <p className="about-scrapbook__notebook-red">Mahinda College &apos;19</p>
          </div>
        </div>

        {/* Right Column: Secondary Overlapping Polaroids + Circled Callout */}
        <div className="about-scrapbook__right">
          <div className="about-scrapbook__mini-polaroid about-scrapbook__mini-polaroid--top">
            <img
              src="/images/about/UOW.webp"
              alt="University of Westminster / IIT Colombo"
              className="about-scrapbook__mini-img"
              loading="lazy"
            />
            <span className="about-scrapbook__stamp-badge">
              <span className="about-scrapbook__stamp-x" aria-hidden="true">
                X
              </span>
              UOW / IIT
            </span>
          </div>

          <div className="about-scrapbook__mini-polaroid about-scrapbook__mini-polaroid--bot">
            <img
              src="/images/about/AboutSection.webp"
              alt="Engineering Workstation"
              className="about-scrapbook__mini-img"
              loading="lazy"
            />
            <span className="about-scrapbook__stamp-badge">
              <span className="about-scrapbook__stamp-x" aria-hidden="true">
                X
              </span>
              FULL-STACK
            </span>
          </div>

          <div className="about-scrapbook__callout">
            Code{' '}
            <span className="about-scrapbook__circled">
              ships
              <svg viewBox="0 0 140 64" fill="none" aria-hidden="true">
                <ellipse
                  cx="70"
                  cy="32"
                  rx="64"
                  ry="25"
                  transform="rotate(-4 70 32)"
                  stroke="currentColor"
                  strokeWidth="3.2"
                />
              </svg>
            </span>
            <br />
            <span className="about-scrapbook__callout-red">Design</span> speaks.
          </div>
        </div>
      </div>
    </section>
  );
}
