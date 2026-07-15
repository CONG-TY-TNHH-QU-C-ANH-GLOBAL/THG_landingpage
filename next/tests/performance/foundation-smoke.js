// k6 — Scenario A: foundation smoke (low load; validates script + endpoint correctness).
// Run: k6 run tests/performance/foundation-smoke.js  (BASE_URL env overrides target)
import http from "k6/http";
import { check } from "k6";

const BASE = __ENV.BASE_URL || "http://127.0.0.1:3000";

export const options = {
  vus: 5,
  iterations: 20,
  thresholds: {
    http_req_failed: ["rate<0.01"],
    checks: ["rate>0.99"],
  },
};

export default function () {
  const health = http.get(`${BASE}/api/health`);
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

  const html = http.get(`${BASE}/`);
  check(html, { "foundation HTML 200": (r) => r.status === 200 });
}
