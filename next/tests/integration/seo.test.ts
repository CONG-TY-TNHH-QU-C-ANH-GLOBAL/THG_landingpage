import { describe, it, expect } from "vitest";

import { generateMetadata } from "../../src/app/[lang]/page";
import robots from "../../src/app/robots";
import sitemap from "../../src/app/sitemap";
import { SUPPORTED_LOCALES } from "../../src/shared/i18n";

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

describe("sitemap.ts (indexable routes that exist in next/)", () => {
  // The listed set grows one slice at a time and is asserted EXACTLY on purpose: a route
  // must not appear here before its page.tsx exists in next/ (SPEC §17), and this list is
  // what would silently claim a not-yet-migrated route is live.
  const EXPECTED_PATHS = [
    "/",
    "/thg-fulfill",
    "/policy",
    "/shipping-policy",
    "/blog",
    "/careers",
    "/thg-express",
    "/thg-warehouse",
    "/thg-order",
    "/tracking",
  ] as const;

  it("lists every migrated indexable route once per locale", () => {
    const entries = sitemap();
    const expected = EXPECTED_PATHS.flatMap((path) =>
      SUPPORTED_LOCALES.map((lang) => `${ORIGIN}/${lang}${path === "/" ? "" : path}`),
    );
    expect(entries.map((e) => e.url).sort()).toEqual(expected.sort());
  });

  it("gives home its parity weekly/1.0 weighting", () => {
    const home = sitemap().filter((e) => /\/(vi|en|zh)$/.test(e.url));
    expect(home).toHaveLength(SUPPORTED_LOCALES.length);
    for (const e of home) {
      expect(e.changeFrequency).toBe("weekly");
      expect(e.priority).toBe(1.0);
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

  it("has no duplicates and no non-canonical origin", () => {
    const entries = sitemap();
    expect(new Set(entries.map((e) => e.url)).size).toBe(entries.length);
    expect(entries.every((e) => e.url.startsWith(ORIGIN))).toBe(true);
  });
});
