import {
  fetchRemoteContent,
  saveRemoteContent,
  loginWithSupabase,
  checkSupabaseSession,
  logoutSupabase,
  isSupabaseConfigured
} from './supabaseClient';

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  text: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  title: string;
  duration: string;
  tech: string[];
  accomplishments: string[];
  hidden?: boolean;
}

export interface AestheticsExperienceItem {
  id: string;
  company: string;
  role: string;
  title: string;
  duration: string;
  accomplishments: string[];
  hidden?: boolean;
}

export interface ShowcaseReel {
  id: string;
  title: string;
  year: string;
  duration: string;
  rating?: string;
  role: string;
  tags: string[];
  description: string;
  thumbnail: string;
  videoUrl: string;
}

export interface PortfolioContent {
  logicTestimonials: TestimonialItem[];
  logicExperience: ExperienceItem[];
  aestheticsTestimonials: TestimonialItem[];
  aestheticsExperience: AestheticsExperienceItem[];
  videoReels: ShowcaseReel[];
}

export const defaultLogicExperience: ExperienceItem[] = [
  {
    id: "exp-1",
    company: "LOLC Technologies",
    role: "Fusion X Team - Frontend Developer",
    title: "Associate Software Engineer",
    duration: "2024 - Present",
    tech: ["React", "TypeScript", "Redux", "Ant Design (AntD)", "Figma", "Spring Boot", "Jenkins", "ArgoCD", "Git"],
    accomplishments: [
      "Working on software development in a hybrid environment.",
      "Mastered React and TypeScript, with a deep understanding of React Hooks and Forms.",
      "Worked with state management using Redux for efficient data handling.",
      "Gained experience in Ant Design (AntD) for building modern UI components.",
      "Enhanced UI/UX skills, including Figma design and user experience improvements.",
      "Applied fundamental knowledge of Spring Boot for backend development.",
      "Handled deployments to QA, UAT, and Prod environments.",
      "Managed screen permissions and user access control.",
      "Worked with CI/CD pipelines using Jenkins and ArgoCD.",
      "Monitored deployment progress and troubleshooting issues.",
      "Gained experience in Git versioning, including Git tags and commands."
    ]
  },
  {
    id: "exp-2",
    company: "LOLC Technologies",
    role: "Fusion Team - Trainee SE",
    title: "Trainee Software Engineer",
    duration: "Mar 2022 - Oct 2024",
    tech: ["React", "TypeScript", "Figma", "Java", "Oracle Forms", "Jasper Reports"],
    accomplishments: [
      "Worked as part of the UI/UX team, creating Figma designs and improving user experience.",
      "Gained hands-on experience in frontend development using React and TypeScript.",
      "Implemented interactive UI components and responsive layouts.",
      "Worked with Java, Oracle Forms, and Jasper Reports for backend and reporting functionalities.",
      "Developed and maintained data-driven reports and dashboards for business decision-making.",
      "Collaborated with cross-functional teams to deliver software solutions aligned with business requirements."
    ]
  },
  {
    id: "exp-3",
    company: "Self-Employed",
    role: "Independent Full-Stack Developer",
    title: "Freelance Developer",
    duration: "2022 - Present",
    tech: ["React", "Next.js", "Spring Boot", "Node.js", "Tailwind CSS", "Automation"],
    accomplishments: [
      "Architected and delivered end-to-end full-stack applications for diverse freelance clients, transforming requirements into production-ready software solutions.",
      "Developed high-performance, custom web applications utilizing React, Next.js, Spring Boot, and Node.js.",
      "Designed and implemented highly responsive, mobile-first websites with clean layouts and semantic markup.",
      "Provided expert technical consultations, advising clients on system design, architecture, and technology stack selection.",
      "Designed and integrated CI/CD pipelines and deployment automation setups for ongoing client applications to streamline release cycles."
    ]
  }
];

