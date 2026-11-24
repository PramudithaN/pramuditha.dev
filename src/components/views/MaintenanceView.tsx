import { useEffect, useRef } from 'react';
import { EXTERNAL_LINKS } from '../../constants/links';
import './maintenance-view.css';

/**
 * Renders a crisp, front-facing industrial metallic traffic signal
 * with top glowing amber Fresnel lens, off middle/bottom black Fresnel domes,
 * corner hex bolts, and segmented mounting pole.
 */
function renderFrontTrafficSignal(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = 340 * dpr;
  const h = 660 * dpr;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, 340, 660);

  // 1. Segmented Cylindrical Pole (bottom)
  const poleGrad = ctx.createLinearGradient(136, 520, 204, 520);
  poleGrad.addColorStop(0, '#42464a');
  poleGrad.addColorStop(0.32, '#8b9196');
  poleGrad.addColorStop(0.68, '#595e63');
  poleGrad.addColorStop(1, '#2b2e31');
  ctx.fillStyle = poleGrad;
  ctx.fillRect(142, 510, 56, 150);

  // Pole horizontal joints
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(140, 558, 60, 4);
  ctx.fillRect(140, 610, 60, 4);

  // Top finial cap & small mounting pins
  ctx.fillStyle = '#5e6368';
  ctx.beginPath();
  ctx.roundRect(154, 16, 32, 16, 6);
  ctx.fill();
  ctx.fillStyle = '#383b3e';
  ctx.fillRect(222, 18, 6, 12);
  ctx.fillRect(112, 18, 6, 12);

  // 2. Outer Industrial Grey Housing
  const bodyGrad = ctx.createLinearGradient(44, 28, 296, 515);
  bodyGrad.addColorStop(0, '#787e84');
  bodyGrad.addColorStop(0.5, '#5b6066');
  bodyGrad.addColorStop(1, '#3b3e42');

  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = '#25282b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(46, 28, 248, 486, 28);
  ctx.fill();
  ctx.stroke();

  // Inner recessed housing frame
  ctx.strokeStyle = '#8b9196';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(56, 38, 228, 466, 22);
  ctx.stroke();

  // Bottom tiny bolts
  ctx.fillStyle = '#25282b';
  for (const bx of [82, 108, 232, 258]) {
    ctx.fillRect(bx - 3, 513, 6, 8);
  }

  // 3. Draw 3 Modular Lens Units (Top = Glowing Amber, Mid/Bot = Off Black Fresnel)
  const moduleCenters = [120, 271, 422] as const;

  moduleCenters.forEach((cy, idx) => {
    const isLit = idx === 0;
    const modX = 68;
    const modY = cy - 71;
    const modW = 204;
    const modH = 142;

    // Modular square backing plate
    const plateGrad = ctx.createLinearGradient(modX, modY, modX + modW, modY + modH);
    plateGrad.addColorStop(0, '#80868c');
    plateGrad.addColorStop(1, '#585c61');
    ctx.fillStyle = plateGrad;
    ctx.strokeStyle = '#36393d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(modX, modY, modW, modH, 16);
    ctx.fill();
    ctx.stroke();

    // 4 Hex Corner Bolts per module
    const boltOffsets = [
      [modX + 16, modY + 16],
      [modX + modW - 16, modY + 16],
      [modX + 16, modY + modH - 16],
      [modX + modW - 16, modY + modH - 16],
    ];
    for (const [bx, by] of boltOffsets) {
      ctx.fillStyle = '#3b3e42';
      ctx.beginPath();
      ctx.arc(bx, by, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#9ca2a8';
      ctx.beginPath();
      ctx.arc(bx - 1, by - 1, 4.2, 0, Math.PI * 2);
      ctx.fill();
    }

    const cx = 170;
    const outerR = 64;
    const lensR = 50;

    // Outer circular visor rim
    ctx.fillStyle = isLit ? '#d66000' : '#1b1d1f';
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fill();

    // Inner visor wall depth
    const rimGrad = ctx.createRadialGradient(cx, cy + 8, lensR - 4, cx, cy, outerR);
    if (isLit) {
      rimGrad.addColorStop(0, '#ffae00');
      rimGrad.addColorStop(0.75, '#e05b00');
      rimGrad.addColorStop(1, '#4f2200');
    } else {
      rimGrad.addColorStop(0, '#090a0b');
      rimGrad.addColorStop(0.8, '#202326');
      rimGrad.addColorStop(1, '#08090a');
    }
    ctx.fillStyle = rimGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR - 4, 0, Math.PI * 2);
    ctx.fill();

    // Lens glass dome
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, lensR, 0, Math.PI * 2);
    ctx.clip();

    if (isLit) {
      const glow = ctx.createRadialGradient(cx, cy, 4, cx, cy, lensR);
      glow.addColorStop(0, '#fffce0');
      glow.addColorStop(0.28, '#ffe033');
      glow.addColorStop(0.68, '#ff9800');
      glow.addColorStop(1, '#bd4800');
      ctx.fillStyle = glow;
      ctx.fillRect(cx - lensR, cy - lensR, lensR * 2, lensR * 2);
    } else {
      const darkGlass = ctx.createRadialGradient(cx, cy - 6, 4, cx, cy, lensR);
      darkGlass.addColorStop(0, '#454a4f');
      darkGlass.addColorStop(0.45, '#191b1d');
      darkGlass.addColorStop(1, '#070809');
      ctx.fillStyle = darkGlass;
      ctx.fillRect(cx - lensR, cy - lensR, lensR * 2, lensR * 2);
    }

    // Precision Fresnel Honeycomb / Grid Texture
    ctx.strokeStyle = isLit ? 'rgba(180, 68, 0, 0.38)' : 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let r = 8; r < lensR; r += 6) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (let g = -lensR; g <= lensR; g += 6) {
      ctx.beginPath();
      ctx.moveTo(cx + g, cy - lensR);
      ctx.lineTo(cx + g, cy + lensR);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - lensR, cy + g);
      ctx.lineTo(cx + lensR, cy + g);
      ctx.stroke();
    }
    ctx.restore();
  });
}

