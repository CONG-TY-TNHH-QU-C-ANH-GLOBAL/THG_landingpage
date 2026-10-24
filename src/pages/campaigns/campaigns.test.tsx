import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import fixture from "@/lib/campaigns.fixture.json";
import { I18nProvider } from "@/lib/i18n";
import CampaignsPage from "./CampaignsPage";
import CampaignDetailPage from "./CampaignDetailPage";

vi.mock("@/components/Navbar", () => ({ default: () => <nav>TH Group</nav> }));
vi.mock("@/components/ScrollReveal", () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }));

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

function mount(path: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  client.setQueryData(["cms", "translations", "vi"], { translations: {} });
  client.setQueryData(["cms", "seo-pages"], { pages: [] });
  return render(
    <QueryClientProvider client={client}>
      <HelmetProvider>
        <I18nProvider>
          <MemoryRouter initialEntries={[path]}>
            <Routes>
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/campaigns/:slug" element={<CampaignDetailPage />} />
            </Routes>
          </MemoryRouter>
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
