import { Icon } from '@iconify/react';
import type { PageType, ThemeMode } from '../../types';

interface SubpageQuickNavProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  theme?: ThemeMode;
}

interface NavDestination {
  page: PageType;
  title: string;
  tag: string;
  desc: string;
  icon: string;
}

const ALL_DESTINATIONS: Record<string, NavDestination> = {
  logic: {
    page: 'logic',
    title: 'Logic & Systems',
    tag: 'Engineering & Code',
    desc: 'Full-stack web platforms, React architectures, Spring Boot, and GitHub open-source repositories.',
    icon: 'mdi:code-tags'
  },
  aesthetics: {
    page: 'aesthetics',
    title: 'Aesthetics & Motion',
    tag: 'Creative & Video',
    desc: 'High-impact graphic design, motion design, video editing reels, and typography showcases.',
    icon: 'mdi:palette-swatch-outline'
  },
  about: {
    page: 'about',
    title: 'About Pramuditha',
    tag: 'Profile & Story',
    desc: 'Undergraduate software engineer & creative designer journey, education, and milestones.',
    icon: 'mdi:account-outline'
  }
};

export default function SubpageQuickNav({ currentPage, onNavigate }: SubpageQuickNavProps) {
  // Show the other two destinations that are not the current page
  const destinations = Object.values(ALL_DESTINATIONS).filter(
    (dest) => dest.page !== currentPage
  );

  return (
    <div className="subpage-quick-nav-section">
      <div className="section-divider" />
      <div className="quick-nav-header">
        <span className="quick-nav-badge">
          <Icon icon="mdi:compass-outline" className="quick-nav-badge-icon" />
          <span>Quick Switch</span>
        </span>
        <h3 className="quick-nav-title">Continue Exploring</h3>
        <p className="quick-nav-subtitle">
          Jump directly to another section of the portfolio without returning to Home:
        </p>
      </div>

      <div className="quick-nav-cards-grid">
        {destinations.map((dest) => (
          <div
            key={dest.page}
            className="quick-nav-card"
            onClick={() => onNavigate(dest.page)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onNavigate(dest.page);
              }
            }}
          >
            <div className="quick-nav-card-header">
              <div className="quick-nav-icon-wrap">
                <Icon icon={dest.icon} className="quick-nav-card-icon" />
              </div>
              <span className="quick-nav-card-arrow">↗</span>
            </div>

            <div className="quick-nav-card-body">
              <span className="quick-nav-card-tag">{dest.tag}</span>
              <h4 className="quick-nav-card-title">{dest.title}</h4>
              <p className="quick-nav-card-desc">{dest.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
