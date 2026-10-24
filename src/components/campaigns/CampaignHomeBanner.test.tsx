import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { campaignsResponseSchema, type Campaign } from "@/lib/campaigns";
import fixture from "@/lib/campaigns.fixture.json";
import { I18nProvider } from "@/lib/i18n";
import { CampaignHomeBanner } from "./CampaignHomeBanner";

const base = campaignsResponseSchema.parse(fixture).campaigns;
const KEY = ["cms", "campaigns", "vi"];

function mount(campaigns: Campaign[] | null) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  client.setQueryData(["cms", "translations", "vi"], { translations: {} });
  if (campaigns) client.setQueryData(KEY, { locale: "vi", campaigns });
  const view = render(
    <QueryClientProvider client={client}>
      <I18nProvider>
        <MemoryRouter initialEntries={["/vi"]}>
          <CampaignHomeBanner />
        </MemoryRouter>
      </I18nProvider>
    </QueryClientProvider>,
  );
  return { client, ...view };
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("CampaignHomeBanner", () => {
  it("renders the first home_featured campaign with its landing CTA and dates", () => {
    const second = { ...base[1], home_featured: true, title: "Black Friday 2026" };
    mount([{ ...base[0], home_featured: false, title: "Not on home" }, second, { ...base[0], title: "Later" }]);
    const banner = screen.getByRole("region", { name: "Black Friday 2026" });
    expect(screen.queryByRole("region", { name: "Not on home" })).toBeNull();
    expect(screen.queryByRole("region", { name: "Later" })).toBeNull();
    // black-friday has no landing_path → detail page; no cta_label → default copy.
    expect(within(banner).getByRole("link", { name: /Xem chương trình/ })).toHaveAttribute(
      "href",
      "/vi/campaigns/black-friday-2026",
    );
    expect(banner).toHaveTextContent("20/11/2026 – 30/11/2026");
  });

  it("renders nothing when no campaign is home_featured (even if one is nav_featured)", () => {
    const { container } = mount(base.map((c) => ({ ...c, home_featured: false, nav_featured: true })));
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing while the request is pending", () => {
    vi.spyOn(globalThis, "fetch").mockReturnValue(new Promise<Response>(() => {}));
    const { container } = mount(null);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing after the request has actually failed", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("offline"));
    const { client, container } = mount(null);
    await waitFor(() => expect(client.getQueryState(KEY)?.status).toBe("error"));
    expect(fetchSpy).toHaveBeenCalled();
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing after a 500 from the CMS", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 500 }));
    const { client, container } = mount(null);
    await waitFor(() => expect(client.getQueryState(KEY)?.status).toBe("error"));
    expect(container).toBeEmptyDOMElement();
  });

  it("drops menu items with unsafe hrefs and prefixes internal ones", () => {
    const campaign = {
      ...base[0],
      menu_items: [
        { icon: "💀", title: "Evil JS", subtitle: null, href: " JAVASCRIPT:alert(1)" },
        { icon: "💀", title: "Evil proto", subtitle: null, href: "//evil.example" },
        { icon: "💀", title: "Evil http", subtitle: null, href: "http://evil.example" },
        { icon: "🎁", title: "Gifts", subtitle: null, href: "/catalog/christmas" },
        { icon: "🛒", title: "Hub", subtitle: null, href: "https://hub.thgfulfill.com/deals" },
      ],
    };
    mount([campaign]);
    const banner = screen.getByRole("region", { name: campaign.title });
    expect(within(banner).queryByText(/Evil/)).toBeNull();
    expect(within(banner).getByRole("link", { name: /Gifts/ })).toHaveAttribute("href", "/vi/catalog/christmas");
    expect(within(banner).getByRole("link", { name: /Hub/ })).toHaveAttribute("href", "https://hub.thgfulfill.com/deals");
    for (const a of within(banner).getAllByRole("link")) {
      expect(a.getAttribute("href")).toMatch(/^(\/vi\/|https:\/\/)/);
    }
  });
});
