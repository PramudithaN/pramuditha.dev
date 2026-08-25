interface TimelineItemProps {
  duration: string;
  title: string;
  company: string;
  role: string;
  accomplishments: string[];
  tech?: string[];
}

export default function TimelineItem({
  duration,
  title,
  company,
  role,
  accomplishments,
  tech
}: TimelineItemProps) {
  return (
    <div className="timeline-item">
      <span className="timeline-dot"></span>
      <div className="timeline-header">
        <span className="timeline-duration">{duration}</span>
        <div className="timeline-title-group">
          <h3 className="timeline-job-title">
            {title} <span className="company-name">@ {company}</span>
          </h3>
          <span className="timeline-role">{role}</span>
        </div>
      </div>
      <div className="timeline-details">
        <div className="timeline-summary">
          <span className="timeline-summary-label">Summary:</span>
          <ul className="timeline-bullet-list">
            {accomplishments.map((acc, aIdx) => (
              <li key={aIdx}>{acc}</li>
            ))}
          </ul>
        </div>
        {Boolean(tech && tech.length > 0) && (
          <div className="timeline-tech-badges">
            {tech?.map((t) => (
              <span key={t} className="tech-badge">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
