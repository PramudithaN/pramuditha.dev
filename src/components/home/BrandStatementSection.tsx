import { EXTERNAL_LINKS } from '../../constants/links';
import './brand-statement.css';

export default function BrandStatementSection() {
  return (
    <section
      className="brand-statement"
      aria-label="Design and Brand Statement"
    >
      {/* Giant Subtle Geometric Arrow Watermark */}
      <svg
        className="brand-statement__watermark"
        viewBox="0 0 320 420"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M270 10v400M115 65L270 210 115 355"
          stroke="currentColor"
          strokeWidth="44"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>

      <div className="brand-statement__inner">
        <div className="brand-statement__badge" aria-hidden="true">
          PN
        </div>

        <h2 className="brand-statement__headline">
          <span className="brand-statement__line">
            <span className="brand-statement__italic">People</span> judge
          </span>
          <span className="brand-statement__line">your brand</span>
          <span className="brand-statement__highlight">
            <span className="brand-statement__pin brand-statement__pin--tl" aria-hidden="true" />
            before reading a word.
            <span className="brand-statement__pin brand-statement__pin--br" aria-hidden="true" />
          </span>
        </h2>

        <div className="brand-statement__actions">
          <a
            href={EXTERNAL_LINKS.EMAIL}
            className="brand-statement__cta"
          >
            <span>Let&rsquo;s talk</span>
            <span aria-hidden="true">&#9654;</span>
          </a>

          <a
            href={EXTERNAL_LINKS.EMAIL}
            className="brand-statement__email"
          >
            pramudithanadun9@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
