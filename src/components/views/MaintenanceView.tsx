import { useId } from 'react';
import { EXTERNAL_LINKS } from '../../constants/links';
import './maintenance-view.css';

export default function MaintenanceView() {
  const uid = useId().replace(/:/g, '');
  const amberGlowId = `maint-amber-${uid}`;
  const housingGradId = `maint-housing-${uid}`;
  const visorGradId = `maint-visor-${uid}`;
  const visorAmberId = `maint-visor-amber-${uid}`;
  const fresnelId = `maint-fresnel-${uid}`;

  return (
    <main className="maint-page" aria-label="Site Under Maintenance">
      {/* Subtle Wireframe Skyline Background */}
      <svg
        className="maint-page__skyline"
        viewBox="0 0 1200 420"
        preserveAspectRatio="xMidYMin slice"
        fill="none"
        aria-hidden="true"
      >
        <g stroke="currentColor" strokeWidth="1.2">
          <rect x="30" y="60" width="140" height="360" />
          <rect x="52" y="90" width="28" height="42" />
          <rect x="98" y="90" width="28" height="42" />
          <rect x="52" y="155" width="28" height="42" />
          <rect x="98" y="155" width="28" height="42" />
          <rect x="200" y="110" width="170" height="310" />
          <rect x="230" y="140" width="110" height="18" />
          <rect x="230" y="176" width="110" height="18" />
          <rect x="420" y="24" width="180" height="396" />
          <polygon points="420,24 510,-12 600,24" />
          <rect x="650" y="85" width="160" height="335" />
          <rect x="850" y="45" width="150" height="375" />
          <rect x="1030" y="95" width="140" height="325" />
        </g>
      </svg>

      <div className="maint-page__stripes" aria-hidden="true" />
      <div className="maint-page__hazard maint-page__hazard--back" aria-hidden="true" />
      <div className="maint-page__hazard maint-page__hazard--front" aria-hidden="true" />

      {/* Top Bar */}
      <header className="maint-page__topbar">
        <span className="maint-page__logo-box">PRAMUDITHA.DEV</span>

        <nav className="maint-page__socials" aria-label="Contact links">
          <a
            href={EXTERNAL_LINKS.GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="maint-page__social-link"
          >
            /PramudithaN
          </a>
          <a
            href={EXTERNAL_LINKS.LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="maint-page__social-link"
          >
            /in/pramuditha-nadun
          </a>
          <a
            href="mailto:pramudithanadun@gmail.com"
            className="maint-page__social-link"
          >
            pramudithanadun@gmail.com
          </a>
        </nav>
      </header>

      {/* Main Poster Stage */}
      <div className="maint-page__main">
        <div className="maint-page__headline-wrap">
          <h1 className="maint-page__headline-top">SITE UNDER</h1>
          <span className="maint-page__tape-banner">MAINTENANCE</span>
        </div>

        <div className="maint-page__split">
          <div className="maint-page__copy-col">
            <p className="maint-page__message">
              Upgrading systems &amp; crafting a new portfolio experience.
            </p>
            <a
              href={EXTERNAL_LINKS.GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="maint-page__pill"
            >
              BACK SOON · VIEW GITHUB ↗
            </a>
          </div>

          {/* 3-Quarter Perspective 3-Lens Traffic Light with Fresnel Grid & Glowing Amber */}
          <div className="maint-page__signal-wrap" aria-hidden="true">
            <svg viewBox="0 0 260 450" fill="none">
              <defs>
                <linearGradient id={housingGradId} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#353b36" />
                  <stop offset="50%" stopColor="#1d211e" />
                  <stop offset="100%" stopColor="#0c0e0c" />
                </linearGradient>
                <linearGradient id={visorGradId} x1="0" y1="0" x2="1" y2="0.8">
                  <stop offset="0%" stopColor="#141714" />
                  <stop offset="55%" stopColor="#262b27" />
                  <stop offset="100%" stopColor="#0b0d0b" />
                </linearGradient>
                <linearGradient id={visorAmberId} x1="0" y1="0" x2="1" y2="0.8">
                  <stop offset="0%" stopColor="#423308" />
                  <stop offset="45%" stopColor="#8f6c0a" />
                  <stop offset="100%" stopColor="#1c190c" />
                </linearGradient>
                <radialGradient id={amberGlowId} cx="46%" cy="48%" r="54%">
                  <stop offset="0%" stopColor="#fffbd1" />
                  <stop offset="32%" stopColor="#ffe138" />
                  <stop offset="72%" stopColor="#eea000" />
                  <stop offset="100%" stopColor="#8c4e00" />
                </radialGradient>
                {/* Fresnel lens texture pattern */}
                <pattern id={fresnelId} width="6" height="6" patternUnits="userSpaceOnUse">
                  <path
                    d="M 6 0 L 0 0 0 6"
                    fill="none"
                    stroke="rgba(0,0,0,0.22)"
                    strokeWidth="0.9"
                  />
                </pattern>
              </defs>

              {/* Mounting Pole */}
              <rect x="114" y="388" width="44" height="62" rx="6" fill="#181b18" />
              <rect x="114" y="388" width="14" height="62" rx="4" fill="#2c312c" opacity="0.55" />

              {/* Main Signal Body (3/4 perspective bevel) */}
              <rect
                x="62"
                y="16"
                width="148"
                height="376"
                rx="18"
                fill={`url(#${housingGradId})`}
                stroke="#434a44"
                strokeWidth="1.5"
              />

              {/* Right-side Mounting Brackets & Bolts */}
              <rect x="206" y="72" width="12" height="14" rx="2" fill="#232824" />
              <rect x="206" y="186" width="12" height="14" rx="2" fill="#232824" />
              <rect x="206" y="302" width="12" height="14" rx="2" fill="#232824" />

              {/* TOP RED LENS (Off) */}
              <g>
                <circle cx="136" cy="84" r="42" fill="#685e60" stroke="#101210" strokeWidth="4" />
                <circle cx="136" cy="84" r="39" fill={`url(#${fresnelId})`} />
                {/* Deep 3D Hooded Visor */}
                <path
                  d="M72 82 C72 22, 186 22, 182 80 C166 44, 102 44, 86 92 C78 90, 72 86, 72 82 Z"
                  fill={`url(#${visorGradId})`}
                />
              </g>

              {/* MIDDLE AMBER LENS (Glowing Caution!) */}
              <g>
                <circle
                  cx="134"
                  cy="200"
                  r="64"
                  fill="#ffcf18"
                  opacity="0.32"
                  className="maint-page__amber-glow"
                />
                <circle
                  cx="136"
                  cy="200"
                  r="42"
                  fill={`url(#${amberGlowId})`}
                  stroke="#141410"
                  strokeWidth="4"
                  className="maint-page__amber-glow"
                />
                <circle cx="136" cy="200" r="39" fill={`url(#${fresnelId})`} />
                {/* Visor with warm inner amber bounce */}
                <path
                  d="M72 198 C72 138, 186 138, 182 196 C166 160, 102 160, 86 208 C78 206, 72 202, 72 198 Z"
                  fill={`url(#${visorAmberId})`}
                />
              </g>

              {/* BOTTOM GREEN LENS (Off) */}
              <g>
                <circle cx="136" cy="316" r="42" fill="#4f6460" stroke="#101210" strokeWidth="4" />
                <circle cx="136" cy="316" r="39" fill={`url(#${fresnelId})`} />
                <path
                  d="M72 314 C72 254, 186 254, 182 312 C166 276, 102 276, 86 324 C78 322, 72 318, 72 314 Z"
                  fill={`url(#${visorGradId})`}
                />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Location */}
      <footer className="maint-page__footer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span>Pramuditha Nadun · Software Engineer · Nugegoda, Sri Lanka</span>
      </footer>
    </main>
  );
}
