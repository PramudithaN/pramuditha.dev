import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Code2,
  GitFork,
  GitPullRequest,
  Globe,
  Image as ImageIcon,
  Star,
  X,
} from 'lucide-react';
import type { GitHubRepo } from '../../types';
import './all-projects-modal.css';

export interface AllProjectsRepoEntry extends GitHubRepo {
  isContribution: boolean;
}

export interface AllProjectsModalProps {
  isOpen: boolean;
  repos: AllProjectsRepoEntry[];
  initialIndex?: number;
  onClose: () => void;
}

interface RepoLiveDetails {
  languages: string[];
  contributions: number | null;
}

const GITHUB_USERNAME = 'PramudithaN';
const detailsCache = new Map<string, RepoLiveDetails>();

const LANGUAGE_ICONS: Record<string, string> = {
  TypeScript: 'simple-icons:typescript',
  JavaScript: 'simple-icons:javascript',
  Python: 'simple-icons:python',
  Rust: 'simple-icons:rust',
  Java: 'mdi:language-java',
  Kotlin: 'simple-icons:kotlin',
  HTML: 'simple-icons:html5',
  CSS: 'simple-icons:css3',
  SCSS: 'simple-icons:sass',
  Shell: 'simple-icons:gnubash',
  Dockerfile: 'simple-icons:docker',
  'C++': 'simple-icons:cplusplus',
  'C#': 'simple-icons:csharp',
  Go: 'simple-icons:go',
};

function getLanguageIcon(lang: string): string {
  return LANGUAGE_ICONS[lang] || 'mdi:code-tags';
}

function getRepoSlug(repo: AllProjectsRepoEntry): string {
  if (repo.full_name) return repo.full_name;
  return `${GITHUB_USERNAME}/${repo.name}`;
}

