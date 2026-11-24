import { useState } from 'react';
import { useGitHubRepos } from '../../hooks/useGitHubRepos';
import type { GitHubRepo, PageType, ThemeMode } from '../../types';
import './projects-editorial.css';

export interface ProjectsEditorialSectionProps {
  theme: ThemeMode;
  onNavigate?: (page: PageType) => void;
}

const REPO_PREVIEWS: Record<string, string> = {
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

function formatRepoNum(idx: number): string {
  return String(idx + 1).padStart(2, '0');
}

function RepoIndexCell({ repo, indexLabel }: { repo: GitHubRepo; indexLabel: string }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="proj-t2__index-cell"
    >
      <div>
        <span className="proj-t2__cell-kicker">
          {repo.language || 'Code'} · ★ {repo.stargazers_count} · ⑂ {repo.forks_count}
        </span>
        <h3 className="proj-t2__cell-title">
          <span className="proj-t2__cell-num">{indexLabel}</span>
          {repo.name}
        </h3>
        <p className="proj-t2__cell-desc">
          {repo.description || 'Open-source repository by Pramuditha Nadun.'}
        </p>
      </div>
      <div className="proj-t2__cell-stats">
        <span>GitHub ↗</span>
        {repo.homepage && <span>Live Demo ↗</span>}
      </div>
    </a>
  );
}