export const defaultAestheticsExperience: AestheticsExperienceItem[] = [
  {
    id: "aes-exp-1",
    company: "Fiverr",
    role: "Level 2 Seller (Rating: 4.9)",
    title: "Graphic Designer",
    duration: "2020 - 2024",
    accomplishments: [
      "Worked as a freelance Graphic Designer handling diverse client requirements globally.",
      "Achieved Level 2 Seller status maintaining a 4.9 average rating.",
      "Delivered high-quality brand identity, digital assets, and print media designs."
    ]
  },
  {
    id: "aes-exp-2",
    company: "Sentered Media",
    role: "Video Production",
    title: "Video Editor",
    duration: "2023 - 2025",
    accomplishments: [
      "Ad video editing tailored specifically for high-impact marketing campaigns.",
      "Collaborated closely with marketing teams to deliver fast-paced, engaging content.",
      "Ensured brand consistency and maximized viewer retention through creative pacing."
    ]
  },
  {
    id: "aes-exp-3",
    company: "Rotaract Club of IIT",
    role: "University Club",
    title: "Graphic Designer",
    duration: "2023 - 2024",
    accomplishments: [
      "Created engaging visual content and promotional materials for various club events and initiatives.",
      "Collaborated with the PR team to design social media campaigns that boosted student engagement.",
      "Ensured all designs aligned with the Rotaract branding guidelines and event themes."
    ]
  },
  {
    id: "aes-exp-4",
    company: "Web Team MCG",
    role: "School Club",
    title: "Editor",
    duration: "2016 - 2022",
    accomplishments: [
      "Created extensive Photoshop edits and visual assets for school events and promotions.",
      "Supported and managed the live broadcast of the school Big Match.",
      "Led digital content creation and mentored junior members of the web team."
    ]
  }
];

export const defaultAestheticsTestimonials: TestimonialItem[] = [
  {
    id: "aes-test-1",
    name: "Sarah Jenkins",
    role: "Marketing Director @ TechFlow",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=SJ",
    text: "Pramuditha’s video editing for our recent ad campaign was phenomenal. He completely understood the pacing needed for social media and delivered assets that doubled our engagement rate. Fast, creative, and highly professional!"
  },
  {
    id: "aes-test-2",
    name: "Michael Chen",
    role: "Founder @ Urban Brews",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=MC",
    text: "Working with Pramuditha on Fiverr was an absolute breeze. He redesigned our entire brand identity and menu boards. His graphic design skills are top notch, and he was incredibly receptive to feedback. Highly recommended!"
  },
  {
    id: "aes-test-3",
    name: "Emma Roberts",
    role: "Content Creator",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=ER",
    text: "I hired Pramuditha to edit a series of cinematic reels for my channel. His color grading and motion graphics took my content to a whole new level. He has a fantastic eye for aesthetics and storytelling."
  }
];

export const defaultLogicTestimonials: TestimonialItem[] = [
  {
    id: "log-test-1",
    name: "Thavinya Wijesinghe",
    role: "Senior Business Analyst @ LOLC Technologies",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=TW",
    text: "I had the pleasure of working with Pramuditha during my time at LOLC Technologies, and I can honestly say he’s one of the most well rounded professionals I’ve met. Although his role was as a Software Engineer (FE), he quickly mastered the domain after joining and went beyond what was expected.\n\nWhat makes him stand out is not just his technical skills in FE development, but also his strong eye for design, UI/UX, and even graphics. I've noticed that he has a rare ability to bridge the gap between development, design, and the user experience which is very crucial.\n\nAnother quality I truly admire in Pramuditha is how collaborative he is. In my opinion, many developers tend to prefer working in isolation, but he performs very well in teamwork. I've seen how he actively engages with BAs and QAs, adding a strong sense of collaboration within the team. On a personal note, I’ve also sought his insights for some of my own projects, especially around UI/UX, and his feedback was not only helpful but also showed how much thought he puts into creating meaningful user experiences.\n\nPramuditha is someone who brings both technical excellence and a human touch to his work, and any team would be lucky to have him."
  },
  {
    id: "log-test-2",
    name: "Rishara Perera",
    role: "Marketing Executive",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=RP",
    text: "I’ve had the pleasure of working with Pramuditha on several projects, and I can confidently say he is one of the most reliable and talented professionals I’ve collaborated with. His expertise in graphic design and front-end development brings both creativity and technical precision to every project.\n\nWhat stood out to me most is his flexibility and willingness to adapt to changing requirements without ever compromising on quality. He takes full ownership of his work, consistently meeting deadlines while ensuring the output exceeds expectations. Beyond his technical skills, Pramuditha is a true team player who communicates well and makes collaboration seamless.\n\nI would highly recommend Pramuditha to anyone looking for someone who can deliver outstanding design and development work while also being dependable and easy to work with."
  },
  {
    id: "log-test-3",
    name: "Oshidhie Peiris",
    role: "Associate Quality Assurance Engineer",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=OP",
    text: "I’ve had the chance to work with Pramuditha as a QA Engineer, and I can confidently say his work is always clean, well-structured, and reliable. Issues are rare, and even when they come up, he’s quick to collaborate and resolve them smoothly. His attention to detail and quality mindset make him a great teammate and a strong asset to any project."
  }
];

