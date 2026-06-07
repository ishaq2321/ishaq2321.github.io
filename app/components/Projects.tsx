"use client";

import { motion } from "framer-motion";
import { config } from "@/lib/config";

function ProjectCard({
  project,
  index,
  featured,
}: {
  project: typeof config.projects[number];
  index: number;
  featured?: boolean;
}) {
  return (
    <motion.div
      className={
        featured
          ? "card border-accent/30 bg-accent/5 sm:col-span-2"
          : "card"
      }
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          {featured && (
            <span className="mb-1 inline-block rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-accent">
              Primary Project
            </span>
          )}
          <h3 className="text-xl font-semibold">{project.name}</h3>
        </div>
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
          {project.benchmarkUrl && (
            <a
              href={project.benchmarkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-emerald-400 hover:text-emerald-300"
            >
              benchmark
            </a>
          )}
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
  );
}

export function Projects() {
  const featuredProjects = config.projects.filter((p) => p.featured);
  const otherProjects = config.projects.filter((p) => !p.featured);

  return (
    <section className="section-container" id="projects">
      <h2 className="section-title">Projects</h2>

      {featuredProjects.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2">
          {featuredProjects.map((project, i) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={i}
              featured
            />
          ))}
        </div>
      )}

      {otherProjects.length > 0 && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {otherProjects.map((project, i) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={featuredProjects.length + i}
            />
          ))}
        </div>
      )}
    </section>
  );
}