export default function ProjectsEditorialSection({
  theme,
  onNavigate,
}: ProjectsEditorialSectionProps) {
  const { featuredRepos, otherRepos, contributedRepos } = useGitHubRepos();
  const [selectedFeaturedIdx, setSelectedFeaturedIdx] = useState(0);

  const heroRepo =
    featuredRepos[selectedFeaturedIdx] || featuredRepos[0];

  const allIndexRepos = [...featuredRepos, ...contributedRepos, ...otherRepos];

  // Spread rows + 4-col + 3-col magazine index layout
  const spreadOne = allIndexRepos[1] || allIndexRepos[0];
  const rowFour = allIndexRepos.slice(2, 6);
  const spreadTwo = allIndexRepos[6] || allIndexRepos[2];
  const rowThree = allIndexRepos.slice(7, 10);
  const spreadThree = allIndexRepos[10] || allIndexRepos[3];

  return (
    <section
      className="projects-editorial"
      data-theme={theme}
      aria-label="GitHub Projects"
    >
      {/* TEMPLATE 1 — Swiss Red "01" Featured GitHub Project Banner */}
      {heroRepo && (
        <div className="proj-t1">
          <div className="proj-t1__hero-band">
            <div className="proj-t1__left-bar" aria-hidden="true" />
            <div className="proj-t1__numeral-wrap">
              <div className="proj-t1__numeral-base" aria-hidden="true" />
              <span className="proj-t1__numeral proj-t1__numeral-text">
                {formatRepoNum(selectedFeaturedIdx)}
              </span>
            </div>
            <div className="proj-t1__right-block">
              <div className="proj-t1__switcher" role="tablist" aria-label="Featured repositories">
                {featuredRepos.slice(0, 7).map((repo, idx) => (
                  <button
                    key={repo.name}
                    type="button"
                    role="tab"
                    aria-selected={idx === selectedFeaturedIdx}
                    className={`proj-t1__switch-btn ${
                      idx === selectedFeaturedIdx ? 'proj-t1__switch-btn--active' : ''
                    }`}
                    onClick={() => setSelectedFeaturedIdx(idx)}
                  >
                    {formatRepoNum(idx)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="proj-t1__body">
            <h2 className="proj-t1__title">
              {heroRepo.name} — {heroRepo.language || 'Software Engineering'}
            </h2>
            <p className="proj-t1__desc">
              {heroRepo.description || 'Featured open-source repository.'}
            </p>

            <div className="proj-t1__stats">
              <span>
                <span className="proj-t1__lang-dot" aria-hidden="true" />
                {heroRepo.language || 'Multi-language'}
              </span>
              <span>★ {heroRepo.stargazers_count} Stars</span>
              <span>⑂ {heroRepo.forks_count} Forks</span>
              {heroRepo.license?.name && <span>{heroRepo.license.name}</span>}
              {heroRepo.homepage && (
                <a
                  href={heroRepo.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proj-t2__repo-link"
                >
                  Live Demo ↗
                </a>
              )}
            </div>

            <div className="proj-t1__footer-row">
              <div className="proj-t1__topics">
                {(heroRepo.topics || []).slice(0, 5).map((topic) => (
                  <span key={topic} className="proj-t1__topic">
                    #{topic}
                  </span>
                ))}
              </div>

              <a
                href={heroRepo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="proj-t1__stamp-link"
              >
                VIEW REPOSITORY ON GITHUB ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TEMPLATE 2 — Editorial Magazine "CONTENTS" GitHub Repository Index */}
      <div className="proj-t2">
        <div className="proj-t2__sheet">
          <div className="proj-t2__topbar">
            <span>PRAMUDITHAN · OPEN SOURCE</span>
            <span>GITHUB REPOSITORIES</span>
          </div>

          {/* Spread 1: Giant Numeral Left + Info + Preview Right */}
          {spreadOne && (
            <article className="proj-t2__spread">
              <div className="proj-t2__big-num" aria-hidden="true">
                02
              </div>
              <div>
                <div className="proj-t2__meta-top">
                  <span className="proj-t2__tag-pill">FEATURED</span>
                  <span className="proj-t2__kicker">
                    {spreadOne.language || 'Code'} · {spreadOne.license?.name || 'Open Source'}
                  </span>
                </div>
                <h3 className="proj-t2__spread-title">
                  <a href={spreadOne.html_url} target="_blank" rel="noopener noreferrer">
                    {spreadOne.name}
                  </a>
                </h3>
                <p className="proj-t2__spread-desc">{spreadOne.description}</p>
                <div className="proj-t2__repo-stats">
                  <span>★ {spreadOne.stargazers_count} Stars</span>
                  <span>⑂ {spreadOne.forks_count} Forks</span>
                  <a
                    href={spreadOne.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="proj-t2__repo-link"
                  >
                    Repo ↗
                  </a>
                  {spreadOne.homepage && (
                    <a
                      href={spreadOne.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proj-t2__repo-link"
                    >
                      Live ↗
                    </a>
                  )}
                </div>
              </div>
              <div className="proj-t2__thumb">
                <img src={getRepoPreview(spreadOne.name)} alt={spreadOne.name} loading="lazy" />
              </div>
            </article>
          )}

          {/* 4-Column Hairline Index Row */}
          {rowFour.length > 0 && (
            <div className="proj-t2__index-row proj-t2__index-row--4">
              {rowFour.map((repo, idx) => (
                <RepoIndexCell
                  key={repo.name}
                  repo={repo}
                  indexLabel={`R.${formatRepoNum(idx + 2)}`}
                />
              ))}
            </div>
          )}

          {/* Spread 2: Preview Left + Info + Giant Numeral Right */}
          {spreadTwo && (
            <article className="proj-t2__spread proj-t2__spread--reverse">
              <div className="proj-t2__thumb">
                <img src={getRepoPreview(spreadTwo.name)} alt={spreadTwo.name} loading="lazy" />
              </div>
              <div>
                <div className="proj-t2__meta-top">
                  <span className="proj-t2__tag-pill">SYSTEMS</span>
                  <span className="proj-t2__kicker">{spreadTwo.language || 'Code'}</span>
                </div>
                <h3 className="proj-t2__spread-title">
                  <a href={spreadTwo.html_url} target="_blank" rel="noopener noreferrer">
                    {spreadTwo.name}
                  </a>
                </h3>
                <p className="proj-t2__spread-desc">{spreadTwo.description}</p>
                <div className="proj-t2__repo-stats">
                  <span>★ {spreadTwo.stargazers_count} Stars</span>
                  <span>⑂ {spreadTwo.forks_count} Forks</span>
                  <a
                    href={spreadTwo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="proj-t2__repo-link"
                  >
                    Repo ↗
                  </a>
                </div>
              </div>
              <div className="proj-t2__big-num" aria-hidden="true">
                07
              </div>
            </article>
          )}

          {/* 3-Column Hairline Index Row */}
          {rowThree.length > 0 && (
            <div className="proj-t2__index-row proj-t2__index-row--3">
              {rowThree.map((repo, idx) => (
                <RepoIndexCell
                  key={repo.name}
                  repo={repo}
                  indexLabel={`R.${formatRepoNum(idx + 7)}`}
                />
              ))}
            </div>
          )}

          {/* Spread 3: Giant Numeral Left + Info + Preview Right */}
          {spreadThree && (
            <article className="proj-t2__spread">
              <div className="proj-t2__big-num" aria-hidden="true">
                11
              </div>
              <div>
                <div className="proj-t2__meta-top">
                  <span className="proj-t2__tag-pill">ARCHIVE</span>
                  <span className="proj-t2__kicker">{spreadThree.language || 'Code'}</span>
                </div>
                <h3 className="proj-t2__spread-title">
                  <a href={spreadThree.html_url} target="_blank" rel="noopener noreferrer">
                    {spreadThree.name}
                  </a>
                </h3>
                <p className="proj-t2__spread-desc">{spreadThree.description}</p>
                <div className="proj-t2__repo-stats">
                  <span>★ {spreadThree.stargazers_count} Stars</span>
                  <span>⑂ {spreadThree.forks_count} Forks</span>
                  <a
                    href={spreadThree.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="proj-t2__repo-link"
                  >
                    Repo ↗
                  </a>
                </div>
              </div>
              <div className="proj-t2__thumb">
                <img src={getRepoPreview(spreadThree.name)} alt={spreadThree.name} loading="lazy" />
              </div>
            </article>
          )}

          <div className="proj-t2__bottom-bar">
            <button
              type="button"
              className="proj-t2__more-btn"
              onClick={() => onNavigate?.('logic')}
            >
              Explore All Logic &amp; Systems ↗
            </button>

            <div className="proj-t2__page-num" aria-hidden="true">
              <span className="proj-t2__page-digit">0</span>
              <span className="proj-t2__page-digit">0</span>
              <span className="proj-t2__page-digit">3</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
