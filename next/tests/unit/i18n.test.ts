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
