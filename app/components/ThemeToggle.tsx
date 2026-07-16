"use client";

import { useSyncExternalStore, useCallback } from "react";

function getSnapshot(): string {
  try {
    return localStorage.getItem("theme") ?? "dark";
  } catch {
    return "dark";
  }
}

function getServerSnapshot(): string {
  return "dark";
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const dark = theme !== "light";

  const toggle = useCallback(() => {
    const next = !dark;
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("light", !next);
    window.dispatchEvent(new Event("storage"));
  }, [dark]);

  return (
    <button
      onClick={toggle}
      className="grid h-11 w-11 place-items-center rounded-[2px] border transition-colors"
      style={{
        borderColor: "var(--line-strong)",
        background: "var(--bg-raised)",
        color: "var(--text-muted)",
        boxShadow: "var(--shadow)",
      }}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}
