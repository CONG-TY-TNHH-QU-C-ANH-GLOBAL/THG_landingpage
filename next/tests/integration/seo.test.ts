import { describe, it, expect } from "vitest";

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { generateMetadata } from "../../src/app/[lang]/page";
import robots from "../../src/app/robots";
import sitemap from "../../src/app/sitemap";
import { SUPPORTED_LOCALES } from "../../src/shared/i18n";
import {
  INDEXABLE_ROUTES,
  NON_INDEXABLE_ROUTES,
} from "../../src/shared/seo/indexable-routes";

// FND-003 integration matrix (TEST_PLAN T-03): the [lang] route emits the full metadata set
// through the FND-003 boundary, and the robots/sitemap app files produce the approved output.
// The rendered-HTML/runtime matrix runs against the packaged standalone artifact via
// scripts/validation/seo-acceptance.sh (same split as FND-002's locale-routing matrix).

const ORIGIN = "https://thgfulfill.com";

const metadataFor = (lang: string) => generateMetadata({ params: Promise.resolve({ lang }) });

describe("[lang] route metadata (vi/en/zh)", () => {
  it("emits the per-locale home title/description (parity: Index.tsx:33-46)", async () => {
    expect((await metadataFor("vi")).title).toBe(
      "THG Fulfill — Giải pháp fulfillment toàn cầu cho seller TMĐT",
    );
    expect((await metadataFor("en")).title).toBe(
      "THG Fulfill — Global fulfillment for eCommerce sellers",
    );
    expect((await metadataFor("zh")).title).toBe("THG Fulfill — 面向电商卖家的全球履约方案");
    for (const lang of SUPPORTED_LOCALES) {
      expect((await metadataFor(lang)).description).toBeTruthy();
    }
  });

  it("emits a self canonical and the full hreflang set for every locale", async () => {
    for (const lang of SUPPORTED_LOCALES) {
      const m = await metadataFor(lang);
      expect(m.alternates?.canonical).toBe(`${ORIGIN}/${lang}`);
      expect(m.alternates?.languages).toEqual({
        vi: `${ORIGIN}/vi`,
        en: `${ORIGIN}/en`,
        "zh-CN": `${ORIGIN}/zh`,
        "x-default": `${ORIGIN}/vi`,
      });
    }
  });

  it("the real homepage is indexable (WEB-001) with the hero og:image", async () => {
    for (const lang of SUPPORTED_LOCALES) {
      const m = await metadataFor(lang);
      expect(m.robots).toEqual({ index: true, follow: true });
      expect(m.openGraph?.images).toEqual([
        { url: `${ORIGIN}/assets/THG.jpg`, width: 1200, height: 630 },
      ]);
    }
  });

  it("returns no metadata for unsupported locales (404 path)", async () => {
    expect(await metadataFor("fr")).toEqual({});
    expect(await metadataFor("EN")).toEqual({});
  });
});

describe("robots.ts (public/robots.txt parity)", () => {
  it("allows the documented crawlers, defaults to allow-all, and points at the sitemap", () => {
    const out = robots();
    const rules = out.rules instanceof Array ? out.rules : [out.rules];
    const agents = rules.map((r) => r.userAgent);
    for (const bot of ["Googlebot", "Bingbot", "GPTBot", "ClaudeBot", "PerplexityBot", "*"]) {
      expect(agents).toContain(bot);
    }
    // Every rule must be an effective allow-all: allow "/" and no disallow anywhere.
    for (const rule of rules) {
      expect(rule).toMatchObject({ allow: "/" });
      expect(rule).not.toHaveProperty("disallow");
    }
    expect(out.sitemap).toBe(`${ORIGIN}/sitemap.xml`);
  });
});