export default function AllProjectsModal({
  isOpen,
  repos,
  initialIndex = 0,
  onClose,
}: AllProjectsModalProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [slideDir, setSlideDir] = useState<'next' | 'prev'>('next');
  const [details, setDetails] = useState<RepoLiveDetails | null>(null);
  const pointerStartX = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(initialIndex);
      setSlideDir('next');
    }
  }, [isOpen, initialIndex]);

  const total = repos.length;
  const safeIndex = total > 0 ? ((activeIndex % total) + total) % total : 0;
  const currentRepo = repos[safeIndex];
  const slideTheme: 'dark' | 'light' = safeIndex % 2 === 0 ? 'dark' : 'light';

  const handleNext = () => {
    if (total === 0) return;
    setSlideDir('next');
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    if (total === 0) return;
    setSlideDir('prev');
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  // Keyboard navigation (Escape, Left, Right)
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setSlideDir('next');
        setActiveIndex((prev) => (total > 0 ? (prev + 1) % total : 0));
      } else if (e.key === 'ArrowLeft') {
        setSlideDir('prev');
        setActiveIndex((prev) => (total > 0 ? (prev - 1 + total) % total : 0));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, total, onClose]);

  // Fetch languages breakdown and PramudithaN contribution count for active repo
  useEffect(() => {
    if (!isOpen || !currentRepo) return;
    const slug = getRepoSlug(currentRepo);
    const cached = detailsCache.get(slug);
    if (cached) {
      setDetails(cached);
      return;
    }

    let cancelled = false;
    setDetails({
      languages: currentRepo.language ? [currentRepo.language] : [],
      contributions: null,
    });

    const loadDetails = async () => {
      try {
        const [langRes, contribRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${slug}/languages`),
          fetch(`https://api.github.com/repos/${slug}/contributors?per_page=30`),
        ]);

        let languages: string[] = currentRepo.language ? [currentRepo.language] : [];
        if (langRes.ok) {
          const langData = (await langRes.json()) as Record<string, number>;
          const keys = Object.keys(langData);
          if (keys.length > 0) {
            languages = keys.slice(0, 5);
          }
        }

        let contributions: number | null = null;
        if (contribRes.ok) {
          const contribData = (await contribRes.json()) as Array<{
            login?: string;
            contributions?: number;
          }>;
          if (Array.isArray(contribData)) {
            const match = contribData.find(
              (c) => c.login?.toLowerCase() === GITHUB_USERNAME.toLowerCase()
            );
            if (match && typeof match.contributions === 'number') {
              contributions = match.contributions;
            }
          }
        }

        const resolved: RepoLiveDetails = { languages, contributions };
        detailsCache.set(slug, resolved);
        if (!cancelled) {
          setDetails(resolved);
        }
      } catch {
        // Keep graceful fallback
      }
    };

    loadDetails();
    return () => {
      cancelled = true;
    };
  }, [isOpen, currentRepo]);

  if (!isOpen || !currentRepo) return null;

  const languagesList =
    details && details.languages.length > 0
      ? details.languages
      : currentRepo.language
        ? [currentRepo.language]
        : ['TypeScript'];

  const liveUrl =
    currentRepo.homepage && currentRepo.homepage.trim().length > 0
      ? currentRepo.homepage.trim().startsWith('http')
        ? currentRepo.homepage.trim()
        : `https://${currentRepo.homepage.trim()}`
      : null;

  const contributionLabel = currentRepo.isContribution
    ? 'Open-Source Contribution'
    : 'Original Build';

  const contributionAmountText =
    details?.contributions !== null && details?.contributions !== undefined
      ? `${details.contributions} commits by @${GITHUB_USERNAME}`
      : currentRepo.isContribution
        ? 'External Repo PRs & Commits'
        : `Built by @${GITHUB_USERNAME}`;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;
    const deltaX = e.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(deltaX) > 48) {
      if (deltaX < 0) handleNext();
      else handlePrev();
    }
  };

  const indexLabel = String(safeIndex + 1).padStart(2, '0');

  return (
    <div
      className="all-projects-overlay"
      data-slide-theme={slideTheme}
      role="dialog"
      aria-modal="true"
      aria-label="All GitHub Projects"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Prominent Floating Close Button */}
      <button
        type="button"
        className="all-projects__close-btn"
        onClick={onClose}
        aria-label="Close all projects folder"
        title="Close (Esc)"
      >
        <X size={16} strokeWidth={2.4} />
        <span>Close</span>
      </button>

      {/* Top 3-Column Monochrome Placeholder Triptych */}
      <div className="all-projects__triptych" aria-hidden="true">
        {[1, 2, 3].map((slot) => (
          <div key={slot} className="all-projects__triptych-frame">
            <div className="all-projects__placeholder-inner">
              <ImageIcon size={22} strokeWidth={1.5} />
              <span>Preview 0{slot}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sub-header Bar: Index & Role Tag */}
      <header className="all-projects__subbar">
        <span className="all-projects__esc-hint">ESC TO EXIT</span>

        <span className="all-projects__bracket-index">[ {indexLabel} ]</span>

        <span className="all-projects__italic-tag">
          {currentRepo.isContribution ? 'open-source contrib' : 'original build'}
        </span>
      </header>

      {/* Main Editorial Content */}
      <main
        className={`all-projects__body all-projects__body--${slideDir}`}
        key={currentRepo.name}
      >
        <div className="all-projects__role-row">
          <span
            className={`all-projects__role-pill ${
              currentRepo.isContribution
                ? 'all-projects__role-pill--contrib'
                : 'all-projects__role-pill--build'
            }`}
          >
            {currentRepo.isContribution ? (
              <GitPullRequest size={13} />
            ) : (
              <Code2 size={13} />
            )}
            <span>{contributionLabel}</span>
          </span>

          <span className="all-projects__commit-pill">{contributionAmountText}</span>
        </div>

        <h2 className="all-projects__title">
          {currentRepo.name.toUpperCase()}
        </h2>

        <p className="all-projects__desc">
          {currentRepo.description ||
            'Open-source repository engineered and maintained on GitHub.'}
        </p>

        {/* Offset Second Block: Stats, Language Logos & Action Links */}
        <div className="all-projects__offset-block">
          <div className="all-projects__stats-row">
            <span className="all-projects__stat-chip">
              <Star size={13} />
              {currentRepo.stargazers_count} Stars
            </span>
            <span className="all-projects__stat-chip">
              <GitFork size={13} />
              {currentRepo.forks_count} Forks
            </span>
          </div>

          <div className="all-projects__languages">
            {languagesList.map((lang) => (
              <span key={lang} className="all-projects__lang-badge" title={lang}>
                <Icon icon={getLanguageIcon(lang)} width={15} height={15} />
                <span>{lang}</span>
              </span>
            ))}
          </div>

          <div className="all-projects__links-row">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="all-projects__action-btn all-projects__action-btn--primary"
              >
                <Globe size={14} />
                <span>Live Demo</span>
                <ArrowUpRight size={14} />
              </a>
            )}
            <a
              href={currentRepo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="all-projects__action-btn"
            >
              <Icon icon="mdi:github" width={15} height={15} />
              <span>GitHub Repo</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </main>

      {/* Large Side Arrow Controls on Desktop */}
      <button
        type="button"
        className="all-projects__side-arrow all-projects__side-arrow--left"
        onClick={handlePrev}
        aria-label="Previous project"
        title="Previous project"
      >
        <ArrowLeft size={24} strokeWidth={2.2} />
      </button>
      <button
        type="button"
        className="all-projects__side-arrow all-projects__side-arrow--right"
        onClick={handleNext}
        aria-label="Next project"
        title="Next project"
      >
        <ArrowRight size={24} strokeWidth={2.2} />
      </button>

      {/* Bottom Source & Counter */}
      <footer className="all-projects__footer">
        <a
          href={currentRepo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="all-projects__source"
        >
          Source: github.com/{getRepoSlug(currentRepo)} <ArrowUpRight size={13} />
        </a>

        <span className="all-projects__nav-count">
          {indexLabel} / {String(total).padStart(2, '0')}
        </span>
      </footer>
    </div>
  );
}
