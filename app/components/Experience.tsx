"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { config } from "@/lib/config";

function TimelineEntry({
  exp,
  index,
}: {
  exp: (typeof config.experience)[number];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative pl-10 pb-12 last:pb-0"
    >
      <div className="absolute left-0 top-0 flex h-full flex-col items-center">
        <div className="mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-accent bg-zinc-950" />
        {index < config.experience.length - 1 && (
          <div className="w-px flex-1 bg-zinc-800" />
        )}
      </div>

      <div className="card">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold">{exp.role}</h3>
            {exp.organization && (
              <p className="font-mono text-sm text-accent">{exp.organization}</p>
            )}
          </div>
          <p className="font-mono text-xs text-zinc-500">{exp.period}</p>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          {exp.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {exp.skills.map((skill) => (
            <span key={skill} className="pill">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Experience() {
  return (
    <section className="section-container" id="experience">
      <h2 className="section-title">Experience</h2>
      <div>
        {config.experience.map((exp, i) => (
          <TimelineEntry key={`${exp.role}-${exp.period}`} exp={exp} index={i} />
        ))}
      </div>
    </section>
  );
}
