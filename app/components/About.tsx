"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { config } from "@/lib/config";
import { SectionHeader } from "@/app/components/SectionHeader";

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-shell" id="about">
      <SectionHeader index="01" title="About" kicker="Who / What / Why" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-10 md:grid-cols-[2fr_1fr]"
      >
        <div className="space-y-6">
          {config.about.map((paragraph, i) => (
            <p
              key={i}
              className="text-lg leading-relaxed"
              style={{ color: i === 0 ? "var(--text)" : "var(--text-muted)" }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <aside className="space-y-5 md:border-l md:pl-8" style={{ borderColor: "var(--line)" }}>
          {[
            { k: "Based in", v: config.location },
            { k: "Focus", v: "Dev tools · Systems · Security" },
            { k: "Currently", v: "Building ProxiCall" },
            { k: "Education", v: "BSc CS, ELTE Budapest" },
          ].map((row) => (
            <div key={row.k}>
              <p className="meta mb-1">{row.k}</p>
              <p className="text-sm" style={{ color: "var(--text)" }}>
                {row.v}
              </p>
            </div>
          ))}
        </aside>
      </motion.div>
    </section>
  );
}
