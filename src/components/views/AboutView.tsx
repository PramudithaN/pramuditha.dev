import { useState, useRef, useEffect, type RefObject } from 'react';
import type { PageType, ThemeMode, PortfolioContent } from '../../types';
import SubpageHeader from '../common/SubpageHeader';
import ScrollToTopButton from '../common/ScrollToTopButton';
import SocialLinks from '../common/SocialLinks';
import { useScrollTop } from '../../hooks/useScrollTop';

interface AboutViewProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onNavigate: (page: PageType) => void;
  prevPage: PageType;
  portfolioContent: PortfolioContent;
  subpageRef: RefObject<HTMLDivElement | null>;
}

export default function AboutView({
  theme,
  onToggleTheme,
  onNavigate,
  prevPage,
  portfolioContent,
  subpageRef
}: AboutViewProps) {
  const [activeExperienceIndex, setActiveExperienceIndex] = useState(0);
  const experienceSwipeStartX = useRef<number | null>(null);

  const { showScrollTop, scrollToTop } = useScrollTop('about', subpageRef);

  useEffect(() => {
    const script = document.createElement('script');
    script.setAttribute('data-name', 'BMC-Widget');
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';
    script.setAttribute('data-id', 'PramudithaN');
    script.setAttribute('data-description', 'Support me on Buy me a coffee!');
    script.setAttribute('data-message', '');
    script.setAttribute('data-color', '#e51d1d');
    script.setAttribute('data-position', 'Right');
    script.setAttribute('data-x_margin', '18');
    script.setAttribute('data-y_margin', '18');
    script.async = true;
    script.onload = function () {
      const evt = document.createEvent('Event');
      evt.initEvent('DOMContentLoaded', false, false);
      window.dispatchEvent(evt);
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      const bmcBtn = document.getElementById('bmc-wbtn');
      if (bmcBtn) {
        bmcBtn.remove();
      }
      document.querySelectorAll('iframe').forEach(iframe => {
        if (iframe.src.includes('buymeacoffee')) {
          const parent = iframe.parentElement;
          if (parent && parent.id && parent.id.includes('bmc')) {
            parent.remove();
          } else {
            iframe.remove();
          }
        }
      });
    };
  }, []);

  const visibleLogicExperience = portfolioContent.logicExperience.filter((e) => !e.hidden);
  const activeExperienceList =
    visibleLogicExperience.length > 0 ? visibleLogicExperience : portfolioContent.logicExperience;
  const activeExperience =
    activeExperienceList[activeExperienceIndex] || activeExperienceList[0] || {
      company: '',
      role: '',
      duration: '',
      title: ''
    };

  return (
    <>
      <div
        ref={subpageRef as RefObject<HTMLDivElement>}
        className={`subpage-container about-subpage ${theme}-theme`}
      >
        <div className="subpage-scroll-content">
          {/* Subpage Background Watermarks */}
          <div className="subpage-bg-watermark right-watermark">
            <span>PRAMUDITHA NADUN | ABOUT</span>
          </div>
          <div
            className="about-bg-blurred-image"
            style={{ backgroundImage: "url('/images/about/AboutSection.webp')" }}
            aria-hidden="true"
          />

          {/* Subpage Header */}
          <SubpageHeader
            theme={theme}
            onToggleTheme={onToggleTheme}
            onNavigateHome={() => onNavigate('home')}
            onBack={() => onNavigate(prevPage)}
            currentPage="about"
            onNavigate={onNavigate}
          />

          {/* Editorial hero */}
          <div className="about-hero-card">
            {/* Left Column: Index & Active Subcategory */}
            <div className="about-card-left">
              <span className="about-index-tag">/ 01</span>
              <h3 className="about-category-heading">Enterprise Systems</h3>
              <div className="about-category-underline"></div>
              <ul className="about-category-list">
                <li className="active" onClick={() => onNavigate('logic')}>
                  Full-Stack &amp; UI/UX
                </li>
                <li onClick={() => onNavigate('aesthetics')}>Cinematography &amp; VFX</li>
              </ul>
            </div>

            {/* Giant headline and bio hook */}
            <div className="about-card-right">
              <h2 className="about-card-headline">
                <span>Code</span>
                <span>Anywhere</span>
              </h2>
              <p className="about-card-desc">
                Software engineering undergraduate at the University of Westminster and Associate
                Software Engineer at LOLC Technologies, building fintech platforms while exploring
                video editing and graphic design. Discover my{' '}
                <button
                  type="button"
                  className="about-card-action"
                  onClick={() => onNavigate('logic')}
                >
                  software work <span>›</span>
                </button>
              </p>
            </div>
          </div>

          {/* Bottom Grid with 3 Separate Cards */}
          <div className="about-bottom-grid">
            {/* Card 1: Experience & Base */}
            <div
              className="about-subcard experience-subcard"
              onPointerDown={(event) => {
                experienceSwipeStartX.current = event.clientX;
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerUp={(event) => {
                const startX = experienceSwipeStartX.current;
                experienceSwipeStartX.current = null;
                if (startX === null) return;

                const distance = event.clientX - startX;
                if (Math.abs(distance) < 45) return;

                setActiveExperienceIndex((currentIndex) => {
                  const nextIndex = distance < 0 ? currentIndex + 1 : currentIndex - 1;
                  return Math.max(0, Math.min(activeExperienceList.length - 1, nextIndex));
                });
              }}
              onPointerCancel={() => {
                experienceSwipeStartX.current = null;
              }}
              aria-label="Swipe to browse work experience"
            >
              <div className="about-subcard-label">EXPERIENCE</div>
              <div className="about-subcard-entries">
                <div className="about-subcard-entry">
                  <h4 className="about-entry-title">{activeExperience.company}</h4>
                  <p className="about-entry-meta">
                    {activeExperience.role} ({activeExperience.duration})
                  </p>
                </div>
              </div>
              <div className="about-subcard-pagination">
                {activeExperienceList.map((experience, index) => (
                  <button
                    key={experience.id || index}
                    type="button"
                    className={`dot${index === activeExperienceIndex ? ' active' : ''}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveExperienceIndex(index);
                    }}
                    aria-label={`Show ${experience.title} at ${experience.company}`}
                    aria-pressed={index === activeExperienceIndex}
                  />
                ))}
              </div>
            </div>

            {/* Card 2: Background */}
            <div className="about-subcard background-subcard">
              <div className="about-subcard-label">BACKGROUND</div>
              <img
                src={theme === 'dark' ? '/images/about/light-UOW.webp' : '/images/about/UOW.webp'}
                alt="University of Westminster"
                className="about-background-image"
              />
              <div className="about-subcard-entry">
                <h4 className="about-entry-title">University of Westminster</h4>
                <p className="about-entry-meta">Undergraduate · Software Engineering</p>
                <p className="about-entry-copy">
                  Building a foundation in software engineering while developing practical fintech
                  systems and full-stack applications.
                </p>
              </div>
            </div>

            {/* Card 3: Visual Snapshot / Thumbnail */}
            <div
              className="about-subcard media-subcard"
              onClick={() => onNavigate('aesthetics')}
              title="View Aesthetics & Motion"
            >
              <div className="about-media-box">
                <img
                  src="/images/about/AboutSection.webp"
                  alt="Abstract workspace with code and visual references"
                  className="about-media-image"
                />
                <div className="about-media-info">
                  <span className="about-media-tag">02 / VISUAL REEL</span>
                  <span className="about-media-title">Aesthetics &amp; Motion</span>
                </div>
              </div>
            </div>

            {/* Card 4: Beyond The Code / Connect */}
            <div className="about-subcard">
              <div className="about-subcard-label">CONNECT</div>
              <p className="about-subcard-text">
                Currently working in fintech, with a creative practice spanning video editing,
                graphic design, and visual storytelling.
              </p>
              <SocialLinks variant="about" />
            </div>
          </div>
        </div>
      </div>

      <ScrollToTopButton visible={showScrollTop} onClick={scrollToTop} />
    </>
  );
}
