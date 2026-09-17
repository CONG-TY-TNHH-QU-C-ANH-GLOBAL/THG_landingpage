// Post-build SSG: spin up `vite preview`, drive a headless Chromium across the
// static routes via Playwright, capture the post-hydration HTML and write it
// next to dist/<route>/index.html. nginx's `try_files $uri $uri/ /index.html`
// then serves these prerendered shells to crawlers / OG scrapers, while live
// React still hydrates on top for real users.
//
// Why custom instead of a plugin: we already ship Playwright for e2e, the app
// uses declarative react-router (not a file-router that Vike would want), and
// the prerender requirements are narrow (12 static URLs). One file beats a
// plugin tree.
//
// Re-run via:   bun run prerender   (or automatically after `bun run build`).

import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const ROOT = process.cwd();
const DIST = resolve(ROOT, "dist");

/** Grab a free localhost port so we never collide with a stale vite preview. */
function pickPort() {
  return new Promise((res, rej) => {
    const srv = createServer();
    srv.unref();
    srv.on("error", rej);
    srv.listen(0, "127.0.0.1", () => {
      const addr = srv.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      srv.close(() => res(port));
    });
  });
}

const PORT = Number(process.env.PRERENDER_PORT) || (await pickPort());
const BASE = `http://127.0.0.1:${PORT}`;

// Static routes. Job detail (/careers/:slug) AND blog detail (/blog/:slug) are
// prerendered — both are shared externally (Google for Jobs, LinkedIn, Facebook,
// Zalo) and need real meta + JSON-LD (JobPosting / Article) in the initial HTML.
// Base routes (without lang prefix). These are expanded × 3 langs below.
const registry = JSON.parse(
  readFileSync(resolve(ROOT, "scripts", "seo-route-registry.json"), "utf8"),
);
const BASE_ROUTES = registry.staticRoutes;
const LANGS = registry.locales;
const STRICT = process.env.SEO_BUILD_STRICT === "1" || process.env.CI === "true";

// Expand: each base route becomes /{lang} (for "/") or /{lang}/path for the rest.
const STATIC_ROUTES = LANGS.flatMap((lang) =>
  BASE_ROUTES.map((r) => (r === "/" ? `/${lang}` : `/${lang}${r}`))
);

const CMS_API = process.env.VITE_CMS_API_URL ?? "http://localhost:8080/api/v1";
const discoveryFailures = [];

function recordDiscoveryFailure(source, message) {
  discoveryFailures.push({ route: `<${source}>`, msg: message });
}

/** Fetch open-job slugs so each /careers/:slug gets a prerendered shell.
 *  Best-effort — if the CMS is unreachable we still prerender static routes. */
async function fetchJobRoutes() {
  try {
    const routes = [];
    for (const lang of LANGS) {
      const res = await fetch(`${CMS_API}/jobs?lang=${lang}`);
      if (!res.ok) {
        recordDiscoveryFailure(`jobs:${lang}`, `CMS returned ${res.status}`);
        continue;
      }
      const data = await res.json();
      for (const job of data.jobs ?? []) routes.push(`/${lang}/careers/${job.slug}`);
    }
    console.log(`✓ ${routes.length} localized job routes → /careers/:slug prerender`);
    return [...new Set(routes)];
  } catch (err) {
    recordDiscoveryFailure("jobs", err instanceof Error ? err.message : String(err));
    console.warn(`⚠ jobs fetch failed (${err.message}) — skipping job-detail prerender`);
    return [];
  }
}

/** Fetch blog slugs so each /blog/:slug gets a prerendered shell — blog posts
 *  are shared on social (LinkedIn / Facebook / Twitter) and need real OG meta +
 *  Article JSON-LD in the initial HTML. Uses the same CMS /sitemap endpoint the
 *  sitemap generator consumes. Best-effort — skipped if the CMS is unreachable. */
