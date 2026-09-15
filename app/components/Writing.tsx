"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { config } from "@/lib/config";
import { SectionHeader } from "@/app/components/SectionHeader";
import { useReveal } from "@/app/components/useReveal";
import type { SectionProps } from "@/app/types";

/**
 * Writing — a dated list of pieces published elsewhere.
 *
 * Deliberately a link list and not a blog. A blog is the one feature that needs
 * its own content folder and a publishing habit; a portfolio whose blog was last
 * updated two years ago reads worse than a portfolio with no blog. Every entry
 * here points at something that already exists and can be read today.
 */
export function Writing({ anchor, index, title = "Writing" }: SectionProps) {
  const ref = useRef(null);
  const revealed = useReveal(ref, { margin: "-60px" });
  const entries = config.writing ?? [];

  if (entries.length === 0) return null;

  return (
    <section className="section-shell section-shell--tight" id={anchor}>
      <SectionHeader
        index={index}
        title={title}
        kicker="Published elsewhere"
        variant="rail"
      />

      <div ref={ref}>
        {entries.map((entry, i) => (
          <motion.a
            key={entry.url}
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="writing-row sm:flex-row sm:items-baseline sm:gap-6"
          >
            <span className="meta shrink-0 tabular-nums sm:w-24">{entry.date}</span>

            <span className="min-w-0 flex-1">
              <span
                className="writing-row__title block font-display text-lg leading-snug"
                style={{ letterSpacing: "-0.01em" }}
              >
                {entry.title}
              </span>

              {entry.note && (
                <span
                  className="measure mt-2 block text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {entry.note}
                </span>
              )}

              <span className="mt-3 flex flex-wrap items-center gap-2">
                <span className="chip">{entry.venue}</span>
                <span className="link-mono" style={{ color: "var(--accent-text)" }}>
                  Read →
                </span>
              </span>
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
