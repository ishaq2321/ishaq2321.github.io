"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin vermilion rule tracking read progress across the top of the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left"
      style={{ scaleX, background: "var(--accent)" }}
    />
  );
}
