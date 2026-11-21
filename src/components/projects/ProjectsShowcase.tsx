import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { springs, MOTION_LAYOUT_IDS } from '../../constants/motion';
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
  'Wavewatchers-Figma',
  'pramuditha.dev'
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
  pushed_at?: string;
  updated_at?: string;
}

const norm = (s: string) => s.toLowerCase().replace(/[.\-_]/g, '');

function getRepoTimestamp(r: GitHubRepoItem): number {
  const p = r.pushed_at ? new Date(r.pushed_at).getTime() : 0;
  const u = r.updated_at ? new Date(r.updated_at).getTime() : 0;
  return Math.max(p, u);
}

const FALLBACK_PROJECT_DATES: Record<string, string> = {
  gittulkun: '2026-11-21T07:01:38Z',
  themechanger: '2026-11-11T12:59:28Z',
  bytesift: '2026-11-10T21:21:48Z',
  angelparadise: '2026-11-10T02:36:58Z',
  batterynotifier: '2026-11-09T20:28:37Z',
  digitalweddinginvitation: '2026-11-08T18:11:31Z',
  silenceremover: '2026-11-06T01:57:40Z',
  braintumordetection: '2026-11-06T01:57:31Z',
  reminderafk: '2026-11-06T01:57:16Z',
  generaterules: '2026-11-06T01:57:09Z',
  drag2place: '2026-11-06T01:56:52Z',
  localizationcheck: '2026-11-06T01:56:36Z',
  pramudithacv: '2026-10-26T15:21:50Z',
  hiketracker: '2026-09-03T18:40:56Z',
  openissuedev: '2026-08-31T18:11:10Z',
  essentials: '2026-08-29T20:26:19Z',
  petrocast: '2026-08-28T16:40:59Z',
  petrocastbackend: '2026-08-28T16:40:59Z',
  javathreadworks: '2026-08-23T05:53:40Z',
  puzzlepathfinder: '2026-08-23T05:51:30Z',
  adsyncshared: '2026-08-22T15:35:26Z',
  petrocastfrontend: '2026-07-26T05:14:30Z',
  petrocastcore: '2026-07-13T18:59:03Z',
  vapiclonefrontend: '2026-06-15T14:51:56Z',
  fraudvista: '2026-06-15T14:48:13Z',
  fraudvistafrontend: '2026-06-15T14:48:13Z',
  '11labsm': '2026-06-15T13:54:16Z',
  vapiclonereactts: '2024-11-01T20:34:15Z'
};

