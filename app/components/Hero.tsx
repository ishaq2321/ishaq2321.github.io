"use client";

import Image from "next/image";
import { config } from "@/lib/config";
import { sections } from "@/lib/sections";
import type { Portrait, ProofPoint } from "@/app/types";
import type { MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ portrait }: { portrait: Portrait }) {
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
  // The hero links into the section list, and a fork can switch any of those off
  // one entry at a time. Resolving the anchors against the registry means a
  // disabled section costs a link rather than leaving one pointing at an anchor
  // that no longer exists — the same failure the nav used to have.
  const renderedIds = new Set(sections.map((section) => section.id));
  const firstAnchor = sections[0] ? `#${sections[0].id}` : undefined;
  const sectionHref = (href?: string) =>
    href && href.startsWith("#") && !renderedIds.has(href.slice(1)) ? undefined : href;

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
  // Pointer-driven motion is still motion: honour the OS setting and hold the portrait still.
  const reduceMotion = useReducedMotion();
  const spring = { stiffness: 150, damping: 15 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), spring);

  // Depth: the two layers drift against each other, the near one further and opposite to
  // the far one, the way a near object moves more than a distant one when you move your head.
  // Offsets are percentages, not pixels, so the drift keeps its proportion to the card as
  // the card scales down (224px on desktop, 112px on mobile) and can never outrun the
  // scale margin that hides the layer edges.
  const farX = useSpring(useTransform(px, [-0.5, 0.5], ["-1.1%", "1.1%"]), spring);
  const farY = useSpring(useTransform(py, [-0.5, 0.5], ["-0.9%", "0.9%"]), spring);
  const nearX = useSpring(useTransform(px, [-0.5, 0.5], ["2.2%", "-2.2%"]), spring);
  const nearY = useSpring(useTransform(py, [-0.5, 0.5], ["1.8%", "-1.8%"]), spring);

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
              {/* Points at whatever section renders first, so it stays honest
                  when a fork switches "Open Source" off. Gone entirely if the
                  page has no sections left to view. */}
              {firstAnchor && (
                <a href={firstAnchor} className="btn-primary">
                  View evidence <span aria-hidden>↓</span>
                </a>
              )}
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
                onMouseMove={reduceMotion ? undefined : handlePortraitMove}
                onMouseLeave={reduceMotion ? undefined : resetPortrait}
                style={
                  reduceMotion
                    ? undefined
                    : { rotateX, rotateY, transformStyle: "preserve-3d" }
                }
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
                  {portrait.photo ? (
                    <>
                      {/* Far layer: always rendered, and slightly oversized so the drift
                          never exposes a card edge. */}
                      <motion.div
                        className="absolute inset-0"
                        style={
                          reduceMotion
                            ? { scale: 1.04 }
                            : { scale: 1.04, x: farX, y: farY }
                        }
                      >
                        <Image
                          src={portrait.photo}
                          alt={config.name}
                          fill
                          className="object-cover"
                          priority
                        />
                      </motion.div>
                      {/* Near layer: optional cutout of the subject, drifting further and
                          the other way. Decorative, so it is hidden from assistive tech. */}
                      {portrait.photoHead ? (
                        <motion.div
                          aria-hidden
                          className="absolute inset-0"
                          style={
                            reduceMotion
                              ? { scale: 1.06 }
                              : { scale: 1.06, x: nearX, y: nearY }
                          }
                        >
                          <Image
                            src={portrait.photoHead}
                            alt=""
                            fill
                            className="object-cover"
                            priority
                          />
                        </motion.div>
                      ) : null}
                    </>
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
            const href = sectionHref(point.href);
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
                  {href ? (
                    <a
                      href={href}
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
