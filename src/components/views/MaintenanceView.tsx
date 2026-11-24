import { useEffect, useId, useRef } from 'react';
import { EXTERNAL_LINKS } from '../../constants/links';
import './maintenance-view.css';

/**
 * Renders a matte-black industrial 3-lens traffic signal matching the reference:
 * - Top lens: off textured black Fresnel
 * - Middle lens: off black Fresnel with circular white micro-text ring
 * - Bottom lens: brightly glowing amber-yellow LED/Fresnel dot matrix
 */
function renderMatteBlackSignal(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = 320 * dpr;
  const h = 680 * dpr;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, 320, 680);

  // 1. Cylindrical matte-black mounting pole
  const poleGrad = ctx.createLinearGradient(128, 520, 192, 520);
  poleGrad.addColorStop(0, '#0c0d0e');
  poleGrad.addColorStop(0.35, '#2b2e31');
  poleGrad.addColorStop(0.7, '#16181a');
  poleGrad.addColorStop(1, '#08090a');
  ctx.fillStyle = poleGrad;
  ctx.fillRect(132, 505, 56, 175);

  ctx.fillStyle = '#202326';
  ctx.fillRect(124, 505, 72, 10);

  // 2. Main matte-black 3-module housing
  const bodyGrad = ctx.createLinearGradient(34, 24, 286, 510);
  bodyGrad.addColorStop(0, '#2a2d30');
  bodyGrad.addColorStop(0.5, '#181a1c');
  bodyGrad.addColorStop(1, '#0b0c0d');

  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = '#08090a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(36, 26, 248, 482, 14);
  ctx.fill();
  ctx.stroke();

  // Horizontal seams between the 3 stacked modules
  ctx.strokeStyle = '#090a0b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(36, 187);
  ctx.lineTo(284, 187);
  ctx.moveTo(36, 348);
  ctx.lineTo(284, 348);
  ctx.stroke();

  const moduleCenters = [106, 267, 428] as const;

  moduleCenters.forEach((cy, idx) => {
    const isLit = idx === 2; // Bottom lens brightly lit in amber-yellow
    const isMiddle = idx === 1;
    const modX = 44;
    const modY = cy - 72;
    const modW = 232;
    const modH = 144;

    // Subtle inner module frame
    ctx.strokeStyle = '#34383c';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(modX, modY, modW, modH, 8);
    ctx.stroke();

    // 4 Hex Corner Screws
    for (const [bx, by] of [
      [modX + 12, modY + 12],
      [modX + modW - 12, modY + 12],
      [modX + 12, modY + modH - 12],
      [modX + modW - 12, modY + modH - 12],
    ]) {
      ctx.fillStyle = '#0a0b0c';
      ctx.beginPath();
      ctx.arc(bx, by, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#484d52';
      ctx.beginPath();
      ctx.arc(bx - 0.8, by - 0.8, 3.6, 0, Math.PI * 2);
      ctx.fill();
    }

    const cx = 160;
    const hoodR = 72;
    const lensR = 54;

    // Deep circular sun visor rim
    const visorGrad = ctx.createRadialGradient(cx, cy + 10, lensR, cx, cy, hoodR);
    if (isLit) {
      visorGrad.addColorStop(0, '#c77d00');
      visorGrad.addColorStop(0.5, '#191b1d');
      visorGrad.addColorStop(1, '#08090a');
    } else {
      visorGrad.addColorStop(0, '#070809');
      visorGrad.addColorStop(0.7, '#222528');
      visorGrad.addColorStop(1, '#0a0b0c');
    }
    ctx.fillStyle = visorGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, hoodR, 0, Math.PI * 2);
    ctx.fill();

    // Lens Glass Core
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, lensR, 0, Math.PI * 2);
    ctx.clip();

    if (isLit) {
      const glow = ctx.createRadialGradient(cx, cy, 4, cx, cy, lensR);
      glow.addColorStop(0, '#fffce3');
      glow.addColorStop(0.32, '#ffe135');
      glow.addColorStop(0.75, '#f59e0b');
      glow.addColorStop(1, '#9a4d00');
      ctx.fillStyle = glow;
      ctx.fillRect(cx - lensR, cy - lensR, lensR * 2, lensR * 2);
    } else {
      const darkLens = ctx.createRadialGradient(cx, cy - 6, 4, cx, cy, lensR);
      darkLens.addColorStop(0, '#2a2d30');
      darkLens.addColorStop(0.55, '#111315');
      darkLens.addColorStop(1, '#050607');
      ctx.fillStyle = darkLens;
      ctx.fillRect(cx - lensR, cy - lensR, lensR * 2, lensR * 2);
    }

    // Precision LED / Fresnel Dot Matrix inside the lens
    for (let y = cy - lensR + 4; y <= cy + lensR - 4; y += 6) {
      for (let x = cx - lensR + 4; x <= cx + lensR - 4; x += 6) {
        const dist = Math.hypot(x - cx, y - cy);
        if (dist > lensR - 3) continue;
        ctx.fillStyle = isLit
          ? dist < 24
            ? 'rgba(255, 255, 255, 0.72)'
            : 'rgba(180, 92, 0, 0.32)'
          : 'rgba(255, 255, 255, 0.14)';
        ctx.beginPath();
        ctx.arc(x, y, isLit ? 1.8 : 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Circular micro-text inside the middle lens (matching reference)
    if (isMiddle) {
      const ringText = 'PRAMUDITHA NADUN · SOFTWARE ENGINEER · ';
      ctx.save();
      ctx.font = '700 6.5px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const radius = 36;
      for (let i = 0; i < ringText.length; i++) {
        const angle = (i / ringText.length) * Math.PI * 2 - Math.PI / 2;
        ctx.save();
        ctx.translate(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
        ctx.rotate(angle + Math.PI / 2);
        ctx.fillText(ringText[i], 0, 0);
        ctx.restore();
      }
      ctx.restore();
    }

    ctx.restore();
  });
}

export default function MaintenanceView() {
  const uid = useId().replace(/:/g, '');
  const grainId = `mp-grain-${uid}`;
  const signalRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (signalRef.current) {
      renderMatteBlackSignal(signalRef.current);
    }
  }, []);

  return (
    <main className="maint-poster" aria-label="Site Under Maintenance">
      {/* Subtle Paper Grain */}
      <svg className="maint-poster__grain" aria-hidden="true">
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

      {/* Center Stage: Left Editorial Typography + Right Matte-Black Traffic Signal */}
      <div className="maint-poster__stage">
        <div className="maint-poster__left">
          <h1 className="maint-poster__stacked-title">
            <span>IN</span>
            <span>RE</span>
            <span>PAIR</span>
          </h1>
          <p className="maint-poster__script">Back Soon</p>

          <div className="maint-poster__vertical-lines">
            <span>CRAFTING</span>
            <span>A NEW</span>
            <span>EDITORIAL</span>
            <span>PORTFOLIO</span>
            <span>EXPERIENCE</span>
            <span>SOON.</span>
          </div>
        </div>

        <div className="maint-poster__signal-wrap" aria-hidden="true">
          <canvas ref={signalRef} className="maint-poster__signal-canvas" />
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="maint-poster__footer">
        <div className="maint-poster__links-row">
          <a
            href={EXTERNAL_LINKS.GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="maint-poster__link"
          >
            @PramudithaN
          </a>
          <a
            href={EXTERNAL_LINKS.LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="maint-poster__link"
          >
            LinkedIn ↗
          </a>
          <a
            href="mailto:pramudithanadun@gmail.com"
            className="maint-poster__link"
          >
            pramuditha.is-a.dev
          </a>
        </div>
        <p className="maint-poster__note">
          Currently upgrading pramuditha.dev — systems architecture, 3D motion,
          and visual craft. Everything will be back online shortly.
        </p>
      </footer>
    </main>
  );
}
