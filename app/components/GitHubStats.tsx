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
  const [chartError, setChartError] = useState(false);
  const [chartColor, setChartColor] = useState("e2523b");

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

  // Match the contribution chart tint to the active theme's accent.
  useEffect(() => {
    const sync = () =>
      setChartColor(
        document.documentElement.classList.contains("light") ? "c0392a" : "e2523b",
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
      <SectionHeader index="03" title="GitHub" kicker="Activity / Signal" />

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="panel h-32 animate-pulse" />
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
