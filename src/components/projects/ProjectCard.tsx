import { useState } from 'react';
import { Icon } from '@iconify/react';
import type { ProjectItem, PageType } from '../../types';

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  onOpenPreview: (project: ProjectItem) => void;
  onNavigate?: (page: PageType) => void;
}

type CardTab = 'why' | 'how' | 'tech';

export default function ProjectCard({
  project,
  index,
  onOpenPreview,
  onNavigate
}: ProjectCardProps) {
  const [activeTab, setActiveTab] = useState<CardTab>('why');
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
                  <span>Demo Video Available</span>
                </span>
              )}
              {project.media.interactiveType === '3d' && (
                <span className="media-badge interactive-badge">
                  <Icon icon="mdi:cube-outline" width="14" height="14" />
                  <span>3D Real-Time Model</span>
                </span>
              )}
              {project.media.interactiveType === 'code-playground' && (
                <span className="media-badge interactive-badge">
                  <Icon icon="mdi:code-braces" width="14" height="14" />
                  <span>Interactive AST Sandbox</span>
                </span>
              )}
            </div>

            <div className="media-overlay-actions">
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="media-overlay-btn live-btn"
                  onClick={(e) => e.stopPropagation()}
                  title="Open live website in a new tab"
                >
                  <Icon icon="mdi:open-in-new" width="15" height="15" />
                  <span>Live Preview ↗</span>
                </a>
              )}
              <span className="media-overlay-btn inspect-btn">
                <Icon icon="mdi:arrow-expand-all" width="15" height="15" />
                <span>Inspect</span>
              </span>
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

      {/* Small Description */}
      <p className="project-card-description">{project.description}</p>

      {/* Interactive Tabs on the Card */}
      <div className="project-card-interactive-tabs">
        <div className="card-tabs-header" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'why'}
            className={`card-tab-btn ${activeTab === 'why' ? 'active' : ''}`}
            onClick={() => setActiveTab('why')}
          >
            <Icon icon="mdi:help-circle-outline" width="14" height="14" />
            <span>Why I Built This</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'how'}
            className={`card-tab-btn ${activeTab === 'how' ? 'active' : ''}`}
            onClick={() => setActiveTab('how')}
          >
            <Icon icon="mdi:account-star-outline" width="14" height="14" />
            <span>How It Helps Users</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'tech'}
            className={`card-tab-btn ${activeTab === 'tech' ? 'active' : ''}`}
            onClick={() => setActiveTab('tech')}
          >
            <Icon icon="mdi:code-tags" width="14" height="14" />
            <span>Tech &amp; Metrics</span>
          </button>
        </div>

        {/* Card Tab Content */}
        <div className="card-tabs-content">
          {activeTab === 'why' && (
            <div className="tab-card-body tab-why-body">
              <p className="why-story-snippet">{project.whyBuilt.story}</p>
              <div className="problem-pill">
                <span className="problem-label">Problem Solved:</span> {project.whyBuilt.problemSolved}
              </div>
            </div>
          )}

          {activeTab === 'how' && (
            <div className="tab-card-body tab-how-body">
              <p className="how-summary-snippet">{project.howItHelps.summary}</p>
              <ul className="card-benefits-list">
                {project.howItHelps.benefits.slice(0, 3).map((benefit, bIdx) => (
                  <li key={bIdx} className="card-benefit-item">
                    <Icon icon={benefit.icon || 'mdi:check-circle-outline'} className="benefit-check-icon" />
                    <div className="benefit-text-wrap">
                      <strong className="benefit-inline-title">{benefit.title}: </strong>
                      <span className="benefit-inline-desc">{benefit.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'tech' && (
            <div className="tab-card-body tab-tech-body">
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
          )}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="project-card-footer">
        <div className="project-actions-main">
          {/* Live Preview Button - Opens Website Directly in New Tab */}
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

          {/* Internal Dedicated Showcase (3D Viewer / AST Playground) */}
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

          {/* Source Code Button */}
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
        </div>
      </div>
    </article>
  );
}
