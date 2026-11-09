import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { I18nProvider } from "@/lib/i18n";
import MonthlySourcingPage from "./MonthlySourcingPage";

vi.mock("@/components/lead/LeadFormDialog", () => ({ LeadFormDialog: () => null }));
vi.mock("@/components/ContactSection", () => ({ default: () => null }));

const month = {
  year: 2026,
  month: 10,
  slug: "thang-10-2026",
  title: "Top sản phẩm & nguồn hàng tháng 10/2026",
  pdf_url: "https://cms.test/api/v1/media/monthly-sourcing%2Foct.pdf",
  pages: [1, 2, 3].map((n) => ({
    url: `https://cms.test/api/v1/media/monthly-sourcing-page%2Fp-${n}.webp`,
    width: 1200,
    height: 1697,
  })),
};

function mount(data: unknown) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  client.setQueryData(["cms", "translations", "vi"], { translations: {} });
  client.setQueryData(["cms", "campaigns", "vi"], { locale: "vi", campaigns: [] });
  client.setQueryData(["cms", "monthly-sourcing"], { year: null, months: [] });
  if (data) client.setQueryData(["cms", "monthly-sourcing", "thang-10-2026"], data);
  return render(
    <QueryClientProvider client={client}>
      <HelmetProvider>
        <I18nProvider>
          <MemoryRouter initialEntries={["/vi/top-nguon-hang/thang-10-2026"]}>
            <Routes>
              <Route path="/:lang/top-nguon-hang/:slug" element={<MonthlySourcingPage />} />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      </HelmetProvider>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("offline"));
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("monthly sourcing page", () => {
  it("shows the report as a vertical scroll of page images with the first one prioritised", () => {
    mount(month);
    expect(screen.getByRole("heading", { level: 1, name: month.title })).toBeInTheDocument();
    const images = screen.getAllByRole("img", { name: /Trang \d \/ 3/ });
    expect(images).toHaveLength(3);
    expect(images[0]).toHaveAttribute("fetchpriority", "high");
    expect(images[0]).toHaveAttribute("loading", "eager");
    expect(images[2]).toHaveAttribute("loading", "lazy");
    expect(images[0]).toHaveAttribute("width", "1200");
    expect(screen.getByRole("link", { name: /Mở \/ tải PDF/ })).toHaveAttribute("href", month.pdf_url);
  });

  it("falls back to the PDF link while page images are not generated yet", () => {
    mount({ ...month, pages: [] });
    expect(screen.queryAllByRole("img", { name: /Trang/ })).toHaveLength(0);
    expect(screen.getByText(/Bản xem nhanh đang được chuẩn bị/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Mở \/ tải PDF/ })).toBeInTheDocument();
  });
});
