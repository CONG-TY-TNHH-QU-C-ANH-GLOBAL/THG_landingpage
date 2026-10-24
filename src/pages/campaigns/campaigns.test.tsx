import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import fixture from "@/lib/campaigns.fixture.json";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { useEffect } from "react";
import CampaignsPage from "./CampaignsPage";
import CampaignDetailPage from "./CampaignDetailPage";

vi.mock("@/components/Navbar", () => ({ default: () => <nav>TH Group</nav> }));
vi.mock("@/components/ScrollReveal", () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }));

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

/** Switches the provider's language before the page reads it. */
function Lang({ lang, children }: { lang: "vi" | "en" | "zh"; children: React.ReactNode }) {
  const { language, setLanguage } = useI18n();
  useEffect(() => setLanguage(lang), [lang, setLanguage]);
  return language === lang ? <>{children}</> : null;
}

function mount(path: string, lang: "vi" | "en" | "zh" = "vi") {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  for (const l of ["vi", "en", "zh"]) client.setQueryData(["cms", "translations", l], { translations: {} });
  client.setQueryData(["cms", "seo-pages"], { pages: [] });
  return render(
    <QueryClientProvider client={client}>
      <HelmetProvider>
        <I18nProvider>
          <Lang lang={lang}>
            <MemoryRouter initialEntries={[path]}>
              <Routes>
                <Route path="/campaigns" element={<CampaignsPage />} />
                <Route path="/campaigns/:slug" element={<CampaignDetailPage />} />
              </Routes>
            </MemoryRouter>
          </Lang>
        </I18nProvider>
      </HelmetProvider>
    </QueryClientProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("campaign pages", () => {
  it("lists live campaigns linking to their detail pages", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(json(fixture));
    mount("/campaigns");
    const link = await screen.findByRole("link", { name: /Christmas 2026 Collection/ });
    expect(link).toHaveAttribute("href", "/vi/campaigns/christmas-2026");
  });

  it("renders detail SEO, breadcrumb and the landing CTA", async () => {
    const campaign = { ...fixture.campaigns[0], body_md: "## Ưu đãi", seo_title: null, seo_description: null };
    vi.spyOn(globalThis, "fetch").mockResolvedValue(json({ campaign, available_locales: ["vi"] }));
    mount("/campaigns/christmas-2026");
    expect(await screen.findByRole("heading", { level: 1, name: "Christmas 2026 Collection" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Khám phá bộ sưu tập/ })).toHaveAttribute("href", "/vi/christmas");
    await waitFor(() => expect(document.title).toBe("Christmas 2026 Collection — TH Group"));
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent ?? "");
    expect(ld.some((t) => t.includes("BreadcrumbList") && t.includes("/vi/campaigns/christmas-2026"))).toBe(true);
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://thgfulfill.com/vi/campaigns/christmas-2026",
    );
  });

  it("shows not-found for a campaign that is not live", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(json({ error: "Not found" }, 404));
    mount("/campaigns/old");
    expect(await screen.findByText("Chương trình đã kết thúc hoặc không tồn tại.")).toBeInTheDocument();
  });
});

const robots = () => document.querySelector('meta[name="robots"]')?.getAttribute("content");
const detail = (overrides: Record<string, unknown> = {}) => ({
  ...fixture.campaigns[0],
  body_md: null,
  seo_title: null,
  seo_description: null,
  ...overrides,
});

describe("campaign detail: available_locales noindex rule", () => {
  it.each([
    ["en", ["vi"], "noindex,nofollow"],
    ["zh", ["vi", "en"], "noindex,nofollow"],
    ["en", ["vi", "en"], "index,follow"],
    ["vi", ["vi"], "index,follow"],
  ] as const)("lang %s with available_locales %j → %s", async (lang, available, expected) => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(json({ campaign: detail(), available_locales: available }));
    mount("/campaigns/christmas-2026", lang);
    await screen.findByRole("heading", { level: 1, name: "Christmas 2026 Collection" });
    await waitFor(() => expect(robots()).toBe(expected));
    expect(String(fetchSpy.mock.calls[0][0])).toContain(`/campaigns/christmas-2026?lang=${lang}`);
  });
});

describe("campaign detail: links", () => {
  it("renders no CTA for an unsafe landing_path and drops unsafe menu items", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      json({
        campaign: detail({
          landing_path: "javascript:alert(1)",
          menu_items: [
            { icon: "x", title: "Evil", subtitle: null, href: "//evil.example" },
            { icon: "🎁", title: "Gifts", subtitle: null, href: "/catalog/christmas" },
          ],
        }),
        available_locales: ["vi"],
      }),
    );
    mount("/campaigns/christmas-2026");
    await screen.findByRole("heading", { level: 1, name: "Christmas 2026 Collection" });
    expect(screen.queryByRole("link", { name: /Khám phá bộ sưu tập/ })).toBeNull();
    expect(screen.queryByText("Evil")).toBeNull();
    expect(screen.getByRole("link", { name: /Gifts/ })).toHaveAttribute("href", "/vi/catalog/christmas");
    for (const a of screen.getAllByRole("link")) expect(a.getAttribute("href")).toMatch(/^\/vi(\/|$)/);
  });

  it("shows a retryable error (not not-found) and noindex on a 500", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(json({ error: "boom" }, 500));
    mount("/campaigns/christmas-2026");
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.queryByText("Chương trình đã kết thúc hoặc không tồn tại.")).toBeNull();
    await waitFor(() => expect(robots()).toBe("noindex,nofollow"));
  });
});

describe("campaign list", () => {
  it("is noindex when there are no live campaigns", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(json({ locale: "vi", campaigns: [] }));
    mount("/campaigns");
    await waitFor(() => expect(robots()).toBe("noindex,nofollow"));
  });

  it("is indexable when campaigns are live", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(json(fixture));
    mount("/campaigns");
    await screen.findByRole("link", { name: /Christmas 2026 Collection/ });
    await waitFor(() => expect(robots()).toBe("index,follow"));
  });
});
