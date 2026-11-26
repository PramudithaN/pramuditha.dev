import { useEffect, useState, type RefObject } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Lenis from 'lenis';
import type { PageType, ThemeMode } from '../../types';
import HomeMorphStage from '../home/HomeMorphStage';
import HeroSection from '../home/HeroSection';
import ManifestoSection from '../home/ManifestoSection';
import ChatPhilosophySection from '../home/ChatPhilosophySection';
import StorySection from '../home/StorySection';
import DeveloperTimelineSection from '../home/DeveloperTimelineSection';
import ProjectsEditorialSection from '../home/ProjectsEditorialSection';
import GraphicTimelineSection from '../home/GraphicTimelineSection';
import AestheticsCollageSection from '../home/AestheticsCollageSection';
import VideoEditingSection from '../home/VideoEditingSection';
import BrandStatementSection from '../home/BrandStatementSection';
import SignatureFooterSection from '../home/SignatureFooterSection';
import '../home/theme-switcher.css';

type ExperienceMode = 'classic' | 'new';

const EXPERIENCE_STORAGE_KEY = 'portfolio_experience_mode';

function getInitialExperience(): ExperienceMode {
  if (typeof window === 'undefined') return 'new';
  try {
    const saved = sessionStorage.getItem(EXPERIENCE_STORAGE_KEY);
    if (saved === 'new' || saved === 'classic') return saved;
  } catch {
    // ignore storage errors
  }
  return 'new';
}

interface HomeViewProps {
  theme: ThemeMode;
  onToggleTheme: (event?: React.MouseEvent<HTMLElement> | MouseEvent | { clientX?: number; clientY?: number }) => void;
  onNavigate: (page: PageType) => void;
  section2Ref?: RefObject<HTMLElement | null>;
  onOpenSearch?: () => void;
  onNotFoundSearch?: (query: string) => void;
}

