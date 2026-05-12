// E2E smoke for the homepage Lead Form modal (P0 conversion path).
// Runs against `bun run dev` with VITE_TURNSTILE_SITE_KEY unset, so the
// Turnstile widget is skipped and the form posts the DEV_BYPASS token —
// which we intercept and assert against, never letting it leave the browser.

import { expect, test } from "@playwright/test";

test.describe("Lead form modal", () => {
  test.beforeEach(async ({ page }) => {
    // Ignore the page's first-visit language detector and force English so the
    // visible button text is stable. localStorage is set before any script runs.
    await page.addInitScript(() => {
      try {
        localStorage.setItem("thg_lang", "en");
      } catch {
        /* ignore — incognito with storage disabled */
      }
    });

    // Stub the CMS lead endpoint so the test never hits a real backend.
    await page.route("**/api/v1/leads", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, id: 42 }),
      });
    });

    // Stub translations + homepage so the test doesn't fail when the CMS is down.
    await page.route("**/api/v1/translations**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ locale: "en", translations: {} }),
      }),
    );
    await page.route("**/api/v1/homepage**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ locale: "en", blocks: [] }),
      }),
    );

    await page.goto("/");
  });

  test("submits a valid lead and shows the success state", async ({ page }) => {
    // Open the modal from the desktop navbar CTA. The button label comes from
    // `nav.consult` — "Get Started" in English.
    await page.getByRole("button", { name: /Get Started/i }).first().click();

    // Scope by name to disambiguate from the cookie-consent dialog also on page.
    const dialog = page.getByRole("dialog", { name: /Talk to us/i });
    await expect(dialog).toBeVisible();

    // Capture the outbound POST so we can assert against its body.
    const postPromise = page.waitForRequest(
      (req) => req.url().includes("/api/v1/leads") && req.method() === "POST",
    );

    await dialog.getByLabel(/Full name/i).fill("Jane Tester");
    await dialog.getByLabel(/^Email/i).fill("jane@example.com");
    await dialog.getByLabel(/Phone/i).fill("+1 415 555 0102");
    await dialog.getByLabel(/Your needs/i).fill("Need 200 orders/day fulfilled.");
    await dialog.getByRole("button", { name: /Send consultation request/i }).click();

    const req = await postPromise;
    const payload = req.postDataJSON() as Record<string, unknown>;
    expect(payload.name).toBe("Jane Tester");
    expect(payload.email).toBe("jane@example.com");
    // DEV_BYPASS is acceptable only because VITE_TURNSTILE_SITE_KEY is empty.
    // CI runs that set the env var should see a real captcha token here.
    expect(payload.turnstile_token).toBeTruthy();

    await expect(dialog.getByText(/Request received successfully/i)).toBeVisible();
  });

  test("blocks submit when name or email is empty", async ({ page }) => {
    await page.getByRole("button", { name: /Get Started/i }).first().click();
    const dialog = page.getByRole("dialog", { name: /Talk to us/i });
    await expect(dialog).toBeVisible();

    // Bypass the native `required` so we can hit the JS validation path the
    // production component uses (toast error, no network call).
    await dialog
      .getByLabel(/Full name/i)
      .evaluate((el: HTMLInputElement) => (el.removeAttribute("required")));
    await dialog
      .getByLabel(/^Email/i)
      .evaluate((el: HTMLInputElement) => (el.removeAttribute("required")));

    let leadCalled = false;
    await page.route("**/api/v1/leads", async (route) => {
      leadCalled = true;
      await route.fulfill({ status: 200, body: "{}" });
    });

    await dialog.getByRole("button", { name: /Send consultation request/i }).click();

    // The toast appears outside the dialog — sonner mounts at the document root.
    await expect(page.getByText(/Please fill in your name and email/i)).toBeVisible();
    expect(leadCalled).toBe(false);
  });
});
