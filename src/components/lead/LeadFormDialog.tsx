// Modal lead form — replaces "Get Started" → facebook.com CTA (audit P0.6).
// POSTs to CMS /api/v1/leads with a Cloudflare Turnstile token. Falls back to
// DEV_BYPASS only when VITE_TURNSTILE_SITE_KEY is unset (local dev).

import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { cmsClient } from "@/lib/cmsClient";
import { useTurnstile } from "@/lib/useTurnstile";
import { getUtmPayload } from "@/lib/utm";
import { DELAYS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

type ServiceKey = "fulfill" | "express" | "warehouse" | "dropship";
type Market = "US" | "EU_UK" | "OTHER";

interface Props {
  trigger: ReactNode;
  /** Source page for analytics — defaults to current pathname */
  sourcePage?: string;
  /** Pre-fills the message textarea (e.g. a pricing quote context). */
  defaultMessage?: string;
  primaryService?: ServiceKey;
  surface?: "global-services-dialog" | "fulfill-inline" | "express-inline" | "warehouse-inline" | "dropship-inline" | "home-conversion-inline";
}

export function LeadFormDialog({ trigger, sourcePage, defaultMessage, primaryService, surface }: Props) {
  const { language, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    name: "", email: "", companyUrl: "", monthlyOrderBand: "", primaryService: primaryService ?? "",
    markets: ["US"] as Market[], phone: "", message: defaultMessage ?? "",
  });
  // Track which fields the user already touched so we only highlight invalid
  // ones after they've had a chance to enter something (avoids red borders
  // on initial render).
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean }>({});
  const captcha = useTurnstile();

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const nameInvalid = touched.name && !form.name.trim();
  const emailInvalid = touched.email && !form.email.trim();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.companyUrl.trim() || !form.monthlyOrderBand || !form.primaryService) {
      setTouched({ name: true, email: true });
      toast.error(t("lead_form.err_required"));
      return;
    }
    if (step === 1) {
      setStep(2);
      return;
    }
    const token = captcha.resolveSubmitToken();
    if (!token) {
      toast.error(t("lead_form.err_captcha"));
      return;
    }
    setPending(true);
    try {
      const path = sourcePage ?? (typeof window !== "undefined" ? window.location.pathname : "/");
      const utm = getUtmPayload();
      await cmsClient.postLead({
        name: form.name.trim(),
        email: form.email.trim(),
        company_url: form.companyUrl.trim(),
        monthly_order_band: form.monthlyOrderBand as "<100" | "100_499" | "500_1999" | "2000_plus",
        ship_to_markets: form.markets,
        phone: form.phone.trim() || undefined,
        message: form.message.trim() || undefined,
        source_page: path,
        locale: language,
        utm: Object.keys(utm).length > 0 ? utm : undefined,
        primary_service: form.primaryService as ServiceKey,
        service_interests: [form.primaryService as ServiceKey],
        surface: surface ?? "global-services-dialog",
        turnstile_token: token,
      });
      setDone(true);
      trackEvent("generate_lead", { service: form.primaryService, source_page: path, locale: language });
      toast.success(t("lead_form.success_toast"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("lead_form.err_generic"));
      captcha.resetForRetry();
    } finally {
      setPending(false);
    }
  }

  function reset() {
    setForm({ name: "", email: "", companyUrl: "", monthlyOrderBand: "", primaryService: primaryService ?? "", markets: ["US"], phone: "", message: defaultMessage ?? "" });
    setStep(1);
    setDone(false);
    setTouched({});
    captcha.resetForRetry();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) trackEvent("form_start", { source_page: sourcePage ?? window.location.pathname });
        if (!o) setTimeout(reset, DELAYS.DIALOG_RESET_AFTER_CLOSE_MS);
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
            <div className="flex items-center gap-2 text-xs text-muted-foreground" aria-label={`Step ${step} of 2`}>
              <span className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-secondary"}`} />
              <span className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-secondary"}`} />
              <span>{step}/2</span>
            </div>
            {step === 1 ? (
              <>
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
              <Label htmlFor="lead-company-url">Company / store URL *</Label>
              <Input id="lead-company-url" type="url" required value={form.companyUrl} onChange={(e) => set("companyUrl", e.target.value)} placeholder="https://yourstore.com" disabled={pending} />
            </div>
            <div>
              <Label htmlFor="lead-service">Primary service *</Label>
              <select
                id="lead-service"
                required
                value={form.primaryService}
                onChange={(e) => {
                  set("primaryService", e.target.value);
                  if (e.target.value) trackEvent("select_service", { service: e.target.value });
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select a service</option>
                <option value="fulfill">Fulfillment / POD</option>
                <option value="express">International Express</option>
                <option value="warehouse">US 3PL Warehouse</option>
                <option value="dropship">Dropship / THG Order</option>
              </select>
            </div>
            <div>
              <Label htmlFor="lead-order-band">Monthly order volume *</Label>
              <select id="lead-order-band" required value={form.monthlyOrderBand} onChange={(e) => set("monthlyOrderBand", e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select monthly orders</option>
                <option value="<100">Under 100</option>
                <option value="100_499">100–499</option>
                <option value="500_1999">500–1,999</option>
                <option value="2000_plus">2,000+</option>
              </select>
            </div>
              </>
            ) : (
              <>
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
            <fieldset>
              <legend className="text-sm font-medium mb-2">Ship-to markets *</legend>
              <div className="flex flex-wrap gap-3">
                {(["US", "EU_UK", "OTHER"] as Market[]).map((market) => (
                  <label key={market} className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.markets.includes(market)}
                      onChange={(e) => setForm((current) => ({
                        ...current,
                        markets: e.target.checked
                          ? [...current.markets, market]
                          : current.markets.filter((item) => item !== market),
                      }))}
                    />
                    {market === "EU_UK" ? "EU / UK" : market === "OTHER" ? "Other" : "US"}
                  </label>
                ))}
              </div>
            </fieldset>
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
              </>
            )}

            {step === 2 && captcha.enabled && (
              <div className="flex justify-center" data-testid="lead-turnstile">
                <Turnstile
                  ref={captcha.widgetRef}
                  siteKey={captcha.siteKey}
                  onSuccess={captcha.onSuccess}
                  onError={captcha.onError}
                  onExpire={captcha.onExpire}
                  options={{ theme: "light", size: "normal" }}
                />
              </div>
            )}

            <div className="flex gap-2">
            {step === 2 && <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={pending}><ArrowLeft className="w-4 h-4" /></Button>}
            <Button type="submit" disabled={pending || (step === 2 && form.markets.length === 0)} className="w-full">
              {pending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                  {t("lead_form.submitting")}
                </>
              ) : (
                step === 1 ? "Continue" : t("lead_form.submit")
              )}
            </Button>
            </div>

            <div className="text-[10px] text-center text-muted-foreground">
              {t("lead_form.consent")}
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
