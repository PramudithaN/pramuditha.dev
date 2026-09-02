import type { RefObject } from 'react';
import { Icon } from '@iconify/react';
import { Palette, Mountain, Clapperboard } from 'lucide-react';
import type { PageType, ThemeMode, PortfolioContent } from '../../types';
import SubpageHeader from '../common/SubpageHeader';
import SubpageQuickNav from '../common/SubpageQuickNav';
import ScrollToTopButton from '../common/ScrollToTopButton';
import TestimonialCard from '../common/TestimonialCard';
import RepoCard from '../common/RepoCard';
import TimelineItem from '../common/TimelineItem';
import GitHubContributionGraph from '../common/GitHubContributionGraph';
import { skillsList } from '../../constants/skills';
import { beyondCodeData } from '../../constants/beyondCode';
import { EXTERNAL_LINKS } from '../../constants/links';
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
    contributedRepos,
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
          {/* Subpage Background Watermarks & Ambient Code Stream */}
          <div className="subpage-bg-watermark right-watermark">
            <span>PRAMUDITH NADUN | DEVELOPER</span>
          </div>

          <div className="logic-bg-code-watermark" aria-hidden="true">
            <div className="code-column left-code">
              <pre>
{`01  import { State, Engine, Architecture } from '@pramuditha/core';
02  import { DistributedLedger, Consensus } from '@fintech/systems';
03  
04  interface SystemConfig<T> {
05    clusterId: string;
06    nodes: Array<Node<T>>;
07    throughput: RateLimit;
08    latencyTargetMs: number;
09    faultTolerance: 'Byzantine' | 'Raft';
10  }
11  
12  export class FintechPipeline<T extends Transaction> implements Pipeline {
13    private readonly queue: AsyncQueue<T>;
14    private readonly metrics: TelemetryCollector;
15  
16    constructor(private readonly config: SystemConfig<T>) {
17      this.queue = new AsyncQueue({ concurrency: 64 });
18      this.metrics = new TelemetryCollector('fintech-core');
19    }
20  
21    public async processBatch(batch: T[]): Promise<ExecutionReport> {
22      const trace = this.metrics.startSpan('processBatch');
23      return await this.queue.map(batch, async (tx) => {
24        const verified = await Consensus.verifySignature(tx.payload);
25        if (!verified) throw new InvalidSignatureError(tx.id);
26        return await this.persistState(tx);
27      });
28    }
29  
30    private async persistState(tx: T): Promise<CommitResult> {
31      return DistributedLedger.atomicCommit(tx.stateHash);
32    }
33  }`}
              </pre>
            </div>
            <div className="code-column right-code">
              <pre>
{`34  // Reactive State & Neural Core Pipeline
35  const renderLoop = (timestamp: DOMHighResTimeStamp) => {
36    const deltaTime = Math.min((timestamp - lastFrame) / 1000, 0.1);
37    gl.uniform1f(uTimeLocation, timestamp * 0.001);
38    gl.uniform2f(uResolutionLocation, canvas.width, canvas.height);
39    
40    simulation.step(deltaTime);
41    particles.updateBuffers(simulation.getPositions());
42    
43    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, particleCount);
44    requestAnimationFrame(renderLoop);
45  };
46  
47  export const useKernelStream = <T,>(stream: Observable<T>) => {
48    const [buffer, setBuffer] = useState<T[]>([]);
49    useEffect(() => {
50      const sub = stream.pipe(debounceTime(16)).subscribe((chunk) => {
51        setBuffer((prev) => [...prev.slice(-128), chunk]);
52      });
53      return () => sub.unsubscribe();
54    }, [stream]);
55    return buffer;
56  };`}
              </pre>
            </div>
          </div>

          {/* Subpage Header */}
          <SubpageHeader
            theme={theme}
            onToggleTheme={onToggleTheme}
            onNavigateHome={() => onNavigate('home')}
            onBack={() => onNavigate('home')}
            currentPage="logic"
            onNavigate={onNavigate}
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
                href={EXTERNAL_LINKS.INTERACTIVE_CV}
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

          {/* GitHub Commit & Activity Graph */}
          <div className="section-divider" />
          <h2 className="section-title">GitHub Activity</h2>
          <p className="skills-subtitle">Open-source contributions and commit frequency:</p>
          <GitHubContributionGraph theme={theme} />

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
          <h2 className="section-title">Open Source Contributions</h2>
          {loadingRepos ? (
            <div className="repos-loading">Loading contributions...</div>
          ) : (
            <div className="repos-grid">
              {contributedRepos.map((repo, index) => (
                <RepoCard key={repo.name} repo={repo} index={index} />
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

          {/* Quick Navigation to Other Sections */}
          <SubpageQuickNav currentPage="logic" onNavigate={onNavigate} theme={theme} />
        </div>
      </div>

      <ScrollToTopButton visible={showScrollTop} onClick={scrollToTop} />
    </>
  );
}
