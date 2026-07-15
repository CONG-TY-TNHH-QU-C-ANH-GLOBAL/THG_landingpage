// k6 — Scenario B: 1,000-request baseline (>=1,000 completed requests, concurrency 100).
// Correctness-under-load check, NOT a 1,000-concurrent-user capacity claim (see capacity.js).
// Run: k6 run tests/performance/baseline-1000.js
import http from "k6/http";
import { check } from "k6";

const BASE = __ENV.BASE_URL || "http://127.0.0.1:3000";

export const options = {
  scenarios: {
    baseline: {
      executor: "shared-iterations",
      vus: 100,
      iterations: 1000,
      maxDuration: "3m",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"], // < 1% failures
    "http_req_duration{route:health}": ["p(95)<250"], // health p95 < 250 ms
    "http_req_duration{route:html}": ["p(95)<800"], // foundation HTML p95 < 800 ms
    checks: ["rate>0.99"], // > 99% checks pass
  },
};

export default function runBaselineScenario() {
  const health = http.get(`${BASE}/api/health`, { tags: { route: "health" } });
  check(health, {
    "health 200": (r) => r.status === 200,
    "health contract": (r) => {
      try {
        const b = r.json();
        return b.status === "ok" && b.service === "thg-public-web" && b.runtime === "next";
      } catch {
        return false;
      }
    },
  });

  const html = http.get(`${BASE}/`, { tags: { route: "html" } });
  check(html, { "foundation HTML 200": (r) => r.status === 200 });
}
