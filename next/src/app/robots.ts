import type { MetadataRoute } from "next";
import { resolveSiteOrigin } from "@/shared/seo";

// Parity port of public/robots.txt (FND-003): explicit allows for major crawlers and the
// AI-search opt-ins (audit P2.1), default allow-all, sitemap on the canonical origin.
const ALLOWED_BOTS = [
  "Googlebot",
  "Bingbot",
  "Twitterbot",
  "facebookexternalhit",
  "GPTBot",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...ALLOWED_BOTS.map((userAgent) => ({ userAgent, allow: "/" })),
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${resolveSiteOrigin()}/sitemap.xml`,
  };
}
