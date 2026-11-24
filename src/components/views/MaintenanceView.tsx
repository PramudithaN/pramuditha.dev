import { EXTERNAL_LINKS } from '../../constants/links';
import './maintenance-view.css';

const RULER_TICKS = Array.from({ length: 25 }, (_, i) => i);

export default function MaintenanceView() {
  return (
    <main
      className="maint-hud"
      role="status"
      aria-live="polite"
      aria-label="Site Under Maintenance"
    >
      <div className="maint-hud__frame">
        {/* 4 Caution-Yellow Corner Brackets */}
        <span className="maint-hud__corner maint-hud__corner--tl" aria-hidden="true" />
        <span className="maint-hud__corner maint-hud__corner--tr" aria-hidden="true" />
        <span className="maint-hud__corner maint-hud__corner--bl" aria-hidden="true" />
        <span className="maint-hud__corner maint-hud__corner--br" aria-hidden="true" />

        {/* Right-Edge Vertical Measurement Ruler */}
        <svg
          className="maint-hud__ruler"
          viewBox="0 0 18 300"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <line x1="16" y1="0" x2="16" y2="300" stroke="currentColor" strokeWidth="1.2" />
          <line x1="2" y1="0" x2="16" y2="0" stroke="currentColor" strokeWidth="1.2" />
          {RULER_TICKS.map((idx) => {
            const y = idx * 12;
            const isMajor = idx % 5 === 0;
            return (
              <line
                key={idx}
                x1={isMajor ? 4 : 10}
                y1={y}
                x2="16"
                y2={y}
                stroke="currentColor"
                strokeWidth="1"
              />
            );
          })}
        </svg>

        {/* Bold Monospace Headline */}
        <h1 className="maint-hud__headline">
          <span>REBUILDING</span>
          <span>THE SOURCE</span>
          <span>REALITY.</span>
        </h1>

        <div className="maint-hud__dash" aria-hidden="true" />

        {/* Developer Maintenance Copy */}
        <p className="maint-hud__subcopy">
          Refactoring architecture &amp; pushing clean commits.
          <br />
          pramuditha.dev is under scheduled maintenance.
        </p>

        {/* Chamfered Caution-Yellow CTA */}
        <a
          href={EXTERNAL_LINKS.GITHUB}
          target="_blank"
          rel="noopener noreferrer"
          className="maint-hud__cta"
        >
          [ SITE UNDER MAINTENANCE - GITHUB ↗ ]
        </a>

        {/* Terminal Status Prompt */}
        <p className="maint-hud__status">
          <span>&gt; DEPLOY.STATUS: MAINTENANCE</span>
          <span className="maint-hud__cursor" aria-hidden="true" />
        </p>

        {/* Bottom Hairline Footer */}
        <footer className="maint-hud__footer">
          <span>PRAMUDITHA.DEV // 503</span>

          <nav className="maint-hud__links" aria-label="Contact links">
            <a
              href={EXTERNAL_LINKS.LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="maint-hud__link"
            >
              LinkedIn ↗
            </a>
            <a
              href="mailto:pramudithanadun@gmail.com"
              className="maint-hud__link"
            >
              pramudithanadun@gmail.com
            </a>
          </nav>
        </footer>
      </div>
    </main>
  );
}
