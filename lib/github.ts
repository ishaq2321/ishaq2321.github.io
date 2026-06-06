const API_BASE = "https://api.github.com";
const USERNAME = "ishaq2321";

interface GitHubResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

async function fetchGitHub<T>(endpoint: string): Promise<GitHubResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      if (res.status === 403) {
        throw new Error("GitHub API rate limit exceeded. Try again later.");
      }
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const data: T = await res.json();
    return { data, error: null, loading: false };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unknown error",
      loading: false,
    };
  }
}

export async function getUser() {
  return fetchGitHub<{
    login: string;
    avatar_url: string;
    public_repos: number;
    followers: number;
    following: number;
    bio: string | null;
  }>(`/users/${USERNAME}`);
}

export async function getRepos() {
  return fetchGitHub<
    Array<{
      name: string;
      description: string | null;
      html_url: string;
      language: string | null;
      stargazers_count: number;
      forks_count: number;
      topics: string[];
      fork: boolean;
    }>
  >(`/users/${USERNAME}/repos?sort=updated&per_page=20`);
}

export async function getMergedPRs() {
  return fetchGitHub<{
    total_count: number;
    items: Array<{
      html_url: string;
      title: string;
      repository_url: string;
      pull_request: {
        merged_at: string;
      };
    }>;
  }>(`/search/issues?q=author:${USERNAME}+type:pr+is:merged&sort=updated&per_page=10`);
}
