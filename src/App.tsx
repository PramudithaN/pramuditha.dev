import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { Palette, Mountain, Clapperboard } from 'lucide-react'
import VideoShowcase from './components/VideoShowcase'
import AdminPanel from './components/AdminPanel'
import { getStoredContent, type PortfolioContent } from './services/contentStore'
import { Analytics } from '@vercel/analytics/react'
import './index.css'

const skillsList = [
  { text: "HTML", logo: "mdi:language-html5" },
  { text: "CSS", logo: "mdi:language-css3" },
  { text: "JavaScript", logo: "mdi:language-javascript" },
  { text: "TypeScript", logo: "mdi:language-typescript" },
  { text: "Python", logo: "mdi:language-python" },
  { text: "Java", logo: "mdi:language-java" },
  { text: "React", logo: "mdi:react" },
  { text: "Node.js", logo: "mdi:nodejs" },
  { text: "Astro", logo: "simple-icons:astro" },
  { text: "Tailwind CSS", logo: "simple-icons:tailwindcss" },
  { text: "Figma", logo: "simple-icons:figma" },
  { text: "Git", logo: "mdi:git" }
]

const beyondCodeData = [
  {
    title: "Graphic Designer",
    description: "Crafting visually engaging layouts, digital art, and layouts. I love blending aesthetic beauty with clear functionality to tell stories visually.",
    icon: "palette",
    link: "aesthetics"
  },
  {
    title: "Avid Hiker",
    description: "Trekking through mountains, exploring scenic wilderness trails, and connecting with nature. Hiking feeds my curiosity and builds resilience.",
    icon: "mountain",
    link: null
  },
  {
    title: "VFX Enthusiast",
    description: "Fascinated by CGI, digital compositing, and cinematic visual effects. Exploring creative editing techniques to bring imaginative scenes to life.",
    icon: "clapperboard",
    link: "aesthetics"
  }
]

interface TestimonialProps {
  name: string;
  role: string;
  avatarUrl: string;
  text: string;
}

