import Link from "next/link";

import { cn } from "@/shared/ui/cn";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import type { CommunityCategory } from "../models/category";

// Category chips are LINKS carrying ?category=<slug>, re-rendered on the server
// (COM-001 §6). The Vite filter was in-memory React state, so a filtered view could not
// be linked, bookmarked, shared or restored on refresh, and did not work without
// JavaScript. Links fix all four. Behavior delta flagged under COM-001-OQ-02.
//
// "All" is the slug-less base path, not `?category=`, so the canonical unfiltered URL
// has no empty query string.

export function CategoryFilter({
  basePath,
  categories,
  active,
  copy,
}: Readonly<{
  basePath: string;
  categories: readonly CommunityCategory[];
  active: string | undefined;
  copy: MarketingCopy;
}>) {
  const t = tFrom(copy);
  // An outage empties the chips; rendering a lone "All" that links to the page you are
  // already on is noise, so the whole bar is dropped.
  if (categories.length === 0) return null;

  const chip = (isActive: boolean) =>
    cn(
      "rounded-md border px-3 py-1.5 text-[length:var(--step-small)] font-medium transition-colors",
      isActive
        ? "border-primary bg-primary/10 text-primary"
        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-navy",
    );

  return (
    <nav aria-label={t("community.filter_aria")} className="flex flex-wrap justify-center gap-2">
      <Link prefetch={false} href={basePath} aria-current={active ? undefined : "page"} className={chip(!active)}>
        {t("community.cat_all")}
      </Link>
      {categories.map((category) => (
        <Link
          key={category.slug}
          prefetch={false}
          href={`${basePath}?category=${encodeURIComponent(category.slug)}`}
          aria-current={active === category.slug ? "page" : undefined}
          className={chip(active === category.slug)}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
