import Link from "next/link";

import type { MarketingCopy } from "@/shared/i18n/marketing";
import { tFrom } from "@/shared/i18n/marketing";
import type { Locale } from "@/shared/i18n";
import { MarkdownLines, splitSections } from "@/shared/ui/markdown";

import { isExpired, type JobDetail, type JobListResult, type JobSummary } from "../models/job";

// Composed WEB-006 views. Server Components.
//
// The Vite list had client-side category filter chips and opened the job in a modal. Neither
// is reproduced: every open job is rendered under its category heading (so the whole list is
// in the SSR HTML and crawlable) and the detail is a real route with its own URL, which is
// what JobPosting structured data requires anyway.
//
// The application dialog is CONV-002's and is not part of this slice — the detail page links
// to the canonical apply affordance rather than inlining an unowned form.

function Meta({ label, value }: Readonly<{ label: string; value: string | null }>) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-[13px]">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-navy">{value}</dd>
    </div>
  );
}

function JobCard({
  job,
  href,
  copy,
}: Readonly<{ job: JobSummary; href: string; copy: MarketingCopy }>) {
  const t = tFrom(copy);
  const expired = isExpired(job.deadline);
  return (
    <article className="rounded-2xl border border-border/60 bg-card p-5 transition-shadow hover:shadow-md">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {job.hot && !expired && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[12px] font-medium text-primary">
            {t("careers.hot")}
          </span>
        )}
        {job.badge && (
          <span className="rounded-full border border-[#d4b96a] px-2 py-0.5 text-[12px] text-navy">
            {job.badge}
          </span>
        )}
        {expired && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[12px] text-muted-foreground">
            {t("careers.expired_badge")}
          </span>
        )}
      </div>

      <h3 className="mb-1 text-[15px] font-semibold text-navy">
        <Link
          href={href}
          className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {job.title}
        </Link>
      </h3>
      {job.tagline && <p className="mb-3 text-[13px] text-muted-foreground">{job.tagline}</p>}

      <dl className="grid gap-1">
        <Meta label={t("careers.modal_loc")} value={job.location} />
        <Meta label={t("careers.modal_type")} value={job.employmentType} />
        <Meta label={t("careers.modal_salary")} value={job.salaryText} />
        <Meta label={t("careers.modal_exp")} value={job.experience} />
      </dl>
    </article>
  );
}

export function CareersList({
  result,
  copy,
  lang,
}: Readonly<{ result: JobListResult; copy: MarketingCopy; lang: Locale }>) {
  const t = tFrom(copy);

  // Group by category in CMS order; jobs with no category fall into one trailing group.
  const groups = new Map<string, JobSummary[]>();
  for (const job of result.jobs) {
    const key = job.category ?? t("careers.all_positions");
    groups.set(key, [...(groups.get(key) ?? []), job]);
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-5xl px-4 pt-28 pb-20 sm:px-6">
        <h1 className="mb-1 text-2xl font-semibold text-navy">{t("careers.hero_title_1")}</h1>
        <p className="mb-8 text-[13px] text-muted-foreground">{t("careers.hero_desc")}</p>

        {result.status === "unavailable" && (
          <p className="rounded-2xl border border-border/60 bg-card px-6 py-16 text-center text-muted-foreground">
            {t("careers.unavailable")}
          </p>
        )}
        {result.status === "empty" && (
          <p className="rounded-2xl border border-border/60 bg-card px-6 py-16 text-center text-muted-foreground">
            {t("careers.list_empty")}
          </p>
        )}

        {result.status === "ready" &&
          [...groups.entries()].map(([category, jobs]) => (
            <section key={category} className="mb-10">
              <h2 className="mb-4 text-lg font-semibold text-navy">{category}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {jobs.map((job) => (
                  <JobCard
                    key={job.slug}
                    job={job}
                    href={`/${lang}/careers/${job.slug}`}
                    copy={copy}
                  />
                ))}
              </div>
            </section>
          ))}
      </main>
    </div>
  );
}

