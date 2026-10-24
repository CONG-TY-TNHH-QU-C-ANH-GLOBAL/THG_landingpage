import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { campaignsResponseSchema, type Campaign } from "@/lib/campaigns";
import fixture from "@/lib/campaigns.fixture.json";
import { I18nProvider } from "@/lib/i18n";
import Navbar from "./Navbar";

vi.mock("@/components/lead/LeadFormDialog", () => ({ LeadFormDialog: () => null }));

const base = campaignsResponseSchema.parse(fixture).campaigns;

function mount(campaigns: Campaign[] | null) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  client.setQueryData(["cms", "translations", "vi"], { translations: {} });
  if (campaigns) client.setQueryData(["cms", "campaigns", "vi"], { locale: "vi", campaigns });
  return render(
    <QueryClientProvider client={client}>
      <HelmetProvider>
        <I18nProvider>
          <MemoryRouter initialEntries={["/vi"]}>
            <Navbar />
          </MemoryRouter>
        </I18nProvider>
      </HelmetProvider>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  // Uncached queries (campaigns when not seeded) must fail silently.
  vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("offline"));
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Navbar Event dropdown", () => {
  it("lists Events and the new Programs item", () => {
    mount(null);
    const link = screen.getAllByRole("link", { name: /Chương trình/ })[0];
    expect(link).toHaveAttribute("href", "/vi/campaigns");
    expect(screen.getAllByRole("link", { name: /^Event/ })[0]).toHaveAttribute("href", "/vi/events");
  });
});

describe("Navbar featured campaign", () => {
  it("renders nothing extra when no campaign is nav_featured", () => {
    mount(base.map((c) => ({ ...c, nav_featured: false })));
    expect(screen.queryByRole("link", { name: /Christmas/ })).toBeNull();
  });

  it("renders nothing extra when the API fails", async () => {
    mount(null);
    await Promise.resolve();
    expect(screen.queryByRole("link", { name: /Christmas/ })).toBeNull();
  });

  it("shows only the first featured campaign, linking to its internal landing", () => {
    const second = { ...base[1], nav_featured: true, nav_label: "Black Friday" };
    mount([base[0], second]);
    const trigger = screen.getByRole("link", { name: /Christmas\s*NEW/ });
    expect(trigger).toHaveAttribute("href", "/vi/christmas");
    expect(screen.queryByRole("link", { name: /Black Friday/ })).toBeNull();
  });

  it("opens the mega-menu on focus, closes on Escape, prefixes internal menu hrefs", () => {
    mount(base);
    const trigger = screen.getByRole("link", { name: /Christmas\s*NEW/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.focus(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const menu = screen.getByRole("navigation", { name: "Danh mục chương trình" });
    expect(within(menu).getByRole("link", { name: /Best Seller/ })).toHaveAttribute("href", "/vi/catalog/best-seller");
    expect(within(menu).getByRole("link", { name: /Special Offers/ })).toHaveAttribute("href", "/vi/christmas#hot");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps absolute https hrefs as plain links and falls back to the detail page", () => {
    const external = {
      ...base[1],
      nav_featured: true,
      nav_label: "Black Friday",
      menu_items: [{ icon: "🛒", title: "Hub", subtitle: null, href: "https://hub.thgfulfill.com/deals" }],
    };
    mount([external]);
    const trigger = screen.getByRole("link", { name: "Black Friday" });
    expect(trigger).toHaveAttribute("href", "/vi/campaigns/black-friday-2026");
    const menu = screen.getByRole("navigation", { name: "Danh mục chương trình" });
    expect(within(menu).getByRole("link", { name: /Hub/ })).toHaveAttribute("href", "https://hub.thgfulfill.com/deals");
  });
});
