import { BookOpen, Box, CheckCircle2, Plane, Ship } from "lucide-react";

import { useI18n } from "@/lib/i18n";

export function ChinhNgachRateGuide() {
  const { t } = useI18n();

  const modes = [
    { icon: Ship, title: t("chinhngach.guide_matson"), detail: t("chinhngach.guide_matson_desc"), tone: "bg-[#FFF8E7] border-primary/35" },
    { icon: Ship, title: t("chinhngach.guide_sea"), detail: t("chinhngach.guide_sea_desc"), tone: "bg-sky-50 border-sky-200" },
    { icon: Plane, title: t("chinhngach.guide_air"), detail: t("chinhngach.guide_air_desc"), tone: "bg-violet-50 border-violet-200" },
  ];

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-[#142b4c] to-[#1c3b63] p-5 text-white sm:p-7">
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-primary/10" />
        <div className="relative flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-navy">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">{t("chinhngach.guide_badge")}</p>
            <h3 className="mt-1 text-xl font-black sm:text-2xl">{t("chinhngach.guide_title")}</h3>
            <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-white/70">{t("chinhngach.guide_desc")}</p>
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-[var(--pricing-border)] bg-white p-4 sm:p-5">
        <h4 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">{t("chinhngach.guide_modes_title")}</h4>
        <div className="grid gap-3 md:grid-cols-3">
          {modes.map(({ icon: Icon, title, detail, tone }) => (
            <div key={title} className={`rounded-xl border p-4 ${tone}`}>
              <Icon className="mb-3 h-5 w-5 text-navy" aria-hidden="true" />
              <p className="text-[13px] font-black text-navy">{title}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-foreground/65">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-center gap-2 text-emerald-900">
            <Box className="h-5 w-5" aria-hidden="true" />
            <h4 className="font-black">{t("chinhngach.guide_lcl_title")}</h4>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-emerald-950/70">{t("chinhngach.guide_lcl_desc")}</p>
        </div>
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-5">
          <div className="flex items-center gap-2 text-sky-950">
            <Ship className="h-5 w-5" aria-hidden="true" />
            <h4 className="font-black">{t("chinhngach.guide_fcl_title")}</h4>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-sky-950/70">{t("chinhngach.guide_fcl_desc")}</p>
        </div>
        <div className="rounded-xl border border-primary/35 bg-[#FFF8E7] px-4 py-3 text-[13px] text-navy md:col-span-2">
          <strong>{t("chinhngach.guide_rule_label")}</strong> {t("chinhngach.guide_rule")}
        </div>
      </section>

      <section className="rounded-xl border border-[var(--pricing-border)] bg-white p-4 sm:p-5">
        <h4 className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">{t("chinhngach.guide_read_title")}</h4>
        <ol className="grid gap-3 md:grid-cols-3">
          {[1, 2, 3].map((step) => (
            <li key={step} className="flex gap-3 rounded-xl border border-navy/10 bg-[#FAFAF8] p-4">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy text-[12px] font-black text-primary">{step}</span>
              <div>
                <p className="text-[13px] font-black text-navy">{t(`chinhngach.guide_step_${step}_title`)}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{t(`chinhngach.guide_step_${step}_desc`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-[var(--pricing-border)] bg-white p-4 sm:p-5">
        <h4 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">{t("chinhngach.guide_glossary")}</h4>
        <dl className="grid gap-2 sm:grid-cols-2">
          {["wm", "cfs", "etd", "fcl"].map((key) => (
            <div key={key} className="rounded-lg border border-navy/10 bg-[#FAFAF8] px-3.5 py-3">
              <dt className="flex items-center gap-1.5 text-[12px] font-black text-navy">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                {t(`chinhngach.guide_term_${key}`)}
              </dt>
              <dd className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">{t(`chinhngach.guide_term_${key}_desc`)}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
