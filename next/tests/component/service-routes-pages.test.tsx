// @vitest-environment happy-dom
// Renders the real WEB-002 service routes and the WEB-008 tracking route.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

const { cmsFetch } = vi.hoisted(() => ({ cmsFetch: vi.fn() }));
vi.mock("@/shared/cms", () => ({ cmsFetch }));
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => <img {...(props as Record<string, string>)} />,
}));

import ThgExpressPage, {
  generateMetadata as expressMetadata,
} from "@/app/[lang]/thg-express/page";
import ThgOrderPage from "@/app/[lang]/thg-order/page";
import TrackingPage from "@/app/[lang]/tracking/page";
import { resetLoggedCmsFallbacks } from "@/shared/cms/log-fallback";
import { CmsNetworkError } from "@/shared/cms/errors";

const params = (lang: string) => Promise.resolve({ lang });
const translations = { locale: "vi", translations: {} };

function routeCms(map: Record<string, unknown>) {
  cmsFetch.mockImplementation((path: string) => {
    const hit = Object.entries(map)
      .sort((a, b) => b[0].length - a[0].length)
      .find(([prefix]) => path.startsWith(prefix));
    if (!hit) return Promise.reject(new CmsNetworkError(path, "network"));
    const value = hit[1];
    return value instanceof Error ? Promise.reject(value) : Promise.resolve(value);
  });
}

const services = {
  locale: "vi",
  services: [
    {
      id: "thg-express",
      position: 1,
      icon: "✈️",
      status: "live",
      name: "THG Express",
      tagline: "Vận chuyển quốc tế",
      hero_eyebrow: "Xuyên biên giới",
      hero_title: "THG Express",
      hero_sub: "VN/CN đi US, UK, EU",
      cta_text: null,
      cta_url: null,
      body_md: "## Giới thiệu\n- điểm một",
      bullets: ["Air", "Sea"],
      gallery: [],
      videos: [],
      products: [],
    },
  ],
};

const blocks = {
  locale: "vi",
  page_slug: "thg-express",
  kind: null,
  blocks: [
    {
      id: 1,
      kind: "shipping_lane",
      position: 1,
      icon: null,
      title: "VN → US",
      description: "Tuyến chính",
      payload: { tag: "Air", time: "7-10 ngày", features: ["Có tracking"], note: "Trừ hàng pin" },
    },
    {
      id: 2,
      kind: "stat",
      position: 1,
      icon: null,
      title: "Đúng hạn",
      description: null,
      payload: { val: "98%" },
    },
  ],
};

const faqs = {
  locale: "vi",
  scope: "express",
  faqs: [{ id: 1, position: 1, question: "Bao lâu?", answer: "7-10 ngày" }],
};

beforeEach(() => {
  cmsFetch.mockReset();
  resetLoggedCmsFallbacks();
});
afterEach(cleanup);

