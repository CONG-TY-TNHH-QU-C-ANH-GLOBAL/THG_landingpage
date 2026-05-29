// Self-contained Playwright config used by `bun run test:e2e`. The existing
// `playwright.config.ts` is kept intact for the Lovable agent harness.

import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 5173);
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  // Generous on CI: the webServer is `vite dev`, which compiles each route's
  // module graph ON FIRST REQUEST. On a cold/slow CI runner the first
  // navigation (lazy Index chunk + i18n + deps) can take well over the old 30s,
  // so the navbar CTA isn't mounted yet when the test clicks it (passes locally
  // in ~23s on a fast machine). Larger budget absorbs that cold-compile.
  timeout: process.env.CI ? 90_000 : 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    navigationTimeout: process.env.CI ? 60_000 : 30_000,
    // No actionTimeout cap — the button-click auto-wait should be able to use
    // the full per-test budget while the cold lazy chunk compiles on CI.
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "bun run dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    // Force English locale so test text-matching is stable across CI/dev.
    env: { VITE_CMS_API_URL: "http://localhost:8080/api/v1" },
  },
});
