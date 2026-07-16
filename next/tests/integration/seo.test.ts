import { describe, it, expect } from "vitest";

import { generateMetadata } from "../../src/app/[lang]/page";
import robots from "../../src/app/robots";
import sitemap from "../../src/app/sitemap";
import { getDictionary } from "../../src/shared/i18n/server/get-dictionary";
import { SUPPORTED_LOCALES } from "../../src/shared/i18n";

// FND-003 integration matrix (TEST_PLAN T-03): the [lang] route emits the full metadata set
// through the FND-003 boundary, and the robots/sitemap app files produce the approved output.
// The rendered-HTML/runtime matrix runs against the packaged standalone artifact via
// scripts/validation/seo-acceptance.sh (same split as FND-002's locale-routing matrix).

const ORIGIN = "https://thgfulfill.com";

const metadataFor = (lang: string) => generateMetadata({ params: Promise.resolve({ lang }) });

describe("[lang] route metadata (vi/en/zh)", () => {
  it("emits locale-aware title/description from the dictionary", async () => {
    for (const lang of SUPPORTED_LOCALES) {
      const m = await metadataFor(lang);
      const dict = getDictionary(lang);
      expect(m.title).toBe(dict.foundation.title);
      expect(m.description).toBe(dict.foundation.description);
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

  it("keeps the foundation placeholder noindex (flips only with the real WEB-001 homepage)", async () => {
    for (const lang of SUPPORTED_LOCALES) {
      expect((await metadataFor(lang)).robots).toEqual({ index: false, follow: false });
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
    const agents = out.rules instanceof Array ? out.rules.map((r) => r.userAgent) : [];
    for (const bot of ["Googlebot", "Bingbot", "GPTBot", "ClaudeBot", "PerplexityBot", "*"]) {
      expect(agents).toContain(bot);
    }
    expect(out.sitemap).toBe(`${ORIGIN}/sitemap.xml`);
  });
});

describe("sitemap.ts (foundation state)", () => {
  it("lists no URLs while every existing route is noindex (SPEC §17: no leaked noindex URLs)", () => {
    expect(sitemap()).toEqual([]);
  });
});
