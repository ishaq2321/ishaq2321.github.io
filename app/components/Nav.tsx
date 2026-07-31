"use client";

import { useState, useEffect } from "react";

const sections = [
  { id: "contributions", label: "Open Source", num: "01" },
  { id: "projects", label: "Projects", num: "02" },
  { id: "experience", label: "Experience", num: "03" },
  { id: "stats", label: "GitHub", num: "04" },
  { id: "skills", label: "Toolkit", num: "05" },
  { id: "education", label: "Education", num: "06" },
  { id: "books", label: "Bookshelf", num: "07" },
  { id: "contact", label: "Contact", num: "08" },
];

export function Nav() {
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Elevate the bar background once the page has scrolled a little.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track the active section with IntersectionObserver — no layout thrash.
  useEffect(() => {
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        let best = "";
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio >= bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (best) setActive(best);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="fixed top-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled ? "color-mix(in srgb, var(--bg) 80%, transparent)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <a href="#" className="group flex items-center gap-2 font-mono text-sm">
          <span
            className="grid h-6 w-6 place-items-center rounded-[2px] text-xs font-semibold text-white"
            style={{ background: "var(--accent)" }}
          >
            i
          </span>
          <span style={{ color: "var(--text)" }}>ishaq2321</span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden gap-7 lg:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className="nav-link group flex items-center gap-1.5 text-sm transition-colors"
                style={{ color: active === s.id ? "var(--text)" : "var(--text-faint)" }}
              >
                <span
                  className="font-mono text-[10px]"
                  style={{ color: active === s.id ? "var(--accent-text)" : "var(--text-faint)" }}
                >
                  {s.num}
                </span>
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden"
          style={{ color: "var(--text-muted)" }}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="lg:hidden"
          style={{ background: "var(--bg-raised)", borderTop: "1px solid var(--line)" }}
        >
          <ul className="flex flex-col gap-1 px-6 py-4">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active === s.id ? "true" : undefined}
                  className="flex items-center gap-3 py-2 text-sm"
                  style={{ color: active === s.id ? "var(--text)" : "var(--text-muted)" }}
                >
                  <span className="font-mono text-[10px]" style={{ color: "var(--accent-text)" }}>
                    {s.num}
                  </span>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
