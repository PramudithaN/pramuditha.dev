import { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import type { ProjectItem, ProjectCategory, PageType, ThemeMode, PortfolioContent } from '../../types';
import { portfolioProjects } from '../../constants/projects';
import ProjectCard from './ProjectCard';
import ProjectPreviewModal from './ProjectPreviewModal';

interface ProjectShowcaseProps {
  theme: ThemeMode;
  onNavigate?: (page: PageType) => void;
  portfolioContent?: PortfolioContent;
}

const CATEGORY_FILTERS: Array<{ id: ProjectCategory; label: string; icon: string }> = [
  { id: 'all', label: 'All Projects', icon: 'mdi:apps' },
  { id: 'featured', label: 'Featured', icon: 'mdi:star-outline' },
  { id: 'ai-ml', label: 'AI & Machine Learning', icon: 'mdi:brain' },
  { id: 'dev-tools', label: 'Developer Tools & 3D', icon: 'mdi:code-braces' },
  { id: 'web-apps', label: 'Web & Systems', icon: 'mdi:web' },
  { id: 'open-source', label: 'Open Source', icon: 'mdi:git' }
];

export default function ProjectShowcase({ theme, onNavigate, portfolioContent }: ProjectShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewProject, setPreviewProject] = useState<ProjectItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Merge default projects with any custom uploaded images saved by admin
  const displayProjects = useMemo(() => {
    const customImagesMap = portfolioContent?.projectCustomImages || {};
    return portfolioProjects.map((p) => {
      const customImages = customImagesMap[p.id] || customImagesMap[p.repoName || ''];
      if (customImages && customImages.length > 0) {
        return {
          ...p,
          media: {
            ...p.media,
            heroImage: customImages[0],
            gallery: customImages
          }
        };
      }
      return p;
    });
  }, [portfolioContent?.projectCustomImages]);

  // Filter projects by category and search query
  const filteredProjects = useMemo(() => {
    return displayProjects.filter((project) => {
      // Category filter
      if (activeCategory === 'featured' && !project.featured) {
        return false;
      }
      if (
        activeCategory !== 'all' &&
        activeCategory !== 'featured' &&
        project.category !== activeCategory
      ) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = project.title.toLowerCase().includes(query);
        const matchesTagline = project.tagline.toLowerCase().includes(query);
        const matchesDesc = project.description.toLowerCase().includes(query);
        const matchesTech = project.techStack.some((t) => t.name.toLowerCase().includes(query));
        const matchesWhy = project.whyBuilt.story.toLowerCase().includes(query);
        const matchesHow = project.howItHelps.summary.toLowerCase().includes(query);

        return (
          matchesTitle ||
          matchesTagline ||
          matchesDesc ||
          matchesTech ||
          matchesWhy ||
          matchesHow
        );
      }

      return true;
    });
  }, [displayProjects, activeCategory, searchQuery]);

  const handleOpenPreview = (project: ProjectItem) => {
    setPreviewProject(project);
    setIsModalOpen(true);
  };

  const handleClosePreview = () => {
    setIsModalOpen(false);
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
  };

  return (
    <section className="portfolio-projects-showcase-section" aria-label="Projects Showcase">
      {/* Section Subheader & Controls */}
      <div className="projects-showcase-controls">
        {/* Search Bar */}
        <div className="projects-search-wrapper">
          <Icon icon="mdi:magnify" className="search-input-icon" />
          <input
            type="text"
            className="projects-search-input"
            placeholder="Search projects by tech (React, Python, 3D, FastAPI), title, or feature..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search projects"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search query"
            >
              <Icon icon="mdi:close" width="16" height="16" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="projects-category-filters" role="tablist">
          {CATEGORY_FILTERS.map((cat) => {
            const count =
              cat.id === 'all'
                ? displayProjects.length
                : cat.id === 'featured'
                ? displayProjects.filter((p) => p.featured).length
                : displayProjects.filter((p) => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`category-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <Icon icon={cat.icon} className="category-btn-icon" />
                <span>{cat.label}</span>
                <span className="category-count-pill">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Results Info Bar */}
        <div className="projects-results-telemetry">
          <span className="results-count-text">
            Showing <strong>{filteredProjects.length}</strong> of{' '}
            <strong>{displayProjects.length}</strong> engineering projects
          </span>
          {(activeCategory !== 'all' || searchQuery) && (
            <button
              type="button"
              className="results-reset-btn"
              onClick={handleResetFilters}
            >
              <Icon icon="mdi:refresh" /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Showcase Grid */}
      {filteredProjects.length > 0 ? (
        <div className="projects-showcase-grid">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpenPreview={handleOpenPreview}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ) : (
        <div className="projects-empty-state">
          <div className="empty-icon-wrap">
            <Icon icon="mdi:folder-search-outline" width="48" height="48" />
          </div>
          <h3 className="empty-state-title">No matching projects found</h3>
          <p className="empty-state-desc">
            No projects matched your search for <em>"{searchQuery}"</em> in the selected category.
          </p>
          <button
            type="button"
            className="empty-reset-action-btn"
            onClick={handleResetFilters}
          >
            Clear Search &amp; View All Projects
          </button>
        </div>
      )}

      {/* Interactive Project Preview & Inspector Modal */}
      <ProjectPreviewModal
        project={previewProject}
        isOpen={isModalOpen}
        onClose={handleClosePreview}
        onNavigate={onNavigate}
        theme={theme}
      />
    </section>
  );
}
