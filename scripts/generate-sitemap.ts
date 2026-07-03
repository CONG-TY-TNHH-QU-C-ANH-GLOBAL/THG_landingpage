// Generate public/sitemap.xml from CMS API + static known routes.
// Runs at prebuild step (see package.json "prebuild" script).
//
// Falls back to static-only routes if CMS API unreachable (dev offline scenario).

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const CMS_API = process.env.VITE_CMS_API_URL ?? "http://localhost:8080/api/v1";
const SITE = process.env.SITE_BASE ?? "https://thgfulfill.com";
const LANGS = ["vi", "en", "zh"] as const;

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
  "/community/reviews",
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
  const lines = [
    `  <url>`,
    `    <loc>${e.loc}</loc>`,
    `    <lastmod>${e.lastmod}</lastmod>`,
  ];
  if (e.changefreq) lines.push(`    <changefreq>${e.changefreq}</changefreq>`);
  if (e.priority !== undefined) lines.push(`    <priority>${e.priority.toFixed(1)}</priority>`);
  for (const a of e.alternates ?? []) {
    lines.push(`    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`);
  }
  lines.push(`  </url>`);
  return lines.join("\n");
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

/** Expand one base path into a lang-prefixed entry per locale. */
function langEntries(
  basePath: string,
  lastmod: string,
  changefreq: SitemapEntry["changefreq"],
  priority: number,
): SitemapEntry[] {
  return LANGS.map((lang) => {
    const langPath = basePath === "/" ? `/${lang}` : `/${lang}${basePath}`;
    return {
      loc: `${SITE}${langPath}`,
      lastmod,
      changefreq,
      priority,
      alternates: buildAlternates(langPath),
    };
  });
}

// 2. Blog posts from CMS (best-effort — skip if CMS unreachable).
async function fetchBlogEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  try {
    const res = await fetch(`${CMS_API}/sitemap`);
    if (!res.ok) {
      console.warn(`⚠ CMS sitemap endpoint returned ${res.status} — skipping blog/dynamic routes`);
      return entries;
    }
    const data = (await res.json()) as {
      pages: Array<{ route: string; locale: string; updated_at: number }>;
      blog: Array<{ slug: string; locale: string; published_date: string | null; updated_at: number }>;
    };
    // De-dupe blog slugs across locales (URL is same)
    const seenSlugs = new Set<string>();
    for (const post of data.blog) {
      if (seenSlugs.has(post.slug)) continue;
      seenSlugs.add(post.slug);
      const lastmod = post.published_date ?? new Date(post.updated_at * 1000).toISOString().slice(0, 10);
      entries.push(...langEntries(`/blog/${post.slug}`, lastmod, "monthly", 0.6));
    }
    console.log(`✓ Added ${seenSlugs.size} blog posts from CMS`);
  } catch (err) {
    console.warn(`⚠ Cannot reach CMS API at ${CMS_API} — sitemap will only include static routes:`, (err as Error).message);
  }
  return entries;
}

// 3. Open job postings from CMS (best-effort). Each JD has its own URL so HR
//    can distribute it + Google for Jobs can index it.
async function fetchJobEntries(today: string): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  try {
    const res = await fetch(`${CMS_API}/jobs?lang=vi`);
    if (!res.ok) {
      console.warn(`⚠ CMS jobs endpoint returned ${res.status} — skipping job URLs`);
      return entries;
    }
    const data = (await res.json()) as { jobs: Array<{ slug: string }> };
    const seen = new Set<string>();
    for (const job of data.jobs ?? []) {
      if (seen.has(job.slug)) continue;
      seen.add(job.slug);
      entries.push(...langEntries(`/careers/${job.slug}`, today, "weekly", 0.7));
    }
    console.log(`✓ Added ${seen.size} job postings from CMS`);
  } catch (err) {
    console.warn(`⚠ Cannot reach CMS jobs API — sitemap will omit job URLs:`, (err as Error).message);
  }
  return entries;
}

// 4. Community questions from CMS (best-effort). ONLY indexable entries —
//    the CMS computes indexable = published AND verified AND non-empty expert answer,
//    which is the Business Plan §4 rule for what Google may index. Everything
//    else stays out of the sitemap AND carries noindex meta on the page.
async function fetchCommunityEntries(today: string): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  try {
    const res = await fetch(`${CMS_API}/community/questions`);
    if (!res.ok) {
      console.warn(`⚠ CMS community endpoint returned ${res.status} — skipping community URLs`);
      return entries;
    }
    const data = (await res.json()) as {
      questions: Array<{ slug: string; indexable: boolean; published_at: number | null }>;
    };
    const indexable = (data.questions ?? []).filter((q) => q.indexable);
    for (const q of indexable) {
      const lastmod = q.published_at
        ? new Date(q.published_at * 1000).toISOString().slice(0, 10)
        : today;
      entries.push(...langEntries(`/community/${q.slug}`, lastmod, "weekly", 0.6));
    }
    console.log(`✓ Added ${indexable.length} indexable community questions from CMS`);
  } catch (err) {
    console.warn(`⚠ Cannot reach CMS community API — sitemap will omit community URLs:`, (err as Error).message);
  }
  return entries;
}

// 5. Community verified reviews from CMS (best-effort). ONLY indexable entries
//    — the CMS computes indexable = published AND verified AND non-thin body.
//    Pending/unverified/withdrawn reviews stay out of the sitemap AND carry
//    noindex on the page.
async function fetchCommunityReviewEntries(today: string): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  try {
    const res = await fetch(`${CMS_API}/community/reviews`);
    if (!res.ok) {
      console.warn(`⚠ CMS reviews endpoint returned ${res.status} — skipping review URLs`);
      return entries;
    }
    const data = (await res.json()) as {
      reviews: Array<{ slug: string; indexable: boolean; published_at: number | null }>;
    };
    const indexable = (data.reviews ?? []).filter((r) => r.indexable);
    for (const r of indexable) {
      const lastmod = r.published_at
        ? new Date(r.published_at * 1000).toISOString().slice(0, 10)
        : today;
      entries.push(...langEntries(`/community/reviews/${r.slug}`, lastmod, "weekly", 0.6));
    }
    console.log(`✓ Added ${indexable.length} indexable community reviews from CMS`);
  } catch (err) {
    console.warn(`⚠ Cannot reach CMS reviews API — sitemap will omit review URLs:`, (err as Error).message);
  }
  return entries;
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const entries: SitemapEntry[] = [];

  // 1. Static routes — 3 lang-prefixed entries per base path
  for (const path of STATIC_ROUTES) {
    entries.push(...langEntries(path, today, path === "/" ? "weekly" : "monthly", path === "/" ? 1 : 0.8));
  }

  entries.push(
    ...(await fetchBlogEntries()),
    ...(await fetchJobEntries(today)),
    ...(await fetchCommunityEntries(today)),
    ...(await fetchCommunityReviewEntries(today)),
  );

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

try {
  await main();
} catch (err) {
  console.error(err);
  process.exit(1);
}
