import type { ReactNode } from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import App from "@/App";

const spies = vi.hoisted(() => ({ tracking: vi.fn(), utm: vi.fn() }));
vi.mock("@/components/analytics/TrackingScripts", () => ({ TrackingScripts: () => { spies.tracking(); return null; } }));
vi.mock("@/lib/utm", () => ({ captureUtmOnce: spies.utm }));
vi.mock("@/components/Navbar", () => ({ default: () => <nav>THG</nav> }));
vi.mock("@/components/FloatingContact", () => ({ FloatingContact: () => null }));
vi.mock("@/components/cookie/ConsentBanner", () => ({ ConsentBanner: () => null }));
vi.mock("@/components/pricing/LarkPricingProvider", () => ({ LarkPricingProvider: ({ children }: { children: ReactNode }) => children }));

beforeEach(() => {
  spies.tracking.mockClear();
  spies.utm.mockClear();
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  vi.stubGlobal("IntersectionObserver", class { observe() {} unobserve() {} disconnect() {} });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.head.innerHTML = "";
  window.history.replaceState({}, "", "/");
});

it("actual App preview route renders privately without mounting analytics or capturing the token URL", async () => {
  const token = "b".repeat(64);
  window.history.replaceState({}, "", `/vi/blog-preview/${token}`);
  const fetch = vi.fn(async (input: RequestInfo | URL) => {
    const url = new URL(String(input));
    if (url.pathname.endsWith("/translations")) return Response.json({ locale: "vi", translations: {} });
    if (url.pathname.endsWith("/seo-pages")) return Response.json({ pages: [] });
    if (url.pathname.endsWith(`/blog-previews/${token}`)) return Response.json({ ok: true, preview: {
      externalId: "preview-task", versionId: "version-1", kind: "blog", locale: "vi", slug: "private-blog",
      expiresAt: new Date(Date.now() + 60000).toISOString(), title: "Private review draft",
      excerpt: null, body_md: "Review copy", category: null, published_date: null, seo_title: null, seo_description: null,
    } });
    throw new Error(`Unexpected public request ${url.pathname}`);
  });
  vi.stubGlobal("fetch", fetch);
  render(<App />);
  expect(await screen.findByRole("heading", { level: 1, name: "Private review draft" })).toBeInTheDocument();
  await waitFor(() => expect(document.querySelector('meta[name="referrer"]')).toHaveAttribute("content", "no-referrer"));
  expect(spies.tracking).not.toHaveBeenCalled();
  expect(spies.utm).not.toHaveBeenCalled();
  expect(fetch.mock.calls.filter(([url]) => String(url).includes(token))).toHaveLength(1);
  expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex,nofollow");
});

it("actual App still mounts public tracking on the normal blog route", async () => {
  window.history.replaceState({}, "", "/vi/blog");
  vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
    const path = new URL(String(input)).pathname;
    if (path.endsWith("/translations")) return Response.json({ locale: "vi", translations: {} });
    if (path.endsWith("/categories")) return Response.json({ locale: "vi", categories: [] });
    if (path.endsWith("/blog")) return Response.json({ locale: "vi", posts: [], total: 0 });
    if (path.endsWith("/seo-pages")) return Response.json({ pages: [] });
    throw new Error(`Unexpected request ${path}`);
  }));
  render(<App />);
  expect(await screen.findByText("Chưa có bài viết nào. Vui lòng quay lại sau.")).toBeInTheDocument();
  expect(spies.tracking).toHaveBeenCalled();
  expect(spies.utm).toHaveBeenCalledTimes(1);
});
