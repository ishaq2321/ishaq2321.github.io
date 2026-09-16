export interface ProjectLink {
  label: string;
  url: string;
}

/**
 * A real capture of the shipped product, shown as a numbered plate.
 * `aspect` must match the file's own ratio so nothing is cropped.
 */
export interface Figure {
  src: string;
  alt: string;
  /** CSS aspect-ratio, e.g. "1160 / 1206". */
  aspect: string;
  caption: string;
  /** "mat" insets the capture on a padded mount; "bleed" fills the frame. */
  layout?: "mat" | "bleed";
  /**
   * The CSS pixel width the capture was taken at. The frame is capped to this,
   * so a plate can never be displayed larger than the UI really renders — a
   * magnified screenshot reads as a zoomed-in crop of somebody's screen.
   */
  native?: number;
  /**
   * Very wide captures (a three-up strip, a full website) would shrink to an
   * illegible smudge on a phone. Scrolling ones stay legible and swipe sideways.
   */
  scroll?: boolean;
}

export interface Project {
  name: string;
  url: string;
  live?: string;
  benchmarkUrl?: string;
  docsUrl?: string;
  npm?: string;
  pypi?: string;
  description: string;
  stack: string[];
  highlights?: string[];
  featured?: boolean;
  links?: ProjectLink[];
  /** Captures of the live product. The first is the primary plate. */
  figures?: Figure[];
}

export interface NotablePR {
  repo: string;
  pr_number: number;
  title: string;
  url: string;
  date: string;
  description: string;
  /**
   * False when the merged fix is not the author's own PR — e.g. the author
   * diagnosed a bug and a maintainer landed a cleaner version in their own PR,
   * crediting the report in its description (see #319176, based on #314005).
   * The card still links to that merged PR, because that is where the public
   * credit lives, and `status` says so on the card face.
   */
  merged?: boolean;
  /** Footer label. Defaults to "Merged". */
  status?: string;
}

export interface Social {
  github: string;
  linkedin: string;
}

export interface Experience {
  role: string;
  organization?: string;
  period: string;
  description: string;
  skills: string[];
}

export interface ProofPoint {
  /** Ignored when `derive` is set, so the number can't drift from its source. */
  value?: string;
  label: string;
  /** Optional in-page or external link to the evidence behind the number. */
  href?: string;
  /**
   * Compute this figure from the content it describes instead of typing it in.
   * "4 merged" and "2 products live" both went stale because they were literal
   * strings sitting next to sections that had since changed.
   */
  derive?: "mergedUpstream" | "upstreamRepos" | "liveProducts";
}

/**
 * A piece of public writing. Kept as a plain link list on purpose: a real blog
 * is the one feature that would need its own content folder, and a portfolio
 * whose blog was last updated two years ago reads worse than no blog at all.
 */
export interface WritingEntry {
  title: string;
  /** Where it was published — a university, a maintainers' forum, "Technical write-up". */
  venue: string;
  /** Rendered as written, so "2026" and "2026-05-12" are both fine. */
  date: string;
  url: string;
  /** One line on what it argues, so the list reads as work rather than links. */
  note?: string;
}

/**
 * A quoted recommendation. `url` is required because an unattributable
 * testimonial is worth less than none, and a link keeps every claim on this
 * page checkable by the person reading it.
 */
export interface Reference {
  quote: string;
  author: string;
  /** What makes this person worth quoting — their role, not a compliment. */
  role: string;
  url: string;
  /** Where and when it was said, e.g. "microsoft/vscode #314005, May 2026". */
  source: string;
}

/**
 * One row of the section registry.
 *
 * This single list decides what the nav offers, what order the page renders in,
 * and which chapter number each section carries. Those three things used to be
 * hardcoded separately in Nav.tsx, in page.tsx and inside every section
 * component, which is why adding a section meant editing three files and
 * removing one left a dead nav link.
 */
export interface SectionEntry {
  /**
   * Anchor id, and the key that maps this row to its component in page.tsx.
   * Treat it as a primary key: rename `label` freely, but moving `id` also
   * moves the URL fragment and needs the matching key in the component map.
   */
  id: string;
  /** Short label for the nav. */
  label: string;
  /**
   * The section's own heading. Optional because the component carries a sensible
   * default — set it only when the heading should differ from the nav label
   * ("Projects" in the nav, "Selected Work" on the page) or when you want to
   * rename a section without opening its component.
   */
  title?: string;
  /**
   * Defaults to true. False keeps the component and its content in the repo but
   * drops it from both the nav and the page, so a fork can switch Writing,
   * References or Bookshelf off by editing this one boolean.
   */
  enabled?: boolean;
}

/**
 * Props every registered section accepts. Both values come from the registry,
 * so a section's anchor and its chapter number have exactly one source.
 */
export interface SectionProps {
  /** Anchor id — also the nav's scroll target. Owned by the registry. */
  anchor: string;
  /** Zero-padded chapter number, derived from position among visible sections. */
  index: string;
  /** Registry override for the heading; each component defaults to its own. */
  title?: string;
}

/**
 * Portrait files that actually exist in `public/` at build time.
 *
 * The hero photograph is a personal photograph, so it is not kept in this repository:
 * it is generated locally and injected into the deploy from repository secrets. That
 * means `config.photo` names an intended path that may not be on disk, and the hero
 * has to fall back rather than point a browser at a missing file. `lib/portrait.ts`
 * resolves config into this, and only a resolved field should reach an `<Image>`.
 */
export interface Portrait {
  photo?: string;
}

export interface PortfolioConfig {
  name: string;
  tagline: string;
  about: string[];
  /** Evidence rail under the hero. Falls back to computed figures when absent. */
  proof?: ProofPoint[];
  location: string;
  emailEncoded: string;
  contactCategories?: Array<{ label: string; encoded: string }>;
  photo: string;
  resumeUrl?: string;
  social: Social;
  /**
   * The section registry: order, labels and on/off switches for the page. The
   * nav, the composition and every chapter number derive from this alone.
   */
  sections?: SectionEntry[];
  skills: {
    /** Curated short list shown up front; the full table sits behind a disclosure. */
    core?: string[];
    languages: string[];
    frameworks: string[];
    mobile?: string[];
    ai_ml: string[];
    security: string[];
    platforms: string[];
    operating_systems?: string[];
    tools: string[];
  };
  projects: Project[];
  /** Optional Writing section. Empty or absent → the section is not rendered. */
  writing?: WritingEntry[];
  notable_contributions: NotablePR[];
  /** Optional References section. Empty or absent → the section is not rendered. */
  references?: Reference[];
  experience: Experience[];
  goatcounter?: string;
  verification?: {
    google?: string;
    bing?: string;
  };
  education: {
    degree: string;
    university: string;
    faculty: string;
    period: string;
    thesis: string;
    scholarship?: string;
    highSchool?: Array<{
      degree: string;
      school: string;
      board: string;
      period: string;
      achievements?: string[];
    }>;
    achievements?: string[];
  };
}
