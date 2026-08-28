# Pramuditha.dev

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFDF00)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
[![MotionScore](https://api.motion.dev/score/badge?url=www.pramuditha.is-a.dev)](https://score.motion.dev/site/www.pramuditha.is-a.dev)

> An interactive, high-performance personal portfolio engineered with React 19, TypeScript, and Vite. The platform features a dual-discipline showcase bridging software engineering and visual design, complete with animated page portals, dynamic content management via Supabase, live GitHub integration, and a persistent dark/light theme engine.

---

## Overview

The portfolio presents a split architecture highlighting two core disciplines:

1. **Logic & Systems**: Full-stack web development, enterprise systems engineering, interactive CV, real-time GitHub repository feeds, technical skillsets, and client testimonials.
2. **Aesthetics & Motion**: Graphic design galleries powered by Pinterest RSS feeds, cinematic video editing reels, VFX showcases, and creative project case studies.
3. **About Me**: Editorial bio, swipeable career timeline, education overview, and social links.
4. **Admin Dashboard**: Secure Supabase-backed content management system to edit testimonials, work experience entries, video reels, and sync state in real time.

---

## Key Features

- **Split-Screen Portal Navigation**: Full-screen scroll snapping with animated interactive portals powered by Framer Motion.
- **Dynamic Content Store & Cloud Sync**: Seamless content synchronization between local storage fallbacks and Supabase PostgreSQL backend.
- **Live GitHub Integration**: Client-side repository fetching with automated exclusion filtering, offline caching, and featured project prioritization.
- **Pinterest Media Pipeline**: Live multi-board gallery integration parsing Pinterest RSS XML feeds with custom responsive lightbox viewing and lazy loading.
- **Theme Engine**: Persistent Light/Dark mode switcher with contrast-balanced color palettes for both standard and high-density displays.
- **Hardware-Accelerated Motion**: Smooth CSS keyframe glow backdrops, typography scaling, and fluid subpage transitions.
- **Optimized Production Build**: Built on Vite with strict TypeScript verification and linting via Oxlint.

---

## Architecture & Project Structure

```
portfolio/
├── api/
│   └── pinterest.ts             # Serverless proxy for Pinterest RSS fetching
├── public/                      # Static assets, icons, fonts, and documents
│   ├── fonts/                   # Custom typefaces (Might, Hookride, Harmera, Gondens)
│   ├── icons/                   # Vector icon collections
│   ├── images/
│   │   └── about/               # About section banners and institution badges
│   ├── favicon.svg & favicon.png
│   └── _redirects & .htaccess
├── src/
│   ├── assets/                  # Brand graphics and media assets
│   ├── components/
│   │   ├── common/              # Reusable UI elements
│   │   │   ├── RepoCard.tsx
│   │   │   ├── ScrollToTopButton.tsx
│   │   │   ├── SocialLinks.tsx
│   │   │   ├── SubpageHeader.tsx
│   │   │   ├── TestimonialCard.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── TimelineItem.tsx
│   │   ├── showcase/            # Multimedia presentation components
│   │   │   ├── GridImage.tsx
│   │   │   ├── Lightbox.tsx
│   │   │   └── VideoShowcase.tsx
│   │   ├── views/               # Top-level view controllers
│   │   │   ├── AboutView.tsx
│   │   │   ├── AestheticsView.tsx
│   │   │   ├── HomeView.tsx
│   │   │   └── LogicView.tsx
│   │   └── AdminPanel.tsx       # Dynamic CMS and authentication interface
│   ├── constants/               # Static datasets and configuration
│   │   ├── beyondCode.ts
│   │   ├── skills.ts
│   │   └── socials.ts
│   ├── hooks/                   # Custom React hooks
│   │   ├── useGitHubRepos.ts
│   │   ├── useNavigation.ts
│   │   ├── useScrollTop.ts
│   │   └── useTheme.ts
│   ├── services/                # External API and state management
│   │   ├── contentStore.ts
│   │   └── supabaseClient.ts
│   ├── types/                   # Centralized TypeScript definitions
│   │   ├── portfolio.ts
│   │   └── index.ts
│   ├── App.tsx                  # Root application router and layout
│   ├── index.css                # Global stylesheet and design tokens
│   └── main.tsx                 # Application entry point
├── scripts/
│   └── copy-404.js              # SPA routing fallback generator
├── index.html                   # HTML template
├── package.json                 # Dependency manifests and scripts
├── tsconfig.json                # TypeScript compiler configuration
└── vercel.json                  # Edge routing and caching policies
```

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Core Framework** | React 19, TypeScript |
| **Tooling & Bundler** | Vite 8, Oxlint |
| **Animation & UI** | Framer Motion, Lucide React, Iconify |
| **Database & Auth** | Supabase (@supabase/supabase-js) |
| **Analytics & Hosting**| Vercel Analytics, Vercel Edge Network |

---

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm or pnpm
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PramudithaN/pramuditha.dev.git
   cd pramuditha.dev
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional):**
   Create a `.env` file in the root directory if integrating with Supabase:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## Available Scripts

- `npm run dev`: Starts the Vite local development server with hot module replacement.
- `npm run build`: Type-checks with `tsc` and generates the optimized production bundle in `dist/`.
- `npm run lint`: Performs rapid static analysis and linting checks using Oxlint.
- `npm run preview`: Locally serves the production build for validation.

---

## Author & Contact

**Pramuditha Nadun**  
Software Engineer & Visual Designer  

- **GitHub**: [github.com/PramudithaN](https://github.com/PramudithaN)
- **LinkedIn**: [linkedin.com/in/pramuditha-nadun-612b1b204](https://linkedin.com/in/pramuditha-nadun-612b1b204)
- **Behance**: [behance.net/pramudithanadun1](https://behance.net/pramudithanadun1)
- **Email**: [pramudithanadun@gmail.com](mailto:pramudithanadun@gmail.com)

---

## License

This project is open-source and available under the [MIT License](LICENSE).