export const defaultVideoReels: ShowcaseReel[] = [
  {
    id: 'video-01',
    title: 'Adsync Pitch Video',
    year: '2023',
    duration: '2 MIN 06 SEC',
    rating: '9.3',
    role: 'Marketing Promo / Pitch',
    tags: ['Promo', 'Marketing', 'Pitch'],
    description: 'Adsync is an intelligent advertising system that uses computer vision to analyze the surrounding crowd through a camera feed and display relevant ads on a digital billboard. The system tracks people in real time, detects key attributes, and dynamically selects advertisements that best match the audience profile.',
    thumbnail: 'https://i.ytimg.com/vi/RoTm7wOD1uI/maxresdefault.jpg',
    videoUrl: 'https://youtu.be/RoTm7wOD1uI?si=p7yh3vy9IpPD6JNU',
  },
  {
    id: 'video-02',
    title: 'The Dream Live in Concert',
    year: '2024',
    duration: '1 MIN 34 SEC',
    rating: '8.8',
    role: 'Teaser Video',
    tags: ['Teaser', 'Event', 'Musical'],
    description: 'Teaser video for a musical event called The Dream Live in concert. Includes dynamic cuts, bold typography, and cinematic pacing to build anticipation. Teaser coming soon video.',
    thumbnail: 'https://i.ytimg.com/vi/yMo2v7vhQ6M/maxresdefault.jpg',
    videoUrl: 'https://youtu.be/yMo2v7vhQ6M?si=-lNpvPfOsnoAIvI_',
  },
  {
    id: 'video-03',
    title: 'Oasys SaaS Product Video',
    year: '2025',
    duration: '1 MIN 48 SEC',
    rating: '9.0',
    role: 'Product Descriptive Video',
    tags: ['SaaS', 'Motion Graphics', 'Product'],
    description: 'Product SaaS video for Oasys. Motion graphics based, product descriptive video explaining core features and workflow through clean animated visuals.',
    thumbnail: 'https://i.ytimg.com/vi/VW9Fo3Bu_3w/maxresdefault.jpg',
    videoUrl: 'https://youtu.be/VW9Fo3Bu_3w',
  },
  {
    id: 'video-04',
    title: 'Disease Infection Spread VFX',
    year: '2021',
    duration: '2 MIN 22 SEC',
    rating: '8.6',
    role: 'VFX Animation',
    tags: ['VFX', 'Animation', 'Map'],
    description: 'VFX animation created to showcase the disease infection spread in Sri Lanka.',
    thumbnail: 'https://i.ytimg.com/vi/PRnL75jAY3s/sddefault.jpg',
    videoUrl: 'https://youtu.be/PRnL75jAY3s',
  },
  {
    id: 'video-05',
    title: 'Petrocast Demo Video',
    year: '2026',
    duration: '1 MIN 15 SEC',
    rating: '8.5',
    role: 'Demo / System Demonstration',
    tags: ['Demo', 'System', 'Prediction'],
    description: 'Petrocast Demo video, Crude oil price prediction system demonstration video showing how the platform analyzes market data and generates AI-based price forecasts.',
    thumbnail: 'https://i.ytimg.com/vi/rtwIa1_t3vo/maxresdefault.jpg',
    videoUrl: 'https://youtu.be/rtwIa1_t3vo',
  },
];

export function extractYouTubeThumbnail(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/);
  if (match && match[1]) {
    return `https://i.ytimg.com/vi/${match[1]}/maxresdefault.jpg`;
  }
  return null;
}

export async function getBestYouTubeThumbnail(url: string): Promise<string | null> {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/);
  if (!match || !match[1]) return null;
  const id = match[1];

  const candidates = [
    `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${id}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${id}/mqdefault.jpg`
  ];

  for (const candidate of candidates) {
    try {
      const img = new Image();
      const loaded = await new Promise<boolean>((resolve) => {
        img.onload = () => {
          // YouTube returns a tiny 120x90 placeholder when maxres/sd is missing
          if (img.naturalWidth > 120) {
            resolve(true);
          } else {
            resolve(false);
          }
        };
        img.onerror = () => resolve(false);
        img.src = candidate;
      });
      if (loaded) return candidate;
    } catch {
      // Continue to next candidate
    }
  }

  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export const defaultPortfolioContent: PortfolioContent = {
  logicTestimonials: defaultLogicTestimonials,
  logicExperience: defaultLogicExperience,
  aestheticsTestimonials: defaultAestheticsTestimonials,
  aestheticsExperience: defaultAestheticsExperience,
  videoReels: defaultVideoReels
};

