import type { ProjectItem } from '../types';

export const portfolioProjects: ProjectItem[] = [
  {
    id: 'reminder-afk',
    repoName: 'reminder.afk',
    title: 'reminder.afk | 3D Ergonomic Desktop Break Companion',
    tagline: 'Combat workstation eye strain and posture fatigue with an interactive 3D desktop companion',
    description:
      'An interactive 3D desktop ergonomic assistant engineered with Electron, React 19, and React Three Fiber. Runs quietly in the OS system tray, intelligently alerting developers to rest their eyes and reset posture using procedural ambient Web Audio chimes and animated 3D companion robots.',
    category: 'dev-tools',
    categoryLabel: 'Desktop & 3D App',
    statusBadge: 'v1.0.0 · Active Release',
    featured: true,
    year: '2026',
    whyBuilt: {
      story:
        'As software engineers and digital creators, we routinely spend 10+ hours a day locked in deep focus at our workstations, ignoring stiff neck muscles, wrist strain, and dry eyes. Traditional alarm apps and timer popups are jarring, annoying, and instantly dismissed. I wanted to build an ergonomic break assistant that developers genuinely enjoy having on their screen.',
      problemSolved:
        'Transforms intrusive, easily dismissed reminder popups into a delightful, gamified 3D ritual with customizable desktop companions and procedural audio synthesis.'
    },
    howItHelps: {
      summary:
        'Promotes sustained developer health, prevents chronic RSI and digital eye strain, and runs 100% locally with zero cloud dependencies.',
      benefits: [
        {
          icon: 'mdi:eye-check-outline',
          title: '20-20-20 Rule Habituation',
          description:
            'Gently prompts users every 20 minutes to look 20 feet away for 20 seconds, scientifically reducing ocular fatigue.'
        },
        {
          icon: 'mdi:robot-happy-outline',
          title: 'Interactive 3D Companions',
          description:
            'Choose from animated 3D robot companions (Spider-Bot, Mech Drone, Warrior) that perform micro-stretches right on your screen.'
        },
        {
          icon: 'mdi:bell-ring-outline',
          title: 'Procedural Web Audio Chimes',
          description:
            'Synthesizes mellow, non-intrusive harmonic tones via the Web Audio API without needing external sound packs.'
        },
        {
          icon: 'mdi:shield-check-outline',
          title: '100% Offline & Private',
          description:
            'Zero telemetric tracking, zero network requests, lightweight memory footprint in system tray.'
        }
      ]
    },
    techStack: [
      { name: 'React 19', icon: 'mdi:react' },
      { name: 'TypeScript', icon: 'mdi:language-typescript' },
      { name: 'Electron', icon: 'mdi:electron-framework' },
      { name: 'Three.js / R3F', icon: 'simple-icons:threedotjs' },
      { name: 'Web Audio API', icon: 'mdi:volume-high' },
      { name: 'Vite', icon: 'simple-icons:vite' }
    ],
    links: {
      github: 'https://github.com/PramudithaN/reminder.afk',
      demo: 'https://github.com/PramudithaN/reminder.afk/releases/tag/v1.0.0',
      showcasePage: 'reminder'
    },
    media: {
      heroImage: '/images/Screenshot 2026-09-03 003623.png',
      gallery: [
        '/images/Screenshot 2026-09-03 003623.png',
        '/images/Screenshot 2026-09-03 003630.png',
        '/images/Screenshot 2026-09-03 003651.png'
      ],
      interactiveType: '3d'
    },
    metrics: [
      { label: '3D Models', value: '4+ Interactive' },
      { label: 'Latency', value: '0ms Offline' },
      { label: 'Platforms', value: 'Win & macOS' }
    ]
  },
  {
    id: 'brain-tumor-detection',
    repoName: 'brain-tumor-detection',
    title: 'Brain Tumor MRI Classification & Clinical AI Portal',
    tagline: 'Deep learning MRI neuro-imaging classification with FastAPI inference and clinical portal',
    description:
      'A full-stack clinical intelligence platform leveraging deep convolutional neural networks (CNN / Transfer Learning) to classify brain MRI scans across tumor categories (Glioma, Meningioma, Pituitary, or No Tumor). Features guest access, instant multi-class probability distributions, and secure Supabase scan history logs.',
    category: 'ai-ml',
    categoryLabel: 'AI & Healthcare',
    statusBadge: 'Clinical Web Portal',
    featured: true,
    year: '2026',
    whyBuilt: {
      story:
        'Accurate brain tumor diagnosis from magnetic resonance imaging (MRI) is vital for neurosurgeons and oncologists, yet manual radiological evaluation is time-intensive and susceptible to fatigue in high-throughput hospital settings. I built this clinical AI portal to provide rapid, assistive second opinions with clear visual probability metrics and historical audit tracking.',
      problemSolved:
        'Accelerates clinical MRI triage by delivering sub-second neuro-imaging classification with multi-class tumor probability breakdowns and secure patient scan logs.'
    },
    howItHelps: {
      summary:
        'Assists healthcare practitioners and researchers in rapid preliminary MRI assessment, reducing diagnosis turnaround time while keeping patient scan records secure.',
      benefits: [
        {
          icon: 'mdi:brain',
          title: 'Multi-Class Tumor Classification',
          description:
            'Accurately detects and classifies Glioma, Meningioma, Pituitary tumors, or healthy brain tissue with high confidence.'
        },
        {
          icon: 'mdi:lightning-bolt',
          title: 'Sub-Second FastAPI Inference',
          description:
            'High-performance async Python backend running optimized CNN weights for instant patient scan results.'
        },
        {
          icon: 'mdi:database-lock-outline',
          title: 'Supabase Historical Audit',
          description:
            'Stores scan metadata, timestamps, and confidence distributions securely for longitudinal patient tracking.'
        },
        {
          icon: 'mdi:account-badge-outline',
          title: 'Frictionless Guest Access',
          description:
            'Allows medical researchers and clinical testers to evaluate MRI samples immediately without complex account setup.'
        }
      ]
    },
    techStack: [
      { name: 'Python', icon: 'mdi:language-python' },
      { name: 'FastAPI', icon: 'simple-icons:fastapi' },
      { name: 'TensorFlow / Keras', icon: 'simple-icons:tensorflow' },
      { name: 'React', icon: 'mdi:react' },
      { name: 'TypeScript', icon: 'mdi:language-typescript' },
      { name: 'Supabase', icon: 'simple-icons:supabase' }
    ],
    links: {
      github: 'https://github.com/PramudithaN/brain-tumor-detection',
      demo: 'https://brain-tumor-detection-umber.vercel.app'
    },
    media: {
      heroImage: '/images/projects/brain-tumor-preview.svg',
      gallery: [
        '/images/projects/brain-tumor-preview.svg'
      ],
      interactiveType: 'iframe'
    },
    metrics: [
      { label: 'Tumor Classes', value: '4 Categories' },
      { label: 'Inference', value: '< 250ms' },
      { label: 'Backend', value: 'FastAPI' }
    ]
  },
  {
    id: 'drag2place',
    repoName: 'drag2place',
    title: 'Drag2Place | Open-Source Infinite Canvas Workspace',
    tagline: 'Milanote-inspired infinite freeform canvas for organizing ideas, moodboards & project planning',
    description:
      'An open-source visual thinking workspace designed around an infinite freeform canvas. Allows designers, engineers, and creative thinkers to freely position notes, drag-and-drop media cards, create moodboards, connect relational cards, and organize complex projects with zero grid constraints.',
    category: 'web-apps',
    categoryLabel: 'Visual Workspace & Canvas',
    statusBadge: 'Open Source · Active',
    featured: true,
    year: '2026',
    whyBuilt: {
      story:
        'Rigid linear note-taking apps and structured kanban boards often constrain the messy, exploratory phase of creative thinking and system architecture. I wanted an open-source, fluid digital whiteboard where creators can freely position visual assets, cluster ideas, connect dependencies, and construct moodboards with complete spatial freedom.',
      problemSolved:
        'Removes layout friction from creative ideation by providing an unconstrained, high-performance infinite zoom-and-pan spatial canvas.'
    },
    howItHelps: {
      summary:
        'Empowers creators, product designers, and dev teams to visualize ideas spatially, build rich moodboards, and map software architecture effortlessly.',
      benefits: [
        {
          icon: 'mdi:gesture-drag',
          title: 'Infinite Freeform Canvas',
          description:
            'Smooth pan and zoom navigation with unbounded spatial canvas physics inspired by Milanote.'
        },
        {
          icon: 'mdi:image-multiple-outline',
          title: 'Rich Media Drag-and-Drop',
          description:
            'Drop image swatches, markdown notes, task checklists, and URL cards directly into spatial clusters.'
        },
        {
          icon: 'mdi:vector-line',
          title: 'Relational Connectors & Moodboards',
          description:
            'Link cards and thoughts together with directional arrows, color palettes, and visual grouping frames.'
        },
        {
          icon: 'mdi:open-source-initiative',
          title: '100% Open Source & Self-Hostable',
          description:
            'Privacy-respecting, zero lock-in codebase that anyone in the open-source community can contribute to or customize.'
        }
      ]
    },
    techStack: [
      { name: 'TypeScript', icon: 'mdi:language-typescript' },
      { name: 'Next.js / React', icon: 'simple-icons:nextdotjs' },
      { name: 'Tailwind CSS', icon: 'mdi:tailwind' },
      { name: 'HTML5 Canvas API', icon: 'mdi:brush' },
      { name: 'Zustand', icon: 'mdi:database-outline' }
    ],
    links: {
      github: 'https://github.com/PramudithaN/drag2place',
      demo: 'https://www.drag2place.site'
    },
    media: {
      heroImage: '/images/projects/drag2place-preview.svg',
      gallery: [
        '/images/projects/drag2place-preview.svg'
      ],
      interactiveType: 'iframe'
    },
    metrics: [
      { label: 'Canvas', value: 'Infinite 2D' },
      { label: 'Framerate', value: '60 FPS Pan/Zoom' },
      { label: 'License', value: 'Open Source' }
    ]
  },
  {
    id: 'localization-check',
    repoName: 'localization-check',
    title: 'localization-check | AST-Powered Linter & Copilot QuickFix',
    tagline: 'Automated AST linting for hardcoded UI strings with one-click GitHub Copilot extraction',
    description:
      'A high-performance VS Code extension and AST analysis engine that scans Git diffs in JavaScript, TypeScript, and JSX/TSX files to flag raw, unlocalized user-facing strings. Seamlessly connects to i18n translation catalogs and GitHub Copilot to extract strings with translation hooks in a single click.',
    category: 'dev-tools',
    categoryLabel: 'VS Code Extension',
    statusBadge: 'v1.0.0 · Active Marketplace',
    featured: true,
    year: '2026',
    whyBuilt: {
      story:
        'During fast-paced sprint cycles and enterprise UI refactors, frontend engineers constantly slip raw text like "Save Changes" or "Please fill required fields" straight into JSX templates. Discovering these months later during international product launches causes costly delays and tedious code audits. I designed this extension to catch unlocalized strings directly inside VS Code before code is ever committed.',
      problemSolved:
        'Eliminates human error in internationalization (i18n) workflows by automating string detection and translation hook replacement using AST heuristics.'
    },
    howItHelps: {
      summary:
        'Saves engineering teams hundreds of audit hours, preserves strict localization compliance, and keeps VS Code editor performance blazing fast.',
      benefits: [
        {
          icon: 'mdi:code-json',
          title: 'Git Diff-Scoped AST Scanning',
          description:
            'Only analyzes changed lines in active Git files, avoiding full-workspace slowdowns and providing instant feedback.'
        },
        {
          icon: 'mdi:creation',
          title: 'Copilot AI Quick-Fix',
          description:
            'One-click refactor replaces raw strings with t() translation hooks and automatically injects missing hook imports.'
        },
        {
          icon: 'mdi:filter-outline',
          title: 'Smart Heuristic Filtering',
          description:
            'Ignores test IDs, URLs, CSS class names, regex tokens, and developer log statements with configurable rule sets.'
        },
        {
          icon: 'mdi:lightning-bolt-outline',
          title: 'Zero Build Configuration',
          description:
            'Works out of the box with react-i18next, next-intl, vue-i18n, and custom internal localization dictionaries.'
        }
      ]
    },
    techStack: [
      { name: 'TypeScript', icon: 'mdi:language-typescript' },
      { name: 'VS Code API', icon: 'mdi:visual-studio-code' },
      { name: 'Babel AST', icon: 'simple-icons:babel' },
      { name: 'ESLint Core', icon: 'mdi:eslint' },
      { name: 'Node.js', icon: 'mdi:nodejs' }
    ],
    links: {
      github: 'https://github.com/PramudithaN/localization-check',
      demo: 'https://github.com/PramudithaN/localization-check#readme',
      showcasePage: 'localization'
    },
    media: {
      heroImage: '/images/projects/localization-preview.svg',
      gallery: [
        '/images/projects/localization-preview.svg',
        '/images/localization-check-icon.png'
      ],
      interactiveType: 'code-playground'
    },
    metrics: [
      { label: 'Scan Time', value: '< 25ms / file' },
      { label: 'AST Rules', value: '12 Heuristics' },
      { label: 'Integration', value: 'VS Code & Copilot' }
    ]
  },
  {
    id: 'digital-wedding-invitation',
    repoName: 'digital-wedding-invitation',
    title: 'Cinematic Digital Wedding Invitation Experience',
    tagline: 'Fluid mobile-first wedding web platform with real-time RSVP, directions & motion design',
    description:
      'A luxury, interactive digital wedding invitation crafted with React, Framer Motion, and Tailwind CSS. Features scroll-driven cinematography, real-time RSVP confirmation with diet preferences, interactive Google/Apple Maps integration, and calendar sync.',
    category: 'web-apps',
    categoryLabel: 'Web Experience',
    statusBadge: 'Live Web Experience',
    featured: true,
    year: '2026',
    whyBuilt: {
      story:
        'Physical paper invitations are costly to print and mail, impossible to update if event details change, and cannot collect guest RSVPs automatically. I created this digital invitation platform to offer an unforgettable cinematic web experience with personalized music, dynamic countdowns, and one-tap calendar reminders.',
      problemSolved:
        'Replaces static paper cards with an eco-friendly, interactive, mobile-optimized experience that automates RSVP management in real time.'
    },
    howItHelps: {
      summary:
        'Gives hosts total clarity over guest attendance and dietary requirements while giving guests a memorable, frictionless experience.',
      benefits: [
        {
          icon: 'mdi:cellphone-link',
          title: 'Mobile-First Fluid UX',
          description:
            'Responsive design optimized for smartphones with buttery 60fps Framer Motion scroll triggers.'
        },
        {
          icon: 'mdi:checkbox-marked-circle-outline',
          title: 'Instant RSVP & Dietary Collection',
          description:
            'Guests confirm attendance, headcount, and dietary preferences directly from the web page in seconds.'
        },
        {
          icon: 'mdi:map-marker-radius-outline',
          title: '1-Tap Maps & Calendar Sync',
          description:
            'Direct deep-links to Google Maps and Apple Maps navigation plus 1-click Google & iCal calendar file addition.'
        },
        {
          icon: 'mdi:music-note',
          title: 'Ambient Soundtrack & Particles',
          description:
            'Subtle background music toggle and custom floating golden particle canvas for high-end atmosphere.'
        }
      ]
    },
    techStack: [
      { name: 'React 18', icon: 'mdi:react' },
      { name: 'TypeScript', icon: 'mdi:language-typescript' },
      { name: 'Framer Motion', icon: 'simple-icons:framer' },
      { name: 'Tailwind CSS', icon: 'mdi:tailwind' },
      { name: 'Vite', icon: 'simple-icons:vite' }
    ],
    links: {
      github: 'https://github.com/PramudithaN/digital-wedding-invitation',
      demo: 'https://digital-wedding-invitation-beige.vercel.app/invite/general'
    },
    media: {
      heroImage: '/images/projects/wedding-preview.svg',
      gallery: [
        '/images/projects/wedding-preview.svg'
      ],
      interactiveType: 'iframe'
    },
    metrics: [
      { label: 'Performance', value: '99 Lighthouse' },
      { label: 'Interactions', value: '60 FPS Physics' },
      { label: 'Paper Saved', value: '100% Eco' }
    ]
  },
  {
    id: 'petrocast-backend',
    repoName: 'petrocast-backend',
    title: 'PetroCast | Multimodal Crude Oil Price Forecasting Engine',
    tagline: 'Decomposition-based hybrid ARIMA + GRU + XGBoost model with strictly lagged live news sentiment',
    description:
      'A production-grade FastAPI backend built for energy market intelligence and crude oil price forecasting. Combines linear time-series decomposition (ARIMA), deep recurrent temporal models (GRU), and gradient boosted residual trees (XGBoost) with real-time NLP news sentiment signals.',
    category: 'ai-ml',
    categoryLabel: 'AI & Machine Learning',
    statusBadge: 'FastAPI Production Backend',
    featured: true,
    year: '2026',
    whyBuilt: {
      story:
        'Commodity markets are violently disrupted by geopolitical conflict, OPEC announcements, and breaking international news. Traditional econometric models are far too rigid to react to sudden news shocks, while standalone neural networks easily overfit market noise. I architected PetroCast as a hybrid decomposition framework that balances statistical stability with live NLP sentiment telemetry.',
      problemSolved:
        'Solves prediction lag and market noise overfitting in volatile commodities trading through multi-tier model decomposition and temporal sentiment integration.'
    },
    howItHelps: {
      summary:
        'Provides energy analysts, traders, and supply-chain planners with actionable price trajectory forecasts and probabilistic risk bounds.',
      benefits: [
        {
          icon: 'mdi:chart-timeline-variant-shimmer',
          title: 'Hybrid Ensemble Architecture',
          description:
            'ARIMA captures seasonal macro trends, GRU learns non-linear sequence dependencies, and XGBoost corrects residual variance.'
        },
        {
          icon: 'mdi:newspaper-variant-outline',
          title: 'Strictly Lagged Sentiment NLP',
          description:
            'Ingests global energy news articles with strictly enforced temporal lagging to prevent look-ahead data leakage.'
        },
        {
          icon: 'mdi:server-network',
          title: 'High-Throughput FastAPI',
          description:
            'Async request workers, automated OpenAPI documentation, Dockerized microservice architecture ready for cloud deployment.'
        },
        {
          icon: 'mdi:scale-balance',
          title: 'Probabilistic Confidence Intervals',
          description:
            'Generates uncertainty bounds and risk intervals to evaluate forecast reliability under turbulent market conditions.'
        }
      ]
    },
    techStack: [
      { name: 'Python', icon: 'mdi:language-python' },
      { name: 'FastAPI', icon: 'simple-icons:fastapi' },
      { name: 'PyTorch / GRU', icon: 'simple-icons:pytorch' },
      { name: 'XGBoost', icon: 'mdi:chart-bell-curve' },
      { name: 'HuggingFace NLP', icon: 'simple-icons:huggingface' },
      { name: 'Docker', icon: 'mdi:docker' }
    ],
    links: {
      github: 'https://github.com/PramudithaN/petrocast-backend',
      videoUrl: 'https://youtu.be/rtwIa1_t3vo'
    },
    media: {
      heroImage: '/images/projects/petrocast-preview.svg',
      gallery: [
        '/images/projects/petrocast-preview.svg'
      ],
      videoDemoUrl: 'https://youtu.be/rtwIa1_t3vo',
      interactiveType: 'none'
    },
    metrics: [
      { label: 'Forecast Horizon', value: '7-30 Days' },
      { label: 'Inference', value: '12ms' },
      { label: 'Model Stack', value: 'ARIMA+GRU+XGB' }
    ]
  },
  {
    id: '11labs-m',
    repoName: '11labsM',
    title: '11labsM | Multilingual Voice Localization Automation Pipeline',
    tagline: 'Automated translation and neural voiceover synthesis across 17 languages via ElevenLabs API',
    description:
      'An automated end-to-end voice localization pipeline designed to translate source English scripts and generate high-fidelity vocal stems across 17 languages sequentially. Includes automated script chunking, vocal rate balancing, and batch audio mastering with FFmpeg.',
    category: 'ai-ml',
    categoryLabel: 'Voice & Automation',
    statusBadge: 'CLI Pipeline · Active',
    featured: true,
    year: '2026',
    whyBuilt: {
      story:
        'Localizing technical videos, educational masterclasses, and product promos for international markets traditionally requires coordinating dozens of voice talents, contracts, and hours in audio suites. I built 11labsM to turn what was a multi-week voiceover process into a completely automated script-to-audio workflow with studio-grade vocal realism.',
      problemSolved:
        'Cuts localization turnaround from weeks to minutes by automating the translation, phonetic alignment, and neural audio rendering pipeline.'
    },
    howItHelps: {
      summary:
        'Empowers content creators and global SaaS teams to expand their reach worldwide without the overhead of massive localization studios.',
      benefits: [
        {
          icon: 'mdi:translate',
          title: '17 Target Languages Simultaneously',
          description:
            'Generates complete localized audio packs in Spanish, French, German, Japanese, Hindi, Mandarin, and more in one pass.'
        },
        {
          icon: 'mdi:waveform',
          title: 'Studio-Grade ElevenLabs Synthesis',
          description:
            'Preserves vocal nuance, natural cadence, and expressive emotion tailored to the target language persona.'
        },
        {
          icon: 'mdi:sync',
          title: 'Automated Rate-Limit Handling',
          description:
            'Intelligent queue management, exponential backoff retries, and token-efficient batching.'
        },
        {
          icon: 'mdi:file-music-outline',
          title: 'FFmpeg Audio Mastering',
          description:
            'Automates loudness normalization (-14 LUFS standard), silence trimming, and export into broadcast-ready WAV and MP3 stems.'
        }
      ]
    },
    techStack: [
      { name: 'Python', icon: 'mdi:language-python' },
      { name: 'ElevenLabs API', icon: 'mdi:microphone-outline' },
      { name: 'FFmpeg', icon: 'simple-icons:ffmpeg' },
      { name: 'NLP Transformers', icon: 'mdi:brain' },
      { name: 'AsyncIO', icon: 'mdi:sync' }
    ],
    links: {
      github: 'https://github.com/PramudithaN/11labsM'
    },
    media: {
      heroImage: '/images/projects/11labs-preview.svg',
      gallery: [
        '/images/projects/11labs-preview.svg'
      ],
      interactiveType: 'none'
    },
    metrics: [
      { label: 'Languages', value: '17 Synthesized' },
      { label: 'Audio Spec', value: '48kHz 24-Bit' },
      { label: 'Turnaround', value: 'Sub-Minute' }
    ]
  },
  {
    id: 'fraudvista-frontend',
    repoName: 'FraudVista-Frontend',
    title: 'FraudVista | Financial Fraud Surveillance & Analytics Dashboard',
    tagline: 'Enterprise banking fraud surveillance platform with anomaly scoring and graph telemetry',
    description:
      'A comprehensive enterprise financial intelligence dashboard engineered with React, TypeScript, and Ant Design. Designed for anti-money laundering (AML) investigators to visualize suspicious transaction paths, velocity anomalies, and high-risk merchant hubs.',
    category: 'web-apps',
    categoryLabel: 'Enterprise System',
    statusBadge: 'Academic & Prototype Workstation',
    featured: false,
    year: '2025',
    whyBuilt: {
      story:
        'Investigating financial fraud across banking institutions often involves sifting through disconnected database tables, slow spreadsheet dumps, and confusing audit trails. I built FraudVista to provide AML analysts with a cohesive single-pane-of-glass workspace combining interactive node graphs and velocity meters.',
      problemSolved:
        'Unifies complex multi-hop transaction trails into intuitive visual graphs, speeding up fraud detection and SAR regulatory reporting.'
    },
    howItHelps: {
      summary:
        'Enables compliance teams to intercept fraudulent transfers faster, detect organized money-muling rings, and log tamper-proof audit trails.',
      benefits: [
        {
          icon: 'mdi:shield-alert-outline',
          title: 'Real-Time Anomaly Scoring',
          description:
            'Calculates velocity and behavioral anomaly scores to prioritize critical alerts in the triage queue.'
        },
        {
          icon: 'mdi:graph-outline',
          title: 'Transaction Network Graph',
          description:
            'Interactive node-edge graph exposing intermediary pass-through accounts and synthetic identity clusters.'
        },
        {
          icon: 'mdi:account-group-outline',
          title: 'Role-Based Investigator Workflows',
          description:
            'Strict access control and case escalation states tailored for enterprise banking compliance.'
        }
      ]
    },
    techStack: [
      { name: 'React', icon: 'mdi:react' },
      { name: 'TypeScript', icon: 'mdi:language-typescript' },
      { name: 'Ant Design', icon: 'simple-icons:antdesign' },
      { name: 'Redux Toolkit', icon: 'mdi:database' },
      { name: 'Recharts', icon: 'mdi:chart-line' }
    ],
    links: {
      github: 'https://github.com/PramudithaN/FraudVista-Frontend.git'
    },
    media: {
      heroImage: '/images/projects/fraudvista-preview.svg',
      gallery: [
        '/images/projects/fraudvista-preview.svg'
      ],
      interactiveType: 'none'
    },
    metrics: [
      { label: 'Data Density', value: 'Enterprise UI' },
      { label: 'Component System', value: 'Ant Design' },
      { label: 'Role', value: 'Lead Architect' }
    ]
  },
  {
    id: 'openissue-dev',
    repoName: 'openissue.dev',
    title: 'openissue.dev | Open Source Issue Tracker & Triage Platform',
    tagline: 'Modern, high-velocity open-source issue tracker and triage engine for developer teams',
    description:
      'An open-source collaboration hub built with TypeScript and modern web technologies to streamline issue reporting, triage workflows, and community bug management across repositories.',
    category: 'open-source',
    categoryLabel: 'Open Source Contribution',
    statusBadge: 'Contributor · Merged',
    featured: false,
    year: '2025',
    whyBuilt: {
      story:
        'Contributing to open-source software is a core part of developer growth. Working on openissue.dev allowed me to collaborate with global maintainers, solve real usability bottlenecks for developers, and adhere to strict code review standards.',
      problemSolved:
        'Assisted in optimizing UI responsiveness, triage keyboard shortcuts, and issue metadata filtering for open-source project maintainers.'
    },
    howItHelps: {
      summary:
        'Provides developer communities with a fast, uncluttered alternative to bloated enterprise ticketing systems.',
      benefits: [
        {
          icon: 'mdi:git-issue',
          title: 'Streamlined Issue Triage',
          description:
            'Keyboard-driven navigation and Kanban card management for rapid bug assessment.'
        },
        {
          icon: 'mdi:account-multiple-check-outline',
          title: 'Community Collaboration',
          description:
            'Open-source architecture welcoming community pull requests and customizable labeling.'
        }
      ]
    },
    techStack: [
      { name: 'TypeScript', icon: 'mdi:language-typescript' },
      { name: 'Next.js', icon: 'simple-icons:nextdotjs' },
      { name: 'Tailwind CSS', icon: 'mdi:tailwind' },
      { name: 'Open Source', icon: 'mdi:git' }
    ],
    links: {
      github: 'https://github.com/arnabnandy7/openissue.dev'
    },
    media: {
      heroImage: '/images/projects/openissue-preview.svg',
      gallery: [
        '/images/projects/openissue-preview.svg'
      ],
      interactiveType: 'none'
    },
    metrics: [
      { label: 'Type', value: 'Open Source' },
      { label: 'Role', value: 'Contributor' }
    ]
  }
];
