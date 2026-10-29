import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import type { ProjectItem, PageType, ThemeMode } from '../../types';
import { getEmbedUrl } from '../../services/contentStore';

interface ProjectPreviewModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: PageType) => void;
  theme: ThemeMode;
}

type ModalTab = 'overview' | 'media' | 'video' | 'live-preview';

export default function ProjectPreviewModal({
  project,
  isOpen,
  onClose,
  onNavigate,
  theme
}: ProjectPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>('overview');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Reset tab when a new project opens
  useEffect(() => {
    if (project) {
      setActiveTab('overview');
      setActiveImageIndex(0);
      setDeviceView('desktop');
    }
  }, [project]);

  // Handle ESC key to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !project) return null;

  const images = project.media.gallery && project.media.gallery.length > 0
    ? project.media.gallery
    : [project.media.heroImage];

  const videoUrl = project.media.videoDemoUrl || project.links.videoUrl;
  const embedVideoUrl = videoUrl ? getEmbedUrl(videoUrl) : null;

  const hasLiveDemo = Boolean(project.links.demo || project.links.showcasePage);

  return createPortal(
    <div
      className={`project-modal-backdrop ${theme}-theme`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div
        className="project-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="project-modal-topbar">
          <div className="modal-title-group">
            <span className="modal-category-pill">{project.categoryLabel}</span>
            <span className="modal-status-badge">
              <span className="status-indicator-dot"></span>
              {project.statusBadge}
            </span>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close project modal"
            title="Close (Esc)"
          >
            <Icon icon="mdi:close" width="20" height="20" />
          </button>
        </div>

        {/* Modal Main Header */}
        <div className="project-modal-header">
          <h2 className="project-modal-title">{project.title}</h2>
          <p className="project-modal-tagline">{project.tagline}</p>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="project-modal-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'overview'}
            className={`project-modal-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Icon icon="mdi:information-outline" />
            <span>Story &amp; Impact</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'media'}
            className={`project-modal-tab ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => setActiveTab('media')}
          >
            <Icon icon="mdi:image-multiple-outline" />
            <span>Visual Gallery ({images.length})</span>
          </button>

          {embedVideoUrl && (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'video'}
              className={`project-modal-tab video-tab ${activeTab === 'video' ? 'active' : ''}`}
              onClick={() => setActiveTab('video')}
            >
              <Icon icon="mdi:play-circle-outline" />
              <span>Demo Video</span>
            </button>
          )}

          {hasLiveDemo && (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'live-preview'}
              className={`project-modal-tab live-tab ${activeTab === 'live-preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('live-preview')}
            >
              <Icon icon="mdi:eye-outline" />
              <span>Interactive Live Preview</span>
            </button>
          )}
        </div>

        {/* Modal Body Content */}
        <div className="project-modal-body">
          {/* TAB 1: STORY & IMPACT */}
          {activeTab === 'overview' && (
            <div className="modal-tab-pane tab-overview">
              {/* Media Hero preview in overview */}
              <div className="overview-hero-preview">
                <img
                  src={project.media.heroImage}
                  alt={project.title}
                  className="overview-hero-img"
                  loading="lazy"
                />
                <div className="overview-hero-overlay">
                  <div className="overview-hero-actions">
                    {embedVideoUrl && (
                      <button
                        type="button"
                        className="hero-overlay-action-btn"
                        onClick={() => setActiveTab('video')}
                      >
                        <Icon icon="mdi:play" /> Watch Demo Video
                      </button>
                    )}
                    {images.length > 1 && (
                      <button
                        type="button"
                        className="hero-overlay-action-btn secondary"
                        onClick={() => setActiveTab('media')}
                      >
                        <Icon icon="mdi:image-search-outline" /> View {images.length} Screenshots
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="overview-section">
                <h3 className="overview-section-heading">Overview</h3>
                <p className="overview-description-text">{project.description}</p>
              </div>

              {/* What made me build it */}
              <div className="overview-section highlight-box story-box">
                <div className="overview-box-header">
                  <Icon icon="mdi:lightbulb-on-outline" className="box-icon" />
                  <h3 className="overview-section-heading">What Made Me Build It (The Story &amp; Motivation)</h3>
                </div>
                <p className="story-text">{project.whyBuilt.story}</p>
                <div className="problem-solved-badge">
                  <strong>The Core Problem Solved:</strong> {project.whyBuilt.problemSolved}
                </div>
              </div>

              {/* How it helps users */}
              <div className="overview-section highlight-box impact-box">
                <div className="overview-box-header">
                  <Icon icon="mdi:account-heart-outline" className="box-icon red" />
                  <h3 className="overview-section-heading">How It Helps Users (Key Benefits &amp; Impact)</h3>
                </div>
                <p className="impact-summary-text">{project.howItHelps.summary}</p>

                <div className="benefits-grid">
                  {project.howItHelps.benefits.map((benefit, idx) => (
                    <div key={idx} className="benefit-card">
                      <div className="benefit-icon-wrap">
                        <Icon icon={benefit.icon || 'mdi:check-circle-outline'} width="20" height="20" />
                      </div>
                      <div className="benefit-content">
                        <h4 className="benefit-title">{benefit.title}</h4>
                        <p className="benefit-desc">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack & Key Metrics */}
              <div className="overview-section">
                <h3 className="overview-section-heading">Architecture &amp; Tech Stack</h3>
                <div className="modal-tech-pills">
                  {project.techStack.map((tech) => (
                    <span key={tech.name} className="modal-tech-pill">
                      {tech.icon && <Icon icon={tech.icon} width="16" height="16" />}
                      <span>{tech.name}</span>
                    </span>
                  ))}
                </div>

                {project.metrics && project.metrics.length > 0 && (
                  <div className="modal-metrics-grid">
                    {project.metrics.map((metric, i) => (
                      <div key={i} className="modal-metric-card">
                        <span className="modal-metric-value">{metric.value}</span>
                        <span className="modal-metric-label">{metric.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: VISUAL GALLERY */}
          {activeTab === 'media' && (
            <div className="modal-tab-pane tab-gallery">
              <div className="gallery-main-viewport">
                <img
                  src={images[activeImageIndex]}
                  alt={`${project.title} screenshot ${activeImageIndex + 1}`}
                  className="gallery-active-image"
                />
                {images.length > 1 && (
                  <div className="gallery-nav-arrows">
                    <button
                      type="button"
                      className="gallery-nav-btn prev"
                      onClick={() =>
                        setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
                      }
                      aria-label="Previous screenshot"
                    >
                      <Icon icon="mdi:chevron-left" width="24" height="24" />
                    </button>
                    <button
                      type="button"
                      className="gallery-nav-btn next"
                      onClick={() =>
                        setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
                      }
                      aria-label="Next screenshot"
                    >
                      <Icon icon="mdi:chevron-right" width="24" height="24" />
                    </button>
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails Strip */}
              {images.length > 1 && (
                <div className="gallery-thumbnails-strip">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`gallery-thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                      onClick={() => setActiveImageIndex(idx)}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="gallery-thumb-img" />
                      <span className="thumb-idx">{idx + 1}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DEMO VIDEO */}
          {activeTab === 'video' && embedVideoUrl && (
            <div className="modal-tab-pane tab-video">
              <div className="video-player-container">
                <iframe
                  src={embedVideoUrl}
                  title={`${project.title} Demo Video`}
                  className="modal-video-iframe"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="video-caption-bar">
                <Icon icon="mdi:video-vintage" width="18" height="18" className="video-icon" />
                <span>Official System Demonstration Video · {project.title}</span>
              </div>
            </div>
          )}

          {/* TAB 4: INTERACTIVE LIVE PREVIEW */}
          {activeTab === 'live-preview' && (
            <div className="modal-tab-pane tab-live-preview">
              {/* Internal Showcase View Launcher for 3D and Linter */}
              {project.links.showcasePage && onNavigate ? (
                <div className="internal-showcase-launcher">
                  <div className="launcher-graphic">
                    <Icon
                      icon={
                        project.media.interactiveType === '3d'
                          ? 'mdi:cube-scan'
                          : 'mdi:code-braces-box'
                      }
                      className="launcher-icon"
                    />
                  </div>
                  <h3 className="launcher-title">
                    {project.media.interactiveType === '3d'
                      ? 'Launch Interactive 3D Companion Studio'
                      : 'Launch Real-Time AST Linter Playground'}
                  </h3>
                  <p className="launcher-desc">
                    {project.media.interactiveType === '3d'
                      ? 'Experience real-time 3D model controls, inspection, animations, and desktop release binaries directly within this portfolio.'
                      : 'Test live JavaScript/TypeScript code snippets, trigger AST heuristic diagnostics, and inspect Copilot quick-fixes in real time.'}
                  </p>
                  <button
                    type="button"
                    className="launcher-action-btn"
                    onClick={() => {
                      onClose();
                      onNavigate(project.links.showcasePage!);
                    }}
                  >
                    <Icon icon="mdi:rocket-launch-outline" />
                    <span>Launch {project.categoryLabel} Showcase</span>
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              ) : project.links.demo ? (
                <div className="simulated-browser-frame">
                  <div className="browser-topbar">
                    <div className="browser-dots">
                      <span className="dot red"></span>
                      <span className="dot yellow"></span>
                      <span className="dot green"></span>
                    </div>

                    <div className="browser-url-bar">
                      <Icon icon="mdi:lock-outline" width="13" height="13" className="url-lock" />
                      <span className="url-text">{project.links.demo}</span>
                    </div>

                    {/* Device Viewport switchers */}
                    <div className="device-switchers">
                      <button
                        type="button"
                        className={`device-btn ${deviceView === 'desktop' ? 'active' : ''}`}
                        onClick={() => setDeviceView('desktop')}
                        title="Desktop view (100%)"
                      >
                        <Icon icon="mdi:monitor" width="16" height="16" />
                      </button>
                      <button
                        type="button"
                        className={`device-btn ${deviceView === 'tablet' ? 'active' : ''}`}
                        onClick={() => setDeviceView('tablet')}
                        title="Tablet view (768px)"
                      >
                        <Icon icon="mdi:tablet" width="16" height="16" />
                      </button>
                      <button
                        type="button"
                        className={`device-btn ${deviceView === 'mobile' ? 'active' : ''}`}
                        onClick={() => setDeviceView('mobile')}
                        title="Mobile view (375px)"
                      >
                        <Icon icon="mdi:cellphone" width="16" height="16" />
                      </button>
                    </div>
                  </div>

                  <div className={`browser-viewport-wrapper view-${deviceView}`}>
                    <iframe
                      src={project.links.demo}
                      title={`${project.title} Live Preview`}
                      className="browser-iframe"
                      sandbox="allow-scripts allow-same-origin allow-forms"
                    />
                  </div>
                </div>
              ) : (
                <div className="live-preview-empty">
                  <Icon icon="mdi:earth" width="36" height="36" />
                  <p>External live demo URL available on the source repository.</p>
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-action-btn source"
                  >
                    <Icon icon="mdi:github" /> Open GitHub Repository ↗
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Actions Bar */}
        <div className="project-modal-footer">
          <div className="footer-links-group">
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-action-btn source"
            >
              <Icon icon="mdi:github" width="18" height="18" />
              <span>Source Code</span>
              <span className="btn-arrow">↗</span>
            </a>

            {project.links.showcasePage && onNavigate && (
              <button
                type="button"
                className="modal-action-btn showcase"
                onClick={() => {
                  onClose();
                  onNavigate(project.links.showcasePage!);
                }}
              >
                <Icon icon="mdi:sparkles" width="18" height="18" />
                <span>Dedicated Showcase</span>
                <span className="btn-arrow">→</span>
              </button>
            )}

            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-action-btn demo"
              >
                <Icon icon="mdi:open-in-new" width="18" height="18" />
                <span>Live Demo / Release</span>
                <span className="btn-arrow">↗</span>
              </a>
            )}
          </div>

          <button
            type="button"
            className="modal-close-action-btn"
            onClick={onClose}
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