describe("/[lang]/thg-express", () => {
  const wired = {
    "/translations": translations,
    "/services": services,
    "/service-blocks": blocks,
    "/faqs": faqs,
  };

  it("renders CMS hero, block sections, stats and FAQs", async () => {
    routeCms(wired);
    render(await ThgExpressPage({ params: params("vi") }));

    expect(screen.getByRole("heading", { level: 1, name: "THG Express" })).toBeTruthy();
    expect(screen.getByText("VN/CN đi US, UK, EU")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 3, name: "VN → US" })).toBeTruthy();
    expect(screen.getByText("Có tracking")).toBeTruthy();
    expect(screen.getByText("98%")).toBeTruthy();
    expect(screen.getByText("Bao lâu?")).toBeTruthy();
  });

  it("uses the native <details> disclosure for FAQs — keyboard-operable with no JS", async () => {
    routeCms(wired);
    const { container } = render(await ThgExpressPage({ params: params("vi") }));
    expect(container.querySelector("details > summary")?.textContent).toBe("Bao lâu?");
  });

  it("renders the canonical lead dialog trigger, not a page-local form", async () => {
    routeCms(wired);
    const { container } = render(await ThgExpressPage({ params: params("vi") }));
    // The page itself posts nothing; the only submit path is the shared dialog island.
    expect(container.querySelector("form")).toBeNull();
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });

  it("emits Service JSON-LD only when the CMS published content", async () => {
    routeCms(wired);
    const { container } = render(await ThgExpressPage({ params: params("vi") }));
    const types = [...container.querySelectorAll('script[type="application/ld+json"]')].map(
      (s) => JSON.parse(s.textContent ?? "{}")["@type"],
    );
    expect(types).toContain("Service");

    cleanup();
    cmsFetch.mockReset();
    resetLoggedCmsFallbacks();
    routeCms({
      "/translations": translations,
      "/services": { locale: "vi", services: [] },
      "/service-blocks": { locale: "vi", page_slug: "thg-express", kind: null, blocks: [] },
      "/faqs": { locale: "vi", scope: "express", faqs: [] },
    });
    const empty = render(await ThgExpressPage({ params: params("vi") }));
    const emptyTypes = [
      ...empty.container.querySelectorAll('script[type="application/ld+json"]'),
    ].map((s) => JSON.parse(s.textContent ?? "{}")["@type"]);
    // Describing a service with no content would be a claim with nothing behind it.
    expect(emptyTypes).not.toContain("Service");
    expect(screen.getByText(/chưa có nội dung công bố/)).toBeTruthy();
  });

  it("keeps the page alive when only one of the three reads fails", async () => {
    routeCms({
      "/translations": translations,
      "/services": services,
      "/service-blocks": new CmsNetworkError("/service-blocks", "network"),
      "/faqs": faqs,
    });
    render(await ThgExpressPage({ params: params("vi") }));
    expect(screen.getByRole("heading", { level: 1, name: "THG Express" })).toBeTruthy();
    expect(screen.getByText("Bao lâu?")).toBeTruthy();
  });

  it("reports unavailable only when every read failed", async () => {
    routeCms({ "/translations": translations });
    render(await ThgExpressPage({ params: params("vi") }));
    expect(screen.getByText(/Hiện chưa tải được thông tin dịch vụ/)).toBeTruthy();
  });

  it("is noindex when nothing is published for the locale", async () => {
    routeCms({
      "/translations": translations,
      "/services": { locale: "en", services: [] },
      "/service-blocks": { locale: "en", page_slug: "thg-express", kind: null, blocks: [] },
      "/faqs": { locale: "en", scope: "express", faqs: [] },
    });
    expect((await expressMetadata({ params: params("en") })).robots).toMatchObject({
      index: false,
    });
  });
});

describe("/[lang]/thg-order", () => {
  it("reads its OWN page_slug — Order is not Fulfill and not Express", async () => {
    routeCms({
      "/translations": translations,
      "/services": { locale: "vi", services: [] },
      "/service-blocks": { locale: "vi", page_slug: "thg-order", kind: null, blocks: [] },
      "/faqs": { locale: "vi", scope: "order", faqs: [] },
    });
    render(await ThgOrderPage({ params: params("vi") }));

    const paths = cmsFetch.mock.calls.map((c) => c[0] as string);
    expect(paths).toContain("/service-blocks?page_slug=thg-order&lang=vi");
    expect(paths.some((p) => p.includes("thg-fulfill"))).toBe(false);
    expect(paths.some((p) => p.includes("thg-express"))).toBe(false);
  });
});

describe("/[lang]/tracking (WEB-008)", () => {
  it("deep-links to the Hub and makes no claim about any order", async () => {
    routeCms({ "/translations": translations });
    render(await TrackingPage({ params: params("vi") }));

    const link = screen.getByRole("link", { name: /THG Hub/ });
    expect(link.getAttribute("href")).toBe("https://hub.thgfulfill.com/tracking?lang=vi");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("has no order-lookup form on the public plane", async () => {
    routeCms({ "/translations": translations });
    const { container } = render(await TrackingPage({ params: params("vi") }));
    // The Vite page asked for an order ID it could not resolve; there is no input here at all.
    expect(container.querySelector("form")).toBeNull();
    expect(container.querySelector("input")).toBeNull();
    expect(screen.getByText(/không thể tra cứu đơn hàng/)).toBeTruthy();
  });

  it("makes no CMS content read", async () => {
    routeCms({ "/translations": translations });
    await TrackingPage({ params: params("vi") });
    const contentReads = cmsFetch.mock.calls
      .map((c) => c[0] as string)
      .filter((p) => !p.startsWith("/translations"));
    expect(contentReads).toEqual([]);
  });
});
