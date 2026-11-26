import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useGitHubRepos } from '../../hooks/useGitHubRepos';
import type { GitHubRepo, PageType, ThemeMode } from '../../types';
import AllProjectsModal, { type AllProjectsRepoEntry } from './AllProjectsModal';
import './projects-editorial.css';

export interface ProjectsEditorialSectionProps {
  theme: ThemeMode;
  onNavigate?: (page: PageType) => void;
}

function getAllUniqueRepos(
  featured: GitHubRepo[],
  contributed: GitHubRepo[],
  other: GitHubRepo[]
): AllProjectsRepoEntry[] {
  const contributedNames = new Set(contributed.map((c) => c.name));
  const seen = new Set<string>();
  const unique: AllProjectsRepoEntry[] = [];

  for (const repo of [...featured, ...contributed, ...other]) {
    if (!seen.has(repo.name)) {
      seen.add(repo.name);
      const isContribution =
        contributedNames.has(repo.name) ||
        Boolean(repo.fork) ||
        (Boolean(repo.full_name) && !repo.full_name?.startsWith('PramudithaN/'));
      unique.push({ ...repo, isContribution });
    }
  }

  return unique.sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

export default function ProjectsEditorialSection({
  theme,
}: ProjectsEditorialSectionProps) {
  const { featuredRepos, otherRepos, contributedRepos } = useGitHubRepos();
  const [isAllProjectsOpen, setIsAllProjectsOpen] = useState(false);

  const allRepos = useMemo(
    () => getAllUniqueRepos(featuredRepos, contributedRepos, otherRepos),
    [featuredRepos, contributedRepos, otherRepos]
  );

  const openFolder = () => setIsAllProjectsOpen(true);

  return (
    <section
      id="projects"
      className="proj-folder-section"
      data-theme={theme}
      aria-label="Projects Folder"
    >
      <div className="proj-folder-stage">
        <div className="proj-folder-card">
          {/* Single Frosted Glass Projects Folder (Zero Images) */}
          <button
            type="button"
            className="proj-folder proj-folder--button"
            onClick={openFolder}
            aria-label="Open Projects folder"
            title="Open Projects"
          >
            <div className="proj-folder__back" aria-hidden="true" />

            <div className="proj-folder__sheets" aria-hidden="true">
              <div className="proj-folder__sheet proj-folder__sheet--1">
                <span className="proj-folder__line proj-folder__line--lg" />
                <span className="proj-folder__line proj-folder__line--md" />
                <span className="proj-folder__line proj-folder__line--lg" />
              </div>
              <div className="proj-folder__sheet proj-folder__sheet--2">
                <span className="proj-folder__line proj-folder__line--md" />
                <span className="proj-folder__line proj-folder__line--sm" />
              </div>
              <div className="proj-folder__sheet proj-folder__sheet--3">
                <span className="proj-folder__line proj-folder__line--sm" />
                <span className="proj-folder__line proj-folder__line--md" />
              </div>
            </div>

            <div className="proj-folder__front" aria-hidden="true">
              <span className="proj-folder__tab" />
            </div>
          </button>

          <h2 className="proj-folder-stage__title">PROJECTS</h2>

          <p className="proj-folder-stage__desc">
            Open-source repositories, developer tooling &amp; contributions synced
            from GitHub. Click the folder to explore every build.
          </p>
        </div>
      </div>

      {/* Bottom Corner Index & Open Arrow */}
      <footer className="proj-folder-footer">
        <span className="proj-folder-footer__index">
          {String(allRepos.length).padStart(2, '0')}
        </span>

        <button
          type="button"
          className="proj-folder-footer__arrow"
          onClick={openFolder}
          aria-label="Open all projects"
          title="Open Projects"
        >
          <ArrowRight size={22} strokeWidth={2.3} />
        </button>
      </footer>

      <AllProjectsModal
        isOpen={isAllProjectsOpen}
        repos={allRepos}
        initialIndex={0}
        onClose={() => setIsAllProjectsOpen(false)}
      />
    </section>
  );
}
