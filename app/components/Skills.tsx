"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { config } from "@/lib/config";
import { skillIcons } from "@/lib/iconMap";

function iconUrl(skill: string): string | null {
  const slug = skillIcons[skill];
  return slug ? `https://cdn.simpleicons.org/${slug}` : null;
}

/** Generic tool icon used as fallback when a skill has no Simple Icons entry. */
function FallbackIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-zinc-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function SkillCategory({
  title,
  skills,
  index,
}: {
  title: string;
  skills: string[];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-zinc-500">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => {
          const icon = iconUrl(skill);
          return (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm transition-colors hover:border-accent/50 hover:text-accent"
            >
              {icon ? (
                <img
                  src={icon}
                  alt=""
                  className="skill-icon h-4 w-4 shrink-0"
                  loading="lazy"
                />
              ) : (
                <FallbackIcon />
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
    <section className="section-container" id="skills">
      <h2 className="section-title">Skills & Tools</h2>
      <div className="grid gap-8 sm:grid-cols-2">
        {categories.map((cat, i) => (
          <SkillCategory key={cat.title} title={cat.title} skills={cat.skills} index={i} />
        ))}
      </div>
    </section>
  );
}
