// Community question detail — SEO-governed per Business Plan §4:
//   * noindex unless the CMS says `indexable` (published AND verified AND non-empty expert answer)
//   * QAPage JSON-LD only when an expert answer exists
//   * UGC body/answer rendered through SafeHtml with the UGC link policy
//     (rel="ugc nofollow noopener noreferrer")
//   * Share button copies a UTM-tagged link (Share Loop)

import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BadgeCheck, Link2, Tag, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import Navbar from "@/components/Navbar";
import { CommunityStateNotice, CommunityWithdrawButton } from "@/components/community/communityPageBits";
import { useCommunityWithdraw } from "@/components/community/communityWithdraw";
import { JsonLdBreadcrumb, JsonLdQaPage } from "@/components/seo/JsonLd";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { useCommunityQuestion } from "@/hooks/useCmsContent";
import { cmsClient } from "@/lib/cmsClient";
import { useI18n } from "@/lib/i18n";
import { SafeHtml } from "@/lib/sanitizeHtml";

// Share Loop campaign constants (identify community shares in analytics —
// not environment-specific, so they live here rather than in .env).
const SHARE_UTM = "utm_source=community&utm_medium=share&utm_campaign=community_share";

// Remembers reacted slugs so a revisit doesn't re-offer the button (server
// dedupes by hashed IP anyway — this is UX, not enforcement).
const SAME_ISSUE_STORE = "thg_community_same_issue_v1";

const DATE_LOCALES: Record<string, string> = { vi: "vi-VN", en: "en-US", zh: "zh-CN" };

function hasReacted(slug: string): boolean {
  try {
    const raw = localStorage.getItem(SAME_ISSUE_STORE);
    return raw ? (JSON.parse(raw) as string[]).includes(slug) : false;
  } catch {
    return false;
  }
}

function rememberReacted(slug: string): void {
  try {
    const raw = localStorage.getItem(SAME_ISSUE_STORE);
    const list = raw ? (JSON.parse(raw) as string[]) : [];
    if (!list.includes(slug)) localStorage.setItem(SAME_ISSUE_STORE, JSON.stringify([...list, slug]));
  } catch {
    /* localStorage may be blocked — server-side dedupe still applies */
  }
}

const CommunityQuestionPage = () => {
  const { t, language } = useI18n();
  const { slug = "" } = useParams<{ slug: string }>();
  const query = useCommunityQuestion(slug);
  const [reacted, setReacted] = useState(() => hasReacted(slug));
  const [count, setCount] = useState<number | null>(null);
  const [reactPending, setReactPending] = useState(false);
  const withdraw = useCommunityWithdraw({
    ownerKey: slug,
    withdraw: (token) => cmsClient.postCommunityWithdraw(slug, token),
    confirmText: t("community.withdraw_confirm"),
    doneText: t("community.withdraw_done"),
    errorText: t("community.form_err_generic"),
    listQueryKey: ["cms", "community", "questions"],
    redirectTo: `/${language}/community`,
  });

  const q = query.data?.question;
  const sameIssueCount = count ?? q?.same_issue_count ?? 0;

  async function onSameIssue() {
    setReactPending(true);
    try {
      const res = await cmsClient.postCommunitySameIssue(slug);
      setCount(res.same_issue_count);
      setReacted(true);
      rememberReacted(slug);
      toast.success(t("community.same_issue_done"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("community.form_err_generic"));
    } finally {
      setReactPending(false);
    }
  }

  async function onShare() {
    const url = `${globalThis.location.origin}/${language}/community/${slug}?${SHARE_UTM}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t("community.share_copied"));
    } catch {
      toast.error(t("community.form_err_generic"));
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={q ? `${q.title} — THG Fulfill` : `${t("community.title")} — THG Fulfill`}
        description={q ? q.body.replace(/\s+/g, " ").slice(0, 160) : t("community.subtitle")}
        path={`/community/${slug}`}
        // Index governance: thin/unverified/unanswered content stays out of
        // Google. While loading (or on 404) we also emit noindex — safe default.
        noindex={!q?.indexable}
      />
      {q?.indexable && q.expert_answer && (
        <JsonLdQaPage
          question={q.title}
          text={q.body}
          url={`https://thgfulfill.com/${language}/community/${q.slug}`}
          authorName={q.author_name}
          expertAnswer={q.expert_answer}
          publishedAt={q.published_at}
          upvoteCount={q.same_issue_count}
        />
      )}
      {q && (
        <JsonLdBreadcrumb
          items={[
            { name: "Home", url: "https://thgfulfill.com/" },
            { name: t("community.title"), url: "https://thgfulfill.com/community" },
            { name: q.title, url: `https://thgfulfill.com/community/${q.slug}` },
          ]}
        />
      )}
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            to={`/${language}/community`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> {t("community.back")}
          </Link>

          {query.isLoading && <CommunityStateNotice>{t("community.loading")}</CommunityStateNotice>}
          {query.isError && <CommunityStateNotice>{t("community.not_found")}</CommunityStateNotice>}

          {q && (
            <article>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {q.category && (
                  <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                    <Tag className="w-3 h-3" aria-hidden="true" /> {q.category.name}
                  </span>
                )}
                {q.verified && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
                    <BadgeCheck className="w-3 h-3" aria-hidden="true" /> {t("community.verified_badge")}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-navy tracking-tight mb-2">
                {q.title}
              </h1>
              <p className="text-xs text-muted-foreground mb-6">
                {t("community.asked_by")} {q.author_name}
                {q.published_at && ` · ${new Date(q.published_at * 1000).toLocaleDateString(DATE_LOCALES[language] ?? "en-US")}`}
              </p>

              <SafeHtml
                ugc
                html={q.body}
                className="text-foreground/90 leading-relaxed whitespace-pre-wrap mb-8"
              />

              {q.expert_answer ? (
                <div className="glass-card rounded-2xl p-6 border-l-4 border-primary mb-8">
                  <p className="text-xs font-bold text-primary uppercase tracking-wide mb-3 inline-flex items-center gap-1">
                    <BadgeCheck className="w-4 h-4" aria-hidden="true" /> {t("community.expert_badge")}
                  </p>
                  <SafeHtml
                    ugc
                    html={q.expert_answer}
                    className="text-foreground/90 leading-relaxed whitespace-pre-wrap"
                  />
                </div>
              ) : (
                <div className="rounded-2xl bg-secondary/40 p-6 text-sm text-muted-foreground mb-8">
                  {t("community.awaiting_answer")}
                </div>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                <Button
                  variant={reacted ? "secondary" : "default"}
                  disabled={reacted || reactPending}
                  onClick={onSameIssue}
                  className="gap-2"
                >
                  <Users className="w-4 h-4" aria-hidden="true" />
                  {reacted ? t("community.same_issue_done") : t("community.same_issue")}
                  {sameIssueCount > 0 && <span className="font-bold">({sameIssueCount})</span>}
                </Button>
                <Button variant="outline" onClick={onShare} className="gap-2">
                  <Link2 className="w-4 h-4" aria-hidden="true" /> {t("community.share")}
                </Button>
                {withdraw.owned && (
                  <CommunityWithdrawButton
                    label={t("community.withdraw")}
                    pending={withdraw.pending}
                    onWithdraw={withdraw.onWithdraw}
                  />
                )}
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityQuestionPage;
