"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { config } from "@/lib/config";
import { SectionHeader } from "@/app/components/SectionHeader";

function TimelineEntry({
  exp,
  index,
  isLast,
}: {
  exp: (typeof config.experience)[number];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative grid grid-cols-[auto_1fr] gap-6 pb-10 last:pb-0"
    >
      {/* Rail */}
      <div className="flex flex-col items-center pt-1.5">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: "var(--accent)", boxShadow: "0 0 0 4px var(--accent-quiet)" }}
        />
        {!isLast && <span className="mt-2 w-px flex-1" style={{ background: "var(--line)" }} />}
      </div>

      {/* Card */}
      <div className="panel -mt-1 p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h3 className="font-display text-xl" style={{ color: "var(--text)", letterSpacing: "-0.01em" }}>
              {exp.role}
            </h3>
            {exp.organization && (
              <p className="font-mono text-sm" style={{ color: "var(--accent-text)" }}>
                {exp.organization}
              </p>
            )}
          </div>
          <p className="meta shrink-0">{exp.period}</p>
        </div>
        <p className="mt-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {exp.description}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          {exp.skills.map((skill, i) => (
            <span key={skill} className="flex items-center gap-2">
              {i > 0 && (
                <span
                  className="h-0.5 w-0.5 rounded-full"
                  style={{ background: "var(--text-faint)", opacity: 0.5 }}
                />
              )}
              <span className="tech-tag">{skill}</span>
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Experience() {
  return (
    <section className="section-shell" id="experience">
      <SectionHeader index="03" title="Experience" kicker="Timeline" />
      <div>
        {config.experience.map((exp, i) => (
          <TimelineEntry
            key={`${exp.role}-${exp.period}`}
            exp={exp}
            index={i}
            isLast={i === config.experience.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
