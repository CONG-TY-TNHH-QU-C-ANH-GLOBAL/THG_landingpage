import { describe, it, expect, vi, afterEach } from "vitest";

import { cmsOrigin, mb, cacheState, APP_ROOT } from "../../scripts/dev-lib.mjs";

// Focused checks for the pure dev-tool helpers (dev:doctor / dev:clean). Process enumeration
// and disk stats are exercised by the real script runs (proven in the PR), not unit-mocked.

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("cmsOrigin", () => {
  it("reports the host of CMS_API_URL (never a secret — the base is public)", () => {
    vi.stubEnv("CMS_API_URL", "https://cms.thgfulfill.com/api/v1");
    expect(cmsOrigin()).toBe("cms.thgfulfill.com");
  });

  it("falls back to NEXT_PUBLIC_CMS_API_URL, then the localhost dev default", () => {
    vi.stubEnv("CMS_API_URL", "");
    vi.stubEnv("NEXT_PUBLIC_CMS_API_URL", "https://staging.example.com/api/v1");
    expect(cmsOrigin()).toBe("staging.example.com");
    vi.stubEnv("NEXT_PUBLIC_CMS_API_URL", "");
    expect(cmsOrigin()).toBe("localhost:8080");
  });

  it("reports <invalid> for an unparseable value instead of throwing", () => {
    vi.stubEnv("CMS_API_URL", "not a url");
    expect(cmsOrigin()).toBe("<invalid>");
  });
});

describe("mb", () => {
  it("rounds bytes to whole megabytes", () => {
    expect(mb(0)).toBe(0);
    expect(mb(1_500_000)).toBe(2);
    expect(mb(15_988_552)).toBe(16);
  });
});

describe("cacheState", () => {
  it("returns the app .next / turbopack shape without throwing", () => {
    const s = cacheState();
    expect(typeof s.dotNextPresent).toBe("boolean");
    expect(typeof s.turbo.sst).toBe("number");
    expect(typeof s.turbo.bytes).toBe("number");
    expect(APP_ROOT.replace(/\\/g, "/")).toMatch(/\/next$/);
  });
});
