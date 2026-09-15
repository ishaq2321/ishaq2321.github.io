import type { ComponentType } from "react";
import { Hero } from "@/app/components/Hero";
import { Academic } from "@/app/components/Academic";
import { Bookshelf } from "@/app/components/Bookshelf";
import { Contact } from "@/app/components/Contact";
import { Experience } from "@/app/components/Experience";
import { GitHubStats } from "@/app/components/GitHubStats";
import { NotablePRs } from "@/app/components/NotablePRs";
import { Projects } from "@/app/components/Projects";
import { References } from "@/app/components/References";
import { Skills } from "@/app/components/Skills";
import { Writing } from "@/app/components/Writing";
import { sections } from "@/lib/sections";
import type { SectionProps } from "@/app/types";

/**
 * id → component.
 *
 * The registry in portfolio.config.json decides *whether* a section renders,
 * where it sits and what chapter number it carries; this map only says which
 * component draws it. So reordering, renumbering, renaming or switching off a
 * section is a config edit, and adding a new one is: write the component, add it
 * here, add one row to `sections`.
 */
const COMPONENTS: Record<string, ComponentType<SectionProps>> = {
  contributions: NotablePRs,
  projects: Projects,
  experience: Experience,
  stats: GitHubStats,
  skills: Skills,
  writing: Writing,
  education: Academic,
  books: Bookshelf,
  references: References,
  contact: Contact,
};

export default function Home() {
  const rendered = sections.map((section) => {
    const Section = COMPONENTS[section.id];

    if (!Section) {
      // Fail at build time rather than in front of a visitor. A registry row with
      // no component would otherwise ship a nav link pointing at an anchor that
      // does not exist — the exact failure this registry removed.
      throw new Error(
        `Section "${section.id}" is listed in portfolio.config.json but has no component. ` +
          `Add it to COMPONENTS in app/page.tsx, or set "enabled": false on that entry.`
      );
    }

    return { section, Section };
  });

  return (
    <>
      <Hero />
      {rendered.map(({ section, Section }) => (
        <Section
          key={section.id}
          anchor={section.id}
          index={section.index}
          title={section.title}
        />
      ))}
    </>
  );
}
