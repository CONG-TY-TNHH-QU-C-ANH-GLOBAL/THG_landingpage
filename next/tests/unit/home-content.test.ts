import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import {
  homepageContentFromDto,
  emptyHomepageContent,
} from "../../src/features/home/mappers/homepageContent";
import { liveServicesFromDto } from "../../src/features/home/mappers/service";
import { faqsFromDto } from "../../src/features/home/mappers/faq";
import { contactLocationsFromDto } from "../../src/features/home/mappers/contactLocation";
import { integrationsFromDto } from "../../src/features/home/mappers/integration";
import { marqueeImagesFromDto } from "../../src/features/home/mappers/marqueeImage";
import {
  siteSettingsFromDto,
  EMPTY_SITE_SETTINGS,
} from "../../src/features/home/mappers/siteSettings";
import { servicesResponseSchema } from "../../src/features/home/schemas/services";
import { homepageResponseSchema } from "../../src/features/home/schemas/homepage";
import {
  loadHomepageContent,
  loadHomeServices,
  loadHomeFaqs,
  loadContactLocations,
  loadSiteSettings,
} from "../../src/features/home/server/loaders";

// FND-005 homepage content slice (IP-006): fixture DTO → model mapping, malformed shapes,
// locale pass-through, deterministic per-section fallback (WEB-001 DATA_FLOW), and the
// redaction-safe failure log. Fixtures are representative inline DTOs (IP-006 §3).

const homepageFixture = {
  locale: "vi",
  blocks: [
    { kind: "hero", position: 1, payload: { title: "CMS **Title**", eyebrow: "B", sub: "S", cta1: "Go", cta2: "More" }, id: 1 },
    { kind: "about_video", position: 2, payload: { video_url: "https://youtu.be/abc123", highlight1: "H1", highlight3: "H3" }, id: 2 },
    { kind: "process", position: 3, payload: { step1: "P1", step4: "P4" }, id: 3 },
    { kind: "testimonials", position: 4, payload: { anything: "ignored" }, id: 4 },
  ],
} as const;

const servicesFixture = {
  locale: "vi",
  services: [
    { id: "b", position: 2, icon: null, status: "live", name: "Warehouse", tagline: null, hero_eyebrow: null, cta_text: null, cta_url: null, body_md: null, bullets: [], hero_title: "stripped" },
    { id: "c", position: 3, icon: "truck", status: "draft", name: "Hidden", tagline: "x", hero_eyebrow: null, cta_text: null, cta_url: null, body_md: null, bullets: [] },
    { id: "a", position: 1, icon: "box", status: "live", name: "Fulfill", tagline: "Fast", hero_eyebrow: "POD", cta_text: "Explore", cta_url: "/thg-fulfill", body_md: "Body", bullets: ["b1", "b2"] },
  ],
};

describe("homepageContentFromDto", () => {
  it("maps hero/about-video/process payload keys exactly as the components read them", () => {
    const m = homepageContentFromDto(homepageResponseSchema.parse(homepageFixture));
    expect(m.hero).toEqual({ title: "CMS **Title**", badge: "B", subtitle: "S", primaryCta: "Go", secondaryCta: "More" });
    expect(m.aboutVideo).toEqual({ videoUrl: "https://youtu.be/abc123", highlights: ["H1", "", "H3", ""] });
    expect(m.process.stepTitles).toEqual(["P1", "", "", "P4"]);
  });

  it("yields all-empty content for missing blocks (dictionary fallback renders)", () => {
    const m = homepageContentFromDto({ locale: "en", blocks: [] });
    expect(m).toEqual(emptyHomepageContent());
    expect(m.hero.title).toBe("");
    expect(m.aboutVideo.highlights).toEqual(["", "", "", ""]);
  });
});

