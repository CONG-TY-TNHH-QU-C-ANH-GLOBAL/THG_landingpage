import { describe, expect, it } from "vitest";

import {
  campaignLandingHref,
  campaignResponseSchema,
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

// Independent oracle for the sanitizer: whatever it accepts must resolve, in a
// real URL parser, either to the site's own origin under the /:lang prefix or
// to an https: URL. Anything that would run script or leave the https scheme
// must be dropped (null).
const SITE = "https://thgfulfill.com";

describe("resolveCampaignHref against hostile input", () => {
  it.each([
    " JAVASCRIPT:alert(1)",
    "JaVaScRiPt:alert(1)",
    "\tjavascript:alert(1)",
    "\njavascript:alert(1)",
    "java\tscript:alert(1)",
    "javascript://%0aalert(1)",
    "vbscript:msgbox(1)",
    "data:text/html,<script>alert(1)</script>",
    "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
    "  //evil.example",
    "//evil.example/christmas",
    String.raw`\\evil.example`,
    String.raw`\/evil.example`,
    "http://evil.example",
    "HTTP://evil.example",
    "ftp://evil.example",
    "mailto:a@b.c",
    "https:",
    "https://",
    "https:///evil.example",
    "https:evil.example",
    String.raw`https:\\evil.example`,
    "#hot",
    "?q=1",
    "christmas",
    "./christmas",
    "../christmas",
  ])("drops %j", (href) => {
    expect(resolveCampaignHref(href, "vi")).toBeNull();
  });

  it.each([
    ["/christmas", "/vi/christmas"],
    ["  /christmas#hot  ", "/vi/christmas#hot"],
    ["/catalog/christmas?tab=new", "/vi/catalog/christmas?tab=new"],
    // Browsers read "/\host" as "//host"; the /:lang prefix must keep it same-origin.
    [String.raw`/\evil.example`, null],
    ["/javascript:alert(1)", null],
  ])("keeps the internal path %j on the site origin under /vi", (href, expected) => {
    const resolved = resolveCampaignHref(href, "vi");
    expect(resolved?.kind).toBe("internal");
    if (resolved?.kind !== "internal") return;
    if (expected) expect(resolved.to).toBe(expected);
    const url = new URL(resolved.to, SITE);
    expect(url.origin).toBe(SITE);
    expect(url.pathname.startsWith("/vi/")).toBe(true);
  });

  it.each(["https://hub.thgfulfill.com/deals", "HTTPS://hub.thgfulfill.com", " https://hub.thgfulfill.com/x?y=1 "])(
    "keeps %j as an https plain link",
    (href) => {
      const resolved = resolveCampaignHref(href, "en");
      expect(resolved?.kind).toBe("external");
      if (resolved?.kind !== "external") return;
      expect(new URL(resolved.href).protocol).toBe("https:");
      expect(resolved.href).toBe(href.trim());
    },
  );

  it("never lets an unsafe landing_path through campaignLandingHref; falls back to the detail page", () => {
    for (const landing_path of ["javascript:alert(1)", "//evil.example", "http://evil.example", "data:,x"]) {
      expect(campaignLandingHref({ slug: "xmas", landing_path }, "en")).toEqual({
        kind: "internal",
        to: "/en/campaigns/xmas",
      });
    }
  });

  it("URL-encodes the slug in the detail fallback so it cannot escape the path", () => {
    expect(campaignLandingHref({ slug: "a/../../evil?x#y", landing_path: null }, "vi")).toEqual({
      kind: "internal",
      to: "/vi/campaigns/a%2F..%2F..%2Fevil%3Fx%23y",
    });
  });
});

describe("pickHomeFeatured", () => {
  it("picks the first home_featured campaign, independently of nav_featured", () => {
    const [a, b] = campaigns;
    const list = [
      { ...a, slug: "nav-only", nav_featured: true, home_featured: false },
      { ...b, slug: "home-1", nav_featured: false, home_featured: true },
      { ...a, slug: "home-2", nav_featured: true, home_featured: true },
    ];
    expect(pickHomeFeatured(list)?.slug).toBe("home-1");
    expect(pickNavFeatured(list)?.slug).toBe("nav-only");
  });
});

describe("contract-edge payloads", () => {
  const nullable = {
    slug: "tet-2027",
    title: "Tết 2027",
    summary: null,
    cover_url: null,
    og_image_url: null,
    start_date: null,
    end_date: null,
    position: 0,
    landing_path: null,
    cta_label: null,
    nav_featured: false,
    nav_label: null,
    nav_badge: null,
    home_featured: false,
    menu_items: [],
    updated_at: 1793000000,
  };

  it("accepts every contract-nullable field as null and an empty menu_items", () => {
    const parsed = campaignsResponseSchema.parse({ locale: "en", campaigns: [nullable] });
    expect(parsed.campaigns[0]).toEqual(nullable);
  });

  it("accepts a null menu item subtitle", () => {
    const item = { icon: "🎁", title: "X", subtitle: null, href: "/x" };
    expect(campaignsResponseSchema.parse({ locale: "vi", campaigns: [{ ...nullable, menu_items: [item] }] }).campaigns[0].menu_items).toEqual([item]);
  });

  it("accepts an empty campaigns list", () => {
    expect(campaignsResponseSchema.parse({ locale: "zh", campaigns: [] }).campaigns).toEqual([]);
  });

  it.each([
    ["missing menu_items", { menu_items: undefined }],
    ["non-boolean nav_featured", { nav_featured: 1 }],
    ["null slug", { slug: null }],
    ["null title", { title: null }],
  ])("rejects %s", (_name, patch) => {
    expect(campaignsResponseSchema.safeParse({ locale: "vi", campaigns: [{ ...nullable, ...patch }] }).success).toBe(false);
  });

  it("detail: nullable body/SEO fields parse and a missing available_locales defaults to []", () => {
    const parsed = campaignResponseSchema.parse({
      campaign: { ...nullable, body_md: null, seo_title: null, seo_description: null },
    });
    expect(parsed.available_locales).toEqual([]);
    expect(parsed.campaign.body_md).toBeNull();
  });

  it("detail: rejects a payload missing the detail-only fields", () => {
    expect(campaignResponseSchema.safeParse({ campaign: nullable, available_locales: ["vi"] }).success).toBe(false);
  });
});
