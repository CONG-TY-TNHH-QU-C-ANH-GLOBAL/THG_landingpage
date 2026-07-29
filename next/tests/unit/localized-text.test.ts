import { describe, it, expect } from "vitest";

import { tr, localize, SUPPORTED_LOCALES } from "@/shared/i18n";

// The shared localization primitive: tr builds a value for every locale, and localize resolves to
// exactly one — with no cross-locale fallback (mixed-language output must be impossible).
describe("LocalizedText primitive", () => {
  it("tr produces a value for every supported locale", () => {
    const t = tr("vi-value", "en-value", "zh-value");
    for (const locale of SUPPORTED_LOCALES) {
      expect(typeof t[locale]).toBe("string");
      expect(t[locale].length).toBeGreaterThan(0);
    }
  });

  it("localize returns the requested locale's value verbatim (no fallback)", () => {
    const t = tr("xin chào", "hello", "你好");
    expect(localize("vi", t)).toBe("xin chào");
    expect(localize("en", t)).toBe("hello");
    expect(localize("zh", t)).toBe("你好");
  });
});
