// Generate public/sitemap.xml from CMS API + static known routes.
// Runs at prebuild step (see package.json "prebuild" script).
//
// Falls back to static-only routes if CMS API unreachable (dev offline scenario).

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const CMS_API = process.env.VITE_CMS_API_URL ?? "http://localhost:8080/api/v1";
const SITE = process.env.SITE_BASE ?? "https://thgfulfill.com";

const STATIC_ROUTES = [
  "/",
  "/thg-fulfill",
  "/thg-express",
  "/thg-warehouse",
  "/thg-order",
  "/catalog",
  "/blog",
  "/policy",
  "/shipping-policy",
  "/careers",
  "/international-pricing",
  "/domestic-pricing",
];

const LOCALES = ["en", "vi", "zh"] as const;

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
  alternates?: Array<{ hreflang: string; href: string }>;
}

function entryXml(e: SitemapEntry): string {
  const alternates = (e.alternates ?? [])
    .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`)
    .join("\n");
  return `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
${e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>\n` : ""}${e.priority !== undefined ? `    <priority>${e.priority.toFixed(1)}</priority>\n` : ""}${alternates ? alternates + "\n" : ""}  </url>`;
}

function buildAlternates(path: string): SitemapEntry["alternates"] {
  // Landing currently serves all 3 locales at SAME URL with client-side language switcher.
  // For SEO, declare all 3 hreflangs pointing to same URL — Google respects the lang switch.
  // (When subpath /en/ /vi/ /zh/ routing is added, update this to actual variants.)
  const url = `${SITE}${path}`;
  return [
    ...LOCALES.map((l) => ({ hreflang: l, href: url })),
    { hreflang: "x-default", href: url },
  ];
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const entries: SitemapEntry[] = [];

  // 1. Static routes
  for (const path of STATIC_ROUTES) {
    entries.push({
      loc: `${SITE}${path}`,
      lastmod: today,
      changefreq: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1.0 : 0.8,
      alternates: buildAlternates(path),
    });
  }

  // 2. Blog posts from CMS (best-effort — skip if CMS unreachable)
  try {
    const res = await fetch(`${CMS_API}/sitemap`);
    if (res.ok) {
      const data = (await res.json()) as {
        pages: Array<{ route: string; locale: string; updated_at: number }>;
        blog: Array<{ slug: string; locale: string; published_date: string | null; updated_at: number }>;
      };
      // De-dupe blog slugs across locales (URL is same)
      const seenSlugs = new Set<string>();
      for (const post of data.blog) {
        if (seenSlugs.has(post.slug)) continue;
        seenSlugs.add(post.slug);
        const path = `/blog/${post.slug}`;
        entries.push({
          loc: `${SITE}${path}`,
          lastmod: post.published_date ?? new Date(post.updated_at * 1000).toISOString().slice(0, 10),
          changefreq: "monthly",
          priority: 0.6,
          alternates: buildAlternates(path),
        });
      }
      console.log(`✓ Added ${seenSlugs.size} blog posts from CMS`);
    } else {
      console.warn(`⚠ CMS sitemap endpoint returned ${res.status} — skipping blog/dynamic routes`);
    }
  } catch (err) {
    console.warn(`⚠ Cannot reach CMS API at ${CMS_API} — sitemap will only include static routes:`, (err as Error).message);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map(entryXml).join("\n")}
</urlset>
`;

  const out = resolve(process.cwd(), "public", "sitemap.xml");
  writeFileSync(out, xml, "utf8");
  console.log(`✓ Wrote ${entries.length} URLs to ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
