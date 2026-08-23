"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { SectionHeader } from "@/app/components/SectionHeader";
import { SpotlightCard } from "@/app/components/SpotlightCard";

interface GitHubStats {
  repos: number;
  followers: number;
  stars: number;
  prs: number;
  updatedAt: string;
}

const GH_USER = "ishaq2321";

/** Fetch numbers straight from the GitHub API so they are always current. */
async function fetchLiveStats(): Promise<GitHubStats | null> {
  try {
    const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
    const [userRes, reposRes, prsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GH_USER}`, { headers }),
      fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100`, { headers }),
      // "-user:" excludes PRs opened against his own repos → upstream-only count.
      fetch(
        `https://api.github.com/search/issues?q=author:${GH_USER}+type:pr+is:merged+-user:${GH_USER}&per_page=1`,
        { headers },
      ),
    ]);
    if (!userRes.ok || !reposRes.ok) return null;

    const user = await userRes.json();
    const repos = await reposRes.json();
    const stars = Array.isArray(repos)
      ? repos.filter((r) => !r.fork).reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0)
      : 0;
    const prs = prsRes.ok ? ((await prsRes.json()).total_count ?? 0) : 0;

    return {
      repos: user.public_repos ?? 0,
      followers: user.followers ?? 0,
      stars,
      prs,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/** Fallback to the build-time snapshot when the API is down or rate-limited. */
async function fetchSnapshotStats(): Promise<GitHubStats | null> {
  try {
    const res = await fetch("/github-stats.json");
    if (!res.ok) return null;
    return (await res.json()) as GitHubStats;
  } catch {
    return null;
  }
}

function CountUp({ value }: { value: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [isInView, value, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

function StatCard({ label, value, index }: { label: string; value: number; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <SpotlightCard className="p-6">
        <p className="meta mb-3">{String(index + 1).padStart(2, "0")}</p>
        <p className="font-display tabular-nums" style={{ fontSize: "2.75rem", lineHeight: 1, color: "var(--text)" }}>
          <CountUp value={value} />
        </p>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
      </SpotlightCard>
    </motion.div>
  );
}

export function GitHubStats() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [chartError, setChartError] = useState(false);
  const [chartColor, setChartColor] = useState("de6f54");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const live = await fetchLiveStats();
      if (cancelled) return;
      if (live) {
        setStats(live);
      } else {
        const snapshot = await fetchSnapshotStats();
        if (cancelled) return;
        if (snapshot) setStats(snapshot);
        else setFailed(true);
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Match the contribution chart tint to the active theme's accent.
  useEffect(() => {
    const sync = () =>
      setChartColor(
        document.documentElement.classList.contains("light") ? "bf4a30" : "de6f54",
      );
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-shell" id="stats">
      <SectionHeader index="04" title="GitHub" kicker="Activity / Signal" />

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="panel h-32 animate-pulse" />
          ))}
        </div>
      ) : failed ? (
        <p className="panel p-6 text-sm" style={{ color: "var(--text-muted)" }}>
          GitHub stats are temporarily unavailable — see{" "}
          <a
            href={`https://github.com/${GH_USER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="link-mono"
          >
            github.com/{GH_USER}
          </a>{" "}
          for live numbers.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Repositories" value={stats?.repos ?? 0} index={0} />
          <StatCard label="Stars" value={stats?.stars ?? 0} index={1} />
          <StatCard label="Followers" value={stats?.followers ?? 0} index={2} />
          <StatCard label="Pull Requests" value={stats?.prs ?? 0} index={3} />
        </div>
      )}

      {!loading && !chartError && (
        <div className="panel mt-6 overflow-x-auto p-4">
          {/* Reserve the chart's intrinsic ratio (~9.6:1) to avoid layout shift */}
          <div style={{ aspectRatio: "104 / 14", minWidth: 640 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://ghchart.rshah.org/${chartColor}/ishaq2321`}
              alt="GitHub contribution graph for the past year"
              className="h-full w-full"
              loading="lazy"
              onError={() => setChartError(true)}
            />
          </div>
        </div>
      )}

      <a
        href="https://github.com/ishaq2321"
        target="_blank"
        rel="noopener noreferrer"
        className="link-mono mt-6 inline-flex items-center gap-2"
      >
        github.com/ishaq2321
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </section>
  );
}
