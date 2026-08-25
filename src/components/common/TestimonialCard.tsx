import { useState } from 'react';
import type { TestimonialItem } from '../../types';

interface TestimonialCardProps extends Partial<TestimonialItem> {
  name: string;
  role: string;
  avatarUrl: string;
  text: string;
  withToggle?: boolean;
}

export default function TestimonialCard({
  name,
  role,
  avatarUrl,
  text,
  withToggle = true
}: TestimonialCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="testimonial-card">
      {withToggle ? (
        <div className="testimonial-content-wrapper">
          <p className={`testimonial-text ${!isExpanded ? 'collapsed' : 'expanded'}`}>
            "{text}"
          </p>
          <button
            type="button"
            className="testimonial-toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        </div>
      ) : (
        <p className="testimonial-text">"{text}"</p>
      )}

      <div className="testimonial-author">
        <img src={avatarUrl} alt={`${name} testimonial photo`} className="testimonial-avatar" />
        <div className="testimonial-author-info">
          <div className="testimonial-name">{name}</div>
          <div className="testimonial-role">{role}</div>
        </div>
      </div>
    </div>
  );
}