export default function MaintenanceView() {
  const signalRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (signalRef.current) {
      renderFrontTrafficSignal(signalRef.current);
    }
  }, []);

  return (
    <main className="maint-page" aria-label="Site Under Maintenance">
      {/* Faint City-Map Street Grid */}
      <svg
        className="maint-page__map"
        viewBox="0 0 1000 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
      >
        <g stroke="currentColor" strokeWidth="1.2">
          <path d="M0 120 L1000 310" />
          <path d="M0 380 L1000 220" />
          <path d="M0 640 L1000 480" />
          <path d="M180 0 L80 800" />
          <path d="M460 0 L620 800" />
          <path d="M740 0 L540 800" />
          <path d="M920 0 L840 800" />
          <circle cx="540" cy="310" r="85" />
          <circle cx="220" cy="490" r="65" />
        </g>
      </svg>

      {/* Top-Right Vertical Chevrons */}
      <div className="maint-page__chevrons" aria-hidden="true">
        {Array.from({ length: 7 }).map((_, i) => (
          <svg key={i} width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path
              d="M2 2L6 6L10 2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </div>

      <div className="maint-page__container">
        {/* Left-Center: Front-Facing Industrial Traffic Signal */}
        <div className="maint-page__signal-wrap" aria-hidden="true">
          <canvas ref={signalRef} className="maint-page__signal-canvas" />
        </div>

        {/* Right: Editorial Maintenance Copy */}
        <div className="maint-page__content">
          <div className="maint-page__brand">
            <span className="maint-page__brand-kicker">PORTFOLIO</span>
            <div className="maint-page__brand-row">
              <span className="maint-page__brand-name">PRAMUDITHA</span>
              <svg
                className="maint-page__brand-slash"
                viewBox="0 0 28 28"
                fill="currentColor"
                aria-hidden="true"
              >
                <polygon points="22,2 27,2 10,26 5,26" />
                <polygon points="8,11 13,11 21,23 16,23" />
              </svg>
            </div>
          </div>

          <h1 className="maint-page__headline">
            <span className="maint-page__headline-dark">site under</span>
            <span className="maint-page__headline-white">maintenance</span>
          </h1>

          <p className="maint-page__subhead">
            Upgrading systems,
            <br />
            crafting what&apos;s next.
          </p>

          <div className="maint-page__callouts">
            <div className="maint-page__callout">
              <span className="maint-page__icon-box" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 5H20V16H9L4 20V5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <line x1="12" y1="8.5" x2="12" y2="11.5" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="13.8" r="1" fill="currentColor" />
                </svg>
              </span>
              <p className="maint-page__callout-text">
                A new editorial experience is in progress.
              </p>
            </div>

            <div className="maint-page__callout">
              <span className="maint-page__icon-box" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M8 9L4 12L8 15M16 9L20 12L16 15M13.5 7L10.5 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p className="maint-page__callout-text">
                Clean architecture is worth{' '}
                <span className="maint-page__highlight-word">the short wait.</span>
              </p>
            </div>
          </div>

          <div className="maint-page__divider" aria-hidden="true" />

          <nav className="maint-page__links" aria-label="Contact links">
            <a
              href={EXTERNAL_LINKS.GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="maint-page__link"
            >
              GitHub ↗
            </a>
            <a
              href={EXTERNAL_LINKS.LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="maint-page__link"
            >
              LinkedIn ↗
            </a>
            <a
              href="mailto:pramudithanadun@gmail.com"
              className="maint-page__link"
            >
              pramudithanadun@gmail.com
            </a>
          </nav>
        </div>
      </div>
    </main>
  );
}
