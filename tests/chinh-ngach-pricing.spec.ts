import { expect, test, type Page } from "@playwright/test";

const tables: Record<string, { name: string; description: string; data: unknown[] }> = {
  chinhNgachMatsonLcl: {
    name: "Chính ngạch MATSON — Sea LCL",
    description: "MATSON CLX/MAX · VN → Long Beach, CA",
    data: [{ origin: "Hồ Chí Minh (HCM)", light_cbm: 155, dense_mt: 177, destination: "Long Beach, CA", transit: "17–18 ngày" }],
  },
  chinhNgachMatsonSurcharge: {
    name: "Chính ngạch MATSON — Phụ phí cảng",
    description: "Accessorial charges",
    data: [{ fee: "Handling Charge", amount: 84, unit: "/ HBL", min: "" }],
  },
  chinhNgachMatsonFcl: {
    name: "Chính ngạch MATSON — Sea FCL",
    description: "FCL",
    data: [{ service: "CLX", origin: "Hải Phòng → Houston, TX", charge: "Total", d20: 11340, d40: 14050, d40h: 15326, d45h: 16901, transit: "25–26 ngày" }],
  },
  chinhNgachSeaLcl: {
    name: "Chính ngạch Sea thường — LCL (W/M)",
    description: "1 WM = 1 CBM hoặc 1.000 kg",
    data: [{ route: "HCM → Los Angeles, CA", price_wm: 78, transit: "18–25 ngày" }],
  },
  chinhNgachSeaFcl: {
    name: "Chính ngạch Sea thường — FCL",
    description: "Cước biển trọn container",
    data: [{ route: "HCM → Los Angeles, CA", gp20: 3640, hc40: 5264, transit: "18–25 ngày" }],
  },
  chinhNgachAir: {
    name: "Chính ngạch Air — SGN → US",
    description: "Cartons only",
    data: [{ destination: "LAX", carrier: "ANA (NH)", price_500kg: 6.05, price_1000kg: 5.99, cutoff: "22:00", routing: "SGN → NRT → LAX" }],
  },
  chinhNgachCustoms: {
    name: "Chính ngạch — Khai báo hải quan xuất VN",
    description: "Chưa gồm VAT 8%",
    data: [{ lane: "Luồng Xanh", fee: 62, note: "+ VAT 8%" }],
  },
};

const columns: Record<string, unknown[]> = {
  chinhNgachMatsonLcl: ["origin", "light_cbm", "dense_mt", "destination", "transit"],
  chinhNgachMatsonSurcharge: ["fee", "amount", "unit", "min"],
  chinhNgachMatsonFcl: ["service", "origin", "charge", "d20", "d40", "d40h", "d45h", "transit"],
  chinhNgachSeaLcl: ["route", "price_wm", "transit"],
  chinhNgachSeaFcl: ["route", "gp20", "hc40", "transit"],
  chinhNgachAir: ["destination", "carrier", "price_500kg", "price_1000kg", "cutoff", "routing"],
  chinhNgachCustoms: ["lane", "fee", "note"],
};

async function stubCms(page: Page) {
  await page.route("**/api/v1/translations**", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ locale: "vi", translations: {} }),
  }));

  await page.route("**/api/v1/pricing/**", (route) => {
    const slug = decodeURIComponent(new URL(route.request().url()).pathname.split("/").pop() ?? "");
    if (slug === "chinhNgachMeta") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ table: { id: 8, slug, name: "Meta", kind: "meta_kv", description: null, schema: {}, data: {}, version: 1, status: "live", updated_at: 1 } }),
      });
    }
    const fixture = tables[slug];
    const schemaColumns = (columns[slug] ?? []).map((code, index) => ({
      code,
      label: String(code),
      position: index,
      type: String(code).includes("price") || ["amount", "fee", "d20", "d40", "d40h", "d45h", "gp20", "hc40", "light_cbm", "dense_mt"].includes(String(code)) ? "currency" : "text",
      semantic: String(code).includes("price") || ["amount", "fee", "d20", "d40", "d40h", "d45h", "gp20", "hc40", "light_cbm", "dense_mt"].includes(String(code)) ? "money_usd" : undefined,
      currency: "USD",
    }));
    return route.fulfill({
      status: fixture ? 200 : 404,
      contentType: "application/json",
      body: JSON.stringify(fixture ? { table: { id: 1, slug, name: fixture.name, kind: "weight_grid", description: fixture.description, schema: { columns: schemaColumns }, data: fixture.data, version: 1, status: "live", updated_at: 1 } } : { error: "not found" }),
    });
  });
}

test.describe("Formal pricing workspace", () => {
  test.beforeEach(async ({ page }) => {
    await stubCms(page);
    await page.goto("/vi/chinh-ngach-pricing");
  });

  test("lays rates out as the source sheet and exposes the guide and worked quotations", async ({ page }) => {
    await expect(page.getByRole("tab", { name: "Hướng dẫn đọc bảng giá" })).toBeVisible();

    // Rates follow the source sheet: one scroll with MATSON, Sea and Air strips,
    // figures read from the CMS rate cards.
    const rates = page.locator("#formal-panel-rates");
    await expect(rates.getByText("🚢 MATSON — Line Hỏa Tốc")).toBeVisible();
    await expect(rates.getByText("🌊 Line Sea Chính Ngạch Thường")).toBeVisible();
    await expect(rates.getByText("✈️ Air Chính Ngạch")).toBeVisible();
    await expect(rates.getByText("~$155", { exact: true })).toBeVisible();
    await expect(rates.getByRole("row", { name: /Tổng cước/ })).toContainText("~$11,340");
    await expect(rates.getByText("~$62", { exact: true })).toBeVisible();

    // Reading guide follows the source sheet: numbered banners, LCL vs FCL,
    // and a cross-reference that switches to the estimate view in place.
    await page.getByRole("tab", { name: "Hướng dẫn đọc bảng giá" }).click();
    await expect(page.getByText("Vận chuyển chính ngạch là gì?")).toBeVisible();
    await expect(page.getByText("LCL — Hàng lẻ")).toBeVisible();
    await page.getByRole("button", { name: "Xem tab Dự toán chi phí →" }).click();

    // Cost estimate is the sheet's four worked quotations, grouped by origin.
    const estimate = page.locator("#formal-panel-estimate");
    await expect(estimate.getByText("MATSON CLX · DDP · HPH → HOU")).toBeVisible();
    await expect(estimate.getByText("~6,584")).toBeVisible();
    await estimate.getByRole("tab", { name: /20DC\s*ZIM · HPH/ }).click();
    await expect(estimate.getByText("ZIM · DDP · HPH → LAX → HOU", { exact: true })).toBeVisible();
    await expect(estimate.getByText("~18,572")).toBeVisible();

    await page.screenshot({ path: "test-results/chinh-ngach-desktop.png", fullPage: false });
  });

  test("fits the workspace on a 375px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    // The rate sheet's wide tables must scroll inside their cards on a phone.
    await expect(page.locator("#formal-panel-rates").getByText("~$155", { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);

    await page.getByRole("tab", { name: "Dự toán chi phí" }).click();
    // The cost table is wider than a phone; it must scroll inside its own box,
    // never push the page sideways.
    await expect(page.locator("#formal-panel-estimate").getByText("MATSON CLX · DDP · HPH → HOU")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.screenshot({ path: "test-results/chinh-ngach-mobile.png", fullPage: false });
  });
});
