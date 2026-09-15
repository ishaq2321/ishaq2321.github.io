import { config } from "@/lib/config";
import type { PortfolioConfig, SectionEntry } from "@/app/types";

/**
 * Sections whose content lives in a config array rather than in the component.
 *
 * A section listed here is dropped from the page while its array is empty, so a
 * fork that deletes the sample Writing or References entries loses the heading
 * too instead of shipping an empty chapter. That is what makes those sections
 * genuinely optional: content in, section appears; content gone, section
 * disappears from the nav, the page and the numbering at once.
 */
const CONTENT_KEY: Record<string, keyof PortfolioConfig> = {
  writing: "writing",
  references: "references",
};

function hasContent(entry: SectionEntry): boolean {
  const key = CONTENT_KEY[entry.id];
  if (!key) return true;
  const value = config[key];
  return Array.isArray(value) && value.length > 0;
}

export interface ResolvedSection extends SectionEntry {
  /** Zero-padded chapter number, taken from position among the visible sections. */
  index: string;
}

/**
 * The one ordered list the nav and the page both render from.
 *
 * Filtering happens *before* numbering, which is what keeps the chapter numbers
 * gapless when a section is disabled or empty — the bug that used to require
 * hand-editing "01".."08" in two files.
 */
export const sections: ResolvedSection[] = (config.sections ?? [])
  .filter((entry) => entry.enabled !== false && hasContent(entry))
  .map((entry, i) => ({ ...entry, index: String(i + 1).padStart(2, "0") }));
