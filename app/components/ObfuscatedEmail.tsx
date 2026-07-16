"use client";

import { useState } from "react";

/**
 * Renders an email contact card without ever placing the plaintext address
 * (or a `mailto:` href) in the DOM until a real user interacts with it.
 *
 * Anti-harvesting strategy:
 *  - The address is base64-encoded in the payload (never plaintext).
 *  - It is decoded only on hover / focus / click — so headless scrapers that
 *    parse the static DOM (or even the hydrated DOM) never see the address.
 *  - Until revealed, the card shows a masked placeholder and a dead href.
 */
export function ObfuscatedEmail({ encoded, label }: { encoded: string; label: string }) {
  const [decoded, setDecoded] = useState<string | null>(null);

  const reveal = () => {
    if (!decoded) {
      try {
        setDecoded(atob(encoded));
      } catch {
        /* ignore malformed input */
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Assemble the mailto at click time even if reveal hasn't fired yet.
    if (!decoded) {
      e.preventDefault();
      const addr = atob(encoded);
      setDecoded(addr);
      window.location.href = `mailto:${addr}`;
    }
  };

  return (
    <a
      href={decoded ? `mailto:${decoded}` : "#"}
      onClick={handleClick}
      onMouseEnter={reveal}
      onFocus={reveal}
      onTouchStart={reveal}
      className="panel flex items-center gap-4 p-4"
      aria-label={`Email — ${label} (click to reveal address)`}
    >
      <svg
        className="h-5 w-5 shrink-0"
        style={{ color: "var(--accent-text)" }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.6}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      <span>
        <span className="meta block">{label}</span>
        <span className="text-sm" style={{ color: "var(--text)" }}>
          {decoded ?? "Reveal email"}
        </span>
      </span>
    </a>
  );
}
