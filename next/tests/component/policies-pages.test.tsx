// @vitest-environment happy-dom
// Renders the real WEB-007 route components — no test-only replicas — so what these assert
// is what the server actually sends. Everything here is in the SSR output, which is the same
// as saying both documents work with JavaScript disabled.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";

const { cmsFetch } = vi.hoisted(() => ({ cmsFetch: vi.fn() }));
vi.mock("@/shared/cms", () => ({ cmsFetch }));
// next/image needs a loader/config that does not exist in a unit render.
// The real component needs a Next image loader/config that a unit render does not have.
// The stub forwards every prop so the loading/alt/src assertions below still test what the
// page actually sets.
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => <img {...(props as Record<string, string>)} />,
}));

import PolicyPage, { generateMetadata as policyMetadata } from "@/app/[lang]/policy/page";
import ShippingPolicyPage, {
  generateMetadata as shippingMetadata,
} from "@/app/[lang]/shipping-policy/page";
import { resetLoggedCmsFallbacks } from "@/shared/cms/log-fallback";
import { CmsNetworkError } from "@/shared/cms/errors";

const params = (lang: string) => Promise.resolve({ lang });

/** `/translations` is the first read every page makes through getMarketingCopy. */
const translations = { locale: "vi", translations: {} };

function policyFixtures() {
  return {
    list: {
      locale: "vi",
      policies: [
        { slug: "shipping", title: "Vận chuyển", icon: "📦", mode: "text", summary: null, position: 1 },
        { slug: "returns", title: "Đổi trả", icon: "tiktok", mode: "image", summary: "Tóm tắt", position: 2 },
      ],
    },
    shipping: {
      locale: "vi",
      policy: {
        slug: "shipping",
        title: "Vận chuyển",
        icon: "📦",
        mode: "text",
        // Exercises every supported markdown construct in one body.
        body_md:
          "## Điều khoản\n- Giao trong 7 ngày\n**In đậm** và [liên kết](https://thgfulfill.com/x)\n🚨 Cảnh báo quan trọng\n### Chi tiết",
        image_list: [],
        text_blocks: [],
        summary: null,
        position: 1,
      },
    },
    returns: {
      locale: "vi",
      policy: {
        slug: "returns",
        title: "Đổi trả",
        icon: "tiktok",
        mode: "image",
        body_md: "",
        image_list: ["https://cms.example/p1.jpg", "https://cms.example/p2.jpg"],
        text_blocks: [{ type: "warn", heading: "Lưu ý", content: ["Giữ hộp gốc"] }],
        summary: "Tóm tắt",
        position: 2,
      },
    },
  };
}

/** Wire cmsFetch by request path so ordering between the page and metadata reads is irrelevant. */
function routeCms(map: Record<string, unknown>) {
  cmsFetch.mockImplementation((path: string) => {
    const hit = Object.entries(map).find(([prefix]) => path.startsWith(prefix));
    if (!hit) return Promise.reject(new CmsNetworkError(path, "network"));
    return Promise.resolve(hit[1]);
  });
}

beforeEach(() => {
  cmsFetch.mockReset();
  resetLoggedCmsFallbacks();
});
afterEach(cleanup);