async function fetchBlogRoutes() {
  try {
    const res = await fetch(`${CMS_API}/sitemap`);
    if (!res.ok) {
      recordDiscoveryFailure("sitemap", `CMS returned ${res.status}`);
      console.warn(`⚠ sitemap fetch ${res.status} — skipping blog-detail prerender`);
      return [];
    }
    const data = await res.json();
    const routes = (data.blog ?? []).flatMap((post) =>
      (post.available_locales ?? [post.locale ?? "vi"]).map(
        (lang) => `/${lang}/blog/${post.slug}`,
      ),
    );
    console.log(`✓ ${routes.length} localized blog routes → /blog/:slug prerender`);
    return [...new Set(routes)];
  } catch (err) {
    recordDiscoveryFailure("sitemap", err instanceof Error ? err.message : String(err));
    console.warn(`⚠ blog fetch failed (${err.message}) — skipping blog-detail prerender`);
    return [];
  }
}

/** Fetch the event list AND detail routes. Events are shared on Zalo and
 *  Facebook and carry their own OG image, so the meta has to be in the initial
 *  HTML — without this the whole section 404s, list page included.
 *
 *  Emits BOTH "/:lang/events" and "/:lang/events/:slug", and deliberately does
 *  NOT go in registry.staticRoutes. A static route is expanded across all three
 *  locales unconditionally, but an event exists in a locale only once its
 *  translation is reviewed: GET /events?lang=en currently returns nothing, so
 *  /en/events renders an empty list, which the app marks noindex, which the
 *  publish guard below counts as a failure — and STRICT is on in CI. Listing
 *  "/events" statically therefore fails the build, which is why it was pulled
 *  in the first place ("defer localized event prerender").
 *
 *  Driving both route shapes off the API response instead means a locale is
 *  prerendered only when it has something to show, and new locales light up on
 *  their own as translations land, with no further change here. */
async function fetchEventRoutes() {
  try {
    const routes = [];
    for (const lang of LANGS) {
      const res = await fetch(`${CMS_API}/events?lang=${lang}`);
      if (!res.ok) {
        recordDiscoveryFailure(`events:${lang}`, `CMS returned ${res.status}`);
        continue;
      }
      const data = await res.json();
      const slugs = (data.events ?? []).map((e) => e.slug).filter(Boolean);
      if (slugs.length === 0) continue;
      routes.push(`/${lang}/events`);
      for (const slug of slugs) routes.push(`/${lang}/events/${slug}`);
    }
    console.log(`✓ ${routes.length} localized event routes → /events + /events/:slug prerender`);
    return [...new Set(routes)];
  } catch (err) {
    recordDiscoveryFailure("events", err instanceof Error ? err.message : String(err));
    console.warn(`⚠ events fetch failed (${err.message}) — skipping event prerender`);
    return [];
  }
}

/** Fetch indexable community-question slugs so each /community/:slug gets a
 *  prerendered shell with QAPage JSON-LD + real meta. ONLY indexable questions
 *  (published + verified + non-empty expert answer) — everything else is
 *  CSR-only and carries noindex, per the moderation/SEO rules. Best-effort. */
async function fetchCommunityRoutes() {
  try {
    const res = await fetch(`${CMS_API}/community/questions`);
    if (!res.ok) {
      recordDiscoveryFailure("community", `CMS returned ${res.status}`);
      console.warn(`⚠ community fetch ${res.status} — skipping community-detail prerender`);
      return [];
    }
    const data = await res.json();
    const slugs = (data.questions ?? []).filter((q) => q.indexable).map((q) => q.slug);
    console.log(`✓ ${slugs.length} indexable community questions → /community/:slug prerender`);
    return slugs.map((s) => `/vi/community/${s}`);
  } catch (err) {
    recordDiscoveryFailure("community", err instanceof Error ? err.message : String(err));
    console.warn(`⚠ community fetch failed (${err.message}) — skipping community-detail prerender`);
    return [];
  }
}

/** Fetch indexable community-review slugs so each /community/reviews/:slug gets
 *  a prerendered shell with Review JSON-LD + real meta. ONLY indexable reviews
 *  (published + verified + non-thin body) — everything else is CSR-only and
 *  carries noindex, per the moderation/SEO rules. Best-effort. */
