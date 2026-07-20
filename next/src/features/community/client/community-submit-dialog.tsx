"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import { useTurnstile } from "@/shared/ui/use-turnstile";
import { DELAYS } from "@/shared/ui/constants";

import { communityErrorMessage } from "./api-error-copy";

// Shared moderation-first submit dialog for Ask Question and Submit Review. Owns dialog
// state, Turnstile, pending/done and error mapping; the caller owns its own field state
// so it can build its own payload.
//
// The success panel never claims publication — it states pending review, matching the
// CMS, which inserts every submission with status 'pending' and never exposes it publicly
// until an operator publishes it.

interface Props {
  trigger: ReactNode;
  copy: MarketingCopy;
  title: string;
  description: string;
  successTitle: string;
  successDescription: string;
  /** Only rendered when the submit actually returned an owner token to store. */
  withdrawHint: string;
  submitLabel: string;
  turnstileTestId: string;
  /** Fields. Must be disabled by the caller while `pending`. */
  children: ReactNode;
  /** Returns a localized error message, or null when the input passes. */
  validate: () => string | null;
  /** Resolves to true when an owner token was stored (drives the withdraw hint). */
  submit: (turnstileToken: string) => Promise<boolean>;
  /** Clears the caller's field state after the dialog closes. */
  onReset: () => void;
}

export function CommunitySubmitDialog({
  trigger,
  copy,
  title,
  description,
  successTitle,
  successDescription,
  withdrawHint,
  submitLabel,
  turnstileTestId,
  children,
  validate,
  submit,
  onReset,
}: Readonly<Props>) {
  const t = tFrom(copy);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [canWithdraw, setCanWithdraw] = useState(false);
  // Destructured rather than held as a controller object: the ref must be read as a bare
  // binding, not a property access during render.
  const {
    widgetRef,
    siteKey,
    enabled: captchaEnabled,
    onSuccess,
    onError,
    onExpire,
    resolveSubmitToken,
    resetForRetry,
  } = useTurnstile();

  // The delayed post-close reset must not fire into a reopened dialog.
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    },
    [],
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const invalid = validate();
    if (invalid) {
      toast.error(invalid);
      return;
    }
    const token = resolveSubmitToken();
    if (!token) {
      toast.error(t("community.form_err_captcha"));
      return;
    }
    setPending(true);
    try {
      setCanWithdraw(await submit(token));
      setDone(true);
    } catch (err) {
      toast.error(communityErrorMessage(err, t));
      // Turnstile tokens are single-use — re-mount the widget so a retry can succeed.
      // Field values are deliberately preserved so a rate-limited or failed submit does
      // not cost the user their typing.
      resetForRetry();
    } finally {
      setPending(false);
    }
  }

  function reset() {
    onReset();
    setDone(false);
    setCanWithdraw(false);
    resetForRetry();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        if (!next) resetTimerRef.current = setTimeout(reset, DELAYS.DIALOG_RESET_AFTER_CLOSE_MS);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="space-y-3 py-6 text-center">
            <div className="text-3xl" aria-hidden="true">
              ✅
            </div>
            <p className="text-base font-semibold text-navy">{successTitle}</p>
            <p className="text-[length:var(--step-small)] text-muted-foreground">{successDescription}</p>
            {canWithdraw && (
              <p className="text-[length:var(--step-small)] text-muted-foreground">{withdrawHint}</p>
            )}
            <Button onClick={() => setOpen(false)} className="mt-2 w-full">
              {t("community.form_close")}
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            {children}

            {captchaEnabled && (
              <div className="flex justify-center" data-testid={turnstileTestId}>
                <Turnstile
                  ref={widgetRef}
                  siteKey={siteKey}
                  onSuccess={onSuccess}
                  onError={onError}
                  onExpire={onExpire}
                  options={{ theme: "light", size: "normal" }}
                />
              </div>
            )}

            <Button type="submit" disabled={pending} className="w-full">
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  {t("community.form_submitting")}
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
