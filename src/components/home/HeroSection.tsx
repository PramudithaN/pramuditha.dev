import type { PageType, ThemeMode } from '../../types';
import './hero-section.css';

export interface HeroSectionProps {
  theme: ThemeMode;
  onNavigate?: (page: PageType) => void;
}

interface ChapterCard {
  chapter: string;
  title: string;
  subtitle: string;
  image: string;
  accent: string;
  targetPage?: PageType;
  targetSectionId?: string;
}

const CHAPTERS: readonly ChapterCard[] = [
  {
    chapter: 'Chapter 1',
    title: 'About Me',
    subtitle: 'Software Engineer',
    image: '/images/about/pramuditha-f1.jpg',
    accent: 'var(--site-primary)',
    targetPage: 'about',
  },
  {
    chapter: 'Chapter 2',
    title: 'Logic & Systems',
    subtitle: 'Architecture & Code',
    image: '/images/projects/git-tulkun-preview.svg',
    accent: 'var(--site-primary-light)',
    targetPage: 'logic',
  },
  {
    chapter: 'Chapter 3',
    title: 'Shipped Builds',
    subtitle: 'GitHub Archive',
    image: '/images/projects/localization-preview.svg',
    accent: 'var(--site-secondary)',
    targetSectionId: 'projects',
  },
  {
    chapter: 'Chapter 4',
    title: 'Dev Timeline',
    subtitle: 'LOLC Fusion X',
    image: '/images/Screenshot 2026-09-03 003623.webp',
    accent: 'var(--site-primary-light)',
    targetSectionId: 'developer-journey',
  },
  {
    chapter: 'Chapter 5',
    title: 'Aesthetics',
    subtitle: 'Visual & Brand',
    image: '/images/about/UOW.webp',
    accent: 'var(--site-primary)',
    targetPage: 'aesthetics',
  },
  {
    chapter: 'Chapter 6',
    title: 'Video & VFX',
    subtitle: 'Motion & Reels',
    image: '/images/projects/brain-tumor-preview.svg',
    accent: 'var(--site-secondary)',
    targetSectionId: 'video-editing',
  },
];

export default function HeroSection({ theme, onNavigate }: HeroSectionProps) {
  const handleSelect = (item: ChapterCard) => {
    if (item.targetPage && onNavigate) {
      onNavigate(item.targetPage);
      return;
    }
    if (item.targetSectionId) {
      const el = document.getElementById(item.targetSectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      className="hero-chapters"
      data-theme={theme}
      aria-label="Portfolio Contents"
    >
      <div className="hero-chapters__inner">
        <header className="hero-chapters__header">
          <h1 className="hero-chapters__title">Content</h1>
          <p className="hero-chapters__subtitle">
            Pramuditha Nadun &middot; Software Engineer
          </p>
        </header>

        <div className="hero-chapters__grid">
          {CHAPTERS.map((item, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <button
                key={item.chapter}
                type="button"
                className={`hero-chapters__item ${
                  isEven ? 'hero-chapters__item--even' : ''
                }`}
                style={
                  { '--chapter-accent': item.accent } as React.CSSProperties
                }
                onClick={() => handleSelect(item)}
                aria-label={`${item.chapter}: ${item.title}`}
              >
                <div className="hero-chapters__strip-wrap">
                  <div className="hero-chapters__strip">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="hero-chapters__img"
                      loading="eager"
                    />
                  </div>
                  <span className="hero-chapters__pill">{item.chapter}</span>
                </div>

                <span className="hero-chapters__name">{item.title}</span>
                <span className="hero-chapters__role">{item.subtitle}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
