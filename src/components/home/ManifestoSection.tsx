import { useId } from 'react';
import type { PageType, ThemeMode } from '../../types';
import './manifesto-section.css';

export interface ManifestoSectionProps {
  theme: ThemeMode;
  onNavigate?: (page: PageType) => void;
}

export default function ManifestoSection({ theme, onNavigate }: ManifestoSectionProps) {
  const uid = useId().replace(/:/g, '');
  const grainId = `manifesto-grain-${uid}`;

  const goTo = (page: PageType) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <section
      className="manifesto-section"
      data-theme={theme}
      aria-label="Engineering and Design Philosophy"
    >
      {/* Procedural Paper Grain */}
      <svg className="manifesto-section__grain" aria-hidden="true">
        <filter id={grainId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${grainId})`} />
      </svg>

      {/* Top Monogram */}
      <div className="manifesto-section__monogram" aria-hidden="true">
        <span>PN</span>
      </div>

      {/* Center Editorial Statement */}
      <div className="manifesto-section__center">
        <h2 className="manifesto-section__headline">
          <span>I DON&apos;T BELIEVE</span>
          <span className="manifesto-section__headline-row">
            <span>IN</span>
            <span className="manifesto-section__inverted-block">&ldquo;JUST&rdquo; CODE.</span>
          </span>
        </h2>

        <div className="manifesto-section__sublead">
          <span>I believe in</span>
          <div className="manifesto-section__sublead-row">
            <span className="manifesto-section__inline-pill">
              <img
                src="/images/about/AboutSection.webp"
                alt=""
                className="manifesto-section__inline-avatar"
                aria-hidden="true"
              />
              <span className="manifesto-section__inline-text">
                SYSTEMS BUILT
                <strong>AT LOLC FUSION X</strong>
              </span>
            </span>
            <strong>Building Experiences.</strong>
          </div>
        </div>

        <div className="manifesto-section__card">
          <p className="manifesto-section__card-copy">
            SOFTWARE THAT MAKES <strong>PEOPLE FEEL.</strong>
            <br />
            SYSTEMS THAT MAKE <strong>TEAMS MOVE FASTER.</strong>
            <br />
            INTERFACES THAT HELP <strong>PRODUCTS GROW,</strong>
            <br />
            WHEREVER <strong>USERS ARE.</strong>
          </p>
        </div>
      </div>

      {/* Bottom Corner Interactive Identity Pills */}
      <footer className="manifesto-section__footer">
        <button
          type="button"
          className="manifesto-section__corner-pill"
          onClick={() => goTo('about')}
        >
          <img
            src="/images/about/AboutSection.webp"
            alt="Pramuditha Nadun"
            className="manifesto-section__corner-avatar"
          />
          <span className="manifesto-section__corner-meta">
            <span className="manifesto-section__corner-name">Pramuditha Nadun</span>
            <span className="manifesto-section__corner-role">Software Engineer</span>
          </span>
        </button>

        <button
          type="button"
          className="manifesto-section__corner-pill"
          onClick={() => goTo('logic')}
        >
          <img
            src="/images/about/UOW.webp"
            alt="University of Westminster & LOLC Fusion X"
            className="manifesto-section__corner-avatar"
          />
          <span className="manifesto-section__corner-meta">
            <span className="manifesto-section__corner-name">Logic &amp; Systems</span>
            <span className="manifesto-section__corner-role">LOLC Fusion X · UOW</span>
          </span>
        </button>
      </footer>
    </section>
  );
}
