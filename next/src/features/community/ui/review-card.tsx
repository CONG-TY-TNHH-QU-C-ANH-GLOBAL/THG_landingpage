import Link from "next/link";

import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import type { Locale } from "@/shared/i18n";
import type { ReviewSummary } from "../models/review";
import { CategoryChip, RatingStars, VerifiedBadge } from "./community-badges";
import { formatPublishedAt } from "./format-date";

export function ReviewCard({
  review,
  lang,
  copy,
}: Readonly<{ review: ReviewSummary; lang: Locale; copy: MarketingCopy }>) {
  const t = tFrom(copy);
  const published = formatPublishedAt(review.publishedAt, lang);

  return (
    <li>
      <Link
        prefetch={false}
        href={`/${lang}/community/reviews/${review.slug}`}
        className="block rounded-2xl border border-border/60 bg-card p-6 transition-colors hover:border-primary/40"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-[length:var(--step-h4)] font-semibold leading-snug text-navy break-words">
            {review.title}
          </h2>
          <RatingStars rating={review.rating} />
        </div>

        <p className="mt-2 line-clamp-3 text-[length:var(--step-small)] leading-relaxed text-muted-foreground break-words">
          {review.excerpt}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {review.category && <CategoryChip name={review.category.name} />}
          {review.verified && <VerifiedBadge label={t("community.verified_badge")} />}
        </div>

        {published && (
          <time
            dateTime={new Date(review.publishedAt ?? 0).toISOString()}
            className="mt-4 block text-[length:var(--step-small)] text-muted-foreground"
          >
            {published}
          </time>
        )}
      </Link>
    </li>
  );
}
