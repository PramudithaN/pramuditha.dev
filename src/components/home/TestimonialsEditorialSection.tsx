import { useState } from 'react';
import type { TestimonialItem, ThemeMode } from '../../types';
import {
  defaultAestheticsTestimonials,
  defaultLogicTestimonials,
} from '../../services/contentStore';
import './testimonials-editorial.css';

interface TestimonialsEditorialSectionProps {
  theme: ThemeMode;
}

const SWATCH_COLORS = ['#111111', '#454545', '#7e7e7e', '#b9b9b7', '#dcdcd9'];

export default function TestimonialsEditorialSection({
  theme,
}: TestimonialsEditorialSectionProps) {
  const [selected, setSelected] = useState<TestimonialItem | null>(null);

  const thavinya = defaultLogicTestimonials[0];
  const rishara = defaultLogicTestimonials[1];
  const oshidhie = defaultLogicTestimonials[2];
  const sarah = defaultAestheticsTestimonials[0];
  const michael = defaultAestheticsTestimonials[1];

  return (
    <section
      id="testimonials"
      className={`testimonials-editorial ${
        theme === 'dark' ? 'testimonials-editorial--dark' : ''
      }`}
      aria-label="Testimonials and Peer Endorsements"
    >
      <div className="testimonials-editorial__watermark" aria-hidden="true">
        TESTIMONIALS
      </div>

      <div className="testimonials-editorial__inner">
        <header className="testimonials-editorial__header">
          <div>
            <p className="testimonials-editorial__eyebrow">
              07 // PEER &amp; CLIENT NOTES
            </p>
            <h2 className="testimonials-editorial__title">
              Voices &amp; Endorsements
            </h2>
          </div>
          <p className="testimonials-editorial__subtitle">
            Notes from engineers, analysts, QA leads, and studio clients across
            LOLC Fusion X and freelance creative work. Click any poster to read
            the full recommendation.
          </p>
        </header>

        <div className="testimonials-editorial__grid">
          {/* Poster 1: "Room alone" editorial layout — Thavinya Wijesinghe */}
          <button
            type="button"
            className="te-poster te-poster--offwhite"
            onClick={() => setSelected(thavinya)}
            aria-label={`Read full testimonial from ${thavinya.name}`}
          >
            <div className="te-p1__top">
              <div className="te-p1__swatches" aria-hidden="true">
                {SWATCH_COLORS.map((hex) => (
                  <span key={hex} style={{ backgroundColor: hex }} />
                ))}
              </div>
              <span className="te-p1__index">01</span>
            </div>

            <div className="te-p1__meta-row">
              <div>
                reviewed by: <strong>{thavinya.name}</strong>
                <br />
                Senior Business Analyst
              </div>
              <div>
                team: <strong>LOLC Fusion X</strong>
                <br />
                Frontend &amp; UI/UX
              </div>
            </div>

            <div className="te-p1__arrows">&gt;&gt;&gt;</div>
            <h3 className="te-p1__headline">Bridge</h3>
            <div className="te-p1__subline">
              <span>builder</span>
              <span className="te-p1__dot" aria-hidden="true" />
            </div>

            <div className="te-p1__frame">
              <img
                src="/images/about/UOW.webp"
                alt="Monochrome campus study"
                className="te-bw-img"
                loading="lazy"
              />
              <span className="te-p1__ticks" aria-hidden="true">
                ///
              </span>
            </div>

            <div className="te-p1__footer">
              <p>
                &ldquo;A rare ability to bridge development, design, and the
                user experience — bringing both technical excellence and a human
                touch.&rdquo;
              </p>
              <span className="te-p1__source">LOLC Tech</span>
            </div>
          </button>

          {/* Poster 2: "monochrome" vertical split portrait — Rishara Perera */}
          <button
            type="button"
            className="te-poster te-poster--pure"
            onClick={() => setSelected(rishara)}
            aria-label={`Read full testimonial from ${rishara.name}`}
          >
            <div className="te-p2">
              <div className="te-p2__left">
                <div className="te-p2__vertical-group">
                  <span className="te-p2__vert-caption">
                    CAPTURE
                    <br />
                    PEER NOTES
                  </span>
                  <span className="te-p2__vert-title">mono</span>
                  <span className="te-p2__vert-title">chrome</span>
                </div>

                <div>
                  <div className="te-p2__quotemark" aria-hidden="true">
                    &rdquo;
                  </div>
                  <p className="te-p2__speaker">
                    WHEN RISHARA
                    <br />
                    SAID,,,,
                  </p>
                  <hr className="te-p2__rule" />
                  <p className="te-p2__quote">
                    Reliable, flexible, and takes full ownership — bringing
                    creativity and technical precision to every deadline.
                  </p>
                </div>
              </div>

              <div className="te-p2__photo">
                <img
                  src="/images/about/pramuditha-suit.jpg"
                  alt="Monochrome portrait of Pramuditha Nadun"
                  className="te-bw-img"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="te-p2__credit">
              endorsed by <strong>Rishara.</strong>
            </div>
          </button>

          {/* Poster 3: "lagi dan lagi......" minimal editorial — Oshidhie Peiris */}
          <button
            type="button"
            className="te-poster te-poster--cool"
            onClick={() => setSelected(oshidhie)}
            aria-label={`Read full testimonial from ${oshidhie.name}`}
          >
            <div className="te-p3__mark" aria-hidden="true">
              =
            </div>

            <div className="te-p3__head">
              <div>
                <h3 className="te-p3__headline">
                  Shipped
                  <br />
                  cleanly......
                </h3>
                <p className="te-p3__sub">
                  quality &amp; structure
                  <br />
                  engineering
                </p>
              </div>
              <div>
                <p className="te-p3__right-label">
                  QA
                  <br />
                  perspective
                </p>
                <p className="te-p3__right-copy">
                  {oshidhie.text}
                </p>
              </div>
            </div>

            <div className="te-p3__photo">
              <img
                src="/images/about/pramuditha-f4.jpg"
                alt="Monochrome developer frame"
                className="te-bw-img"
                loading="lazy"
              />
            </div>

            <div className="te-p3__bottom">
              <span>
                LOLC
                <br />
                Fusion X
              </span>
              <span>2024.</span>
            </div>
            <div className="te-p3__credit">
              {oshidhie.name} · {oshidhie.role}
            </div>
          </button>

          {/* Poster 4: "300 days" classic serif client letter — Sarah & Michael */}
          <button
            type="button"
            className="te-poster te-poster--pure"
            onClick={() => setSelected(sarah)}
            aria-label={`Read full testimonial from ${sarah.name}`}
          >
            <h3 className="te-p4__title">Client notes</h3>
            <p className="te-p4__subtitle">creative &amp; brand delivery</p>

            <div className="te-p4__body">
              <div className="te-p4__thumbs">
                <div className="te-p4__thumb">
                  <img
                    src="/images/about/pramuditha-f1.jpg"
                    alt="Monochrome creative frame one"
                    className="te-bw-img"
                    loading="lazy"
                  />
                </div>
                <div className="te-p4__thumb">
                  <img
                    src="/images/about/pramuditha-f3.jpg"
                    alt="Monochrome creative frame two"
                    className="te-bw-img"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="te-p4__notes">
                <p className="te-p4__para">
                  &ldquo;{sarah.text}&rdquo; — {sarah.name} ({sarah.role})
                </p>

                <div className="te-p4__divider">
                  <span>BRAND &amp; MOTION</span>
                </div>

                <p className="te-p4__para">
                  &ldquo;{michael.text}&rdquo; — {michael.name} ({michael.role})
                </p>
              </div>
            </div>

            <div className="te-p4__signoff">
              fiverr &amp; studio clients
              <span className="te-p4__handle">
                @techflow · @urbanbrews · level 2 seller
              </span>
            </div>
          </button>
        </div>
      </div>

      {selected && (
        <div
          className="te-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Full testimonial from ${selected.name}`}
          onClick={() => setSelected(null)}
        >
          <div className="te-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="te-modal__close"
              onClick={() => setSelected(null)}
              aria-label="Close testimonial"
            >
              ×
            </button>
            <p className="te-modal__eyebrow">ENDORSEMENT // FULL NOTE</p>
            <h3 className="te-modal__name">{selected.name}</h3>
            <p className="te-modal__role">{selected.role}</p>
            <p className="te-modal__text">{selected.text}</p>
          </div>
        </div>
      )}
    </section>
  );
}