describe("/[lang]/policy", () => {
  it("server-renders EVERY policy section, not just an active tab", async () => {
    const f = policyFixtures();
    routeCms({
      "/translations": translations,
      "/policies/shipping": f.shipping,
      "/policies/returns": f.returns,
      "/policies": f.list,
    });

    render(await PolicyPage({ params: params("vi") }));

    // The Vite page had exactly one policy in the DOM at a time; both must be here.
    expect(screen.getByRole("heading", { level: 2, name: /Vận chuyển/ })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: /Đổi trả/ })).toBeTruthy();
  });

  it("gives every section a fragment anchor and links to it from the in-page nav", async () => {
    const f = policyFixtures();
    routeCms({
      "/translations": translations,
      "/policies/shipping": f.shipping,
      "/policies/returns": f.returns,
      "/policies": f.list,
    });

    const { container } = render(await PolicyPage({ params: params("vi") }));

    expect(container.querySelector("#shipping")).toBeTruthy();
    expect(container.querySelector("#returns")).toBeTruthy();
    const nav = screen.getByRole("navigation");
    expect(within(nav).getByRole("link", { name: /Vận chuyển/ }).getAttribute("href")).toBe("#shipping");
  });

  it("renders markdown as elements — bold, a safe link, a callout and a subheading", async () => {
    const f = policyFixtures();
    routeCms({
      "/translations": translations,
      "/policies/shipping": f.shipping,
      "/policies/returns": f.returns,
      "/policies": f.list,
    });

    const { container } = render(await PolicyPage({ params: params("vi") }));

    expect(screen.getByText("In đậm").tagName).toBe("STRONG");
    const link = screen.getByRole("link", { name: "liên kết" });
    expect(link.getAttribute("href")).toBe("https://thgfulfill.com/x");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    expect(screen.getByText(/Cảnh báo quan trọng/)).toBeTruthy();
    expect(screen.getByRole("heading", { level: 4, name: "Chi tiết" })).toBeTruthy();
    expect(container.querySelector("li")?.textContent).toContain("Giao trong 7 ngày");
  });

  it("never emits raw HTML from editor content", async () => {
    const f = policyFixtures();
    f.shipping.policy.body_md = '<script>alert(1)</script><img src=x onerror=alert(1)>';
    routeCms({
      "/translations": translations,
      "/policies/shipping": f.shipping,
      "/policies/returns": f.returns,
      "/policies": f.list,
    });

    const { container } = render(await PolicyPage({ params: params("vi") }));

    // React escapes it, so the markup arrives as visible text and no element is created.
    // Scoped past the page's own JSON-LD tag — that one is ours and is expected.
    expect(container.querySelector('script:not([type="application/ld+json"])')).toBeNull();
    expect(container.querySelector("img[onerror]")).toBeNull();
    expect(screen.getByText(/<script>alert\(1\)<\/script>/)).toBeTruthy();
  });

  it("renders scanned pages with a lazy-loaded tail and a page count", async () => {
    const f = policyFixtures();
    routeCms({
      "/translations": translations,
      "/policies/shipping": f.shipping,
      "/policies/returns": f.returns,
      "/policies": f.list,
    });

    const { container } = render(await PolicyPage({ params: params("vi") }));

    const images = container.querySelectorAll("img");
    expect(images).toHaveLength(2);
    expect(images[0].getAttribute("loading")).toBe("eager");
    expect(images[1].getAttribute("loading")).toBe("lazy");
    expect(screen.getByText(/Đổi trả — 2 /)).toBeTruthy();
  });

  it("shows an outage as 'cannot load', never as 'nothing published'", async () => {
    routeCms({ "/translations": translations });

    render(await PolicyPage({ params: params("vi") }));

    expect(screen.getByText(/Hiện chưa tải được chính sách/)).toBeTruthy();
    expect(screen.queryByText(/Chưa có chính sách nào/)).toBeNull();
  });

  it("shows a confirmed-empty CMS as the empty state", async () => {
    routeCms({ "/translations": translations, "/policies": { locale: "vi", policies: [] } });

    render(await PolicyPage({ params: params("vi") }));

    expect(screen.getByText(/Chưa có chính sách nào/)).toBeTruthy();
  });

  it("is indexable only when policy content actually rendered (OQ-P-001)", async () => {
    const f = policyFixtures();
    routeCms({
      "/translations": translations,
      "/policies/shipping": f.shipping,
      "/policies/returns": f.returns,
      "/policies": f.list,
    });
    expect((await policyMetadata({ params: params("vi") })).robots).toMatchObject({ index: true });

    cmsFetch.mockReset();
    resetLoggedCmsFallbacks();
    routeCms({ "/translations": translations, "/policies": { locale: "vi", policies: [] } });
    // An EN/ZH locale with no approved body must not be indexed as though it had the terms.
    expect((await policyMetadata({ params: params("en") })).robots).toMatchObject({ index: false });
  });

  it("emits a localized breadcrumb with absolute canonical URLs", async () => {
    const f = policyFixtures();
    routeCms({
      "/translations": translations,
      "/policies/shipping": f.shipping,
      "/policies/returns": f.returns,
      "/policies": f.list,
    });

    const { container } = render(await PolicyPage({ params: params("vi") }));
    const jsonLd = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(jsonLd?.textContent ?? "{}");

    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement[0]).toMatchObject({
      position: 1,
      name: "Trang chủ",
      item: "https://thgfulfill.com/vi",
    });
    expect(data.itemListElement[1].item).toBe("https://thgfulfill.com/vi/policy");
  });
});