describe("sitemap.ts — expanded from the indexable-route registry", () => {
  // The registry (shared/seo/indexable-routes) is the contract; this asserts the exact
  // expansion rather than a row count, so a blocked route cannot slip in and a removed route
  // cannot slip out.

  it("lists exactly registry x locales, with no duplicates and no non-canonical origin", () => {
    const entries = sitemap();
    const expected = INDEXABLE_ROUTES.flatMap((route) =>
      SUPPORTED_LOCALES.map(
        (lang) => `${ORIGIN}/${lang}${route.path === "/" ? "" : route.path}`,
      ),
    );

    expect(entries.map((e) => e.url).sort()).toEqual(expected.sort());
    expect(new Set(entries.map((e) => e.url)).size).toBe(entries.length);
    expect(entries.every((e) => e.url.startsWith(ORIGIN))).toBe(true);
    expect(entries.some((e) => e.url.includes("localhost"))).toBe(false);
  });

  it("covers every supported locale for every template", () => {
    const entries = sitemap();
    for (const route of INDEXABLE_ROUTES) {
      const suffix = route.path === "/" ? "" : route.path;
      for (const lang of SUPPORTED_LOCALES) {
        expect(entries.map((e) => e.url)).toContain(`${ORIGIN}/${lang}${suffix}`);
      }
    }
    expect(entries).toHaveLength(INDEXABLE_ROUTES.length * SUPPORTED_LOCALES.length);
  });

  it("keeps ordering stable: templates in registry order, locales in SUPPORTED_LOCALES order", () => {
    // Stable output keeps the generated XML diffable between deploys.
    const expected = INDEXABLE_ROUTES.flatMap((route) =>
      SUPPORTED_LOCALES.map(
        (lang) => `${ORIGIN}/${lang}${route.path === "/" ? "" : route.path}`,
      ),
    );
    expect(sitemap().map((e) => e.url)).toEqual(expected);
  });

  it("carries the per-template weighting from the registry", () => {
    for (const entry of sitemap()) {
      const suffix = entry.url.replace(new RegExp(`^${ORIGIN}/(vi|en|zh)`), "") || "/";
      const route = INDEXABLE_ROUTES.find((r) => r.path === suffix);
      expect(route).toBeDefined();
      expect(entry.priority).toBe(route!.priority);
      expect(entry.changeFrequency).toBe(route!.changeFrequency);
    }
  });

  it("carries the full hreflang alternate set on every entry", () => {
    for (const e of sitemap()) {
      const suffix = e.url.replace(new RegExp(`^${ORIGIN}/(vi|en|zh)`), "");
      expect(e.alternates?.languages).toEqual({
        vi: `${ORIGIN}/vi${suffix}`,
        en: `${ORIGIN}/en${suffix}`,
        "zh-CN": `${ORIGIN}/zh${suffix}`,
        "x-default": `${ORIGIN}/vi${suffix}`,
      });
    }
  });
});

describe("indexable-route registry", () => {
  it("admits only routes whose page.tsx exists in next/", () => {
    // The rule the registry exists to enforce: listing a route that is not implemented tells a
    // crawler a URL is live when it 404s.
    const appDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "src", "app", "[lang]");
    for (const route of INDEXABLE_ROUTES) {
      const file =
        route.path === "/"
          ? join(appDir, "page.tsx")
          : join(appDir, ...route.path.slice(1).split("/"), "page.tsx");
      expect(existsSync(file), `${route.path} has no page.tsx at ${file}`).toBe(true);
    }
  });

  it("keeps blocked and deferred routes OUT, each with a recorded reason", () => {
    const listed = new Set(INDEXABLE_ROUTES.map((r) => r.path));
    for (const [path, reason] of Object.entries(NON_INDEXABLE_ROUTES)) {
      expect(listed.has(path), `${path} must not be in the sitemap registry`).toBe(false);
      expect(reason.length).toBeGreaterThan(10);
    }
  });

  it("has no duplicate template and a sane priority for each", () => {
    const paths = INDEXABLE_ROUTES.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
    for (const route of INDEXABLE_ROUTES) {
      expect(route.priority).toBeGreaterThan(0);
      expect(route.priority).toBeLessThanOrEqual(1);
      expect(route.path.startsWith("/")).toBe(true);
      // Locale prefixes are added at expansion time; a template must not carry one.
      expect(/^\/(vi|en|zh)(\/|$)/.test(route.path)).toBe(false);
    }
  });
});
