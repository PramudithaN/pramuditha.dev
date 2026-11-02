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

    let animationFrameId: number;
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
      const maxRadius = isHero ? config.maxSize : Math.min(config.maxSize, 3.0);
      const speedScale = isHero ? 1.0 : 0.85;
      const radius = config.minSize + Math.random() * (maxRadius - config.minSize);
      const baseAlpha = 0.5 + Math.random() * 0.45;

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
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const m = mouseRef.current;
      if (m.lastX !== -9999) {
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

    let isTabVisible = true;
    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === 'visible';
      if (isTabVisible && !animationFrameId) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Animation loop
    const render = () => {
      if (!isTabVisible) return;

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
          }
        }

        // Apply aerodynamic damping
        flake.vx *= 0.94;
        flake.vy *= 0.94;

        // Position updates
        flake.x += flake.speedX + sway + flake.vx;
        flake.y += flake.speedY + flake.vy;

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

        // 3. Render snowflake
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);

        if (isDark) {
          // Dark Mode: glowing starlit snow with soft celestial blue-white halo
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          if (config.glowInDark && flake.radius > 2.0) {
            ctx.shadowColor = 'rgba(180, 225, 255, 0.85)';
            ctx.shadowBlur = Math.min(flake.radius * 2.5, 8);
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.fillStyle = `rgba(250, 252, 255, ${flake.alpha})`;
          ctx.fill();
        } else {
          // Light Mode: Pure clean white snow with soft ambient drop-shadow for depth & contrast
          // Stays 100% white and natural, avoiding any artificial blue or dirty grey tint
          ctx.shadowColor = 'rgba(0, 0, 0, 0.22)';
          ctx.shadowBlur = Math.max(2.5, flake.radius * 1.4);
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 1;
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.85, flake.alpha)})`;
          ctx.fill();

          // Delicate hairline edge for crisp definition against pure white cards
          ctx.shadowBlur = 0;
          ctx.shadowOffsetY = 0;
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.07)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
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