export default function HomeView({
  theme,
  onToggleTheme,
  onNavigate,
  onOpenSearch,
  onNotFoundSearch
}: HomeViewProps) {
  const [experience, setExperience] = useState<ExperienceMode>(getInitialExperience);
  const [isSwitching, setIsSwitching] = useState<boolean>(false);
  const [isManifestoRevealed, setIsManifestoRevealed] = useState<boolean>(false);

  // Smooth Lenis momentum + gentle magnetic section snapping for Editorial Experience
  useEffect(() => {
    if (experience !== 'new') return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const scrollContainer = document.querySelector<HTMLElement>('.scroll-container');
    const contentEl = scrollContainer?.querySelector<HTMLElement>('.portfolio-revamp');
    if (!scrollContainer || !contentEl) return;

    scrollContainer.classList.add('home-morph-active');

    const lenis = new Lenis({
      wrapper: scrollContainer,
      content: contentEl,
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.1,
    });

    let rafId = 0;
    let snapTimer: number | undefined;
    let isAutoSnapping = false;

    const getSnapTargets = (): number[] => {
      const containerTop = scrollContainer.getBoundingClientRect().top;
      const currentScroll = scrollContainer.scrollTop;
      const viewportH = scrollContainer.clientHeight || window.innerHeight || 1;
      const targets: number[] = [0];

      const revealStage = contentEl.querySelector<HTMLElement>('.hero-reveal-stage');
      if (revealStage) {
        const manifestoSettled = Math.max(0, revealStage.offsetHeight - viewportH);
        targets.push(manifestoSettled);
      }

      const sections = contentEl.querySelectorAll<HTMLElement>(
        ':scope > section, :scope > footer'
      );
      sections.forEach((sec) => {
        const top = sec.getBoundingClientRect().top - containerTop + currentScroll;
        targets.push(Math.max(0, Math.round(top)));
      });

      return targets;
    };

    const scheduleMagneticSnap = () => {
      if (snapTimer !== undefined) {
        window.clearTimeout(snapTimer);
      }
      if (isAutoSnapping) return;

      snapTimer = window.setTimeout(() => {
        if (Math.abs(lenis.velocity) > 0.35) {
          scheduleMagneticSnap();
          return;
        }

        const current = scrollContainer.scrollTop;
        const viewportH = scrollContainer.clientHeight || window.innerHeight || 1;
        const targets = getSnapTargets();

        let nearest = current;
        let minDist = Infinity;
        for (const target of targets) {
          const dist = Math.abs(target - current);
          if (dist < minDist) {
            minDist = dist;
            nearest = target;
          }
        }

        // Magnetically pull into the nearest section boundary when within 26% of viewport
        if (minDist > 8 && minDist < viewportH * 0.26) {
          isAutoSnapping = true;
          lenis.scrollTo(nearest, {
            duration: 0.85,
            easing: (t) => 1 - Math.pow(1 - t, 4),
            onComplete: () => {
              isAutoSnapping = false;
            },
          });
        }
      }, 150);
    };

    lenis.on('scroll', () => {
      if (!isAutoSnapping) {
        scheduleMagneticSnap();
      }
    });

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    return () => {
      if (snapTimer !== undefined) window.clearTimeout(snapTimer);
      if (rafId) window.cancelAnimationFrame(rafId);
      scrollContainer.classList.remove('home-morph-active');
      lenis.destroy();
    };
  }, [experience]);

  const toggleExperience = () => {
    if (isSwitching) return;
    setIsSwitching(true);

    const next: ExperienceMode = experience === 'classic' ? 'new' : 'classic';
    setExperience(next);
    try {
      sessionStorage.setItem(EXPERIENCE_STORAGE_KEY, next);
    } catch {
      // ignore storage errors
    }

    const scrollContainer = document.querySelector<HTMLElement>('.scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    window.setTimeout(() => {
      setIsSwitching(false);
    }, 520);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {experience === 'classic' ? (
          <motion.div
            key="experience-classic"
            initial={{ opacity: 0, scale: 0.992 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.008 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <HomeMorphStage
              theme={theme}
              onToggleTheme={onToggleTheme}
              onNavigate={onNavigate}
              onOpenSearch={onOpenSearch}
            />
          </motion.div>
        ) : (
          <motion.main
            key="experience-new"
            className="portfolio-revamp"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero-reveal-stage">
              <HeroSection
                theme={theme}
                onNavigate={onNavigate}
                onNotFoundSearch={onNotFoundSearch}
                onManifestoRevealChange={setIsManifestoRevealed}
              />
              <ManifestoSection
                theme={theme}
                onNavigate={onNavigate}
                isRevealed={isManifestoRevealed}
              />
            </div>
            <ChatPhilosophySection theme={theme} onNavigate={onNavigate} />
            <StorySection theme={theme} onNavigate={onNavigate} />
            <DeveloperTimelineSection theme={theme} />
            <ProjectsEditorialSection theme={theme} onNavigate={onNavigate} />
            <GraphicTimelineSection />
            <AestheticsCollageSection />
            <VideoEditingSection theme={theme} onNavigate={onNavigate} />
            <BrandStatementSection />
            <SignatureFooterSection theme={theme} onNavigate={onNavigate} />
          </motion.main>
        )}
      </AnimatePresence>

      <button
        type="button"
        className={`experience-switcher ${
          experience === 'new' ? 'experience-switcher--new' : ''
        } ${isSwitching ? 'experience-switcher--switching' : ''}`}
        onClick={toggleExperience}
        disabled={isSwitching}
        aria-label={
          experience === 'classic'
            ? 'Switch to New Editorial Theme'
            : 'Switch back to Classic Theme'
        }
      >
        <span className="experience-switcher__dot" aria-hidden="true" />
        <span>{experience === 'classic' ? 'New Theme' : 'Classic Theme'}</span>
      </button>
    </>
  );
}
