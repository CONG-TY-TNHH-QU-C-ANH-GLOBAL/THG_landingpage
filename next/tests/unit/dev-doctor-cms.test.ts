import { describe, it, expect } from "vitest";

import { checkCmsReachable } from "../../scripts/dev-lib.mjs";

// dev:doctor reachability signal (ops/DEV-RUNTIME.md). Read-only: one GET, bounded timeout,
// no retries, no credentials. A configured-but-down origin is reported, never a failure — so
// the probe injects fetchImpl for determinism and never touches the network here.

describe("checkCmsReachable (dev:doctor)", () => {
  it("reports reachable on a 2xx and surfaces the status", async () => {
    const fetchImpl = async () => ({ ok: true, status: 200 }) as Response;
    await expect(checkCmsReachable({ fetchImpl })).resolves.toEqual({ reachable: true, status: 200 });
  });

  it("reports unreachable (not reachable) on a non-2xx, without throwing", async () => {
    const fetchImpl = async () => ({ ok: false, status: 503 }) as Response;
    await expect(checkCmsReachable({ fetchImpl })).resolves.toEqual({ reachable: false, status: 503 });
  });

  it("classifies a connection failure as unreachable", async () => {
    const fetchImpl = async () => {
      throw Object.assign(new Error("connect ECONNREFUSED"), { name: "TypeError" });
    };
    await expect(checkCmsReachable({ fetchImpl })).resolves.toEqual({
      reachable: false,
      error: "unreachable",
    });
  });

  it("classifies an abort/timeout distinctly", async () => {
    const fetchImpl = async () => {
      throw Object.assign(new Error("timed out"), { name: "TimeoutError" });
    };
    await expect(checkCmsReachable({ fetchImpl })).resolves.toEqual({
      reachable: false,
      error: "timeout",
    });
  });

  it("makes exactly one request — no retry", async () => {
    let calls = 0;
    const fetchImpl = async () => {
      calls += 1;
      throw new Error("down");
    };
    await checkCmsReachable({ fetchImpl });
    expect(calls).toBe(1);
  });
});
