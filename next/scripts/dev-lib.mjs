// Shared helpers for the dev guards (dev:doctor / dev:clean). No dependencies; Windows +
// POSIX/CI safe. Read-only — nothing here mutates the tree or kills processes.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, statSync, statfsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/** The next/ app root (parent of scripts/). */
export const APP_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

const toPosix = (p) => p.replaceAll("\\", "/").toLowerCase();
const isNextDist = (cmd) => /[\\/]next[\\/]dist[\\/]/.test(cmd);

// Absolute binaries so process enumeration never relies on a writable PATH entry.
const SYS_ROOT = process.env.SystemRoot ?? String.raw`C:\Windows`;
const PS_EXE = SYS_ROOT + String.raw`\System32\WindowsPowerShell\v1.0\powershell.exe`;
const PS_ARGS = [
  "-NoProfile",
  "-Command",
  "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Select-Object ProcessId,CommandLine | ConvertTo-Json -Compress",
];

function winProcesses(needle) {
  const out = execFileSync(PS_EXE, PS_ARGS, { encoding: "utf8", windowsHide: true });
  const parsed = JSON.parse(out || "[]");
  const list = Array.isArray(parsed) ? parsed : [parsed];
  return list
    .filter((p) => {
      const cmd = String(p.CommandLine ?? "");
      return isNextDist(cmd) && (toPosix(cmd) + "/").includes(needle);
    })
    .map((p) => ({ pid: p.ProcessId, cmd: String(p.CommandLine ?? "") }));
}

function posixProcesses(needle) {
  const psExe = existsSync("/bin/ps") ? "/bin/ps" : "/usr/bin/ps";
  const out = execFileSync(psExe, ["-Ao", "pid=,command="], { encoding: "utf8" });
  const rows = [];
  for (const line of out.split("\n")) {
    const trimmed = line.trimStart();
    const gap = trimmed.indexOf(" ");
    if (gap < 1) continue;
    const pid = Number(trimmed.slice(0, gap));
    const cmd = trimmed.slice(gap + 1);
    if (!Number.isNaN(pid) && isNextDist(cmd) && (toPosix(cmd) + "/").includes(needle)) {
      rows.push({ pid, cmd });
    }
  }
  return rows;
}

/** Repo-scoped Next dev processes: `next` processes whose command line references THIS app.
 *  Matching on the app path avoids touching an unrelated Next app on the same machine. */
export function findNextProcesses() {
  const needle = toPosix(APP_ROOT) + "/";
  try {
    const rows = process.platform === "win32" ? winProcesses(needle) : posixProcesses(needle);
    return { rows, enumerated: true };
  } catch {
    // Enumeration unavailable (locked-down CI) — "cannot confirm"; dev:clean errs safe.
    return { rows: [], enumerated: false };
  }
}

function dirSize(dir) {
  let bytes = 0;
  let sst = 0;
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      let st;
      try {
        st = statSync(p);
      } catch {
        continue; // vanished mid-walk (Turbopack compaction) — skip, don't crash the report
      }
      if (st.isDirectory()) walk(p);
      else {
        bytes += st.size;
        if (name.endsWith(".sst")) sst += 1;
      }
    }
  };
  if (existsSync(dir)) walk(dir);
  return { bytes, sst };
}

/** `.next` presence + Turbopack persistence-cache footprint (the subsystem that corrupts). */
export function cacheState() {
  const dotNext = join(APP_ROOT, ".next");
  const turbo = join(dotNext, "dev", "cache", "turbopack");
  return { dotNextPresent: existsSync(dotNext), turbo: dirSize(turbo) };
}

/** Free disk on the app volume (GB), best-effort. */
export function diskFreeGb() {
  try {
    const s = statfsSync(APP_ROOT);
    return Math.round((s.bavail * s.bsize) / 1e9);
  } catch {
    return null;
  }
}

/** Public CMS origin the dev server would use — host only, never a secret (the base is public). */
export function cmsOrigin() {
  const raw =
    process.env.CMS_API_URL || process.env.NEXT_PUBLIC_CMS_API_URL || "http://localhost:8080/api/v1";
  try {
    return new URL(raw).host;
  } catch {
    return "<invalid>";
  }
}

/** Resolve the CMS base URL the dev server would read from (host public; never a secret). */
function cmsBaseUrl() {
  return (
    process.env.CMS_API_URL || process.env.NEXT_PUBLIC_CMS_API_URL || "http://localhost:8080/api/v1"
  );
}

/** Read-only CMS reachability probe for dev:doctor. One GET, a short bounded timeout, no
 *  retries, no credentials, no body read — it only answers "is the configured origin
 *  answering?". A configured-but-down origin (e.g. production CMS intentionally offline in
 *  local dev) is reported, never treated as a doctor failure. `fetchImpl`/`timeoutMs` are
 *  injectable for deterministic tests.
 *  Returns { reachable: boolean, status?: number, error?: string }. */
export async function checkCmsReachable({ fetchImpl = fetch, timeoutMs = 2000 } = {}) {
  // Linear trailing-slash trim (no anchored `/\/+$/`, which backtracks super-linearly on an
  // env-derived value — same reason cmsFetch.ts avoids that pattern).
  const raw = cmsBaseUrl();
  let end = raw.length;
  while (end > 0 && raw[end - 1] === "/") end -= 1;
  const base = raw.slice(0, end);
  let signal;
  try {
    signal = AbortSignal.timeout(timeoutMs);
  } catch {
    signal = undefined; // very old runtimes: probe without a timeout signal
  }
  try {
    // /site-settings is a public, side-effect-free read used by the shell footer.
    const res = await fetchImpl(`${base}/site-settings`, {
      method: "GET",
      signal,
      headers: { Accept: "application/json" },
    });
    return { reachable: res.ok, status: res.status };
  } catch (err) {
    const name = err && typeof err === "object" && "name" in err ? String(err.name) : "Error";
    const reason = name === "TimeoutError" || name === "AbortError" ? "timeout" : "unreachable";
    return { reachable: false, error: reason };
  }
}

export const mb = (bytes) => Math.round(bytes / 1e6);
