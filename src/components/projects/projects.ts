export type Project = {
  name: string;
  category: string;          // filter chip label
  tagline: string;           // one line shown in the list row
  description: string;
  result: string;            // shown in the "Result:" box
  metrics: { value: string; label: string }[]; // optional, can be []
  stack: string[];
  status: string;            // e.g. "Active", "Live", "Contributor"
  links: { label: string; href: string }[];    // first link is the primary button
  img?: string;              // screenshot path, e.g. "/projects/11labsm.png"
};

export const projects: Project[] = [
  {
    name: "reminder.afk",
    category: "Dev tools & 3D",
    tagline: "Combat workstation eye strain and posture fatigue with an interactive 3D desktop companion",
    description: "An interactive 3D desktop ergonomic assistant engineered with Electron, React 19, and React Three Fiber. Runs quietly in the OS system tray, intelligently alerting developers to rest their eyes and reset posture using procedural ambient Web Audio chimes and animated 3D companion robots.",
    result: "Transforms intrusive, easily dismissed reminder popups into a delightful, gamified 3D ritual with customizable desktop companions and procedural audio synthesis.",
    metrics: [
      { value: "3D", label: "interactive" },
      { value: "v1.0.0", label: "active" },
      { value: "0ms", label: "offline latency" }
    ],
    stack: ["Electron", "React 19", "Three.js / R3F", "Web Audio API", "TypeScript"],
    status: "Active",
    links: [
      { label: "Live demo", href: "https://github.com/PramudithaN/reminder.afk/releases/tag/v1.0.0" },
      { label: "Source", href: "https://github.com/PramudithaN/reminder.afk" }
    ],
    img: "/images/Screenshot 2026-09-03 003623.png"
  },
  {
    name: "git-tulkun",
    category: "Dev tools & 3D",
    tagline: "Procedural pixel-art Tulkun whale looping GIF generator for GitHub profile READMEs",
    description: "Procedural pixel-art Tulkun whale generated from your GitHub contributions and language colors as a looping GIF for your profile README, built in high-performance Rust.",
    result: "Transforms static profile contribution graphs into dynamic, beautiful animated pixel art.",
    metrics: [
      { value: "Rust", label: "engine" },
      { value: "GIF", label: "looping animation" },
      { value: "Zero-lag", label: "workflow" }
    ],
    stack: ["Rust", "Pixel Art", "GitHub Actions", "GitHub API"],
    status: "Active",
    links: [
      { label: "Live demo", href: "https://pramudithan.github.io/git-tulkun/" },
      { label: "Source", href: "https://github.com/PramudithaN/git-tulkun" }
    ]
  },
  {
    name: "11labsM",
    category: "AI & ML",
    tagline: "Voice localization across 17 languages",
    description: "An end-to-end pipeline that translates English scripts and generates neural voiceovers in 17 languages, with chunking, rate balancing and FFmpeg mastering.",
    result: "Cuts localization turnaround from weeks to minutes.",
    metrics: [
      { value: "17", label: "languages" },
      { value: "48kHz", label: "24-bit audio" },
      { value: "<1 min", label: "turnaround" }
    ],
    stack: ["Python", "ElevenLabs API", "FFmpeg", "NLP Transformers", "AsyncIO"],
    status: "Active",
    links: [
      { label: "Live demo", href: "https://11labs-m.vercel.app" },
      { label: "Source", href: "https://github.com/PramudithaN/11labsM" }
    ],
    img: "/images/projects/11labs-preview.svg"
  },
  {
    name: "Drag2Place",
    category: "Web & systems",
    tagline: "A spatial canvas workspace, open source",
    description: "Arrange notes, links and files freely on an infinite canvas instead of in folders and lists. An open-source visual thinking workspace designed around an infinite freeform canvas.",
    result: "Makes it easier to see how ideas relate, because position carries meaning.",
    metrics: [
      { value: "Infinite 2D", label: "canvas" },
      { value: "60 FPS", label: "pan/zoom" }
    ],
    stack: ["Next.js", "Supabase", "TypeScript", "Tailwind CSS", "HTML5 Canvas API"],
    status: "Live",
    links: [
      { label: "Live demo", href: "https://www.drag2place.site" },
      { label: "Source", href: "https://github.com/PramudithaN/drag2place" }
    ],
    img: "/images/projects/drag2place-preview.svg"
  },
  {
    name: "generate-rules",
    category: "Dev tools & 3D",
    tagline: "Intelligent CLI tool to inspect codebases and generate guidelines for AI coding agents",
    description: "An intelligent, zero-dependency Node.js CLI tool that automatically inspects any codebase and generates tailored, high-standard guidelines (AGENTS.md and GEMINI.md) for AI coding agents including Antigravity, Gemini Code Assist, Cursor, and Copilot.",
    result: "Enforces senior developer conventions, security principles, and architectural standards across AI agent sessions.",
    metrics: [
      { value: "0", label: "dependencies" },
      { value: "Node.js", label: "runtime" },
      { value: "Instant", label: "inspection" }
    ],
    stack: ["Node.js", "JavaScript", "CLI", "Automation"],
    status: "Active",
    links: [
      { label: "Source", href: "https://github.com/PramudithaN/generate-rules" }
    ]
  },
  {
    name: "brain-tumor-detection",
    category: "AI & ML",
    tagline: "Deep learning MRI neuro-imaging classification with clinical portal",
    description: "A full-stack clinical intelligence platform leveraging deep convolutional neural networks to classify brain MRI scans across tumor categories with instant multi-class probability distributions.",
    result: "Delivers sub-second neuro-imaging classification with multi-class tumor probability breakdowns and secure patient scan logs.",
    metrics: [
      { value: "4", label: "tumor classes" },
      { value: "<250ms", label: "inference" },
      { value: "FastAPI", label: "backend" }
    ],
    stack: ["Python", "FastAPI", "TensorFlow / Keras", "React", "TypeScript", "Supabase"],
    status: "Live",
    links: [
      { label: "Live demo", href: "https://brain-tumor-detection-umber.vercel.app" },
      { label: "Source", href: "https://github.com/PramudithaN/brain-tumor-detection" }
    ],
    img: "/images/projects/brain-tumor-preview.svg"
  },
  {
    name: "localization-check",
    category: "Dev tools & 3D",
    tagline: "AST-powered linter & Copilot QuickFix for hardcoded UI strings",
    description: "A high-performance VS Code extension and AST analysis engine that scans Git diffs in JS/TS/JSX/TSX files to flag raw, unlocalized user-facing strings and replace them with translation hooks in one click.",
    result: "Eliminates human error in internationalization (i18n) workflows by automating string detection and translation hook replacement using AST heuristics.",
    metrics: [
      { value: "<25ms", label: "scan time / file" },
      { value: "12", label: "AST heuristics" },
      { value: "VS Code & Copilot", label: "integration" }
    ],
    stack: ["TypeScript", "VS Code API", "Babel AST", "ESLint Core", "Node.js"],
    status: "Active",
    links: [
      { label: "Live demo", href: "https://www.pramuditha.is-a.dev/localization" },
      { label: "Marketplace", href: "https://github.com/PramudithaN/localization-check#readme" },
      { label: "Source", href: "https://github.com/PramudithaN/localization-check" }
    ],
    img: "/images/projects/localization-preview.svg"
  },
  {
    name: "digital-wedding-invitation",
    category: "Web & systems",
    tagline: "Fluid mobile-first wedding web platform with real-time RSVP & motion design",
    description: "A luxury, interactive digital wedding invitation crafted with React, Framer Motion, and Tailwind CSS featuring scroll-driven cinematography, real-time RSVP confirmation with diet preferences, and calendar sync.",
    result: "Replaces static paper cards with an eco-friendly, interactive, mobile-optimized experience that automates RSVP management in real time.",
    metrics: [
      { value: "99", label: "Lighthouse" },
      { value: "60 FPS", label: "physics" },
      { value: "100%", label: "eco paper saved" }
    ],
    stack: ["React 18", "TypeScript", "Framer Motion", "Tailwind CSS", "Vite"],
    status: "Live",
    links: [
      { label: "Live demo", href: "https://digital-wedding-invitation-beige.vercel.app/invite/general" },
      { label: "Source", href: "https://github.com/PramudithaN/digital-wedding-invitation" }
    ],
    img: "/images/projects/wedding-preview.svg"
  },
  {
    name: "PetroCast",
    category: "AI & ML",
    tagline: "Multimodal crude oil price forecasting engine with sentiment signals",
    description: "A production-grade FastAPI backend combining linear time-series decomposition (ARIMA), deep recurrent temporal models (GRU), and gradient boosted trees (XGBoost) with strictly lagged live news sentiment.",
    result: "Balances statistical stability with live NLP sentiment telemetry to prevent market noise overfitting in volatile commodities trading.",
    metrics: [
      { value: "7-30 Days", label: "forecast horizon" },
      { value: "12ms", label: "inference" },
      { value: "ARIMA+GRU+XGB", label: "model stack" }
    ],
    stack: ["Python", "FastAPI", "PyTorch / GRU", "XGBoost", "HuggingFace NLP", "Docker"],
    status: "Active",
    links: [
      { label: "Live demo", href: "https://petrocast.vercel.app" },
      { label: "Video Demo", href: "https://youtu.be/rtwIa1_t3vo" },
      { label: "Source", href: "https://github.com/PramudithaN/petrocast-backend" }
    ],
    img: "/images/projects/petrocast-preview.svg"
  },
  {
    name: "petrocast-frontend",
    category: "AI & ML",
    tagline: "React dashboard for real-time crude oil price forecasting with live news sentiment",
    description: "React-based interactive dashboard for real-time crude oil price forecasting powered by a hybrid ARIMA | GRU | XGBoost backend with live news sentiment integration.",
    result: "Visualizes complex price trajectories, uncertainty bands, and real-time news sentiment impacts for commodities analysts.",
    metrics: [
      { value: "ARIMA+GRU+XGB", label: "model" },
      { value: "Real-time", label: "sentiment" }
    ],
    stack: ["TypeScript", "React", "Recharts", "Tailwind CSS"],
    status: "Active",
    links: [
      { label: "Live demo", href: "https://petrocast.vercel.app" },
      { label: "Source", href: "https://github.com/PramudithaN/petrocast-frontend" }
    ]
  },
  {
    name: "petrocast-core",
    category: "AI & ML",
    tagline: "Multi-horizon petroleum price forecasting with VMD, FinBERT & ensemble modeling",
    description: "An advanced multi-horizon petroleum price forecasting system leveraging Variational Mode Decomposition (VMD), financial news sentiment analysis via FinBERT, and a stacked GRU-ARIMA-XGBoost ensemble model.",
    result: "Eliminates time-series lag and mitigates financial noise by isolating high/low frequency modes before neural forecasting.",
    metrics: [
      { value: "VMD", label: "decomposition" },
      { value: "FinBERT", label: "NLP sentiment" }
    ],
    stack: ["Python", "PyTorch", "FinBERT", "XGBoost", "ARIMA", "Jupyter"],
    status: "Active",
    links: [
      { label: "Source", href: "https://github.com/PramudithaN/petrocast-core" }
    ]
  },
  {
    name: "adsync-shared",
    category: "AI & ML",
    tagline: "Intelligent digital billboard system with real-time computer vision crowd analysis",
    description: "An intelligent digital billboard system that uses real-time computer vision to analyze crowd attributes and dynamically display targeted advertisements.",
    result: "Automates real-time audience demographic inference to deliver relevant digital billboard campaigns.",
    metrics: [
      { value: "Vision AI", label: "telemetry" },
      { value: "Dynamic", label: "targeting" }
    ],
    stack: ["TypeScript", "React", "Computer Vision", "Node.js"],
    status: "Active",
    links: [
      { label: "Source", href: "https://github.com/PramudithaN/adsync-shared" }
    ]
  },
  {
    name: "FraudVista",
    category: "Web & systems",
    tagline: "Enterprise banking fraud surveillance platform with anomaly scoring and graph telemetry",
    description: "A comprehensive enterprise financial intelligence dashboard engineered with React, TypeScript, and Ant Design. Designed for anti-money laundering (AML) investigators to visualize suspicious transaction paths, velocity anomalies, and high-risk merchant hubs.",
    result: "Unifies complex multi-hop transaction trails into intuitive visual graphs, speeding up fraud detection and SAR regulatory reporting.",
    metrics: [
      { value: "Enterprise", label: "data density" },
      { value: "Ant Design", label: "component system" },
      { value: "Lead Architect", label: "role" }
    ],
    stack: ["React", "TypeScript", "Ant Design", "Redux Toolkit", "Recharts"],
    status: "Active",
    links: [
      { label: "Source", href: "https://github.com/PramudithaN/FraudVista-Frontend.git" }
    ],
    img: "/images/projects/fraudvista-preview.svg"
  },
  {
    name: "silence-remover",
    category: "Dev tools & 3D",
    tagline: "Clean audio recordings by detecting and trimming silent intervals automatically",
    description: "A web application that helps creators clean audio recordings by detecting and removing silent gaps, reducing file duration while preserving speech and audio fidelity.",
    result: "Saves creators editing time by automatically cutting dead air from podcast tracks and voice recordings.",
    metrics: [
      { value: "Web Audio", label: "processing" },
      { value: "100% Local", label: "privacy" }
    ],
    stack: ["JavaScript", "React", "Web Audio API"],
    status: "Active",
    links: [
      { label: "Live demo", href: "https://silence-remover-six.vercel.app" },
      { label: "Source", href: "https://github.com/PramudithaN/silence-remover" }
    ]
  },
  {
    name: "angel-paradise",
    category: "Web & systems",
    tagline: "Scalable MERN-stack e-commerce & reservation platform with modern UI",
    description: "A scalable MERN-stack application built with TypeScript, Vite, and Tailwind CSS, featuring a modern UI and clean modular architecture.",
    result: "Provides smooth multi-step booking, catalogue navigation, and order processing.",
    metrics: [
      { value: "MERN", label: "full stack" },
      { value: "Tailwind", label: "design system" }
    ],
    stack: ["TypeScript", "React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    status: "Active",
    links: [
      { label: "Live demo", href: "https://angel-paradise.vercel.app" },
      { label: "Source", href: "https://github.com/PramudithaN/angel-paradise" }
    ]
  },
  {
    name: "pramuditha.cv",
    category: "Web & systems",
    tagline: "Interactive developer CV showcasing engineering skills and experience",
    description: "An interactive, elegant digital curriculum vitae showcasing developer skills, work experience, projects, and educational background with responsive typography.",
    result: "Offers recruiters and clients an interactive, always-up-to-date visual CV experience.",
    metrics: [
      { value: "Interactive", label: "CV" }
    ],
    stack: ["TypeScript", "React", "Tailwind CSS"],
    status: "Live",
    links: [
      { label: "Live demo", href: "https://cv.pramuditha.is-a.dev" },
      { label: "Source", href: "https://github.com/PramudithaN/pramuditha.cv" }
    ]
  },
  {
    name: "openissue.dev",
    category: "Open source",
    tagline: "Issue tracker and triage for open-source teams",
    description: "A collaboration hub for issue reporting, triage workflows and community bug management across repositories.",
    result: "Improved UI responsiveness, added triage keyboard shortcuts and issue metadata filtering for maintainers.",
    metrics: [],
    stack: ["TypeScript", "Next.js", "Tailwind CSS"],
    status: "Contributor",
    links: [
      { label: "Live demo", href: "https://openissue-dev.vercel.app" },
      { label: "Source", href: "https://github.com/arnabnandy7/openissue.dev" }
    ],
    img: "/images/projects/openissue-preview.svg"
  },
  {
    name: "essentials",
    category: "Open source",
    tagline: "Essential utilities and developer tools collection",
    description: "An open-source collection of reusable utilities and system helpers for TypeScript and JavaScript applications.",
    result: "Contributed modular helper utilities and performance optimizations to the shared toolkit.",
    metrics: [],
    stack: ["TypeScript", "JavaScript"],
    status: "Contributor",
    links: [
      { label: "Live demo", href: "https://sameerasw.com/essentials" },
      { label: "Source", href: "https://github.com/sameerasw/essentials" }
    ]
  },
  {
    name: "Battery-Notifier",
    category: "Dev tools & 3D",
    tagline: "Android app that monitors battery levels and alerts at target thresholds",
    description: "An Android utility app that monitors device power state and triggers custom sound and vibration notifications when battery percentage thresholds are reached.",
    result: "Helps users preserve battery health by avoiding overcharging and deep discharge cycles.",
    metrics: [],
    stack: ["Kotlin", "Android SDK"],
    status: "Active",
    links: [
      { label: "Source", href: "https://github.com/PramudithaN/Battery-Notifier" }
    ]
  },
  {
    name: "puzzle-pathfinder",
    category: "Dev tools & 3D",
    tagline: "Shortest path maze traversal visualizer using the A* heuristic algorithm",
    description: "Finding the start, end nodes, and the optimal shortest path in complex 2D mazes using the A* search heuristic algorithm with interactive visual traversal.",
    result: "Demonstrates graph search optimization and heuristic pathfinding with step-by-step state visualization.",
    metrics: [
      { value: "A*", label: "algorithm" }
    ],
    stack: ["Java", "Algorithms & Data Structures"],
    status: "Active",
    links: [
      { label: "Source", href: "https://github.com/PramudithaN/puzzle-pathfinder" }
    ]
  },
  {
    name: "java-threadworks",
    category: "Dev tools & 3D",
    tagline: "Concurrent multithreading algorithms and worker pool implementations in Java",
    description: "A deep dive into multithreading, concurrent memory models, synchronization primitives, lock-free queues, and worker thread pool architectures in core Java.",
    result: "Demonstrates high-throughput thread concurrency with zero race conditions or deadlocks.",
    metrics: [
      { value: "Java", label: "concurrency" }
    ],
    stack: ["Java", "Multithreading", "Concurrency"],
    status: "Active",
    links: [
      { label: "Source", href: "https://github.com/PramudithaN/java-threadworks" }
    ]
  },
  {
    name: "Vapi-Clone_FrontEnd",
    category: "Web & systems",
    tagline: "Chatbot management UI developed with HTML and CSS",
    description: "A clean chatbot management and configuration interface frontend built with modern HTML and CSS.",
    result: "Provides an intuitive dashboard for configuring AI voice and text conversational agents.",
    metrics: [],
    stack: ["HTML", "CSS", "JavaScript"],
    status: "Active",
    links: [
      { label: "Live demo", href: "https://vapi-v2-15165ac4b6e5.herokuapp.com/" },
      { label: "Source", href: "https://github.com/PramudithaN/Vapi-Clone_FrontEnd.git" }
    ]
  },
  {
    name: "Vapi-Clone_React_Ts",
    category: "Web & systems",
    tagline: "Conversational voice assistant clone built with React & TypeScript",
    description: "Reimplementation of Vapi voice agent orchestration interface using React, TypeScript, and modern modular state handling.",
    result: "Enables interactive prompt design and voice bot testing with reactive parameter controls.",
    metrics: [],
    stack: ["React", "TypeScript", "Tailwind CSS"],
    status: "Active",
    links: [
      { label: "Source", href: "https://github.com/PramudithaN/Vapi-Clone_React_Ts" }
    ]
  },
  {
    name: "hike-tracker",
    category: "Web & systems",
    tagline: "GPS outdoor route and elevation tracking web application",
    description: "A route mapping and distance tracker for outdoor enthusiasts, recording elevation gain, checkpoints, and trail metrics.",
    result: "Helps hikers log and review trails with real-time coordinate logging.",
    metrics: [],
    stack: ["TypeScript", "React", "Leaflet Maps"],
    status: "Active",
    links: [
      { label: "Source", href: "https://github.com/PramudithaN/hike-tracker" }
    ]
  }
];
