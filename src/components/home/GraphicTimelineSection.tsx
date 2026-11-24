import { FALLBACK_PIN_IMAGES } from '../../constants/pinterestFallback';
import './graphic-timeline.css';

interface CreativeMilestone {
  year: string;
  title: string;
  role: string;
  description: string;
  image: string;
  /** Dashed stem height in px creates the staggered wave silhouette */
  stemHeight: number;
}

const CREATIVE_MILESTONES: readonly CreativeMilestone[] = [
  {
    year: '2016–2022',
    title: 'Web Team MCG',
    role: 'Editor · School Club',
    description:
      'Created extensive Photoshop edits and visual assets for school events, managed Big Match live broadcasts, and mentored junior creators.',
    image:
      FALLBACK_PIN_IMAGES.find((p) => p.board === 'flyers')?.src ||
      '/images/about/AboutSection.webp',
    stemHeight: 92,
  },
  {
    year: '2020–2024',
    title: 'Fiverr Level 2',
    role: 'Graphic Designer · 4.9★',
    description:
      'Delivered high-impact brand identities, digital assets, and print media designs for diverse global clients.',
    image:
      FALLBACK_PIN_IMAGES.find((p) => p.board === 'logos')?.src ||
      '/images/about/UOW.webp',
    stemHeight: 54,
  },
  {
    year: '2022–2023',
    title: 'UI/UX & Figma',
    role: 'LOLC Fusion Team',
    description:
      'Designed interactive Figma prototypes and enterprise UI layouts, bridging visual craft with frontend implementation.',
    image:
      FALLBACK_PIN_IMAGES.filter((p) => p.board === 'flyers')[1]?.src ||
      '/images/about/AboutSection.webp',
    stemHeight: 24,
  },
  {
    year: '2023–2024',
    title: 'Rotaract IIT',
    role: 'Graphic Designer',
    description:
      'Crafted visual campaigns and promotional materials aligned with Rotaract branding to boost student engagement.',
    image:
      FALLBACK_PIN_IMAGES.filter((p) => p.board === 'flyers')[2]?.src ||
      '/images/about/UOW.webp',
    stemHeight: 86,
  },
  {
    year: '2023–2025',
    title: 'Sentered Media',
    role: 'Video Editor',
    description:
      'Edited fast-paced, high-retention ad campaigns with marketing teams, focusing on creative pacing and brand consistency.',
    image:
      FALLBACK_PIN_IMAGES.find((p) => p.board === 'manipulations')?.src ||
      '/images/about/AboutSection.webp',
    stemHeight: 52,
  },
  {
    year: '2024–2025',
    title: 'VFX & Motion',
    role: 'Creative Direction',
    description:
      'Explored CGI compositing, color grading, and motion graphics alongside interactive 3D web experiences.',
    image:
      FALLBACK_PIN_IMAGES.filter((p) => p.board === 'manipulations')[1]?.src ||
      '/images/about/AboutSection.webp',
    stemHeight: 98,
  },
  {
    year: '2026',
    title: 'Editorial Craft',
    role: 'pramuditha.dev',
    description:
      'Unified graphic design sensibilities, typography, and motion systems into an editorial software engineering flagship.',
    image:
      FALLBACK_PIN_IMAGES.filter((p) => p.board === 'manipulations')[2]?.src ||
      '/images/about/pramuditha-suit.jpg',
    stemHeight: 32,
  },
];

export default function GraphicTimelineSection() {
  return (
    <section
      className="graphic-timeline"
      aria-label="Graphic Designer Timeline"
    >
      <div className="graphic-timeline__inner">
        <header className="graphic-timeline__header">
          <h2 className="graphic-timeline__title">Graphic Designer Timeline</h2>
        </header>

        <div className="graphic-timeline__scroll">
          {/* Top Staggered Photo Strips + Dashed Stems */}
          <div className="graphic-timeline__track">
            {CREATIVE_MILESTONES.map((item) => (
              <div key={item.title} className="graphic-timeline__col-top">
                <div className="graphic-timeline__strip-wrap">
                  <p className="graphic-timeline__year">{item.year}</p>
                  <div className="graphic-timeline__strip">
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </div>
                </div>
                <div
                  className="graphic-timeline__stem"
                  style={{ height: `${item.stemHeight}px` }}
                  aria-hidden="true"
                />
                <span className="graphic-timeline__dot" aria-hidden="true" />
              </div>
            ))}
          </div>

          {/* Horizontal Baseline Axis */}
          <div className="graphic-timeline__axis-wrap" aria-hidden="true">
            <div className="graphic-timeline__axis" />
          </div>

          {/* Bottom Milestone Descriptions */}
          <div className="graphic-timeline__details-row">
            {CREATIVE_MILESTONES.map((item) => (
              <article key={item.title} className="graphic-timeline__event">
                <h3 className="graphic-timeline__event-title">{item.title}</h3>
                <p className="graphic-timeline__event-role">{item.role}</p>
                <p className="graphic-timeline__event-desc">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
