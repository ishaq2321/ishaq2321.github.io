"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { config } from "@/lib/config";
import { skillIcons } from "@/lib/iconMap";
import { SectionHeader } from "@/app/components/SectionHeader";

function iconUrl(skill: string): string | null {
  const slug = skillIcons[skill];
  return slug ? `https://cdn.simpleicons.org/${slug}` : null;
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
}: {
  title: string;
  skills: string[];
  index: number;
  isLast: boolean;
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
          const icon = iconUrl(skill);
          return (
            <span key={skill} className="skill-tag">
              {icon ? (
                // eslint-disable-next-line @next/next/no-img-element -- tiny external CDN icon, static export
                <img src={icon} alt="" className="skill-icon h-4 w-4 shrink-0" loading="lazy" />
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
      <SectionHeader index="06" title="Toolkit" kicker="Languages / Stacks / Tools" />
      <div style={{ borderTop: "1px solid var(--line)" }}>
        {categories.map((cat, i) => (
          <SkillCategory
            key={cat.title}
            title={cat.title}
            skills={cat.skills}
            index={i}
            isLast={i === categories.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
