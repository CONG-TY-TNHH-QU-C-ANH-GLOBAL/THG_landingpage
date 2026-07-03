// Shared pre-flight for the community submit dialogs (Ask a question / Submit a
// review). Pure logic — kept out of the component file so Fast Refresh stays
// happy and both dialogs share one validation + Turnstile path.

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { useTurnstile } from "@/lib/useTurnstile";
import { DELAYS } from "@/lib/constants";

type Captcha = ReturnType<typeof useTurnstile>;
type SubmitFields = { name: string; email: string; title: string; body: string };
type Bounds = { titleMin: number; bodyMin: number };

/** Required + length validation and Turnstile resolution. Toasts the matching
 *  error and returns null on any failure, else returns the resolved Turnstile
 *  token. The domain payload + POST stay in the caller. */
export function resolveCommunitySubmitToken(
  fields: SubmitFields,
  bounds: Bounds,
  captcha: Captcha,
  t: (key: string) => string,
): string | null {
  if (!fields.name.trim() || !fields.email.trim() || !fields.title.trim() || !fields.body.trim()) {
    toast.error(t("community.form_err_required"));
    return null;
  }
  if (fields.title.trim().length < bounds.titleMin || fields.body.trim().length < bounds.bodyMin) {
    toast.error(t("community.form_err_short"));
    return null;
  }
  const token = captcha.resolveSubmitToken();
  if (!token) {
    toast.error(t("community.form_err_captcha"));
    return null;
  }
  return token;
}

/** Open/pending/done state, Turnstile and submit orchestration shared by both
 *  dialogs. The caller keeps its own fields + payload: it passes the fields to
 *  validate and an `action(token)` that performs the POST + owner-token
 *  storage. `submit` handles preventDefault → validate → pending/done/error. */
export function useCommunitySubmitDialog(t: (key: string) => string, resetFields: () => void) {
  const captcha = useTurnstile();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  function reset() {
    resetFields();
    setDone(false);
    captcha.resetForRetry();
  }

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setTimeout(reset, DELAYS.DIALOG_RESET_AFTER_CLOSE_MS);
  }

  async function submit(
    e: FormEvent<HTMLFormElement>,
    fields: SubmitFields,
    bounds: Bounds,
    action: (token: string) => Promise<void>,
  ) {
    e.preventDefault();
    const token = resolveCommunitySubmitToken(fields, bounds, captcha, t);
    if (!token) return;
    setPending(true);
    try {
      await action(token);
      setDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("community.form_err_generic"));
      captcha.resetForRetry();
    } finally {
      setPending(false);
    }
  }

  // Spreadable chrome props for CommunitySubmitDialog (keeps the callers thin).
  const dialogProps = { open, onOpenChange, done, onSuccessClose: () => setOpen(false) };
  return { captcha, pending, submit, dialogProps };
}
