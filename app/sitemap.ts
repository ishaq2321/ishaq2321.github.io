import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://ishaq2321.github.io";

// Bump this when the site's content meaningfully changes.
const LAST_MODIFIED = "2026-07-16";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
