"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { config } from "@/lib/config";
import { skillIcons } from "@/lib/iconMap";
import { SectionHeader } from "@/app/components/SectionHeader";

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
          : ICON_TINT_DARK,
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
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 gap-x-8 gap-y-4 py-7 sm:grid-cols-[minmax(140px,180px)_1fr]"
      style={isLast ? undefined : { borderBottom: "1px solid var(--line)" }}
    >
      {/* Left rail: category label */}
      <div className="flex items-baseline gap-3 sm:flex-col sm:gap-1.5">
        <h3 className="font-display text-lg" style={{ color: "var(--text)", letterSpacing: "-0.01em" }}>
          {title}
        </h3>
        <span className="meta" style={{ color: "var(--text-faint)" }}>
          {skills.length} {skills.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Right: tags flowing */}
      <div className="flex flex-wrap gap-x-5 gap-y-2.5">
        {skills.map((skill) => {
          const icon = iconUrl(skill, tint);
          return (
            <span key={skill} className="skill-tag">
              {icon ? (
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
              ) : (
                <FallbackDot />
              )}
              {skill}
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}

export function Skills() {
  const tint = useIconTint();
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

  return (
    <section className="section-shell" id="skills">
      <SectionHeader index="05" title="Toolkit" kicker="Languages / Stacks / Tools" />
      <div style={{ borderTop: "1px solid var(--line)" }}>
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
    </section>
  );
}
