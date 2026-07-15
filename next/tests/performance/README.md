# tests/performance/ — k6 load tests

Three scenarios (FND-001 §14). k6 is an external binary (install: https://k6.io) — it is
**not** an npm dependency and does not run in the unit-test suite.

| Script | Scenario | Purpose |
|---|---|---|
| `foundation-smoke.js` | A — smoke | low load; validates script + endpoint correctness |
| `baseline-1000.js` | B — baseline | ≥1,000 completed requests, concurrency 100; correctness under load |
| `capacity.js` | C — capacity | ramp toward `TARGET_VUS` (default 1,000) VUs; staging/VPS only |

## Run

```
# start the standalone app first (see next/README.md), then:
k6 run tests/performance/foundation-smoke.js
k6 run tests/performance/baseline-1000.js
BASE_URL=https://staging.example TARGET_VUS=1000 k6 run tests/performance/capacity.js
```

## Baseline (B) thresholds — do NOT weaken to pass

- `http_req_failed < 1%`
- health `p95 < 250 ms`; foundation HTML `p95 < 800 ms`
- `checks > 99%`
- no process restart, no OOM, no unhandled server error

## Capacity (C) report must distinguish

total requests · concurrent virtual users · sustainable requests/sec · p50 · p95 · p99 ·
error rate · CPU peak · memory peak · process restarts.

**The 1,000-total-request baseline (B) does NOT prove 1,000 concurrent users.** Concurrent
capacity is only what scenario C measures on a production-like environment. If the
local/test machine is the bottleneck, report the limitation and preserve the failing
evidence — never silently lower a threshold.
