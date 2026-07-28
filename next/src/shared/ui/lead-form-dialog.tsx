// Global multi-intent lead dialog (WEB-002 land-and-expand). The website's global lead-entry
// surface: the user picks a PRIMARY need (or "need guidance"), optionally flags ADJACENT service
// interests, and the submission carries the full intent set + surface="global-services-dialog" to
// the real /leads contract. Behavior (validation, Turnstile, dup-submit, transport, envelope) is
// owned by the shared useLeadSubmission foundation. A trigger may preselect a primary via
// `initialService` (still changeable). Generic "need guidance" leads submit no service intent.
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
import { useLeadSubmission, type LeadErrorCode } from "@/shared/ui/use-lead-submission";
import { ServiceSelector } from "@/shared/ui/service-selector";
import { AdditionalInterests } from "@/shared/ui/additional-interests";
import { LeadServiceDetailFields, buildDetailsByService } from "@/shared/ui/lead-service-detail-fields";
import { LEAD_SERVICE_KEYS, type LeadServiceKey, type FulfillProductType } from "@/shared/ui/lead-services";
import { DELAYS } from "@/shared/ui/constants";

interface Props {
  trigger: ReactNode;
  sourcePage?: string;
  defaultMessage?: string;
  /** Preselect the primary need (e.g. the Fulfill page CTA). Still changeable by the user. */
  initialService?: LeadServiceKey;
  lang: Locale;
  copy: MarketingCopy;
}

const ERROR_COPY_KEY: Readonly<Record<LeadErrorCode, string>> = {
  required: "lead_form.err_required",
  captcha: "lead_form.err_captcha",
  generic: "lead_form.err_generic",
};

export function LeadFormDialog({ trigger, sourcePage, defaultMessage, initialService, lang, copy }: Readonly<Props>) {
  const t = tFrom(copy);
  const [open, setOpen] = useState(false);
  // Multi-intent state: a primary (or "" = need guidance) + adjacent secondary interests +
  // the primary's captured details. Secondaries never include the primary.
  const [primary, setPrimary] = useState<LeadServiceKey | "">(initialService ?? "");
  const [secondary, setSecondary] = useState<LeadServiceKey[]>([]);
  const [productType, setProductType] = useState<FulfillProductType | "">("");

  const lead = useLeadSubmission({ lang, sourcePage, defaultMessage });
  const { form, setField, markTouched, nameInvalid, emailInvalid, pending, done, turnstile } = lead;
  const { widgetRef, siteKey, enabled: captchaEnabled, onSuccess, onError, onExpire } = turnstile;

  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    },
    [],
  );

  // Changing the primary preserves common fields AND the secondary interests. It only: removes the
  // new primary from the secondary set (it is now the primary) and clears orphaned Fulfill details
  // when Fulfill is no longer the primary.
  function changePrimary(next: LeadServiceKey | "") {
    setPrimary(next);
    setSecondary((prev) => prev.filter((s) => s !== next));
    if (next !== "fulfill") setProductType("");
  }

  function toggleSecondary(service: LeadServiceKey, checked: boolean) {
    setSecondary((prev) => (checked ? [...prev, service] : prev.filter((s) => s !== service)));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const primaryKey = primary === "" ? null : primary;
    const serviceInterests = primaryKey ? [primaryKey, ...secondary] : [...secondary];
    const result = await lead.submit({
      primaryService: primaryKey,
      serviceInterests,
      surface: "global-services-dialog",
      detailsByService: buildDetailsByService(primaryKey, productType),
    });
    if (result.ok) toast.success(t("lead_form.success_toast"));
    else if (result.error) toast.error(t(ERROR_COPY_KEY[result.error]));
  }

  function fullReset() {
    lead.reset();
    setPrimary(initialService ?? "");
    setSecondary([]);
    setProductType("");
  }

  const secondaryOptions = LEAD_SERVICE_KEYS.filter((s) => s !== primary);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        if (!o) resetTimerRef.current = setTimeout(fullReset, DELAYS.DIALOG_RESET_AFTER_CLOSE_MS);
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
            <ServiceSelector
              value={primary}
              onChange={changePrimary}
              copy={copy}
              label={t("lead_form.service_label")}
              noneLabel={t("lead_form.guidance_option")}
              disabled={pending}
            />
            <div>
              <Label htmlFor="lead-name">{t("lead_form.name_label")} *</Label>
              <Input
                id="lead-name"
                required
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                onBlur={() => markTouched("name")}
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
                onChange={(e) => setField("email", e.target.value)}
                onBlur={() => markTouched("email")}
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
                onChange={(e) => setField("phone", e.target.value)}
                placeholder={t("lead_form.phone_placeholder")}
                disabled={pending}
              />
            </div>

            {primary === "fulfill" && (
              <LeadServiceDetailFields
                service="fulfill"
                lang={lang}
                label={t("lead_form.product_type_label")}
                productType={productType}
                onProductTypeChange={setProductType}
                disabled={pending}
              />
            )}

            <AdditionalInterests
              legend={t("lead_form.also_interested")}
              services={secondaryOptions}
              selected={secondary}
              onToggle={toggleSecondary}
              copy={copy}
              disabled={pending}
            />

            <div>
              <Label htmlFor="lead-message">{t("lead_form.message_label")}</Label>
              <Textarea
                id="lead-message"
                value={form.message}
                onChange={(e) => setField("message", e.target.value)}
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
