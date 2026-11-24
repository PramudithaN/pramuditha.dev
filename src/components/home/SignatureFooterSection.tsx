import { ArrowUp, BellPlus, Mail, MoreHorizontal, Search } from 'lucide-react';
import type { PageType, ThemeMode } from '../../types';
import { EXTERNAL_LINKS } from '../../constants/links';
import './signature-footer.css';

export interface SignatureFooterSectionProps {
  theme: ThemeMode;
  onNavigate?: (page: PageType) => void;
}

const FAN_SKILLS = [
  { label: 'UI/UX', className: 'profile-footer__skill-pill--1' },
  { label: 'Animation', className: 'profile-footer__skill-pill--2' },
  { label: 'Web design', className: 'profile-footer__skill-pill--3' },
  { label: 'Development', className: 'profile-footer__skill-pill--4' },
  { label: 'React & TypeScript', className: 'profile-footer__skill-pill--5' },
] as const;

export default function SignatureFooterSection({
  theme,
  onNavigate,
}: SignatureFooterSectionProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="profile-footer"
      data-theme={theme}
      aria-label="Portfolio Profile Footer"
    >
      {/* Top White Editorial Banner */}
      <div className="profile-footer__banner">
        <div className="profile-footer__grid-frame">
          <div className="profile-footer__fan" aria-hidden="true">
            {FAN_SKILLS.map((skill) => (
              <span
                key={skill.label}
                className={`profile-footer__skill-pill ${skill.className}`}
              >
                {skill.label}
              </span>
            ))}
          </div>

          <div className="profile-footer__cta-block">
            <span className="profile-footer__badge-mark" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 8.5L6.5 3.5M5.5 8.5L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <h2 className="profile-footer__headline">
              Scalable Web Apps for
              <span>Products &amp; Teams</span>
            </h2>

            <a
              href="mailto:pramudithanadun@gmail.com"
              className="profile-footer__orange-btn"
            >
              Book a chat now
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Dark X-Style Profile Bar */}
      <div className="profile-footer__bottom">
        <div className="profile-footer__top-row">
          <div className="profile-footer__avatar-wrap">
            <img
              src="/images/about/pramuditha-suit.jpg"
              alt="Pramuditha Nadun"
              className="profile-footer__avatar"
              loading="lazy"
            />
          </div>

          <div className="profile-footer__actions">
            <a
              href={EXTERNAL_LINKS.GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="profile-footer__icon-btn"
              aria-label="GitHub profile"
              title="GitHub"
            >
              <MoreHorizontal size={17} />
            </a>
            <button
              type="button"
              className="profile-footer__icon-btn"
              onClick={scrollToTop}
              aria-label="Back to top"
              title="Back to top"
            >
              <Search size={16} />
            </button>
            <a
              href="mailto:pramudithanadun@gmail.com"
              className="profile-footer__icon-btn"
              aria-label="Send email to pramudithanadun@gmail.com"
              title="Email"
            >
              <Mail size={16} />
            </a>
            <a
              href={EXTERNAL_LINKS.LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="profile-footer__icon-btn"
              aria-label="Connect on LinkedIn"
              title="LinkedIn"
            >
              <BellPlus size={16} />
            </a>
            <a
              href={EXTERNAL_LINKS.LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="profile-footer__follow-btn"
            >
              Connect
            </a>
          </div>
        </div>

        <div className="profile-footer__identity">
          <div className="profile-footer__name-row">
            <h3 className="profile-footer__name">Pramuditha Nadun</h3>
            <span
              className="profile-footer__verified"
              aria-label="Verified Software Engineer"
              title="Verified"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
              </svg>
            </span>
          </div>

          <div className="profile-footer__handle-row">
            <span className="profile-footer__handle">@PramudithaN</span>
            <span className="profile-footer__role-chip">Software Engineer</span>
          </div>
        </div>

        <div className="profile-footer__nav-strip">
          <span>
            &copy; {new Date().getFullYear()} Pramuditha Nadun &middot; Nugegoda,
            Sri Lanka
          </span>

          <nav className="profile-footer__nav-links" aria-label="Footer navigation">
            <button
              type="button"
              className="profile-footer__nav-btn"
              onClick={() => onNavigate?.('about')}
            >
              About
            </button>
            <button
              type="button"
              className="profile-footer__nav-btn"
              onClick={() => onNavigate?.('logic')}
            >
              Logic
            </button>
            <button
              type="button"
              className="profile-footer__nav-btn"
              onClick={() => onNavigate?.('aesthetics')}
            >
              Aesthetics
            </button>
            <a
              href={EXTERNAL_LINKS.GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="profile-footer__nav-btn"
            >
              GitHub
            </a>
            <button
              type="button"
              className="profile-footer__nav-btn"
              onClick={scrollToTop}
              aria-label="Scroll back to top"
            >
              <ArrowUp size={13} style={{ verticalAlign: 'middle' }} /> Top
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
