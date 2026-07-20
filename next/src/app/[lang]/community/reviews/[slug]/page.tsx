import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck } from "lucide-react";

import { isSupportedLocale, type Locale } from "@/shared/i18n";
import { getMarketingCopy } from "@/shared/i18n/server/get-marketing-copy";
import { tFrom } from "@/shared/i18n/marketing";
import { loadCommunityReview } from "@/features/community";
import { CommunityDetailShell } from "@/features/community/ui/community-shell";
import { CategoryChip, RatingStars, VerifiedBadge } from "@/features/community/ui/community-badges";
import { CommunityUnavailableState } from "@/features/community/ui/community-states";
import { UgcBody } from "@/features/community/ui/ugc-body";
import { formatPublishedAt } from "@/features/community/ui/format-date";
import { buildCommunityMetadata, safeDescription } from "@/features/community/ui/community-metadata";
import { ShareButton } from "@/features/community/client/share-button";
import { WithdrawButton } from "@/features/community/client/withdraw-button";

// See the question detail route: the [lang] layout's dynamicParams = false would
// otherwise 404 every review slug.
export const dynamicParams = true;
export const revalidate = 60;

type PageProps = Readonly<{ params: Promise<{ lang: string; slug: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isSupportedLocale(lang)) return {};

  const [copy, result] = await Promise.all([getMarketingCopy(lang), loadCommunityReview(slug)]);
  const t = tFrom(copy);

  // Raised here rather than only in the page body so the response is a real HTTP 404 —
  // see the question detail route for why the streaming boundary makes this necessary.
  if (result.status === "not-found") notFound();

  if (result.status !== "ready") {
    return buildCommunityMetadata({
      lang,
      routeId: "/community/reviews",
      title: `${t("reviews.title")} — THG Fulfill`,
      description: t("reviews.subtitle"),
    });
  }

  return buildCommunityMetadata({
    lang,
    routeId: `/community/reviews/${result.review.slug}`,
    title: `${result.review.title} — THG Fulfill`,
    // The operator-authored summary is preferred over the raw review body when present.
    description: safeDescription(result.review.publicSummary ?? result.review.body, t("reviews.subtitle")),
  });
}

export default async function CommunityReviewDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!isSupportedLocale(lang)) notFound();

  const [copy, result] = await Promise.all([getMarketingCopy(lang), loadCommunityReview(slug)]);
  const t = tFrom(copy);

  const backLink = (
    <Link
      prefetch={false}
      href={`/${lang}/community/reviews`}
      className="inline-flex items-center gap-2 text-[length:var(--step-small)] font-semibold text-primary transition-colors hover:text-gold-dark"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {t("reviews.back")}
    </Link>
  );

  if (result.status === "not-found") notFound();

  if (result.status === "unavailable") {
    return (
      <CommunityDetailShell>
        {backLink}
        <div className="mt-8">
          <CommunityUnavailableState message={t("reviews.unavailable")} />
        </div>
      </CommunityDetailShell>
    );
  }

  const review = result.review;
  const published = formatPublishedAt(review.publishedAt, lang as Locale);

  return (
    <CommunityDetailShell>
      {backLink}

      <article className="mt-8">
        <div className="flex flex-wrap items-center gap-2">
          {review.category && <CategoryChip name={review.category.name} />}
          {review.verified && <VerifiedBadge label={t("community.verified_badge")} />}
        </div>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-[length:var(--step-h2)] font-bold leading-tight tracking-tight text-navy break-words">
            {review.title}
          </h1>
          <RatingStars rating={review.rating} />
        </div>

        <p className="mt-3 text-[length:var(--step-small)] text-muted-foreground">
          {t("reviews.by")} {review.reviewerName}
          {published && (
            <>
              {" · "}
              <time dateTime={new Date(review.publishedAt ?? 0).toISOString()}>{published}</time>
            </>
          )}
        </p>

        <UgcBody text={review.body} className="mt-6" />

        {review.publicSummary && (
          <section className="mt-10 rounded-r-lg border-l-4 border-primary bg-card p-6">
            <p className="flex items-center gap-2 text-[length:var(--step-label)] font-bold uppercase tracking-[var(--tracking-wide)] text-primary">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              {t("reviews.thg_summary")}
            </p>
            {/* Operator-authored, not UGC — same plain-text rendering for consistency. */}
            <UgcBody text={review.publicSummary} className="mt-3" />
          </section>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <ShareButton path={`/${lang}/community/reviews/${review.slug}`} copy={copy} />
          <WithdrawButton slug={review.slug} kind="review" lang={lang as Locale} copy={copy} />
        </div>
      </article>
    </CommunityDetailShell>
  );
}
