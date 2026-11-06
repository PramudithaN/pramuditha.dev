import { motion } from 'framer-motion';

interface TimelineItemProps {
  duration: string;
  title: string;
  company: string;
  role: string;
  accomplishments: string[];
  tech?: string[];
  index?: number;
}

export default function TimelineItem({
  duration,
  title,
  company,
  role,
  accomplishments,
  tech,
  index = 0
}: TimelineItemProps) {
  return (
    <motion.div
      className="timeline-item"
      initial={{ opacity: 0, y: 38, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay: Math.min((index % 3) * 0.08, 0.2),
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ y: -4 }}
    >
      <div className="timeline-dot-wrapper">
        <span className="timeline-dot" />
        <span className="timeline-dot-pulse" />
      </div>
      <div className="timeline-header">
        <div className="timeline-meta-row">
          <span className="timeline-duration">{duration}</span>
          <span className="timeline-milestone-pill">PHASE 0{index + 1}</span>
        </div>
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
    </motion.div>
  );
}
