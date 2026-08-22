import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://ishaq2321.github.io";

// Auto-generated at build time so the sitemap never goes stale.
const LAST_MODIFIED = new Date().toISOString().slice(0, 10);

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
