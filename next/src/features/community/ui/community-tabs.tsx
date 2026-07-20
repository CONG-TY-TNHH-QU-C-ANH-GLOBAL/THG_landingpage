import Link from "next/link";

import { cn } from "@/shared/ui/cn";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import type { Locale } from "@/shared/i18n";

// Q&A / Reviews switch. Plain links, not buttons: they work without JavaScript and are
// crawlable. Kept as in-page tabs rather than extra navbar entries so the marketing
// navbar stays uncrowded (the navbar links both destinations from its Community menu).

export function CommunityTabs({
  lang,
  copy,
  active,
}: Readonly<{ lang: Locale; copy: MarketingCopy; active: "qa" | "reviews" }>) {
  const t = tFrom(copy);
  const base = `/${lang}/community`;
  const tabs = [
    { key: "qa" as const, href: base, label: t("community.tab_qa") },
    { key: "reviews" as const, href: `${base}/reviews`, label: t("community.tab_reviews") },
  ];

  return (
    <nav aria-label={t("community.tabs_aria")} className="flex justify-center">
      <div className="inline-flex rounded-lg border border-border bg-card p-1">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            prefetch={false}
            href={tab.href}
            aria-current={tab.key === active ? "page" : undefined}
            className={cn(
              "rounded-md px-5 py-2 text-[length:var(--step-nav)] font-semibold transition-colors",
              tab.key === active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-navy",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
