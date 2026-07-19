// Shared helpers for the dev guards (dev:doctor / dev:clean). No dependencies; Windows +
// POSIX/CI safe. Read-only — nothing here mutates the tree or kills processes.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, statSync, statfsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/** The next/ app root (parent of scripts/). */
export const APP_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

/** Repo-scoped Next dev processes: `next` processes whose command line references THIS app.
 *  Matching on the app path avoids touching an unrelated Next app on the same machine. */
export function findNextProcesses() {
  const needle = APP_ROOT.replace(/\\/g, "/").toLowerCase();
  const rows = [];
  try {
    if (process.platform === "win32") {
      // CIM over the deprecated wmic; JSON keeps parsing robust across cmdline quoting.
      const out = execFileSync(
        "powershell",
        [
          "-NoProfile",
          "-Command",
          "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Select-Object ProcessId,CommandLine | ConvertTo-Json -Compress",
        ],
        { encoding: "utf8", windowsHide: true },
      );
      const parsed = JSON.parse(out || "[]");
      for (const p of Array.isArray(parsed) ? parsed : [parsed]) {
        const cmd = String(p.CommandLine ?? "");
        if (/[\\/]next[\\/]dist[\\/]/.test(cmd) && cmd.replace(/\\/g, "/").toLowerCase().includes(needle)) {
          rows.push({ pid: p.ProcessId, cmd });
        }
      }
    } else {
      const out = execFileSync("ps", ["-Ao", "pid=,command="], { encoding: "utf8" });
      for (const line of out.split("\n")) {
        const m = /^\s*(\d+)\s+(.*)$/.exec(line);
        if (!m) continue;
        const cmd = m[2];
        if (/[\\/]next[\\/]dist[\\/]/.test(cmd) && cmd.toLowerCase().includes(needle)) {
          rows.push({ pid: Number(m[1]), cmd });
        }
      }
    }
  } catch {
    // Process enumeration unavailable (locked-down CI) — treat as "cannot confirm"; callers
    // decide. Returning [] here; dev:clean re-checks and errs on the side of safety.
    return { rows: [], enumerated: false };
  }
  return { rows, enumerated: true };
}

function dirSize(dir) {
  let bytes = 0;
  let sst = 0;
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      const st = statSync(p);
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
  return {
    dotNextPresent: existsSync(dotNext),
    turbo: dirSize(turbo),
  };
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
  const raw = process.env.CMS_API_URL || process.env.NEXT_PUBLIC_CMS_API_URL || "http://localhost:8080/api/v1";
  try {
    return new URL(raw).host;
  } catch {
    return "<invalid>";
  }
}

export const mb = (bytes) => Math.round(bytes / 1e6);
