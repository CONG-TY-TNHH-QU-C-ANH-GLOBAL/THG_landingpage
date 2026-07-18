// Parity source: src/components/lead/LeadFormDialog.tsx
// Modal lead form — replaces "Get Started" → facebook.com CTA (audit P0.6).
// POSTs to CMS /api/v1/leads with a Cloudflare Turnstile token. Falls back to
// DEV_BYPASS only when NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset (local dev).
"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import type { Locale } from "@/shared/i18n";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import { postLead } from "@/shared/ui/lead-api";
import { useTurnstile } from "@/shared/ui/use-turnstile";
import { getUtmPayload } from "@/shared/ui/utm";
import { DELAYS } from "@/shared/ui/constants";

interface Props {
  trigger: ReactNode;
  /** Source page for analytics — defaults to current pathname */
  sourcePage?: string;
  /** Pre-fills the message textarea (e.g. a pricing quote context). */
  defaultMessage?: string;
  lang: Locale;
  copy: MarketingCopy;
}

export function LeadFormDialog({ trigger, sourcePage, defaultMessage, lang, copy }: Readonly<Props>) {
  const t = tFrom(copy);
  const [open, setOpen] = useState(false);
  // The delayed post-close reset must not fire into a reopened dialog.
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    },
    [],
  );
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: defaultMessage ?? "" });
  // Track which fields the user already touched so we only highlight invalid
  // ones after they've had a chance to enter something (avoids red borders
  // on initial render).
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean }>({});
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

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const nameInvalid = touched.name && !form.name.trim();
  const emailInvalid = touched.email && !form.email.trim();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setTouched({ name: true, email: true });
      toast.error(t("lead_form.err_required"));
      return;
    }
    const token = resolveSubmitToken();
    if (!token) {
      toast.error(t("lead_form.err_captcha"));
      return;
    }
    setPending(true);
    try {
      const path = sourcePage ?? (typeof window !== "undefined" ? window.location.pathname : "/");
      const utm = getUtmPayload();
      await postLead({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        message: form.message.trim() || undefined,
        source_page: path,
        locale: lang,
        utm: Object.keys(utm).length > 0 ? utm : undefined,
        turnstile_token: token,
      });
      setDone(true);
      toast.success(t("lead_form.success_toast"));
    } catch {
      // Application-owned copy only — postLead never exposes CMS diagnostics,
      // and this boundary must not either (timeouts/network errors included).
      toast.error(t("lead_form.err_generic"));
      resetForRetry();
    } finally {
      setPending(false);
    }
  }

  function reset() {
    setForm({ name: "", email: "", phone: "", message: defaultMessage ?? "" });
    setDone(false);
    setTouched({});
    resetForRetry();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        if (!o) resetTimerRef.current = setTimeout(reset, DELAYS.DIALOG_RESET_AFTER_CLOSE_MS);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("lead_form.title")}</DialogTitle>
          <DialogDescription>{t("lead_form.desc")}</DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="py-6 text-center space-y-3">
            <div className="text-3xl">✅</div>
            <div className="font-semibold text-base">{t("lead_form.success_title")}</div>
            <p className="text-sm text-muted-foreground">
              {t("lead_form.success_desc_before")}
              <strong>{form.email}</strong>
              {t("lead_form.success_desc_after")}
            </p>
            <Button onClick={() => setOpen(false)} className="mt-2 w-full">{t("lead_form.close")}</Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <Label htmlFor="lead-name">{t("lead_form.name_label")} *</Label>
              <Input
                id="lead-name"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                onBlur={() => setTouched((s) => ({ ...s, name: true }))}
                placeholder={t("lead_form.name_placeholder")}
                disabled={pending}
                aria-invalid={nameInvalid || undefined}
                className={nameInvalid ? "border-destructive focus-visible:ring-destructive" : undefined}
              />
            </div>
            <div>
              <Label htmlFor="lead-email">{t("lead_form.email_label")} *</Label>
              <Input
                id="lead-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                onBlur={() => setTouched((s) => ({ ...s, email: true }))}
                placeholder={t("lead_form.email_placeholder")}
                disabled={pending}
                aria-invalid={emailInvalid || undefined}
                className={emailInvalid ? "border-destructive focus-visible:ring-destructive" : undefined}
              />
            </div>
            <div>
              <Label htmlFor="lead-phone">{t("lead_form.phone_label")}</Label>
              <Input
                id="lead-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder={t("lead_form.phone_placeholder")}
                disabled={pending}
              />
            </div>
            <div>
              <Label htmlFor="lead-message">{t("lead_form.message_label")}</Label>
              <Textarea
                id="lead-message"
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder={t("lead_form.message_placeholder")}
                rows={4}
                disabled={pending}
              />
            </div>

            {captchaEnabled && (
              <div className="flex justify-center" data-testid="lead-turnstile">
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
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                  {t("lead_form.submitting")}
                </>
              ) : (
                t("lead_form.submit")
              )}
            </Button>

            <div className="text-[10px] text-center text-muted-foreground">
              {t("lead_form.consent")}
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
