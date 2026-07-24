import { describe, it, expect, vi, beforeEach } from "vitest";

// Footer chrome (contact directory + floating links) reads with a shorter budget than page
// content, so a footer-only CMS stall cannot hold a whole route for the 8s content default.
// Mock the transport and assert the budget + single attempt without touching the network.
const { cmsFetch } = vi.hoisted(() => ({ cmsFetch: vi.fn() }));
vi.mock("@/shared/cms", () => ({ cmsFetch }));

import { loadContactLocations, loadSiteSettings } from "@/features/home/server/shell-loaders";
import { CmsNetworkError } from "@/shared/cms/errors";

const SHELL_TIMEOUT = 2500;

beforeEach(() => {
  cmsFetch.mockReset();
});

describe("shell loaders bound footer reads to a shorter timeout", () => {
  it("loadContactLocations reads with the shell budget and degrades to fallback rows", async () => {
    cmsFetch.mockRejectedValue(new CmsNetworkError("/contact-locations?lang=vi", "timeout"));
    const result = await loadContactLocations("vi");
    expect(cmsFetch).toHaveBeenCalledTimes(1); // no retry
    const [path, , opts] = cmsFetch.mock.calls[0];
    expect(path).toBe("/contact-locations?lang=vi");
    expect(opts).toMatchObject({ timeoutMs: SHELL_TIMEOUT });
    expect(result.status).toBe("unavailable");
    expect(result.locations.length).toBeGreaterThan(0); // verified static fallback, never "no offices"
  });

  it("loadSiteSettings reads with the shell budget and degrades to the empty model", async () => {
    cmsFetch.mockRejectedValue(new CmsNetworkError("/site-settings", "timeout"));
    const settings = await loadSiteSettings();
    expect(cmsFetch).toHaveBeenCalledTimes(1); // no retry
    const [path, , opts] = cmsFetch.mock.calls[0];
    expect(path).toBe("/site-settings");
    expect(opts).toMatchObject({ timeoutMs: SHELL_TIMEOUT });
    expect(settings.telUrl).toBeNull(); // all-null model hides the buttons
  });

  it("is tighter than the cmsFetch content default", async () => {
    const { DEFAULT_CMS_TIMEOUT_MS } = await import("@/shared/cms/cmsFetch");
    expect(SHELL_TIMEOUT).toBeLessThan(DEFAULT_CMS_TIMEOUT_MS);
  });
});
