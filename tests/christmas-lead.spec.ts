// Revenue path: a visitor on /vi/christmas asks about a product and the lead
// reaches the CMS. The expected request is derived from the CMS endpoint, not
// from the landing code: CMS_management- src/routes/api/v1/(public)/leads/index.ts
// (POST, JSON body, 201 { ok: true, id } / { error } on failure) validated by
// leadRequestBaseSchema + parseLeadRequest in src/features/leads/lead-request.ts
// (field names, enums, primary_service ∈ service_interests). If either file
// changes, re-derive LEAD_FIELDS / the enums below from it.
//
// Runs against `vite dev` with VITE_TURNSTILE_SITE_KEY unset, so the form uses
// the DEV_BYPASS captcha token; the POST is intercepted and never leaves.

import { expect, test, type Page, type Request } from "@playwright/test";

// leadRequestBaseSchema keys (lead-request.ts:61). zod strips anything else,
// so an unknown key would be silently lost by the CMS.
const LEAD_FIELDS = new Set([
  "name",
  "email",
  "company_url",
  "monthly_order_band",
  "ship_to_markets",
  "phone",
  "message",
  "source_page",
  "locale",
  "utm",
  "primary_service",
  "service_interests",
  "service_details",
  "surface",
  "turnstile_token",
]);
const SURFACE_KEYS = [
  "global-services-dialog",
  "fulfill-inline",
  "express-inline",
  "warehouse-inline",
  "dropship-inline",
  "home-conversion-inline",
];

async function openChristmas(page: Page, leadStatus: number, leadBody: unknown) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem("thg_lang", "vi");
    } catch {
      /* storage disabled */
    }
  });
  await page.route("**/api/v1/**", (route) => route.fulfill({ status: 503, contentType: "application/json", body: "{}" }));
  await page.route("**/api/v1/translations**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ locale: "vi", translations: {} }) }),
  );
  await page.route("**/api/v1/leads", (route) =>
    route.fulfill({ status: leadStatus, contentType: "application/json", body: JSON.stringify(leadBody) }),
  );
  await page.goto("/vi/christmas");
}

/** Consult on the Placemat card, then fill both steps and submit. */
async function submitPlacematLead(page: Page): Promise<Request> {
  await page.getByRole("button", { name: "Tư vấn sản phẩm Placemat" }).first().click();
  const dialog = page.getByRole("dialog", { name: "Liên hệ tư vấn" });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel(/Họ tên/).fill("Nguyễn Văn Seller");
  await dialog.getByLabel(/^Email/).fill("seller@example.com");
  await dialog.getByLabel(/Company \/ store URL/).fill("https://seller-shop.example");
  await expect(dialog.getByLabel(/Primary service/)).toHaveValue("fulfill");
  await dialog.getByLabel(/Monthly order volume/).selectOption("100_499");
  await dialog.getByRole("button", { name: "Continue" }).click();

  // Step 2: the product is already in the message.
  await expect(dialog.getByLabel(/Nhu cầu/)).toHaveValue("Bộ sưu tập Christmas 2026: Placemat");
  await dialog.getByLabel(/Điện thoại/).fill("0901 234 567");
  const posted = page.waitForRequest((req) => req.url().endsWith("/api/v1/leads") && req.method() === "POST");
  await dialog.getByRole("button", { name: "Gửi yêu cầu tư vấn" }).click();
  return posted;
}

test.describe("Christmas page lead capture", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("posts the lead the CMS endpoint expects, then shows success", async ({ page }) => {
    await openChristmas(page, 201, { ok: true, id: 501 });
    const request = await submitPlacematLead(page);

    expect(request.method()).toBe("POST");
    expect(request.headers()["content-type"]).toContain("application/json");
    const body = request.postDataJSON() as Record<string, unknown>;
    expect(Object.keys(body).filter((key) => !LEAD_FIELDS.has(key))).toEqual([]);
    expect(body).toMatchObject({
      name: "Nguyễn Văn Seller",
      email: "seller@example.com",
      company_url: "https://seller-shop.example",
      monthly_order_band: "100_499",
      ship_to_markets: ["US"],
      phone: "0901 234 567",
      message: "Bộ sưu tập Christmas 2026: Placemat",
      source_page: "/vi/christmas",
      locale: "vi",
      primary_service: "fulfill",
    });
    // parseLeadRequest: primary_service must be one of service_interests.
    expect(body.service_interests).toContain(body.primary_service);
    expect(SURFACE_KEYS).toContain(body.surface);
    expect(typeof body.turnstile_token).toBe("string");
    expect((body.turnstile_token as string).length).toBeGreaterThan(0);

    const dialog = page.getByRole("dialog", { name: "Liên hệ tư vấn" });
    await expect(dialog.getByText("Đã gửi yêu cầu thành công!")).toBeVisible();
    await expect(dialog).toContainText("seller@example.com");
  });

  test("a failed POST keeps the form open with the CMS error and no success state", async ({ page }) => {
    await openChristmas(page, 400, { error: "Email không hợp lệ" });
    await submitPlacematLead(page);

    await expect(page.getByText(/Email không hợp lệ/)).toBeVisible();
    const dialog = page.getByRole("dialog", { name: "Liên hệ tư vấn" });
    await expect(dialog.getByText("Đã gửi yêu cầu thành công!")).toHaveCount(0);
    // The visitor can retry: the filled message and the submit button remain.
    await expect(dialog.getByLabel(/Nhu cầu/)).toHaveValue("Bộ sưu tập Christmas 2026: Placemat");
    await expect(dialog.getByRole("button", { name: "Gửi yêu cầu tư vấn" })).toBeEnabled();
  });
});
