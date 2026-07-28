import { describe, it, expect } from "vitest";

import {
  LEAD_SERVICE_KEYS,
  LEAD_SURFACE_KEYS,
  serviceLabel,
  fulfillProductTypeLabel,
} from "@/shared/ui/lead-services";
import {
  buildServiceDetails,
  buildDetailsByService,
} from "@/shared/ui/lead-service-detail-fields";
import { MARKETING_COPY } from "@/shared/i18n/marketing-copy";
import type { MarketingCopy } from "@/shared/i18n/marketing";

// WEB-002 lead contract (landing mirror). These keys are the code-owned domain identifiers that
// must stay in lockstep with the CMS backend (CMS_management- lead-request.ts SERVICE_KEYS /
// SURFACE_KEYS) — the backend rejects anything else, so drift here is a real defect.

describe("canonical lead keys mirror the backend", () => {
  it("service keys are the four THG services (not CMS slugs / route paths)", () => {
    expect([...LEAD_SERVICE_KEYS]).toEqual(["fulfill", "express", "warehouse", "dropship"]);
  });

  it("surface keys cover the dialog + the inline forms", () => {
    expect([...LEAD_SURFACE_KEYS]).toEqual([
      "global-services-dialog",
      "fulfill-inline",
      "express-inline",
      "warehouse-inline",
      "dropship-inline",
      "home-conversion-inline",
    ]);
  });
});

describe("serviceLabel", () => {
  it("resolves the localized nav label, falling back to the key", () => {
    const copy = { "nav.thg_fulfill": "THG Fulfill" } as MarketingCopy;
    expect(serviceLabel(copy, "fulfill")).toBe("THG Fulfill");
    expect(serviceLabel({} as MarketingCopy, "express")).toBe("express");
  });

  it("every registered service key has a resolvable label (registry coverage)", () => {
    const full = Object.fromEntries(
      Object.entries(MARKETING_COPY).map(([k, v]) => [k, v.en]),
    ) as MarketingCopy;
    for (const key of LEAD_SERVICE_KEYS) {
      const label = serviceLabel(full, key);
      expect(label.length).toBeGreaterThan(0);
      expect(label).not.toBe(key); // a real localized label, not the raw key fallback
    }
  });
});

describe("buildServiceDetails", () => {
  it("returns fulfill product_type only when selected", () => {
    expect(buildServiceDetails("fulfill", "apparel")).toEqual({ product_type: "apparel" });
    expect(buildServiceDetails("fulfill", "")).toBeNull();
  });

  it("returns null for services with no verified detail fields (no fabricated details)", () => {
    expect(buildServiceDetails("express", "")).toBeNull();
    expect(buildServiceDetails("warehouse", "")).toBeNull();
    expect(buildServiceDetails("dropship", "")).toBeNull();
  });
});

describe("buildDetailsByService", () => {
  it("keys the primary's details by service key, or null", () => {
    expect(buildDetailsByService("fulfill", "apparel")).toEqual({ fulfill: { product_type: "apparel" } });
    expect(buildDetailsByService("fulfill", "")).toBeNull();
    expect(buildDetailsByService("warehouse", "")).toBeNull();
    expect(buildDetailsByService(null, "apparel")).toBeNull();
  });
});

describe("fulfillProductTypeLabel", () => {
  it("is localized per locale", () => {
    expect(fulfillProductTypeLabel("en", "apparel")).toBe("Apparel");
    expect(fulfillProductTypeLabel("vi", "fleece")).toBe("Fleece & đồ nhà");
    expect(fulfillProductTypeLabel("zh", "drinkware")).toBe("杯具饮具");
  });
});
