// Internal Community navigation — Q&A vs Verified Reviews. Kept as in-page tabs
// (not extra navbar entries) so the marketing navbar stays uncrowded.

import { Link } from "react-router-dom";
import { MessageCircleQuestion, Star } from "lucide-react";

import { useI18n } from "@/lib/i18n";

type Tab = "qa" | "reviews";

export function CommunityTabs({ active }: Readonly<{ active: Tab }>) {
  const { t, language } = useI18n();
  const base = `/${language}/community`;
  const tabs = [
    { key: "qa" as const, to: base, label: t("community.tab_qa"), Icon: MessageCircleQuestion },
    { key: "reviews" as const, to: `${base}/reviews`, label: t("community.tab_reviews"), Icon: Star },
  ];
  return (
    <nav aria-label={t("community.tabs_aria")} className="flex justify-center gap-2 mb-8">
      {tabs.map(({ key, to, label, Icon }) => {
        const isActive = key === active;
        return (
          <Link
            key={key}
            to={to}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isActive
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-secondary text-foreground/70 hover:bg-secondary/80"
            }`}
          >
            <Icon className="w-4 h-4" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
