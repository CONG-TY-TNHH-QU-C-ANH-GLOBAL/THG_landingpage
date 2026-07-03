// Community review detail — SEO-governed like Q&A:
//   * noindex unless the CMS says `indexable` (published AND verified AND
//     non-thin body); while loading / on 404 we emit noindex (safe default)
//   * Review JSON-LD only when indexable AND a numeric rating exists
//   * review body rendered through SafeHtml with the UGC link policy
//     (rel="ugc nofollow noopener noreferrer")

import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BadgeCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import Navbar from "@/components/Navbar";
import { CommunityReviewBadges } from "@/components/community/communityPageBits";
import { JsonLdBreadcrumb, JsonLdReview } from "@/components/seo/JsonLd";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { useCommunityReview } from "@/hooks/useCmsContent";
import { cmsClient } from "@/lib/cmsClient";
import { forgetOwnerToken, getOwnerToken, reviewOwnerKey } from "@/lib/communityOwner";
import { useI18n } from "@/lib/i18n";
import { SafeHtml } from "@/lib/sanitizeHtml";

const DATE_LOCALES: Record<string, string> = { vi: "vi-VN", en: "en-US", zh: "zh-CN" };

const CommunityReviewPage = () => {
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { slug = "" } = useParams<{ slug: string }>();
  const query = useCommunityReview(slug);
  // Only the browser that submitted this review holds its (namespaced) token.
  const [owned, setOwned] = useState(() => Boolean(getOwnerToken(reviewOwnerKey(slug))));
  const [withdrawPending, setWithdrawPending] = useState(false);

  const r = query.data?.review;

  async function onWithdraw() {
    const token = getOwnerToken(reviewOwnerKey(slug));
    if (!token) return;
    if (!globalThis.confirm(t("reviews.withdraw_confirm"))) return;
    setWithdrawPending(true);
    try {
      await cmsClient.postCommunityReviewWithdraw(slug, token);
      forgetOwnerToken(reviewOwnerKey(slug));
      setOwned(false);
      await queryClient.invalidateQueries({ queryKey: ["cms", "community", "reviews"] });
      toast.success(t("reviews.withdraw_done"));
      navigate(`/${language}/community/reviews`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("community.form_err_generic"));
    } finally {
      setWithdrawPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={r ? `${r.title} — THG Fulfill` : `${t("reviews.title")} — THG Fulfill`}
        description={r ? r.body.replace(/\s+/g, " ").slice(0, 160) : t("reviews.subtitle")}
        path={`/community/reviews/${slug}`}
        noindex={!r?.indexable}
      />
      {r?.indexable && r.rating != null && (
        <JsonLdReview
          name={r.title}
          body={r.body}
          url={`https://thgfulfill.com/${language}/community/reviews/${r.slug}`}
          authorName={r.reviewer_name}
          rating={r.rating}
          publishedAt={r.published_at}
        />
      )}
      {r && (
        <JsonLdBreadcrumb
          items={[
            { name: "Home", url: "https://thgfulfill.com/" },
            { name: t("reviews.title"), url: "https://thgfulfill.com/community/reviews" },
            { name: r.title, url: `https://thgfulfill.com/community/reviews/${r.slug}` },
          ]}
        />
      )}
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            to={`/${language}/community/reviews`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> {t("reviews.back")}
          </Link>

          {query.isLoading && (
            <div className="text-center text-muted-foreground py-12">{t("reviews.loading")}</div>
          )}
          {query.isError && (
            <div className="text-center text-muted-foreground py-12">{t("reviews.not_found")}</div>
          )}

          {r && (
            <article>
              <CommunityReviewBadges
                category={r.category}
                verified={r.verified}
                rating={r.rating}
                className="flex items-center gap-2 flex-wrap mb-3"
                starClassName="w-4 h-4"
              />

              <h1 className="text-3xl md:text-4xl font-bold text-navy tracking-tight mb-2">
                {r.title}
              </h1>
              <p className="text-xs text-muted-foreground mb-6">
                {t("reviews.by")} {r.reviewer_name}
                {r.published_at && ` · ${new Date(r.published_at * 1000).toLocaleDateString(DATE_LOCALES[language] ?? "en-US")}`}
              </p>

              {r.public_summary && (
                <div className="glass-card rounded-2xl p-6 border-l-4 border-primary mb-8">
                  <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2 inline-flex items-center gap-1">
                    <BadgeCheck className="w-4 h-4" aria-hidden="true" /> {t("reviews.thg_summary")}
                  </p>
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{r.public_summary}</p>
                </div>
              )}

              <SafeHtml
                ugc
                html={r.body}
                className="text-foreground/90 leading-relaxed whitespace-pre-wrap mb-8"
              />

              {owned && (
                <div className="flex items-center gap-3 flex-wrap">
                  <Button
                    variant="ghost"
                    onClick={onWithdraw}
                    disabled={withdrawPending}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" /> {t("reviews.withdraw")}
                  </Button>
                </div>
              )}
            </article>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityReviewPage;
