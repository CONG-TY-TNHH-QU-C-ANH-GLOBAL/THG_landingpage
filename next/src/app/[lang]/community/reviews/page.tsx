import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCheck } from "lucide-react";

import { isSupportedLocale, type Locale } from "@/shared/i18n";
import { getMarketingCopy } from "@/shared/i18n/server/get-marketing-copy";
import { tFrom } from "@/shared/i18n/marketing";
import { loadCommunityCategories, loadCommunityReviews } from "@/features/community";
import { CommunityShell } from "@/features/community/ui/community-shell";
import { CategoryFilter } from "@/features/community/ui/category-filter";
import { ReviewCard } from "@/features/community/ui/review-card";
import { CommunityEmptyState, CommunityUnavailableState } from "@/features/community/ui/community-states";
import { buildCommunityMetadata } from "@/features/community/ui/community-metadata";
import { SubmitReviewDialog } from "@/features/community/client/submit-review-dialog";

// Verified reviews listing. `reviews` is a real directory segment and therefore outranks
// the sibling `[slug]` question route — same precedence the Vite router gave it.
export const revalidate = 15;

type PageProps = Readonly<{
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

function readCategory(raw: string | string[] | undefined): string | undefined {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value?.trim() || undefined;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) return {};
  const copy = await getMarketingCopy(lang);
  const t = tFrom(copy);
  return buildCommunityMetadata({
    lang,
    routeId: "/community/reviews",
    title: `${t("reviews.title")} — THG Fulfill`,
    description: t("reviews.subtitle"),
  });
}

export default async function CommunityReviewsPage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) notFound();
  const category = readCategory((await searchParams).category);

  const [copy, categories, result] = await Promise.all([
    getMarketingCopy(lang),
    loadCommunityCategories(),
    loadCommunityReviews(category),
  ]);
  const t = tFrom(copy);

  return (
    <CommunityShell
      lang={lang as Locale}
      copy={copy}
      active="reviews"
      eyebrow={t("community.eyebrow")}
      title={t("reviews.title")}
      subtitle={t("reviews.subtitle")}
      action={<SubmitReviewDialog lang={lang as Locale} copy={copy} categories={categories} />}
    >
      <CategoryFilter
        basePath={`/${lang}/community/reviews`}
        categories={categories}
        active={category}
        copy={copy}
      />

      <div className="mt-8">
        {result.status === "unavailable" ? (
          <CommunityUnavailableState message={t("reviews.unavailable")} />
        ) : result.status === "empty" ? (
          <CommunityEmptyState
            icon={BadgeCheck}
            title={t("reviews.empty_title")}
            description={t("reviews.empty_desc")}
          />
        ) : (
          <ul className="space-y-4">
            {result.reviews.map((review) => (
              <ReviewCard key={review.slug} review={review} lang={lang as Locale} copy={copy} />
            ))}
          </ul>
        )}
      </div>
    </CommunityShell>
  );
}
