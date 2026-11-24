import { useId, useState } from 'react';
import type { ThemeMode } from '../../types';
import './developer-timeline.css';

export interface DeveloperTimelineSectionProps {
  theme: ThemeMode;
}

interface TimelineFin {
  label: string;
  title: string;
  year: string;
  org: string;
  summary: string;
  accomplishments: readonly string[];
  tech: readonly string[];
  /** Pose index (0..3) for developer-in-front-of-laptop silhouette */
  pose: 0 | 1 | 2 | 3;
}

/**
 * 22 chronological milestones ordered PRESENT (left) -> PAST (right),
 * using authentic details from developer_journey.md & contentStore.ts.
 */
const TIMELINE_FINS: readonly TimelineFin[] = [
  {
    label: 'software engineer · present',
    title: 'Software Engineer',
    year: '2024 – Present',
    org: 'LOLC Technologies · Fusion X Team',
    summary: 'Full-stack Software Engineer architecting scalable enterprise applications in a hybrid environment.',
    accomplishments: [
      'Mastered React and TypeScript with deep understanding of Hooks and Forms.',
      'Handled deployments to QA, UAT, and Production environments via Jenkins and ArgoCD.',
      'Managed screen permissions, user access control, and Git release tagging.',
    ],
    tech: ['React', 'TypeScript', 'Redux', 'Ant Design', 'Spring Boot', 'Jenkins', 'ArgoCD'],
    pose: 0,
  },
  {
    label: 'pramuditha.dev · 2026',
    title: 'Portfolio Revamp & Architecture',
    year: '2026',
    org: 'Personal Flagship',
    summary: 'Re-engineered portfolio uniting systems logic, 3D motion, and editorial visual craft.',
    accomplishments: [
      'Built modular React 19 + TypeScript components with zero-warning oxlint & strict tsc.',
      'Integrated live GitHub repository feeds and Pinterest visual archives.',
    ],
    tech: ['React 19', 'TypeScript', 'Vite', 'Three.js'],
    pose: 1,
  },
  {
    label: 'reminder.afk · 2026',
    title: 'reminder.afk · 3D Break Companion',
    year: '2026',
    org: 'Open Source · Desktop App',
    summary: 'Interactive 3D ergonomic break assistant built to combat eye strain and posture fatigue.',
    accomplishments: [
      'Engineered animated 3D robot companions with React Three Fiber in Electron.',
      'Synthesized procedural ambient chimes using the Web Audio API.',
    ],
    tech: ['Electron', 'React 19', 'Three.js / R3F', 'Web Audio API'],
    pose: 2,
  },
  {
    label: 'localization check',
    title: 'Localization Check VS Code Extension',
    year: '2026',
    org: 'VS Code Marketplace',
    summary: 'Developer tooling that flags hardcoded user-facing strings in JS/TS files via AST heuristics.',
    accomplishments: [
      'Automated i18n key validation across changed workspace files.',
      'Published and maintained for TypeScript and React codebases.',
    ],
    tech: ['TypeScript', 'JavaScript', 'VS Code API', 'AST'],
    pose: 0,
  },
  {
    label: 'openissue.dev',
    title: 'OpenIssue.dev Contributor',
    year: '2026',
    org: 'Open Source Ecosystem',
    summary: 'Contributed to curated open-source GitHub issue discovery and developer tooling.',
    accomplishments: [
      'Collaborated on frontend architecture and repository filtering workflows.',
    ],
    tech: ['Next.js', 'TypeScript', 'GitHub API'],
    pose: 3,
  },
  {
    label: 'drag2place · canvas',
    title: 'Drag2Place Visual Workspace',
    year: '2026',
    org: 'Open Source',
    summary: 'Infinite freeform canvas inspired by Milanote for organizing ideas and moodboards.',
    accomplishments: [
      'Implemented interactive drag-and-drop spatial boards and project tracking.',
    ],
    tech: ['TypeScript', 'React', 'Canvas'],
    pose: 1,
  },
  {
    label: 'bsc (hons) · 2026',
    title: 'BSc (Hons) Software Engineering',
    year: '2022 – 2026',
    org: 'University of Westminster / IIT Colombo',
    summary: 'Completing BSc (Hons) Software Engineering (Upper Second Class).',
    accomplishments: [
      'Applied software architecture, algorithms, and security principles to real-world systems.',
    ],
    tech: ['Software Engineering', 'System Design', 'Security'],
    pose: 2,
  },
  {
    label: 'petrocast · ml',
    title: 'PetroCast Forecasting Backend',
    year: '2025 – 2026',
    org: 'AI / ML Engineering',
    summary: 'Production-grade FastAPI backend for crude oil price forecasting (ARIMA + GRU + XGBoost).',
    accomplishments: [
      'Integrated strictly lagged live news sentiment into hybrid time-series forecasting.',
    ],
    tech: ['Python', 'FastAPI', 'ARIMA', 'GRU', 'XGBoost'],
    pose: 0,
  },
  {
    label: 'brain tumor ai',
    title: 'Brain Tumor Detection Portal',
    year: '2025',
    org: 'AI Research & Web Portal',
    summary: 'FastAPI and React clinical portal providing ML-generated brain MRI tumor predictions.',
    accomplishments: [
      'Built deep-learning inference API with guest access and Supabase history storage.',
    ],
    tech: ['Python', 'FastAPI', 'React', 'Supabase'],
    pose: 3,
  },
  {
    label: '11labsm · audio',
    title: '11labsM Localization Pipeline',
    year: '2025',
    org: 'Automation Tooling',
    summary: 'Automated translation and sequential voice synthesis pipeline across 17 languages.',
    accomplishments: [
      'Built multi-language translation and ElevenLabs audio generation workflow.',
    ],
    tech: ['Python', 'ElevenLabs API', 'Automation'],
    pose: 1,
  },
  {
    label: 'jenkins & argocd',
    title: 'CI/CD & Release Engineering',
    year: '2024',
    org: 'LOLC Technologies · Fusion X',
    summary: 'Managed automated delivery pipelines and environment promotions across QA, UAT, and Prod.',
    accomplishments: [
      'Monitored deployment pipelines and troubleshot release issues.',
      'Standardized Git versioning, branching, and release tagging.',
    ],
    tech: ['Jenkins', 'ArgoCD', 'Git', 'CI/CD'],
    pose: 2,
  },
  {
    label: 'spring boot apis',
    title: 'Backend & Access Control',
    year: '2023 – 2024',
    org: 'LOLC Technologies · Fusion X',
    summary: 'Applied Spring Boot for enterprise backend APIs, screen permissions, and RBAC.',
    accomplishments: [
      'Implemented screen-level permissions and secure user access control.',
    ],
    tech: ['Spring Boot', 'Java', 'RBAC', 'REST APIs'],
    pose: 0,
  },
  {
    label: 'associate se',
    title: 'Associate Software Engineer',
    year: '2023 – 2024',
    org: 'LOLC Technologies · Fusion X Team',
    summary: 'Promoted to Associate Software Engineer building enterprise financial web platforms.',
    accomplishments: [
      'Built modern UI systems with Redux state management and Ant Design (AntD).',
      'Collaborated on Figma design refinements and UX improvements.',
    ],
    tech: ['React', 'TypeScript', 'Redux', 'Ant Design', 'Figma'],
    pose: 3,
  },
  {
    label: 'astro & vercel',
    title: 'Static & Edge Web Craft',
    year: '2023 – 2025',
    org: 'Independent Projects',
    summary: 'Shipped high-speed web applications using Astro, Next.js, Tailwind CSS, Vercel, and Render.',
    accomplishments: [
      'Delivered zero-clutter, mobile-first static and full-stack deployments.',
    ],
    tech: ['Astro', 'Next.js', 'Tailwind CSS', 'Vercel', 'Render'],
    pose: 1,
  },
  {
    label: 'freelance fullstack',
    title: 'Independent Full-Stack Developer',
    year: '2022 – Present',
    org: 'Self-Employed',
    summary: 'Architected end-to-end full-stack applications and CI/CD automation for freelance clients.',
    accomplishments: [
      'Delivered custom React, Next.js, Spring Boot, and Node.js solutions.',
      'Provided technical consultations on system architecture and stack selection.',
    ],
    tech: ['React', 'Next.js', 'Spring Boot', 'Node.js'],
    pose: 2,
  },
  {
    label: 'java & oracle',
    title: 'Enterprise Reporting & Backend',
    year: '2022 – 2023',
    org: 'LOLC Fusion Team',
    summary: 'Developed and maintained data-driven business reports and enterprise forms.',
    accomplishments: [
      'Worked with Java, Oracle Forms, and Jasper Reports for business decision-making.',
    ],
    tech: ['Java', 'Oracle Forms', 'Jasper Reports'],
    pose: 0,
  },
  {
    label: 'react & typescript',
    title: 'Frontend Engineering Growth',
    year: '2022 – 2023',
    org: 'LOLC Fusion Team',
    summary: 'Transitioned into production frontend development with React and TypeScript.',
    accomplishments: [
      'Implemented interactive UI components and responsive enterprise layouts.',
    ],
    tech: ['React', 'TypeScript', 'CSS3'],
    pose: 3,
  },
  {
    label: 'figma & ui/ux',
    title: 'UI/UX Design & Prototyping',
    year: '2022',
    org: 'LOLC Fusion Team',
    summary: 'Worked within the UI/UX team crafting Figma designs and improving user experience.',
    accomplishments: [
      'Created wireframes, design tokens, and interactive prototypes.',
    ],
    tech: ['Figma', 'UI/UX', 'Design Systems'],
    pose: 1,
  },
  {
    label: 'trainee se @ lolc',
    title: 'Software Engineering Intern / Trainee SE',
    year: 'Mar 2022 – Oct 2023',
    org: 'LOLC Technologies · Fusion Team',
    summary: 'Began industry software engineering career on the LOLC Fusion Team.',
    accomplishments: [
      'Collaborated with cross-functional teams to deliver enterprise software solutions.',
    ],
    tech: ['React', 'TypeScript', 'Java', 'Figma'],
    pose: 2,
  },
  {
    label: 'iit colombo',
    title: 'Joined IIT Colombo / UOW',
    year: '2022',
    org: 'Informatics Institute of Technology',
    summary: 'Enrolled in BSc (Hons) Software Engineering affiliated with University of Westminster.',
    accomplishments: [
      'Built strong academic foundations in OOP, databases, and software design.',
    ],
    tech: ['Java', 'Python', 'Algorithms'],
    pose: 0,
  },
  {
    label: 'fiverr & design',
    title: 'Graphic Designer · Level 2 Seller',
    year: '2020 – 2024',
    org: 'Fiverr (4.9 Rating)',
    summary: 'Delivered brand identities, flyers, and visual assets for global clients.',
    accomplishments: [
      'Achieved Level 2 Seller status maintaining a 4.9 average client rating.',
    ],
    tech: ['Brand Identity', 'Print Media', 'Visual Design'],
    pose: 1,
  },
  {
    label: 'mahinda college',
    title: 'Early Foundations',
    year: '2019',
    org: 'Mahinda College, Galle',
    summary: 'Built early programming logic, web basics, and creative problem-solving.',
    accomplishments: [
      'Wrote first lines of HTML, CSS, and JavaScript.',
    ],
    tech: ['HTML', 'CSS', 'JavaScript'],
    pose: 2,
  },
];

