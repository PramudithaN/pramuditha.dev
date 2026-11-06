import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PortfolioContent } from '../../types';
import { projects as initialProjects, type Project } from './projects';
import './projects-showcase.css';

const EXCLUDED_REPOS = [
  'is-a-dev-register',
  'jarvis',
  'skills-introduction-to-repository-management',
  'skills-introduction-to-secret-scanning',
  'skills-secure-repository-supply-chain',
  'PramudithaN',
  'my-to-do-app',
  'Celestial-Routes-Figma',
  'Wavewatchers-Figma'
];

interface GitHubRepoItem {
  name: string;
  description: string | null;
  html_url: string;
  homepage?: string | null;
  language: string | null;
  fork: boolean;
  archived: boolean;
  topics?: string[];
  stargazers_count?: number;
}

function inferCategory(repo: GitHubRepoItem): string {
  const lang = (repo.language || '').toLowerCase();
  const name = (repo.name || '').toLowerCase();
  const desc = (repo.description || '').toLowerCase();
  const text = `${name} ${desc} ${lang}`;

  if (repo.fork) return 'Open source';
  if (
    text.includes('ai') ||
    text.includes('ml') ||
    text.includes('forecast') ||
    text.includes('neural') ||
    text.includes('mri') ||
    lang === 'python' ||
    lang === 'jupyter notebook'
  ) {
    return 'AI & ML';
  }
  if (
    text.includes('3d') ||
    text.includes('rust') ||
    text.includes('cli') ||
    text.includes('extension') ||
    text.includes('android') ||
    text.includes('electron') ||
    text.includes('linter') ||
    lang === 'rust' ||
    lang === 'kotlin' ||
    lang === 'c#'
  ) {
    return 'Dev tools & 3D';
  }
  return 'Web & systems';
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const q = window.matchMedia('(max-width: 860px)');
    const update = () => setMobile(q.matches);
    update();
    q.addEventListener('change', update);
    return () => q.removeEventListener('change', update);
  }, []);
  return mobile;
}

function getEffectiveProjectImage(
  proj: Project,
  customImagesMap?: Record<string, string[]>
): string | undefined {
  if (!customImagesMap) return proj.img;

  const norm = (s: string) => s.toLowerCase().replace(/[.\-_]/g, '');
  const targetNorm = norm(proj.name);

  for (const [key, list] of Object.entries(customImagesMap)) {
    if (norm(key) === targetNorm) {
      if (!list || list.length === 0 || list[0] === 'none') {
        return undefined; // Explicitly removed by admin
      }
      return list[0]; // Hero image uploaded/assigned by admin
    }
  }

  return proj.img;
}

const PIXEL_COLS = 10;
const PIXEL_ROWS = 6;
const TOTAL_PIXELS = PIXEL_COLS * PIXEL_ROWS;

