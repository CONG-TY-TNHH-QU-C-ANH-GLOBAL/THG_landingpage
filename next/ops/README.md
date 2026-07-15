# ops/ — operational CANDIDATES (non-production)

These are **candidate** artifacts for the standalone Next runtime (ADR-001 Option A,
FND-010). They are **not installed**, **not enabled**, and **do not switch traffic**.
Production stays on the Vite application through M10. Real nginx/systemd installation and
cutover are owned by FND-010 / MIG-010, gated on the real production baseline (OQ-P-004).

| File | Purpose |
|---|---|
| `systemd/thg-next.service.candidate` | standalone Node service unit; graceful restart; PORT |
| `nginx/thg-next.conf.candidate` | reverse proxy → 127.0.0.1:PORT; static caching; health; body/rate limits |
| `smoke/health-smoke.sh` | curl the health endpoint and assert the exact contract |
| `performance/README.md` | how to run the k6 capacity scenario against staging/VPS |

Rollback (documented, not executed): re-enable the static Vite nginx config; the Vite
`dist` and deploy path are untouched.
