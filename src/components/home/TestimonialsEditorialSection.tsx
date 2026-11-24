import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { TestimonialItem, ThemeMode } from '../../types';
import { defaultLogicTestimonials } from '../../services/contentStore';
import './testimonials-editorial.css';

interface TestimonialsEditorialSectionProps {
  theme: ThemeMode;
  testimonials?: TestimonialItem[];
}

export default function TestimonialsEditorialSection({
  theme,
  testimonials,
}: TestimonialsEditorialSectionProps) {
  const items =
    testimonials && testimonials.length > 0
      ? testimonials
      : defaultLogicTestimonials;

  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = activeIndex < items.length ? activeIndex : 0;
  const activeItem = items[safeIndex];

  if (!activeItem) return null;

  return (
    <section
      id="testimonials"
      className={`testimonials-speak ${
        theme === 'dark' ? 'testimonials-speak--dark' : ''
      }`}
      aria-label="Peer Testimonials"
    >
      <div className="testimonials-speak__inner">
        <h2 className="testimonials-speak__heading">Colleagues speak</h2>

        <div className="testimonials-speak__stage">
          <div className="testimonials-speak__quote-row">
            <span className="testimonials-speak__mark" aria-hidden="true">
              &ldquo;
            </span>

            <AnimatePresence mode="wait">
              <motion.p
                key={activeItem.id || activeItem.name}
                className="testimonials-speak__text"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                {activeItem.text}
              </motion.p>
            </AnimatePresence>
          </div>

          <div
            className="testimonials-speak__selector"
            role="tablist"
            aria-label="Select colleague testimonial"
          >
            {items.map((person, idx) => {
              const isActive = idx === safeIndex;
              return (
                <button
                  key={person.id || person.name}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`${person.name} — ${person.role}`}
                  title={person.name}
                  className={`testimonials-speak__item ${
                    isActive ? 'is-active' : ''
                  }`}
                  onClick={() => setActiveIndex(idx)}
                >
                  <img
                    src={person.avatarUrl}
                    alt={person.name}
                    className="testimonials-speak__avatar"
                    loading="lazy"
                  />
                  {isActive && (
                    <span className="testimonials-speak__meta">
                      <span className="testimonials-speak__name">
                        {person.name}
                      </span>
                      <span className="testimonials-speak__role">
                        {person.role}
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
