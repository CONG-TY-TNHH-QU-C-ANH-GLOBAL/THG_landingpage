import { describe, it, expect } from "vitest";

import { resolveSiteOrigin, localePath, localeUrl } from "../../src/shared/seo/site";
import { buildAlternates } from "../../src/shared/seo/buildAlternates";
import { buildPageMetadata } from "../../src/shared/seo/buildPageMetadata";
import { serializeJsonLd } from "../../src/shared/seo/jsonld";
import { SUPPORTED_LOCALES } from "../../src/shared/i18n";

// FND-003 unit matrix (TEST_PLAN T-02: locale/metadata matrix vi/en/zh; T-04: safe serializer).
// Parity source: src/components/seo/SeoHead.tsx + scripts/generate-sitemap.ts at the recorded
// baseline commits.

const ORIGIN = "https://thgfulfill.com";

describe("resolveSiteOrigin", () => {
  it("defaults to the production origin when unset/blank", () => {
    expect(resolveSiteOrigin(undefined)).toBe(ORIGIN);
    expect(resolveSiteOrigin("")).toBe(ORIGIN);
    expect(resolveSiteOrigin("   ")).toBe(ORIGIN);
  });

  it("normalizes to a bare origin (no trailing slash, no path)", () => {
    expect(resolveSiteOrigin("https://staging.example.com/")).toBe("https://staging.example.com");
  });

  it("fails loud on a malformed value without echoing it", () => {
    let caught: Error | undefined;
    try {
      resolveSiteOrigin("not-a-valid-url");
    } catch (e) {
      caught = e as Error;
    }
    expect(caught?.message).toMatch(/Invalid NEXT_PUBLIC_SITE_URL/);
    expect(caught?.message).not.toContain("not-a-valid-url");
  });

  it("rejects non-HTTP(S) schemes (mailto: would yield origin 'null')", () => {
    expect(() => resolveSiteOrigin("mailto:test@example.com")).toThrow(/http\(s\)/);
    expect(() => resolveSiteOrigin("ftp://example.com")).toThrow(/http\(s\)/);
  });
});

describe("localePath / localeUrl (safe route joining)", () => {
  it("prefixes the locale and never double-slashes", () => {
    expect(localePath("vi", "/")).toBe("/vi");
    expect(localePath("en", "/blog")).toBe("/en/blog");
    expect(localePath("zh", "catalog")).toBe("/zh/catalog");
    expect(localePath("en", "/blog/")).toBe("/en/blog");
  });

  it("builds absolute URLs on the canonical origin", () => {
    expect(localeUrl("vi")).toBe(`${ORIGIN}/vi`);
    expect(localeUrl("zh", "/policy")).toBe(`${ORIGIN}/zh/policy`);
  });
});

describe("buildAlternates (canonical + hreflang, SeoHead parity)", () => {
  it("emits exactly vi, en, zh-CN and x-default; x-default points at /vi", () => {
    const { languages } = buildAlternates("en", "/");
    expect(Object.keys(languages).sort()).toEqual(["en", "vi", "x-default", "zh-CN"]);
    expect(languages.vi).toBe(`${ORIGIN}/vi`);
    expect(languages.en).toBe(`${ORIGIN}/en`);
    expect(languages["zh-CN"]).toBe(`${ORIGIN}/zh`);
    expect(languages["x-default"]).toBe(`${ORIGIN}/vi`);
  });

  it("canonical is the self URL of the active locale for every locale", () => {
    for (const lang of SUPPORTED_LOCALES) {
      expect(buildAlternates(lang, "/").canonical).toBe(`${ORIGIN}/${lang}`);
    }
  });

  it("keeps the base path in every alternate for nested routes", () => {
    const { canonical, languages } = buildAlternates("zh", "/blog");
    expect(canonical).toBe(`${ORIGIN}/zh/blog`);
    expect(languages["zh-CN"]).toBe(`${ORIGIN}/zh/blog`);
    expect(languages["x-default"]).toBe(`${ORIGIN}/vi/blog`);
  });
});

describe("buildPageMetadata (the CONTRACTS §1 boundary)", () => {
  const input = {
    routeId: "/",
    title: "T",
    description: "D",
    indexable: true,
  } as const;

  it("maps og:locale per locale (vi_VN / en_US / zh_CN, SeoHead parity)", () => {
    expect(buildPageMetadata({ ...input, lang: "vi" }).openGraph).toMatchObject({ locale: "vi_VN" });
    expect(buildPageMetadata({ ...input, lang: "en" }).openGraph).toMatchObject({ locale: "en_US" });
    expect(buildPageMetadata({ ...input, lang: "zh" }).openGraph).toMatchObject({ locale: "zh_CN" });
  });

  it("emits title, description, self canonical, hreflang set and og:url = canonical", () => {
    const m = buildPageMetadata({ ...input, lang: "en" });
    expect(m.title).toBe("T");
    expect(m.description).toBe("D");
    expect(m.alternates?.canonical).toBe(`${ORIGIN}/en`);
    expect(m.alternates?.languages).toMatchObject({ "x-default": `${ORIGIN}/vi` });
    expect(m.openGraph).toMatchObject({ url: `${ORIGIN}/en`, siteName: "THG Fulfill" });
  });

  it("maps indexable to robots index/follow both ways", () => {
    expect(buildPageMetadata({ ...input, lang: "vi" }).robots).toEqual({ index: true, follow: true });
    expect(buildPageMetadata({ ...input, lang: "vi", indexable: false }).robots).toEqual({
      index: false,
      follow: false,
    });
  });

  it("defaults og:image to /og-default.jpg at 1200x630 and honors an override (parity)", () => {
    const def = buildPageMetadata({ ...input, lang: "vi" });
    expect(def.openGraph?.images).toEqual([{ url: `${ORIGIN}/og-default.jpg`, width: 1200, height: 630 }]);
    const custom = buildPageMetadata({ ...input, lang: "vi", image: `${ORIGIN}/hero.jpg` });
    expect(custom.openGraph?.images).toEqual([{ url: `${ORIGIN}/hero.jpg`, width: 1200, height: 630 }]);
    expect(custom.twitter).toMatchObject({ card: "summary_large_image", site: "@THGFulfill" });
  });
});

describe("serializeJsonLd (AC-06 safe serializer)", () => {
  // Built via code points so no invisible separator literals live in this source file.
  const SEP = String.fromCodePoint(0x2028);
  const PSEP = String.fromCodePoint(0x2029);

  it("escapes script-breaking characters and the JS line separators", () => {
    const out = serializeJsonLd({ name: `</script><b>&"x"${SEP}${PSEP}` });
    expect(out).not.toContain("<");
    expect(out).not.toContain(">");
    expect(out).not.toContain("&");
    expect(out).not.toContain(SEP);
    expect(out).not.toContain(PSEP);
    expect(out).toContain("u003c/script"); // the escaped </script sequence survives
  });

  it("stays valid JSON that round-trips to the original data", () => {
    const data = { a: "</script>", b: ["&", SEP + PSEP], c: { d: 1 } };
    expect(JSON.parse(serializeJsonLd(data))).toEqual(data);
  });
});
