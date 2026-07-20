import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck } from "lucide-react";

import { isSupportedLocale, type Locale } from "@/shared/i18n";
import { getMarketingCopy } from "@/shared/i18n/server/get-marketing-copy";
import { tFrom } from "@/shared/i18n/marketing";
import { loadCommunityQuestion } from "@/features/community";
import { CommunityDetailShell } from "@/features/community/ui/community-shell";
import { CategoryChip, VerifiedBadge } from "@/features/community/ui/community-badges";
import { CommunityUnavailableState } from "@/features/community/ui/community-states";
import { UgcBody } from "@/features/community/ui/ugc-body";
import { formatPublishedAt } from "@/features/community/ui/format-date";
import { buildCommunityMetadata, safeDescription } from "@/features/community/ui/community-metadata";
import { SameIssueButton } from "@/features/community/client/same-issue-button";
import { ShareButton } from "@/features/community/client/share-button";
import { WithdrawButton } from "@/features/community/client/withdraw-button";

// Question detail. Dynamic SSR — no build-time params, because the set of published
// questions changes without a deploy.
//
// dynamicParams MUST be true and MUST be declared here: the [lang] layout sets it to
// false (it enumerates exactly three locales via generateStaticParams), and that value
// otherwise applies down the segment tree, which would 404 every question slug.
export const dynamicParams = true;
export const revalidate = 60;

type PageProps = Readonly<{ params: Promise<{ lang: string; slug: string }> }>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isSupportedLocale(lang)) return {};

  const [copy, result] = await Promise.all([getMarketingCopy(lang), loadCommunityQuestion(slug)]);
  const t = tFrom(copy);

  // Unknown, pending, rejected and withdrawn all land here. notFound() is raised HERE,
  // not only in the page body: [lang]/loading.tsx puts a streaming Suspense boundary
  // above this route, so a notFound() thrown during the page render happens after the
  // 200 headers have already flushed and degrades into a soft 404. Metadata is resolved
  // before the stream opens, so raising it here produces a real HTTP 404.
  if (result.status === "not-found") notFound();

  // An outage keeps the route renderable, but must not leak a title or become indexable.
  if (result.status !== "ready") {
    return buildCommunityMetadata({
      lang,
      routeId: "/community",
      title: `${t("community.title")} — THG Fulfill`,
      description: t("community.subtitle"),
    });
  }

  return buildCommunityMetadata({
    lang,
    routeId: `/community/${result.question.slug}`,
    title: `${result.question.title} — THG Fulfill`,
    description: safeDescription(result.question.body, t("community.subtitle")),
  });
}

export default async function CommunityQuestionPage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!isSupportedLocale(lang)) notFound();

  const [copy, result] = await Promise.all([getMarketingCopy(lang), loadCommunityQuestion(slug)]);
  const t = tFrom(copy);

  const backLink = (
    <Link
      prefetch={false}
      href={`/${lang}/community`}
      className="inline-flex items-center gap-2 text-[length:var(--step-small)] font-semibold text-primary transition-colors hover:text-gold-dark"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {t("community.back")}
    </Link>
  );

  // A real 404, not a soft-404 body with a 200 status: the CMS deliberately returns the
  // same not-found answer for unknown, pending, rejected and withdrawn slugs.
  if (result.status === "not-found") notFound();

  if (result.status === "unavailable") {
    return (
      <CommunityDetailShell>
        {backLink}
        <div className="mt-8">
          <CommunityUnavailableState message={t("community.unavailable")} />
        </div>
      </CommunityDetailShell>
    );
  }

  const question = result.question;
  const published = formatPublishedAt(question.publishedAt, lang as Locale);

  return (
    <CommunityDetailShell>
      {backLink}

      <article className="mt-8">
        <div className="flex flex-wrap items-center gap-2">
          {question.category && <CategoryChip name={question.category.name} />}
          {question.verified && <VerifiedBadge label={t("community.verified_badge")} />}
        </div>

        <h1 className="mt-4 text-[length:var(--step-h2)] font-bold leading-tight tracking-tight text-navy break-words">
          {question.title}
        </h1>

        <p className="mt-3 text-[length:var(--step-small)] text-muted-foreground">
          {t("community.asked_by")} {question.authorName}
          {published && (
            <>
              {" · "}
              <time dateTime={new Date(question.publishedAt ?? 0).toISOString()}>{published}</time>
            </>
          )}
        </p>

        <UgcBody text={question.body} className="mt-6" />

        {question.expertAnswer ? (
          <section className="mt-10 rounded-r-lg border-l-4 border-primary bg-card p-6">
            <p className="flex items-center gap-2 text-[length:var(--step-label)] font-bold uppercase tracking-[var(--tracking-wide)] text-primary">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              {t("community.expert_badge")}
            </p>
            <UgcBody text={question.expertAnswer} className="mt-3" />
          </section>
        ) : (
          <p className="mt-10 rounded-lg bg-muted p-6 text-muted-foreground">
            {t("community.awaiting_answer")}
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <SameIssueButton slug={question.slug} initialCount={question.sameIssueCount} copy={copy} />
          <ShareButton path={`/${lang}/community/${question.slug}`} copy={copy} />
          <WithdrawButton slug={question.slug} kind="question" lang={lang as Locale} copy={copy} />
        </div>
      </article>
    </CommunityDetailShell>
  );
}
