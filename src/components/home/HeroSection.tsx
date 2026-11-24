import { useState } from 'react';
import { ArrowUpRight, Code2, Layers, Palette, Smartphone } from 'lucide-react';
import type { PageType, ThemeMode } from '../../types';
import { EXTERNAL_LINKS } from '../../constants/links';
import './hero-section.css';

export interface HeroSectionProps {
  theme: ThemeMode;
  onNavigate?: (page: PageType) => void;
}

const ORGS = [
  'LOLC Tech',
  'Fusion X',
  'Westminster',
  'IIT Colombo',
  'Fiverr L2',
  'Sentered',
] as const;

const SERVICES: ReadonlyArray<{
  title: string;
  description: string;
  target: PageType;
  Icon: typeof Layers;
}> = [
  {
    title: 'UX & UI',
    description:
      'Designing interfaces that are intuitive, efficient, and enjoyable to use.',
    target: 'aesthetics',
    Icon: Layers,
  },
  {
    title: 'Web & Systems',
    description:
      'Engineering scalable React, TypeScript, and fintech web applications.',
    target: 'logic',
    Icon: Smartphone,
  },
  {
    title: 'Design & Creative',
    description:
      'Crafting visually compelling brand identities, flyers, and motion graphics.',
    target: 'aesthetics',
    Icon: Palette,
  },
  {
    title: 'Development',
    description:
      'Bringing your vision to life with modern full-stack architecture and clean code.',
    target: 'logic',
    Icon: Code2,
  },
];

export default function HeroSection({ theme, onNavigate }: HeroSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('pramudithanadun9@gmail.com').catch(() => {});
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate?.('logic');
    }
  };

  return (
    <section
      className="hero-minimal"
      data-theme={theme}
      aria-label="Portfolio Introduction"
    >
      {/* Top Hero Card */}
      <div className="hero-minimal__top">
        <div className="hero-minimal__top-inner">
          <div className="hero-minimal__bar">
            <div className="hero-minimal__bar-left">
              <span className="hero-minimal__email-text">
                pramudithanadun9@gmail.com
              </span>
              <button
                type="button"
                className="hero-minimal__chip-btn"
                onClick={handleCopyEmail}
              >
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
              <a
                href={EXTERNAL_LINKS.INTERACTIVE_CV}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-minimal__chip-btn"
              >
                CV
              </a>
            </div>

            <nav className="hero-minimal__socials" aria-label="Social links">
              <a
                href={EXTERNAL_LINKS.LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <span aria-hidden="true">/</span>
              <a
                href={EXTERNAL_LINKS.GITHUB}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <span aria-hidden="true">/</span>
              <a
                href={EXTERNAL_LINKS.BEHANCE}
                target="_blank"
                rel="noopener noreferrer"
              >
                Behance
              </a>
            </nav>
          </div>

          <div className="hero-minimal__center">
            <div className="hero-minimal__avatar-wrap">
              <img
                src="/images/about/pramuditha-suit.jpg"
                alt="Pramuditha Nadun"
                className="hero-minimal__avatar"
                loading="eager"
              />
              <span className="hero-minimal__greeting">Pramuditha 👋</span>
            </div>

            <h1 className="hero-minimal__headline">
              Building digital products,{' '}
              <span className="hero-minimal__headline-muted">brands, and</span>{' '}
              experiences.
            </h1>

            <button
              type="button"
              className="hero-minimal__cta"
              onClick={scrollToProjects}
            >
              <span>Latest Shots</span>
              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Curved White Strip: Orgs & Experience */}
      <div className="hero-minimal__orgs-band">
        <div className="hero-minimal__orgs-grid">
          {ORGS.map((org) => (
            <span key={org} className="hero-minimal__org-item">
              {org}
            </span>
          ))}
        </div>
      </div>

      {/* Collaboration Statement + 4-Column Services */}
      <div className="hero-minimal__services-wrap">
        <h2 className="hero-minimal__collab-title">
          Collaborate with teams and startups{' '}
          <span>to create impactful results.</span>
        </h2>

        <div className="hero-minimal__divider">
          <span className="hero-minimal__divider-pill">Services</span>
        </div>

        <div className="hero-minimal__services-grid">
          {SERVICES.map(({ title, description, target, Icon }) => (
            <button
              key={title}
              type="button"
              className="hero-minimal__service-card"
              onClick={() => onNavigate?.(target)}
            >
              <Icon
                size={22}
                strokeWidth={1.75}
                className="hero-minimal__service-icon"
              />
              <h3 className="hero-minimal__service-title">{title}</h3>
              <p className="hero-minimal__service-desc">{description}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