async function fetchCommunityReviewRoutes() {
  try {
    const res = await fetch(`${CMS_API}/community/reviews`);
    if (!res.ok) {
      recordDiscoveryFailure("reviews", `CMS returned ${res.status}`);
      console.warn(`⚠ reviews fetch ${res.status} — skipping review-detail prerender`);
      return [];
    }
    const data = await res.json();
    const slugs = (data.reviews ?? []).filter((r) => r.indexable).map((r) => r.slug);
    console.log(`✓ ${slugs.length} indexable community reviews → /community/reviews/:slug prerender`);
    return slugs.map((s) => `/vi/community/reviews/${s}`);
  } catch (err) {
    recordDiscoveryFailure("reviews", err instanceof Error ? err.message : String(err));
    console.warn(`⚠ reviews fetch failed (${err.message}) — skipping review-detail prerender`);
    return [];
  }
}

async function verifySeoControlPlane() {
  try {
    const res = await fetch(`${CMS_API}/seo-pages`);
    if (!res.ok) {
      recordDiscoveryFailure("seo-pages", `CMS returned ${res.status}`);
      return;
    }
    const data = await res.json();
    if (!Array.isArray(data.pages)) recordDiscoveryFailure("seo-pages", "response has no pages array");
  } catch (err) {
    recordDiscoveryFailure("seo-pages", err instanceof Error ? err.message : String(err));
  }
}

await verifySeoControlPlane();

const ROUTES = [
  ...STATIC_ROUTES,
  ...(await fetchJobRoutes()),
  ...(await fetchBlogRoutes()),
  ...(await fetchEventRoutes()),
  ...(await fetchCommunityRoutes()),
  ...(await fetchCommunityReviewRoutes()),
];

if (!existsSync(DIST)) {
  console.error("✗ dist/ missing — run `bun run build` first.");
  process.exit(1);
}

