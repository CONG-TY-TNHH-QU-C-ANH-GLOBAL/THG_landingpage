import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  HTML_LANG,
  isSupportedLocale,
  assertSupportedLocale,
} from "../../src/shared/i18n";
import { dictionarySchema } from "../../src/shared/i18n/schemas/dictionary.schema";
import { getDictionary } from "../../src/shared/i18n/server/get-dictionary";
import {
  validDictionaryFixture,
  missingKeyDictionaryFixture,
  extraKeyDictionaryFixture,
} from "../../src/shared/i18n/testing/dictionary-fixtures";

describe("locale model", () => {
  it("has exactly vi/en/zh with vi default", () => {
    expect([...SUPPORTED_LOCALES]).toEqual(["vi", "en", "zh"]);
    expect(DEFAULT_LOCALE).toBe("vi");
    expect(isSupportedLocale(DEFAULT_LOCALE)).toBe(true);
  });

  it("isSupportedLocale is the single canonical check", () => {
    for (const l of SUPPORTED_LOCALES) expect(isSupportedLocale(l)).toBe(true);
    for (const bad of ["fr", "de", "EN", "", "viet", null, undefined, 1]) {
      expect(isSupportedLocale(bad)).toBe(false);
    }
  });

  it("assertSupportedLocale narrows or throws (no silent fallback)", () => {
    expect(assertSupportedLocale("en")).toBe("en");
    expect(() => assertSupportedLocale("fr")).toThrow(/Unsupported locale/);
    expect(() => assertSupportedLocale("EN")).toThrow();
  });

  it("html lang reflects locale (zh → zh-CN)", () => {
    expect(HTML_LANG).toEqual({ vi: "vi", en: "en", zh: "zh-CN" });
  });
});

describe("dictionary schema + parity", () => {
  function keyPaths(obj: unknown, prefix = ""): string[] {
    if (!obj || typeof obj !== "object") return [];
    return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => {
      if (v && typeof v === "object") return keyPaths(v, `${prefix}${k}.`);
      return [`${prefix}${k}`];
    });
  }

  it("vi/en/zh have an identical required key structure", () => {
    const [vi, en, zh] = SUPPORTED_LOCALES.map((l) => keyPaths(getDictionary(l)).sort());
    expect(en).toEqual(vi);
    expect(zh).toEqual(vi);
    expect(vi.length).toBeGreaterThan(0);
  });

  it("schema accepts a valid dictionary and rejects missing keys", () => {
    expect(() => dictionarySchema.parse(validDictionaryFixture)).not.toThrow();
    expect(() => dictionarySchema.parse(missingKeyDictionaryFixture)).toThrow();
  });

  it("schema rejects unexpected extra keys (strict)", () => {
    expect(() => dictionarySchema.parse(extraKeyDictionaryFixture)).toThrow();
  });

  it("getDictionary returns the correct locale dictionary and throws on unsupported", () => {
    expect(getDictionary("en").meta.htmlLang).toBe("en");
    expect(getDictionary("zh").meta.htmlLang).toBe("zh-CN");
    // @ts-expect-error unsupported locale is a type + runtime error
    expect(() => getDictionary("fr")).toThrow();
  });

  it("every dictionary's meta.htmlLang matches the canonical HTML_LANG (construction invariant)", () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(getDictionary(locale).meta.htmlLang).toBe(HTML_LANG[locale]);
    }
  });
});

describe("request efficiency (FND-002 §12)", () => {
  const read = (rel: string) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), "utf8");

  it("proxy.ts performs no fetch / network / CMS / cookie work", () => {
    const src = read("../../src/proxy.ts");
    expect(src).not.toMatch(/\bfetch\s*\(/);
    expect(src).not.toMatch(/cookies?\.set|\.cookies\b/);
    expect(src).not.toMatch(/https?:\/\//);
  });

  it("get-dictionary loads local modules only (no fetch/network) with a server-only guard", () => {
    const src = read("../../src/shared/i18n/server/get-dictionary.ts");
    expect(src).toMatch(/import\s+["']server-only["']/);
    expect(src).not.toMatch(/\bfetch\s*\(/);
    expect(src).not.toMatch(/https?:\/\//);
    expect(src).toMatch(/\.\.\/dictionaries\/(vi|en|zh)\.json/);
  });
});

describe("runtime immutability (FND-002 §11)", () => {
  it("SUPPORTED_LOCALES is frozen and cannot be mutated", () => {
    expect(Object.isFrozen(SUPPORTED_LOCALES)).toBe(true);
    expect(() => (SUPPORTED_LOCALES as unknown as string[]).push("fr")).toThrow();
    expect([...SUPPORTED_LOCALES]).toEqual(["vi", "en", "zh"]);
  });

  it("dictionaries are deeply frozen; mutation attempts do not alter shared state", () => {
    const dict = getDictionary("en");
    expect(Object.isFrozen(dict)).toBe(true);
    expect(Object.isFrozen(dict.meta)).toBe(true);
    expect(Object.isFrozen(dict.foundation)).toBe(true);
    expect(() => ((dict as { meta: { htmlLang: string } }).meta.htmlLang = "xx")).toThrow();
    expect(() => ((dict as { foundation: { title: string } }).foundation.title = "x")).toThrow();
    expect(() => ((dict as { extra?: string }).extra = "y")).toThrow();
    // shared cache unchanged
    expect(getDictionary("en").meta.htmlLang).toBe("en");
    expect(getDictionary("en").foundation.title).toBe(dict.foundation.title);
  });
});

describe("locale boundary (FND-002 §10)", () => {
  it("unsupported strings cannot reach HTML_LANG or dictionary indexing (guard first)", () => {
    const raw: string = "fr"; // raw route param typed as string
    expect(isSupportedLocale(raw)).toBe(false);
    if (isSupportedLocale(raw)) {
      // narrowed to Locale here — these COMPILE (type-level proof); unreachable for "fr"
      expect(HTML_LANG[raw]).toBeDefined();
      expect(getDictionary(raw)).toBeDefined();
    }
    // direct unsupported access throws at the runtime boundary
    expect(() => assertSupportedLocale(raw)).toThrow();
  });

  it("HTML_LANG maps zh to the approved zh-CN (hreflang source)", () => {
    expect(HTML_LANG.zh).toBe("zh-CN");
  });
});
