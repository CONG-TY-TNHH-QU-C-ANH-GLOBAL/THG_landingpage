import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it } from "vitest";

import { USPS_GA_LABEL_RATES_SNAPSHOT } from "@/data/uspsGaLabelRates";
import { I18nProvider } from "@/lib/i18n";
import { UspsGaTierTable } from "./UspsGaTierTable";

afterEach(cleanup);

function mount() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  client.setQueryData(["cms", "translations", "vi"], { translations: {} });
  return render(
    <QueryClientProvider client={client}>
      <I18nProvider>
        <UspsGaTierTable tiers={USPS_GA_LABEL_RATES_SNAPSHOT.map((t) => [...t])} />
      </I18nProvider>
    </QueryClientProvider>,
  );
}

describe("UspsGaTierTable", () => {
  it("lays each tier out like the workbook", () => {
    mount();
    const panel = screen.getByRole("tabpanel", { name: "Tier 1" });
    expect(within(panel).getByRole("heading")).toHaveTextContent(
      "Bảng giá USPS Ground Advantage – TH Group – Tier 1",
    );
    expect(panel).toHaveTextContent("Áp dụng cho sản lượng Dưới 1.000 label/tháng · Đơn vị: USD/label");
    const headers = within(panel).getAllByRole("columnheader").map((h) => h.textContent);
    expect(headers).toEqual([
      "STT",
      "Cân nặng không quá (ounce)",
      "Gram",
      ...Array.from({ length: 9 }, (_, i) => `Zone ${i + 1}`),
    ]);
    const rows = within(panel).getAllByRole("row").slice(1);
    expect(rows).toHaveLength(24);
    expect(within(rows[0]).getAllByRole("cell").map((c) => c.textContent)).toEqual([
      "1", "4 oz", "113", "4.49", "4.56", "4.59", "4.73", "4.82", "5.00", "5.09", "5.32", "7.48",
    ]);
    expect(within(rows[3]).getAllByRole("cell")[1]).toHaveTextContent("15.999 oz");
    expect(within(rows[23]).getAllByRole("cell").at(-1)).toHaveTextContent("47.29");
  });

  it("keeps all five tiers in the DOM and switches the visible one by tab", () => {
    mount();
    const panels = screen.getAllByRole("tabpanel", { hidden: true });
    expect(panels).toHaveLength(5);
    expect(panels.filter((p) => !p.hidden)).toHaveLength(1);
    expect(screen.queryByText(/\d%/)).toBeNull();

    fireEvent.click(screen.getByRole("tab", { name: "Tier 5" }));
    expect(screen.getByRole("tab", { name: "Tier 5" })).toHaveAttribute("aria-selected", "true");
    const t5 = screen.getByRole("tabpanel", { name: "Tier 5" });
    expect(t5).toHaveTextContent("Từ 10.000 label/tháng");
    expect(panels[0].hidden).toBe(true);
  });
});
