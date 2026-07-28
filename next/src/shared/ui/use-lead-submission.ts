"use client";

// Shared lead-submission foundation (WEB-002). The single behavioral engine behind every lead
// surface — the global dialog, the home conversion section, and the Fulfill inline form. It owns
// the COMMON contract only: common contact fields + validation, Turnstile lifecycle, duplicate-
// submit protection, envelope construction (locale / source_page / UTM / service / surface /
// details), and pending/success/error state. It owns NO markup and NO service-specific fields —
// each surface composes its own layout and passes its fixed or selected service + details at
// submit time. This replaces the two hand-rolled engines (lead-form-dialog + conversion-section)
// that had already drifted (different email checks).
import { useRef, useState } from "react";

import type { Locale } from "@/shared/i18n";
import { postLead } from "@/shared/ui/lead-api";
import { useTurnstile, type TurnstileController } from "@/shared/ui/use-turnstile";
import { getUtmPayload } from "@/shared/ui/utm";
import type { LeadServiceKey, LeadSurfaceKey } from "@/shared/ui/lead-services";

/** Linear-time email shape check (shared by all surfaces; supersedes the dialog's weaker
 *  `!email.trim()`). Same accept/reject set as /^[^\s@]+@[^\s@]+\.[^\s@]+$/ without backtracking. */
export function isEmailish(value: string): boolean {
  const s = value.trim();
  const at = s.indexOf("@");
  if (at <= 0 || at !== s.lastIndexOf("@") || at === s.length - 1) return false;
  if (/\s/.test(s)) return false;
  const dot = s.lastIndexOf(".");
  return dot > at + 1 && dot < s.length - 1;
}

export type LeadErrorCode = "required" | "captcha" | "generic";

interface CommonForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface SubmitArgs {
  /** Highest-priority intent; null for a generic ("need guidance") lead. When set, the surface must
   *  also include it in `serviceInterests`. */
  primaryService: LeadServiceKey | null;
  /** All interests (primary + secondaries); [] for a generic lead. */
  serviceInterests: LeadServiceKey[];
  /** UI-surface attribution (independent of service intent; may be sent for generic leads too). */
  surface: LeadSurfaceKey | null;
  /** Per-service validated details keyed by service; omitted/empty → not sent. */
  detailsByService?: Record<string, Record<string, unknown>> | null;
  /** Optional service-specific validation gate run after common validation. */
  validateExtra?: () => boolean;
}

export interface UseLeadSubmissionOptions {
  lang: Locale;
  sourcePage?: string;
  defaultMessage?: string;
}

export interface LeadSubmissionController {
  form: Readonly<CommonForm>;
  setField: (key: keyof CommonForm, value: string) => void;
  touched: Readonly<{ name?: boolean; email?: boolean }>;
  markTouched: (key: "name" | "email") => void;
  nameInvalid: boolean;
  emailInvalid: boolean;
  pending: boolean;
  done: boolean;
  turnstile: TurnstileController;
  reset: () => void;
  /** Validate + submit. Returns the outcome so the surface can present it (toast vs inline) and
   *  localize the error. A second call while pending is ignored (duplicate-submit protection). */
  submit: (args: SubmitArgs) => Promise<{ ok: boolean; error?: LeadErrorCode }>;
}

export function useLeadSubmission(options: UseLeadSubmissionOptions): LeadSubmissionController {
  const { lang, sourcePage, defaultMessage } = options;
  const [form, setForm] = useState<CommonForm>({
    name: "",
    email: "",
    phone: "",
    message: defaultMessage ?? "",
  });
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean }>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const turnstile = useTurnstile();
  // Guards the async window between submit() start and setPending(true) committing, so a rapid
  // double-fire cannot launch two POSTs (duplicate-submit protection independent of render state).
  const inFlight = useRef(false);

  function setField(key: keyof CommonForm, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function markTouched(key: "name" | "email") {
    setTouched((s) => ({ ...s, [key]: true }));
  }

  const nameInvalid = Boolean(touched.name) && !form.name.trim();
  const emailInvalid = Boolean(touched.email) && !isEmailish(form.email);

  function reset() {
    setForm({ name: "", email: "", phone: "", message: defaultMessage ?? "" });
    setTouched({});
    setDone(false);
    turnstile.resetForRetry();
  }

  async function submit(args: SubmitArgs): Promise<{ ok: boolean; error?: LeadErrorCode }> {
    if (inFlight.current || pending) return { ok: false };
    if (!form.name.trim() || !isEmailish(form.email)) {
      setTouched({ name: true, email: true });
      return { ok: false, error: "required" };
    }
    if (args.validateExtra && !args.validateExtra()) {
      return { ok: false, error: "required" };
    }
    const token = turnstile.resolveSubmitToken();
    if (!token) return { ok: false, error: "captcha" };

    inFlight.current = true;
    setPending(true);
    try {
      const utm = getUtmPayload();
      const hasInterests = args.serviceInterests.length > 0;
      const hasDetails =
        args.detailsByService != null && Object.keys(args.detailsByService).length > 0;
      await postLead({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        message: form.message.trim() || undefined,
        source_page: sourcePage ?? (typeof window !== "undefined" ? window.location.pathname : "/"),
        locale: lang,
        utm: Object.keys(utm).length > 0 ? utm : undefined,
        // Multi-intent: primary (if any) + interests + per-service details; surface is independent
        // and may accompany a generic lead. Empty dimensions are omitted (legacy-clean payload).
        primary_service: args.primaryService ?? undefined,
        service_interests: hasInterests ? args.serviceInterests : undefined,
        service_details: hasDetails ? args.detailsByService! : undefined,
        surface: args.surface ?? undefined,
        turnstile_token: token,
      });
      setDone(true);
      return { ok: true };
    } catch {
      // Application-owned failure only — postLead never surfaces CMS diagnostics. Reset Turnstile
      // (tokens are single-use) so the user can retry with input preserved.
      turnstile.resetForRetry();
      return { ok: false, error: "generic" };
    } finally {
      setPending(false);
      inFlight.current = false;
    }
  }

  return {
    form,
    setField,
    touched,
    markTouched,
    nameInvalid,
    emailInvalid,
    pending,
    done,
    turnstile,
    reset,
    submit,
  };
}