describe("liveServicesFromDto", () => {
  it("filters to live, sorts by position, defaults nullable fields to empty strings", () => {
    const dto = servicesResponseSchema.parse(servicesFixture);
    expect(liveServicesFromDto(dto)).toEqual([
      { id: "a", name: "Fulfill", tagline: "Fast", icon: "box", heroEyebrow: "POD", body: "Body", bullets: ["b1", "b2"], ctaText: "Explore", ctaUrl: "/thg-fulfill" },
      { id: "b", name: "Warehouse", tagline: "", icon: "", heroEyebrow: "", body: "", bullets: [], ctaText: "", ctaUrl: null },
    ]);
  });

  it("strips unknown wire fields at the schema (no DTO noise reaches the model)", () => {
    const dto = servicesResponseSchema.parse(servicesFixture);
    expect(dto.services[0]).not.toHaveProperty("hero_title");
  });
});

describe("list mappers keep position order and rename wire fields", () => {
  it("faqs sort by position", () => {
    const faqs = faqsFromDto({
      locale: "vi",
      scope: "home",
      faqs: [
        { id: 2, position: 2, question: "Q2", answer: "A2" },
        { id: 1, position: 1, question: "Q1", answer: "A1" },
      ],
    });
    expect(faqs.map((f) => f.id)).toEqual([1, 2]);
  });

  it("contact locations preserve explicit nulls for the display-line chain", () => {
    const rows = contactLocationsFromDto({
      locale: "vi",
      locations: [
        { id: 1, position: 1, kind: "phone", label: "Hotline", address: null, phone: "0335", url: null, lang_class: "font-cn" },
      ],
    });
    expect(rows[0]).toEqual({ id: 1, kind: "phone", label: "Hotline", address: null, phone: "0335", url: null, langClass: "font-cn" });
  });

  it("integrations map color_class and sort", () => {
    const tiles = integrationsFromDto({
      integrations: [
        { id: 2, position: 2, name: "Amazon", color_class: null },
        { id: 1, position: 1, name: "Shopee", color_class: "bg-x" },
      ],
    });
    expect(tiles).toEqual([
      { id: 1, name: "Shopee", colorClass: "bg-x" },
      { id: 2, name: "Amazon", colorClass: null },
    ]);
  });

  it("marquee images map alt_text → alt and sort", () => {
    const imgs = marqueeImagesFromDto({
      images: [
        { id: 2, position: 2, src: "/b.jpg", alt_text: "B" },
        { id: 1, position: 1, src: "/a.jpg", alt_text: "A" },
      ],
    });
    expect(imgs).toEqual([
      { id: 1, src: "/a.jpg", alt: "A" },
      { id: 2, src: "/b.jpg", alt: "B" },
    ]);
  });
});

describe("siteSettingsFromDto (FloatingContact derivations)", () => {
  it("derives tel/zalo from a VN local phone and messenger from the Facebook URL", () => {
    const m = siteSettingsFromDto({
      settings: {
        contact_phone: "0335 124 089",
        facebook_url: "https://www.facebook.com/THGFulfill?ref=x",
        about_video_url: "https://youtu.be/xyz",
      },
    });
    expect(m).toEqual({
      telUrl: "tel:+84335124089",
      zaloUrl: "https://zalo.me/84335124089",
      messengerUrl: "https://m.me/THGFulfill",
      aboutVideoUrl: "https://youtu.be/xyz",
    });
  });

  it("hides links for unusable values and maps null settings to the empty model", () => {
    expect(siteSettingsFromDto({ settings: null })).toEqual(EMPTY_SITE_SETTINGS);
    const m = siteSettingsFromDto({
      settings: { contact_phone: "n/a", facebook_url: "https://example.com/x", about_video_url: null },
    });
    expect(m).toEqual({ telUrl: null, zaloUrl: null, messengerUrl: null, aboutVideoUrl: null });
  });

  it("derives Messenger only from real Facebook hosts (no substring spoofing)", () => {
    const messengerOf = (facebook_url: string) =>
      siteSettingsFromDto({
        settings: { contact_phone: null, facebook_url, about_video_url: null },
      }).messengerUrl;
    expect(messengerOf("https://notfacebook.com/Page")).toBeNull();
    expect(messengerOf("https://evil.com/facebook.com/Page")).toBeNull();
    expect(messengerOf("https://www.facebook.com/THGFulfill")).toBe("https://m.me/THGFulfill");
    expect(messengerOf("facebook.com/THGFulfill")).toBe("https://m.me/THGFulfill");
    expect(messengerOf("not a url at ://all")).toBeNull();
  });
});

