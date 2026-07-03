// Community Verified Reviews list — curated seller trust page (published +
// verified reviews only; the CMS never exposes pending/rejected/withdrawn).

import { Link } from "react-router-dom";
import { BadgeCheck, Star, Tag } from "lucide-react";
import { useState } from "react";

import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";
import { CommunityTabs } from "@/components/community/CommunityTabs";
import { SubmitReviewDialog } from "@/components/community/SubmitReviewDialog";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { useCommunityCategories, useCommunityReviews } from "@/hooks/useCmsContent";
import { useI18n } from "@/lib/i18n";

const CommunityReviewsPage = () => {
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
          <ScrollReveal>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">
                {t("community.eyebrow")}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-navy tracking-tight">
                {t("reviews.title")}
              </h1>
              <p className="text-muted-foreground mt-3">{t("reviews.subtitle")}</p>
              <div className="mt-6">
                <SubmitReviewDialog
                  trigger={
                    <Button size="lg" className="gap-2">
                      <Star className="w-5 h-5" aria-hidden="true" />
                      {t("reviews.share_button")}
                    </Button>
                  }
                />
              </div>
            </div>
          </ScrollReveal>

          <CommunityTabs active="reviews" />

          <ScrollReveal delay={100}>
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
              <button
                onClick={() => setActiveCategory(undefined)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory ? "bg-secondary text-foreground/70 hover:bg-secondary/80" : "bg-primary text-primary-foreground shadow-lg"}`}
              >
                {t("community.cat_all")}
              </button>
              {(categories.data?.categories ?? []).map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setActiveCategory(c.slug)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === c.slug ? "bg-primary text-primary-foreground shadow-lg" : "bg-secondary text-foreground/70 hover:bg-secondary/80"}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {list.isLoading && (
            <div className="text-center text-muted-foreground py-12">{t("reviews.loading")}</div>
          )}
          {!list.isLoading && reviews.length === 0 && (
            <div className="max-w-xl mx-auto text-center py-12">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 grid place-items-center mb-4">
                <BadgeCheck className="w-7 h-7 text-primary" aria-hidden="true" />
              </div>
              <p className="text-lg font-semibold text-navy">{t("reviews.empty_title")}</p>
              <p className="text-muted-foreground mt-2">{t("reviews.empty_desc")}</p>
            </div>
          )}

          <div className="max-w-3xl mx-auto space-y-4">
            {reviews.map((r, i) => (
              <ScrollReveal key={r.slug} delay={i * 60}>
                <Link
                  to={`/${language}/community/reviews/${r.slug}`}
                  className="glass-card rounded-2xl p-6 block group cursor-pointer hover-lift"
                >
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {r.category && (
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                        <Tag className="w-3 h-3" aria-hidden="true" /> {r.category.name}
                      </span>
                    )}
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
                        <BadgeCheck className="w-3 h-3" aria-hidden="true" /> {t("community.verified_badge")}
                      </span>
                    )}
                    {r.rating != null && (
                      <span className="inline-flex items-center gap-0.5 text-amber-500" aria-label={`${r.rating}/5`}>
                        {Array.from({ length: 5 }, (_, s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${s < r.rating! ? "fill-amber-400" : "fill-none text-muted-foreground/40"}`}
                            aria-hidden="true"
                          />
                        ))}
                      </span>
                    )}
                  </div>
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

export default CommunityReviewsPage;
