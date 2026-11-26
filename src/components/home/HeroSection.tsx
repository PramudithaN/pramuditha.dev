import { useState, useEffect, useMemo, useRef, useId } from 'react';
import {
  ArrowUpRight,
  ChevronDown,
  FolderGit2,
  Gamepad2,
  Layers,
  Search,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import type { PageType, ThemeMode } from '../../types';
import { portfolioProjects } from '../../constants/projects';
import { skillsList, softwareToolsList } from '../../constants/skills';
import { EXTERNAL_LINKS } from '../../constants/links';
import { soundEngine } from '../../services/soundEngine';
import './hero-section.css';

type SocialIconId =
  | 'behance'
  | 'pinterest'
  | 'facebook'
  | 'instagram'
  | 'github'
  | 'linkedin'
  | 'email';

interface HeroSocialItem {
  id: SocialIconId;
  name: string;
  url: string;
}

const HERO_SOCIAL_LINKS: HeroSocialItem[] = [
  { id: 'behance', name: 'Behance', url: EXTERNAL_LINKS.BEHANCE },
  { id: 'pinterest', name: 'Pinterest', url: EXTERNAL_LINKS.PINTEREST },
  { id: 'facebook', name: 'Facebook', url: EXTERNAL_LINKS.FACEBOOK },
  { id: 'instagram', name: 'Instagram', url: EXTERNAL_LINKS.INSTAGRAM },
  { id: 'github', name: 'GitHub', url: EXTERNAL_LINKS.GITHUB },
  { id: 'linkedin', name: 'LinkedIn', url: EXTERNAL_LINKS.LINKEDIN },
  { id: 'email', name: 'Email', url: EXTERNAL_LINKS.EMAIL },
];

function SocialStrokeIcon({ id }: { id: SocialIconId }) {
  return (
    <svg
      className="hero-social-svg"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {id === 'behance' && (
        <>
          <path
            pathLength={1}
            d="M3 7h4.5a2.25 2.25 0 0 1 0 4.5H3V7Zm0 4.5h5a2.5 2.5 0 0 1 0 5H3v-5Z"
          />
          <path pathLength={1} d="M14.5 14h6a3 3 0 1 0-.7 2.1" />
          <path pathLength={1} d="M15 8.5h4.5" />
        </>
      )}
      {id === 'pinterest' && (
        <>
          <circle pathLength={1} cx="12" cy="12" r="9.5" />
          <path
            pathLength={1}
            d="M9.5 18.5l1.6-6.8m0 0a3.4 3.4 0 1 1 3.2 2.3c-1.3 0-2.1-.6-2.5-1.3"
          />
        </>
      )}
      {id === 'facebook' && (
        <path
          pathLength={1}
          d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
        />
      )}
      {id === 'instagram' && (
        <>
          <rect pathLength={1} width="18" height="18" x="3" y="3" rx="5" ry="5" />
          <circle pathLength={1} cx="12" cy="12" r="4" />
          <circle pathLength={1} cx="17.5" cy="6.5" r="0.75" />
        </>
      )}
      {id === 'github' && (
        <>
          <path
            pathLength={1}
            d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
          />
          <path pathLength={1} d="M9 18c-4.51 2-5-2-7-2" />
        </>
      )}
      {id === 'linkedin' && (
        <>
          <path
            pathLength={1}
            d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
          />
          <rect pathLength={1} width="4" height="12" x="2" y="9" />
          <circle pathLength={1} cx="4" cy="4" r="2" />
        </>
      )}
      {id === 'email' && (
        <>
          <rect pathLength={1} width="20" height="16" x="2" y="4" rx="2" />
          <path
            pathLength={1}
            d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
          />
        </>
      )}
    </svg>
  );
}

export interface HeroSectionProps {
  theme: ThemeMode;
  onNavigate?: (page: PageType) => void;
  onNotFoundSearch?: (query: string) => void;
  onManifestoRevealChange?: (revealed: boolean) => void;
}

type SearchCategory = 'Page' | 'Project' | 'Skill' | 'Section';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: SearchCategory;
  keywords: string;
  action: () => void;
}

function getCategoryIcon(category: SearchCategory) {
  switch (category) {
    case 'Project':
      return FolderGit2;
    case 'Skill':
      return Sparkles;
    case 'Section':
      return Layers;
    case 'Page':
    default:
      return User;
  }
}

