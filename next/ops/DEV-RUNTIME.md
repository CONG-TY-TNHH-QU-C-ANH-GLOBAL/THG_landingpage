# Local dev runtime — Turbopack cache recovery runbook

Next **16.2.10** uses Turbopack for `next dev` with an on-disk persistence cache under
`.next/dev/cache/turbopack/v16.2.10/` (`*.sst` sorted files + `*.meta`). That cache is fast
but **not crash-safe against concurrent or interrupted writes**. Production `next build` /
`next start` do not use it and were never affected.

## Incident signature

- missing `.sst` files / metadata referencing deleted SSTs;
- `Another write batch or compaction is already active`;
- Rust panic in `turbo-persistence .../static_sorted_file.rs`;
- `Failed to restore task data (corrupted database or bug)` → fatal `TurbopackInternalError`;
- separately: a long-lived dev process growing to multiple GB with compile latency
  degrading from seconds to minutes while the port stays open but stops responding.

## Root cause (this project, evidence-based)

Primary **A + C**: `.next` (or `.next/dev`) was deleted while a Turbopack dev process — or a
leftover **orphan** of one — still held the persistence database open, and stale locks from
dev processes killed by *port* (whose detached children survived) left the cache
inconsistent. Observed directly: multiple orphaned `next dev` / `start-server` processes for
this app alive at once, and repeated `Another next dev server is already running` errors
naming already-dead PIDs.

Aggravator **D**: Windows Defender real-time scanning is enabled and `.next` is **not**
excluded, so it scans every SST create/rename — a known source of write/rename races for
Turbopack persistence on Windows. Underlying **E**: the 16.2 persistence layer is not
resilient to the above.

Ruled out: **F** disk health (ample free space, no disk errors), **G** app architecture
(the app builds and serves fine; production build/start responsive), and OneDrive/indexing
(the repository is not inside a OneDrive-synced path).

## Recovery procedure

1. **Stop dev.** Ctrl-C the `bun run dev` you started.
2. **Verify no process** — `bun run dev:doctor`. It lists any Next process still bound to
   this app (orphans survive a port-only kill). Stop every one it reports.
   - Windows: `Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object CommandLine -match 'THG_landingpage.next' | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }`
3. **Delete `.next`** — `bun run dev:clean`. It **refuses** while any repo dev process is
   still alive (deleting `.next` under a live Turbopack process is what corrupts the cache),
   then removes only the generated `.next`. It never kills processes and never edits env.
4. **Restart** — `bun run dev`. The warm cache rebuilds on first compile.
5. **If it recurs**, capture a Turbopack trace and switch to the Webpack fallback while
   investigating (below).

## Commands

| Command | Use |
|---|---|
| `bun run dev` | normal dev (Turbopack). |
| `bun run dev:doctor` | read-only: active Next processes, `.next`/cache state, CMS origin, disk. |
| `bun run dev:clean` | delete `.next` **only when no dev process is running**. |
| `bun run dev:webpack` | diagnostic fallback — `next dev --webpack`, bypasses Turbopack persistence entirely. |
| traced Turbopack | set `NEXT_TURBOPACK_TRACING=1` then `bun run dev` — PowerShell: `$env:NEXT_TURBOPACK_TRACING=1; bun run dev`; POSIX: `NEXT_TURBOPACK_TRACING=1 bun run dev`. Writes `.next/trace-turbopack`. |

The Webpack fallback is **diagnostic only** — do not switch the project's default dev bundler
or the production build bundler without comparative evidence.

## Never

- Never run two dev servers against the same `.next`.
- Never delete `.next` while a dev process (or orphan) is alive — use `dev:clean`.
- Never `bun dev` auto-deletes `.next`: that would hide this defect and throw away the warm
  cache on every start.

## Reproduction matrix (measured on this machine, fresh `.next` each mode, single process)

| Mode | Ready | Cold `/vi` | Warm `/vi` | Dev memory | Turbopack persistence cache |
|---|---|---|---|---|---|
| A — Turbopack (default) | ~2 s | ~5.1 s | ~0.44 s | ~1500 MB | created (`*.sst`) — the corruptible subsystem |
| C — Webpack (`--webpack`) | ~5 s | ~7.1 s | ~0.35 s | ~1070 MB | **none** — avoids the defect entirely |

Mode B (Turbopack FS cache disabled) is **not a supported switch** in 16.2 — there is no
public flag/env to disable only the persistence cache; the practical no-persistence path is
Mode C. Mode D (Next 16.3.x) is **not available**: 16.2.10 is the latest published release,
so no upgrade is possible. Re-evaluate when a stable 16.3.x with dev-cache hardening ships.

## Recommendation (not applied automatically)

Add a Windows Defender path exclusion for this app's `.next` directory to remove the SST
write/rename race. This is a machine setting, not a repo change, and requires operator
consent:

```powershell
Add-MpPreference -ExclusionPath "<repo>\next\.next"
```
