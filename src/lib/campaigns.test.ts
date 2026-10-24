import { describe, expect, it } from "vitest";

import {
  campaignLandingHref,
  campaignsResponseSchema,
  formatCampaignDates,
  pickHomeFeatured,
  pickNavFeatured,
  resolveCampaignHref,
} from "./campaigns";
import fixture from "./campaigns.fixture.json";

const { campaigns } = campaignsResponseSchema.parse(fixture);

describe("campaign fixture", () => {
  it("matches the contract schema", () => {
    expect(campaigns.length).toBeGreaterThan(1);
  });
});

describe("pickNavFeatured / pickHomeFeatured", () => {
  it("returns null when nothing is flagged or the list is missing", () => {
    const none = campaigns.map((c) => ({ ...c, nav_featured: false, home_featured: false }));
    expect(pickNavFeatured(none)).toBeNull();
    expect(pickHomeFeatured(none)).toBeNull();
    expect(pickNavFeatured(undefined)).toBeNull();
    expect(pickNavFeatured([])).toBeNull();
  });

  it("picks the first flagged campaign in array order", () => {
    const all = campaigns.map((c) => ({ ...c, nav_featured: true, home_featured: true }));
    expect(pickNavFeatured(all)?.slug).toBe(all[0].slug);
    const secondOnly = campaigns.map((c, i) => ({ ...c, nav_featured: i > 0 }));
    expect(pickNavFeatured(secondOnly)?.slug).toBe(campaigns[1].slug);
  });
});

describe("resolveCampaignHref", () => {
  it("prefixes internal paths with the language", () => {
    expect(resolveCampaignHref("/christmas#hot", "en")).toEqual({ kind: "internal", to: "/en/christmas#hot" });
  });

  it("keeps absolute https URLs as plain links", () => {
    expect(resolveCampaignHref("https://hub.thgfulfill.com/x", "vi")).toEqual({
      kind: "external",
      href: "https://hub.thgfulfill.com/x",
    });
  });

  it.each([null, "", "  ", "christmas", "//evil.example", "http://a.b", "javascript:alert(1)"])(
    "rejects %j",
    (href) => {
      expect(resolveCampaignHref(href, "vi")).toBeNull();
    },
  );
});

describe("campaignLandingHref", () => {
  it("uses landing_path when set", () => {
    expect(campaignLandingHref({ slug: "x", landing_path: "/christmas" }, "vi")).toEqual({
      kind: "internal",
      to: "/vi/christmas",
    });
  });

  it("falls back to the detail page", () => {
    expect(campaignLandingHref({ slug: "tet-2027", landing_path: null }, "zh")).toEqual({
      kind: "internal",
      to: "/zh/campaigns/tet-2027",
    });
  });
});

describe("formatCampaignDates", () => {
  it("formats ranges and single sides", () => {
    expect(formatCampaignDates("2026-10-24", "2026-12-25")).toBe("24/10/2026 – 25/12/2026");
    expect(formatCampaignDates("2026-10-24", null)).toBe("24/10/2026");
    expect(formatCampaignDates(null, "2026-12-25")).toBe("→ 25/12/2026");
    expect(formatCampaignDates(null, null)).toBe("");
  });
});