const STORAGE_CONTENT_KEY = "portfolio_content_v1";
const STORAGE_AUTH_KEY = "portfolio_admin_auth_v1";

export function getStoredContent(): PortfolioContent {
  try {
    const raw = localStorage.getItem(STORAGE_CONTENT_KEY);
    if (!raw) return defaultPortfolioContent;
    const parsed = JSON.parse(raw);
    const reels = Array.isArray(parsed.videoReels) ? parsed.videoReels : defaultVideoReels;
    return {
      logicTestimonials: Array.isArray(parsed.logicTestimonials) ? parsed.logicTestimonials : defaultLogicTestimonials,
      logicExperience: Array.isArray(parsed.logicExperience) ? parsed.logicExperience : defaultLogicExperience,
      aestheticsTestimonials: Array.isArray(parsed.aestheticsTestimonials) ? parsed.aestheticsTestimonials : defaultAestheticsTestimonials,
      aestheticsExperience: Array.isArray(parsed.aestheticsExperience) ? parsed.aestheticsExperience : defaultAestheticsExperience,
      videoReels: reels
    };
  } catch (err) {
    console.error("Error reading portfolio content from localStorage:", err);
    return defaultPortfolioContent;
  }
}

export async function syncWithSupabase(): Promise<PortfolioContent | null> {
  if (!isSupabaseConfigured()) return null;
  const remote = await fetchRemoteContent();
  if (remote) {
    saveStoredContent(remote, false); // Cache locally without re-uploading
    return remote;
  }
  return null;
}

// Auto-trigger sync on app boot
if (typeof window !== 'undefined') {
  syncWithSupabase().catch(() => {});
}

export function saveStoredContent(content: PortfolioContent, uploadToCloud: boolean = true): void {
  try {
    localStorage.setItem(STORAGE_CONTENT_KEY, JSON.stringify(content));
    window.dispatchEvent(new Event("portfolio_content_updated"));

    if (uploadToCloud && isSupabaseConfigured()) {
      saveRemoteContent(content).catch((err) => {
        console.warn('Background Supabase sync error:', err);
      });
    }
  } catch (err) {
    console.error("Error saving portfolio content:", err);
  }
}

export function resetStoredContent(): PortfolioContent {
  try {
    localStorage.removeItem(STORAGE_CONTENT_KEY);
    window.dispatchEvent(new Event("portfolio_content_updated"));
    if (isSupabaseConfigured()) {
      saveRemoteContent(defaultPortfolioContent).catch(() => {});
    }
  } catch (err) {
    console.error("Error resetting portfolio content:", err);
  }
  return defaultPortfolioContent;
}

export function exportContentJSON(): string {
  const content = getStoredContent();
  return JSON.stringify(content, null, 2);
}

export function importContentJSON(jsonString: string): { success: boolean; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== "object") {
      return { success: false, error: "Invalid JSON structure" };
    }
    const validated: PortfolioContent = {
      logicTestimonials: Array.isArray(parsed.logicTestimonials) ? parsed.logicTestimonials : [],
      logicExperience: Array.isArray(parsed.logicExperience) ? parsed.logicExperience : [],
      aestheticsTestimonials: Array.isArray(parsed.aestheticsTestimonials) ? parsed.aestheticsTestimonials : [],
      aestheticsExperience: Array.isArray(parsed.aestheticsExperience) ? parsed.aestheticsExperience : [],
      videoReels: Array.isArray(parsed.videoReels) ? parsed.videoReels : []
    };
    saveStoredContent(validated, true);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to parse JSON file" };
  }
}

// Authentication Helpers (Supabase Cloud Auth)
export async function isAdminAuthenticated(): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const cloudAuthed = await checkSupabaseSession();
    if (cloudAuthed) return true;
  }
  try {
    return sessionStorage.getItem(STORAGE_AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

export async function loginAdmin(
  email: string,
  pass: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase is not configured yet. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local'
    };
  }

  const res = await loginWithSupabase(email, pass);
  if (res.success) {
    try {
      sessionStorage.setItem(STORAGE_AUTH_KEY, "true");
    } catch {}
    return { success: true };
  }
  return { success: false, error: res.error || 'Invalid Supabase credentials' };
}

export async function logoutAdmin(): Promise<void> {
  try {
    sessionStorage.removeItem(STORAGE_AUTH_KEY);
    if (isSupabaseConfigured()) {
      await logoutSupabase();
    }
  } catch {}
}