describe("/[lang]/shipping-policy", () => {
  const routes = {
    locale: "vi",
    routes: [
      { slug: "vn-us", position: 1, title: "VN → US", origin: "VN", destination: "US", kind: "air" },
    ],
    total: 1,
  };
  const detail = {
    locale: "vi",
    route: {
      slug: "vn-us",
      position: 1,
      title: "VN → US",
      origin: "VN",
      destination: "US",
      kind: "air",
      body_md: "## Thời gian\n- 7-10 ngày",
      notes: ["Không nhận hàng pin rời"],
      tables: [
        {
          caption: "Bảng giá",
          columns: [
            { key: "w", label: "Cân nặng" },
            { key: "p", label: "Giá" },
          ],
          rows: [{ w: "0.5kg", p: 12 }, { w: "1kg", p: null }],
        },
      ],
      updated_at: 1,
    },
  };

  it("renders the rate table as text cells inside a horizontally scrollable container", async () => {
    routeCms({
      "/translations": translations,
      "/shipping-routes/vn-us": detail,
      "/shipping-routes": routes,
    });

    const { container } = render(await ShippingPolicyPage({ params: params("vi") }));

    const table = screen.getByRole("table");
    expect(within(table).getByRole("columnheader", { name: "Cân nặng" })).toBeTruthy();
    // Numeric cell stringified by the mapper; null cell rendered as an em dash, not "null".
    expect(within(table).getByText("12")).toBeTruthy();
    expect(within(table).getAllByText("—")).toHaveLength(1);
    // Wide tables must scroll in their own box so the page body never scrolls at 320px.
    expect(table.closest(".overflow-x-auto")).toBeTruthy();
    expect(container.querySelector("caption")).toBeTruthy();
  });

  it("renders route notes and the lane chip", async () => {
    routeCms({
      "/translations": translations,
      "/shipping-routes/vn-us": detail,
      "/shipping-routes": routes,
    });

    render(await ShippingPolicyPage({ params: params("vi") }));

    expect(screen.getByText(/Không nhận hàng pin rời/)).toBeTruthy();
    expect(screen.getByText("VN → US", { selector: "span" })).toBeTruthy();
    expect(screen.getByText("air")).toBeTruthy();
  });

  it("distinguishes an outage from a confirmed-empty route set", async () => {
    routeCms({ "/translations": translations });
    render(await ShippingPolicyPage({ params: params("vi") }));
    expect(screen.getByText(/Hiện chưa tải được tuyến vận chuyển/)).toBeTruthy();

    cleanup();
    cmsFetch.mockReset();
    resetLoggedCmsFallbacks();
    routeCms({
      "/translations": translations,
      "/shipping-routes": { locale: "vi", routes: [], total: 0 },
    });
    render(await ShippingPolicyPage({ params: params("vi") }));
    expect(screen.getByText(/Chưa có tuyến vận chuyển nào/)).toBeTruthy();
  });

  it("is noindex when no route content rendered", async () => {
    routeCms({ "/translations": translations });
    expect((await shippingMetadata({ params: params("zh") })).robots).toMatchObject({
      index: false,
    });
  });

  it("returns empty metadata for an unsupported locale", async () => {
    expect(await shippingMetadata({ params: params("fr") })).toEqual({});
  });
});
