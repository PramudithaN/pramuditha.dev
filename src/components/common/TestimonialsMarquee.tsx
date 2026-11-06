import type { TestimonialItem } from '../../types';
import './testimonials-marquee.css';

interface TestimonialsMarqueeProps {
  testimonials: TestimonialItem[];
  speed?: number;
}

export default function TestimonialsMarquee({
  testimonials,
  speed = 36
}: TestimonialsMarqueeProps) {
  if (!testimonials || testimonials.length === 0) return null;

  // Duplicate items to ensure a seamless -50% infinite marquee loop
  const repeatCount = Math.max(2, Math.ceil(6 / testimonials.length));
  const trackItems = Array.from({ length: repeatCount * 2 }).flatMap(() => testimonials);

  return (
    <div
      className="testimonials-marquee-wrapper"
      role="region"
      aria-label="Customer feedback marquee"
    >
      <div
        className="testimonials-marquee-track"
        style={{ animationDuration: `${speed}s` }}
      >
        {trackItems.map((t, idx) => (
          <div key={`${t.id || t.name}-${idx}`} className="testimonial-marquee-card">
            <p className="testimonial-marquee-quote">"{t.text}"</p>
            <div className="testimonial-marquee-author">
              <img
                src={t.avatarUrl}
                alt={`${t.name} avatar`}
                className="testimonial-marquee-avatar"
                loading="lazy"
              />
              <div className="testimonial-marquee-meta">
                <span className="testimonial-marquee-name">{t.name}</span>
                <span className="testimonial-marquee-role">{t.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
