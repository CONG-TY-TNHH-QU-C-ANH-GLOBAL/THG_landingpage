// k6 — Scenario C: capacity definition (ramp toward TARGET_VUS virtual users).
// Env-configurable. Intended for a production-like staging/VPS environment BEFORE M10.
// NOT to be run against production. Does NOT run in CI by default.
// Run: BASE_URL=https://staging... TARGET_VUS=1000 k6 run tests/performance/capacity.js
import http from "k6/http";
import { check } from "k6";

const BASE = __ENV.BASE_URL || "http://127.0.0.1:3000";
const TARGET_VUS = Number(__ENV.TARGET_VUS || 1000);
const RAMP = __ENV.RAMP || "2m";
const HOLD = __ENV.HOLD || "3m";

export const options = {
  scenarios: {
    capacity: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: RAMP, target: TARGET_VUS },
        { duration: HOLD, target: TARGET_VUS },
        { duration: "30s", target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    checks: ["rate>0.99"],
  },
};

export default function runCapacityScenario() {
  const health = http.get(`${BASE}/api/health`, { tags: { route: "health" } });
  check(health, { "health 200": (r) => r.status === 200 });
}
