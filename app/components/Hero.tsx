"use client";

import { config } from "@/lib/config";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <header className="section-container flex min-h-[90vh] flex-col justify-center pb-10 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-start gap-8 sm:flex-row sm:items-center"
      >
        {/* Photo */}
        <div className="shrink-0">
          <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-zinc-700 bg-zinc-800 sm:h-36 sm:w-36">
            {config.photo ? (
              <img
                src={config.photo}
                alt={config.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-zinc-600">
                {config.name.split(" ").map((n) => n[0]).join("")}
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="mb-2 font-mono text-base text-accent sm:text-lg">Hi, I&apos;m</p>
          <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-6xl">
            {config.name}
          </h1>
          <p className="mb-4 max-w-xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
            {config.tagline}
          </p>
          <p className="mb-8 font-mono text-sm text-zinc-500">{config.location}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href={config.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
            >
              GitHub →
            </a>
            <a
              href={`mailto:${config.email}`}
              className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium transition-colors hover:border-zinc-500 hover:bg-zinc-800/50"
            >
              Contact
            </a>
            {config.resumeUrl && (
              <a
                href={config.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-accent/30 px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
              >
                Resume (PDF)
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </header>
  );
}
