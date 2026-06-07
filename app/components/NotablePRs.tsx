"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { config } from "@/lib/config";

export function NotablePRs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="section-container" id="contributions">
      <h2 className="section-title">Notable Open Source Contributions</h2>
      <div ref={ref} className="grid gap-4 sm:grid-cols-3">
        {config.notable_contributions.map((pr, i) => (
          <motion.a
            key={`${pr.repo}-${pr.pr_number}`}
            href={pr.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.12 }}
          >
            <div>
              <p className="mb-1 font-mono text-xs text-accent">{pr.repo}</p>
              <h3 className="mb-2 text-lg font-semibold leading-snug">{pr.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {pr.description}
              </p>
            </div>
            <p className="mt-4 font-mono text-xs text-zinc-500">
              Merged {new Date(pr.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
