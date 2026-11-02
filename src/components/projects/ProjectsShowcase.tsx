import { useEffect, useMemo, useRef, useState } from 'react';
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

function Detail({ p, imgUrl }: { p: Project; imgUrl?: string }) {
  return (
    <div className="ps-d">
      <div className="ps-shot">
        {imgUrl ? (
          <img src={imgUrl} alt={`${p.name} screenshot`} loading="lazy" />
        ) : (
          <>
            <div className="ps-tb">
              <i />
              <i />
              <i />
            </div>
            <p>{p.name}</p>
          </>
        )}
      </div>
      <div className="ps-body">
        <h3>{p.name}</h3>
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
  const sectionRef = useRef<HTMLElement | null>(null);

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

  const handleListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    if (max > 0) {
      const ratio = el.scrollTop / max;
      if (ratio < 0.33) setScrollIndex(0);
      else if (ratio < 0.67) setScrollIndex(1);
      else setScrollIndex(2);
    }
  };

  const scrollToPosition = (index: number) => {
    if (!listRef.current) return;
    const max = listRef.current.scrollHeight - listRef.current.clientHeight;
    if (max <= 0) return;
    const targets = [0, max / 2, max];
    listRef.current.scrollTo({ top: targets[index], behavior: 'smooth' });
  };

  // Seamlessly prioritize scrolling project cards first before passing scroll to the page
  useEffect(() => {
    const handleGlobalWheel = (e: WheelEvent) => {
      const listEl = listRef.current;
      const secEl = sectionRef.current;
      if (!listEl || !secEl) return;

      // Only intercept if mouse cursor is currently over the Projects section
      if (typeof e.clientX !== 'number' || typeof e.clientY !== 'number') return;
      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (!target || !secEl.contains(target)) return;

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
      // so the browser naturally chains and scrolls the parent website container!
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

  return (
    <section ref={sectionRef} className="ps" aria-labelledby="ps-title">
      <h2 id="ps-title" className="ps-h">
        Projects &amp; systems
      </h2>
      <p className="ps-lead">
        Things I’ve built and shipped. Pick one to see what it does, what changed because of it, and
        how it’s made.
      </p>

      <div className="ps-bar">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            className={`ps-chip${c === cat ? ' on' : ''}`}
            onClick={() => {
              setCat(c);
              setSel(0);
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
          }}
        />
      </div>

      <div className="ps-grid">
        <div className="ps-list-col">
          {/* Vertical scroll indicator dots on the left in small size */}
          <div
            className="ps-scroll-dots"
            aria-label="Vertical scroll indicator"
            title="Scroll through projects"
          >
            <button
              type="button"
              className={`ps-sdot${scrollIndex === 0 ? ' active' : ''}`}
              onClick={() => scrollToPosition(0)}
              aria-label="Scroll to top"
            />
            <button
              type="button"
              className={`ps-sdot${scrollIndex === 1 ? ' active' : ''}`}
              onClick={() => scrollToPosition(1)}
              aria-label="Scroll to middle"
            />
            <button
              type="button"
              className={`ps-sdot${scrollIndex === 2 ? ' active' : ''}`}
              onClick={() => scrollToPosition(2)}
              aria-label="Scroll to bottom"
            />
          </div>

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
                <div key={p.name} className={`ps-row${on ? ' on' : ''}`} role="listitem">
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
                    </div>
                  </button>
                  <div className="ps-more">
                    {on && (
                      <Detail
                        p={p}
                        imgUrl={getEffectiveProjectImage(p, portfolioContent?.projectCustomImages)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="ps-panel" aria-live="polite">
          {panelProject && (
            <Detail
              p={panelProject}
              imgUrl={getEffectiveProjectImage(panelProject, portfolioContent?.projectCustomImages)}
            />
          )}
        </aside>
      </div>
    </section>
  );
}
