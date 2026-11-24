import type { PageType } from '../../types';
import './about-scrapbook.css';

export interface AboutScrapbookSectionProps {
  onNavigate?: (page: PageType) => void;
}

export default function AboutScrapbookSection({
  onNavigate: _onNavigate,
}: AboutScrapbookSectionProps) {
  return (
    <section
      id="about-dossier"
      className="about-editorial"
      aria-label="About Pramuditha Nadun"
    >
      <div className="about-editorial__inner">
        <p className="about-editorial__handle">@PramudithaN</p>

        <p className="about-editorial__copy">
          Hey, my name is Pramuditha Nadun. I&rsquo;m a Software Engineer based
          in Nugegoda, Sri Lanka.
        </p>

        <p className="about-editorial__copy">
          My journey into software engineering began with curiosity for how
          systems work under the hood. At first, it was the logic and
          architecture that fascinated me &mdash; building scalable React,
          TypeScript, and fintech products with the Fusion X team at LOLC
          Technologies. Over time, that craft expanded into visual design,
          motion, and human-centered interfaces where clean code meets
          intentional aesthetics.
        </p>

        <div className="about-editorial__display" aria-hidden="true">
          <span className="about-editorial__word about-editorial__word--top">
            about
          </span>
          <span className="about-editorial__word about-editorial__word--bottom">
            me
          </span>
        </div>

        <p className="about-editorial__copy">
          Graduated with a BSc (Hons) Software Engineering (Upper Second Class)
          from the University of Westminster / IIT Colombo, where I refined my
          engineering fundamentals alongside progressing from Software
          Engineering Intern (2022&ndash;2023) to Associate Software Engineer
          (2023&ndash;2024) and Software Engineer (2024&ndash;Present).
        </p>

        <div className="about-editorial__signature-wrap">
          <p className="about-editorial__signature">Pramuditha Nadun</p>
        </div>
      </div>
    </section>
  );
}