// ── Loaders: transport wiring, locale pass-through, per-section fallback ──

type FetchImpl = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

function mockFetch(impl: FetchImpl) {
  const fn = vi.fn(impl);
  vi.stubGlobal("fetch", fn);
  return fn;
}

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status < 400,
    status,
    statusText: status === 200 ? "OK" : "Error",
    json: async () => body,
  } as unknown as Response;
}

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("home loaders", () => {
  it("passes the locale explicitly on localized endpoints (and scope=home for faqs)", async () => {
    const fetchMock = mockFetch(async () => jsonResponse({ locale: "zh", services: [] }));
    await loadHomeServices("zh");
    expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:8080/api/v1/services?lang=zh");

    const faqMock = mockFetch(async () => jsonResponse({ locale: "en", scope: "home", faqs: [] }));
    await loadHomeFaqs("en");
    expect(faqMock.mock.calls[0][0]).toBe("http://localhost:8080/api/v1/faqs?lang=en&scope=home");
  });

  it("maps a valid response end to end", async () => {
    mockFetch(async () => jsonResponse(servicesFixture));
    await expect(loadHomeServices("vi")).resolves.toEqual([
      { id: "a", name: "Fulfill", tagline: "Fast", icon: "box", heroEyebrow: "POD", body: "Body", bullets: ["b1", "b2"], ctaText: "Explore", ctaUrl: "/thg-fulfill" },
      { id: "b", name: "Warehouse", tagline: "", icon: "", heroEyebrow: "", body: "", bullets: [], ctaText: "", ctaUrl: null },
    ]);
  });

  it("falls back per section on 404 and 5xx (page never hard-fails)", async () => {
    mockFetch(async () => jsonResponse({ error: "not found" }, 404));
    await expect(loadHomeServices("vi")).resolves.toEqual([]);
    mockFetch(async () => jsonResponse({ error: "boom" }, 500));
    await expect(loadContactLocations("vi")).resolves.toEqual([]);
    await expect(loadSiteSettings()).resolves.toEqual(EMPTY_SITE_SETTINGS);
  });

  it("falls back on a malformed contract and logs redaction-safe metadata only", async () => {
    mockFetch(async () => jsonResponse({ locale: "vi", services: "not-an-array" }));
    await expect(loadHomeServices("vi")).resolves.toEqual([]);
    const call = (console.error as ReturnType<typeof vi.fn>).mock.calls.find((c) =>
      String(c[0]).includes("home loader fallback"),
    );
    expect(call).toBeDefined();
    const serialized = JSON.stringify(call);
    expect(serialized).toContain("/services?lang=vi");
    expect(serialized).not.toContain("not-an-array");
  });

  it("falls back on network failure and empty homepage yields dictionary-fallback content", async () => {
    mockFetch(async () => {
      throw new TypeError("fetch failed");
    });
    await expect(loadHomepageContent("vi")).resolves.toEqual(emptyHomepageContent());
  });

  it("rethrows non-CMS errors (misconfiguration is not a content fallback)", async () => {
    vi.stubEnv("CMS_API_URL", "not-a-valid-url");
    mockFetch(async () => jsonResponse({ locale: "vi", services: [] }));
    await expect(loadHomeServices("vi")).rejects.toThrow(/Invalid CMS_API_URL/);
  });
});
