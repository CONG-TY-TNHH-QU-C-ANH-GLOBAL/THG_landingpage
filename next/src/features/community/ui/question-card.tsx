import Link from "next/link";
import { Users } from "lucide-react";

import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import type { Locale } from "@/shared/i18n";
import type { QuestionSummary } from "../models/question";
import { CategoryChip, ExpertBadge, VerifiedBadge } from "./community-badges";
import { formatPublishedAt } from "./format-date";

// List row. The whole card is one link so the tap target is the full row on mobile;
// everything inside is non-interactive text, so no nested-interactive a11y problem.

export function QuestionCard({
  question,
  lang,
  copy,
}: Readonly<{ question: QuestionSummary; lang: Locale; copy: MarketingCopy }>) {
  const t = tFrom(copy);
  const published = formatPublishedAt(question.publishedAt, lang);

  return (
    <li>
      <Link
        prefetch={false}
        href={`/${lang}/community/${question.slug}`}
        className="block rounded-2xl border border-border/60 bg-card p-6 transition-colors hover:border-primary/40"
      >
        <h2 className="text-[length:var(--step-h4)] font-semibold leading-snug text-navy break-words">
          {question.title}
        </h2>

        <p className="mt-2 line-clamp-3 text-[length:var(--step-small)] leading-relaxed text-muted-foreground break-words">
          {question.excerpt}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {question.category && <CategoryChip name={question.category.name} />}
          {question.verified && <VerifiedBadge label={t("community.verified_badge")} />}
          {question.hasExpertAnswer && <ExpertBadge label={t("community.expert_badge")} />}
        </div>

        {(question.sameIssueCount > 0 || published) && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[length:var(--step-small)] text-muted-foreground">
            {question.sameIssueCount > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
                {question.sameIssueCount} × {t("community.same_issue")}
              </span>
            )}
            {published && <time dateTime={new Date(question.publishedAt ?? 0).toISOString()}>{published}</time>}
          </div>
        )}
      </Link>
    </li>
  );
}
