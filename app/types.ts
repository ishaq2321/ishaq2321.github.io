export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  name: string;
  url: string;
  live?: string;
  benchmarkUrl?: string;
  docsUrl?: string;
  npm?: string;
  pypi?: string;
  description: string;
  stack: string[];
  highlights?: string[];
  featured?: boolean;
  links?: ProjectLink[];
}

export interface NotablePR {
  repo: string;
  pr_number: number;
  title: string;
  url: string;
  date: string;
  description: string;
}

export interface Social {
  github: string;
  linkedin: string;
}

export interface Experience {
  role: string;
  organization?: string;
  period: string;
  description: string;
  skills: string[];
}

export interface PortraitConfig {
  enabled?: boolean;
  asset?: string;
  eyelid?: string;
  lips?: string;
  outfit?: string;
  outfitShadow?: string;
}

export interface PortfolioConfig {
  name: string;
  tagline: string;
  about: string[];
  location: string;
  emailEncoded: string;
  contactCategories?: Array<{ label: string; encoded: string }>;
  photo: string;
  portrait?: PortraitConfig;
  resumeUrl?: string;
  social: Social;
  skills: {
    languages: string[];
    frameworks: string[];
    mobile?: string[];
    ai_ml: string[];
    security: string[];
    platforms: string[];
    operating_systems?: string[];
    tools: string[];
  };
  projects: Project[];
  notable_contributions: NotablePR[];
  experience: Experience[];
  goatcounter?: string;
  verification?: {
    google?: string;
    bing?: string;
  };
  education: {
    degree: string;
    university: string;
    faculty: string;
    period: string;
    thesis: string;
    scholarship?: string;
    highSchool?: Array<{
      degree: string;
      school: string;
      board: string;
      period: string;
      achievements?: string[];
    }>;
    achievements?: string[];
  };
}

