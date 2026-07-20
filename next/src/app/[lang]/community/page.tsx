import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageCircleQuestion } from "lucide-react";

import { isSupportedLocale, type Locale } from "@/shared/i18n";
import { getMarketingCopy } from "@/shared/i18n/server/get-marketing-copy";
import { tFrom } from "@/shared/i18n/marketing";
import { loadCommunityCategories, loadCommunityQuestions } from "@/features/community";
import { CommunityShell } from "@/features/community/ui/community-shell";
import { CategoryFilter } from "@/features/community/ui/category-filter";
import { QuestionCard } from "@/features/community/ui/question-card";
import { CommunityEmptyState, CommunityUnavailableState } from "@/features/community/ui/community-states";
import { buildCommunityMetadata } from "@/features/community/ui/community-metadata";
import { AskQuestionDialog } from "@/features/community/client/ask-question-dialog";

// Community Q&A listing. Server Component: the header, filter chips and the whole
// question list are in the SSR payload, so the page is fully readable and navigable with
// JavaScript disabled. The only island is the Ask Question dialog.
export const revalidate = 15;

type PageProps = Readonly<{
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

/** A repeated ?category= yields an array; take the first so the filter stays single-valued. */
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
    routeId: "/community",
    title: `${t("community.title")} — THG Fulfill`,
    description: t("community.subtitle"),
  });
}

export default async function CommunityPage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) notFound();
  const category = readCategory((await searchParams).category);

  const [copy, categories, result] = await Promise.all([
    getMarketingCopy(lang),
    loadCommunityCategories(),
    loadCommunityQuestions(category),
  ]);
  const t = tFrom(copy);

  return (
    <CommunityShell
      lang={lang as Locale}
      copy={copy}
      active="qa"
      eyebrow={t("community.eyebrow")}
      title={t("community.title")}
      subtitle={t("community.subtitle")}
      action={<AskQuestionDialog lang={lang as Locale} copy={copy} categories={categories} />}
    >
      <CategoryFilter
        basePath={`/${lang}/community`}
        categories={categories}
        active={category}
        copy={copy}
      />

      <div className="mt-8">
        {result.status === "unavailable" ? (
          <CommunityUnavailableState message={t("community.unavailable")} />
        ) : result.status === "empty" ? (
          <CommunityEmptyState icon={MessageCircleQuestion} title={t("community.empty")} />
        ) : (
          <ul className="space-y-4">
            {result.questions.map((question) => (
              <QuestionCard key={question.slug} question={question} lang={lang as Locale} copy={copy} />
            ))}
          </ul>
        )}
      </div>
    </CommunityShell>
  );
}
