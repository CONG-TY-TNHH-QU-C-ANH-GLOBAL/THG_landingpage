"use client";

// Final conversion — private consultation intake + THG Community Knowledge Loop
// (Open Design artifact "CONVERSION", IMPLEMENTATION_BASELINE.md "Consultation
// (private lead) vs. Community (public UGC) ownership").
//
// Contract (verified directly against CMS routes/api/v1/(public)/leads): the payload
// is exactly the existing LeadFormDialog payload — name*, email*, phone?, message?,
// source_page, locale, utm, turnstile_token. The prototype's Primary-Market and
// Service-Interest fields are NOT on the /leads contract and are therefore omitted
// entirely (no fake selectors that appear saved but are discarded). Phone is a single
// optional string on the contract (max 40), so it stays one tel input — the
// prototype's calling-code combobox is a documented visual deviation.
//
// Community separation, by construction: the Knowledge Loop's only action is a plain
// locale-aware link to the existing Community entry point — no query params, no
// prefill, no PII transfer, in either pre- or post-submit state.
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

import type { Locale } from "@/shared/i18n";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import { postLead } from "@/shared/ui/lead-api";
import { useTurnstile } from "@/shared/ui/use-turnstile";
import { getUtmPayload } from "@/shared/ui/utm";
import styles from "./conversion.module.css";

const FIELD_CLASS =
  "w-full min-h-[44px] rounded-md px-3.5 py-2.5 text-base text-white bg-white/[0.06] border border-white/20 " +
  "placeholder:text-white/35 transition-colors focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-[hsl(var(--gold-light))] focus-visible:border-[hsl(var(--gold-light))] " +
  "aria-[invalid=true]:border-red-400/80";
const LABEL_CLASS = "block text-[11px] uppercase tracking-[0.05em] text-white/55 mb-1.5 font-medium";

// Deterministic linear-time email shape check (Sonar S5852: the previous single
// regex backtracked super-linearly on hostile input). Same accept/reject set as
// /^[^\s@]+@[^\s@]+\.[^\s@]+$/: exactly one "@", non-empty local part, a domain
// dot with characters on both sides, and no whitespace anywhere.
function isEmailish(value: string): boolean {
  const s = value.trim();
  const at = s.indexOf("@");
  if (at <= 0 || at !== s.lastIndexOf("@") || at === s.length - 1) return false;
  if (/\s/.test(s)) return false;
  const dot = s.lastIndexOf(".");
  return dot > at + 1 && dot < s.length - 1;
}

/** Reserved-space field error: always occupies its line so a field never shifts
 *  layout when it turns invalid (IMPLEMENTATION_BASELINE.md consultation rules). */
function FieldError({ show, children }: Readonly<{ show: boolean; children: ReactNode }>) {
  return (
    <p className={`min-h-4 mt-1.5 text-[11.5px] leading-4 text-red-300 ${show ? "visible" : "invisible"}`}>
      {children}
    </p>
  );
}

interface KnowledgeLoopProps {
  readonly lang: Locale;
  readonly copy: MarketingCopy;
  readonly postSubmit: boolean;
}

