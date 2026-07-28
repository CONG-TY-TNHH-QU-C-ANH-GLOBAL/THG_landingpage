"use client";

// THG Fulfill inline consultation form (WEB-002) — fixed service identity, no service selector.
// It reuses the shared useLeadSubmission foundation (validation / Turnstile / dup-submit /
// transport / envelope) and the canonical service contract, but owns its own dark markup to
// preserve the approved consultation composition. Submits service="fulfill",
// surface="fulfill-inline" to the real /leads endpoint — no fake community publishing, no
// simulated submit, no unsupported fields. Unique field IDs (useId) so it stays isolated from a
// separately mounted global dialog form.
import { useId, useState, type FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

import type { Locale } from "@/shared/i18n";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import { useLeadSubmission, LEAD_ERROR_COPY_KEY } from "@/shared/ui/use-lead-submission";
import { buildDetailsByService } from "@/shared/ui/lead-service-detail-fields";
import { AdditionalInterests } from "@/shared/ui/additional-interests";
import {
  FULFILL_PRODUCT_TYPES,
  fulfillProductTypeLabel,
  LEAD_SERVICE_KEYS,
  type FulfillProductType,
  type LeadServiceKey,
} from "@/shared/ui/lead-services";

const FIELD =
  "w-full min-h-[44px] rounded-xl px-4 py-3 text-sm text-white bg-white/[0.04] border border-white/12 " +
  "placeholder:text-white/35 transition-colors focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-[var(--fx-blue)] focus-visible:border-[var(--fx-blue)] aria-[invalid=true]:border-[var(--fx-orange)]";
const FIELD_LABEL = "block font-mono text-[10px] uppercase tracking-wider text-white/45 mb-2";

export default function FulfillConsultationForm({
  lang,
  copy,
}: Readonly<{ lang: Locale; copy: MarketingCopy }>) {
  const t = tFrom(copy);
  const uid = useId();
  const [productType, setProductType] = useState<FulfillProductType | "">("");
  // Fixed primary = fulfill; adjacent interests are optional secondaries (land-and-expand).
  const [secondary, setSecondary] = useState<LeadServiceKey[]>([]);
  const [status, setStatus] = useState<{ tone: "error" | "ok"; text: string } | null>(null);
  const adjacentServices = LEAD_SERVICE_KEYS.filter((s) => s !== "fulfill");

  const lead = useLeadSubmission({ lang, sourcePage: "/thg-fulfill" });
  const { form, setField, markTouched, nameInvalid, emailInvalid, pending, done, turnstile } = lead;
  const { widgetRef, siteKey, enabled: captchaEnabled, onSuccess, onError, onExpire } = turnstile;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);
    const result = await lead.submit({
      primaryService: "fulfill",
      serviceInterests: ["fulfill", ...secondary],
      surface: "fulfill-inline",
      detailsByService: buildDetailsByService("fulfill", productType),
    });
    if (result.ok) {
      setStatus({ tone: "ok", text: t("lead_form.success_toast") });
    } else if (result.error) {
      setStatus({ tone: "error", text: t(LEAD_ERROR_COPY_KEY[result.error]) });
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#121214] p-8 md:p-10 text-center" data-testid="fulfill-consult-success">
        <CheckCircle2 className="w-11 h-11 mx-auto mb-4" style={{ color: "var(--fx-green)" }} aria-hidden="true" />
        <h3 className="text-white font-bold text-xl mb-2">{t("lead_form.success_title")}</h3>
        <p className="text-sm max-w-[36ch] mx-auto" style={{ color: "#9ca3af" }}>
          {t("lead_form.success_desc_before")}
          <strong className="text-white">{form.email}</strong>
          {t("lead_form.success_desc_after")}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      data-testid="fulfill-consult-form"
      className="rounded-3xl border border-white/10 bg-[#121214] p-7 md:p-9 shadow-2xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor={`${uid}-name`} className={FIELD_LABEL}>
            {t("lead_form.name_label")} *
          </label>
          <input
            id={`${uid}-name`}
            className={FIELD}
            autoComplete="name"
            required
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            onBlur={() => markTouched("name")}
            placeholder={t("lead_form.name_placeholder")}
            disabled={pending}
            aria-invalid={nameInvalid || undefined}
          />
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className={FIELD_LABEL}>
            {t("lead_form.email_label")} *
          </label>
          <input
            id={`${uid}-email`}
            className={FIELD}
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            onBlur={() => markTouched("email")}
            placeholder={t("lead_form.email_placeholder")}
            disabled={pending}
            aria-invalid={emailInvalid || undefined}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor={`${uid}-phone`} className={FIELD_LABEL}>
            {t("lead_form.phone_label")}
          </label>
          <input
            id={`${uid}-phone`}
            className={FIELD}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={40}
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            placeholder={t("lead_form.phone_placeholder")}
            disabled={pending}
          />
        </div>
        <div>
          <label htmlFor={`${uid}-ptype`} className={FIELD_LABEL}>
            {t("lead_form.product_type_label")}
          </label>
          <select
            id={`${uid}-ptype`}
            className={FIELD}
            value={productType}
            onChange={(e) => setProductType(e.target.value as FulfillProductType | "")}
            disabled={pending}
          >
            <option value="">—</option>
            {FULFILL_PRODUCT_TYPES.map((pt) => (
              <option key={pt} value={pt} className="text-black">
                {fulfillProductTypeLabel(lang, pt)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-5 text-white/80">
        <AdditionalInterests
          legend={t("lead_form.also_interested")}
          services={adjacentServices}
          selected={secondary}
          onToggle={(service, checked) =>
            setSecondary((prev) => (checked ? [...prev, service] : prev.filter((s) => s !== service)))
          }
          copy={copy}
          disabled={pending}
          labelClassName="text-white/80"
        />
      </div>

      <div className="mb-6">
        <label htmlFor={`${uid}-message`} className={FIELD_LABEL}>
          {t("lead_form.message_label")}
        </label>
        <textarea
          id={`${uid}-message`}
          className={`${FIELD} min-h-[100px] resize-none`}
          value={form.message}
          onChange={(e) => setField("message", e.target.value)}
          placeholder={t("lead_form.message_placeholder")}
          disabled={pending}
        />
      </div>

      {captchaEnabled && (
        <div className="flex justify-center mb-5" data-testid="fulfill-consult-turnstile">
          <Turnstile
            ref={widgetRef}
            siteKey={siteKey}
            onSuccess={onSuccess}
            onError={onError}
            onExpire={onExpire}
            options={{ theme: "dark", size: "normal" }}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-magnetic w-full bg-white text-[var(--fx-ink)] font-bold py-4 rounded-xl flex justify-center items-center gap-2 disabled:opacity-70"
      >
        {pending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
        {pending ? t("lead_form.submitting") : t("lead_form.submit")}
      </button>

      <p
        className="text-center font-mono text-[10px] mt-4 min-h-[1em]"
        role="status"
        aria-live="polite"
        style={{ color: status?.tone === "ok" ? "var(--fx-green)" : "var(--fx-orange)" }}
      >
        {status?.text ?? ""}
      </p>
      <p className="text-[10px] text-center text-white/40 mt-2">{t("lead_form.consent")}</p>
    </form>
  );
}
