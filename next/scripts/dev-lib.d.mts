// Type declarations for the dev-guard helpers (dev-lib.mjs is plain ESM run by `node`; the
// vitest tests import it, so `tsc --noEmit` needs signatures here — no runtime file changes).
export const APP_ROOT: string;

export interface NextProcess {
  pid: number;
  cmd: string;
}
export function findNextProcesses(): { rows: NextProcess[]; enumerated: boolean };

export interface CacheState {
  dotNextPresent: boolean;
  turbo: { bytes: number; sst: number };
}
export function cacheState(): CacheState;

export function diskFreeGb(): number | null;
export function cmsOrigin(): string;

export interface CmsReachability {
  reachable: boolean;
  status?: number;
  error?: "timeout" | "unreachable";
}
export function checkCmsReachable(opts?: {
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}): Promise<CmsReachability>;

export function mb(bytes: number): number;
