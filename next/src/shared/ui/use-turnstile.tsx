"use client";

// Shared Cloudflare Turnstile state for both LeadFormDialog and
// ApplicantFormDialog. Each form was independently tracking a TurnstileInstance
// ref + token state + DEV_BYPASS fallback; centralising it here makes the form
// components ~20 lines lighter and ensures the bypass/expire/reset behaviour
// stays consistent across the two conversion paths.

import { useCallback, useRef, useState } from "react";
import type { TurnstileInstance } from "@marsidev/react-turnstile";

import { TURNSTILE_DEV_TOKEN, TURNSTILE_SITE_KEY, isTurnstileEnabled } from "./turnstile";

export interface TurnstileController {
  /** Pass to <Turnstile ref={...} /> so we can call .reset() after errors. */
  widgetRef: React.MutableRefObject<TurnstileInstance | null>;
  /** Cloudflare site key — render the widget with this when enabled. */
  siteKey: string;
  /** True when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set — controls widget rendering. */
  enabled: boolean;
  /** onSuccess prop for the <Turnstile> widget. */
  onSuccess: (t: string) => void;
  /** onError prop. */
  onError: () => void;
  /** onExpire prop. */
  onExpire: () => void;
  /** Returns the token to send with form submission. Returns null when the
   *  widget is enabled but the user hasn't completed the challenge yet. In
   *  dev mode (key unset) returns the DEV_BYPASS sentinel that the CMS
   *  middleware accepts when its TURNSTILE_SECRET_KEY is also empty. */
  resolveSubmitToken: () => string | null;
  /** Wipe the captured token + re-mount the widget. Call after a failed
   *  submit so the user can retry — Turnstile tokens are single-use. */
  resetForRetry: () => void;
}

export function useTurnstile(): TurnstileController {
  const [token, setToken] = useState<string | null>(null);
  const widgetRef = useRef<TurnstileInstance | null>(null);

  const onSuccess = useCallback((t: string) => setToken(t), []);
  const clear = useCallback(() => setToken(null), []);

  const resolveSubmitToken = useCallback((): string | null => {
    return isTurnstileEnabled() ? token : TURNSTILE_DEV_TOKEN;
  }, [token]);

  const resetForRetry = useCallback(() => {
    widgetRef.current?.reset();
    setToken(null);
  }, []);

  return {
    widgetRef,
    siteKey: TURNSTILE_SITE_KEY,
    enabled: isTurnstileEnabled(),
    onSuccess,
    onError: clear,
    onExpire: clear,
    resolveSubmitToken,
    resetForRetry,
  };
}
