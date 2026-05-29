// Shared job-detail render (hero quick-facts + benefits/bonuses/responsibilities/
// requirements/apply). Used by the /careers/:slug page (primary, shareable URL).
// Extracted from the old CareersPage modal so list + detail stay in sync.

import { useI18n } from "@/lib/i18n";
import { isPastDeadline } from "@/lib/deadline";
import { SafeHtml } from "@/lib/sanitizeHtml";
import { ApplicantFormDialog } from "@/components/careers/ApplicantFormDialog";
import type { Job } from "@/lib/careers";

interface Props {
  job: Job;
  accent: string;
  /** source_page recorded with the applicant submission. */
  sourcePage?: string;
}

export function JobDetailContent({ job, accent, sourcePage }: Props) {
  const { t, language } = useI18n();
  const source = sourcePage ?? `/careers/${job.id}`;

  const postedLabel = language === "en" ? "Posted" : language === "zh" ? "发布日期" : "Ngày đăng";
  const postedValue = job.postedAt
    ? new Date(job.postedAt * 1000).toLocaleDateString(
        language === "en" ? "en-US" : language === "zh" ? "zh-CN" : "vi-VN",
        { year: "numeric", month: "short", day: "numeric" },
      )
    : null;

  const quickFacts = [
    { l: t("careers.modal_salary"), v: `${job.salary} ${job.salaryUnit}` },
    { l: t("careers.modal_exp"), v: job.experience },
    { l: t("careers.modal_type"), v: job.type },
    { l: t("careers.modal_loc"), v: job.location },
    { l: t("careers.stat4_label"), v: job.deadline },
    ...(postedValue ? [{ l: postedLabel, v: postedValue }] : []),
  ];

  return (
    <div className="bg-white rounded-[22px] shadow-sm border border-border overflow-hidden">
      {/* Hero */}
      <div className="p-8 md:p-14 pb-8 border-b border-border relative" style={{ background: `linear-gradient(180deg, ${accent}0F, white)` }}>
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: accent }} />
        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded" style={{ background: `${accent}15`, color: accent }}>{job.badge}</span>
        <div className="text-sm font-bold italic mt-4" style={{ color: accent }}>{job.tagline}</div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-navy mt-1.5 tracking-tight">{job.title}</h1>
        <p className="text-muted-foreground text-[15.5px] max-w-2xl mt-3.5 leading-relaxed">{job.lead || job.desc}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-7 pt-6 border-t border-dashed border-border">
          {quickFacts.map((qi, i) => (
            <div key={i}>
              <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{qi.l}</div>
              <div className="text-navy font-bold mt-1 text-sm">{qi.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-8 md:p-14 space-y-9">
        {/* Benefits */}
        <div>
          <h2 className="text-xl font-extrabold text-navy flex items-center gap-3 mb-4"><span className="w-[5px] h-[22px] rounded" style={{ background: accent }} /> 💎 {t("careers.modal_ben_title") || "Quyền lợi hấp dẫn"}</h2>
          <div className="rounded-2xl p-6 mb-5" style={{ background: `linear-gradient(135deg, ${accent}0C, hsl(36 30% 96%))`, border: `1px solid ${accent}30` }}>
            <div className="flex items-center gap-4 flex-wrap mb-4">
              <div className="text-3xl font-extrabold text-navy leading-tight">{job.salary}<span className="block text-primary font-bold text-[15px] mt-0.5">{job.salaryUnit}</span></div>
              {job.salaryNote && <span className="bg-white border border-border rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold text-navy">{job.salaryNote}</span>}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {job.benefits.map((b, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-border hover:-translate-y-0.5 transition-transform">
                  <div className="text-xl mb-2">{b.i}</div>
                  <div className="text-sm font-bold text-navy">{b.t}</div>
                  <div className="text-[12.5px] text-muted-foreground mt-1">{b.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bonuses */}
        <div>
          <h2 className="text-xl font-extrabold text-navy flex items-center gap-3 mb-4"><span className="w-[5px] h-[22px] rounded" style={{ background: accent }} /> 🎯 {t("careers.modal_bonus_title") || "Hệ thống thưởng & hoa hồng"}</h2>
          <div className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, rgba(201,163,106,0.06), transparent)", border: "1px solid rgba(201,163,106,0.2)" }}>
            <SafeHtml
              as="p"
              className="text-muted-foreground text-sm leading-relaxed mb-3.5"
              html={t("careers.modal_bonus_desc") || 'Ngoài lương cứng và hoa hồng cơ bản, THG áp dụng <strong class="text-navy">hệ thống thưởng đa tầng</strong> để ghi nhận nỗ lực:'}
            />
            <ul className="space-y-2">
              {job.bonuses.map((b, i) => (
                <li key={i} className="text-navy text-[13.5px] leading-relaxed pl-6 relative">
                  <span className="absolute left-1 top-[5px] text-primary font-bold">✓</span>{b}
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground text-[12.5px] mt-3.5 pt-3.5 border-t border-dashed border-border italic">{t("careers.modal_bonus_note") || "* Chi tiết mức thưởng và điều kiện cụ thể sẽ được trao đổi trong buổi phỏng vấn."}</p>
          </div>
        </div>

        {/* Responsibilities */}
        <div>
          <h2 className="text-xl font-extrabold text-navy flex items-center gap-3 mb-4"><span className="w-[5px] h-[22px] rounded" style={{ background: accent }} /> 📋 {t("careers.modal_resp_title") || "Mô tả công việc"}</h2>
          {Object.entries(job.responsibilities).map(([heading, items]) => (
            <div key={heading} className="mb-5">
              <div className="text-[12.5px] font-bold text-navy uppercase tracking-[0.1em] mb-3 flex items-center gap-2.5 after:content-[''] after:flex-1 after:h-px after:bg-border">{heading}</div>
              <ul className="space-y-2.5">
                {items.map((item, i) => (
                  <li key={i} className="text-muted-foreground text-[14.5px] leading-relaxed pl-6 relative">
                    <span className="absolute left-1 top-[9px] w-2 h-2 rounded-full opacity-25" style={{ background: accent, boxShadow: `0 0 0 3px ${accent}20` }} />{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Requirements */}
        <div>
          <h2 className="text-xl font-extrabold text-navy flex items-center gap-3 mb-4"><span className="w-[5px] h-[22px] rounded" style={{ background: accent }} /> ✅ {t("careers.modal_req") || "Yêu cầu ứng viên"}</h2>
          <ul className="space-y-2.5">
            {job.requirements.map((r, i) => (
              <li key={i} className="text-muted-foreground text-[14.5px] leading-relaxed pl-6 relative">
                <span className="absolute left-1 top-[9px] w-2 h-2 rounded-full opacity-25" style={{ background: accent, boxShadow: `0 0 0 3px ${accent}20` }} />{r}
              </li>
            ))}
          </ul>
        </div>

        {/* Apply */}
        <div>
          <h2 className="text-xl font-extrabold text-navy flex items-center gap-3 mb-4"><span className="w-[5px] h-[22px] rounded" style={{ background: accent }} /> 📩 {t("careers.modal_apply") || "Ứng tuyển ngay"}</h2>
          <div className="bg-navy text-white rounded-2xl p-8 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute -right-24 -bottom-24 w-72 h-72 rounded-full bg-gradient-radial from-primary/10 to-transparent" />
            <div className="relative z-10">
              <h3 className="text-xl font-extrabold">{t("careers.modal_apply_title")}</h3>
              <SafeHtml as="p" className="text-white/70 text-[13.5px] mt-1.5" html={t("careers.modal_apply_desc")} />
            </div>
            {isPastDeadline(job.deadline) ? (
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-red-500/15 border border-red-400/30 text-red-300 px-4 py-3 rounded-xl text-sm font-semibold">
                  ⏰ {t("careers.expired") || "Vị trí này đã hết hạn nộp hồ sơ"} ({job.deadline})
                </div>
              </div>
            ) : (
              <div className="flex gap-2.5 flex-wrap relative z-10">
                <ApplicantFormDialog
                  jobSlug={job.id}
                  jobTitle={job.title}
                  sourcePage={source}
                  trigger={
                    <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3.5 rounded-full font-bold text-sm shadow-lg transition-all hover:-translate-y-0.5">📩 {t("careers.modal_btn_apply")}</button>
                  }
                />
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=careers@thgfulfill.com" target="_blank" rel="noopener noreferrer">
                  <button className="bg-transparent border border-white/25 text-white hover:border-[hsl(var(--gold))] hover:text-[hsl(var(--gold))] px-5 py-3.5 rounded-full font-semibold text-sm transition-all">📧 {t("careers.modal_btn_email")}</button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
