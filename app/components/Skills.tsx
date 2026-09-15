"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { config } from "@/lib/config";
import { skillIcons } from "@/lib/iconMap";
import { SectionHeader } from "@/app/components/SectionHeader";
import { useReveal } from "@/app/components/useReveal";
import type { SectionProps } from "@/app/types";

/** Muted ink/bone tint so brand logos never break the palette. */
const ICON_TINT_DARK = "b8afa4";
const ICON_TINT_LIGHT = "514b43";

function useIconTint(): string {
  const [tint, setTint] = useState(ICON_TINT_DARK);
  useEffect(() => {
    const sync = () =>
      setTint(
        document.documentElement.classList.contains("light")
          ? ICON_TINT_LIGHT
          : ICON_TINT_DARK
      );
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
  return tint;
}

function iconUrl(skill: string, tint: string): string | null {
  const slug = skillIcons[skill];
  return slug ? `https://cdn.simpleicons.org/${slug}/${tint}` : null;
}

function FallbackDot() {
  return (
    <span
      className="h-1.5 w-1.5 shrink-0 rounded-full"
      style={{ background: "var(--text-faint)", opacity: 0.55 }}
      aria-hidden
    />
  );
}

function SkillIcon({ skill, tint }: { skill: string; tint: string }) {
  const icon = iconUrl(skill, tint);
  if (!icon) return <FallbackDot />;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny external CDN icon, static export
    <img
      src={icon}
      alt=""
      className="h-4 w-4 shrink-0"
      loading="lazy"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}

function SkillCategory({
  title,
  skills,
  index,
  isLast,
  tint,
}: {
  title: string;
  skills: string[];
  index: number;
  isLast: boolean;
  tint: string;
}) {
  const ref = useRef(null);
  const isInView = useReveal(ref);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 gap-x-8 gap-y-4 py-7 sm:grid-cols-[minmax(140px,180px)_1fr]"
      style={isLast ? undefined : { borderBottom: "1px solid var(--line)" }}
    >
      <div className="flex items-baseline gap-3 sm:flex-col sm:gap-1.5">
        <h3
          className="font-display text-lg"
          style={{ color: "var(--text)", letterSpacing: "-0.01em" }}
        >
          {title}
        </h3>
        <span className="meta" style={{ color: "var(--text-faint)" }}>
          {skills.length} {skills.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2.5">
        {skills.map((skill) => (
          <span key={skill} className="skill-tag">
            <SkillIcon skill={skill} tint={tint} />
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function Skills({ anchor, index, title = "Toolkit" }: SectionProps) {
  const tint = useIconTint();
  const [full, setFull] = useState(false);

  const categories = [
    { title: "Languages", skills: config.skills.languages },
    { title: "Frameworks", skills: config.skills.frameworks },
    { title: "Mobile", skills: config.skills.mobile ?? [] },
    { title: "AI / ML", skills: config.skills.ai_ml },
    { title: "Security", skills: config.skills.security },
    { title: "Platforms", skills: config.skills.platforms },
    { title: "Operating Systems", skills: config.skills.operating_systems ?? [] },
    { title: "Tools", skills: config.skills.tools },
  ].filter((c) => c.skills.length > 0);

  // A 60-item inventory in full stops being readable and starts being noise.
  // Lead with the curated core, keep the complete inventory one click away.
  const core = config.skills.core ?? [];
  const total = categories.reduce((sum, c) => sum + c.skills.length, 0);

  return (
    <section className="section-shell" id={anchor}>
      <SectionHeader
        index={index}
        title={title}
        kicker="Core stack / full inventory"
        variant="rail"
      />

      {core.length > 0 && (
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {core.map((skill) => (
            <span key={skill} className="skill-tag">
              <SkillIcon skill={skill} tint={tint} />
              {skill}
            </span>
          ))}
        </div>
      )}

      {full && core.length === 0 && <div className="pb-7" />}

      {full && (
        <div className="mt-8" style={{ borderTop: "1px solid var(--line)" }}>
          {categories.map((cat, i) => (
            <SkillCategory
              key={cat.title}
              title={cat.title}
              skills={cat.skills}
              index={i}
              isLast={i === categories.length - 1}
              tint={tint}
            />
          ))}
        </div>
      )}

      <div className="mt-9">
        <button
          onClick={() => setFull(!full)}
          className="btn-ghost"
          aria-expanded={full}
          aria-controls="skills-full"
        >
          {full ? "Show core stack only" : `Show the full inventory (${total} items) →`}
        </button>
      </div>
    </section>
  );
}
