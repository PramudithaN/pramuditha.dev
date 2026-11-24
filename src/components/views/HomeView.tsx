import { useState, type RefObject } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { PageType, ThemeMode } from '../../types';
import HomeMorphStage from '../home/HomeMorphStage';
import HeroSection from '../home/HeroSection';
import ManifestoSection from '../home/ManifestoSection';
import DeveloperTimelineSection from '../home/DeveloperTimelineSection';
import YearInDaysSection from '../home/YearInDaysSection';
import ProjectsEditorialSection from '../home/ProjectsEditorialSection';
import GraphicTimelineSection from '../home/GraphicTimelineSection';
import AestheticsCollageSection from '../home/AestheticsCollageSection';
import VideoEditingSection from '../home/VideoEditingSection';
import SignatureFooterSection from '../home/SignatureFooterSection';
import '../home/theme-switcher.css';

type ExperienceMode = 'classic' | 'new';

const EXPERIENCE_STORAGE_KEY = 'portfolio_experience_mode';

function getInitialExperience(): ExperienceMode {
  if (typeof window === 'undefined') return 'classic';
  try {
    const saved = sessionStorage.getItem(EXPERIENCE_STORAGE_KEY);
    if (saved === 'new' || saved === 'classic') return saved;
  } catch {
    // ignore storage errors
  }
  return 'classic';
}

interface HomeViewProps {
  theme: ThemeMode;
  onToggleTheme: (event?: React.MouseEvent<HTMLElement> | MouseEvent | { clientX?: number; clientY?: number }) => void;
  onNavigate: (page: PageType) => void;
  section2Ref?: RefObject<HTMLElement | null>;
  onOpenSearch?: () => void;
}

export default function HomeView({
  theme,
  onToggleTheme,
  onNavigate,
  onOpenSearch
}: HomeViewProps) {
  const [experience, setExperience] = useState<ExperienceMode>(getInitialExperience);
  const [isSwitching, setIsSwitching] = useState<boolean>(false);

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
            <HeroSection theme={theme} onNavigate={onNavigate} />
            <ManifestoSection theme={theme} onNavigate={onNavigate} />
            <DeveloperTimelineSection theme={theme} />
            <YearInDaysSection />
            <ProjectsEditorialSection theme={theme} onNavigate={onNavigate} />
            <GraphicTimelineSection />
            <AestheticsCollageSection />
            <VideoEditingSection theme={theme} onNavigate={onNavigate} />
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
