"use client";

import { useEffect, useState } from "react";
import { useInView } from "framer-motion";

/** `margin` as framer-motion types it internally (it is not re-exported). */
type Margin = NonNullable<Parameters<typeof useInView>[1]>["margin"];

/**
 * Scroll-reveal gate that can never leave content invisible.
 *
 * `useInView(ref, { once: true })` has no recovery path. If the observer
 * delivery misses an element — a fast fling, a programmatic scroll, a
 * full-page capture — that element stays at its `initial` opacity forever.
 * Measured on this site: a fast scroll left ~7,400px of the mobile page at
 * `opacity: 0`, i.e. a blank screen.
 *
 * This keeps the scroll-triggered motion but guarantees the reveal: content
 * also becomes visible after a short timer, so a missed observation degrades
 * to "revealed a moment early" instead of "missing".
 */
export function useReveal(
  ref: React.RefObject<Element | null>,
  { margin = "-40px", fallbackMs = 2500 }: { margin?: Margin; fallbackMs?: number } = {},
): boolean {
  const inView = useInView(ref, { once: true, margin });
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), fallbackMs);
    return () => window.clearTimeout(timer);
  }, [fallbackMs]);

  return inView || timedOut;
}
