import type { RefObject } from 'react';
import { Icon } from '@iconify/react';
import type { PageType, ThemeMode, PortfolioContent } from '../../types';
import SubpageHeader from '../common/SubpageHeader';
import SubpageQuickNav from '../common/SubpageQuickNav';
import ScrollToTopButton from '../common/ScrollToTopButton';
import { ProjectsShowcase } from '../projects';
import { skillsList } from '../../constants/skills';
import { EXTERNAL_LINKS } from '../../constants/links';
import { useScrollTop } from '../../hooks/useScrollTop';
import '../../styles/logic-terminal.css';

interface LogicViewProps {
  theme: ThemeMode;
  onToggleTheme: (event?: React.MouseEvent<HTMLElement> | MouseEvent | { clientX?: number; clientY?: number }) => void;
  onNavigate: (page: PageType) => void;
  portfolioContent: PortfolioContent;
  subpageRef: RefObject<HTMLDivElement | null>;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Dec'] as const;

/**
 * Deterministic 5x4 activity levels (0..4) per month recreating the glowing green matrix.
 */
function getMonthCells(monthIdx: number): readonly number[] {
  const isTrailing = monthIdx === 10; // Dec muted/upcoming
  return Array.from({ length: 20 }, (_, i) => {
    if (isTrailing) return 0;
    const hash = (monthIdx * 31 + i * 17 + (i % 5) * 13) % 11;
    if (hash <= 1) return 1;
    if (hash <= 4) return 2;
    if (hash <= 8) return 3;
    return 4;
  });
}

export default function LogicView({
  theme,
  onToggleTheme,
  onNavigate,
  portfolioContent,
  subpageRef,
}: LogicViewProps) {
  const { showScrollTop, scrollToTop } = useScrollTop('logic', subpageRef);

  const visibleLogicExperience = portfolioContent.logicExperience.filter((e) => !e.hidden);
  const visibleLogicTestimonials = portfolioContent.logicTestimonials.filter((t) => !t.hidden);

  const scrollToProjects = () => {
    const el = document.getElementById('logic-projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div
        ref={subpageRef as RefObject<HTMLDivElement>}
        className={`subpage-container logic-terminal ${theme}-theme`}
      >
        <div className="subpage-scroll-content">
          <SubpageHeader
            onNavigate={onNavigate}
            theme={theme}
            onToggleTheme={onToggleTheme}
            breadcrumbText="Logic & Systems"
          />

          <SubpageQuickNav currentPage="logic" onNavigate={onNavigate} />

          <div className="logic-terminal__wrap">
            {/* 1. Terminal Hero */}
            <section className="logic-terminal__hero" aria-label="Logic & Systems Hero">
              {/* Crisp Line-Art Developer Emblem */}
              <svg
                className="logic-terminal__avatar"
                viewBox="0 0 64 64"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="32" cy="30" r="18" stroke="currentColor" strokeWidth="2.4" fill="#141614" />
                <path
                  d="M17 24C21 14 43 14 47 24"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <rect x="21" y="26" width="8" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                <rect x="35" y="26" width="8" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                <line x1="29" y1="28.5" x2="35" y2="28.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="M27 38Q32 41 37 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>

              <h1 className="logic-terminal__title-row">
                <span>logic_systems</span>
                <span className="logic-terminal__cursor" aria-hidden="true" />
              </h1>

              <p className="logic-terminal__lead">
                Software Engineer · LOLC Fusion X.
                <br />
                Clean architecture. It works.
              </p>

              <p className="logic-terminal__comment">
                // Full-stack engineer building React, TypeScript, Spring Boot &amp; CI/CD systems — plus open-source developer tools.
              </p>

              <div className="logic-terminal__actions">
                <a
                  href={EXTERNAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="logic-terminal__btn logic-terminal__btn--solid"
                >
                  [ view on github ]
                </a>
                <button
                  type="button"
                  onClick={scrollToProjects}
                  className="logic-terminal__btn logic-terminal__btn--outline"
                >
                  [ projects ↓ ]
                </button>
              </div>
            </section>

            {/* 2. Quote + Glowing Green 12-Month Contribution Matrix */}
            <section className="logic-terminal__matrix-section" aria-label="Engineering Consistency">
              <h2 className="logic-terminal__quote-title">
                Do things that make time disappear,
              </h2>
              <p className="logic-terminal__quote-sub">
                If you forget your surroundings while doing it, that&apos;s probably what your soul actually craves.
              </p>

              <div className="logic-terminal__months-scroll">
                <div className="logic-terminal__months">
                  {MONTHS.map((month, mIdx) => (
                    <div key={month} className="logic-terminal__month">
                      <span className="logic-terminal__month-label">{month}</span>
                      <div className="logic-terminal__month-grid" aria-hidden="true">
                        {getMonthCells(mIdx).map((lvl, cIdx) => (
                          <span
                            key={cIdx}
                            className={`logic-terminal__cell ${
                              lvl > 0 ? `logic-terminal__cell--${lvl}` : ''
                            }`}
                          />
                        ))}
                      </div>
                      <span className="logic-terminal__month-label">{month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 3. Projects Showcase */}
            <section id="logic-projects" aria-label="Engineering Projects">
              <div className="logic-terminal__section-head">
                <h2 className="logic-terminal__section-kicker">// 01 · PROJECTS</h2>
                <span className="logic-terminal__section-meta">github.com/PramudithaN</span>
              </div>
              <ProjectsShowcase onNavigate={onNavigate} />
            </section>

            {/* 4. Experience */}
            <section aria-label="Software Engineering Experience">
              <div className="logic-terminal__section-head">
                <h2 className="logic-terminal__section-kicker">// 02 · EXPERIENCE</h2>
                <span className="logic-terminal__section-meta">LOLC Technologies · Fusion X</span>
              </div>

              <div className="logic-terminal__exp-list">
                {visibleLogicExperience.map((exp) => (
                  <article key={exp.id} className="logic-terminal__exp-card">
                    <div className="logic-terminal__exp-top">
                      <h3 className="logic-terminal__exp-role">{exp.title}</h3>
                      <span className="logic-terminal__exp-duration">{exp.duration}</span>
                    </div>
                    <p className="logic-terminal__exp-company">
                      {exp.company} · {exp.role}
                    </p>
                    <ul className="logic-terminal__exp-bullets">
                      {exp.accomplishments.slice(0, 4).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    {exp.tech && exp.tech.length > 0 && (
                      <div className="logic-terminal__tech-row">
                        {exp.tech.map((t) => (
                          <span key={t} className="logic-terminal__tech-tag">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>

            {/* 5. Technical Stack */}
            <section aria-label="Technical Stack">
              <div className="logic-terminal__section-head">
                <h2 className="logic-terminal__section-kicker">// 03 · STACK</h2>
                <span className="logic-terminal__section-meta">{skillsList.length} technologies</span>
              </div>

              <div className="logic-terminal__skills-grid">
                {skillsList.map((skill) => (
                  <span key={skill.name} className="logic-terminal__skill-pill">
                    <Icon icon={skill.icon} width={16} height={16} />
                    <span>{skill.name}</span>
                  </span>
                ))}
              </div>
            </section>

            {/* 6. Peer Notes */}
            {visibleLogicTestimonials.length > 0 && (
              <section aria-label="Peer Endorsements">
                <div className="logic-terminal__section-head">
                  <h2 className="logic-terminal__section-kicker">// 04 · PEER NOTES</h2>
                  <span className="logic-terminal__section-meta">collaboration</span>
                </div>

                <div className="logic-terminal__notes-grid">
                  {visibleLogicTestimonials.map((t) => (
                    <article key={t.id} className="logic-terminal__note-card">
                      <p className="logic-terminal__note-text">
                        &ldquo;{t.text.split('\n')[0]}&rdquo;
                      </p>
                      <div className="logic-terminal__note-author">
                        {t.name}
                        <span className="logic-terminal__note-role">{t.role}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>

          <ScrollToTopButton visible={showScrollTop} onClick={scrollToTop} />
        </div>
      </div>
    </>
  );
}
