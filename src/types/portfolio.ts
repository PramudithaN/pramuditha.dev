export type PageType = 'home' | 'logic' | 'aesthetics' | 'about' | 'admin' | 'reminder';
export type ThemeMode = 'light' | 'dark';

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

export interface GitHubRepo {
  name: string;
  full_name?: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  language: string | null;
  topics?: string[];
  homepage?: string | null;
  license?: { key: string; name: string } | null;
  fork?: boolean;
}

export interface SkillItem {
  text: string;
  logo: string;
}

export interface BeyondCodeItem {
  title: string;
  description: string;
  icon: 'palette' | 'mountain' | 'clapperboard';
  link: PageType | null;
}

export interface SocialLinkItem {
  name: string;
  url: string;
  icon: string;
  title: string;
}
