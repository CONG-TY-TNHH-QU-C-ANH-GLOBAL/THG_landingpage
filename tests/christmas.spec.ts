import { expect, test, type Page } from "@playwright/test";

// The Christmas page is static (src/data/christmas.json); the CMS only supplies
// optional translation overrides and the shared shell, so answer it as offline.
async function stubCms(page: Page) {
  await page.route("**/api/v1/**", (route) => route.fulfill({ status: 503, contentType: "application/json", body: "{}" }));
  // Registered last, so it takes precedence over the catch-all.
  await page.route("**/api/v1/translations**", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ locale: "vi", translations: {} }),
  }));
}

/** Scroll each rendered photo into view and wait for it to load or fail, as a
 *  reader scrolling the page would. Photos with no layout box (a hot pick that
 *  is display:none on phones) are never requested by a lazy <img>, so skip them. */
async function loadAllImages(page: Page) {
  await page.evaluate(async () => {
    const shown = () => [...document.querySelectorAll<HTMLImageElement>(".xmas img")].filter((img) => img.getClientRects().length > 0);
    for (const img of shown()) {
      if (!img.isConnected || img.complete) continue;
      img.scrollIntoView({ block: "center" });
      await new Promise<void>((done) => {
        const timer = setTimeout(done, 8000);
        const finish = () => { clearTimeout(timer); done(); };
        img.addEventListener("load", finish, { once: true });
        img.addEventListener("error", finish, { once: true });
      });
    }
    window.scrollTo(0, 0);
  });
}

test.describe("Christmas page on a 375px phone", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("has no horizontal scroll and no broken images", async ({ page }) => {
    await stubCms(page);
    await page.goto("/vi/christmas");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Christmas");
    await loadAllImages(page);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);

    // .xmas clips overflow-x, so also check nothing readable is cut off at the edges.
    // Ribbons, the sub-nav links and the category tabs scroll sideways on purpose.
    const cutOff = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>(".xmas :is(h1, h2, h3, p, li, a, button, .price)")]
        .filter((el) => !el.closest(".ribbons, .subnav-links, .tabs") && el.getClientRects().length > 0)
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.left < -1 || r.right > window.innerWidth + 1;
        })
        .map((el) => `${el.tagName.toLowerCase()}.${el.className}: ${el.textContent?.trim().slice(0, 40)}`),
    );
    expect(cutOff).toEqual([]);

    // No broken-image glyphs: every <img> left in the DOM decoded.
    const broken = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLImageElement>(".xmas img")]
        .filter((img) => img.getClientRects().length > 0 && !(img.complete && img.naturalWidth > 0))
        .map((img) => img.getAttribute("src")),
    );
    expect(broken).toEqual([]);

    // The supplied product photos really show (not stuck behind the fallback).
    await expect(page.locator("#xmas-products img.is-loaded")).toHaveCount(20);
    // The two pending assets fall back without a broken-image glyph.
    await expect(page.locator('img[src="/christmas/products/ornament-bell.jpg"]')).toHaveCount(0);
    await expect(page.locator('img[src="/christmas/hero-christmas-market-navy.jpg"]')).toHaveCount(0);
  });

  test("reduced motion: no snowflakes", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    await stubCms(page);
    await page.goto("/vi/christmas");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator(".hero .flake")).toHaveCount(0);
    await context.close();
  });
});
