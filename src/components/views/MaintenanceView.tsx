import { useId } from 'react';
import { EXTERNAL_LINKS } from '../../constants/links';
import './maintenance-view.css';

export default function MaintenanceView() {
  const uid = useId().replace(/:/g, '');
  const amberGlowId = `maint-amber-${uid}`;
  const housingGradId = `maint-housing-${uid}`;

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

          {/* 3-Lens Traffic Light with Glowing Caution Amber */}
          <div className="maint-page__signal-wrap" aria-hidden="true">
            <svg viewBox="0 0 220 420" fill="none">
              <defs>
                <linearGradient id={housingGradId} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#323432" />
                  <stop offset="55%" stopColor="#1c1e1c" />
                  <stop offset="100%" stopColor="#0d0e0d" />
                </linearGradient>
                <radialGradient id={amberGlowId} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fff7a8" />
                  <stop offset="45%" stopColor="#ffd81f" />
                  <stop offset="85%" stopColor="#e69500" />
                  <stop offset="100%" stopColor="#a65b00" />
                </radialGradient>
              </defs>

              {/* Mounting Pole */}
              <rect x="92" y="366" width="36" height="54" rx="4" fill="#181a18" />

              {/* Signal Body */}
              <rect
                x="44"
                y="18"
                width="132"
                height="354"
                rx="22"
                fill={`url(#${housingGradId})`}
                stroke="#3d403d"
                strokeWidth="2"
              />

              {/* Top Red Lens (Off) */}
              <path d="M56 76 C56 36, 164 36, 164 76 L154 62 C136 48, 84 48, 66 62 Z" fill="#0e0f0e" />
              <circle cx="110" cy="84" r="38" fill="#5e5456" stroke="#121312" strokeWidth="4" />
              <circle cx="110" cy="84" r="32" fill="#706668" opacity="0.55" />

              {/* Middle Caution Amber Lens (Glowing!) */}
              <circle
                cx="110"
                cy="195"
                r="52"
                fill="#ffcf18"
                opacity="0.28"
                className="maint-page__amber-glow"
              />
              <path d="M56 186 C56 146, 164 146, 164 186 L154 172 C136 158, 84 158, 66 172 Z" fill="#0e0f0e" />
              <circle
                cx="110"
                cy="195"
                r="38"
                fill={`url(#${amberGlowId})`}
                stroke="#121312"
                strokeWidth="4"
                className="maint-page__amber-glow"
              />

              {/* Bottom Green Lens (Off) */}
              <path d="M56 296 C56 256, 164 256, 164 296 L154 282 C136 268, 84 268, 66 282 Z" fill="#0e0f0e" />
              <circle cx="110" cy="306" r="38" fill="#465955" stroke="#121312" strokeWidth="4" />
              <circle cx="110" cy="306" r="32" fill="#5b706c" opacity="0.5" />
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
