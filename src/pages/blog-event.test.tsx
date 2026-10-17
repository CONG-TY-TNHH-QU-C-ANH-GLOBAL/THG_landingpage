import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { cmsClient } from "@/lib/cmsClient";
import { I18nProvider } from "@/lib/i18n";
import BlogPage from "./BlogPage";
import BlogDetailPage from "./BlogDetailPage";
import EventsPage from "./events/EventsPage";
import EventDetailPage from "./events/EventDetailPage";

vi.mock("@/components/Navbar", () => ({ default: () => <nav>TH Group</nav> }));

const post = {
  slug: "shipment-guide", title: "Visible article title", excerpt: "Article excerpt",
  body_md: "# Approved article", thumbnail_url: null, category: "Guides",
  published_date: "2026-10-13", seo_title: "CMS search title",
  seo_description: "CMS search description", updated_at: 1791849600, slides: [],
};
const event = {
  id: 1, slug: "seller-webinar", locale: "vi", title: "Seller webinar", summary: "Webinar summary",
  body_md: "# Approved event", cover_url: null, og_image_url: null,
  event_date: "2026-10-13", end_date: null, location: null, role: null, url: null,
  video_url: null, seo_title: null, seo_description: null, photos: [],
};

const clients: QueryClient[] = [];
function mount(path: string, client = new QueryClient({ defaultOptions: { queries: { retry: false } } })) {
  clients.push(client);
  client.setQueryData(["cms", "translations", "vi"], { translations: {} });
  client.setQueryData(["cms", "seo-pages"], { pages: [] });
  return render(
    <QueryClientProvider client={client}>
      <HelmetProvider>
        <I18nProvider>
          <MemoryRouter initialEntries={[path]}>
            <Routes>
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/blog-preview/:token" element={<BlogDetailPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:slug" element={<EventDetailPage />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      </HelmetProvider>
    </QueryClientProvider>,
  );
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json" },
});
type Failure = "404" | "503" | "network" | "schema";
function failedResponse(failure: Failure) {
  if (failure === "network") throw new TypeError("Network disconnected");
  if (failure === "schema") return json({ locale: "vi", unexpected: true });
  return json({ error: "CMS temporarily unavailable" }, Number(failure));
}
function detailFetch(kind: "blog" | "events", failure?: Failure) {
  let retrySucceeds = false;
  const fetch = vi.fn(async (input: RequestInfo | URL) => {
    const url = new URL(String(input));
    if (url.pathname.endsWith("/blog/categories")) return json({ locale: "vi", categories: [] });
    if (url.pathname.includes(`/${kind}/`)) {
      if (failure && !retrySucceeds) return failedResponse(failure);
      return json(kind === "blog" ? { locale: "vi", available_locales: ["vi"], post } : { locale: "vi", available_locales: ["vi"], event });
    }
    throw new Error(`Unexpected fetch ${url.pathname}`);
  });
  vi.stubGlobal("fetch", fetch);
  return { fetch, recover: () => { retrySucceeds = true; } };
}

beforeEach(() => {
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.stubGlobal("IntersectionObserver", class {
    constructor(private callback: IntersectionObserverCallback) {}
    observe(target: Element) { this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this as unknown as IntersectionObserver); }
    unobserve() {}
    disconnect() {}
  });
});
afterEach(() => {
  cleanup();
  for (const client of clients.splice(0)) client.clear();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.head.innerHTML = "";
});

describe("CMS transport status", () => {
  it("keeps HTTP 404 distinguishable from provider/network/schema failure", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => json({ error: "Missing article" }, 404)));
    await expect(cmsClient.getBlogPost("missing", "vi")).rejects.toMatchObject({ status: 404, message: expect.stringContaining("Missing article") });
  });
});

