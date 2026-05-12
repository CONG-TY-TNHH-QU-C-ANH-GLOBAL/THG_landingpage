// Cloudflare Turnstile site key. Set via VITE_TURNSTILE_SITE_KEY at build time
// (see .github/workflows/deploy.yml). When blank (local dev), forms fall back
// to the DEV_BYPASS token — CMS accepts this only when its TURNSTILE_SECRET_KEY
// is also empty, so production must set both.
export const TURNSTILE_SITE_KEY: string =
  (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)?.trim() || "";

export const TURNSTILE_DEV_TOKEN = "DEV_BYPASS";

export const isTurnstileEnabled = (): boolean => TURNSTILE_SITE_KEY.length > 0;
