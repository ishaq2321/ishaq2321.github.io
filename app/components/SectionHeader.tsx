"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Chapter-style section header used across the monograph.
 * Renders a monospace index (e.g. "02"), a serif title, and a hairline rule.
 */
export function SectionHeader({
  index,
  title,
  kicker,
}: {
  index: string;
  title: string;
  kicker?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mb-14"
    >
      <div className="mb-4 flex items-center gap-4">
        <span className="chapter-index">{index}</span>
        <motion.span
          className="h-px flex-1"
          style={{ background: "var(--line)", transformOrigin: "left" }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
        {kicker && <span className="meta">{kicker}</span>}
      </div>
      <div className="overflow-hidden">
        <motion.h2
          className="chapter-title"
          initial={{ y: "110%" }}
          animate={inView ? { y: "0%" } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.h2>
      </div>
    </motion.div>
  );
}
