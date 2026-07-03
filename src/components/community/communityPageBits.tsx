// Shared presentational bits for the community list/detail pages (Q&A +
// Reviews): category chip bar, badge row, page hero header, and the
// loading/error/empty state shells. Data fetching, SEO and navigation stay
// in the pages.

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { BadgeCheck, Star, Tag, Trash2 } from "lucide-react";

import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

type CategoryRef = { slug: string; name: string };

/** Centered hero (eyebrow + h1 + subtitle + action) shared by the community list pages. */
export function CommunityPageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: Readonly<{
  eyebrow: string;
  title: string;
  subtitle: string;
  action?: ReactNode;
}>) {
  return (
    <ScrollReveal>
      <div className="text-center mb-10">
        <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-4">{eyebrow}</p>
        <h1 className="text-4xl md:text-5xl font-bold text-navy tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-3">{subtitle}</p>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </ScrollReveal>
  );
}

/** Muted centered notice for loading/error states on community pages. */
export function CommunityStateNotice({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="text-center text-muted-foreground py-12">{children}</div>;
}

/** Icon-chip empty state shared by the community list pages. */
export function CommunityEmptyState({
  icon: Icon,
  title,
  description,
}: Readonly<{
  icon: LucideIcon;
  title: string;
  description?: string;
}>) {
  return (
    <div className="max-w-xl mx-auto text-center py-12">
      <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 grid place-items-center mb-4">
        <Icon className="w-7 h-7 text-primary" aria-hidden="true" />
      </div>
      <p className="text-lg font-semibold text-navy">{title}</p>
      {description && <p className="text-muted-foreground mt-2">{description}</p>}
    </div>
  );
}

/** "All" + per-category chip bar shared by the Q&A and Reviews list pages. */
export function CommunityCategoryFilters({
  categories,
  active,
  onSelect,
}: Readonly<{
  categories: CategoryRef[];
  active: string | undefined;
  onSelect: (slug: string | undefined) => void;
}>) {
  const { t } = useI18n();
  const chip = (isActive: boolean) =>
    `px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
      isActive ? "bg-primary text-primary-foreground shadow-lg" : "bg-secondary text-foreground/70 hover:bg-secondary/80"
    }`;
  return (
    <div className="flex flex-wrap gap-2 mb-10 justify-center">
      <button onClick={() => onSelect(undefined)} className={chip(!active)}>
        {t("community.cat_all")}
      </button>
      {categories.map((c) => (
        <button key={c.slug} onClick={() => onSelect(c.slug)} className={chip(active === c.slug)}>
          {c.name}
        </button>
      ))}
    </div>
  );
}

/** Category + verified + rating-stars badge row shared by the review list card
 *  and the review detail header. Star / margin sizes are the only visual
 *  difference between the two, so they stay props. */
export function CommunityReviewBadges({
  category,
  verified,
  rating,
  className = "flex items-center gap-2 flex-wrap mb-2",
  starClassName = "w-3.5 h-3.5",
}: Readonly<{
  category?: CategoryRef | null;
  verified: boolean;
  rating: number | null;
  className?: string;
  starClassName?: string;
}>) {
  const { t } = useI18n();
  return (
    <div className={className}>
      {category && (
        <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
          <Tag className="w-3 h-3" aria-hidden="true" /> {category.name}
        </span>
      )}
      {verified && (
        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
          <BadgeCheck className="w-3 h-3" aria-hidden="true" /> {t("community.verified_badge")}
        </span>
      )}
      {rating != null && (
        <span className="inline-flex items-center gap-0.5 text-amber-500" aria-label={`${rating}/5`}>
          {Array.from({ length: 5 }, (_, s) => (
            <Star
              key={s}
              className={`${starClassName} ${s < rating ? "fill-amber-400" : "fill-none text-muted-foreground/40"}`}
              aria-hidden="true"
            />
          ))}
        </span>
      )}
    </div>
  );
}

/** Owner-only withdraw button shared by the Q&A and review detail pages.
 *  State/flow comes from useCommunityWithdraw (communityWithdraw.ts). */
export function CommunityWithdrawButton({
  label,
  pending,
  onWithdraw,
}: Readonly<{
  label: string;
  pending: boolean;
  onWithdraw: () => void;
}>) {
  return (
    <Button
      variant="ghost"
      onClick={onWithdraw}
      disabled={pending}
      className="gap-2 text-destructive hover:text-destructive"
    >
      <Trash2 className="w-4 h-4" aria-hidden="true" /> {label}
    </Button>
  );
}
