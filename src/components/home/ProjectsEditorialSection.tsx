import { useMemo } from 'react';
import { useGitHubRepos } from '../../hooks/useGitHubRepos';
import type { GitHubRepo, PageType, ThemeMode } from '../../types';
import './projects-editorial.css';

export interface ProjectsEditorialSectionProps {
  theme: ThemeMode;
  onNavigate?: (page: PageType) => void;
}

const REPO_PREVIEWS: Record<string, string> = {
  'git-tulkun': '/images/projects/git-tulkun-preview.svg',
  'localization-check': '/images/projects/localization-preview.svg',
  'reminder.afk': '/images/Screenshot 2026-09-03 003623.webp',
  'brain-tumor-detection': '/images/projects/brain-tumor-preview.svg',
  drag2place: '/images/projects/drag2place-preview.svg',
  '11labsM': '/images/projects/11labs-preview.svg',
  'petrocast-backend': '/images/projects/petrocast-preview.svg',
  'digital-wedding-invitation': '/images/projects/wedding-preview.svg',
  'openissue.dev': '/images/projects/openissue-preview.svg',
};

function getRepoPreview(name: string): string {
  return REPO_PREVIEWS[name] || '/images/projects/openissue-preview.svg';
}

function getLatestUniqueRepos(repos: GitHubRepo[]): GitHubRepo[] {
  const seen = new Set<string>();
  const unique: GitHubRepo[] = [];
  for (const repo of repos) {
    if (!seen.has(repo.name)) {
      seen.add(repo.name);
      unique.push(repo);
    }
  }
  return unique.sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );
}

