import { useState } from 'react';
import { useGitHubRepos } from '../../hooks/useGitHubRepos';
import type { PageType, ThemeMode } from '../../types';
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

const BARCODE_WIDTHS = [2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 1, 3, 1, 2, 1, 2];

function getRepoPreview(name: string): string {
  return REPO_PREVIEWS[name] || '/images/projects/openissue-preview.svg';
}

function BarcodeGraphic() {
  return (
    <span className="proj-brief__barcode" aria-hidden="true">
      {BARCODE_WIDTHS.map((w, idx) => (
        <span key={idx} style={{ width: `${w}px` }} />
      ))}
    </span>
  );
}

export default function ProjectsEditorialSection({
  theme,
  onNavigate,
}: ProjectsEditorialSectionProps) {
  const { featuredRepos, otherRepos, contributedRepos } = useGitHubRepos();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const allRepos = [...featuredRepos, ...contributedRepos, ...otherRepos];
  const heroRepo = allRepos[selectedIdx] || allRepos[0];
  const stripRepos = allRepos.slice(0, 7);
  const fourProductRepos = allRepos.slice(0, 4);

  return (
    <section
      id="projects"
      className="proj-brief"
      data-theme={theme}
      aria-label="Projects Showcase"
    >
      {/* TOP STONE STAGE — Overlapping Swiss Brief Boards */}
      <div className="proj-brief__top-stage">
        <div className="proj-brief__top-inner">
          <div className="proj-brief__boards-overlap">
            {/* Board A: Left Hero Brief */}
            <article className="proj-brief__board-a">
              <div className="proj-brief__board-a-hero">
                {heroRepo && (
                  <img
                    src={getRepoPreview(heroRepo.name)}
                    alt={heroRepo.name}
                    className="proj-brief__bw proj-brief__board-a-bg"
                    loading="lazy"
                  />
                )}

                <div className="proj-brief__board-a-top">
                  <span className="proj-brief__pill">CREATIVE</span>
                  <span className="proj-brief__pill proj-brief__pill--solid">
                    BRIEF · ENGINEERING
                  </span>
                  <span className="proj-brief__pill">PRAMUDITHA.DEV</span>
                  <span className="proj-brief__pill">2026</span>
                </div>

                <div className="proj-brief__board-a-mid">
                  <div>
                    <strong>REPO INFO</strong>
                    <br />
                    {heroRepo ? heroRepo.name : 'pramuditha.dev'}
                    <br />
                    {heroRepo?.language || 'TypeScript'} · ★{' '}
                    {heroRepo?.stargazers_count ?? 0}
                  </div>

                  <span>GITHUB.COM/PRAMUDITHAN</span>

                  <div className="proj-brief__est-box">
                    <span className="proj-brief__est-label">EST - 2026</span>
                    <BarcodeGraphic />
                  </div>
                </div>
              </div>

              <div className="proj-brief__board-a-title-row">
                <h2 className="proj-brief__giant-word">CREATIVE</h2>
                <span className="proj-brief__vertical-tag">BRIEF</span>
              </div>
            </article>

            {/* Board B: Right Campaign Overview */}
            <article className="proj-brief__board-b">
              <div className="proj-brief__board-b-head">
                <span className="proj-brief__pill">PROJECTS</span>
                <span className="proj-brief__pill proj-brief__pill--solid">
                  SHIPPED
                </span>
                <span className="proj-brief__pill">2026</span>
              </div>

              <h3 className="proj-brief__campaign-title">CAMPAIGN.</h3>

              <div className="proj-brief__board-b-grid">
                <div>
                  <p className="proj-brief__bullets-url">
                    {heroRepo ? heroRepo.name.toUpperCase() : 'FEATURED BUILD'}
                  </p>
                  <ul className="proj-brief__bullets">
                    <li>Language: {heroRepo?.language || 'TypeScript'}</li>
                    <li>Stars: {heroRepo?.stargazers_count ?? 0}</li>
                    <li>Forks: {heroRepo?.forks_count ?? 0}</li>
                    <li>Open-source architecture</li>
                    <li>Production-tested builds</li>
                  </ul>
                </div>

                <div className="proj-brief__board-b-img">
                  <img
                    src={
                      heroRepo
                        ? getRepoPreview(heroRepo.name)
                        : '/images/projects/openissue-preview.svg'
                    }
                    alt={heroRepo?.name || 'Project preview'}
                    className="proj-brief__bw"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="proj-brief__board-b-foot">
                <div>
                  <strong>GITHUB REPO:</strong>
                  <div className="proj-brief__year-lg">2024-2026</div>
                </div>
                <div>
                  {heroRepo?.description ||
                    'Full-stack web applications, Rust developer utilities, and interactive UI systems engineered by Pramuditha Nadun.'}
                </div>
              </div>
            </article>
          </div>

          {/* 7-Column Architectural Spec Strip */}
          <div className="proj-brief__spec-strip">
            <span>
              PROJECT BRIEF
              <br />
              SHOWCASE TEMPLATE
            </span>
            <span>
              COLLECTION OF
              <br />
              [PRAMUDITHA.DEV]
            </span>
            <span>
              B/N:
              <br />
              #00000{stripRepos.length}
            </span>
            <span>
              LIVE GITHUB
              <br />
              {allRepos.length} REPOSITORIES
            </span>
            <span>
              BASED ON
              <br />
              [SHIPPED CODE]
            </span>
            <span>
              ENGINEERING
              <br />
              (LOLC &amp; OSS)
            </span>
            <span>
              BY:
              <br />
              PRAMUDITHA
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM MATTE-BLACK STAGE — Board C (Strip) & Board D (4-Col Showcase) */}
      <div className="proj-brief__bottom-stage">
        <div className="proj-brief__bottom-inner">
          {/* Board C: BUILD HISTORY + 7-Slot Interactive Strip */}
          <article className="proj-brief__slide">
            <div className="proj-brief__slide-bar">
              <span className="proj-brief__pill">CREATIVE</span>
              <span className="proj-brief__pill proj-brief__pill--solid">
                BUILD · ARCHIVE
              </span>
              <span className="proj-brief__pill">GITHUB</span>
              <span className="proj-brief__pill">SHOWCASE</span>
              <span className="proj-brief__pill">2026</span>
            </div>

            <div className="proj-brief__filmstrip">
              {stripRepos.map((repo, idx) => (
                <button
                  key={repo.name}
                  type="button"
                  className={`proj-brief__strip-item ${
                    idx === selectedIdx ? 'is-selected' : ''
                  }`}
                  onClick={() => setSelectedIdx(idx)}
                  aria-label={`Inspect ${repo.name}`}
                >
                  <div className="proj-brief__strip-thumb">
                    <img
                      src={getRepoPreview(repo.name)}
                      alt={repo.name}
                      className="proj-brief__bw"
                      loading="lazy"
                    />
                  </div>
                  <span className="proj-brief__strip-code">
                    C.P - 00.{idx + 1}
                  </span>
                </button>
              ))}
            </div>

            <div className="proj-brief__history-mid">
              <div className="proj-brief__est-box">
                <span className="proj-brief__est-label">EST - 2026</span>
                <BarcodeGraphic />
              </div>

              <div>
                <div className="proj-brief__year-lg">2022-2026</div>
                <p className="proj-brief__history-copy">
                  {heroRepo
                    ? `${heroRepo.name}: ${
                        heroRepo.description ||
                        'Open-source software project engineered with clean architecture.'
                      }`
                    : 'Select any repository thumbnail above to preview its brief.'}
                </p>
              </div>
            </div>

            <h3 className="proj-brief__history-title">BUILD HISTORY</h3>
          </article>

          {/* Board D: PRODUCT. + 4-Column Project Grid */}
          <article className="proj-brief__slide">
            <div className="proj-brief__slide-bar">
              <span className="proj-brief__pill">FEATURED</span>
              <span className="proj-brief__pill proj-brief__pill--solid">
                SHIPPED · SYSTEMS
              </span>
              <span className="proj-brief__pill">PRAMUDITHA</span>
              <span className="proj-brief__pill">2026</span>
            </div>

            <div className="proj-brief__product-top">
              <div>
                <p className="proj-brief__bullets-url">GITHUB.COM/PRAMUDITHAN</p>
                <ul className="proj-brief__bullets">
                  <li>Rust CLI &amp; procedural engines</li>
                  <li>Electron + Three.js desktop apps</li>
                  <li>React, TypeScript &amp; Vite systems</li>
                  <li>ML inference &amp; API platforms</li>
                </ul>
              </div>

              <h3 className="proj-brief__product-title">PRODUCT.</h3>
            </div>

            <div className="proj-brief__product-grid">
              {fourProductRepos.map((repo, idx) => (
                <a
                  key={repo.name}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proj-brief__product-card"
                >
                  <div>
                    <h4 className="proj-brief__product-card-title">
                      {idx + 1}# {repo.name}
                    </h4>
                    <p className="proj-brief__product-card-desc">
                      {repo.description ||
                        'Open-source software repository by Pramuditha Nadun.'}
                    </p>
                  </div>

                  <div className="proj-brief__product-thumb">
                    <img
                      src={getRepoPreview(repo.name)}
                      alt={repo.name}
                      className="proj-brief__bw"
                      loading="lazy"
                    />
                  </div>
                </a>
              ))}
            </div>
          </article>

          {onNavigate && (
            <div className="proj-brief__all-bar">
              <button
                type="button"
                className="proj-brief__all-btn"
                onClick={() => onNavigate('logic')}
              >
                Explore Full Engineering Archive in Logic &amp; Systems ↗
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
