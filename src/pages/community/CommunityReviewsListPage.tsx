// Community Verified Reviews list — curated seller trust page (published +
// verified reviews only; the CMS never exposes pending/rejected/withdrawn).

import { Link } from "react-router-dom";
import { BadgeCheck, Star } from "lucide-react";
import { useState } from "react";

import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";
import { CommunityTabs } from "@/components/community/CommunityTabs";
import {
  CommunityCategoryFilters,
  CommunityEmptyState,
  CommunityPageHeader,
  CommunityReviewBadges,
  CommunityStateNotice,
} from "@/components/community/communityPageBits";
import { SubmitReviewDialog } from "@/components/community/SubmitReviewDialog";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { useCommunityCategories, useCommunityReviews } from "@/hooks/useCmsContent";
import { useI18n } from "@/lib/i18n";

const CommunityReviewsListPage = () => {
  const { t, language } = useI18n();
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);

  const categories = useCommunityCategories();
  const list = useCommunityReviews(activeCategory);
  const reviews = list.data?.reviews ?? [];

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={`${t("reviews.title")} — THG Fulfill`}
        description={t("reviews.subtitle")}
        path="/community/reviews"
      />
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://thgfulfill.com/" },
          { name: t("community.eyebrow"), url: "https://thgfulfill.com/community" },
          { name: t("reviews.title"), url: "https://thgfulfill.com/community/reviews" },
        ]}
      />
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <CommunityPageHeader
            eyebrow={t("community.eyebrow")}
            title={t("reviews.title")}
            subtitle={t("reviews.subtitle")}
            action={
              <SubmitReviewDialog
                trigger={
                  <Button size="lg" className="gap-2">
                    <Star className="w-5 h-5" aria-hidden="true" />
                    {t("reviews.share_button")}
                  </Button>
                }
              />
            }
          />

          <CommunityTabs active="reviews" />

          <ScrollReveal delay={100}>
            <CommunityCategoryFilters
              categories={categories.data?.categories ?? []}
              active={activeCategory}
              onSelect={setActiveCategory}
            />
          </ScrollReveal>

          {list.isLoading && <CommunityStateNotice>{t("reviews.loading")}</CommunityStateNotice>}
          {!list.isLoading && reviews.length === 0 && (
            <CommunityEmptyState
              icon={BadgeCheck}
              title={t("reviews.empty_title")}
              description={t("reviews.empty_desc")}
            />
          )}

          <div className="max-w-3xl mx-auto space-y-4">
            {reviews.map((r, i) => (
              <ScrollReveal key={r.slug} delay={i * 60}>
                <Link
                  to={`/${language}/community/reviews/${r.slug}`}
                  className="glass-card rounded-2xl p-6 block group cursor-pointer hover-lift"
                >
                  <CommunityReviewBadges category={r.category} verified={r.verified} rating={r.rating} />
                  <h2 className="text-lg font-bold text-navy tracking-tight group-hover:text-primary transition-colors">
                    {r.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1 line-clamp-2">
                    {r.excerpt}
                  </p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityReviewsListPage;
