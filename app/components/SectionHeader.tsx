"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useReveal } from "@/app/components/useReveal";

/**
 * Chapter-style section header used across the monograph. Every header shares
 * ONE skeleton — index badge, vermilion rule, kicker, then the title — so the
 * title always starts on the same left edge as the section's own content.
 *
 * "quiet" keeps a second tempo without breaking that edge: the title is set
 * smaller and gains a hairline under it. An earlier version moved the title into
 * a second column, which read as misalignment rather than rhythm.
 */
export function SectionHeader({
  index,
  title,
  kicker,
  variant = "chapter",
}: {
  index: string;
  title: string;
  kicker?: string;
  variant?: "chapter" | "rail";
}) {
  const ref = useRef(null);
  const revealed = useReveal(ref, { margin: "-60px" });
  const quiet = variant === "rail";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={revealed ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`section-head${quiet ? " section-head--quiet" : ""} mb-10 sm:mb-12`}
    >
      <div className="section-head__label mb-4">
        <span className="chapter-index">{index}</span>
        <span className="section-rule" />
        <motion.span
          className="h-px flex-1"
          style={{ background: "var(--line)", transformOrigin: "left" }}
          initial={{ scaleX: 0 }}
          animate={revealed ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
        {kicker && <span className="meta">{kicker}</span>}
      </div>
      <div className="section-head__title overflow-hidden">
        <motion.h2
          className={quiet ? "chapter-title chapter-title--quiet" : "chapter-title"}
          initial={{ y: "110%" }}
          animate={revealed ? { y: "0%" } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.h2>
      </div>
      {quiet && (
        <motion.span
          className="section-head__rule"
          style={{ transformOrigin: "left" }}
          initial={{ scaleX: 0 }}
          animate={revealed ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </motion.div>
  );
}
