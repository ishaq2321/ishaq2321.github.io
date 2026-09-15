"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { config } from "@/lib/config";
import { SectionHeader } from "@/app/components/SectionHeader";
import { SpotlightCard } from "@/app/components/SpotlightCard";
import { useReveal } from "@/app/components/useReveal";
import type { SectionProps } from "@/app/types";

export function NotablePRs({ anchor, index, title = "Open Source" }: SectionProps) {
  const ref = useRef(null);
  const revealed = useReveal(ref, { margin: "-60px" });

  return (
    <section className="section-shell section-shell--tight" id={anchor}>
      <SectionHeader index={index} title={title} kicker="Upstream patches" />

      <div ref={ref} className="contribution-grid">
        {config.notable_contributions.map((pr, i) => {
          const featured = i === 0;
          return (
            <motion.div
              key={`${pr.repo}-${pr.pr_number}`}
              initial={{ opacity: 0, y: 24 }}
              animate={revealed ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <SpotlightCard
                href={pr.url}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  featured
                    ? "contribution-lead group flex h-full flex-col justify-between gap-6 p-7"
                    : "group flex h-full flex-col justify-between p-6"
                }
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="meta" style={{ color: "var(--accent-text)" }}>
                      {pr.repo}
                    </span>
                    {!featured && (
                      <span
                        className="font-mono text-xs"
                        style={{ color: "var(--text-faint)" }}
                      >
                        #{pr.pr_number}
                      </span>
                    )}
                  </div>
                  <h3
                    className={`font-display leading-snug transition-colors ${
                      featured ? "text-2xl" : "text-lg"
                    }`}
                    style={{ color: "var(--text)", letterSpacing: "-0.01em" }}
                  >
                    {pr.title}
                  </h3>
                  <p
                    className="measure mt-3 text-sm leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {pr.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  {featured && (
                    <span
                      className="chip font-mono text-xs"
                      style={{ color: "var(--accent-text)" }}
                    >
                      #{pr.pr_number}
                    </span>
                  )}
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                  <p className="meta">
                    {pr.status ?? "Merged"}{" "}
                    {new Date(pr.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
