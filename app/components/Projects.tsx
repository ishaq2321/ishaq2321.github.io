"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { config } from "@/lib/config";

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="section-container" id="projects">
      <h2 className="section-title">Projects</h2>
      <div ref={ref} className="grid gap-6 sm:grid-cols-2">
        {config.projects.map((project, i) => (
          <motion.div
            key={project.name}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="mb-3 flex items-start justify-between">
              <h3 className="text-xl font-semibold">{project.name}</h3>
              <div className="flex shrink-0 gap-2">
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-accent hover:underline"
                  >
                    live →
                  </a>
                )}
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-zinc-400 hover:text-zinc-200"
                >
                  repo
                </a>
              </div>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-zinc-400">
              {project.description}
            </p>
            {project.highlights && (
              <ul className="mb-4 space-y-1.5">
                {project.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 text-sm text-zinc-300"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {h}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span key={tech} className="pill">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
