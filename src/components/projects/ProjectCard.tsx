import { useState } from 'react';
import { Icon } from '@iconify/react';
import type { ProjectItem, PageType } from '../../types';

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  onOpenPreview: (project: ProjectItem) => void;
  onNavigate?: (page: PageType) => void;
}

export default function ProjectCard({
  project,
  index,
  onOpenPreview,
  onNavigate
}: ProjectCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images =
    project.media.gallery && project.media.gallery.length > 0
      ? project.media.gallery
      : [project.media.heroImage];

  const activeImage = images[currentImageIndex] || project.media.heroImage;
  const hasMultipleImages = images.length > 1;
  const hasVideo = Boolean(project.media.videoDemoUrl || project.links.videoUrl);

  return (
    <article className={`portfolio-project-card ${project.featured ? 'is-featured' : ''}`}>
      {/* Decorative Cyber Scanline */}
      <div className="project-card-scanline" aria-hidden="true"></div>

      {/* Card Header Telemetry */}
      <div className="project-card-topbar">
        <div className="card-topbar-left">
          <span className="project-card-index">
            {project.featured ? 'FEATURED' : 'PROJECT'} // {String(index + 1).padStart(2, '0')}
          </span>
          <span className="project-category-tag">{project.categoryLabel}</span>
        </div>

        <div className="card-topbar-right">
          <span className="project-status-pill">
            <span className="status-pulse-dot" aria-hidden="true"></span>
            {project.statusBadge}
          </span>
        </div>
      </div>

      {/* Visual Media Showcase & Interactive Gallery */}
      <div className="project-card-media-wrapper">
        <div
          className="project-card-media-hero"
          onClick={() => onOpenPreview(project)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onOpenPreview(project);
            }
          }}
          title="Click to inspect project details, gallery, and live preview"
        >
          <img
            src={activeImage}
            alt={project.title}
            className="project-hero-image"
            loading="lazy"
          />

          {/* Gradient Overlay & Badges */}
          <div className="media-hero-overlay">
            <div className="media-overlay-badges">
              {hasVideo && (
                <span className="media-badge video-badge">
                  <Icon icon="mdi:play-circle" width="14" height="14" />
                  <span>Demo Video</span>
                </span>
              )}
              {project.media.interactiveType === '3d' && (
                <span className="media-badge interactive-badge">
                  <Icon icon="mdi:cube-outline" width="14" height="14" />
                  <span>3D Interactive</span>
                </span>
              )}
              {project.media.interactiveType === 'code-playground' && (
                <span className="media-badge interactive-badge">
                  <Icon icon="mdi:code-braces" width="14" height="14" />
                  <span>AST Sandbox</span>
                </span>
              )}
            </div>

            {/* Subtle Hover Affordance */}
            <div className="media-hover-indicator">
              <Icon icon="mdi:arrow-expand-all" width="15" height="15" />
              <span>Inspect Details</span>
            </div>
          </div>
        </div>

        {/* Thumbnail switcher strip on the card */}
        {hasMultipleImages && (
          <div className="project-card-thumbnails">
            {images.map((img, imgIdx) => (
              <button
                key={imgIdx}
                type="button"
                className={`card-thumb-btn ${currentImageIndex === imgIdx ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(imgIdx)}
                title={`View preview image ${imgIdx + 1}`}
              >
                <img src={img} alt={`Preview ${imgIdx + 1}`} className="card-thumb-img" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Project Identity */}
      <div className="project-card-heading-group">
        <h3 className="project-card-title">{project.title}</h3>
        <p className="project-card-tagline">{project.tagline}</p>
      </div>

      {/* Project Description */}
      <p className="project-card-description">{project.description}</p>

      {/* Concise Outcome / Problem Solved Callout */}
      {project.whyBuilt?.problemSolved && (
        <div className="project-card-highlight">
          <Icon icon="mdi:check-decagram-outline" className="highlight-icon" />
          <div className="highlight-content">
            <span className="highlight-label">Outcome</span>
            <span className="highlight-text">{project.whyBuilt.problemSolved}</span>
          </div>
        </div>
      )}

      {/* Tech Stack Pills & Metrics Row */}
      <div className="project-card-meta-row">
        <div className="card-tech-pills">
          {project.techStack.map((tech) => (
            <span key={tech.name} className="card-tech-tag">
              {tech.icon && <Icon icon={tech.icon} width="13" height="13" />}
              <span>{tech.name}</span>
            </span>
          ))}
        </div>

        {project.metrics && project.metrics.length > 0 && (
          <div className="card-metrics-strip">
            {project.metrics.map((metric, mIdx) => (
              <div key={mIdx} className="card-metric-badge">
                <span className="metric-val">{metric.value}</span>
                <span className="metric-lbl">{metric.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div className="project-card-footer">
        <div className="project-actions-group">
          {/* Live Preview Button */}
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-btn live-preview-btn"
              title="Open live website in a new tab"
            >
              <Icon icon="mdi:open-in-new" width="16" height="16" />
              <span>Live Preview</span>
              <span className="btn-arrow">↗</span>
            </a>
          )}

          {/* Internal Dedicated Showcase */}
          {project.links.showcasePage && onNavigate && (
            <button
              type="button"
              className="project-btn showcase-btn"
              onClick={() => onNavigate(project.links.showcasePage!)}
              title={`Open ${project.categoryLabel} dedicated interactive showcase`}
            >
              <Icon icon="mdi:sparkles" width="16" height="16" />
              <span>Showcase</span>
              <span className="btn-arrow">→</span>
            </button>
          )}

          {/* Inspect / Deep Dive Modal Trigger */}
          <button
            type="button"
            className="project-btn inspect-btn"
            onClick={() => onOpenPreview(project)}
            title="Inspect project details, story, gallery, and video"
          >
            <Icon icon="mdi:eye-outline" width="16" height="16" />
            <span>Inspect Project</span>
          </button>
        </div>

        {/* Source Code Button */}
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="project-btn source-btn"
            title="View source code on GitHub"
          >
            <Icon icon="mdi:github" width="16" height="16" />
            <span>Source Code</span>
            <span className="btn-arrow">↗</span>
          </a>
        )}
      </div>
    </article>
  );
}
