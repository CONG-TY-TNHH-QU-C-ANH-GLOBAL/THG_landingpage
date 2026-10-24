import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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
  const view = render(
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
  return { client, ...view };
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

describe("Navbar featured campaign: loading and error states", () => {
  it("renders no pill, panel or mobile group while the request is pending", () => {
    vi.mocked(globalThis.fetch).mockReturnValue(new Promise<Response>(() => {}));
    mount(null);
    expect(document.getElementById("campaign-mega-menu")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.queryByRole("region", { name: /Christmas/ })).toBeNull();
    expect(screen.queryByRole("link", { name: /Christmas/ })).toBeNull();
  });

  it("renders no pill, panel or mobile group once the request has really failed", async () => {
    const { client } = mount(null);
    await waitFor(() => expect(client.getQueryState(["cms", "campaigns", "vi"])?.status).toBe("error"));
    expect(document.getElementById("campaign-mega-menu")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.queryByRole("region", { name: /Christmas/ })).toBeNull();
    // The static Programs entry stays available.
    expect(screen.getAllByRole("link", { name: /Chương trình/ })[0]).toHaveAttribute("href", "/vi/campaigns");
  });
});

describe("Navbar featured campaign: mobile group", () => {
  it("shows only the first featured campaign, its landing and prefixed menu items", () => {
    const second = { ...base[1], nav_featured: true, nav_label: "Black Friday" };
    mount([{ ...base[0], nav_featured: false }, second, { ...base[0], nav_label: "Later" }]);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const group = screen.getByRole("region", { name: "Black Friday" });
    expect(screen.queryByRole("region", { name: /Later|Christmas/ })).toBeNull();
    expect(within(group).getByRole("link", { name: /Black Friday/ })).toHaveAttribute(
      "href",
      "/vi/campaigns/black-friday-2026",
    );
    expect(within(group).getByRole("link", { name: /Hub/ })).toHaveAttribute("href", "https://hub.thgfulfill.com");
  });

  it("closes the mobile menu when a campaign link is used", () => {
    mount(base);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const group = screen.getByRole("region", { name: "Christmas" });
    expect(within(group).getByRole("link", { name: /Best Seller/ })).toHaveAttribute("href", "/vi/catalog/best-seller");
    fireEvent.click(within(group).getByRole("link", { name: /Best Seller/ }));
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("region", { name: "Christmas" })).toBeNull();
  });

  it("drops unsafe menu hrefs in both the mega-menu and the mobile group", () => {
    const hostile = {
      ...base[0],
      menu_items: [
        { icon: "x", title: "Evil JS", subtitle: null, href: " JAVASCRIPT:alert(1)" },
        { icon: "x", title: "Evil data", subtitle: null, href: "data:text/html,<b>x</b>" },
        { icon: "x", title: "Evil proto", subtitle: null, href: "//evil.example" },
        { icon: "🎁", title: "Gifts", subtitle: null, href: "/catalog/christmas" },
      ],
    };
    mount([hostile]);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.queryAllByText(/Evil/)).toHaveLength(0);
    expect(screen.getAllByRole("link", { name: /Gifts/ }).map((a) => a.getAttribute("href"))).toEqual([
      "/vi/catalog/christmas",
      "/vi/catalog/christmas",
    ]);
  });
});
