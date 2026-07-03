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
  "/community",
  "/international-pricing",
  "/domestic-pricing",
];

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

function buildAlternates(langPath: string): SitemapEntry["alternates"] {
  // langPath is already lang-prefixed, e.g. "/vi/thg-fulfill" or "/en"
  // Strip the leading lang segment to get the base path ("/thg-fulfill" or "").
  const basePath = langPath.replace(/^\/(en|vi|zh)(\/|$)/, "/").replace(/\/$/, "") || "/";
  const base = basePath === "/" ? "" : basePath;
  return [
    { hreflang: "vi", href: `${SITE}/vi${base}` },
    { hreflang: "en", href: `${SITE}/en${base}` },
    { hreflang: "zh-CN", href: `${SITE}/zh${base}` },
    // x-default → Vietnamese (primary audience)
    { hreflang: "x-default", href: `${SITE}/vi${base}` },
  ];
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const entries: SitemapEntry[] = [];
  const LANGS = ["vi", "en", "zh"] as const;

  // 1. Static routes — 3 lang-prefixed entries per base path
  for (const path of STATIC_ROUTES) {
    for (const lang of LANGS) {
      const langPath = path === "/" ? `/${lang}` : `/${lang}${path}`;
      entries.push({
        loc: `${SITE}${langPath}`,
        lastmod: today,
        changefreq: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1.0 : 0.8,
        alternates: buildAlternates(langPath),
      });
    }
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
        const basePath = `/blog/${post.slug}`;
        const lastmod = post.published_date ?? new Date(post.updated_at * 1000).toISOString().slice(0, 10);
        for (const lang of LANGS) {
          const langPath = `/${lang}${basePath}`;
          entries.push({
            loc: `${SITE}${langPath}`,
            lastmod,
            changefreq: "monthly",
            priority: 0.6,
            alternates: buildAlternates(langPath),
          });
        }
      }
      console.log(`✓ Added ${seenSlugs.size} blog posts from CMS`);
    } else {
      console.warn(`⚠ CMS sitemap endpoint returned ${res.status} — skipping blog/dynamic routes`);
    }
  } catch (err) {
    console.warn(`⚠ Cannot reach CMS API at ${CMS_API} — sitemap will only include static routes:`, (err as Error).message);
  }

  // 3. Open job postings from CMS (best-effort). Each JD has its own URL so HR
  //    can distribute it + Google for Jobs can index it.
  try {
    const res = await fetch(`${CMS_API}/jobs?lang=vi`);
    if (res.ok) {
      const data = (await res.json()) as { jobs: Array<{ slug: string }> };
      const seen = new Set<string>();
      for (const job of data.jobs ?? []) {
        if (seen.has(job.slug)) continue;
        seen.add(job.slug);
        const basePath = `/careers/${job.slug}`;
        for (const lang of LANGS) {
          const langPath = `/${lang}${basePath}`;
          entries.push({
            loc: `${SITE}${langPath}`,
            lastmod: today,
            changefreq: "weekly",
            priority: 0.7,
            alternates: buildAlternates(langPath),
          });
        }
      }
      console.log(`✓ Added ${seen.size} job postings from CMS`);
    } else {
      console.warn(`⚠ CMS jobs endpoint returned ${res.status} — skipping job URLs`);
    }
  } catch (err) {
    console.warn(`⚠ Cannot reach CMS jobs API — sitemap will omit job URLs:`, (err as Error).message);
  }

  // 4. Community questions from CMS (best-effort). ONLY indexable entries —
  //    the CMS computes indexable = published AND (verified OR expert answer),
  //    which is the Business Plan §4 rule for what Google may index. Everything
  //    else stays out of the sitemap AND carries noindex meta on the page.
  try {
    const res = await fetch(`${CMS_API}/community/questions`);
    if (res.ok) {
      const data = (await res.json()) as {
        questions: Array<{ slug: string; indexable: boolean; published_at: number | null }>;
      };
      const indexable = (data.questions ?? []).filter((q) => q.indexable);
      for (const q of indexable) {
        const basePath = `/community/${q.slug}`;
        const lastmod = q.published_at
          ? new Date(q.published_at * 1000).toISOString().slice(0, 10)
          : today;
        for (const lang of LANGS) {
          const langPath = `/${lang}${basePath}`;
          entries.push({
            loc: `${SITE}${langPath}`,
            lastmod,
            changefreq: "weekly",
            priority: 0.6,
            alternates: buildAlternates(langPath),
          });
        }
      }
      console.log(`✓ Added ${indexable.length} indexable community questions from CMS`);
    } else {
      console.warn(`⚠ CMS community endpoint returned ${res.status} — skipping community URLs`);
    }
  } catch (err) {
    console.warn(`⚠ Cannot reach CMS community API — sitemap will omit community URLs:`, (err as Error).message);
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
