"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { config } from "@/lib/config";

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-container" id="about">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">About Me</h2>
        <div className="max-w-3xl space-y-4">
          {config.about.map((paragraph, i) => (
            <p key={i} className="text-base leading-relaxed text-zinc-400 sm:text-lg">
              {paragraph}
            </p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
