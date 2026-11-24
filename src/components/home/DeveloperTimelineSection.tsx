import type { ThemeMode } from '../../types';
import './developer-timeline.css';

export interface DeveloperTimelineSectionProps {
  theme: ThemeMode;
}

interface DeveloperMilestone {
  position: 'top' | 'bottom';
  heading: string;
  org: string;
  description: string;
  stack: string;
  image: string;
  alt: string;
}

/**
 * Strictly developer-related career milestones from developer_journey.md,
 * ordered Present (left) -> Past (right).
 */
const DEVELOPER_MILESTONES: readonly DeveloperMilestone[] = [
  {
    position: 'top',
    heading: 'SOFTWARE ENGINEER · 2024–PRESENT',
    org: 'LOLC Technologies · Fusion X Team',
    description:
      'Full-stack engineering in a hybrid enterprise environment. Mastered React Hooks, Forms, Redux, Ant Design, Spring Boot APIs, RBAC permissions, and QA/UAT/Prod deployments via Jenkins & ArgoCD.',
    stack: 'React · TypeScript · Spring Boot · ArgoCD',
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    alt: 'Full-stack code on screen',
  },
  {
    position: 'bottom',
    heading: 'OPEN SOURCE & TOOLS · 2026',
    org: 'GitHub · VS Code Marketplace',
    description:
      'Engineered reminder.afk (3D Electron + React Three Fiber desktop companion with Web Audio), localization-check (AST i18n VS Code linter), and contributed to openissue.dev.',
    stack: 'Electron · Three.js · AST · Next.js',
    image: '/images/Screenshot 2026-09-03 003623.webp',
    alt: 'reminder.afk 3D desktop companion',
  },
  {
    position: 'top',
    heading: 'AI & ML SYSTEMS · 2025–2026',
    org: 'PetroCast & Brain Tumor Portal',
    description:
      'Built production FastAPI backends for hybrid crude oil forecasting (ARIMA + GRU + XGBoost with news sentiment) and a clinical MRI detection portal with Supabase storage.',
    stack: 'Python · FastAPI · GRU · Supabase',
    image: '/images/projects/brain-tumor-preview.svg',
    alt: 'Brain Tumor Detection AI portal',
  },
  {
    position: 'bottom',
    heading: 'ASSOCIATE SE · 2023–2024',
    org: 'LOLC Technologies · Fusion X Team',
    description:
      'Delivered modular enterprise web interfaces with React, TypeScript, Redux, and AntD while handling CI/CD release pipelines, Git release tagging, and deployment troubleshooting.',
    stack: 'React · Redux · AntD · Jenkins',
    image:
      'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80',
    alt: 'Engineering workstation setup',
  },
  {
    position: 'top',
    heading: 'FREELANCE FULL-STACK · 2022–NOW',
    org: 'Self-Employed',
    description:
      'Architected end-to-end web applications for clients using React, Next.js, Spring Boot, Node.js, and Tailwind CSS, alongside system architecture consulting and CI/CD automation.',
    stack: 'Next.js · Node.js · Tailwind · Vercel',
    image:
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80',
    alt: 'Laptop programming setup',
  },
  {
    position: 'bottom',
    heading: 'TRAINEE SE · MAR 2022–OCT 2023',
    org: 'LOLC Technologies · Fusion Team',
    description:
      'Built responsive React & TypeScript UI components, collaborated on Figma UX flows, and developed Java, Oracle Forms, and Jasper Reports enterprise dashboards.',
    stack: 'Java · Oracle Forms · Jasper · React',
    image: '/images/about/AboutSection.webp',
    alt: 'Developer desk setup',
  },
  {
    position: 'top',
    heading: 'BSc (HONS) SE · 2022–2026',
    org: 'University of Westminster / IIT',
    description:
      'Pursuing BSc (Hons) Software Engineering (Upper Second Class), strengthening foundations in algorithms, distributed systems, databases, and secure software architecture.',
    stack: 'Algorithms · System Design · Security',
    image: '/images/about/UOW.webp',
    alt: 'University of Westminster',
  },
  {
    position: 'bottom',
    heading: 'EARLY FOUNDATIONS · 2019',
    org: 'Mahinda College, Galle',
    description:
      'Wrote first lines of code, learning semantic HTML, CSS layouts, JavaScript fundamentals, and structured problem-solving.',
    stack: 'HTML · CSS · JavaScript',
    image:
      'https://images.unsplash.com/photo-1762681290802-aa3e6d315ac9?auto=format&fit=crop&w=600&q=80',
    alt: 'Mechanical keyboard switches',
  },
];

export default function DeveloperTimelineSection({
  theme,
}: DeveloperTimelineSectionProps) {
  return (
    <section
      className="dev-journey"
      data-theme={theme}
      aria-label="Developer Journey Timeline"
    >
      <div className="dev-journey__inner">
        <header className="dev-journey__header">
          <h2 className="dev-journey__title">
            PRAMUDITHA NADUN · DEVELOPER JOURNEY
          </h2>
          <p className="dev-journey__subtitle">
            Software engineering timeline from Present (LOLC Fusion X) back to
            2019 foundations.
          </p>
        </header>

        <div className="dev-journey__timeline">
          {DEVELOPER_MILESTONES.map((item) => (
            <article key={item.heading} className="dev-journey__column">
              {/* Top Callout Slot */}
              <div className="dev-journey__slot">
                {item.position === 'top' && (
                  <div className="dev-journey__callout dev-journey__callout--top">
                    <h3 className="dev-journey__milestone-title">{item.heading}</h3>
                    <p className="dev-journey__milestone-org">{item.org}</p>
                    <p className="dev-journey__milestone-desc">{item.description}</p>
                    <p className="dev-journey__milestone-stack">{item.stack}</p>
                  </div>
                )}
              </div>

              {/* Center Monochrome Square Tile */}
              <div className="dev-journey__photo-box">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="dev-journey__photo"
                  loading="lazy"
                />
              </div>

              {/* Bottom Callout Slot */}
              <div className="dev-journey__slot dev-journey__slot--bottom">
                {item.position === 'bottom' && (
                  <div className="dev-journey__callout dev-journey__callout--bottom">
                    <h3 className="dev-journey__milestone-title">{item.heading}</h3>
                    <p className="dev-journey__milestone-org">{item.org}</p>
                    <p className="dev-journey__milestone-desc">{item.description}</p>
                    <p className="dev-journey__milestone-stack">{item.stack}</p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <footer className="dev-journey__footnotes">
          <ol>
            <li>Frontend: React 19, TypeScript, Next.js, Astro, Redux, Ant Design</li>
            <li>Backend: Java, Spring Boot, Python, FastAPI, Node.js, Oracle Forms</li>
            <li>DevOps &amp; Cloud: Jenkins, ArgoCD, Git, Vercel, Render, Supabase</li>
            <li>Tooling: VS Code API, Electron, Three.js / R3F, Jasper Reports</li>
            <li>Education: BSc (Hons) Software Engineering · UOW / IIT Colombo</li>
          </ol>
        </footer>
      </div>
    </section>
  );
}
