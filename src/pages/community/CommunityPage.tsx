// Community Hub list page — curated seller Q&A (published questions only;
// the CMS never exposes pending/rejected submissions on the public API).

import { Link } from "react-router-dom";
import { BadgeCheck, MessageCircleQuestion, Tag, Users } from "lucide-react";
import { useState } from "react";

import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";
import { AskQuestionDialog } from "@/components/community/AskQuestionDialog";
import { CommunityTabs } from "@/components/community/CommunityTabs";
import {
  CommunityCategoryFilters,
  CommunityEmptyState,
  CommunityPageHeader,
  CommunityStateNotice,
} from "@/components/community/communityPageBits";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { useCommunityCategories, useCommunityQuestions } from "@/hooks/useCmsContent";
import { useI18n } from "@/lib/i18n";

const CommunityPage = () => {
  const { t, language } = useI18n();
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);

  const categories = useCommunityCategories();
  const list = useCommunityQuestions(activeCategory);
  const questions = list.data?.questions ?? [];

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={`${t("community.title")} — THG Fulfill`}
        description={t("community.subtitle")}
        path="/community"
      />
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://thgfulfill.com/" },
          { name: t("community.title"), url: "https://thgfulfill.com/community" },
        ]}
      />
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <CommunityPageHeader
            eyebrow={t("community.eyebrow")}
            title={t("community.title")}
            subtitle={t("community.subtitle")}
            action={
              <AskQuestionDialog
                trigger={
                  <Button size="lg" className="gap-2">
                    <MessageCircleQuestion className="w-5 h-5" aria-hidden="true" />
                    {t("community.ask_button")}
                  </Button>
                }
              />
            }
          />

          <CommunityTabs active="qa" />

          <ScrollReveal delay={100}>
            <CommunityCategoryFilters
              categories={categories.data?.categories ?? []}
              active={activeCategory}
              onSelect={setActiveCategory}
            />
          </ScrollReveal>

          {list.isLoading && <CommunityStateNotice>{t("community.loading")}</CommunityStateNotice>}
          {!list.isLoading && questions.length === 0 && (
            <CommunityEmptyState icon={MessageCircleQuestion} title={t("community.empty")} />
          )}

          <div className="max-w-3xl mx-auto space-y-4">
            {questions.map((q, i) => (
              <ScrollReveal key={q.slug} delay={i * 60}>
                <Link
                  to={`/${language}/community/${q.slug}`}
                  className="glass-card rounded-2xl p-6 block group cursor-pointer hover-lift"
                >
                  <div className="flex items-center gap-2 flex-wrap mb-2">
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
                    {q.has_expert_answer && (
                      <span className="inline-flex items-center gap-1 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-medium">
                        {t("community.expert_badge")}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-navy tracking-tight group-hover:text-primary transition-colors">
                    {q.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1 line-clamp-2">
                    {q.excerpt}
                  </p>
                  {q.same_issue_count > 0 && (
                    <p className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-3">
                      <Users className="w-3 h-3" aria-hidden="true" />
                      {q.same_issue_count} × {t("community.same_issue")}
                    </p>
                  )}
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
