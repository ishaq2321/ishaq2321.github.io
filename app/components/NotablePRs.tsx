"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { config } from "@/lib/config";
import { SectionHeader } from "@/app/components/SectionHeader";
import { SpotlightCard } from "@/app/components/SpotlightCard";

export function NotablePRs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="section-shell" id="contributions">
      <SectionHeader index="04" title="Open Source" kicker="Merged upstream" />

      <div ref={ref} className="grid gap-4 sm:grid-cols-3">
        {config.notable_contributions.map((pr, i) => (
          <motion.div
            key={`${pr.repo}-${pr.pr_number}`}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
          <SpotlightCard
            href={pr.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full flex-col justify-between p-6"
          >
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="meta" style={{ color: "var(--accent-text)" }}>
                  {pr.repo}
                </span>
                <span className="font-mono text-xs" style={{ color: "var(--text-faint)" }}>
                  #{pr.pr_number}
                </span>
              </div>
              <h3
                className="font-display text-lg leading-snug transition-colors"
                style={{ color: "var(--text)", letterSpacing: "-0.01em" }}
              >
                {pr.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {pr.description}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--accent)" }}
              />
              <p className="meta">
                Merged{" "}
                {new Date(pr.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
