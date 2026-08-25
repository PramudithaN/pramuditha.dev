import type { RefObject } from 'react';
import { Icon } from '@iconify/react';
import { Palette, Mountain, Clapperboard } from 'lucide-react';
import type { PageType, ThemeMode, PortfolioContent } from '../../types';
import SubpageHeader from '../common/SubpageHeader';
import ScrollToTopButton from '../common/ScrollToTopButton';
import TestimonialCard from '../common/TestimonialCard';
import RepoCard from '../common/RepoCard';
import TimelineItem from '../common/TimelineItem';
import { skillsList } from '../../constants/skills';
import { beyondCodeData } from '../../constants/beyondCode';
import { useGitHubRepos } from '../../hooks/useGitHubRepos';
import { useScrollTop } from '../../hooks/useScrollTop';

interface LogicViewProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onNavigate: (page: PageType) => void;
  portfolioContent: PortfolioContent;
  subpageRef: RefObject<HTMLDivElement | null>;
}

export default function LogicView({
  theme,
  onToggleTheme,
  onNavigate,
  portfolioContent,
  subpageRef
}: LogicViewProps) {
  const devStartYear = 2022;
  const experienceYears = Math.max(1, new Date().getFullYear() - devStartYear);

  const { showScrollTop, scrollToTop } = useScrollTop('logic', subpageRef);

  const {
    featuredRepos,
    otherRepos,
    displayedOtherRepos,
    loadingRepos,
    reposError,
    otherReposExpanded,
    toggleOtherReposExpanded
  } = useGitHubRepos();

  const visibleLogicExperience = portfolioContent.logicExperience.filter((e) => !e.hidden);

  const renderBeyondIcon = (iconName: string) => {
    switch (iconName) {
      case 'palette':
        return <Palette className="beyond-icon" />;
      case 'mountain':
        return <Mountain className="beyond-icon" />;
      case 'clapperboard':
        return <Clapperboard className="beyond-icon" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div
        ref={subpageRef as RefObject<HTMLDivElement>}
        className={`subpage-container logic-subpage ${theme}-theme`}
      >
        <div className="subpage-scroll-content">
          {/* Subpage Background Watermarks */}
          <div className="subpage-bg-watermark right-watermark">
            <span>PRAMUDITH NADUN | DEVELOPER</span>
          </div>

          {/* Subpage Header */}
          <SubpageHeader
            theme={theme}
            onToggleTheme={onToggleTheme}
            onNavigateHome={() => onNavigate('home')}
            onBack={() => onNavigate('home')}
          />

          {/* Subpage Intro */}
          <h1 className="subpage-title">Logic &amp; Systems</h1>
          <p className="subpage-subtitle">Systems Architecture &amp; Interactive Code</p>

          {/* Dynamic Experience & Interactive CV Card */}
          <div className="logic-experience-card">
            <div className="logic-card-topbar">
              <div className="logic-exp-pill">
                <span className="badge-pulse-dot"></span>
                <span>{experienceYears}+ Years Exp · Web Dev</span>
              </div>
              <a
                href="https://pramudithan.github.io/pramuditha_cv/"
                target="_blank"
                rel="noopener noreferrer"
                className="logic-cv-pill-btn"
                title="Open Pramuditha's Interactive CV"
              >
                <Icon icon="mdi:file-document-outline" width="15" height="15" />
                <span>Interactive CV</span>
                <span className="cv-arrow">↗</span>
              </a>
            </div>

            <h3 className="logic-card-headline">Full-Stack &amp; Enterprise Systems</h3>

            <p className="logic-card-desc">
              {experienceYears}+ years of web development experience architecting scalable
              enterprise platforms, interactive frontend architectures, and high-performance
              full-stack applications.
            </p>

            <div className="logic-card-tags">
              <span className="logic-stat-tag">React / Next.js</span>
              <span className="logic-stat-tag">TypeScript</span>
              <span className="logic-stat-tag">Spring Boot</span>
              <span className="logic-stat-tag">CI/CD Deployments</span>
            </div>
          </div>

          {/* Work Grid */}
          <div className="work-grid">
            <div className="work-card">
              <div>
                <div className="work-item-meta">01 / ASSOCIATE SOFTWARE ENGINEER</div>
                <h3 className="work-item-title">Enterprise Web Apps</h3>
                <p className="work-item-desc">
                  Architecting and optimizing modern web platforms with React, TypeScript, and
                  Redux, managing CI/CD deployments and user access control at LOLC Technologies.
                </p>
              </div>
              <span className="work-item-tag">React / Redux</span>
            </div>

            <div className="work-card">
              <div>
                <div className="work-item-meta">02 / TRAINEE SOFTWARE ENGINEER</div>
                <h3 className="work-item-title">UI/UX &amp; Systems</h3>
                <p className="work-item-desc">
                  Designing interactive frontend components in Figma and building database reporting
                  features with Java, Oracle Forms, and Jasper Reports.
                </p>
              </div>
              <span className="work-item-tag">Figma / Java</span>
            </div>

            <div className="work-card">
              <div>
                <div className="work-item-meta">03 / FREELANCE DEVELOPMENT</div>
                <h3 className="work-item-title">Fullstack Solutions</h3>
                <p className="work-item-desc">
                  Delivering high-performance, custom mobile-first applications using React,
                  Next.js, Node.js, and Spring Boot for diverse global clients.
                </p>
              </div>
              <span className="work-item-tag">Next.js / Spring Boot</span>
            </div>
          </div>

          {/* Skills & Technologies Data */}
          <div className="section-divider" />
          <div className="skills-badge-header-wrapper">
            <span className="skills-badge-header">Skills</span>
          </div>
          <p className="skills-subtitle">The skills, tools and technologies I am really good at:</p>
          <div className="skills-gallery">
            {skillsList.map((skill) => (
              <div key={skill.text} className="skills-gallery-item">
                <Icon icon={skill.logo} className="skills-gallery-icon" />
                <span className="skills-gallery-text">{skill.text}</span>
              </div>
            ))}
          </div>

          {/* Experience Tree (Timeline Style) */}
          <div className="section-divider" />
          <div className="journey-header-block">
            <h2 className="section-title">Developer Journey</h2>
            <p className="journey-subtitle">
              {experienceYears}+ Years of Full-Stack Web Development &amp; Systems Engineering
            </p>
          </div>
          <div className="timeline-container">
            {visibleLogicExperience.map((exp, index) => (
              <TimelineItem
                key={exp.id || index}
                duration={exp.duration}
                title={exp.title}
                company={exp.company}
                role={exp.role}
                accomplishments={exp.accomplishments}
                tech={exp.tech}
              />
            ))}
          </div>

          {/* GitHub Projects Integration */}
          <div className="section-divider" />
          <h2 className="section-title">Featured Projects</h2>
          {reposError && (
            <div className="repos-fallback-notice">
              Note: GitHub API limit reached. Showing offline cached projects.
            </div>
          )}
          {loadingRepos ? (
            <div className="repos-loading">Loading featured projects...</div>
          ) : (
            <div className="repos-grid">
              {featuredRepos.map((repo, index) => (
                <RepoCard key={repo.name} repo={repo} index={index} featured />
              ))}
            </div>
          )}

          <div className="section-divider" />
          <h2 className="section-title">Projects</h2>

          {loadingRepos ? (
            <div className="repos-loading">Loading projects...</div>
          ) : (
            <>
              <div className="repos-grid">
                {displayedOtherRepos.map((repo, index) => (
                  <RepoCard key={repo.name} repo={repo} index={index} />
                ))}
              </div>

              {otherRepos.length > 4 && (
                <div className="load-more-container">
                  <button
                    type="button"
                    className="projects-load-more-btn"
                    onClick={toggleOtherReposExpanded}
                  >
                    {otherReposExpanded
                      ? 'Show Less Projects'
                      : `View All Projects (${otherRepos.length})`}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Beyond the Code Section */}
          <div className="section-divider" />
          <h2 className="section-title">Beyond the Code</h2>
          <div className="beyond-grid">
            {beyondCodeData.map((item, index) => {
              const isClickable = Boolean(item.link);
              return (
                <div
                  key={index}
                  className={`beyond-card${isClickable ? ' interactive' : ''}`}
                  onClick={isClickable && item.link ? () => onNavigate(item.link!) : undefined}
                  role={isClickable ? 'button' : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  onKeyDown={
                    isClickable && item.link
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            onNavigate(item.link!);
                          }
                        }
                      : undefined
                  }
                  title={isClickable ? 'View in Aesthetics & Motion' : undefined}
                >
                  <div className="beyond-card-header">
                    {renderBeyondIcon(item.icon)}
                    <h3 className="beyond-card-title">{item.title}</h3>
                    {isClickable && <span className="beyond-card-arrow">↗</span>}
                  </div>
                  <p className="beyond-card-desc">{item.description}</p>
                </div>
              );
            })}
          </div>

          {/* Testimonials Section */}
          <div className="section-divider" />
          <h2 className="section-title">Testimonials</h2>
          <div className="testimonials-grid">
            {portfolioContent.logicTestimonials.map((t, index) => (
              <TestimonialCard
                key={t.id || index}
                name={t.name}
                role={t.role}
                avatarUrl={t.avatarUrl}
                text={t.text}
              />
            ))}
          </div>
        </div>
      </div>

      <ScrollToTopButton visible={showScrollTop} onClick={scrollToTop} />
    </>
  );
}
