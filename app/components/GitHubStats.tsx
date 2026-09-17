"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { SectionHeader } from "@/app/components/SectionHeader";
import { useReveal } from "@/app/components/useReveal";
import type { SectionProps } from "@/app/types";

interface GitHubStats {
  repos: number;
  followers: number;
  stars: number;
  updatedAt: string;
}

const GH_USER = "ishaq2321";

/** Contribution-chart tint: the accent of the dark theme, the only theme there is. */
const CHART_TINT = "c9402a";

/** Fetch numbers straight from the GitHub API so they are always current. */
async function fetchLiveStats(): Promise<GitHubStats | null> {
  try {
    const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GH_USER}`, { headers }),
      fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100`, { headers }),
    ]);
    if (!userRes.ok || !reposRes.ok) return null;

    const user = await userRes.json();
    const repos = await reposRes.json();
    const stars = Array.isArray(repos)
      ? repos
          .filter((r) => !r.fork)
          .reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0)
      : 0;

    return {
      repos: user.public_repos ?? 0,
      followers: user.followers ?? 0,
      stars,
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
  const isInView = useReveal(ref);
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

/**
 * A ruled data row instead of four floating cards. These are the weakest
 * numbers on the page, so they get a quiet horizontal strip in mono — visibly
 * quieter than the hero's display-type rail above, and no longer a second
 * copy of the merged-PR count stated in the hero.
 */
function StatRail({ stats }: { stats: GitHubStats | null }) {
  const ref = useRef(null);
  const revealed = useReveal(ref);

  const items = [
    { label: "Public repositories", value: stats?.repos ?? 0 },
    { label: "Stars earned", value: stats?.stars ?? 0 },
    { label: "Followers", value: stats?.followers ?? 0 },
  ];

  return (
    <motion.dl
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={revealed ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="proof-rail"
      data-cols="3"
      data-tone="data"
      aria-label="GitHub activity"
    >
      {items.map((item) => (
        <div key={item.label} className="proof-point">
          <dt className="meta mt-1">{item.label}</dt>
          <dd className="font-mono text-xl tabular-nums" style={{ color: "var(--text)" }}>
            <CountUp value={item.value} />
          </dd>
        </div>
      ))}
    </motion.dl>
  );
}

export function GitHubStats({ anchor, index, title = "GitHub" }: SectionProps) {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [chartError, setChartError] = useState(false);

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

  return (
    <section className="section-shell section-shell--tight" id={anchor}>
      <SectionHeader index={index} title={title} kicker="Activity / Signal" />

      {loading ? (
        <div className="proof-rail" data-cols="3" data-tone="data">
          {[0, 1, 2].map((i) => (
            <div key={i} className="proof-point">
              <div
                className="mt-1 h-6 w-16 animate-pulse rounded-[2px]"
                style={{ background: "var(--surface)" }}
              />
            </div>
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
        <StatRail stats={stats} />
      )}

      {!loading && !chartError && (
        <div
          className="panel mt-6 overflow-x-auto p-4"
          style={{ overscrollBehaviorX: "contain" }}
        >
          {/* Reserve the chart's intrinsic ratio (~9.6:1) to avoid layout shift.
              Narrowed from 640px so a phone scrolls ~1.5 screens instead of 2. */}
          <div style={{ aspectRatio: "104 / 14", minWidth: 560 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://ghchart.rshah.org/${CHART_TINT}/ishaq2321`}
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
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.6}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </section>
  );
}
