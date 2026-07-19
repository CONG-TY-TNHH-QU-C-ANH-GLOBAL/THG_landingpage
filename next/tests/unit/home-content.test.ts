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
import { resetLoggedCmsFallbacks } from "../../src/shared/cms/log-fallback";
import { FALLBACK_CONTACT_LOCATIONS } from "../../src/features/home/server/contact-fallback";

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
  resetLoggedCmsFallbacks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
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
    await expect(loadSiteSettings()).resolves.toEqual(EMPTY_SITE_SETTINGS);
  });

  it("falls back on unavailability with a redaction-safe WARNING and no console.error", async () => {
    mockFetch(async () => jsonResponse({ error: "boom" }, 500));
    await expect(loadHomeServices("vi")).resolves.toEqual([]);
    // Expected recoverable fallback: warn, not error — console.error would become a Next
    // dev error-overlay entry for a non-defect.
    expect(console.error).not.toHaveBeenCalled();
    const call = (console.warn as ReturnType<typeof vi.fn>).mock.calls.find((c) =>
      String(c[0]).includes("[CMS] fallback"),
    );
    expect(call).toBeDefined();
    const serialized = JSON.stringify(call);
    expect(serialized).toContain("/services?lang=vi");
    expect(serialized).not.toContain("boom");
  });

  it("falls back on a malformed contract: WARN for the fallback, transport keeps its drift log", async () => {
    mockFetch(async () => jsonResponse({ locale: "vi", services: "not-an-array" }));
    await expect(loadHomeServices("vi")).resolves.toEqual([]);
    // The FND-004 transport's structured schema-drift log (parity: cmsClient.ts:112) is a
    // real contract-violation signal and stays console.error; the WEB-001 fallback itself
    // only warns, and neither log carries the raw payload.
    const errors = (console.error as ReturnType<typeof vi.fn>).mock.calls;
    expect(errors).toHaveLength(1);
    expect(String(errors[0][0])).toContain("Schema validation failed");
    const warns = (console.warn as ReturnType<typeof vi.fn>).mock.calls.filter((c) =>
      String(c[0]).includes("[CMS] fallback"),
    );
    expect(warns).toHaveLength(1);
    expect(JSON.stringify([...errors, ...warns])).not.toContain("not-an-array");
  });

  it("dedupes the fallback warning for a repeatedly failing endpoint", async () => {
    mockFetch(async () => jsonResponse({ error: "down" }, 500));
    await loadHomeServices("vi");
    await loadHomeServices("vi");
    const warns = (console.warn as ReturnType<typeof vi.fn>).mock.calls.filter((c) =>
      String(c[0]).includes("/services?lang=vi"),
    );
    expect(warns).toHaveLength(1);
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

describe("loadContactLocations result contract (ready / empty / unavailable)", () => {
  const row = { id: 1, position: 1, kind: "office", label: "HQ", address: "A", phone: null, url: null, lang_class: null };

  it("HTTP 200 with records → ready with every record", async () => {
    mockFetch(async () => jsonResponse({ locale: "vi", locations: [row] }));
    const r = await loadContactLocations("vi");
    expect(r.status).toBe("ready");
    expect(r.locations).toHaveLength(1);
    expect(r.locations[0]).toMatchObject({ kind: "office", label: "HQ" });
  });

  it("HTTP 200 with a valid empty list → CONFIRMED empty (never the fallback)", async () => {
    mockFetch(async () => jsonResponse({ locale: "vi", locations: [] }));
    const r = await loadContactLocations("vi");
    expect(r).toEqual({ status: "empty", locations: [] });
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("network failure → unavailable with the verified production fallback rows", async () => {
    mockFetch(async () => {
      throw new TypeError("fetch failed");
    });
    const r = await loadContactLocations("vi");
    expect(r.status).toBe("unavailable");
    if (r.status === "unavailable") expect(r.reason).toBe("network");
    expect(r.locations).toBe(FALLBACK_CONTACT_LOCATIONS.vi);
    expect(r.locations.length).toBeGreaterThan(0);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("invalid schema → unavailable (contract), never presented as empty", async () => {
    mockFetch(async () => jsonResponse({ locale: "vi", locations: "nope" }));
    const r = await loadContactLocations("en");
    expect(r.status).toBe("unavailable");
    if (r.status === "unavailable") expect(r.reason).toBe("contract");
    expect(r.locations).toBe(FALLBACK_CONTACT_LOCATIONS.en);
  });

  it("HTTP 5xx → unavailable (http) with fallback; the reason never reaches the rows", async () => {
    mockFetch(async () => jsonResponse({ error: "internal-secret" }, 500));
    const r = await loadContactLocations("zh");
    expect(r.status).toBe("unavailable");
    if (r.status === "unavailable") expect(r.reason).toBe("http");
    expect(JSON.stringify(r.locations)).not.toContain("internal-secret");
  });

  it("fallback dataset integrity: production-captured rows per locale, no empty locale", () => {
    expect(FALLBACK_CONTACT_LOCATIONS.vi).toHaveLength(9);
    expect(FALLBACK_CONTACT_LOCATIONS.en).toHaveLength(8);
    expect(FALLBACK_CONTACT_LOCATIONS.zh).toHaveLength(8);
    for (const rows of Object.values(FALLBACK_CONTACT_LOCATIONS)) {
      for (const l of rows) {
        expect(l.label.trim().length).toBeGreaterThan(0);
        // every row carries a real display line (address, phone or url) — no invented stubs
        expect(l.address ?? l.phone ?? l.url).toBeTruthy();
      }
    }
  });
});
