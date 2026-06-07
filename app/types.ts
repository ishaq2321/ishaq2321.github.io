export interface Project {
  name: string;
  url: string;
  live?: string;
  description: string;
  stack: string[];
  highlights?: string[];
  featured?: boolean;
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

export interface PortfolioConfig {
  name: string;
  tagline: string;
  about: string[];
  location: string;
  email: string;
  emails?: string[];
  contactCategories?: Array<{ label: string; email: string }>;
  photo: string;
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

