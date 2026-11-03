import React, { useEffect, useRef } from 'react';
import type { ThemeMode } from '../../types/portfolio';
import type { SnowfallOptions } from '../../types/seasonal';

interface SnowfallCanvasProps {
  theme: ThemeMode;
  config: SnowfallOptions;
  isHomePage?: boolean;
}

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  speedY: number;
  speedX: number;
  swayPhase: number;
  swaySpeed: number;
  swayRadius: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  crystalType: 0 | 1 | 2; // 0: 6-pointed star, 1: single-branched dendrite, 2: double-branched dendrite
  twinklePhase: number;
  twinkleSpeed: number;
}

export const SnowfallCanvas: React.FC<SnowfallCanvasProps> = ({
  theme,
  config,
  isHomePage = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isHeroRef = useRef<boolean>(isHomePage);
  const mouseRef = useRef<{ x: number; y: number; vx: number; vy: number; lastX: number; lastY: number }>({
    x: -9999,
    y: -9999,
    vx: 0,
    vy: 0,
    lastX: -9999,
    lastY: -9999
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track whether currently viewing the top Hero section
    const updateHeroState = () => {
      if (!isHomePage) {
        isHeroRef.current = false;
        return;
      }
      const scrollContainer = document.querySelector('.scroll-container');
      const scrollTop = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
      const threshold = (window.innerHeight || 800) * 0.45;
      isHeroRef.current = scrollTop < threshold;
    };

    updateHeroState();

    const isMobile = () => width < 768;

    const getTargetCount = () => {
      const mobile = isMobile();
      if (isHeroRef.current) {
        return mobile ? config.densityMobile : config.densityDesktop;
      }
      return mobile ? (config.subpageDensityMobile ?? 8) : (config.subpageDensityDesktop ?? 20);
    };

    const createSnowflake = (startY?: number): Snowflake => {
      const isHero = isHeroRef.current;
      const maxRadius = isHero ? config.maxSize : Math.min(config.maxSize, 3.2);
      const speedScale = isHero ? 1.0 : 0.85;
      const radius = config.minSize + Math.random() * (maxRadius - config.minSize);
      const baseAlpha = 0.65 + Math.random() * 0.35;

      return {
        x: Math.random() * width,
        y: startY !== undefined ? startY : Math.random() * height,
        radius,
        alpha: baseAlpha,
        baseAlpha,
        speedY: config.fallSpeed * speedScale * (0.6 + Math.random() * 0.8) * (radius / 2.6),
        speedX: (Math.random() - 0.5) * 0.35,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.012 + Math.random() * 0.02,
        swayRadius: 0.5 + Math.random() * 1.5,
        vx: 0,
        vy: 0,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        crystalType: Math.floor(Math.random() * 3) as 0 | 1 | 2,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.04
      };
    };

    const initialTarget = getTargetCount();
    const snowflakes: Snowflake[] = Array.from({ length: initialTarget }, () => createSnowflake());

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      updateHeroState();
    };

    // Scroll handler (capture = true catches scrolls on .scroll-container and .subpage-container)
    const handleScroll = () => {
      updateHeroState();
    };

    // Mouse & Pointer movement tracking
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e) {
        if (!e.touches || e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      if (
        typeof clientX !== 'number' ||
        typeof clientY !== 'number' ||
        !Number.isFinite(clientX) ||
        !Number.isFinite(clientY)
      ) {
        return;
      }

      const m = mouseRef.current;
      if (m.lastX !== -9999 && Number.isFinite(m.lastX)) {
        m.vx = (clientX - m.lastX) * 0.35;
        m.vy = (clientY - m.lastY) * 0.35;
      }
      m.x = clientX;
      m.y = clientY;
      m.lastX = clientX;
      m.lastY = clientY;
    };

    const handlePointerLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
      mouseRef.current.vx = 0;
      mouseRef.current.vy = 0;
      mouseRef.current.lastX = -9999;
      mouseRef.current.lastY = -9999;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);

    let isTabVisible = document.visibilityState === 'visible';
    let animationFrameId = 0;

    const stopAnimation = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    };

    const startAnimation = () => {
      stopAnimation();
      if (isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === 'visible';
      if (isTabVisible) {
        startAnimation();
      } else {
        stopAnimation();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Animation loop
    const render = () => {
      if (!isTabVisible) {
        animationFrameId = 0;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const isDark = theme === 'dark';
      const mouse = mouseRef.current;
      const targetCount = getTargetCount();

      // Mouse velocity friction decay
      mouse.vx *= 0.92;
      mouse.vy *= 0.92;

      // Smoothly spawn additional particles at the top when entering the Hero section
      if (snowflakes.length < targetCount) {
        const toSpawn = Math.min(3, targetCount - snowflakes.length);
        for (let k = 0; k < toSpawn; k++) {
          snowflakes.push(createSnowflake(-10));
        }
      }

      for (let i = 0; i < snowflakes.length; i++) {
        const flake = snowflakes[i];

        // Ensure particle coordinates and velocities are valid numbers
        if (!Number.isFinite(flake.vx)) flake.vx = 0;
        if (!Number.isFinite(flake.vy)) flake.vy = 0;
        if (!Number.isFinite(flake.x)) flake.x = Math.random() * width;
        if (!Number.isFinite(flake.y)) flake.y = Math.random() * height;

        // 1. Natural oscillation drift
        flake.swayPhase += flake.swaySpeed;
        const sway = Math.sin(flake.swayPhase) * flake.swayRadius;

        // 2. Mouse interaction physics (repulsion & wind gust)
        if (mouse.x !== -9999) {
          const dx = flake.x - mouse.x;
          const dy = flake.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < config.interactionRadius) {
            const safeDist = Math.max(dist, 1);
            const force = (1 - safeDist / config.interactionRadius) * config.windForce;
            const nx = dx / safeDist;
            const ny = dy / safeDist;

            // Push flake away from cursor + add cursor wind momentum
            flake.vx += nx * force * 0.8 + mouse.vx * 0.15;
            flake.vy += ny * force * 0.8 + mouse.vy * 0.15;
            // Physical rotation impulse from cursor breeze
            flake.rotation += (mouse.vx + mouse.vy) * 0.03;
          }
        }

        // Apply aerodynamic damping
        flake.vx *= 0.94;
        flake.vy *= 0.94;

        // Position & rotation updates
        flake.x += flake.speedX + sway + flake.vx;
        flake.y += flake.speedY + flake.vy;
        flake.rotation += flake.rotationSpeed + flake.vx * 0.02;

        // Wrap or taper off around screen boundaries
        if (flake.y > height + 10) {
          // When moving to split section or subpage, let excess flakes fall off without respawning
          if (snowflakes.length > targetCount) {
            snowflakes.splice(i, 1);
            i--;
            continue;
          } else {
            flake.y = -10;
            flake.x = Math.random() * width;
            flake.vx = 0;
            flake.vy = 0;
          }
        } else if (flake.y < -15) {
          flake.y = height + 5;
        }

        if (flake.x > width + 15) {
          flake.x = -10;
        } else if (flake.x < -15) {
          flake.x = width + 10;
        }

        // Subtle starlight twinkling
        flake.twinklePhase += flake.twinkleSpeed;
        flake.alpha = flake.baseAlpha * (0.85 + Math.sin(flake.twinklePhase) * 0.15);

        // 3. Render 6-pointed geometric snow crystal
        ctx.save();
        ctx.translate(flake.x, flake.y);
        ctx.rotate(flake.rotation);

        if (isDark) {
          // Dark Mode: glowing starlit snow crystal
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          if (config.glowInDark && flake.radius > 2.2) {
            ctx.shadowColor = 'rgba(180, 225, 255, 0.85)';
            ctx.shadowBlur = Math.min(flake.radius * 2.2, 7);
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.strokeStyle = `rgba(250, 252, 255, ${flake.alpha})`;
          ctx.fillStyle = `rgba(250, 252, 255, ${flake.alpha})`;
        } else {
          // Light Mode: Pure clean white snow crystal with soft ambient drop-shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.28)';
          ctx.shadowBlur = Math.max(2, flake.radius * 1.1);
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 1;
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0.9, flake.alpha)})`;
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.9, flake.alpha)})`;
        }

        ctx.lineWidth = flake.radius > 3.2 ? 1.0 : 0.75;
        ctx.lineCap = 'round';
        ctx.beginPath();

        const isLarge = flake.radius >= 2.6;

        // 6-fold hexagonal symmetry (6 rays at 60 degree intervals)
        for (let j = 0; j < 6; j++) {
          const angle = (j * Math.PI) / 3;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);

          // Main radial arm
          ctx.moveTo(0, 0);
          ctx.lineTo(cos * flake.radius, sin * flake.radius);

          // Dendrite side branches (V-chevrons) for larger crystals
          if (isLarge && flake.crystalType !== 0) {
            const bDist = flake.radius * 0.52;
            const bLen = flake.radius * 0.35;
            const bx = cos * bDist;
            const by = sin * bDist;

            const a1 = angle + Math.PI / 6;
            const a2 = angle - Math.PI / 6;

            ctx.moveTo(bx, by);
            ctx.lineTo(bx + Math.cos(a1) * bLen, by + Math.sin(a1) * bLen);
            ctx.moveTo(bx, by);
            ctx.lineTo(bx + Math.cos(a2) * bLen, by + Math.sin(a2) * bLen);

            if (flake.crystalType === 2 && flake.radius > 3.5) {
              const bDist2 = flake.radius * 0.8;
              const bLen2 = flake.radius * 0.22;
              const bx2 = cos * bDist2;
              const by2 = sin * bDist2;
              ctx.moveTo(bx2, by2);
              ctx.lineTo(bx2 + Math.cos(a1) * bLen2, by2 + Math.sin(a1) * bLen2);
              ctx.moveTo(bx2, by2);
              ctx.lineTo(bx2 + Math.cos(a2) * bLen2, by2 + Math.sin(a2) * bLen2);
            }
          }
        }
        ctx.stroke();

        // Tiny central crystal bead
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(0.5, flake.radius * 0.2), 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    startAnimation();

    return () => {
      stopAnimation();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [theme, config, isHomePage]);

  return (
    <div className="snowfall-canvas-container" aria-hidden="true">
      <canvas ref={canvasRef} className="snowfall-canvas" />
    </div>
  );
};
