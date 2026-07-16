# ops/ — operational CANDIDATES (non-production)

These are **candidate** artifacts for the standalone Next runtime (ADR-001 Option A,
FND-010). They are **not installed**, **not enabled**, and **do not switch traffic**.
Production stays on the Vite application through M10. Real nginx/systemd installation and
cutover are owned by FND-010 / MIG-010, gated on the real production baseline (OQ-P-004).

| File | Purpose |
|---|---|
| `systemd/thg-next.service.candidate` | standalone Node service unit; runs as an unprivileged `thg-next` account; graceful restart; PORT |
| `nginx/thg-next.conf.candidate` | reverse proxy → 127.0.0.1:PORT; static caching; health; body/rate limits |
| `smoke/health-smoke.sh` | curl the health endpoint and assert the exact contract (bounded curl) |
| `performance/README.md` | how to run the k6 capacity scenario against staging/VPS |

## Candidate service account (do NOT run here — FND-010 owns VPS setup)

The systemd candidate runs as a **dedicated unprivileged account** (`User=thg-next`,
`Group=thg-next`), never root. That account must exist and the current/release directories
must be readable by it. FND-010 performs the real setup on the VPS with values it verifies;
these commands are documentation only and **have not been run — production is unchanged**:

```bash
# create the unprivileged service account (no login shell, no home)
sudo useradd --system --no-create-home --shell /usr/sbin/nologin thg-next
# make the release/current directories readable by it
sudo chown -R thg-next:thg-next /var/www/thgfulfill-next
```

Rollback (documented, not executed): re-enable the static Vite nginx config; the Vite
`dist` and deploy path are untouched.
