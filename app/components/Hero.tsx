"use client";

import Image from "next/image";
import { config } from "@/lib/config";
import type { MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const nameParts = config.name.split(" ");

  // Portrait 3D tilt driven by cursor position
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
    <header className="relative flex min-h-screen items-center overflow-hidden">
      {/* Accent glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-[120px]"
        style={{ background: "var(--glow)" }}
      />

      <div className="section-shell relative w-full pt-28">
        {/* Top metadata rail */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="mb-12 flex flex-wrap items-center gap-x-6 gap-y-2"
        >
          <span className="meta" style={{ color: "var(--accent-text)" }}>
            Portfolio / 2026
          </span>
          <span className="h-px w-10" style={{ background: "var(--line-strong)" }} />
          <span className="meta">{config.location}</span>
          <span className="h-px w-10" style={{ background: "var(--line-strong)" }} />
          <span className="meta inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
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

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
          {/* Left: name + tagline */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="mb-3 font-mono text-sm tracking-wide"
              style={{ color: "var(--text-muted)" }}
            >
              Software engineer &amp; open-source contributor
            </motion.p>

            <h1
              className="font-display"
              style={{
                fontWeight: 400,
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                fontSize: "clamp(3rem, 9vw, 6.5rem)",
              }}
            >
              {nameParts.map((part, i) => (
                <motion.span
                  key={part + i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease }}
                  className="block"
                  style={i === nameParts.length - 1 ? { fontStyle: "italic", color: "var(--accent-text)" } : undefined}
                >
                  {part}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease }}
              className="mt-8 max-w-xl text-lg leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {config.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <a href={config.social.github} target="_blank" rel="noopener noreferrer" className="btn-primary">
                GitHub →
              </a>
              <a href="#contact" className="btn-ghost">
                Contact
              </a>
              {config.resumeUrl && (
                <a href={config.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  Résumé (PDF)
                </a>
              )}
            </motion.div>
          </div>

          {/* Right: portrait framed as a plate */}
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
                    borderRadius: "2px",
                    background: "var(--surface)",
                    boxShadow: "var(--shadow)",
                  }}
                >
                  {config.photo ? (
                    <Image src={config.photo} alt={config.name} fill className="object-cover" priority />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-display text-6xl" style={{ color: "var(--text-faint)" }}>
                      {nameParts.map((n) => n[0]).join("")}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-20 flex items-center gap-3"
        >
          <span className="meta">Scroll</span>
          <motion.span
            className="block h-8 w-px origin-top"
            style={{ background: "var(--line-strong)" }}
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </header>
  );
}
