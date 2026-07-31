import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isSupportedLocale } from "@/shared/i18n";
import { getMarketingCopy } from "@/shared/i18n/server/get-marketing-copy";
import { tFrom } from "@/shared/i18n/marketing";
import {
  BreadcrumbJsonLd,
  JsonLdScript,
  buildPageMetadata,
  localeUrl,
  resolveSiteOrigin,
} from "@/shared/seo";
import {
  JobDetailView,
  JobUnavailable,
  isExpired,
  jobStaticParams,
  loadJob,
} from "@/features/careers";

// WEB-006 — /{lang}/careers/{slug}.
export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  return jobStaticParams();
}

type PageProps = Readonly<{ params: Promise<{ lang: string; slug: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isSupportedLocale(lang)) return {};
  const result = await loadJob(slug, lang);
  if (result.status !== "ready") return { robots: { index: false, follow: false } };

  const { job } = result;
  return buildPageMetadata({
    lang,
    routeId: `/careers/${slug}`,
    title: `${job.title} — THG Fulfill`,
    description: job.tagline ?? job.lead ?? `${job.title} — THG Fulfill`,
    // An expired vacancy stays reachable (its URL may be indexed and a silent 404 would be
    // worse) but must not keep competing in search as though it were open.
    indexable: !isExpired(job.deadline),
  });
}

export default async function JobPage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!isSupportedLocale(lang)) notFound();

  const [copy, result] = await Promise.all([getMarketingCopy(lang), loadJob(slug, lang)]);
  const t = tFrom(copy);

  if (result.status === "not-found") notFound();
  if (result.status === "unavailable") return <JobUnavailable copy={copy} lang={lang} />;

  const { job } = result;
  const canonical = localeUrl(lang, `/careers/${slug}`);
  const expired = isExpired(job.deadline);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t("nav.home"), url: localeUrl(lang, "/") },
          { name: t("nav.careers"), url: localeUrl(lang, "/careers") },
          { name: job.title, url: canonical },
        ]}
      />
      {/* JobPosting is emitted ONLY for a job that is still open. Google's guidelines treat a
          posting past its validThrough as ineligible, and emitting it for an expired role is
          exactly the structured-data violation that costs the whole domain its rich results. */}
      {!expired && (
        <JsonLdScript
          data={{
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: job.title,
            description: job.lead ?? job.tagline ?? job.title,
            datePosted: new Date(job.postedAt * 1000).toISOString().slice(0, 10),
            // Only when the operator's deadline actually parses as a date — an invalid
            // validThrough is worse than an absent one.
            validThrough:
              job.deadline && !Number.isNaN(Date.parse(job.deadline))
                ? new Date(job.deadline).toISOString().slice(0, 10)
                : undefined,
            employmentType: job.employmentType ?? undefined,
            hiringOrganization: {
              "@type": "Organization",
              name: "THG Fulfill",
              sameAs: resolveSiteOrigin(),
            },
            // jobLocation only when the CMS supplied one — a fabricated address would be a
            // false claim about where the role is based.
            jobLocation: job.location
              ? {
                  "@type": "Place",
                  address: { "@type": "PostalAddress", addressLocality: job.location },
                }
              : undefined,
            // No baseSalary: the CMS stores compensation as free text (`salary`,
            // `salary_unit`, `salary_note`), which cannot be turned into a structured
            // MonetaryAmount without inventing a currency and a unit.
            url: canonical,
          }}
        />
      )}
      <JobDetailView job={job} copy={copy} lang={lang} />
    </>
  );
}