function TestimonialCard({ name, role, avatarUrl, text }: TestimonialProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="testimonial-card">
      <div className="testimonial-content-wrapper">
        <p className={`testimonial-text ${!isExpanded ? 'collapsed' : 'expanded'}`}>
          "{text}"
        </p>
        <button
          type="button"
          className="testimonial-toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      </div>
      <div className="testimonial-author">
        <img src={avatarUrl} alt={`${name} testimonial photo`} className="testimonial-avatar" />
        <div className="testimonial-author-info">
          <div className="testimonial-name">{name}</div>
          <div className="testimonial-role">{role}</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<'home' | 'logic' | 'aesthetics' | 'about' | 'admin'>('home')
  const [prevPage, setPrevPage] = useState<'logic' | 'aesthetics' | 'home'>('home')
  const [portfolioContent, setPortfolioContent] = useState<PortfolioContent>(getStoredContent)

  const devStartYear = 2022
  const experienceYears = Math.max(1, new Date().getFullYear() - devStartYear)

  const section2Ref = useRef<HTMLDivElement>(null)
  const fromSubpageRef = useRef<boolean>(false)
  const subpageRef = useRef<HTMLDivElement>(null)

  const [featuredRepos, setFeaturedRepos] = useState<any[]>([])
  const [otherRepos, setOtherRepos] = useState<any[]>([])
  const [loadingRepos, setLoadingRepos] = useState<boolean>(true)
  const [reposError, setReposError] = useState<boolean>(false)

  const [otherReposExpanded, setOtherReposExpanded] = useState(false)
  const [activeExperienceIndex, setActiveExperienceIndex] = useState(0)
  const experienceSwipeStartX = useRef<number | null>(null)

  // Listen for storage updates across tabs/components
  useEffect(() => {
    const handleContentUpdate = () => {
      setPortfolioContent(getStoredContent())
    }
    window.addEventListener('portfolio_content_updated', handleContentUpdate)
    return () => window.removeEventListener('portfolio_content_updated', handleContentUpdate)
  }, [])

  useEffect(() => {
    const fetchRepos = async () => {
      const username = 'PramudithaN';
      const featuredNames = ["11labsM", "petrocast-backend", "digital-wedding-invitation"];
      const fallbackFeatured = [
        {
          name: "11labsM",
          html_url: "https://github.com/PramudithaN/11labsM",
          description: "An automated localization and voice generation pipeline that translates English text into 17 languages and sequentially synthesizes high-quality audio using the ElevenLabs API.",
          stargazers_count: 0,
          forks_count: 0,
          updated_at: "2026-06-15T13:54:16Z",
          language: "Python",
          topics: ["python", "elevenlabs", "automation", "localization"],
          license: null
        },
        {
          name: "petrocast-backend",
          html_url: "https://github.com/PramudithaN/petrocast-backend",
          description: "Production-grade FastAPI backend for crude oil price forecasting using a decomposition-based hybrid model (ARIMA + GRU + XGBoost) with strictly lagged live news sentiment integration from news sources.",
          stargazers_count: 2,
          forks_count: 0,
          updated_at: "2026-07-25T17:09:02Z",
          language: "Python",
          topics: ["fastapi", "machine-learning", "forecasting", "arima", "gru"],
          license: { key: "mit", name: "MIT License" }
        },
        {
          name: "digital-wedding-invitation",
          html_url: "https://github.com/PramudithaN/digital-wedding-invitation",
          description: "Interactive digital wedding invitation website built with React, Framer Motion, and Tailwind CSS.",
          stargazers_count: 0,
          forks_count: 0,
          updated_at: "2026-08-20T03:22:57Z",
          language: "TypeScript",
          topics: ["react", "framer-motion", "tailwindcss", "wedding"],
          license: { key: "mit", name: "MIT License" }
        }
      ];

      const excludedNames = [
        "is-a-dev-register",
        "jarvis",
        "skills-introduction-to-repository-management",
        "skills-introduction-to-secret-scanning",
        "skills-secure-repository-supply-chain",
        "PramudithaN",
        "my-to-do-app",
        "Celestial-Routes-Figma",
        "Wavewatchers-Figma"
      ];

      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
          headers: { Accept: 'application/vnd.github.mercy-preview+json' }
        });
        if (res.ok) {
          const rawRepos = await res.json();
          if (Array.isArray(rawRepos)) {
            const filteredRaw = rawRepos.filter(r => !excludedNames.includes(r.name));
            const featured = filteredRaw.filter(r => featuredNames.includes(r.name));
            
            // Supplement with fallbacks if any featured ones are not returned by the API
            const featuredWithFallbacks = [...featured];
            featuredNames.forEach(name => {
              if (!featuredWithFallbacks.some(f => f.name === name)) {
                const fb = fallbackFeatured.find(f => f.name === name);
                if (fb) featuredWithFallbacks.push(fb);
              }
            });

            // Sort featured by their index in featuredNames
            featuredWithFallbacks.sort((a, b) => featuredNames.indexOf(a.name) - featuredNames.indexOf(b.name));

            const other = filteredRaw.filter(r => !featuredNames.includes(r.name));

            setFeaturedRepos(featuredWithFallbacks);
            setOtherRepos(other);
          } else {
            throw new Error('API response is not an array');
          }
        } else {
          throw new Error('API request failed');
        }
      } catch (e) {
        setReposError(true)
        setFeaturedRepos(fallbackFeatured);
        setOtherRepos([
          {
            name: "Vapi-Clone_FrontEnd",
            html_url: "https://github.com/PramudithaN/Vapi-Clone_FrontEnd.git",
            description: "Chatbot Management UI developed with Html and Css",
            stargazers_count: 2,
            forks_count: 0,
            updated_at: new Date().toISOString(),
            language: "HTML",
            topics: ["Project"],
          }
        ]);
      } finally {
        setLoadingRepos(false)
      }
    };
    fetchRepos();
  }, []);

  // Helper function to handle navigation & URL updates
  const navigateTo = (newPage: 'home' | 'logic' | 'aesthetics' | 'about' | 'admin') => {
    if (newPage === 'home' && page !== 'home') {
      fromSubpageRef.current = true
    }
    if (newPage === 'about' && (page === 'logic' || page === 'aesthetics')) {
      setPrevPage(page)
    }
    setPage(newPage)
    const path = newPage === 'home' ? '/' : `/${newPage}`
    window.history.pushState({ page: newPage }, '', path)
  }

  // Sync state with browser URLs & history popstates (Back/Forward buttons)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const statePage = event.state?.page
      if (statePage) {
        if (statePage === 'home' && page !== 'home') {
          fromSubpageRef.current = true
        }
        setPage(statePage)
      } else {
        // Fallback checks
        const path = window.location.pathname
        if (path === '/logic') setPage('logic')
        else if (path === '/aesthetics') setPage('aesthetics')
        else if (path === '/about') setPage('about')
        else if (path === '/admin') setPage('admin')
        else {
          if (page !== 'home') fromSubpageRef.current = true
          setPage('home')
        }
      }
    }

    window.addEventListener('popstate', handlePopState)

    // Initial check on page load / refresh
    const initialPath = window.location.pathname
    if (initialPath === '/logic') {
      setPage('logic')
    } else if (initialPath === '/aesthetics') {
      setPage('aesthetics')
    } else if (initialPath === '/about') {
      setPage('about')
    } else if (initialPath === '/admin') {
      setPage('admin')
    } else {
      setPage('home')
    }

    return () => window.removeEventListener('popstate', handlePopState)
  }, [page])

  // Scroll back to Section 2 instantly if returning from a subpage
  useEffect(() => {
    if (page === 'home' && fromSubpageRef.current) {
      setTimeout(() => {
        section2Ref.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
        fromSubpageRef.current = false // Reset trigger
      }, 0)
    }
  }, [page])

  // Scroll to top instantly when entering a subpage
  useEffect(() => {
    if (page === 'logic' || page === 'aesthetics') {
      window.scrollTo(0, 0)
      document.documentElement.scrollTo(0, 0)
      document.body.scrollTo(0, 0)
      if (subpageRef.current) {
        subpageRef.current.scrollTo(0, 0)
      } else {
        setTimeout(() => {
          const container = document.querySelector('.subpage-container')
          if (container) container.scrollTo(0, 0)
        }, 0)
      }
    }
  }, [page])

  const scrollToHome = () => {
    const scrollContainer = document.querySelector('.scroll-container')
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const scrollSubpageToTop = () => {
    subpageRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Show the floating "scroll to top" button only after the user scrolls down a subpage
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    if (page !== 'logic' && page !== 'aesthetics' && page !== 'about') {
      setShowScrollTop(false)
      return
    }

    const container = subpageRef.current
    if (!container) return

    const handleScroll = () => {
      setShowScrollTop(container.scrollTop > 400)
    }

    handleScroll()
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [page])

  // Slice displayed repositories
  const displayedOtherRepos = otherReposExpanded 
    ? otherRepos 
    : otherRepos.slice(0, 6);

  const activeExperience = (portfolioContent.logicExperience[activeExperienceIndex] || portfolioContent.logicExperience[0]) ?? { company: '', role: '', duration: '', title: '' }

  // --- SUBPAGE RENDERING: ADMIN PANEL ---
  if (page === 'admin') {
    return (
      <AdminPanel
        onNavigateHome={() => navigateTo('home')}
        onNavigateLogic={() => navigateTo('logic')}
        onNavigateAesthetics={() => navigateTo('aesthetics')}
      />
    )
  }

  // --- SUBPAGE RENDERING: ABOUT ME ---
  if (page === 'about') {
    return (
      <>
      <div ref={subpageRef} className="subpage-container about-subpage">
        <div className="subpage-scroll-content">
          {/* Subpage Background Watermarks */}
          <div className="subpage-bg-watermark right-watermark">
            <span>PRAMUDITHA NADUN | ABOUT</span>
          </div>
          <div
            className="about-bg-blurred-image"
            style={{ backgroundImage: "url('/AboutSection.jpg')" }}
            aria-hidden="true"
          />

          {/* Subpage Header */}
          <div className="top-header-row">
            <div 
              className="stacked-logo" 
              onClick={() => {
                navigateTo('home');
                setTimeout(() => {
                  const scrollContainer = document.querySelector('.scroll-container');
                  if (scrollContainer) scrollContainer.scrollTo({ top: 0 });
                }, 50);
              }}
            >
              <span>PR</span>
              <span>NA</span>
            </div>
              <button className="theme-toggle-btn" onClick={() => navigateTo(prevPage)}>
                ‹ Back
            </button>
          </div>

          {/* Editorial hero */}
          <div className="about-hero-card">
            
            {/* Left Column: Index & Active Subcategory */}
            <div className="about-card-left">
              <span className="about-index-tag">/ 01</span>
              <h3 className="about-category-heading">Enterprise Systems</h3>
              <div className="about-category-underline"></div>
              <ul className="about-category-list">
                <li className="active" onClick={() => navigateTo('logic')}>Full-Stack &amp; UI/UX</li>
                <li onClick={() => navigateTo('aesthetics')}>Cinematography & VFX</li>
              </ul>
            </div>

            {/* Giant headline and bio hook */}
            <div className="about-card-right">
              <h2 className="about-card-headline">
                <span>Code</span>
                <span>Anywhere</span>
              </h2>
              <p className="about-card-desc">
                Software engineering undergraduate at the University of Westminster and Associate Software Engineer at LOLC Technologies, building fintech platforms while exploring video editing and graphic design. Discover my <button
                  type="button"
                  className="about-card-action"
                  onClick={() => navigateTo('logic')}
                >software work <span>›</span></button>
              </p>
            </div>

          </div>

          {/* Bottom Grid with 3 Separate Cards */}
          <div className="about-bottom-grid">
            
            {/* Card 1: Experience & Base */}
            <div
              className="about-subcard experience-subcard"
              onPointerDown={(event) => {
                experienceSwipeStartX.current = event.clientX
                event.currentTarget.setPointerCapture(event.pointerId)
              }}
              onPointerUp={(event) => {
                const startX = experienceSwipeStartX.current
                experienceSwipeStartX.current = null
                if (startX === null) return

                const distance = event.clientX - startX
                if (Math.abs(distance) < 45) return

                setActiveExperienceIndex((currentIndex) => {
                  const nextIndex = distance < 0 ? currentIndex + 1 : currentIndex - 1
                  return Math.max(0, Math.min(portfolioContent.logicExperience.length - 1, nextIndex))
                })
              }}
              onPointerCancel={() => {
                experienceSwipeStartX.current = null
              }}
              aria-label="Swipe to browse work experience"
            >
              <div className="about-subcard-label">EXPERIENCE</div>
              <div className="about-subcard-entries">
                <div className="about-subcard-entry">
                  <h4 className="about-entry-title">{activeExperience.company}</h4>
                  <p className="about-entry-meta">{activeExperience.role} ({activeExperience.duration})</p>
                </div>
              </div>
              <div className="about-subcard-pagination">
                {portfolioContent.logicExperience.map((experience, index) => (
                  <button
                    key={experience.id || index}
                    type="button"
                    className={`dot${index === activeExperienceIndex ? ' active' : ''}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      setActiveExperienceIndex(index)
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
              <img src="/UOW.png" alt="University of Westminster" className="about-background-image" />
              <div className="about-subcard-entry">
                <h4 className="about-entry-title">University of Westminster</h4>
                <p className="about-entry-meta">Undergraduate · Software Engineering</p>
                <p className="about-entry-copy">Building a foundation in software engineering while developing practical fintech systems and full-stack applications.</p>
              </div>
            </div>

            {/* Card 3: Visual Snapshot / Thumbnail */}
            <div 
              className="about-subcard media-subcard"
              onClick={() => navigateTo('aesthetics')}
              title="View Aesthetics & Motion"
            >
              <div className="about-media-box">
                <img src="/AboutSection.jpg" alt="Abstract workspace with code and visual references" className="about-media-image" />
                <div className="about-media-info">
                  <span className="about-media-tag">02 / VISUAL REEL</span>
                  <span className="about-media-title">Aesthetics &amp; Motion</span>
                </div>
              </div>
            </div>

            {/* Card 4: Beyond The Code */}
            <div className="about-subcard">
              <div className="about-subcard-label">CONNECT</div>
              <p className="about-subcard-text">
                Currently working in fintech, with a creative practice spanning video editing, graphic design, and visual storytelling.
              </p>
              <div className="about-social-links" aria-label="Social media links">
                <a href="https://github.com/PramudithaN" target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub">
                  <Icon icon="mdi:github" width="20" height="20" />
                </a>
                <a href="http://www.linkedin.com/in/pramuditha-nadun-612b1b204" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">
                  <Icon icon="mdi:linkedin" width="20" height="20" />
                </a>
                <a href="https://www.instagram.com/pramx.psd?igsh=MWNtaXF2cWw2ajEwcg==" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram">
                  <Icon icon="mdi:instagram" width="20" height="20" />
                </a>
                <a href="https://web.facebook.com/pramuditha.nadun" target="_blank" rel="noopener noreferrer" title="Facebook" aria-label="Facebook">
                  <Icon icon="mdi:facebook" width="20" height="20" />
                </a>
                <a href="mailto:pramudithanadun@gmail.com" title="Email" aria-label="Email">
                  <Icon icon="mdi:email-outline" width="20" height="20" />
                </a>
                <button
                  type="button"
                  onClick={() => navigateTo('admin')}
                  className="about-admin-lock-btn"
                  title="Admin Access"
                  aria-label="Admin Access"
                >
                  <Icon icon="mdi:shield-lock-outline" width="18" height="18" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
      <button
        type="button"
        className={`subpage-scroll-top-btn${showScrollTop ? ' visible' : ''}`}
        onClick={scrollSubpageToTop}
        title="Scroll to top"
        aria-label="Scroll to top"
      >
        <Icon icon="mdi:chevron-up" />
      </button>
      </>
    );
  }

  // --- SUBPAGE RENDERING: LOGIC & SYSTEMS ---
  if (page === 'logic') {
    return (
      <>
      <div ref={subpageRef} className="subpage-container logic-subpage">
        <div className="subpage-scroll-content">
          {/* Subpage Background Watermarks */}
        <div className="subpage-bg-watermark right-watermark">
          <span>PRAMUDITH NADUN | DEVELOPER</span>
        </div>

        {/* Subpage Header */}
        <div className="top-header-row">
          <div 
            className="stacked-logo" 
            onClick={() => {
              navigateTo('home');
              setTimeout(() => {
                const scrollContainer = document.querySelector('.scroll-container');
                if (scrollContainer) scrollContainer.scrollTo({ top: 0 });
              }, 50);
            }}
          >
            <span>PR</span>
            <span>NA</span>
          </div>
          <div className="header-buttons">
            <button className="theme-toggle-btn" onClick={() => navigateTo('home')}>
              ‹ Back
            </button>
          </div>
        </div>

        {/* Subpage Intro */}
        <h1 className="subpage-title">Logic & Systems</h1>
        <p className="subpage-subtitle">Systems Architecture & Interactive Code</p>

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
            {experienceYears}+ years of web development experience architecting scalable enterprise platforms, interactive frontend architectures, and high-performance full-stack applications.
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
                Architecting and optimizing modern web platforms with React, TypeScript, and Redux, managing CI/CD deployments and user access control at LOLC Technologies.
              </p>
            </div>
            <span className="work-item-tag">React / Redux</span>
          </div>

          <div className="work-card">
            <div>
              <div className="work-item-meta">02 / TRAINEE SOFTWARE ENGINEER</div>
              <h3 className="work-item-title">UI/UX & Systems</h3>
              <p className="work-item-desc">
                Designing interactive frontend components in Figma and building database reporting features with Java, Oracle Forms, and Jasper Reports.
              </p>
            </div>
            <span className="work-item-tag">Figma / Java</span>
          </div>

          <div className="work-card">
            <div>
              <div className="work-item-meta">03 / FREELANCE DEVELOPMENT</div>
              <h3 className="work-item-title">Fullstack Solutions</h3>
              <p className="work-item-desc">
                Delivering high-performance, custom mobile-first applications using React, Next.js, Node.js, and Spring Boot for diverse global clients.
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
          <p className="journey-subtitle">{experienceYears}+ Years of Full-Stack Web Development &amp; Systems Engineering</p>
        </div>
        <div className="timeline-container">
          {portfolioContent.logicExperience.map((exp, index) => (
            <div key={exp.id || index} className="timeline-item">
              <span className="timeline-dot"></span>
              <div className="timeline-header">
                <span className="timeline-duration">{exp.duration}</span>
                <div className="timeline-title-group">
                  <h3 className="timeline-job-title">
                    {exp.title} <span className="company-name">@ {exp.company}</span>
                  </h3>
                  <span className="timeline-role">{exp.role}</span>
                </div>
              </div>
              <div className="timeline-details">
                <div className="timeline-summary">
                  <span className="timeline-summary-label">Summary:</span>
                  <ul className="timeline-bullet-list">
                    {exp.accomplishments.map((acc, aIdx) => (
                      <li key={aIdx}>{acc}</li>
                    ))}
                  </ul>
                </div>
                <div className="timeline-tech-badges">
                  {exp.tech.map((t) => (
                    <span key={t} className="tech-badge">{t}</span>
                  ))}
                </div>
              </div>
            </div>
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
            {featuredRepos.map((repo) => {
              const langClass = `lang-${repo.language ? repo.language.toLowerCase().replace(/[^a-z0-9]/g, '') : 'default'}`;
              return (
                <article key={repo.name} className="repo-card featured">
                  <div className="repo-scanline" aria-hidden="true"></div>
                  <div className="repo-card-topline">
                    <span className="repo-card-index">FEATURED / {String(featuredRepos.indexOf(repo) + 1).padStart(2, '0')}</span>
                    <span className="repo-status"><span className="repo-status-dot"></span> ACTIVE</span>
                  </div>
                  <div className="repo-card-header">
                    <h3 className="repo-name">{repo.name}</h3>
                    <div className="repo-stats">
                      <span className="repo-stat-item"><Icon icon="mdi:star-outline" /> {repo.stargazers_count}</span>
                      <span className="repo-stat-item"><Icon icon="mdi:source-fork" /> {repo.forks_count}</span>
                    </div>
                  </div>
                  <p className="repo-desc">{repo.description}</p>
                  {(repo.topics?.length > 0) && (
                    <div className="repo-tags">
                      {repo.topics.map((topic: string) => (
                        <span key={topic} className="repo-topic-tag">{topic}</span>
                      ))}
                    </div>
                  )}
                  <div className="repo-footer">
                    {repo.language && (
                      <span className={`repo-lang-badge ${langClass}`}>
                        {repo.language}
                      </span>
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
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-action source-action">
                      <Icon icon="mdi:github" /> Source <span>↗</span>
                    </a>
                    {repo.homepage && (
                      <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="repo-action live-action">
                        <Icon icon="mdi:open-in-new" /> Live demo <span>↗</span>
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="section-divider" />
        <h2 className="section-title">Projects</h2>

        {loadingRepos ? (
          <div className="repos-loading">Loading projects...</div>
        ) : (
          <>
            <div className="repos-grid">
              {displayedOtherRepos.map((repo) => {
                const langClass = `lang-${repo.language ? repo.language.toLowerCase().replace(/[^a-z0-9]/g, '') : 'default'}`;
                return (
                  <article key={repo.name} className="repo-card">
                    <div className="repo-scanline" aria-hidden="true"></div>
                    <div className="repo-card-topline">
                      <span className="repo-card-index">PROJECT / {String(displayedOtherRepos.indexOf(repo) + 1).padStart(2, '0')}</span>
                      <span className="repo-status"><span className="repo-status-dot"></span> REPO</span>
                    </div>
                    <div className="repo-card-header">
                      <h3 className="repo-name">{repo.name}</h3>
                      <div className="repo-stats">
                        <span className="repo-stat-item"><Icon icon="mdi:star-outline" /> {repo.stargazers_count}</span>
                        <span className="repo-stat-item"><Icon icon="mdi:source-fork" /> {repo.forks_count}</span>
                      </div>
                    </div>
                    <p className="repo-desc">{repo.description}</p>
                    {(repo.topics?.length > 0) && (
                      <div className="repo-tags">
                        {repo.topics.map((topic: string) => (
                          <span key={topic} className="repo-topic-tag">{topic}</span>
                        ))}
                      </div>
                    )}
                    <div className="repo-footer">
                      {repo.language && (
                        <span className={`repo-lang-badge ${langClass}`}>
                          {repo.language}
                        </span>
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
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-action source-action">
                          <Icon icon="mdi:github" /> Source <span>↗</span>
                        </a>
                        {repo.homepage && (
                          <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="repo-action live-action">
                            <Icon icon="mdi:open-in-new" /> Live demo <span>↗</span>
                          </a>
                        )}
                      </div>
                    </article>
                );
              })}
            </div>

            {otherRepos.length > 4 && (
              <div className="load-more-container">
                <button
                  className="projects-load-more-btn"
                  onClick={() => setOtherReposExpanded(!otherReposExpanded)}
                >
                  {otherReposExpanded ? 'Show Less Projects' : `View All Projects (${otherRepos.length})`}
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
            const renderIcon = (name: string) => {
              switch(name) {
                case 'palette': return <Palette className="beyond-icon" />;
                case 'mountain': return <Mountain className="beyond-icon" />;
                case 'clapperboard': return <Clapperboard className="beyond-icon" />;
                default: return null;
              }
            };
            const isClickable = Boolean(item.link);
            return (
              <div 
                key={index} 
                className={`beyond-card${isClickable ? ' interactive' : ''}`}
                onClick={isClickable ? () => navigateTo('aesthetics') : undefined}
                role={isClickable ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={isClickable ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigateTo('aesthetics');
                  }
                } : undefined}
                title={isClickable ? "View in Aesthetics & Motion" : undefined}
              >
                <div className="beyond-card-header">
                  {renderIcon(item.icon)}
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
      <button
        type="button"
        className={`subpage-scroll-top-btn${showScrollTop ? ' visible' : ''}`}
        onClick={scrollSubpageToTop}
        title="Scroll to top"
        aria-label="Scroll to top"
      >
        <Icon icon="mdi:chevron-up" />
      </button>
      </>
    )
  }

  // --- SUBPAGE RENDERING: AESTHETICS & MOTION ---
  if (page === 'aesthetics') {
    return (
      <>
      <div ref={subpageRef} className="subpage-container aesthetics-subpage">
        <div className="subpage-scroll-content">
          {/* Subpage Background Watermarks */}
        <div className="subpage-bg-watermark right-watermark">
          <span>PRAMUDITHA NADUN | DESIGNER</span>
        </div>

        {/* Subpage Header */}
        <div className="top-header-row">
          <div 
            className="stacked-logo" 
            onClick={() => {
              navigateTo('home');
              setTimeout(() => {
                const scrollContainer = document.querySelector('.scroll-container');
                if (scrollContainer) scrollContainer.scrollTo({ top: 0 });
              }, 50);
            }}
          >
            <span>PR</span>
            <span>NA</span>
          </div>
          <div className="header-buttons">
            <button className="theme-toggle-btn" onClick={() => navigateTo('home')}>
              ‹ Back
            </button>
          </div>
        </div>

        {/* Subpage Intro */}
        <h1 className="subpage-title">Aesthetics &amp; Motion</h1>
        <p className="subpage-subtitle">Graphic Design &amp; Cinematography</p>

        {/* Video Showcase: Graphic Design / Video Editing reels */}
        <VideoShowcase reels={portfolioContent.videoReels} />

        <div className="section-divider" />
        <h2 className="section-title">Creative Journey</h2>
        <div className="timeline-container">
          {portfolioContent.aestheticsExperience.map((exp, index) => (
            <div key={exp.id || index} className="timeline-item">
              <span className="timeline-dot"></span>
              <div className="timeline-header">
                <span className="timeline-duration">{exp.duration}</span>
                <div className="timeline-title-group">
                  <h3 className="timeline-job-title">
                    {exp.title} <span className="company-name">@ {exp.company}</span>
                  </h3>
                  <span className="timeline-role">{exp.role}</span>
                </div>
              </div>
              <div className="timeline-details">
                <div className="timeline-summary">
                  <span className="timeline-summary-label">Summary:</span>
                  <ul className="timeline-bullet-list">
                    {exp.accomplishments.map((acc, aIdx) => (
                      <li key={aIdx}>{acc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-divider" />
        <h2 className="section-title">Client Feedback</h2>
        <div className="testimonials-grid">
          {portfolioContent.aestheticsTestimonials.map((testimonial, idx) => (
            <div key={testimonial.id || idx} className="testimonial-card">
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <img src={testimonial.avatarUrl} alt={testimonial.name} className="testimonial-avatar" />
                <div className="testimonial-info">
                  <div className="testimonial-name">{testimonial.name}</div>
                  <div className="testimonial-role">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-divider" />
        {/* Work Grid */}
        <div className="work-grid">
          <div className="work-card">
            <div>
              <div className="work-item-meta">01 / Brand Identity</div>
              <h3 className="work-item-title">Typographic Layouts</h3>
              <p className="work-item-desc">
                Shaping minimalist design frameworks, poster schemes, custom type identities, and vector palettes for brands.
              </p>
            </div>
            <span className="work-item-tag">Figma / Adobe</span>
          </div>

          <div className="work-card">
            <div>
              <div className="work-item-meta">02 / Video Production</div>
              <h3 className="work-item-title">Cinematic Motion Reels</h3>
              <p className="work-item-desc">
                Editing editorial promos, typography animations, and color grading reels to present dynamic products.
              </p>
            </div>
            <span className="work-item-tag">Premiere / After Effects</span>
          </div>

          <div className="work-card">
            <div>
              <div className="work-item-meta">03 / Visual Systems</div>
              <h3 className="work-item-title">Interactive Art Canvas</h3>
              <p className="work-item-desc">
                Generating procedural patterns, 3D abstract compositions, and loop animations that blur art with code.
              </p>
            </div>
            <span className="work-item-tag">Generative / 3D</span>
          </div>
        </div>

      </div>
      </div>
      <button
        type="button"
        className={`subpage-scroll-top-btn${showScrollTop ? ' visible' : ''}`}
        onClick={scrollSubpageToTop}
        title="Scroll to top"
        aria-label="Scroll to top"
      >
        <Icon icon="mdi:chevron-up" />
      </button>
      </>
    )
  }

  // --- MAIN LAYOUT (HOME & PORTAL SCROLLsnap) ---
  return (
    <div className="scroll-container">
      {/* SECTION 1: HOME PAGE (Always Dark Cinematic Theme) */}
      <section className="scroll-section">
        {/* Left Side Socials Vertical */}
        <div className="left-socials-vertical">
          <a href="https://github.com/PramudithaN" target="_blank" rel="noopener noreferrer" title="GitHub">
            <Icon icon="mdi:github" width="22" height="22" />
          </a>
          <a href="http://www.linkedin.com/in/pramuditha-nadun-612b1b204" target="_blank" rel="noopener noreferrer" title="LinkedIn">
            <Icon icon="mdi:linkedin" width="22" height="22" />
          </a>
          <a href="https://www.instagram.com/pramx.psd?igsh=MWNtaXF2cWw2ajEwcg==" target="_blank" rel="noopener noreferrer" title="Instagram">
            <Icon icon="mdi:instagram" width="22" height="22" />
          </a>
          <a href="https://web.facebook.com/pramuditha.nadun" target="_blank" rel="noopener noreferrer" title="Facebook">
            <Icon icon="mdi:facebook" width="22" height="22" />
          </a>
          <a href="https://www.behance.net/pramudithanadun1" target="_blank" rel="noopener noreferrer" title="Behance">
            <Icon icon="simple-icons:behance" width="22" height="22" />
          </a>
          <a href="https://pin.it/Lb92N4TnM" target="_blank" rel="noopener noreferrer" title="Pinterest">
            <Icon icon="mdi:pinterest" width="22" height="22" />
          </a>
          <a href="mailto:pramudithanadun9@gmail.com" target="_blank" rel="noopener noreferrer" title="Email">
            <Icon icon="mdi:email-outline" width="22" height="22" />
          </a>
        </div>
        
        {/* Right Scroll Vertical */}
        <div className="right-scroll-vertical">
          Scroll Down
        </div>

        {/* Section 1 Background */}
        <div className="portfolio-bg">
          {/* Giant background text: NADUN */}
          <motion.div 
            className="bg-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          >
            NADUN
          </motion.div>
        </div>

        {/* Section 1 Content */}
        <div className="portfolio-container">
          {/* Top Header */}
          <motion.div 
            className="top-section"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          >
            <div className="brand-subtitle">Software Engineer | Designer</div>
          </motion.div>

          {/* Hero Section */}
          <div className="hero-section">
            <div className="fg-text-container">
              {/* White Text: PRAMUDITHA */}
              <motion.h1 
                className="fg-text"
                initial={{ opacity: 0, y: 40, scaleY: 1.4 }}
                animate={{ opacity: 1, y: 0, scaleY: 1.75 }}
                transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                PRAMUDITHA
              </motion.h1>
              <motion.button
                type="button"
                className="home-about-cta-btn"
                onClick={() => navigateTo('about')}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              >
                <span className="cta-dot" aria-hidden="true"></span>
                <span>What's wrong with me?</span>
                <span className="cta-arrow" aria-hidden="true">›</span>
              </motion.button>
            </div>
          </div>

          {/* Bottom Section */}
          <motion.div 
            className="bottom-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          >
            {/* Mobile Scroll Down Prompt */}
            <div className="mobile-scroll-down-prompt">
              <span>Scroll Down</span>
              <Icon icon="mdi:chevron-down" className="bouncing-arrow" />
            </div>

            <p className="description-text">
              PRAMUDITHA NADUN IS A SOFTWARE ENGINEER & DESIGNER WITH A PASSION FOR CREATING WEB APPLICATIONS. EXPERIENCED IN BOTH FRONT-END AND BACK-END DEVELOPMENT, ALWAYS EAGER TO MASTER NEW SYSTEMS, COLLABORATE WITH CROSS-FUNCTIONAL TEAMS, AND ARCHITECT MEANINGFUL DIGITAL SOLUTIONS.
            </p>

            <div className="footer-links">
              <a 
                href="https://github.com/PramudithaN" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-link"
                title="GitHub"
              >
                <Icon icon="mdi:github" width="24" height="24" />
              </a>
              <a 
                href="http://www.linkedin.com/in/pramuditha-nadun-612b1b204" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-link"
                title="LinkedIn"
              >
                <Icon icon="mdi:linkedin" width="24" height="24" />
              </a>
              <a 
                href="https://www.instagram.com/pramx.psd?igsh=MWNtaXF2cWw2ajEwcg==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-link"
                title="Instagram"
              >
                <Icon icon="mdi:instagram" width="24" height="24" />
              </a>
              <a 
                href="https://web.facebook.com/pramuditha.nadun" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-link"
                title="Facebook"
              >
                <Icon icon="mdi:facebook" width="24" height="24" />
              </a>
              <a 
                href="https://www.behance.net/pramudithanadun1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-link"
                title="Behance"
              >
                <Icon icon="simple-icons:behance" width="24" height="24" />
              </a>
              <a 
                href="https://pin.it/Lb92N4TnM" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-link"
                title="Pinterest"
              >
                <Icon icon="mdi:pinterest" width="24" height="24" />
              </a>
              <a 
                href="mailto:pramudithanadun@gmail.com" 
                className="footer-link"
                title="Email"
              >
                <Icon icon="mdi:email-outline" width="24" height="24" />
              </a>
              <button
                type="button"
                onClick={() => navigateTo('admin')}
                className="footer-link footer-admin-lock-btn"
                title="Admin Access"
                aria-label="Admin Access"
              >
                <Icon icon="mdi:shield-lock-outline" width="22" height="22" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: PORTALS (Horizontal Split Screen Layout - Light Clay Beige Theme) */}
      <section 
        ref={section2Ref}
        className="scroll-section split-scroll-section light-theme"
      >
        {/* Section 2 Background */}
        <div className="portfolio-bg" />

        {/* Scroll back to Home link */}
        <div className="home-guide-link" onClick={scrollToHome} title="Scroll to Top">
          <Icon icon="mdi:chevron-up" className="home-guide-icon" />
          <span className="home-guide-text">SCROLL TO TOP</span>
        </div>

        {/* Top Half: Logic & Systems */}
        <div 
          className="split-half top-half"
          onClick={() => navigateTo('logic')}
        >
          <div className="split-title-wrapper">
            <motion.h2 
              className="split-half-title"
              initial={{ opacity: 0, y: -40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="title-line line-1">Logic & </span>
              <span className="title-line line-2">Systems</span>
            </motion.h2>
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="arrow-indicator"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </div>
        </div>

        {/* Bottom Half: Aesthetics & Motion */}
        <div 
          className="split-half bottom-half"
          onClick={() => navigateTo('aesthetics')}
        >
          <div className="split-title-wrapper">
            <motion.h2 
              className="split-half-title"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="title-line line-1">Aesthetics </span>
              <span className="title-line line-2">& Motion</span>
            </motion.h2>
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="arrow-indicator"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </div>
        </div>

      </section>
      <Analytics />
    </div>
  )
}
