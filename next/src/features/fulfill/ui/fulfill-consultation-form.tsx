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

// P0 accessibility fix (Phase 0.2): the placeholder was `white/35` on a `#121214` card — ≈2.2:1,
// while several fields use the placeholder as their only hint, so the form was hard to complete.
// Labels were `white/45`. Both now clear AA against the raised navy surface. The field text is the
// 16px body step rather than 14px, which also stops iOS zooming the viewport on focus.
const FIELD =
  "w-full min-h-[44px] rounded-[var(--radius-sm)] px-4 py-3 text-[length:var(--step-body)] text-white " +
  "bg-white/[0.06] border border-white/[0.16] placeholder:text-white/[0.62] transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-transparent focus-visible:ring-[var(--ui-accent-text)] " +
  "focus-visible:border-[var(--ui-accent-text)] aria-[invalid=true]:border-[hsl(var(--destructive))]";
const FIELD_LABEL =
  "block font-mono text-[length:var(--step-label)] font-medium uppercase " +
  "tracking-[0.08em] text-white/[0.78] mb-2";

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
      /* The form unmounts on success, so without a live region the outcome is announced to nobody
         and focus falls to the document body. A polite region states it without stealing focus,
         which is the rule the planner's narrowing follows too. */
      <div
        className="rounded-[var(--radius-lg)] border border-[var(--ui-line)] bg-[var(--ui-surface)] p-8 md:p-10 text-center"
        data-testid="fulfill-consult-success"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2
          className="w-11 h-11 mx-auto mb-4"
          style={{ color: "var(--ui-accent-text)" }}
          aria-hidden="true"
        />
        <h3 className="text-white font-semibold text-[length:var(--step-h3)] mb-2">
          {t("lead_form.success_title")}
        </h3>
        <p
          className="text-[length:var(--step-body)] leading-relaxed max-w-[36ch] mx-auto"
          style={{ color: "var(--ui-muted)" }}
        >
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
      className="rounded-[var(--radius-lg)] border border-[var(--ui-line)] bg-[var(--ui-surface)] p-7 md:p-9 shadow-[var(--shadow-3)]"
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

      {/* The button keeps today's white fill (adopting the gold Primary rank is the Act-7 rebuild,
          PR 3.12). What changes here is accessibility: a visible focus ring on the dark surface, a
          real pressed state, and a 52px target. */}
      <button
        type="submit"
        disabled={pending}
        className="w-full min-h-[52px] bg-[var(--ui-contrast-surface)] text-[var(--ui-contrast-ink)] font-bold py-4 rounded-[var(--radius)] flex justify-center items-center gap-2 transition-[background-color,transform] duration-200 hover:bg-white/90 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ui-surface)] disabled:opacity-70"
      >
        {pending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
        {pending ? t("lead_form.submitting") : t("lead_form.submit")}
      </button>

      {/* Was 10px with min-height 1em, so a submission error could render as one near-invisible
          line and shift the layout. Now the 13.5px caption step with a reserved row. */}
      <p
        className="text-center font-mono text-[length:var(--step-small)] mt-4 min-h-[1.5rem]"
        role="status"
        aria-live="polite"
        style={{
          // The raw destructive hue is a mid red that fails on the navy panel; lifting it toward
          // white keeps the error legible without inventing a second error colour.
          color:
            status?.tone === "ok"
              ? "var(--ui-ink)"
              : "color-mix(in oklch, hsl(var(--destructive)) 68%, white)",
        }}
      >
        {status?.text ?? ""}
      </p>
      <p
        className="text-[length:var(--step-small)] text-center mt-2"
        style={{ color: "var(--ui-muted)" }}
      >
        {t("lead_form.consent")}
      </p>
    </form>
  );
}
