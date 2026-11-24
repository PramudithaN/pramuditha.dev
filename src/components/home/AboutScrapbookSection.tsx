import type { PageType } from '../../types';
import './about-scrapbook.css';

export interface AboutScrapbookSectionProps {
  onNavigate?: (page: PageType) => void;
}

export default function AboutScrapbookSection({
  onNavigate: _onNavigate,
}: AboutScrapbookSectionProps) {
  return (
    <div id="about-dossier" className="about-editorial">
      {/* 1. Acid-Lime & Black Square Suit Portrait Poster */}
      <section className="about-poster" aria-label="Software Engineer Poster">
        <div className="about-poster__inner">
          <p className="about-poster__eyebrow">
            <span>SOFTWARE ENGINEER | NUGEGODA, LK</span>
            <span className="about-poster__asterisk" aria-hidden="true">
              &#10035;
            </span>
          </p>

          <div className="about-poster__stage">
            <div className="about-poster__lime-wedge" aria-hidden="true" />
            <div className="about-poster__black-box" aria-hidden="true" />
            <div className="about-poster__ribbon" aria-hidden="true">
              LOLC
              <br />
              FUSION X
            </div>
            <div className="about-poster__portrait-wrap">
              <img
                src="/images/about/pramuditha-suit.jpg"
                alt="Pramuditha Nadun — Software Engineer"
                className="about-poster__portrait"
                loading="lazy"
              />
            </div>
          </div>

          <div className="about-poster__title-stack">
            <h2 className="about-poster__giant">ENGINEER</h2>
            <span className="about-poster__connector">WITH</span>
            <p className="about-poster__wide">INTENTION</p>
          </div>

          <p className="about-poster__name">PRAMUDITHA NADUN</p>

          <div className="about-poster__monogram" aria-hidden="true">
            PN
          </div>
          <p className="about-poster__org">LOLC TECHNOLOGIES · FUSION X</p>
          <p className="about-poster__org-sub">
            BSc (HONS) SOFTWARE ENGINEERING · UOW / IIT COLOMBO
          </p>
        </div>
      </section>

      {/* 2. Matte-Charcoal Editorial Bio & Handwritten Signature */}
      <section className="about-bio" aria-label="About Pramuditha Nadun">
        <div className="about-editorial__inner">
          <p className="about-editorial__handle">@PramudithaN</p>

          <p className="about-editorial__copy">
            Hey, my name is Pramuditha Nadun. I&rsquo;m a Software Engineer
            based in Nugegoda, Sri Lanka.
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
    </div>
  );
}