/**
 * Renders 4 distinct developer-in-front-of-laptop silhouette poses.
 */
function DeveloperLaptopSilhouette({
  x,
  baseY,
  pose,
  color,
}: {
  x: number;
  baseY: number;
  pose: 0 | 1 | 2 | 3;
  color: string;
}) {
  if (pose === 0) {
    // Pose 0: Seated upright at desk typing on open laptop
    return (
      <g fill={color} opacity="0.92" aria-hidden="true">
        {/* Chair */}
        <path d={`M${x},${baseY} L${x},${baseY - 11} L${x + 8},${baseY - 11} L${x + 8},${baseY} L${x + 6.5},${baseY} L${x + 6.5},${baseY - 9} L${x + 1.5},${baseY - 9} L${x + 1.5},${baseY} Z`} />
        {/* Person */}
        <circle cx={x + 5} cy={baseY - 21} r="2.3" />
        <path d={`M${x + 2},${baseY - 10} C${x + 2},${baseY - 15} ${x + 3.5},${baseY - 18.5} ${x + 6},${baseY - 18.5} L${x + 11},${baseY - 13} L${x + 14.5},${baseY - 12} L${x + 14.5},${baseY - 10.5} L${x + 9.5},${baseY - 11.5} L${x + 8},${baseY - 9.5} L${x + 12.5},${baseY - 9} L${x + 12.5},${baseY} L${x + 10.5},${baseY} L${x + 10.5},${baseY - 7.5} L${x + 2},${baseY - 8} Z`} />
        {/* Desk + Laptop */}
        <rect x={x + 13} y={baseY - 10.5} width="14" height="1.6" />
        <rect x={x + 24} y={baseY - 9} width="1.6" height="9" />
        <polygon points={`${x + 14.5},${baseY - 10.5} ${x + 22},${baseY - 10.5} ${x + 24.5},${baseY - 18} ${x + 23},${baseY - 18} ${x + 20.8},${baseY - 11.8} ${x + 14.5},${baseY - 11.8}`} />
      </g>
    );
  }

  if (pose === 1) {
    // Pose 1: Leaning forward intensely over laptop
    return (
      <g fill={color} opacity="0.9" aria-hidden="true">
        <path d={`M${x + 1},${baseY} L${x + 1},${baseY - 9} L${x + 7},${baseY - 9} L${x + 7},${baseY} L${x + 5.5},${baseY} L${x + 5.5},${baseY - 7.5} L${x + 2.5},${baseY - 7.5} L${x + 2.5},${baseY} Z`} />
        <circle cx={x + 8} cy={baseY - 19} r="2.2" />
        <path d={`M${x + 2},${baseY - 8.5} L${x + 6.5},${baseY - 16.8} L${x + 14},${baseY - 11.5} L${x + 14},${baseY - 10} L${x + 8},${baseY - 11} L${x + 11.5},${baseY - 8} L${x + 11.5},${baseY} L${x + 9.5},${baseY} L${x + 9.5},${baseY - 7} L${x + 2},${baseY - 7} Z`} />
        <rect x={x + 12.5} y={baseY - 10} width="13" height="1.5" />
        <rect x={x + 22.5} y={baseY - 8.5} width="1.5" height="8.5" />
        <polygon points={`${x + 14},${baseY - 10} ${x + 21},${baseY - 10} ${x + 23},${baseY - 16.5} ${x + 21.5},${baseY - 16.5} ${x + 19.8},${baseY - 11.2} ${x + 14},${baseY - 11.2}`} />
      </g>
    );
  }

  if (pose === 2) {
    // Pose 2: Seated relaxed / thinking with hand near chin in front of laptop
    return (
      <g fill={color} opacity="0.88" aria-hidden="true">
        <path d={`M${x},${baseY} L${x},${baseY - 11} L${x + 8},${baseY - 11} L${x + 8},${baseY} L${x + 6.5},${baseY} L${x + 6.5},${baseY - 9} L${x + 1.5},${baseY - 9} L${x + 1.5},${baseY} Z`} />
        <circle cx={x + 4} cy={baseY - 21.5} r="2.2" />
        <path d={`M${x + 1.5},${baseY - 10} L${x + 3.5},${baseY - 19} L${x + 7.5},${baseY - 18.5} L${x + 6},${baseY - 15} L${x + 10.5},${baseY - 11.5} L${x + 12.5},${baseY - 9} L${x + 12.5},${baseY} L${x + 10.5},${baseY} L${x + 10.5},${baseY - 7.5} L${x + 1.5},${baseY - 8} Z`} />
        <rect x={x + 12.5} y={baseY - 10.5} width="13" height="1.5" />
        <rect x={x + 22.5} y={baseY - 9} width="1.5" height="9" />
        <polygon points={`${x + 14},${baseY - 10.5} ${x + 20.5},${baseY - 10.5} ${x + 22.5},${baseY - 17.5} ${x + 21},${baseY - 17.5} ${x + 19.3},${baseY - 11.8} ${x + 14},${baseY - 11.8}`} />
      </g>
    );
  }

  // Pose 3: Standing at high desk with laptop
  return (
    <g fill={color} opacity="0.9" aria-hidden="true">
      <circle cx={x + 5} cy={baseY - 26} r="2.2" />
      <path d={`M${x + 3},${baseY - 23.5} L${x + 7.5},${baseY - 23.5} L${x + 12.5},${baseY - 16.5} L${x + 12.5},${baseY - 15} L${x + 7},${baseY - 17.5} L${x + 7.5},${baseY} L${x + 5.5},${baseY} L${x + 5},${baseY - 11} L${x + 4},${baseY} L${x + 2.2},${baseY} Z`} />
      <rect x={x + 11.5} y={baseY - 15} width="13" height="1.6" />
      <rect x={x + 21.5} y={baseY - 13.5} width="1.6" height="13.5" />
      <polygon points={`${x + 12.5},${baseY - 15} ${x + 19.5},${baseY - 15} ${x + 21.5},${baseY - 22} ${x + 20},${baseY - 22} ${x + 18.3},${baseY - 16.2} ${x + 12.5},${baseY - 16.2}`} />
    </g>
  );
}

