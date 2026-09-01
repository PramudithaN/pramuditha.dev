import { Icon } from '@iconify/react';
import type { GitHubRepo } from '../../types';

interface RepoCardProps {
  repo: GitHubRepo;
  index: number;
  featured?: boolean;
}

export default function RepoCard({ repo, index, featured = false }: RepoCardProps) {
  const langClass = `lang-${
    repo.language ? repo.language.toLowerCase().replace(/[^a-z0-9]/g, '') : 'default'
  }`;

  return (
    <article className={`repo-card${featured ? ' featured' : ''}`}>
      <div className="repo-scanline" aria-hidden="true"></div>
      <div className="repo-card-topline">
        <span className="repo-card-index">
          {featured ? 'FEATURED' : 'PROJECT'} / {String(index + 1).padStart(2, '0')}
        </span>
        <span className="repo-status">
          <span className="repo-status-dot"></span> {featured ? 'ACTIVE' : 'REPO'}
        </span>
      </div>
      <div className="repo-card-header">
        <h3 className="repo-name">{repo.full_name || repo.name}</h3>
        <div className="repo-stats">
          <span className="repo-stat-item">
            <Icon icon="mdi:star-outline" /> {repo.stargazers_count}
          </span>
          <span className="repo-stat-item">
            <Icon icon="mdi:source-fork" /> {repo.forks_count}
          </span>
        </div>
      </div>
      <p className="repo-desc">{repo.description}</p>
      {Boolean(repo.topics && repo.topics.length > 0) && (
        <div className="repo-tags">
          {repo.topics?.map((topic) => (
            <span key={topic} className="repo-topic-tag">
              {topic}
            </span>
          ))}
        </div>
      )}
      <div className="repo-footer">
        {repo.language && (
          <span className={`repo-lang-badge ${langClass}`}>{repo.language}</span>
        )}
        {repo.license?.key === 'mit' && (
          <span className="repo-license-badge">
            <Icon icon="mdi:scale-balance" /> MIT License
          </span>
        )}
        <span className="repo-updated">
          Updated: {new Date(repo.updated_at).toLocaleDateString()}
        </span>
      </div>
      <div className="repo-actions">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="repo-action source-action"
        >
          <Icon icon="mdi:github" /> Source <span>↗</span>
        </a>
        {repo.homepage && (
          <a
            href={repo.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="repo-action live-action"
          >
            <Icon icon="mdi:open-in-new" /> Live demo <span>↗</span>
          </a>
        )}
      </div>
    </article>
  );
}
