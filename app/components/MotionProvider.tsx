"use client";

import { MotionConfig } from "framer-motion";

/**
 * Wraps the tree in Framer Motion's MotionConfig with reducedMotion="user",
 * so every animation automatically respects the OS "reduce motion" setting.
 * CSS-level motion is handled separately in globals.css.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
