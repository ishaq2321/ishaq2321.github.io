"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

/**
 * A panel that renders a soft radial glow following the cursor.
 * Uses CSS custom properties updated on mousemove — no re-renders.
 * Can render as a <div> or <a> (pass href).
 */
export function SpotlightCard({
  children,
  className = "",
  href,
  target,
  rel,
  style,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLElement | null>(null);

  function handleMove(e: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  const cls = `spotlight ${className}`;

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        className={cls}
        style={style}
        onMouseMove={handleMove}
      >
        {children}
      </a>
    );
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cls}
      style={style}
      onMouseMove={handleMove}
    >
      {children}
    </div>
  );
}
