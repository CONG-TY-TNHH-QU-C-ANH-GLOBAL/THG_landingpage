import { expect, test, type Page } from "@playwright/test";

import { USPS_GA_LABEL_RATES_SNAPSHOT } from "../src/data/uspsGaLabelRates";

// Tier 1 as the CMS would serve it after an upload: the first cell differs from
// the bundled snapshot (4.49), so the test can tell CMS data from the fallback.
const cmsTiers = USPS_GA_LABEL_RATES_SNAPSHOT.map((tier, t) =>
  tier.map((row, i) => (t === 0 && i === 0 ? { ...row, z1: 9.99 } : row)),
);

async function stubCms(page: Page, { pricingDown = false } = {}) {
  await page.route("**/api/v1/translations**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ locale: "vi", translations: {} }) }),
  );
  await page.route("**/api/v1/pricing", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ categories: [] }) }),
  );
  await page.route("**/api/v1/pricing/**", (route) => {
    const slug = decodeURIComponent(new URL(route.request().url()).pathname.split("/").pop() ?? "");
    const tier = /^uspsGaLabelT([1-5])$/.exec(slug);
    if (pricingDown || !tier) return route.fulfill({ status: 500, body: "down" });
    const n = Number(tier[1]);
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        table: {
          id: 8 + n, slug, name: `USPS Ground Advantage Label — Tier ${n}`, kind: "weight_grid",
          description: null, schema: { columns: [] }, data: cmsTiers[n - 1], version: 1, status: "live", updated_at: 1,
        },
      }),
    });
  });
}

test.describe("USPS Ground Advantage label rate card", () => {
  test("/vi/thg-label#pricing shows the five tiers like the workbook, from the CMS", async ({ page }) => {
    await stubCms(page);
    await page.goto("/vi/thg-label#pricing");
    const section = page.locator("#pricing");

    await expect(section.getByRole("tab")).toHaveText(["Tier 1", "Tier 2", "Tier 3", "Tier 4", "Tier 5"]);
    const t1 = section.getByRole("tabpanel", { name: "Tier 1" });
    await expect(t1.getByRole("heading")).toHaveText("Bảng giá USPS Ground Advantage – THG Fulfillment – Tier 1");
    await expect(t1).toContainText("Áp dụng cho sản lượng Dưới 1.000 label/tháng · Đơn vị: USD/label");
    await expect(t1.getByRole("row")).toHaveCount(25);
    await expect(t1.getByRole("row").nth(1)).toContainText("9.99");
    await expect(t1.getByRole("row").nth(24)).toContainText("47.29");
    await expect(section.getByText(/^\d%$/)).toHaveCount(0);

    await section.getByRole("tab", { name: "Tier 3" }).click();
    const t3 = section.getByRole("tabpanel", { name: "Tier 3" });
    await expect(t3).toBeVisible();
    await expect(t3).toContainText("3.000 – 5.000 label/tháng");
    await expect(t1).toBeHidden();
    await expect(section.getByRole("button", { name: "Nhận báo giá" })).toBeVisible();
  });

  test("falls back to the bundled rates when the CMS is down", async ({ page }) => {
    await stubCms(page, { pricingDown: true });
    await page.goto("/vi/thg-label#pricing");
    const t1 = page.locator("#pricing").getByRole("tabpanel", { name: "Tier 1" });
    await expect(t1.getByRole("row").nth(1)).toContainText("4.49");
  });

  test("/vi/domestic-pricing uses Tier 1 with Zone 9", async ({ page }) => {
    await stubCms(page);
    await page.goto("/vi/domestic-pricing#rate-table");
    const table = page.locator("#rate-table table").first();
    await expect(table.getByRole("columnheader", { name: "Zone 9" })).toBeAttached();
    await expect(table.getByRole("row").nth(1)).toContainText("9.99");
    await expect(table.getByRole("row").nth(1)).toContainText("7.48");
  });
});