export default function HeroSection({
  theme,
  onNavigate,
  onNotFoundSearch,
  onManifestoRevealChange,
}: HeroSectionProps) {
  const [isIconVisible, setIsIconVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isScrollActive, setIsScrollActive] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  // Stage 1: Show the circular search icon first, then smoothly expand into the search bar
  useEffect(() => {
    let expandTimer: number | undefined;
    const rafId = window.requestAnimationFrame(() => {
      setIsIconVisible(true);
      expandTimer = window.setTimeout(() => {
        setIsExpanded(true);
      }, 700);
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      if (expandTimer !== undefined) {
        window.clearTimeout(expandTimer);
      }
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll-driven choreography: re-collapse search bar -> zoom search icon -> reveal next section
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const scrollContainer =
      sectionEl.closest<HTMLElement>('.scroll-container') ??
      document.querySelector<HTMLElement>('.scroll-container');
    let rafId = 0;

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

    const updateScrollProgress = () => {
      rafId = 0;
      const stageEl = sectionEl.parentElement;
      const viewportH = scrollContainer?.clientHeight || window.innerHeight || 1;
      const totalTravel = stageEl
        ? Math.max(1, stageEl.offsetHeight - viewportH)
        : Math.max(1, viewportH * 0.75);
      const scrolled = scrollContainer
        ? Math.max(0, scrollContainer.scrollTop)
        : Math.max(0, -(stageEl?.getBoundingClientRect().top ?? 0));
      const progress = clamp01(scrolled / totalTravel);

      const active = progress > 0.002;
      setIsScrollActive((prev) => (prev !== active ? active : prev));
      if (active) {
        setIsFocused(false);
      }

      // Phase 1 (0 -> 0.42): Collapse search bar & fade out social arc
      const collapse = clamp01(progress / 0.42);
      const railOpacity = 1 - clamp01(progress / 0.25);

      // Phase 2 (0.42 -> 0.70): Fade out minimized search bar & hero backdrop in place
      const fadeProgress = clamp01((progress - 0.42) / 0.28);
      const pillOpacity = 1 - fadeProgress;
      const pillScale = 1 - fadeProgress * 0.14;
      const stageOpacity = 1 - clamp01((progress - 0.46) / 0.24);

      // Phase 3 (0.54+): Reveal ManifestoSection text one by one on the same screen
      onManifestoRevealChange?.(progress >= 0.54);

      sectionEl.style.setProperty('--hero-collapse', collapse.toFixed(4));
      sectionEl.style.setProperty('--hero-rail-opacity', railOpacity.toFixed(4));
      sectionEl.style.setProperty('--hero-pill-opacity', pillOpacity.toFixed(4));
      sectionEl.style.setProperty('--hero-pill-scale', pillScale.toFixed(4));
      sectionEl.style.setProperty('--hero-stage-opacity', stageOpacity.toFixed(4));
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateScrollProgress);
      }
    };

    updateScrollProgress();
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    scrollContainer?.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      document.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('scroll', onScroll);
      scrollContainer?.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [onManifestoRevealChange]);

  const scrollToSection = (id: string, fallbackPage?: PageType) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (fallbackPage) {
      onNavigate?.(fallbackPage);
    }
  };

  // Build searchable index from pages, sections, projects, and skills
  const searchIndex = useMemo<SearchResultItem[]>(() => {
    const pageItems: SearchResultItem[] = [
      {
        id: 'page-logic',
        title: 'Logic & Systems',
        subtitle: 'Software engineering, enterprise architectures & tech stack',
        category: 'Page',
        keywords: 'engineering code backend frontend systems architecture',
        action: () => onNavigate?.('logic'),
      },
      {
        id: 'page-aesthetics',
        title: 'Aesthetics & Motion',
        subtitle: 'Visual design, cinematography reels & brand craft',
        category: 'Page',
        keywords: 'design motion video editing graphics ui ux',
        action: () => onNavigate?.('aesthetics'),
      },
      {
        id: 'page-about',
        title: 'About Pramuditha',
        subtitle: 'Background, LOLC Fusion X experience & education',
        category: 'Page',
        keywords: 'bio resume experience lolc westminster iit colombo',
        action: () => onNavigate?.('about'),
      },
      {
        id: 'page-reminder',
        title: 'reminder.afk',
        subtitle: '3D ergonomic desktop break companion release',
        category: 'Project',
        keywords: 'electron threejs 3d desktop app break reminder',
        action: () => onNavigate?.('reminder'),
      },
      {
        id: 'page-localization',
        title: 'Localization Check',
        subtitle: 'Automated i18n & hardcoded string VS Code extension',
        category: 'Project',
        keywords: 'vscode extension i18n ast static analysis',
        action: () => onNavigate?.('localization'),
      },
      {
        id: 'sec-projects',
        title: 'Selected Projects',
        subtitle: 'Jump to featured engineering & creative builds below',
        category: 'Section',
        keywords: 'work portfolio shots builds',
        action: () => scrollToSection('projects', 'logic'),
      },
    ];

    const projectItems: SearchResultItem[] = portfolioProjects.map((project) => ({
      id: `proj-${project.id}`,
      title: project.title.split('|')[0].trim(),
      subtitle: project.tagline,
      category: 'Project',
      keywords: `${project.categoryLabel} ${project.techStack
        .map((t) => t.name)
        .join(' ')} ${project.description}`,
      action: () => {
        if (project.id === 'reminder-afk') {
          onNavigate?.('reminder');
        } else if (project.id === 'localization-check') {
          onNavigate?.('localization');
        } else {
          onNavigate?.('logic');
        }
      },
    }));

    const devSkillItems: SearchResultItem[] = skillsList.map((skill) => ({
      id: `skill-dev-${skill.text.toLowerCase().replace(/\s+/g, '-')}`,
      title: skill.text,
      subtitle: 'Engineering & Development Stack',
      category: 'Skill',
      keywords: `skill tech stack developer ${skill.text}`,
      action: () => onNavigate?.('logic'),
    }));

    const creativeSkillItems: SearchResultItem[] = softwareToolsList.map((tool) => ({
      id: `skill-art-${tool.text.toLowerCase().replace(/\s+/g, '-')}`,
      title: tool.text,
      subtitle: 'Creative & Motion Tooling',
      category: 'Skill',
      keywords: `tool creative design video ${tool.text}`,
      action: () => onNavigate?.('aesthetics'),
    }));

    return [...pageItems, ...projectItems, ...devSkillItems, ...creativeSkillItems];
  }, [onNavigate]);

  const filteredResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return searchIndex.slice(0, 6);
    }
    return searchIndex
      .filter(
        (item) =>
          item.title.toLowerCase().includes(trimmed) ||
          item.subtitle.toLowerCase().includes(trimmed) ||
          item.category.toLowerCase().includes(trimmed) ||
          item.keywords.toLowerCase().includes(trimmed)
      )
      .slice(0, 7);
  }, [query, searchIndex]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const trimmedQuery = query.trim();
  const isPreSearchMode = trimmedQuery.length === 0;
  const showResults = isExpanded && (isFocused || trimmedQuery.length > 0);

  const goToPlayground = (searchText: string) => {
    soundEngine.playClickSound();
    setIsFocused(false);
    if (onNotFoundSearch) {
      onNotFoundSearch(searchText);
    } else {
      onNavigate?.('playground');
    }
  };

  const executeResult = (item: SearchResultItem) => {
    soundEngine.playClickSound();
    setIsFocused(false);
    item.action();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isExpanded) {
      setIsExpanded(true);
      window.setTimeout(() => inputRef.current?.focus(), 300);
      return;
    }

    if (trimmedQuery && filteredResults.length === 0) {
      goToPlayground(trimmedQuery);
      return;
    }

    const target = filteredResults[activeIndex] ?? filteredResults[0];
    if (target) {
      executeResult(target);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (filteredResults.length > 0) {
        soundEngine.playHoverSound();
        setActiveIndex((prev) => (prev + 1) % filteredResults.length);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (filteredResults.length > 0) {
        soundEngine.playHoverSound();
        setActiveIndex(
          (prev) => (prev - 1 + filteredResults.length) % filteredResults.length
        );
      }
    } else if (event.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`hero-minimal ${isScrollActive ? 'is-scroll-active' : ''}`}
      data-theme={theme}
      aria-label="Portfolio Search"
    >
      <div className="hero-sticky-viewport">
        {/* Subtle Corner Crosshairs */}
        <div className="hero-iconic-bg" aria-hidden="true">
          <span className="hero-crosshair hero-crosshair--tl">+</span>
          <span className="hero-crosshair hero-crosshair--tr">+</span>
          <span className="hero-crosshair hero-crosshair--bl">+</span>
          <span className="hero-crosshair hero-crosshair--br">+</span>
        </div>

        {/* Centered Animated Search Bar + Flanking Social Icons */}
        <div
          ref={searchContainerRef}
          className={`hero-search__stage ${
            isIconVisible ? 'is-visible' : ''
          } ${isExpanded ? 'is-expanded' : ''} ${
            isFocused ? 'is-focused' : ''
          }`}
        >
        <nav
          className={`hero-social-rail ${isExpanded ? 'is-visible' : ''}`}
          aria-label="Social media links"
        >
          {HERO_SOCIAL_LINKS.map((social, idx) => {
            const isExternal = social.url.startsWith('http');
            const total = HERO_SOCIAL_LINKS.length;
            const angleDeg = -60 + (idx / (total - 1)) * 120;
            const angleRad = (angleDeg * Math.PI) / 180;
            const edgeRad = (60 * Math.PI) / 180;
            const radius = 220;
            const arcX = Math.round(radius * (Math.cos(angleRad) - Math.cos(edgeRad)));
            const arcY = Math.round(radius * Math.sin(angleRad));

            return (
              <a
                key={social.name}
                href={social.url}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="hero-social-item"
                style={
                  {
                    '--social-index': idx,
                    '--arc-x': `${arcX}px`,
                    '--arc-y': `${arcY}px`,
                  } as React.CSSProperties
                }
                aria-label={social.name}
                title={social.name}
              >
                <span className="hero-social-item__icon">
                  <SocialStrokeIcon id={social.id} />
                </span>
                <span className="hero-social-item__label">{social.name}</span>
              </a>
            );
          })}
        </nav>
        <form
          className="hero-search__pill"
          onSubmit={handleSubmit}
          role="search"
        >
          <input
            ref={inputRef}
            type="text"
            className="hero-search__input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsFocused(true);
            }}
            onFocus={() => {
              setIsExpanded(true);
              setIsFocused(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search"
            aria-label="Search portfolio projects, skills, and pages"
            role="combobox"
            aria-expanded={showResults}
            aria-controls={listboxId}
            aria-activedescendant={
              showResults && filteredResults[activeIndex]
                ? `${listboxId}-opt-${filteredResults[activeIndex].id}`
                : undefined
            }
            autoComplete="off"
          />

          {query && isExpanded && (
            <button
              type="button"
              className="hero-search__clear-btn"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Clear search query"
            >
              <X size={14} />
            </button>
          )}

          <button
            type="submit"
            className="hero-search__submit-btn"
            aria-label={isExpanded ? 'Run search' : 'Expand search bar'}
          >
            <span className="hero-search__submit-ring" aria-hidden="true">
              <Search size={18} strokeWidth={2.2} />
            </span>
          </button>
        </form>

        {showResults && (
          <div
            id={listboxId}
            role="listbox"
            className="hero-search__results"
            aria-label="Search results"
          >
            <div className="hero-search__results-label">
              {isPreSearchMode ? 'Pre-searched options' : 'Matching results'}
            </div>

            {filteredResults.length > 0 ? (
              filteredResults.map((item, idx) => {
                const CategoryIcon = getCategoryIcon(item.category);
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={item.id}
                    id={`${listboxId}-opt-${item.id}`}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    className={`hero-search__result-item ${
                      isActive ? 'is-active' : ''
                    }`}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => executeResult(item)}
                  >
                    <span className="hero-search__result-icon">
                      <CategoryIcon size={15} />
                    </span>
                    <span className="hero-search__result-text">
                      <span className="hero-search__result-title">
                        {item.title}
                      </span>
                      <span className="hero-search__result-sub">
                        {item.subtitle}
                      </span>
                    </span>
                    <span className="hero-search__result-meta">
                      <span className="hero-search__result-tag">
                        {item.category}
                      </span>
                      <ArrowUpRight size={14} />
                    </span>
                  </button>
                );
              })
            ) : (
              <button
                type="button"
                className="hero-search__result-item is-active"
                onClick={() => goToPlayground(trimmedQuery)}
              >
                <span className="hero-search__result-icon">
                  <Gamepad2 size={15} />
                </span>
                <span className="hero-search__result-text">
                  <span className="hero-search__result-title">
                    Nothing here for &ldquo;{trimmedQuery}&rdquo; — Enter the Fun Zone
                  </span>
                  <span className="hero-search__result-sub">
                    Press Enter or click to play with the synth, reflex game &amp; particles
                  </span>
                </span>
                <span className="hero-search__result-meta">
                  <span className="hero-search__result-tag">Fun Zone</span>
                  <ArrowUpRight size={14} />
                </span>
              </button>
            )}
          </div>
        )}
        </div>

        {/* Subtle Scroll / Swipe Cue */}
        <div
          className={`hero-swipe-cue ${isExpanded ? 'is-visible' : ''}`}
          aria-hidden="true"
        >
          <span className="hero-swipe-cue__text">Scroll or swipe</span>
          <ChevronDown size={14} className="hero-swipe-cue__icon" />
        </div>
      </div>
    </section>
  );
}
