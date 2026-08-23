"use client";

import Image from "next/image";
import { config } from "@/lib/config";
import type { MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { AnimatedPortrait } from "./AnimatedPortrait";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const initials = config.name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("");
  const featuredProjects = config.projects.filter((project) => project.featured).length;
  const upstreamRepos = new Set(config.notable_contributions.map((pr) => pr.repo)).size;
  const proofPoints = [
    { value: config.notable_contributions.length, label: "Upstream PRs" },
    { value: upstreamRepos, label: "Major repositories" },
    { value: featuredProjects || config.projects.length, label: featuredProjects ? "Flagship systems" : "Shipped projects" },
  ];

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 15 });

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

        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="mb-3 font-mono text-sm"
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

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease }}
              className="mt-7 max-w-2xl text-lg leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {config.tagline}
            </motion.p>

            {config.about?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease }}
                className="mt-6 max-w-2xl space-y-3 leading-relaxed"
                style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}
              >
                {config.about.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <a href="#contributions" className="btn-primary">
                View evidence <span aria-hidden>↓</span>
              </a>
              <a href={config.social.github} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                GitHub <span aria-hidden>↗</span>
              </a>
              {config.resumeUrl && (
                <a href={config.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  Résumé (PDF)
                </a>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
            className="hidden shrink-0 lg:block"
          >
            <div className="relative" style={{ perspective: 900 }}>
              <span className="meta absolute -left-3 -top-7 -rotate-90 origin-bottom-left whitespace-nowrap">
                Fig. 01
              </span>
              <motion.div
                onMouseMove={handlePortraitMove}
                onMouseLeave={resetPortrait}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative h-56 w-56 overflow-hidden"
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
                  {config.portrait?.enabled ? (
                    <AnimatedPortrait
                      params={config.portrait}
                      px={px}
                      py={py}
                      label={`Animated portrait illustration of ${config.name}`}
                    />
                  ) : config.photo ? (
                    <Image src={config.photo} alt={config.name} fill className="object-cover" priority />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-display text-6xl" style={{ color: "var(--text-faint)" }}>
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
          aria-label="Selected engineering evidence"
        >
          {proofPoints.map((point) => (
            <div key={point.label} className="proof-point">
              <dt className="meta mt-1">{point.label}</dt>
              <dd className="font-display text-3xl tabular-nums" style={{ color: "var(--text)" }}>
                {point.value}
              </dd>
            </div>
          ))}
          <div className="proof-point proof-point--text">
            <dt className="meta mt-1">Primary architecture</dt>
            <dd className="font-mono text-sm" style={{ color: "var(--text)" }}>
              {config.projects.find((project) => project.featured)?.stack.slice(0, 3).join(" / ") ?? config.projects[0]?.stack.slice(0, 3).join(" / ")}
            </dd>
          </div>
        </motion.dl>
      </div>
    </header>
  );
}
