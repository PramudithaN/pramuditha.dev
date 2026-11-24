import type { PageType, ThemeMode } from '../../types';
import './signature-footer.css';

export interface SignatureFooterSectionProps {
  theme: ThemeMode;
  onNavigate?: (page: PageType) => void;
}

export default function SignatureFooterSection({
  theme,
  onNavigate,
}: SignatureFooterSectionProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="signature-footer"
      data-theme={theme}
      aria-label="Portfolio Signature Footer"
    >
      {/* Swiss Editorial Brand Stamp */}
      <button
        type="button"
        className="signature-footer__stamp"
        onClick={scrollToTop}
        aria-label="Back to top — Pramuditha Nadun, Software Engineer"
      >
        <span className="signature-footer__corner-mark" aria-hidden="true">
          &reg;
        </span>
        <div className="signature-footer__box">
          <p className="signature-footer__wordmark">
            <span>pram</span>
            <span>nadun</span>
          </p>
          <p className="signature-footer__sub">
            Software
            <br />
            Engineering
          </p>
        </div>
      </button>

      {/* Minimal Footer Links */}
      <div className="signature-footer__meta">
        <span>© {new Date().getFullYear()} Pramuditha Nadun · Nugegoda, LK</span>

        <div className="signature-footer__links">
          <button
            type="button"
            className="signature-footer__link"
            onClick={() => onNavigate?.('about')}
          >
            About
          </button>
          <button
            type="button"
            className="signature-footer__link"
            onClick={() => onNavigate?.('logic')}
          >
            Logic
          </button>
          <button
            type="button"
            className="signature-footer__link"
            onClick={() => onNavigate?.('aesthetics')}
          >
            Aesthetics
          </button>
          <a
            className="signature-footer__link"
            href="https://github.com/PramudithaN"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            className="signature-footer__link"
            href="https://www.linkedin.com/in/pramuditha-nadun-612b1b204"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            className="signature-footer__link"
            href="mailto:pramudithanadun@gmail.com"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
