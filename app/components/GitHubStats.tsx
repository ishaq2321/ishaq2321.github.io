"use client";

import { useEffect, useState } from "react";

interface GitHubUser {
  login: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  bio: string | null;
}

interface GitHubRepo {
  name: string;
  html_url: string;
  stargazers_count: number;
  fork: boolean;
}

interface GitHubPREntry {
  html_url: string;
  title: string;
  repository_url: string;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card text-center">
      <p className="text-3xl font-bold tabular-nums">{value}</p>
      <p className="mt-1 text-sm text-zinc-400">{label}</p>
    </div>
  );
}

export function GitHubStats() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [totalStars, setTotalStars] = useState(0);
  const [totalPRs, setTotalPRs] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [userRes, reposRes, prsRes] = await Promise.all([
          fetch("https://api.github.com/users/ishaq2321", {
            headers: { Accept: "application/vnd.github.v3+json" },
          }),
          fetch(
            "https://api.github.com/users/ishaq2321/repos?per_page=100",
            { headers: { Accept: "application/vnd.github.v3+json" } }
          ),
          fetch(
            "https://api.github.com/search/issues?q=author:ishaq2321+type:pr+is:merged&per_page=1",
            { headers: { Accept: "application/vnd.github.v3+json" } }
          ),
        ]);

        if (!userRes.ok || !reposRes.ok || !prsRes.ok) {
          throw new Error("API rate limited or unavailable");
        }

        const userData: GitHubUser = await userRes.json();
        const reposData: GitHubRepo[] = await reposRes.json();
        const prsData: { total_count: number; items: GitHubPREntry[] } =
          await prsRes.json();

        setUser(userData);
        setTotalStars(
          reposData
            .filter((r) => !r.fork)
            .reduce((sum, r) => sum + r.stargazers_count, 0)
        );
        setTotalPRs(prsData.total_count);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <section className="section-container" id="stats">
      <h2 className="section-title">GitHub</h2>
      {error && (
        <p className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </p>
      )}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="card h-24 animate-pulse bg-zinc-800/50"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Repositories" value={user?.public_repos ?? 0} />
          <StatCard label="Stars" value={totalStars} />
          <StatCard label="Followers" value={user?.followers ?? 0} />
          <StatCard label="Pull Requests" value={totalPRs} />
        </div>
      )}
      <a
        href="https://github.com/ishaq2321"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-zinc-500 transition-colors hover:text-accent"
      >
        github.com/ishaq2321
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </section>
  );
}
