export interface Skill {
  name: string;
  level?: number;
}

export interface Project {
  name: string;
  url: string;
  live?: string;
  description: string;
  stack: string[];
  highlights?: string[];
}

export interface NotablePR {
  repo: string;
  pr_number: number;
  title: string;
  url: string;
  date: string;
  description: string;
}

export interface Book {
  title: string;
  author: string;
  status: string;
}

export interface Social {
  github: string;
  linkedin: string;
}

export interface PortfolioConfig {
  name: string;
  tagline: string;
  location: string;
  email: string;
  social: Social;
  skills: {
    languages: Skill[];
    frameworks: string[];
    platforms: string[];
    ai_ml: string[];
    security: string[];
    tools: string[];
  };
  projects: Project[];
  notable_contributions: NotablePR[];
  education: {
    degree: string;
    university: string;
    faculty: string;
    status: string;
    thesis: string;
    tdk: string;
  };
  books: Book[];
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  fork: boolean;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  bio: string | null;
}
