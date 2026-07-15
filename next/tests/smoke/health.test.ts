import { describe, it, expect } from "vitest";
import { GET } from "../../src/app/api/health/route";

describe("/api/health", () => {
  it("returns the exact foundation health contract, uncached", async () => {
    const res = GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    const body = await res.json();
    expect(body).toEqual({ status: "ok", service: "thg-public-web", runtime: "next" });
  });
});