/** Resolve `dist/<route>/index.html` (homepage stays at dist/index.html). */
function outputPath(route) {
  if (route === "/") return resolve(DIST, "index.html");
  return resolve(DIST, route.replace(/^\//, ""), "index.html");
}

/** Poll the preview server until it answers 200 (max 60s). */
async function waitForReady(url) {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* server still booting */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Preview server never became ready at ${url}`);
}

// Run the local Vite CLI via the current runtime's absolute binary
// (process.execPath) instead of resolving "bun" through PATH — avoids the
// unsafe-PATH-search class (Sonar S4036) while keeping the same external
// preview process.
const viteCli = resolve(ROOT, "node_modules", "vite", "bin", "vite.js");
if (!existsSync(viteCli)) {
  console.error(`✗ Vite CLI not found at ${viteCli} — run \`bun install\` first.`);
  process.exit(1);
}
const previewArgs = [viteCli, "preview", "--port", String(PORT), "--host", "127.0.0.1", "--strictPort"];
const preview = spawn(process.execPath, previewArgs, {
  cwd: ROOT,
  stdio: ["ignore", "pipe", "pipe"],
});
preview.stdout.on("data", (b) => process.stdout.write(`[preview] ${b}`));
preview.stderr.on("data", (b) => process.stderr.write(`[preview] ${b}`));

let browser;
const failures = [...discoveryFailures];
let successCount = 0;
const report = {
  strict: STRICT,
  started_at: new Date().toISOString(),
  expected_routes: ROUTES,
  rendered: [],
  failures,
};
try {
  await waitForReady(`${BASE}/`);
  browser = await chromium.launch();
  const context = await browser.newContext({
    // Force English so the prerendered shell has a single canonical locale
    // (matches the default we declare in index.html's <html lang="vi">).
    // Locale switching is client-side after hydration.
    userAgent: "Mozilla/5.0 (compatible; THGPrerender/1.0; +https://thgfulfill.com)",
    // Block third-party tracking + Turnstile widget heartbeat so they don't
    // keep network busy past our wait conditions (CI Chromium can stall on
    // Cloudflare bot-detection from GH Actions IPs).
    extraHTTPHeaders: { "x-prerender": "1" },
  });
  // Browser requests originate from the ephemeral preview port, which is not
  // necessarily on production CMS's CORS allowlist. Proxy CMS GETs through
  // Node during the build and fulfill them into the page; this preserves the
  // real response/status while removing a browser-only CORS failure mode.
  const cmsOrigin = new URL(CMS_API).origin;
  await context.route(`${cmsOrigin}/**`, async (route) => {
    const request = route.request();
    if (request.method() !== "GET") return route.continue();
    try {
      const response = await fetch(request.url(), { headers: { accept: "application/json" } });
      const headers = Object.fromEntries(response.headers.entries());
      delete headers["content-encoding"];
      delete headers["content-length"];
      headers["access-control-allow-origin"] = "*";
      await route.fulfill({ status: response.status, headers, body: Buffer.from(await response.arrayBuffer()) });
    } catch (error) {
      await route.abort("connectionfailed");
    }
  });
  // Cut requests we don't need for SEO HTML — analytics pixels, captcha
  // heartbeats, and external fonts. Saves time + avoids flaky externals.
  await context.route(/(googletagmanager|google-analytics|facebook\.net|tiktok\.com|challenges\.cloudflare\.com|fonts\.googleapis|fonts\.gstatic)/, (route) => route.abort());

  for (const route of ROUTES) {
    const page = await context.newPage();
    try {
      // Wait for `load` (all initial resources) instead of `networkidle` —
      // long-poll CMS heartbeats / Turnstile widgets can otherwise keep the
      // network "busy" forever. We follow up with a hydration signal below.
      await page.goto(`${BASE}${route}`, { waitUntil: "load", timeout: 30_000 });

      // Wait for react-helmet-async to flush its <title> override. Helmet
      // schedules head mutations via microtasks, so we poll until either
      // the title got upgraded past the index.html default or 8s elapses.
      await page.waitForFunction(
        () => {
          const t = document.title || "";
          // Default shipped in index.html — anything else means SeoHead has
          // applied a per-page override.
          return t.length > 4 && !t.startsWith("THG Fulfill — POD & Dropship Fulfillment | Transport");
        },
        { timeout: 8_000 },
      ).catch(() => { /* tolerate: route might legitimately reuse default title */ });

      // A published route is not ready until its content H1 exists. Waiting
      // here avoids capturing the transient loading shell of React Query.
      await page.waitForSelector("h1", { timeout: 8_000 }).catch(() => {});

      // Final breath for any late helmet/microtask + main thread settle.
      await page.waitForTimeout(500);

      const title = await page.title();
      if (!title || title.length < 4) {
        throw new Error(`empty <title> — hydration likely failed`);
      }
      const routeState = await page.evaluate(() => ({
        h1: document.querySelectorAll("h1").length,
        robots: document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "",
      }));
      if (routeState.h1 !== 1 || /noindex/i.test(routeState.robots) || /^Not found/i.test(title)) {
        throw new Error(`published route rendered invalid state (title=${JSON.stringify(title)}, H1=${routeState.h1}, robots=${JSON.stringify(routeState.robots)})`);
      }

      const html = "<!doctype html>\n" + await page.evaluate(() => document.documentElement.outerHTML);
      const out = outputPath(route);
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, html, "utf8");
      console.log(`  ✓ ${route.padEnd(28)} → ${out.replace(ROOT, ".")}  (${(html.length / 1024).toFixed(1)} KB, "${title.slice(0, 60)}")`);
      successCount += 1;
      report.rendered.push(route);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ ${route.padEnd(28)} skipped: ${msg.split("\n")[0]}`);
      failures.push({ route, msg });
    } finally {
      await page.close();
    }
  }

  await context.close();
  const skippedNote = failures.length ? ` (${failures.length} skipped)` : "";
  console.log(`\n✓ Prerendered ${successCount}/${ROUTES.length} routes${skippedNote}`);
} catch (err) {
  console.error("✗ Prerender setup failed:", err);
  failures.push({ route: "<setup>", msg: err instanceof Error ? err.message : String(err) });
} finally {
  if (browser) await browser.close();
  preview.kill();
}

report.finished_at = new Date().toISOString();
writeFileSync(
  resolve(DIST, "seo-build-report.json"),
  JSON.stringify(report, null, 2) + "\n",
  "utf8",
);

// Only fail the build when nothing prerendered — a partial result is still
// better than shipping plain CSR shells, and a single flaky route shouldn't
// gate the whole deploy.
if (successCount === 0 || (STRICT && failures.length > 0)) {
  console.error(
    STRICT
      ? "✗ Strict prerender failed: every published route is required."
      : "✗ No routes prerendered — failing build.",
  );
  process.exit(1);
}
