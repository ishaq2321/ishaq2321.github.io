"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { config } from "@/lib/config";

export function Academic() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const edu = config.education;
  const tsinghuaAchievement = edu.achievements?.find((a) =>
    a.includes("Tsinghua")
  );

  return (
    <section className="section-container" id="education">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-title">Education & Achievements</h2>

        {/* Tsinghua Highlight */}
        {tsinghuaAchievement && (
          <div className="mb-8 rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-transparent p-6">
            <p className="font-mono text-xs uppercase tracking-wider text-amber-400">
              Top Achievement
            </p>
            <p className="mt-2 text-xl font-semibold text-amber-300">
              Selected for BSc Computer Science at Tsinghua University — full scholarship
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <a
                href="https://international.join-tsinghua.edu.cn/Discover_Tsinghua1/Advantages.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-3 py-1 font-mono text-xs text-amber-400 transition-colors hover:bg-amber-500/20"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                #1 in Computer Science (US News)
              </a>
              <a
                href="/tsinghua-offer.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 px-3 py-1 font-mono text-xs text-amber-300 transition-colors hover:bg-amber-500/10"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Offer Letter
              </a>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* University */}
          <div className="card">
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
              University
            </p>
            <h3 className="mt-1 text-lg font-semibold">{edu.university}</h3>
            <p className="mt-0.5 text-sm text-zinc-300">{edu.degree}</p>
            <p className="mt-0.5 font-mono text-xs text-zinc-500">{edu.period}</p>
            <hr className="my-4 border-zinc-800" />
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                {edu.faculty}
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                Thesis: {edu.thesis}
              </li>
              {edu.scholarship && (
                <li className="flex items-start gap-2 text-sm text-emerald-400">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                  {edu.scholarship}
                </li>
              )}
            </ul>
          </div>

          {/* High School */}
          <div className="card">
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
              Higher Secondary
            </p>
            {edu.highSchool?.map((hs, i) => (
              <div key={i}>
                <h3 className="mt-1 text-lg font-semibold">{hs.school}</h3>
                <p className="mt-0.5 text-sm text-zinc-300">{hs.degree}</p>
                <p className="mt-0.5 font-mono text-xs text-zinc-500">{hs.period}</p>
                <hr className="my-4 border-zinc-800" />
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-zinc-400">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                    {hs.board}
                  </li>
                  {hs.achievements?.map((a, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-amber-400">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