function findRepoForProject(
  p: Project,
  repoMap: Map<string, GitHubRepoItem>
): GitHubRepoItem | undefined {
  const nameNorm = norm(p.name);
  if (repoMap.has(nameNorm)) {
    return repoMap.get(nameNorm);
  }

  for (const l of p.links) {
    const match = l.href.match(/github\.com\/[^/]+\/([^/#?]+)/i);
    if (match) {
      const repoKey = norm(match[1].replace(/\.git$/i, ''));
      if (repoMap.has(repoKey)) {
        return repoMap.get(repoKey);
      }
    }
  }

  return undefined;
}

function getProjectTimestamp(p: Project, repoMap: Map<string, GitHubRepoItem>): number {
  const gh = findRepoForProject(p, repoMap);
  if (gh) {
    return getRepoTimestamp(gh);
  }

  const nameNorm = norm(p.name);
  if (FALLBACK_PROJECT_DATES[nameNorm]) {
    return new Date(FALLBACK_PROJECT_DATES[nameNorm]).getTime();
  }

  for (const l of p.links) {
    const match = l.href.match(/github\.com\/[^/]+\/([^/#?]+)/i);
    if (match) {
      const repoKey = norm(match[1].replace(/\.git$/i, ''));
      if (FALLBACK_PROJECT_DATES[repoKey]) {
        return new Date(FALLBACK_PROJECT_DATES[repoKey]).getTime();
      }
    }
  }

  return 0;
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
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 860px)').matches : false
  );
  useEffect(() => {
    const q = window.matchMedia('(max-width: 860px)');
    const update = () => setMobile(q.matches);
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
            initial={{ x: 42, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -42, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src={imgUrl} alt={alt} loading="eager" decoding="async" />
          </motion.div>
        ) : (
          <motion.div
            key={`ph-${name}`}
            className="ps-shot-placeholder-wrap"
            initial={{ x: 42, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -42, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
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
              duration: 0.3,
              delay: 0.04 + delay * 0.7,
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
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
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
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
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
  const [sel, setSel] = useState<number | null>(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 860px)').matches ? null : 0
  );
  const [scrollIndex, setScrollIndex] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Dynamically sync all active repos from GitHub API and maintain latest-first order
  useEffect(() => {
    let isCancelled = false;
    const fetchLiveRepos = async () => {
      try {
        const res = await fetch('https://api.github.com/users/PramudithaN/repos?per_page=100&sort=updated');
        if (!res.ok) return;
        const repos: GitHubRepoItem[] = await res.json();
        if (!Array.isArray(repos) || isCancelled) return;

        setProjectList((prev) => {
          const validRepos = repos
            .filter((repo) => !EXCLUDED_REPOS.includes(repo.name))
            .sort((a, b) => getRepoTimestamp(b) - getRepoTimestamp(a));

          const repoMap = new Map<string, GitHubRepoItem>();
          for (const repo of validRepos) {
            repoMap.set(norm(repo.name), repo);
          }

          // 1. Enrich existing projects with live demo link if available on GitHub
          const enriched = prev.map((p) => {
            const ghRepo = findRepoForProject(p, repoMap);
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

          // 2. Index existing projects so we don't duplicate GitHub repos
          const existingKeys = new Set<string>();
          for (const p of enriched) {
            existingKeys.add(norm(p.name));
            for (const l of p.links) {
              const match = l.href.match(/github\.com\/[^/]+\/([^/#?]+)/i);
              if (match) {
                existingKeys.add(norm(match[1].replace(/\.git$/i, '')));
              }
            }
          }

          // 3. Append any new open-source repos from GitHub not in initialProjects
          const additional: Project[] = [];
          for (const repo of validRepos) {
            const normalizedName = norm(repo.name);
            if (!existingKeys.has(normalizedName)) {
              existingKeys.add(normalizedName);
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

          const combined = [...enriched, ...additional];

          // 4. Sort strictly latest-first based on GitHub repo order / latest activity
          combined.sort((a, b) => {
            const timeA = getProjectTimestamp(a, repoMap);
            const timeB = getProjectTimestamp(b, repoMap);
            return timeB - timeA;
          });

          return combined;
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
      if (isMobile) return; // Never intercept wheel/touch on mobile devices
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
  }, [isMobile]);

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
        {cats.map((c) => {
          const isSelected = c === cat;
          return (
            <button
              key={c}
              type="button"
              className={`ps-chip${isSelected ? ' on' : ''}`}
              style={{ position: 'relative' }}
              onClick={() => {
                setCat(c);
                setSel(0);
                setScrollIndex(0);
                listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {isSelected && (
                <motion.span
                  layoutId={MOTION_LAYOUT_IDS.PROJECT_CATEGORY_ACTIVE}
                  className="ps-chip-active-bg"
                  transition={springs.snappy}
                  aria-hidden="true"
                />
              )}
              <span className="ps-chip-label">
                {c}
                <small>
                  {c === 'All'
                    ? projectList.length
                    : projectList.filter((p) => p.category === c).length}
                </small>
              </span>
            </button>
          );
        })}
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
                  layout={isMobile ? false : 'position'}
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
                  whileHover={isMobile ? undefined : { x: on ? 6 : 4 }}
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
          {panelProject && (
            <motion.div
              key={panelProject.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              style={{ height: '100%' }}
            >
              <Detail
                p={panelProject}
                imgUrl={getEffectiveProjectImage(panelProject, portfolioContent?.projectCustomImages)}
              />
            </motion.div>
          )}
        </aside>
      </div>
    </section>
  );
}
