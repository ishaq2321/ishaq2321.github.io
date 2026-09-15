"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sections } from "@/lib/sections";

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
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

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
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Measured budget, not a guess: the bar's content box is 1072px, the wordmark
  // is 103px and the gap between them 24px, leaving 945px for the list. The nine
  // labels with their gaps need ~880px; a tenth needs ~980px. Above that the nav
  // uses the same menu as mobile at every width, so a section added to
  // portfolio.config.json can never be silently clipped out of the bar.
  const FITTING_SECTIONS = 9;
  const listFits = sections.length <= FITTING_SECTIONS;

  return (
    <nav
      className="fixed top-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled
          ? "color-mix(in srgb, var(--bg) 80%, transparent)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 sm:px-10">
        <a
          href="#"
          className="group flex shrink-0 items-center gap-2 font-mono text-[13px]"
        >
          <span
            className="grid h-6 w-6 place-items-center rounded-[2px] text-xs font-semibold text-white"
            style={{ background: "var(--accent)" }}
          >
            i
          </span>
          <span style={{ color: "var(--text)" }}>ishaq2321</span>
        </a>

        {/* Desktop nav.

            The guards inside the fitting case: `min-w-0` bounds the list to the
            space left over rather than letting it size to its own content,
            `whitespace-nowrap` stops a label breaking onto two lines, and
            `shrink-0` stops the wordmark being squeezed. That is what used to
            happen at ten sections — every label wrapped, every item became 51px
            tall and the list pushed straight through the wordmark.

            `ml-auto` on the first item right-aligns the group instead of
            `justify-end`, which would push any overflow off the *start* side of
            the scroll container — where flex overflow is unreachable, so items
            would vanish with no way to scroll to them.

            The chapter numbers are absent here on purpose: ten labels need
            1067px of the 1072px bar once each carries its number, and the numbers
            alone are ~195px of that, so they cannot fit without the nav escaping
            the content column's left edge. They stay in the menu below, which
            has vertical room and reads as a numbered table of contents. */}
        <ul
          className={`min-w-0 flex-1 gap-5 overflow-x-auto ${
            listFits ? "hidden lg:flex" : "hidden"
          }`}
        >
          {sections.map((s, i) => (
            <li key={s.id} className={`shrink-0${i === 0 ? " ml-auto" : ""}`}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className="nav-link group flex items-center whitespace-nowrap text-sm transition-colors"
                style={{ color: active === s.id ? "var(--text)" : "var(--text-faint)" }}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={listFits ? "lg:hidden" : undefined}
          style={{ color: "var(--text-muted)" }}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.6}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.6}
                d="M4 7h16M4 12h16M4 17h16"
              />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            className={listFits ? "lg:hidden" : undefined}
            style={{ background: "var(--bg-raised)", borderTop: "1px solid var(--line)" }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Capped and scrollable so a fork with many sections can still
                reach every entry instead of overflowing off-screen. */}
            <ul className="flex max-h-[calc(100dvh-4.5rem)] flex-col gap-1 overflow-y-auto px-6 py-4">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active === s.id ? "true" : undefined}
                    className="flex items-center gap-3 py-2 text-sm"
                    style={{
                      color: active === s.id ? "var(--text)" : "var(--text-muted)",
                    }}
                  >
                    <span
                      className="font-mono text-[11px]"
                      style={{ color: "var(--accent-text)" }}
                    >
                      {s.index}
                    </span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