describe("blog and event detail failure/recovery", () => {
  for (const kind of ["blog", "events"] as const) {
    it(`${kind}: only HTTP 404 uses a not-found/noindex page`, async () => {
      detailFetch(kind, "404");
      mount(`/${kind}/missing`);
      await waitFor(() => expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex,nofollow"));
      expect(screen.queryByRole("button", { name: "Thử lại" })).not.toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
    for (const failure of ["503", "network", "schema"] as const) {
      it(`${kind}: ${failure} remains an error and manual retry recovers`, async () => {
        const transport = detailFetch(kind, failure);
        mount(`/${kind}/${kind === "blog" ? post.slug : event.slug}`);
        expect(await screen.findByRole("alert")).toHaveTextContent(/Chưa thể tải/);
        expect(document.title).not.toMatch(/not found/i);
        expect(document.querySelector('meta[name="robots"]')?.getAttribute("content")).not.toBe("noindex,nofollow");
        transport.recover();
        fireEvent.click(screen.getByRole("button", { name: "Thử lại" }));
        expect(await screen.findByRole("heading", { level: 1, name: kind === "blog" ? post.title : event.title })).toBeInTheDocument();
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        expect(transport.fetch.mock.calls.filter(([url]) => String(url).includes(`/${kind}/`))).toHaveLength(2);
      });
    }
  }
});

it("blog CMS SEO fields reach document head without replacing the visible title", async () => {
  detailFetch("blog");
  mount(`/blog/${post.slug}`);
  expect(await screen.findByRole("heading", { level: 1, name: post.title })).toBeInTheDocument();
  await waitFor(() => expect(document.title).toBe("CMS search title"));
  expect(document.querySelector('meta[name="description"]')).toHaveAttribute("content", "CMS search description");
});

it("blog preview keeps private transport and expires without requesting a public post", async () => {
  vi.useFakeTimers();
  const token = "a".repeat(64);
  const response = { ok: true, preview: {
    ...post, externalId: "crm-preview:task:blog", versionId: "version-1", kind: "blog", locale: "vi",
    expiresAt: new Date(Date.now() + 1000).toISOString(),
  } };
  const fetch = vi.fn(async () => json(response));
  vi.stubGlobal("fetch", fetch);
  mount(`/blog-preview/${token}`);
  await act(async () => { await vi.advanceTimersByTimeAsync(30); });
  expect(screen.getByRole("heading", { level: 1, name: post.title })).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("Chưa xuất bản");
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/blog-previews/${token}`), expect.objectContaining({ cache: "no-store", referrerPolicy: "no-referrer", signal: expect.any(AbortSignal) }));
  expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex,nofollow");
  expect(document.querySelector('meta[name="referrer"]')).toHaveAttribute("content", "no-referrer");
  expect(document.querySelector('script[type="application/ld+json"]')).not.toBeInTheDocument();
  await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
  expect(screen.queryByRole("heading", { level: 1, name: post.title })).not.toBeInTheDocument();
  expect(screen.getByText("Không tìm thấy bài viết")).toBeInTheDocument();
});

it("blog list distinguishes outage from empty and supports retry", async () => {
  let recovered = false;
  vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
    const url = new URL(String(input));
    if (url.pathname.endsWith("/categories")) return json({ locale: "vi", categories: [] });
    return recovered ? json({ locale: "vi", posts: [], total: 0 }) : json({ error: "Outage" }, 503);
  }));
  mount("/blog");
  expect(await screen.findByRole("alert")).toHaveTextContent(/Chưa thể tải/);
  expect(screen.queryByText("Chưa có bài viết nào. Vui lòng quay lại sau.")).not.toBeInTheDocument();
  recovered = true;
  fireEvent.click(screen.getByRole("button", { name: "Thử lại" }));
  expect(await screen.findByText("Chưa có bài viết nào. Vui lòng quay lại sau.")).toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

for (const kind of ["blog", "events"] as const) {
  it(`${kind}: a deep list card reveals on intersection without index-based waiting`, async () => {
    vi.useFakeTimers();
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    if (kind === "blog") {
      const posts = Array.from({ length: 50 }, (_, index) => ({ ...post, slug: `article-${index}`, title: `Article ${index}`, published_date: "2026-10-13" }));
      client.setQueryData(["cms", "blog", "list", "vi", "all"], { locale: "vi", posts, total: 50 });
      client.setQueryData(["cms", "blog", "categories", "vi"], { locale: "vi", categories: [] });
    } else {
      client.setQueryData(["cms", "events", "vi"], { locale: "vi", events: Array.from({ length: 50 }, (_, index) => ({ ...event, id: index, slug: `event-${index}`, title: `Event ${index}` })) });
    }
    mount(`/${kind}`, client);
    await act(async () => { await vi.advanceTimersByTimeAsync(1); });
    const lastCard = screen.getByRole("link", { name: kind === "blog" ? /Article 49/ : /Event 49/ });
    // The reveal wrapper is the card's own on /events and the whole grid's on
    // /blog; either way the deepest card must end up visible.
    const reveal = lastCard.closest<HTMLElement>('[style*="opacity"]');
    expect(reveal).not.toBeNull();
    expect(reveal).toHaveStyle({ opacity: "1" });
  });
}
