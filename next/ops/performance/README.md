# ops/performance/ — capacity testing on staging/VPS

The capacity scenario (`next/tests/performance/capacity.js`) must run against a
**production-like staging/VPS** environment before M10 — never against production.

```
# on/against the staging VPS running the standalone Next app:
BASE_URL=https://staging.thgfulfill.example TARGET_VUS=1000 RAMP=2m HOLD=5m \
  k6 run tests/performance/capacity.js
```

Capture alongside the k6 summary: CPU peak, memory peak, and process restarts (e.g.
`systemctl status`, `pidstat`, `journalctl`). Report total requests, concurrent VUs,
sustainable RPS, p50/p95/p99, error rate, CPU/memory peaks, restarts. Do not claim
concurrent-user capacity from the 1,000-total-request baseline.