export default function DeveloperTimelineSection({
  theme,
}: DeveloperTimelineSectionProps) {
  const uid = useId().replace(/:/g, '');
  // Default to index 0 (Present · Software Engineer @ LOLC Fusion X on the left)
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const activeFin = TIMELINE_FINS[activeIdx] || TIMELINE_FINS[0];
  const spectrumGradId = `dt-spectrum-${uid}`;

  const startX = 82;
  const finCount = TIMELINE_FINS.length;
  const stepX = 38.5;
  const finWidth = 56;
  const baseY = 274;
  const finHeight = 128;
  const finSlantDrop = 26;
  const isDark = theme === 'dark';
  const silMainColor = isDark ? '#ececf0' : '#141416';

  return (
    <section
      className="dev-timeline"
      data-theme={theme}
      aria-label="Developer Journey Timeline"
    >
      <div className="dev-timeline__floor" aria-hidden="true" />

      <div className="dev-timeline__inner">
        <p className="dev-timeline__eyebrow">05 / Developer Journey (Present — 2019)</p>

        <div className="dev-timeline__diagram">
          <svg
            className="dev-timeline__svg"
            viewBox="0 0 1020 320"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Architectural perspective developer timeline from present on left to 2019 on right"
          >
            <defs>
              <linearGradient id={spectrumGradId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={isDark ? '#f0f0f2' : '#0c0c0e'} />
                <stop offset="100%" stopColor={isDark ? '#0f0f11' : '#ffffff'} />
              </linearGradient>

              {TIMELINE_FINS.map((_, idx) => {
                const t = idx / (finCount - 1);
                const baseAlpha = Math.max(0.05, 0.94 * Math.pow(1 - t, 1.38));
                const topAlpha = baseAlpha * 0.62;
                const rgb = isDark ? '240, 240, 244' : '12, 12, 14';
                return (
                  <linearGradient
                    key={idx}
                    id={`fin-grad-${uid}-${idx}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={`rgba(${rgb}, ${topAlpha.toFixed(3)})`} />
                    <stop offset="100%" stopColor={`rgba(${rgb}, ${baseAlpha.toFixed(3)})`} />
                  </linearGradient>
                );
              })}
            </defs>

            {/* Developer seated at laptop outside Fin 0 (far-left Present anchor) */}
            <DeveloperLaptopSilhouette x={44} baseY={baseY} pose={0} color={silMainColor} />

            {/* Thin vertical doorway line between Fin 0 and Fin 1 */}
            <line
              x1={startX + 34}
              y1={baseY - finHeight}
              x2={startX + 34}
              y2={baseY}
              stroke={silMainColor}
              strokeWidth="1.2"
              opacity="0.85"
            />

            {/* Standing developer at laptop inside the doorway gap */}
            <DeveloperLaptopSilhouette
              x={startX + 38}
              baseY={baseY}
              pose={3}
              color={silMainColor}
            />

            {/* 22 Overlapping Architectural Perspective Fins (Present -> Past) */}
            {TIMELINE_FINS.map((fin, idx) => {
              const gapOffset = idx === 0 ? 0 : 22;
              const x = startX + idx * stepX + gapOffset;
              const w = idx === 0 ? 22 : finWidth;
              const isActive = idx === activeIdx;

              const points =
                idx === 0
                  ? `${x},${baseY - finHeight} ${x + w},${baseY - finHeight + finSlantDrop} ${x + w},${baseY} ${x},${baseY}`
                  : `${x},${baseY - finHeight + finSlantDrop} ${x + w},${baseY - finHeight} ${x + w},${baseY} ${x},${baseY}`;

              const t = idx / (finCount - 1);
              const density = Math.max(0.05, 0.94 * Math.pow(1 - t, 1.38));

              const innerSilColor = isDark
                ? density > 0.48
                  ? '#101012'
                  : '#e8e8ec'
                : density > 0.48
                  ? '#e6e6ea'
                  : '#18181b';

              return (
                <g
                  key={fin.label}
                  className={`dev-timeline__fin-group ${
                    isActive ? 'dev-timeline__fin-group--active' : ''
                  }`}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onClick={() => setActiveIdx(idx)}
                >
                  {/* Vertical Rotated Italic Serif Label */}
                  <text
                    className="dev-timeline__fin-label"
                    x={x + (idx === 0 ? 11 : 16)}
                    y={baseY - finHeight - 12}
                    transform={`rotate(-90 ${x + (idx === 0 ? 11 : 16)} ${baseY - finHeight - 12})`}
                  >
                    {fin.label}
                  </text>

                  {/* Overlapping Fin Polygon */}
                  <polygon
                    className="dev-timeline__fin-shape"
                    points={points}
                    fill={`url(#fin-grad-${uid}-${idx})`}
                    stroke={
                      isActive
                        ? isDark
                          ? 'rgba(255,255,255,0.65)'
                          : 'rgba(0,0,0,0.5)'
                        : 'none'
                    }
                    strokeWidth="1"
                  />

                  {/* Varied Developer-at-Laptop Silhouettes along the progression */}
                  {idx > 0 && idx % 2 === 1 && (
                    <DeveloperLaptopSilhouette
                      x={x + 12}
                      baseY={baseY}
                      pose={fin.pose}
                      color={innerSilColor}
                    />
                  )}
                </g>
              );
            })}

            {/* Bottom Gradient Spectrum Bar (Present on left -> Past on right) */}
            <rect
              x={startX}
              y={baseY + 22}
              width={finCount * stepX + 38}
              height="8"
              fill={`url(#${spectrumGradId})`}
              stroke={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(20,20,20,0.68)'}
              strokeWidth="0.9"
            />
          </svg>

          <div className="dev-timeline__spectrum-labels">
            <span>present · fusion x</span>
            <span>2019 · foundation</span>
          </div>
        </div>

        {/* Interactive Milestone Readout (developer_journey.md details) */}
        <div className="dev-timeline__detail" role="status" aria-live="polite">
          <div className="dev-timeline__detail-top">
            <h3 className="dev-timeline__detail-title">{activeFin.title}</h3>
            <span className="dev-timeline__detail-year">{activeFin.year}</span>
          </div>
          <p className="dev-timeline__detail-org">{activeFin.org}</p>
          <p className="dev-timeline__detail-desc">{activeFin.summary}</p>
          {activeFin.accomplishments.length > 0 && (
            <ul className="dev-timeline__detail-list">
              {activeFin.accomplishments.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          <div className="dev-timeline__tech-row">
            {activeFin.tech.map((t) => (
              <span key={t} className="dev-timeline__tech-pill">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
