import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://ishaq2321.github.io";

/**
 * Two personal files live on this site and are not meant to be collected: the hero
 * photograph and the Tsinghua offer letter. Everything else stays wide open — this is a
 * portfolio, and being found is the point.
 *
 * Be clear about what this does and does not do: `robots.txt` is a request that
 * well-behaved crawlers honour. It is not access control. Any file a browser can display
 * can be downloaded by a person or a bot that ignores this file, so treat this as "not
 * offered for training", not as protection. See README, "Your photograph".
 */
const PERSONAL = ["/portrait.webp", "/tsinghua-offer.pdf"];

/** Crawlers that exist to build training sets, answer engines and image databases. */
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "PerplexityBot",
  "Bytespider",
  "Amazonbot",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "cohere-ai",
  "Diffbot",
  "ImagesiftBot",
  "YouBot",
  "Timpibot",
  "omgili",
  "Scrapy",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, disallow: PERSONAL })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