function PixelSlideImage({ imgUrl, alt, name }: { imgUrl?: string; alt: string; name: string }) {
  const pixelDelays = useMemo(() => {
    return Array.from({ length: TOTAL_PIXELS }, (_, i) => {
      const col = i % PIXEL_COLS;
      const row = Math.floor(i / PIXEL_COLS);
      const colFactor = (col / PIXEL_COLS) * 0.22;
      const rowFactor = (row % 2 ? 0.04 : 0);
      const jitter = ((i * 13) % 7) * 0.012;
      return colFactor + rowFactor + jitter;
    });
  }, []);

  return (
    <div className="ps-shot" key={name}>
      <AnimatePresence mode="popLayout">
        {imgUrl ? (
          <motion.div
            key={imgUrl}
            className="ps-shot-slide-wrap"
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src={imgUrl} alt={alt} loading="lazy" />
          </motion.div>
        ) : (
          <motion.div
            key={`ph-${name}`}
            className="ps-shot-placeholder-wrap"
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ps-tb">
              <i />
              <i />
              <i />
            </div>
            <p>{name}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cyber Pixel Grid Dissolve Overlay */}
      <div className="ps-pixel-grid" aria-hidden="true" key={`pixels-${name}`}>
        {pixelDelays.map((delay, idx) => (
          <motion.div
            key={idx}
            className="ps-pixel-cell"
            initial={{ opacity: 0.95 }}
            animate={{ opacity: 0 }}
            transition={{
              duration: 0.28,
              delay: 0.05 + delay,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Tech Pixel Scanline */}
      <motion.div
        key={`scan-${name}`}
        className="ps-pixel-scanline"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

function Detail({ p, imgUrl }: { p: Project; imgUrl?: string }) {
  return (
    <div className="ps-d">
      <PixelSlideImage imgUrl={imgUrl} alt={`${p.name} screenshot`} name={p.name} />
      <div className="ps-body">
        <motion.h3
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          {p.name}
        </motion.h3>
        <p className="ps-tag">{p.tagline}</p>
        <p className="ps-desc">{p.description}</p>
        <div className="ps-out">
          <b>Result:</b> {p.result}
        </div>
        {p.metrics.length > 0 && (
          <div className="ps-met">
            {p.metrics.map((m) => (
              <div key={m.label}>
                <b>{m.value}</b>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        )}
        <div className="ps-stack">
          {p.stack.map((s) => (
            <em key={s}>{s}</em>
          ))}
        </div>
        <div className="ps-act">
          {p.links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ProjectsShowcaseProps {
  portfolioContent?: PortfolioContent;
}

export default function ProjectsShowcase({ portfolioContent }: ProjectsShowcaseProps = {}) {
  const isMobile = useIsMobile();
  const [projectList, setProjectList] = useState<Project[]>(initialProjects);
  const [cat, setCat] = useState('All');
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState<number | null>(0);
  const [scrollIndex, setScrollIndex] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Dynamically sync all active repos from GitHub API
  useEffect(() => {
    let isCancelled = false;
    const fetchLiveRepos = async () => {
      try {
        const res = await fetch('https://api.github.com/users/PramudithaN/repos?per_page=100&sort=updated');
        if (!res.ok) return;
        const repos: GitHubRepoItem[] = await res.json();
        if (!Array.isArray(repos) || isCancelled) return;

        setProjectList((prev) => {
          const repoMap = new Map<string, GitHubRepoItem>();
          for (const repo of repos) {
            if (!EXCLUDED_REPOS.includes(repo.name)) {
              repoMap.set(repo.name.toLowerCase().replace(/[.\-_]/g, ''), repo);
            }
          }

          // 1. Enrich existing projects with live demo link if available on GitHub
          const enriched = prev.map((p) => {
            const key = p.name.toLowerCase().replace(/[.\-_]/g, '');
            const ghRepo = repoMap.get(key);
            const home = ghRepo?.homepage?.trim();
            if (home) {
              const hasLive = p.links.some((l) => l.label.toLowerCase().includes('live'));
              if (!hasLive) {
                return {
                  ...p,
                  links: [{ label: 'Live demo', href: home }, ...p.links]
                };
              }
            }
            return p;
          });

          // 2. Append any new open-source repos from GitHub not in initialProjects
          const existingNames = new Set(enriched.map((p) => p.name.toLowerCase().replace(/[.\-_]/g, '')));
          const additional: Project[] = [];

          for (const repo of repos) {
            if (EXCLUDED_REPOS.includes(repo.name)) continue;
            const normalizedName = repo.name.toLowerCase().replace(/[.\-_]/g, '');
            if (!existingNames.has(normalizedName)) {
              existingNames.add(normalizedName);
              const home = repo.homepage?.trim();
              additional.push({
                name: repo.name,
                category: inferCategory(repo),
                tagline: repo.description || 'Open-source repository by Pramuditha Nadun',
                description:
                  repo.description ||
                  'Open-source software repository maintained by Pramuditha Nadun on GitHub.',
                result: 'Available as an open-source repository on GitHub with active codebase and documentation.',
                metrics: repo.language ? [{ value: repo.language, label: 'language' }] : [],
                stack: [repo.language, ...(repo.topics || [])].filter((s): s is string => Boolean(s)),
                status: repo.archived ? 'Archived' : (repo.fork ? 'Contributor' : 'Active'),
                links: home
                  ? [
                      { label: 'Live demo', href: home },
                      { label: 'Source', href: repo.html_url }
                    ]
                  : [{ label: 'Source', href: repo.html_url }]
              });
            }
          }

          return additional.length > 0 ? [...enriched, ...additional] : enriched;
        });
      } catch {
        // Gracefully keep initial projects if GitHub API limit is reached
      }
    };

    fetchLiveRepos();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Prioritize scrolling project cards first while mouse is over the projects list,
  // and smoothly release to page scrolling as soon as the mouse moves away or reaches list bounds.
  useEffect(() => {
    const handleGlobalWheel = (e: WheelEvent) => {
      const listEl = listRef.current;
      if (!listEl) return;

      // Only intercept if mouse cursor is currently within the projects list bounding box
      if (typeof e.clientX !== 'number' || typeof e.clientY !== 'number') return;
      const rect = listEl.getBoundingClientRect();
      const isOverProjectsList =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      // If user moved cursor away from the projects list, let the website scroll!
      if (!isOverProjectsList) return;

      // If the list is not scrollable (e.g. on mobile where it expands), let page scroll naturally
      const maxScroll = listEl.scrollHeight - listEl.clientHeight;
      if (maxScroll <= 2) return;

      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;
      const atBottom = listEl.scrollTop + listEl.clientHeight >= listEl.scrollHeight - 2;
      const atTop = listEl.scrollTop <= 2;

      // Scroll the projects first until bottom or top limit is reached
      if (isScrollingDown && !atBottom) {
        e.preventDefault();
        listEl.scrollTop += e.deltaY;
      } else if (isScrollingUp && !atTop) {
        e.preventDefault();
        listEl.scrollTop += e.deltaY;
      }
      // When atBottom (scrolling down) or atTop (scrolling up), we do NOT call preventDefault(),
      // allowing natural scroll chaining to the parent website container!
    };

    window.addEventListener('wheel', handleGlobalWheel, { passive: false, capture: true });
    return () => {
      window.removeEventListener('wheel', handleGlobalWheel, { capture: true });
    };
  }, []);

  const cats = useMemo(
    () => ['All', ...Array.from(new Set(projectList.map((p) => p.category)))],
    [projectList]
  );

  const visible = useMemo(() => {
    const t = query.trim().toLowerCase();
    return projectList.filter(
      (p) =>
        (cat === 'All' || p.category === cat) &&
        (!t || `${p.name} ${p.tagline} ${p.stack.join(' ')}`.toLowerCase().includes(t))
    );
  }, [projectList, cat, query]);

  const shown =
    sel === null
      ? isMobile
        ? null
        : visible.length > 0
        ? 0
        : null
      : sel >= visible.length
      ? visible.length > 0
        ? 0
        : null
      : sel;

  const panelProject = shown !== null ? visible[shown] : undefined;

  // Dynamic scroll dots indicator: provides 8 proportional dots for full lists
  // so visitors intuitively perceive the extensive depth of projects available to scroll.
  const numDots = visible.length === 0 ? 0 : Math.min(8, Math.max(3, visible.length));

  const handleListScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const max = el.scrollHeight - el.clientHeight;
      if (max > 0 && numDots > 1) {
        const ratio = Math.max(0, Math.min(1, el.scrollTop / max));
        const nextIndex = Math.min(numDots - 1, Math.round(ratio * (numDots - 1)));
        setScrollIndex(nextIndex);
      }
    },
    [numDots]
  );

  const scrollToPosition = useCallback(
    (index: number) => {
      if (!listRef.current) return;
      const max = listRef.current.scrollHeight - listRef.current.clientHeight;
      if (max <= 0 || numDots <= 1) return;
      const target = (index / (numDots - 1)) * max;
      listRef.current.scrollTo({ top: target, behavior: 'smooth' });
    },
    [numDots]
  );

  return (
    <section className="ps" aria-labelledby="ps-title">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
      >
        <h2 id="ps-title" className="ps-h">
          Projects &amp; systems
        </h2>
        <p className="ps-lead">
          Things I’ve built and shipped. Pick one to see what it does, what changed because of it, and
          how it’s made.
        </p>
      </motion.div>

      <motion.div
        className="ps-bar"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, delay: 0.08 }}
      >
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            className={`ps-chip${c === cat ? ' on' : ''}`}
            onClick={() => {
              setCat(c);
              setSel(0);
              setScrollIndex(0);
              listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {c}
            <small>
              {c === 'All'
                ? projectList.length
                : projectList.filter((p) => p.category === c).length}
            </small>
          </button>
        ))}
        <input
          className="ps-q"
          type="search"
          placeholder="Search by tech, e.g. Python"
          aria-label="Search projects"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSel(0);
            setScrollIndex(0);
            listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </motion.div>

      <div className="ps-grid">
        <div className="ps-list-col">
          {/* Vertical scroll indicator dots on the left */}
          {numDots > 1 && (
            <div
              className="ps-scroll-dots"
              aria-label="Vertical scroll indicator"
              title="Scroll through projects"
            >
              {Array.from({ length: numDots }).map((_, i) => {
                const dist = Math.abs(scrollIndex - i);
                const dotClass =
                  dist === 0
                    ? 'active'
                    : dist <= 2
                    ? 'dot-near'
                    : dist === 3
                    ? 'dot-mid'
                    : 'dot-far';

                return (
                  <button
                    key={i}
                    type="button"
                    className={`ps-sdot ${dotClass}`}
                    onClick={() => scrollToPosition(i)}
                    aria-label={`Scroll to project position ${i + 1} of ${numDots}`}
                    title={`Scroll to position ${i + 1} of ${numDots}`}
                  />
                );
              })}
            </div>
          )}

          <div
            className="ps-list"
            role="list"
            ref={listRef}
            onScroll={handleListScroll}
          >
            {visible.length === 0 && (
              <div className="ps-none">No projects match. Try a different filter or search term.</div>
            )}
            {visible.map((p, i) => {
              const on = i === shown;
              return (
                <motion.div
                  key={p.name}
                  className={`ps-row${on ? ' on' : ''}`}
                  role="listitem"
                  initial={{ opacity: 0, y: 22, scale: 0.985 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.08 }}
                  transition={{
                    duration: 0.42,
                    delay: Math.min((i % 8) * 0.05, 0.3),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ x: on ? 6 : 4 }}
                >
                  <button
                    type="button"
                    className="ps-head"
                    aria-expanded={on}
                    onClick={() => setSel(on && isMobile ? null : i)}
                  >
                    <b>{p.name}</b>
                    <span>{p.tagline}</span>
                    <div className="ps-st">
                      <i />
                      {p.status}
                      {on && <span className="ps-active-arrow" aria-hidden="true">→</span>}
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        className="ps-more"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <Detail
                          p={p}
                          imgUrl={getEffectiveProjectImage(p, portfolioContent?.projectCustomImages)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        <aside className="ps-panel" aria-live="polite">
          <AnimatePresence mode="wait">
            {panelProject && (
              <motion.div
                key={panelProject.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <Detail
                  p={panelProject}
                  imgUrl={getEffectiveProjectImage(panelProject, portfolioContent?.projectCustomImages)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </section>
  );
}
