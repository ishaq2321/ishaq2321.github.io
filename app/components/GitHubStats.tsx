"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface GitHubStats {
  repos: number;
  followers: number;
  stars: number;
  prs: number;
  updatedAt: string;
}

function StatCard({ label, value, index }: { label: string; value: string | number; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="card text-center"
    >
      <p className="text-3xl font-bold tabular-nums">{value}</p>
      <p className="mt-1 text-sm text-zinc-400">{label}</p>
    </motion.div>
  );
}

export function GitHubStats() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/github-stats.json");
        if (!res.ok) throw new Error("Stats unavailable");
        const data: GitHubStats = await res.json();
        setStats(data);
      } catch {
        // stats unavailable — show placeholder
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <section className="section-container" id="stats">
      <h2 className="section-title">GitHub</h2>
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="card h-24 animate-pulse bg-zinc-800/50"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Repositories" value={stats?.repos ?? 0} index={0} />
          <StatCard label="Stars" value={stats?.stars ?? 0} index={1} />
          <StatCard label="Followers" value={stats?.followers ?? 0} index={2} />
          <StatCard label="Pull Requests" value={stats?.prs ?? 0} index={3} />
        </div>
      )}
      {!loading && (
        <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50 p-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://ghchart.rshah.org/ishaq2321"
            alt="GitHub contribution graph"
            className="w-full h-auto dark:[filter:invert(0.92)_hue-rotate(180deg)_saturate(0.6)]"
            loading="lazy"
          />
        </div>
      )}
      <motion.a
        href="https://github.com/ishaq2321"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-zinc-500 transition-colors hover:text-accent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
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
      </motion.a>
    </section>
  );
}
