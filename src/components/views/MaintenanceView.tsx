import { useEffect, useRef } from 'react';
import { EXTERNAL_LINKS } from '../../constants/links';
import './maintenance-view.css';

const RULER_TICKS = Array.from({ length: 25 }, (_, i) => i);

/**
 * Renders a matte-black Fresnel traffic signal pod with a glowing
 * caution-yellow (!) exclamation mark made of illuminated prism cells
 * and a dithered halftone edge matching the reference visual.
 */
function renderExclamationPod(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const size = 340;
  canvas.width = size * dpr;
  canvas.height = size * dpr;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, size, size);

  const podX = 28;
  const podY = 24;
  const podW = 264;
  const podH = 276;

  // Subtle dithered halftone pixel-dot aura along right/bottom edge
  for (let y = podY + 8; y < podY + podH + 18; y += 8) {
    for (let x = podX + podW - 6; x < podX + podW + 26; x += 8) {
      const dist = (x - (podX + podW - 6)) / 32;
      const r = Math.max(0.6, 2.8 * (1 - dist));
      ctx.fillStyle = `rgba(245, 197, 24, ${0.42 * (1 - dist)})`;
      ctx.fillRect(x, y, r * 1.4, r * 1.4);
    }
  }

  // Glossy black rounded modular housing
  const bodyGrad = ctx.createLinearGradient(podX, podY, podX + podW, podY + podH);
  bodyGrad.addColorStop(0, '#2a2d31');
  bodyGrad.addColorStop(0.45, '#151719');
  bodyGrad.addColorStop(1, '#08090a');

  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = '#383c42';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(podX, podY, podW, podH, 26);
  ctx.fill();
  ctx.stroke();

  // Inner metallic bezel line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(podX + 10, podY + 10, podW - 20, podH - 20, 20);
  ctx.stroke();

  // 4 Silver Hex Corner Screws
  for (const [sx, sy] of [
    [podX + 26, podY + 26],
    [podX + podW - 26, podY + 26],
    [podX + 26, podY + podH - 26],
    [podX + podW - 26, podY + podH - 26],
  ]) {
    ctx.fillStyle = '#0a0b0c';
    ctx.beginPath();
    ctx.arc(sx, sy, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#a8aeb5';
    ctx.beginPath();
    ctx.arc(sx - 0.8, sy - 0.8, 6.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2b2e32';
    ctx.beginPath();
    ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const cx = podX + podW * 0.5;
  const cy = podY + podH * 0.5;
  const hoodR = 114;
  const lensR = 94;

  // Deep circular hood / sun visor shadow
  const hoodGrad = ctx.createRadialGradient(cx, cy + 12, lensR - 6, cx, cy, hoodR);
  hoodGrad.addColorStop(0, '#050607');
  hoodGrad.addColorStop(0.75, '#1d2023');
  hoodGrad.addColorStop(1, '#08090a');
  ctx.fillStyle = hoodGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, hoodR, 0, Math.PI * 2);
  ctx.fill();

  // Dark lens glass dome + warm yellow inner glow
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, lensR, 0, Math.PI * 2);
  ctx.clip();

  const glassGrad = ctx.createRadialGradient(cx, cy, 8, cx, cy, lensR);
  glassGrad.addColorStop(0, '#2a2408');
  glassGrad.addColorStop(0.55, '#101214');
  glassGrad.addColorStop(1, '#040506');
  ctx.fillStyle = glassGrad;
  ctx.fillRect(cx - lensR, cy - lensR, lensR * 2, lensR * 2);

  // Determine if cell (x, y) belongs to the glowing yellow (!) exclamation mark
  const isExclamationCell = (x: number, y: number): boolean => {
    const dx = Math.abs(x - cx);
    // Top vertical bar of (!)
    const inBar = dx <= 11 && y >= cy - 58 && y <= cy + 14;
    // Bottom dot of (!)
    const inDot = Math.hypot(x - cx, y - (cy + 40)) <= 12.5;
    return inBar || inDot;
  };

  // Render individual Fresnel prism cells across the entire circular lens
  const step = 7.2;
  for (let y = cy - lensR + 4; y <= cy + lensR - 4; y += step) {
    for (let x = cx - lensR + 4; x <= cx + lensR - 4; x += step) {
      const dist = Math.hypot(x - cx, y - cy);
      if (dist > lensR - 3) continue;

      const lit = isExclamationCell(x, y);
      if (lit) {
        // Illuminated caution-yellow Fresnel cell
        ctx.fillStyle = '#fde047';
        ctx.shadowColor = 'rgba(245, 197, 24, 0.85)';
        ctx.shadowBlur = 8;
        ctx.fillRect(x - 2.6, y - 2.6, 5.2, 5.2);
        ctx.shadowBlur = 0;

        // Crisp diagonal prism highlight inside lit cell
        ctx.fillStyle = '#fffbeb';
        ctx.beginPath();
        ctx.moveTo(x - 2.4, y - 2.4);
        ctx.lineTo(x + 2.4, y - 2.4);
        ctx.lineTo(x - 2.4, y + 2.4);
        ctx.closePath();
        ctx.fill();
      } else {
        // Unlit glossy black Fresnel prism cell
        const spec = Math.max(0.06, 0.28 * (1 - dist / lensR));
        ctx.fillStyle = `rgba(255, 255, 255, ${spec})`;
        ctx.fillRect(x - 2.2, y - 2.2, 4.4, 4.4);
      }
    }
  }

  ctx.restore();
}

export default function MaintenanceView() {
  const podCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (podCanvasRef.current) {
      renderExclamationPod(podCanvasRef.current);
    }
  }, []);

  return (
    <main
      className="maint-hud"
      role="status"
      aria-live="polite"
      aria-label="Site Under Maintenance"
    >
      <div className="maint-hud__bg" aria-hidden="true" />
      <div className="maint-hud__vignette" aria-hidden="true" />

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

        <div className="maint-hud__layout">
          <div>
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
          </div>

          {/* Right: Glowing Yellow (!) Fresnel Signal Pod */}
          <div className="maint-hud__pod-wrap" aria-hidden="true">
            <canvas ref={podCanvasRef} className="maint-hud__pod-canvas" />
          </div>
        </div>

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
