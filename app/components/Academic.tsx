"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { config } from "@/lib/config";
import { SectionHeader } from "@/app/components/SectionHeader";

export function Academic() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const edu = config.education;
  const tsinghuaAchievement = edu.achievements?.find((a) => a.includes("Tsinghua"));

  return (
    <section className="section-shell" id="education">
      <SectionHeader index="07" title="Education" kicker="Academic record" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 28 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Tsinghua Highlight */}
        {tsinghuaAchievement && (
          <div
            className="mb-8 overflow-hidden p-7"
            style={{
              border: "1px solid var(--gold-quiet)",
              borderRadius: "2px",
              background: "linear-gradient(110deg, var(--gold-quiet), transparent 70%)",
            }}
          >
            <p className="meta" style={{ color: "var(--gold)" }}>
              ★ Top Achievement
            </p>
            <p className="mt-3 font-display text-2xl" style={{ color: "var(--text)", letterSpacing: "-0.01em" }}>
              Selected for BSc Computer Science at Tsinghua University — full scholarship
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="https://international.join-tsinghua.edu.cn/Discover_Tsinghua1/Advantages.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="chip"
                style={{ color: "var(--gold)", borderColor: "var(--gold-quiet)" }}
              >
                #1 in Computer Science (US News)
              </a>
              <a
                href="/tsinghua-offer.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="chip"
                style={{ color: "var(--gold)", borderColor: "var(--gold-quiet)" }}
              >
                ↓ Offer Letter
              </a>
            </div>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {/* University */}
          <div className="panel p-7">
            <p className="meta">University</p>
            <h3 className="mt-2 font-display text-xl" style={{ color: "var(--text)" }}>
              {edu.university}
            </h3>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              {edu.degree}
            </p>
            <p className="meta mt-1">{edu.period}</p>
            <div className="my-5 hairline" />
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text-muted)" }}>
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--text-faint)" }} />
                {edu.faculty}
              </li>
              <li className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text-muted)" }}>
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--text-faint)" }} />
                Thesis: {edu.thesis}
              </li>
              {edu.scholarship && (
                <li className="flex items-start gap-2.5 text-sm" style={{ color: "var(--accent-text)" }}>
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
                  {edu.scholarship}
                </li>
              )}
            </ul>
          </div>

          {/* High School */}
          <div className="panel p-7">
            <p className="meta">Higher Secondary</p>
            {edu.highSchool?.map((hs, i) => (
              <div key={i}>
                <h3 className="mt-2 font-display text-xl" style={{ color: "var(--text)" }}>
                  {hs.school}
                </h3>
                <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                  {hs.degree}
                </p>
                <p className="meta mt-1">{hs.period}</p>
                <div className="my-5 hairline" />
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text-muted)" }}>
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--text-faint)" }} />
                    {hs.board}
                  </li>
                  {hs.achievements?.map((a, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--gold)" }}>
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--gold)" }} />
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
