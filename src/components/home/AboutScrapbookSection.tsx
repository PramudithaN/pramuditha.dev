import { useId } from 'react';
import type { PageType } from '../../types';
import './about-scrapbook.css';

export interface AboutScrapbookSectionProps {
  onNavigate?: (page: PageType) => void;
}

const FRONTEND_SEGMENTS = 9;
const BACKEND_SEGMENTS = 8;
const TOTAL_SEGMENTS = 10;

export default function AboutScrapbookSection({
  onNavigate,
}: AboutScrapbookSectionProps) {
  const uid = useId().replace(/:/g, '');
  const grainId = `ad-grain-${uid}`;

  return (
    <section
      className="about-dossier"
      aria-label="About Pramuditha Nadun — Engineering Dossier"
    >
      <div className="about-dossier__sheet">
        {/* Paper Grain */}
        <svg className="about-dossier__grain" aria-hidden="true">
          <filter id={grainId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${grainId})`} />
        </svg>

        {/* Right Margin Registration Strip */}
        <div className="about-dossier__margin-strip" aria-hidden="true">
          <span>+</span>
          <span className="about-dossier__margin-code">PN-SE / FUSION-X-2026</span>
          <span>+</span>
          <span>+</span>
        </div>

        {/* Top Header */}
        <header className="about-dossier__header">
          <div>
            <div className="about-dossier__brand-row">
              <svg
                className="about-dossier__hex"
                viewBox="0 0 48 48"
                fill="none"
                aria-hidden="true"
              >
                <polygon
                  points="24,3 43,13.5 43,34.5 24,45 5,34.5 5,13.5"
                  stroke="currentColor"
                  strokeWidth="2.4"
                />
                <text
                  x="24"
                  y="29"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="14"
                  fontWeight="900"
                  fontFamily="Inter, sans-serif"
                >
                  PN
                </text>
              </svg>
              <div>
                <h2 className="about-dossier__org">PRAMUDITHA.DEV</h2>
                <p className="about-dossier__division">
                  DIVISION : FULL-STACK SYSTEMS &amp; VISUAL CRAFT
                </p>
              </div>
            </div>

            <div className="about-dossier__class-bar">
              <span className="about-dossier__class-tag">CLASSIFICATION</span>
              <span className="about-dossier__class-val">
                PUBLIC DOSSIER — SE-2026
              </span>
            </div>
          </div>

          <div className="about-dossier__meta-table">
            <div className="about-dossier__meta-row">
              <span className="about-dossier__meta-key">DOSSIER N°</span>
              <span className="about-dossier__meta-val">PN-SE / FX-026</span>
            </div>
            <div className="about-dossier__meta-row">
              <span className="about-dossier__meta-key">LOCATION</span>
              <span className="about-dossier__meta-val">NUGEGODA, LK</span>
            </div>
            <div className="about-dossier__meta-row">
              <span className="about-dossier__meta-key">EDUCATION</span>
              <span className="about-dossier__meta-val">BSc (HONS) · UOW</span>
            </div>
            <div className="about-dossier__meta-row">
              <span className="about-dossier__meta-key">STATUS</span>
              <span className="about-dossier__meta-val">ACTIVE · SHIPPING</span>
            </div>
          </div>
        </header>

        {/* Two-Column Dossier Body */}
        <div className="about-dossier__grid">
          {/* Left Column */}
          <div className="about-dossier__col">
            <div className="about-dossier__box">
              <h3 className="about-dossier__box-title">Engineering Dossier</h3>
              <div className="about-dossier__id-list">
                <div className="about-dossier__id-row">
                  <span>SUBJECT</span>
                  <span>:</span>
                  <span className="about-dossier__id-name">PRAMUDITHA NADUN</span>
                </div>
                <div className="about-dossier__id-row">
                  <span>TITLE</span>
                  <span>:</span>
                  <strong>SOFTWARE ENGINEER</strong>
                </div>
                <div className="about-dossier__id-row">
                  <span>TEAM</span>
                  <span>:</span>
                  <span>
                    LOLC TECHNOLOGIES · FUSION X
                    <span className="about-dossier__status-dot" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </div>

            {/* Capability Matrix */}
            <div className="about-dossier__box">
              <span className="about-dossier__dark-pill">CAPABILITY MATRIX</span>

              <div className="about-dossier__meter-block">
                <p className="about-dossier__meter-label">
                  FRONTEND SYSTEMS (REACT / TYPESCRIPT / MOTION)
                </p>
                <div className="about-dossier__meter-row">
                  <div className="about-dossier__segments" aria-hidden="true">
                    {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
                      <span
                        key={i}
                        className={`about-dossier__seg ${
                          i < FRONTEND_SEGMENTS ? 'about-dossier__seg--filled' : ''
                        }`}
                      />
                    ))}
                  </div>
                  <span className="about-dossier__meter-pct">90 %</span>
                </div>
              </div>

              <div className="about-dossier__meter-block">
                <p className="about-dossier__meter-label">
                  BACKEND &amp; CI/CD (JAVA / SPRING BOOT / ARGOCD)
                </p>
                <div className="about-dossier__meter-row">
                  <div className="about-dossier__segments" aria-hidden="true">
                    {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
                      <span
                        key={i}
                        className={`about-dossier__seg ${
                          i < BACKEND_SEGMENTS ? 'about-dossier__seg--filled' : ''
                        }`}
                      />
                    ))}
                  </div>
                  <span className="about-dossier__meter-pct">80 %</span>
                </div>
              </div>

              <p className="about-dossier__meter-meta">
                CORE FOCUS : <strong>FULL-STACK ARCHITECTURE</strong>
              </p>
              <p className="about-dossier__meter-meta">
                DESIGN &amp; MOTION : <strong>FIGMA · THREE.JS · VFX</strong>
              </p>
            </div>

            {/* Profile Summary */}
            <div className="about-dossier__box">
              <h3 className="about-dossier__box-title">Engineer Profile</h3>
              <p className="about-dossier__copy">
                Software Engineer on the Fusion X Team at LOLC Technologies,
                building production web applications across React, TypeScript,
                Redux, Ant Design, Spring Boot, Jenkins, and ArgoCD. Holds a BSc
                (Hons) in Software Engineering (Upper Second Class) from the
                University of Westminster / IIT Colombo.
              </p>
            </div>

            {/* Career Log */}
            <div className="about-dossier__box">
              <h3 className="about-dossier__box-title">Career Observations</h3>
              <ul className="about-dossier__list">
                <li>
                  <strong>2024–Now</strong> — Software Engineer @ LOLC
                  Technologies (Fusion X Team).
                </li>
                <li>
                  <strong>2023–2024</strong> — Associate Software Engineer @
                  LOLC Technologies.
                </li>
                <li>
                  <strong>2022–2023</strong> — Software Engineering Intern @
                  LOLC Fusion Team.
                </li>
                <li>
                  <strong>2020–2024</strong> — Level 2 Graphic Designer @
                  Fiverr (4.9 rating).
                </li>
              </ul>
            </div>

            {/* Sticky Note + Barcode */}
            <div className="about-dossier__artifacts">
              <div className="about-dossier__sticky">
                Calm under production pressure. Relentless on craft &amp; clean
                architecture. — P.N.
              </div>
              <div className="about-dossier__barcode-box">
                <span>PRAMUDITHA.DEV</span>
                <div className="about-dossier__barcode" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="about-dossier__col">
            {/* Clipped Portrait Frame */}
            <div className="about-dossier__photo-card">
              <svg
                className="about-dossier__paperclip"
                viewBox="0 0 24 52"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M7 16V38C7 43.5 11.5 48 17 48C20 48 22 45.5 22 42V12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12V36"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="about-dossier__photo-top">
                PROFILE RECORD // PN-2026
              </div>
              <div className="about-dossier__photo-frame">
                <img
                  src="/images/about/pramuditha-suit.jpg"
                  alt="Pramuditha Nadun — Software Engineer"
                  className="about-dossier__photo-img"
                  loading="lazy"
                />
              </div>
              <div className="about-dossier__photo-bot">
                <span>SOURCE : NUGEGODA, LK</span>
                <span>2026</span>
              </div>
            </div>

            {/* Observed Practices */}
            <div className="about-dossier__box">
              <h3 className="about-dossier__box-title">Observed Practices</h3>
              <ul className="about-dossier__list">
                <li>Writes strict TypeScript with zero-any discipline.</li>
                <li>Automates QA, UAT &amp; Prod releases via Jenkins &amp; ArgoCD.</li>
                <li>Synthesizes procedural Web Audio &amp; Three.js 3D UI.</li>
                <li>Ships open-source developer tools (reminder.afk, localization-check).</li>
              </ul>
            </div>

            {/* Key Ecosystems */}
            <div className="about-dossier__box">
              <h3 className="about-dossier__box-title">Key Ecosystems</h3>
              <div className="about-dossier__checks">
                <span>[✓] LOLC TECHNOLOGIES · FUSION X</span>
                <span>[✓] UNIVERSITY OF WESTMINSTER / IIT</span>
              </div>
            </div>

            {/* Engineering Guidelines */}
            <div className="about-dossier__box">
              <h3 className="about-dossier__box-title">Operating Principles</h3>
              <ul className="about-dossier__list">
                <li>Prioritize OWASP secure coding &amp; clean access control.</li>
                <li>Keep UI motion purposeful and hardware-accelerated.</li>
                <li>Unite systems engineering with editorial visual craft.</li>
              </ul>
            </div>

            {/* Current Status Footer */}
            <div className="about-dossier__footer">
              <div>
                <div className="about-dossier__footer-status">
                  STATUS : BUILDING &amp; SHIPPING
                  <span className="about-dossier__status-dot" aria-hidden="true" />
                </div>
              </div>
              <button
                type="button"
                className="about-dossier__full-btn"
                onClick={() => onNavigate?.('about')}
              >
                Full About Page ↗
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
