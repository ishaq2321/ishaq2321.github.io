"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { config } from "@/lib/config";
import { SectionHeader } from "@/app/components/SectionHeader";
import { SpotlightCard } from "@/app/components/SpotlightCard";

interface NpmStat { weekly: number; total: number }
type NpmStatsPayload = { packages: Record<string, NpmStat> };

/** Shared cache so every card reads the static payload once. */
let npmStatsPromise: Promise<NpmStatsPayload | null> | null = null;
function loadNpmStats(): Promise<NpmStatsPayload | null> {
  if (!npmStatsPromise) {
    npmStatsPromise = fetch("/npm-stats.json")
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null);
  }
  return npmStatsPromise;
}

function useNpmDownloads(packageName?: string): NpmStat | null {
  const [downloads, setDownloads] = useState<NpmStat | null>(null);

  useEffect(() => {
    if (!packageName) return;
    let cancelled = false;
    loadNpmStats().then((data) => {
      if (cancelled) return;
      const stat = data?.packages?.[packageName];
      if (stat && (stat.weekly > 0 || stat.total > 0)) setDownloads(stat);
    });
    return () => {
      cancelled = true;
    };
  }, [packageName]);

  return downloads;
}

const linkIcons = {
  external: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  ),
  repo: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.575.106.785-.25.785-.555 0-.274-.01-1-.015-1.963-3.196.695-3.87-1.54-3.87-1.54-.523-1.328-1.276-1.682-1.276-1.682-1.043-.713.08-.699.08-.699 1.153.081 1.76 1.184 1.76 1.184 1.026 1.758 2.69 1.25 3.346.956.104-.743.401-1.25.73-1.538-2.552-.29-5.236-1.276-5.236-5.68 0-1.255.448-2.28 1.183-3.084-.119-.29-.513-1.459.112-3.04 0 0 .966-.31 3.166 1.178a11.02 11.02 0 0 1 2.882-.388c.978.004 1.963.132 2.883.388 2.198-1.488 3.163-1.179 3.163-1.179.626 1.582.232 2.751.114 3.041.737.804 1.182 1.829 1.182 3.084 0 4.415-2.688 5.386-5.248 5.671.413.355.78 1.056.78 2.129 0 1.538-.014 2.777-.014 3.155 0 .308.207.667.79.554A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  ),
  package: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  ),
  doc: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8M16 17H8M10 9H8" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
} as const;

function ProjectLink({
  href,
  label,
  icon,
  variant = "outline",
}: {
  href: string;
  label: string;
  icon: keyof typeof linkIcons;
  variant?: "primary" | "outline";
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={variant === "primary" ? "action-link action-link--primary" : "action-link"}
    >
      {linkIcons[icon]}
      {label}
    </a>
  );
}

function ProjectCard({
  project,
  index,
  featured,
}: {
  project: (typeof config.projects)[number];
  index: number;
  featured?: boolean;
}) {
  const downloads = useNpmDownloads(project.npm);

  return (
    <motion.div
      className={featured ? "sm:col-span-2" : ""}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
    <SpotlightCard
      className={`flex h-full flex-col p-7${featured ? " spotlight-featured" : ""}`}
      style={featured ? { borderColor: "var(--accent-quiet)" } : undefined}
    >
      <div className="flex min-h-full flex-col">
        <div className="mb-4">
          {featured && (
            <span className="meta mb-1 block" style={{ color: "var(--accent-text)" }}>
              Primary Project
            </span>
          )}
          <h3 className="font-display text-2xl" style={{ color: "var(--text)", letterSpacing: "-0.01em" }}>
            {project.name}
          </h3>
        </div>

        <p className="mb-5 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {project.description}
        </p>

        {featured && project.highlights && (
          <ul className="mb-6 space-y-2">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text)" }}>
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto">
          {downloads && (
            <p
              className="mb-4 flex items-center gap-2 font-mono text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
              {downloads.weekly.toLocaleString()}/week
              <span style={{ color: "var(--text-faint)" }}>&middot;</span>
              {downloads.total.toLocaleString()} downloads total
            </p>
          )}
          <div className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <span className="meta shrink-0" style={{ color: "var(--text-faint)" }}>
              Built with
            </span>
            {project.stack.map((tech, i) => (
              <span key={tech} className="flex items-center gap-2">
                {i > 0 && (
                  <span className="h-0.5 w-0.5 rounded-full" style={{ background: "var(--text-faint)", opacity: 0.5 }} />
                )}
                <span className="tech-tag">{tech}</span>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2.5 border-t pt-5" style={{ borderColor: "var(--line)" }}>
            {project.live && <ProjectLink href={project.live} label="Live" icon="external" variant="primary" />}
            <ProjectLink href={project.url} label="Code" icon="repo" />
            {project.docsUrl && <ProjectLink href={project.docsUrl} label="Thesis" icon="doc" />}
            {project.npm && <ProjectLink href={`https://www.npmjs.com/package/${project.npm}`} label="npm" icon="package" />}
            {project.pypi && <ProjectLink href={`https://pypi.org/project/${project.pypi}/`} label="PyPI" icon="package" />}
            {project.benchmarkUrl && <ProjectLink href={project.benchmarkUrl} label="Benchmark" icon="chart" />}
          </div>
        </div>
      </div>

    </SpotlightCard>
    </motion.div>
  );
}

export function Projects() {
  const featuredProjects = config.projects.filter((p) => p.featured);
  const otherProjects = config.projects.filter((p) => !p.featured);

  return (
    <section className="section-shell" id="projects">
      <SectionHeader index="02" title="Selected Work" kicker="Projects & Builds" />

      {featuredProjects.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2">
          {featuredProjects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} featured />
          ))}
        </div>
      )}

      {otherProjects.length > 0 && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {otherProjects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={featuredProjects.length + i} />
          ))}
        </div>
      )}
    </section>
  );
}