function KnowledgeLoop({ lang, copy, postSubmit }: KnowledgeLoopProps) {
  const t = tFrom(copy);
  const loopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = loopRef.current;
    if (!el) return;
    // Default markup is the complete resolved path — without motion, add nothing.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    el.classList.add(styles.motion);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.inView);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const topics = [t("nav.thg_fulfill"), t("nav.thg_express"), t("nav.thg_warehouse"), t("nav.thg_order")];

  return (
    <div ref={loopRef} className={`${styles.loop} mt-auto pt-6 border-t border-white/10`} data-testid="knowledge-loop">
      <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-wide text-white/55 mb-2.5">
        <svg viewBox="0 0 24 24" className="w-[11px] h-[11px] fill-none stroke-[hsl(var(--gold-light))] stroke-2" aria-hidden="true">
          <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />
        </svg>
        {t("kl.badge")}
      </span>
      <h3 className="text-base font-bold text-white mb-1.5">{postSubmit ? t("kl.post_title") : t("kl.title")}</h3>
      <p className="text-[12.5px] text-white/55 leading-relaxed max-w-[38ch] mb-4">
        {postSubmit ? t("kl.post_desc") : t("kl.desc")}
      </p>

      <div className="flex items-start mb-4" aria-hidden="true">
        <div className={`${styles.klNode} ${styles.klNodeAsk}`}>
          <span className={styles.klIcon}>
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 9.3a2.5 2.5 0 0 1 5 0c0 1.6-2.5 2.1-2.5 3.7" />
              <circle cx="12" cy="16.5" r=".4" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className="text-[10.5px] font-semibold text-white/55">{t("kl.ask")}</span>
        </div>
        <div className={`${styles.klLine} ${styles.klLine1}`} />
        <div className={`${styles.klNode} ${styles.klNodeReview}`}>
          <span className={styles.klIcon}>
            <svg viewBox="0 0 24 24">
              <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </span>
          <span className="text-[10.5px] font-semibold text-white/55">{t("kl.review")}</span>
        </div>
        <div className={`${styles.klLine} ${styles.klLine2}`} />
        <div className={`${styles.klNode} ${styles.klNodeAnswer}`}>
          <span className={styles.klIcon}>
            <svg viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <path d="M8 9h8M8 13h5" />
            </svg>
          </span>
          <span className="text-[10.5px] font-semibold text-white/55">{t("kl.answer")}</span>
        </div>
      </div>

      {/* Static, non-interactive topic direction — real pillar names, no counts,
          no "trending" claims, no hrefs (IMPLEMENTATION_BASELINE.md). */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {topics.map((topic) => (
          <span key={topic} className="text-[11px] text-white/70 bg-white/5 border border-white/15 rounded-md px-2.5 py-1">
            {topic}
          </span>
        ))}
      </div>

      {/* Locale-aware link to the existing Community entry point — deliberately a plain
          navigation, never prefilled from consultation state (PII separation). */}
      <Link
        prefetch={false}
        href={`/${lang}/community`}
        data-testid="knowledge-loop-cta"
        className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold px-6 py-3 transition-all hover:shadow-[var(--shadow-glow)] hover:-translate-y-px group"
      >
        {t("kl.cta")}
        <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
      </Link>
      <p className="text-[11px] text-white/45 mt-2.5">{t("kl.micro")}</p>

      {postSubmit && (
        <div className="mt-3.5 pt-3.5 border-t border-white/10 space-y-1" data-testid="knowledge-loop-post-submit">
          <p className="text-[11px] text-white/45 leading-snug">{t("kl.sep1")}</p>
          <p className="text-[11px] text-white/45 leading-snug">{t("kl.sep2")}</p>
          <p className="text-[11px] text-white/45 leading-snug">{t("kl.sep3")}</p>
        </div>
      )}
    </div>
  );
}

interface ConversionSectionProps {
  readonly lang: Locale;
  readonly copy: MarketingCopy;
}

const ConversionSection = ({ lang, copy }: ConversionSectionProps) => {
  const t = tFrom(copy);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean }>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState("");
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

  const nameInvalid = Boolean(touched.name) && !form.name.trim();
  const emailInvalid = Boolean(touched.email) && !isEmailish(form.email);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name.trim() || !isEmailish(form.email)) {
      setTouched({ name: true, email: true });
      setStatus(t("lead_form.err_required"));
      return;
    }
    const token = resolveSubmitToken();
    if (!token) {
      setStatus(t("lead_form.err_captcha"));
      return;
    }
    setPending(true);
    setStatus(t("lead_form.submitting"));
    try {
      const utm = getUtmPayload();
      await postLead({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        message: form.message.trim() || undefined,
        source_page: typeof window !== "undefined" ? window.location.pathname : "/",
        locale: lang,
        utm: Object.keys(utm).length > 0 ? utm : undefined,
        turnstile_token: token,
      });
      setDone(true);
      setStatus(t("lead_form.success_title"));
    } catch {
      // Application-owned copy only — CMS response bodies/diagnostics never
      // reach the public UI (owner-accepted CodeRabbit security finding).
      setStatus(t("lead_form.err_generic"));
      resetForRetry();
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="get-started" className="py-28 relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="container mx-auto px-4">
        <div className="relative bg-gradient-dark text-white rounded-2xl p-7 md:p-12 overflow-hidden grid lg:grid-cols-[2fr_3fr] gap-10">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--gold-light)) 1px, transparent 0)",
              backgroundSize: "26px 26px",
            }}
          />

          {/* Aside — private-consultation narrative + Community Knowledge Loop.
              Two owned flows, deliberately separate (never merged). */}
          <div className="relative flex flex-col">
            <p className="text-sm font-semibold text-[hsl(var(--gold-light))] uppercase tracking-[0.2em] mb-4">
              {t("nav.consult")}
            </p>
            <h2 className="text-[length:var(--step-h2)] font-bold text-white leading-tight">{t("lead_form.title")}</h2>
            <p className="text-white/65 text-base leading-relaxed max-w-[38ch] mt-2.5 mb-5">{t("lead_form.desc")}</p>
            <Link
              prefetch={false}
              href="/catalog"
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/30 text-white text-sm font-semibold px-6 py-3 transition-colors hover:border-[hsl(var(--gold-light))] hover:text-[hsl(var(--gold-light))]"
            >
              {t("hero.cta")} <span aria-hidden="true">→</span>
            </Link>
            <p className="text-xs text-white/50 leading-relaxed max-w-[36ch] mt-5 pt-4 border-t border-white/10">
              {t("consult.privacy")}
            </p>

            <KnowledgeLoop lang={lang} copy={copy} postSubmit={done} />
          </div>

          {/* Consultation intake card — layered inset panel, real /leads contract. */}
          <div className="relative rounded-xl bg-white/5 border border-white/10 p-6 md:p-7 shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_18px_40px_-24px_rgb(0_0_0/0.5)]">
            <div className="mb-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.03em] text-white/50">{t("consult.kicker")}</span>
              <h3 className="text-base font-bold text-white mt-1">{t("contact.leave_info")}</h3>
            </div>

            <p className="sr-only" role="status" aria-live="polite" data-testid="consult-status">
              {status}
            </p>

            {done ? (
              <div className="text-center py-6" data-testid="consult-success">
                <span className="mx-auto mb-4 w-11 h-11 rounded-full border border-[hsl(var(--gold-light))] bg-[var(--gold-dim)] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-none stroke-[hsl(var(--gold-light))] stroke-2" aria-hidden="true">
                    <path d="M4 12l6 6L20 6" />
                  </svg>
                </span>
                <h4 className="text-white font-bold text-base mb-2">{t("lead_form.success_title")}</h4>
                <p className="text-white/65 text-[13px] leading-relaxed max-w-[36ch] mx-auto mb-3">
                  {t("lead_form.success_desc_before")}
                  <strong className="text-white">{form.email}</strong>
                  {t("lead_form.success_desc_after")}
                </p>
                <p className="text-white/45 text-xs max-w-[36ch] mx-auto mb-5">{t("consult.privacy")}</p>
                <Link
                  prefetch={false}
                  href="/catalog"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/30 text-white text-sm font-semibold px-6 py-3 transition-colors hover:border-[hsl(var(--gold-light))] hover:text-[hsl(var(--gold-light))]"
                >
                  {t("hero.cta")} <span aria-hidden="true">→</span>
                </Link>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate data-testid="consult-form">
                <div className="grid sm:grid-cols-2 gap-x-3.5">
                  <div className="mb-3">
                    <label htmlFor="consult-name" className={LABEL_CLASS}>
                      {t("lead_form.name_label")} <span className="text-[hsl(var(--gold-light))]">*</span>
                    </label>
                    <input
                      id="consult-name"
                      className={FIELD_CLASS}
                      autoComplete="name"
                      required
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      onBlur={() => setTouched((s) => ({ ...s, name: true }))}
                      placeholder={t("lead_form.name_placeholder")}
                      disabled={pending}
                      aria-invalid={nameInvalid || undefined}
                    />
                    <FieldError show={nameInvalid}>{t("consult.err_name")}</FieldError>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="consult-phone" className={LABEL_CLASS}>
                      {t("lead_form.phone_label")}
                    </label>
                    <input
                      id="consult-phone"
                      className={FIELD_CLASS}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      maxLength={40}
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder={t("lead_form.phone_placeholder")}
                      disabled={pending}
                    />
                    <FieldError show={false}>&nbsp;</FieldError>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="consult-email" className={LABEL_CLASS}>
                    {t("lead_form.email_label")} <span className="text-[hsl(var(--gold-light))]">*</span>
                  </label>
                  <input
                    id="consult-email"
                    className={FIELD_CLASS}
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    onBlur={() => setTouched((s) => ({ ...s, email: true }))}
                    placeholder={t("lead_form.email_placeholder")}
                    disabled={pending}
                    aria-invalid={emailInvalid || undefined}
                  />
                  <FieldError show={emailInvalid}>{t("consult.err_email")}</FieldError>
                </div>

                <div className="mb-4">
                  <label htmlFor="consult-message" className={LABEL_CLASS}>
                    {t("lead_form.message_label")}
                  </label>
                  <textarea
                    id="consult-message"
                    className={`${FIELD_CLASS} min-h-[72px] resize-y`}
                    rows={3}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder={t("lead_form.message_placeholder")}
                    disabled={pending}
                  />
                </div>

                <hr className="border-white/10 mb-3.5" />
                <p className="text-[11.5px] text-white/50 leading-relaxed mb-3.5">{t("lead_form.consent")}</p>

                {captchaEnabled && (
                  <div className="flex justify-center mb-3.5" data-testid="consult-turnstile">
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
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold px-6 py-3.5 transition-all hover:shadow-[var(--shadow-glow)] disabled:opacity-70 disabled:cursor-progress"
                >
                  {pending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                  {pending ? t("lead_form.submitting") : t("lead_form.submit")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConversionSection;
