"use client";

import Image from "next/image";
import { config } from "@/lib/config";
import type { ProofPoint } from "@/app/types";
import type { MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const initials = config.name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("");
  // The evidence rail states each fact once, as a number that can be checked
  // further down the page. Falls back to computed figures so a fork without a
  // `proof` block still renders something true rather than nothing.
  const upstreamRepos = new Set(config.notable_contributions.map((pr) => pr.repo)).size;
  const liveProducts = config.projects.filter((project) => project.live).length;
  // A number a visitor can count for themselves is computed here rather than
  // typed into config, so the rail can never state a figure that the sections
  // further down contradict. "4 merged" and "2 products live" both went stale
  // precisely because they were literal strings.
  const derived: Record<string, string> = {
    mergedUpstream: String(config.notable_contributions.length),
    upstreamRepos: String(upstreamRepos),
    liveProducts: String(liveProducts),
  };
  const proofSource: ProofPoint[] =
    config.proof && config.proof.length > 0
      ? config.proof
      : [
          {
            derive: "mergedUpstream",
            label: "Merged upstream PRs",
            href: "#contributions",
          },
          { derive: "upstreamRepos", label: "Upstream projects", href: "#contributions" },
          { derive: "liveProducts", label: "Products live in production" },
        ];
  // Resolved before render, so the rail always holds a plain string to display.
  const proofPoints: (ProofPoint & { value: string })[] = proofSource.map((point) => ({
    ...point,
    value: point.derive
      ? (derived[point.derive] ?? point.value ?? "")
      : (point.value ?? ""),
  }));

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 15,
  });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 15,
  });

  function handlePortraitMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function resetPortrait() {
    px.set(0);
    py.set(0);
  }

  return (
    <header className="relative flex min-h-[min(58rem,100svh)] items-center overflow-hidden">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-[120px]"
        style={{ background: "var(--glow)" }}
      />

      <div className="section-shell relative w-full pb-14 pt-28 sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2"
        >
          <span className="meta" style={{ color: "var(--accent-text)" }}>
            Portfolio / {new Date().getFullYear()}
          </span>
          <span className="h-px w-10" style={{ background: "var(--line-strong)" }} />
          <span className="meta">{config.location}</span>
          <span className="h-px w-10" style={{ background: "var(--line-strong)" }} />
          <span className="meta inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ background: "var(--accent)" }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ background: "var(--accent)" }}
              />
            </span>
            Currently building ProxiCall
          </span>
        </motion.div>

        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
          <div className="min-w-0">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="mb-3 font-mono text-[13px]"
              style={{ color: "var(--text-muted)" }}
            >
              Software engineer &amp; open-source contributor
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
              className="hero-name font-display"
            >
              {config.name}
            </motion.h1>

            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease }}
              className="section-rule mt-6"
              style={{ transformOrigin: "left" }}
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease }}
              className="measure mt-7 text-lg leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {config.tagline || config.about?.[0]}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <a href="#contributions" className="btn-primary">
                View evidence <span aria-hidden>↓</span>
              </a>
              <a
                href={config.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                GitHub <span aria-hidden>↗</span>
              </a>
              {config.resumeUrl && (
                <a
                  href={config.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  Résumé (PDF)
                </a>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
            className="order-first shrink-0 justify-self-start lg:order-none"
          >
            <div className="relative" style={{ perspective: 900 }}>
              <span className="meta absolute -left-3 -top-7 hidden origin-bottom-left -rotate-90 whitespace-nowrap lg:inline-block">
                Fig. 01
              </span>
              <motion.div
                onMouseMove={handlePortraitMove}
                onMouseLeave={resetPortrait}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative h-28 w-28 overflow-hidden sm:h-36 sm:w-36 lg:h-56 lg:w-56"
              >
                <div
                  className="relative h-full w-full overflow-hidden"
                  style={{
                    border: "1px solid var(--line-strong)",
                    borderRadius: "var(--radius-card)",
                    background: "var(--surface)",
                    boxShadow: "var(--shadow-featured)",
                  }}
                >
                  {config.photo ? (
                    <Image
                      src={config.photo}
                      alt={config.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center font-display text-6xl"
                      style={{ color: "var(--text-faint)" }}
                    >
                      {initials}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.dl
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease }}
          className="proof-rail mt-12"
          data-cols="3"
          aria-label="Selected engineering evidence"
        >
          {proofPoints.map((point) => {
            const numeric = /^[\d.,%+]+$/.test(point.value);
            return (
              <div key={point.label} className="proof-point">
                <dt className="meta mt-1">{point.label}</dt>
                <dd
                  className={
                    numeric
                      ? "font-display text-3xl tabular-nums"
                      : "font-mono text-[13px] leading-relaxed"
                  }
                  style={{ color: numeric ? "var(--accent-text)" : "var(--text)" }}
                >
                  {point.href ? (
                    <a
                      href={point.href}
                      className="inline-block min-w-6 py-1 transition-colors hover:text-[var(--accent-text)]"
                    >
                      {point.value}
                    </a>
                  ) : (
                    point.value
                  )}
                </dd>
              </div>
            );
          })}
        </motion.dl>
      </div>
    </header>
  );
}
