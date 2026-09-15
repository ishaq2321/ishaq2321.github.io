"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { config } from "@/lib/config";
import { SectionHeader } from "@/app/components/SectionHeader";
import { useReveal } from "@/app/components/useReveal";
import type { SectionProps } from "@/app/types";

/**
 * References — quoted, attributed and linked.
 *
 * Every entry carries the URL where the words were actually written. That is the
 * difference between a reference and a compliment: a reader can open the source
 * and read the praise in its original context, including whatever came before it.
 * An unverifiable testimonial is worth less than none.
 */
export function References({ anchor, index, title = "Recommendations" }: SectionProps) {
  const ref = useRef(null);
  const revealed = useReveal(ref, { margin: "-60px" });
  const entries = config.references ?? [];

  if (entries.length === 0) return null;

  // One quote in a two-column grid leaves an empty cell, which reads as a
  // broken layout rather than a short section. A lone card keeps a readable
  // measure instead of stretching a single sentence across the full width.
  const many = entries.length > 1;

  return (
    <section className="section-shell" id={anchor}>
      <SectionHeader index={index} title={title} kicker="In their words" />

      <div ref={ref} className={many ? "grid gap-5 md:grid-cols-2" : "max-w-3xl"}>
        {entries.map((entry, i) => (
          <motion.figure
            key={`${entry.author}-${i}`}
            initial={{ opacity: 0, y: 22 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="panel flex h-full flex-col justify-between gap-7 p-7"
          >
            <blockquote className="reference-quote">
              &ldquo;{entry.quote}&rdquo;
            </blockquote>

            <figcaption>
              <span className="hairline mb-5 block" />
              <span
                className="block text-sm font-medium"
                style={{ color: "var(--text)" }}
              >
                {entry.author}
              </span>
              <span className="mt-1 block text-sm" style={{ color: "var(--text-muted)" }}>
                {entry.role}
              </span>
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-mono mt-4"
                style={{ color: "var(--accent-text)" }}
              >
                {entry.source} &rarr;
              </a>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
