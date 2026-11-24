import { useEffect, useRef } from 'react';
import { EXTERNAL_LINKS } from '../../constants/links';
import './maintenance-view.css';

/**
 * Procedurally renders a 3/4-perspective 3D-shaded traffic signal with
 * deep curved sun visors, Fresnel prism lenses, side bolts, and warm amber bloom.
 */
function renderTrafficSignal(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = 440 * dpr;
  const h = 640 * dpr;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, 440, 640);

  // 1. Cylindrical mounting pole at bottom
  const poleGrad = ctx.createLinearGradient(210, 540, 290, 540);
  poleGrad.addColorStop(0, '#0f1110');
  poleGrad.addColorStop(0.35, '#2f3532');
  poleGrad.addColorStop(0.75, '#171a18');
  poleGrad.addColorStop(1, '#090a09');
  ctx.fillStyle = poleGrad;
  ctx.beginPath();
  ctx.roundRect(216, 535, 68, 115, 8);
  ctx.fill();

  // Pole collar ring
  ctx.fillStyle = '#242926';
  ctx.beginPath();
  ctx.ellipse(250, 540, 40, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Main 3/4 extruded dark-olive metallic housing
  const bodyGrad = ctx.createLinearGradient(140, 30, 330, 540);
  bodyGrad.addColorStop(0, '#2c332d');
  bodyGrad.addColorStop(0.45, '#191d1a');
  bodyGrad.addColorStop(1, '#0b0d0b');

  // Side extrusion (right bevel)
  ctx.fillStyle = '#0e110f';
  ctx.beginPath();
  ctx.roundRect(162, 32, 168, 510, 18);
  ctx.fill();

  // Front face
  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = '#3f4740';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(142, 26, 170, 514, 18);
  ctx.fill();
  ctx.stroke();

  // Right-side mounting hinges & bolts
  const boltYs = [88, 134, 244, 292, 404, 452];
  for (const by of boltYs) {
    ctx.fillStyle = '#222723';
    ctx.fillRect(310, by - 6, 18, 12);
    ctx.fillStyle = '#6c756d';
    ctx.beginPath();
    ctx.arc(322, by, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Helper to draw each 3/4 elliptical Fresnel lens + deep curved 3D visor
  const drawLensUnit = (
    cy: number,
    mode: 'red-off' | 'amber-on' | 'green-off'
  ) => {
    const cx = 216;
    const rx = 58;
    const ry = 66;

    // Ambient outer glow for the active amber light
    if (mode === 'amber-on') {
      const bloom = ctx.createRadialGradient(cx - 10, cy, 20, cx - 10, cy, 135);
      bloom.addColorStop(0, 'rgba(255, 224, 56, 0.55)');
      bloom.addColorStop(0.45, 'rgba(255, 196, 12, 0.22)');
      bloom.addColorStop(1, 'rgba(255, 180, 0, 0)');
      ctx.fillStyle = bloom;
      ctx.beginPath();
      ctx.arc(cx - 10, cy, 135, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outer metallic lens bezel
    ctx.fillStyle = '#0c0e0c';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx + 6, ry + 6, -0.05, 0, Math.PI * 2);
    ctx.fill();

    // Lens base glass gradient
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, -0.05, 0, Math.PI * 2);
    ctx.clip();

    if (mode === 'red-off') {
      const g = ctx.createRadialGradient(cx + 10, cy + 8, 6, cx, cy, ry);
      g.addColorStop(0, '#9c9295');
      g.addColorStop(0.65, '#6b6265');
      g.addColorStop(1, '#363032');
      ctx.fillStyle = g;
    } else if (mode === 'amber-on') {
      const g = ctx.createRadialGradient(cx - 4, cy + 4, 8, cx, cy, ry);
      g.addColorStop(0, '#fffce0');
      g.addColorStop(0.28, '#ffe647');
      g.addColorStop(0.7, '#f5a800');
      g.addColorStop(1, '#995300');
      ctx.fillStyle = g;
    } else {
      const g = ctx.createRadialGradient(cx + 8, cy + 12, 6, cx, cy, ry);
      g.addColorStop(0, '#9eb5b0');
      g.addColorStop(0.6, '#5c736e');
      g.addColorStop(1, '#263330');
      ctx.fillStyle = g;
    }
    ctx.fillRect(cx - rx - 10, cy - ry - 10, (rx + 10) * 2, (ry + 10) * 2);

    // Fresnel concentric rings + micro-prism grid
    ctx.strokeStyle =
      mode === 'amber-on' ? 'rgba(180, 95, 0, 0.34)' : 'rgba(20, 22, 24, 0.36)';
    ctx.lineWidth = 1;
    for (let r = 10; r < ry + 10; r += 9) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 0.88, r, -0.05, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (let gx = cx - rx; gx <= cx + rx; gx += 7) {
      ctx.beginPath();
      ctx.moveTo(gx, cy - ry);
      ctx.lineTo(gx, cy + ry);
      ctx.stroke();
    }
    for (let gy = cy - ry; gy <= cy + ry; gy += 7) {
      ctx.beginPath();
      ctx.moveTo(cx - rx, gy);
      ctx.lineTo(cx + rx, gy);
      ctx.stroke();
    }

    // Inner top shadow cast by the visor hood
    const innerShadow = ctx.createLinearGradient(cx, cy - ry, cx - 25, cy + 10);
    innerShadow.addColorStop(0, 'rgba(0,0,0,0.65)');
    innerShadow.addColorStop(0.55, 'rgba(0,0,0,0.18)');
    innerShadow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = innerShadow;
    ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);
    ctx.restore();

    // Deep 3D Curved Cylindrical Visor / Hood protruding forward-left
    const hoodGrad = ctx.createLinearGradient(cx - 105, cy - 75, cx + 40, cy + 40);
    if (mode === 'amber-on') {
      hoodGrad.addColorStop(0, '#2a2206');
      hoodGrad.addColorStop(0.45, '#785a08');
      hoodGrad.addColorStop(0.75, '#b88b0e');
      hoodGrad.addColorStop(1, '#1d211d');
    } else {
      hoodGrad.addColorStop(0, '#0f120f');
      hoodGrad.addColorStop(0.45, '#2c332d');
      hoodGrad.addColorStop(0.8, '#1a1e1b');
      hoodGrad.addColorStop(1, '#090b09');
    }

    ctx.fillStyle = hoodGrad;
    ctx.beginPath();
    // Outer hood arc sweeping forward-left
    ctx.moveTo(cx - 26, cy + 36);
    ctx.bezierCurveTo(
      cx - 108,
      cy + 14,
      cx - 108,
      cy - 86,
      cx - 14,
      cy - 78
    );
    ctx.bezierCurveTo(
      cx + 42,
      cy - 74,
      cx + 68,
      cy - 34,
      cx + 60,
      cy + 12
    );
    // Inner hood rim hugging the top-left of the lens
    ctx.bezierCurveTo(
      cx + 42,
      cy - 44,
      cx - 22,
      cy - 54,
      cx - 46,
      cy - 18
    );
    ctx.bezierCurveTo(
      cx - 60,
      cy + 4,
      cx - 46,
      cy + 28,
      cx - 26,
      cy + 36
    );
    ctx.closePath();
    ctx.fill();

    // Crisp metallic rim highlight along the hood front edge
    ctx.strokeStyle =
      mode === 'amber-on' ? 'rgba(255, 224, 102, 0.55)' : 'rgba(180, 195, 182, 0.32)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(cx - 26, cy + 35);
    ctx.bezierCurveTo(cx - 106, cy + 14, cx - 106, cy - 84, cx - 14, cy - 77);
    ctx.stroke();
  };

  drawLensUnit(118, 'red-off');
  drawLensUnit(282, 'amber-on');
  drawLensUnit(446, 'green-off');
}

export default function MaintenanceView() {
  const signalCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (signalCanvasRef.current) {
      renderTrafficSignal(signalCanvasRef.current);
    }
  }, []);

  return (
    <main className="maint-page" aria-label="Site Under Maintenance">
      {/* Detailed Architectural Wireframe Skyline */}
      <svg
        className="maint-page__skyline"
        viewBox="0 0 1200 420"
        preserveAspectRatio="xMidYMin slice"
        fill="none"
        aria-hidden="true"
      >
        <g stroke="currentColor" strokeWidth="1.15">
          {/* Left street buildings */}
          <rect x="20" y="30" width="150" height="390" />
          <rect x="44" y="65" width="32" height="52" />
          <rect x="98" y="65" width="32" height="52" />
          <rect x="44" y="142" width="32" height="52" />
          <rect x="98" y="142" width="32" height="52" />
          <rect x="44" y="218" width="32" height="52" />
          <rect x="98" y="218" width="32" height="52" />
          {/* Mid-left classic facade */}
          <rect x="190" y="95" width="185" height="325" />
          <line x1="190" y1="130" x2="375" y2="130" />
          <rect x="215" y="150" width="135" height="22" />
          <rect x="215" y="190" width="135" height="22" />
          <rect x="215" y="230" width="135" height="22" />
          {/* Center tower */}
          <rect x="405" y="18" width="210" height="402" />
          <polygon points="405,18 510,-18 615,18" />
          <rect x="435" y="48" width="42" height="60" />
          <rect x="492" y="48" width="42" height="60" />
          <rect x="548" y="48" width="42" height="60" />
          {/* Right skyline */}
          <rect x="645" y="75" width="175" height="345" />
          <rect x="670" y="105" width="38" height="48" />
          <rect x="725" y="105" width="38" height="48" />
          <rect x="850" y="38" width="160" height="382" />
          <rect x="1035" y="88" width="145" height="332" />
          <line x1="0" y1="365" x2="1200" y2="390" />
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

          <div className="maint-page__signal-wrap" aria-hidden="true">
            <canvas
              ref={signalCanvasRef}
              className="maint-page__signal-canvas"
            />
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
