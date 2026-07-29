import { describe, it, expect } from "vitest";

import { getFulfillContent } from "@/features/fulfill";
import { SUPPORTED_LOCALES } from "@/shared/i18n";

// The Fulfill copy is modelled by domain and resolved per locale (copy.ts). These contract tests
// lock: complete vi/en/zh coverage, stable domain structure (step/capability IDs + ordering),
// correct + non-mixed locale selection, and the approved wording that other layers depend on.

const STEP_INDICES = ["STEP 01 / 04", "STEP 02 / 04", "STEP 03 / 04", "STEP 04 / 04"];
const CAPABILITY_IDS = ["network", "qc", "pack", "hub", "intake", "print", "advisory"] as const;

describe("getFulfillContent — locale coverage + selection", () => {
  it("resolves a complete copy object for every supported locale", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const c = getFulfillContent(locale);
      expect(c.heroHeadline.length).toBeGreaterThan(0);
      expect(c.steps).toHaveLength(4);
      expect(Object.keys(c.capabilities)).toHaveLength(7);
    }
  });

  it("selects the correct locale for the art-directed H1 (distinct per locale, no fallback)", () => {
    expect(getFulfillContent("vi").heroHeadline).toBe("Vận hành ẩn, hiển thị rõ ràng.");
    expect(getFulfillContent("en").heroHeadline).toBe("Make invisible operations visible.");
    expect(getFulfillContent("zh").heroHeadline).toBe("让隐形的运营变得可见。");
  });

  it("does not mix languages within a locale", () => {
    // A vi resolve must not leak the en/zh headline anywhere it is used.
    const vi = getFulfillContent("vi");
    expect(vi.consultCta).toBe("Yêu cầu tư vấn");
    expect(vi.faqEmpty).toBe("Chưa có câu hỏi công khai cho THG Fulfill.");
    const zh = getFulfillContent("zh");
    expect(zh.consultCta).toBe("请求咨询");
    expect(zh.faqEmpty).toBe("THG Fulfill 暂无公开问题。");
  });
});

describe("getFulfillContent — stable domain structure", () => {
  it("keeps journey step order + the locale-invariant index rail across locales", () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(getFulfillContent(locale).steps.map((s) => s.index)).toEqual(STEP_INDICES);
    }
    // Step titles are the same brand terms in every locale (invariant here), descriptions localize.
    expect(getFulfillContent("vi").steps[2].description).toContain("QC từng đơn");
    expect(getFulfillContent("en").steps[2].description).toContain("Item-level QC");
  });

  it("keeps capability IDs + ordering across locales", () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(Object.keys(getFulfillContent(locale).capabilities)).toEqual(CAPABILITY_IDS);
    }
  });

  it("keeps the operations badge and catalog image paths locale-invariant", () => {
    const images = SUPPORTED_LOCALES.map((l) => getFulfillContent(l).catalogFallback.map((c) => c.image));
    expect(new Set(images.map((x) => x.join("|"))).size).toBe(1); // identical in every locale
    expect(getFulfillContent("vi").catalogFallback[0].image).toBe("/assets/fulfill/apparel.png");
    const badges = SUPPORTED_LOCALES.map((l) => getFulfillContent(l).heroBadge);
    expect(new Set(badges).size).toBe(1);
    expect(badges[0]).toBe("THG Fulfillment Operations");
  });

  it("keeps 4 hub stages and 3 catalog fallback categories, localized name/alt", () => {
    expect(getFulfillContent("en").hubStages).toEqual(["Received", "Processing", "QC", "Packed"]);
    expect(getFulfillContent("vi").hubStages[0]).toBe("Nhận");
    expect(getFulfillContent("en").catalogFallback).toHaveLength(3);
    expect(getFulfillContent("en").catalogFallback[0].name).toBe("Apparel");
    expect(getFulfillContent("zh").catalogFallback[0].name).toBe("服装");
  });
});
