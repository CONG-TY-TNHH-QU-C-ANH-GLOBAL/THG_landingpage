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
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
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

// Static routes only — blog/career detail are CSR-rendered (CMS slugs not
// known at build time). Add new pages here when they ship.
const ROUTES = [
  "/",
  "/thg-fulfill",
  "/thg-express",
  "/thg-warehouse",
  "/thg-order",
  "/catalog",
  "/careers",
  "/blog",
  "/policy",
  "/shipping-policy",
  "/international-pricing",
  "/domestic-pricing",
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

const previewArgs = ["x", "vite", "preview", "--port", String(PORT), "--host", "127.0.0.1", "--strictPort"];
const preview = spawn("bun", previewArgs, {
  cwd: ROOT,
  stdio: ["ignore", "pipe", "pipe"],
});
preview.stdout.on("data", (b) => process.stdout.write(`[preview] ${b}`));
preview.stderr.on("data", (b) => process.stderr.write(`[preview] ${b}`));

let browser;
const failures = [];
let successCount = 0;
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

      // Final breath for any late helmet/microtask + main thread settle.
      await page.waitForTimeout(500);

      const title = await page.title();
      if (!title || title.length < 4) {
        throw new Error(`empty <title> — hydration likely failed`);
      }

      const html = "<!doctype html>\n" + await page.evaluate(() => document.documentElement.outerHTML);
      const out = outputPath(route);
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, html, "utf8");
      console.log(`  ✓ ${route.padEnd(28)} → ${out.replace(ROOT, ".")}  (${(html.length / 1024).toFixed(1)} KB, "${title.slice(0, 60)}")`);
      successCount += 1;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ ${route.padEnd(28)} skipped: ${msg.split("\n")[0]}`);
      failures.push({ route, msg });
    } finally {
      await page.close();
    }
  }

  await context.close();
  console.log(`\n✓ Prerendered ${successCount}/${ROUTES.length} routes${failures.length ? ` (${failures.length} skipped)` : ""}`);
} catch (err) {
  console.error("✗ Prerender setup failed:", err);
  failures.push({ route: "<setup>", msg: err instanceof Error ? err.message : String(err) });
} finally {
  if (browser) await browser.close();
  preview.kill();
}

// Only fail the build when nothing prerendered — a partial result is still
// better than shipping plain CSR shells, and a single flaky route shouldn't
// gate the whole deploy.
if (successCount === 0) {
  console.error("✗ No routes prerendered — failing build.");
  process.exit(1);
}