export default function ProjectsEditorialSection({
  theme,
  onNavigate,
}: ProjectsEditorialSectionProps) {
  const { featuredRepos, otherRepos, contributedRepos } = useGitHubRepos();

  const latestRepos = useMemo(
    () =>
      getLatestUniqueRepos([
        ...featuredRepos,
        ...contributedRepos,
        ...otherRepos,
      ]),
    [featuredRepos, contributedRepos, otherRepos],
  );

  const leadRepo = latestRepos[0];
  const topThreeRepos = latestRepos.slice(0, 3);
  const spotlightRepo = latestRepos[3] || leadRepo;
  const recentFiveRepos = latestRepos.slice(3, 8);

  return (
    <section
      id="projects"
      className="proj-flyer"
      data-theme={theme}
      aria-label="Latest GitHub Projects"
    >
      <div className="proj-flyer__stack">
        {/* SHEET 1: Crimson Hero + Overlapping Charcoal + 3 Latest Repo Cards */}
        <article className="proj-flyer__sheet">
          <div className="proj-flyer__hero">
            {leadRepo && (
              <img
                src={getRepoPreview(leadRepo.name)}
                alt=""
                className="proj-flyer__hero-bg"
                loading="lazy"
              />
            )}
            <div className="proj-flyer__hero-content">
              <h2 className="proj-flyer__hero-title">
                &ldquo;LATEST GITHUB REPOS &amp; SHIPPED SYSTEMS&rdquo;
              </h2>
              <p className="proj-flyer__hero-sub">
                Live-synced open-source builds, developer tooling, and
                production web architectures by Pramuditha Nadun.
              </p>
            </div>
          </div>

          <div className="proj-flyer__intro-row">
            <div className="proj-flyer__charcoal-box">
              <h3 className="proj-flyer__charcoal-kicker">
                {leadRepo ? leadRepo.name : 'LATEST REPO'}
              </h3>
              <p className="proj-flyer__charcoal-text">
                {leadRepo?.description ||
                  'Most recently updated repository pushed to GitHub with clean architecture and production tooling.'}
              </p>
              {leadRepo && (
                <a
                  href={leadRepo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proj-flyer__charcoal-link"
                >
                  Inspect on GitHub ↗
                </a>
              )}
            </div>

            <p className="proj-flyer__statement">
              BUILT WITH CLEAN ARCHITECTURE, REAL-TIME TELEMETRY &amp;
              PRODUCTION RIGOR.
            </p>
          </div>

          <div className="proj-flyer__three-grid">
            {topThreeRepos.map((repo, idx) => (
              <a
                key={repo.name}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="proj-flyer__stat-card"
              >
                <div className="proj-flyer__stat-media">
                  <img
                    src={getRepoPreview(repo.name)}
                    alt={repo.name}
                    className="proj-flyer__bw"
                    loading="lazy"
                  />
                  <span className="proj-flyer__stat-badge">
                    0{idx + 1}
                  </span>
                </div>

                <h4 className="proj-flyer__stat-title">{repo.name}</h4>
                <div className="proj-flyer__dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <p className="proj-flyer__stat-desc">
                  {repo.description ||
                    'Open-source software project by Pramuditha Nadun.'}
                </p>
                <span className="proj-flyer__stat-meta">
                  {repo.language || 'Code'} · ★ {repo.stargazers_count}
                </span>
              </a>
            ))}
          </div>

          <div className="proj-flyer__sheet-foot">
            <span>Nugegoda, Sri Lanka</span>
            <span>pramudithanadun9@gmail.com</span>
            <span>github.com/PramudithaN</span>
          </div>
        </article>

        {/* SHEET 2: Framed Preview + Crimson Heading Band + All Projects Trigger */}
        <article className="proj-flyer__sheet">
          <div className="proj-flyer__s2-top">
            <div className="proj-flyer__s2-frame-wrap">
              <div className="proj-flyer__s2-frame">
                <img
                  src={
                    spotlightRepo
                      ? getRepoPreview(spotlightRepo.name)
                      : '/images/projects/openissue-preview.svg'
                  }
                  alt={spotlightRepo?.name || 'Featured project'}
                  className="proj-flyer__bw"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="proj-flyer__s2-right-top">
              <div className="proj-flyer__company-box-wrap">
                <span className="proj-flyer__company-box">PRAMUDITHA.DEV</span>
              </div>

              <div className="proj-flyer__red-band">
                <h3 className="proj-flyer__red-band-title">
                  OPEN SOURCE
                  <br />
                  PROJECTS
                </h3>
                <div className="proj-flyer__dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>

          <div className="proj-flyer__s2-mid">
            <div>
              <h4 className="proj-flyer__s2-subhead">
                SYSTEMS &amp;
                <br />
                ARCHITECTURE
              </h4>
              <div className="proj-flyer__dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <p className="proj-flyer__s2-copy">
                Spanning Rust procedural engines, Electron + React Three Fiber
                desktop companions, VS Code AST linters, and machine learning
                inference pipelines — all synced live from GitHub.
              </p>
            </div>

            <div>
              <h4 className="proj-flyer__s2-subhead">SPOTLIGHT BUILD</h4>
              <div className="proj-flyer__dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="proj-flyer__s2-mini-frame">
                <img
                  src={
                    leadRepo
                      ? getRepoPreview(leadRepo.name)
                      : '/images/projects/git-tulkun-preview.svg'
                  }
                  alt={leadRepo?.name || 'Spotlight project'}
                  className="proj-flyer__bw"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="proj-flyer__s2-bottom">
            <button
              type="button"
              className="proj-flyer__red-callout"
              onClick={() => onNavigate?.('logic')}
            >
              <h4 className="proj-flyer__red-callout-title">
                View All {latestRepos.length} Projects
              </h4>
              <p className="proj-flyer__red-callout-copy">
                Open the full Logic &amp; Systems archive to inspect every
                shipped repository, stack breakdown, and live demo.
              </p>
              <span className="proj-flyer__red-callout-cta">
                Open All Projects ↗
              </span>
            </button>

            <div>
              <h4 className="proj-flyer__s2-subhead">RECENT REPOSITORIES</h4>
              <div className="proj-flyer__dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <ul className="proj-flyer__repo-list">
                {recentFiveRepos.map((repo) => (
                  <li key={repo.name}>
                    <span>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="proj-flyer__repo-link"
                      >
                        {repo.name}
                      </a>{' '}
                      — {repo.description || repo.language || 'Open-source repo'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="proj-flyer__sheet-foot">
            <span>Pramuditha Nadun · Software Engineer</span>
            <span>{latestRepos.length} Public &amp; Contributed Repos</span>
            <span>github.com/PramudithaN</span>
          </div>
        </article>
      </div>
    </section>
  );
}
