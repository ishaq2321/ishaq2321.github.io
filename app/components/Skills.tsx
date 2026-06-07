"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { config } from "@/lib/config";

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
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm transition-colors hover:border-accent/50 hover:text-accent"
          >
            {skill}
          </span>
        ))}
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
