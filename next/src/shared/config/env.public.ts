// Client-safe environment. ONLY `NEXT_PUBLIC_*` values may appear here — never a secret.
// `NEXT_PUBLIC_SITE_URL` (FND-003): canonical site origin override; unset → production
// default in shared/seo/site.ts. Consumed only through `resolveSiteOrigin`.
// `NEXT_PUBLIC_CMS_API_URL` (WEB-001): public CMS base for the reused lead-form island's
// client-side POST — public by design, parity with Vite's VITE_CMS_API_URL [WEB-001 §14].
// `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (WEB-001): Cloudflare Turnstile site key (public).
export const publicEnv = Object.freeze({
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? undefined,
  cmsApiUrl: process.env.NEXT_PUBLIC_CMS_API_URL ?? undefined,
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? undefined,
});

export type PublicEnv = typeof publicEnv;

const DEV_CMS_API_URL = "http://localhost:8080/api/v1";

/** Resolve the PUBLIC CMS base the client lead-form POSTs to. `NEXT_PUBLIC_*` is BUILD-TIME
 *  browser config — Next inlines it into the client bundle at `next build`, so this policy is
 *  enforced at build time and NOT via systemd runtime injection (mirror of the server-only
 *  resolveCmsBaseUrl, but keyed on the public var):
 *   - development / test: missing → the approved localhost dev default;
 *   - production: missing → throw, so `next build` never bakes localhost into a production
 *     client bundle (the value is public, but it must come from approved deployment config);
 *   - explicit value: trailing slashes normalized so `${base}/leads` never double-slashes.
 *  The `next.config.ts` build gate is the loud, early failure; this resolver is the
 *  defense-in-depth that keeps localhost out of the bundle even if the gate is bypassed. */
export function resolvePublicCmsApiUrl(
  raw: string | undefined = process.env.NEXT_PUBLIC_CMS_API_URL,
): string {
  const configured = raw?.trim();
  if (!configured) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "NEXT_PUBLIC_CMS_API_URL is required for production builds: refusing to bake the local dev default into the client bundle (set it in the BUILD environment; see next/.env.example and ops/systemd/thg-next.service.candidate)",
      );
    }
    return DEV_CMS_API_URL;
  }
  return configured.replace(/\/+$/, "");
}