export function JobDetailView({
  job,
  copy,
  lang,
}: Readonly<{ job: JobDetail; copy: MarketingCopy; lang: Locale }>) {
  const t = tFrom(copy);
  const expired = isExpired(job.deadline);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-4 pt-28 pb-20 sm:px-6">
        <Link
          href={`/${lang}/careers`}
          className="mb-6 inline-block text-[13px] text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          ← {t("careers.all_positions")}
        </Link>

        <h1 className="mb-1 text-2xl font-semibold text-navy">{job.title}</h1>
        {job.tagline && <p className="mb-4 text-[14px] text-muted-foreground">{job.tagline}</p>}

        {expired && (
          // Stated plainly rather than hiding the post: the URL may be indexed, and a silent
          // 404 or a live-looking page would both mislead.
          <p className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-3 text-[13px] text-amber-900">
            {t("careers.expired")}
          </p>
        )}

        <dl className="mb-6 grid gap-1 rounded-xl border border-border/60 bg-card p-4">
          <Meta label={t("careers.modal_loc")} value={job.location} />
          <Meta label={t("careers.modal_type")} value={job.employmentType} />
          <Meta label={t("careers.modal_salary")} value={job.salaryText} />
          <Meta label={t("careers.modal_exp")} value={job.experience} />
          <Meta label={t("careers.deadline")} value={job.deadline} />
        </dl>

        {job.lead && <p className="mb-6 text-[15px] leading-relaxed text-foreground/90">{job.lead}</p>}

        {job.bodyMarkdown.trim().length > 0 && (
          <div className="text-[15px] leading-relaxed text-foreground/90">
            {splitSections(job.bodyMarkdown).map((section) => (
              <div key={section.id}>
                {section.heading && (
                  <h2 className="mt-6 mb-2 text-lg font-semibold text-navy">{section.heading}</h2>
                )}
                <MarkdownLines
                  lines={section.lines}
                  baseHeadingLevel={3}
                  lineOffset={section.lineOffset}
                />
              </div>
            ))}
          </div>
        )}

        {job.responsibilities.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-navy">{t("careers.modal_resp_title")}</h2>
            {job.responsibilities.map((group) => (
              <div key={group.id} className="mb-4">
                <h3 className="mb-1 text-[15px] font-semibold text-navy">{group.heading}</h3>
                <ul className="list-disc space-y-1 pl-5 text-[14px] text-foreground/90">
                  {group.items.map((item) => (
                    <li key={item.id}>{item.text}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {job.requirements.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-navy">{t("careers.modal_req")}</h2>
            <ul className="list-disc space-y-1 pl-5 text-[14px] text-foreground/90">
              {job.requirements.map((item) => (
                <li key={item.id}>{item.text}</li>
              ))}
            </ul>
          </section>
        )}

        {job.benefits.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-navy">{t("careers.modal_ben_title")}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {job.benefits.map((benefit) => (
                <div key={benefit.id} className="rounded-xl border border-border/60 bg-card p-4">
                  <p className="mb-1 text-[14px] font-semibold text-navy">{benefit.title}</p>
                  <p className="text-[13px] text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {job.bonuses.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-navy">{t("careers.modal_bonus_title")}</h2>
            <ul className="list-disc space-y-1 pl-5 text-[14px] text-foreground/90">
              {job.bonuses.map((item) => (
                <li key={item.id}>{item.text}</li>
              ))}
            </ul>
          </section>
        )}

        {/* CONV-002 owns the application dialog. Until that slice lands, the page routes to
            the canonical contact surface rather than inlining an unowned form or an email
            address the CMS does not publish here. */}
        {!expired && (
          <p className="mt-10 rounded-xl border border-border/60 bg-card p-4 text-[14px]">
            {t("careers.modal_apply_desc")}{" "}
            <Link href={`/${lang}`} className="font-medium text-primary hover:underline">
              {t("nav.consult")}
            </Link>
          </p>
        )}
      </main>
    </div>
  );
}

export function JobUnavailable({
  copy,
  lang,
}: Readonly<{ copy: MarketingCopy; lang: Locale }>) {
  const t = tFrom(copy);
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-4 pt-28 pb-20 sm:px-6">
        <Link href={`/${lang}/careers`} className="mb-6 inline-block text-[13px] text-primary hover:underline">
          ← {t("careers.all_positions")}
        </Link>
        <p className="rounded-2xl border border-border/60 bg-card px-6 py-16 text-center text-muted-foreground">
          {t("careers.unavailable")}
        </p>
      </main>
    </div>
  );
}
