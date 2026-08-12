"use client";

// 05 · Gửi vận đơn — the lead form, and beside it the exact package Sales receives.
//
// The payload panel is the point of this section: it is not a decorative summary, it is the real
// request rendered field by field, so the seller can see there is nothing else being collected.
// That honesty only holds if it stays true, which is why every row below is read from the same
// model the submit path uses — never re-typed.
//
// Contract reuse: this is the shared `useLeadSubmission` engine (the one behind the global dialog
// and the Fulfill inline form), the shared Turnstile controller and the shared multi-intent lead
// keys. The corridor invents no endpoint and no field of its own; the two dimensions it can type
// (sourcing → primary service, lane → adjacent interest) go in typed, and the three it cannot go
// in as the free-text context under the seller's own note.
import { useState, type FormEvent } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

import { localize } from "@/shared/i18n";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import { useLeadSubmission } from "@/shared/ui/use-lead-submission";
import { WAYBILL } from "../content";
import { buildWaybillPayload } from "../model/corridor-state";
import { comboLabel, corridorLeadContext, corridorLeadIntent } from "../model/lead-mapping";
import { useCorridor } from "./corridor-provider.client";
import styles from "./corridor.module.css";

/** Where this lead came from, in the two vocabularies the platform already has. */
const SOURCE_PAGE = "home-corridor";
const SURFACE = "home-conversion-inline";

export function WaybillSection({ copy }: Readonly<{ copy: MarketingCopy }>) {
  const t = tFrom(copy);
  const { lang, answers, recommendation, waybillCode } = useCorridor();
  const [status, setStatus] = useState("");

  const lead = useLeadSubmission({ lang, sourcePage: SOURCE_PAGE });
  const { form, setField, markTouched, nameInvalid, emailInvalid, pending, done, turnstile } = lead;
  const { widgetRef, siteKey, enabled: captchaEnabled, onSuccess, onError, onExpire } = turnstile;

  const intent = corridorLeadIntent(recommendation);
  const combo = comboLabel(lang, recommendation);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await lead.submit({
      primaryService: intent.primaryService,
      serviceInterests: intent.serviceInterests,
      surface: SURFACE,
      messageContext: corridorLeadContext(
        lang,
        answers,
        recommendation,
        localize(lang, WAYBILL.contextHeading),
      ),
    });
    if (result.ok) setStatus(t("lead_form.success_title"));
    else if (result.error === "required") setStatus(t("lead_form.err_required"));
    else if (result.error === "captcha") setStatus(t("lead_form.err_captcha"));
    else if (result.error) setStatus(t("lead_form.err_generic"));
  }

  // Exactly what the request will carry, in the order the dossier shows it. Composed by the model
  // (which owns row identity) rather than assembled here, so this panel cannot mint a key.
  const payloadRows = buildWaybillPayload({
    lang,
    copy,
    answers,
    recommendation,
    waybillCode,
    contact: { name: form.name, email: form.email, phone: form.phone },
    sourcePage: SOURCE_PAGE,
  });

  return (
    <section className={styles.room} id="waybill">
      <div className={styles.form}>
        <p className={styles.roomNumber}>{localize(lang, WAYBILL.eyebrow)}</p>
        <h2 className={styles.roomTitle}>{localize(lang, WAYBILL.heading)}</h2>
        <p className={styles.roomLede}>{localize(lang, WAYBILL.lede)}</p>

        <p className="sr-only" role="status" aria-live="polite" data-testid="waybill-status">
          {pending ? t("lead_form.submitting") : status}
        </p>

        <div className={styles.formGrid}>
          {done ? (
            <div className={styles.sent} data-testid="waybill-success">
              <h3 className={styles.sentTitle}>{t("lead_form.success_title")}</h3>
              <p>
                {t("lead_form.success_desc_before")}
                <b className={styles.emphasis}>{form.email}</b>
                {t("lead_form.success_desc_after")}
              </p>
              <p className={styles.formNote}>{t("consult.privacy")}</p>
            </div>
          ) : (
            <form className={styles.fields} onSubmit={onSubmit} noValidate data-testid="waybill-form">
              <label className={styles.field}>
                <span>{t("lead_form.name_label")} *</span>
                <input
                  type="text"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  onBlur={() => markTouched("name")}
                  placeholder={t("lead_form.name_placeholder")}
                  disabled={pending}
                  aria-invalid={nameInvalid || undefined}
                />
                <span className={styles.fieldError}>{nameInvalid ? t("consult.err_name") : ""}</span>
              </label>

              <label className={styles.field}>
                <span>{t("lead_form.email_label")} *</span>
                <input
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
                <span className={styles.fieldError}>{emailInvalid ? t("consult.err_email") : ""}</span>
              </label>

              <label className={styles.field}>
                <span>{t("lead_form.phone_label")}</span>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={40}
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder={t("lead_form.phone_placeholder")}
                  disabled={pending}
                />
              </label>

              <label className={styles.field}>
                <span>{t("lead_form.message_label")}</span>
                <textarea
                  rows={2}
                  value={form.message}
                  onChange={(e) => setField("message", e.target.value)}
                  placeholder={t("lead_form.message_placeholder")}
                  disabled={pending}
                />
              </label>

              <p className={styles.formNote}>{t("lead_form.consent")}</p>

              {captchaEnabled && (
                <div className={styles.captcha} data-testid="waybill-turnstile">
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

              <button type="submit" className={styles.primaryAction} disabled={pending}>
                {pending
                  ? t("lead_form.submitting")
                  : `${localize(lang, WAYBILL.dossierSend)}${combo ? ` · ${combo}` : ""}`}
              </button>
            </form>
          )}

          <div className={styles.payload}>
            <h3>{localize(lang, WAYBILL.payloadHeading)}</h3>
            {payloadRows.map((row) => (
              <div key={row.key} className={styles.payloadRow}>
                <span className={styles.payloadKey}>{row.label}</span>
                <span className={`${styles.payloadValue} ${row.value ? "" : styles.payloadEmpty}`}>
                  {row.value || "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
