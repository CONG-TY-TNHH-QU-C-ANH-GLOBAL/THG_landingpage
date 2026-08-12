import Link from "next/link";
import { Search, X } from "lucide-react";

import type { Locale } from "@/shared/i18n";
import { countryFlag, countryName } from "@/shared/i18n/country";

import type { CatalogCopy } from "../localized-content";
import type { CatalogPage } from "../models/product";
import { catalogHref, type CatalogQuery } from "../routes";
import ProductCard from "./product-card";

// Filters, grid and pagination as ONE server component with zero client JavaScript.
//
// The Vite catalog was a client page: it held eleven pieces of useState, debounced the search
// box, and re-fetched the Hub on every keystroke and every filter click. Reproducing that here
// would mean shipping the catalog as a client bundle and putting the Hub behind every visitor's
// browser. Instead the filter state lives where it already belongs — in the URL — and the
// platform's own mechanisms move it: a `<form method="get">` for the search box, `<Link>`s for
// category/origin/page. Every filtered view is therefore linkable, shareable, back-button
// correct and server-rendered, and the whole surface works with JS disabled.
//
// ponytail: no debounce because there is no keystroke fetch to debounce — the form submits on
// Enter. If instant-as-you-type filtering is ever wanted, that is a client island around the
// form, not a rewrite of this component.

interface Props {
  page: CatalogPage;
  query: CatalogQuery;
  lang: Locale;
  copy: CatalogCopy;
}

function FilterSelect({
  name,
  label,
  value,
  options,
}: Readonly<{
  name: string;
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
}>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-thg-textMuted">
        {label}
      </span>
      <select
        name={name}
        defaultValue={value}
        className="h-11 min-w-[10rem] rounded-lg border border-thg-border bg-thg-surface px-3 text-sm text-thg-textMain outline-none focus-visible:border-thg-gold focus-visible:ring-2 focus-visible:ring-thg-gold/30"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function CatalogBrowser({ page, query, lang, copy }: Readonly<Props>) {
  const hasFilters = Boolean(query.q || query.category || query.origin);

  const categoryOptions = [
    { value: "", label: copy.filterAll },
    ...page.categories.map((c) => ({
      value: c.name,
      label: page.categoryCounts[c.name] ? `${c.name} (${page.categoryCounts[c.name]})` : c.name,
    })),
  ];

  const originOptions = [
    { value: "", label: copy.filterAll },
    // Sorted by product count: the origins a seller actually has options in come first.
    ...Object.entries(page.originCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([code, count]) => ({
        value: code,
        label: `${countryFlag(code)} ${countryName(code, lang) || code} (${count})`,
      })),
  ];

  return (
    <>
      {/* A GET form: the browser serializes these fields into the URL itself. Category and
       *  origin are part of the same form so one submit applies all three at once; the page
       *  field is deliberately absent so changing a filter returns to page 1. */}
      <form
        method="get"
        action={`/${lang}/catalog`}
        className="flex flex-wrap items-end gap-4 rounded-2xl border border-thg-border bg-thg-surface p-5 shadow-sm"
      >
        <label className="flex min-w-[16rem] flex-1 flex-col gap-1.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-thg-textMuted">
            {copy.searchLabel}
          </span>
          <span className="relative flex items-center">
            <Search
              className="pointer-events-none absolute left-3 h-4 w-4 text-thg-textMuted"
              aria-hidden="true"
            />
            <input
              type="search"
              name="q"
              defaultValue={query.q ?? ""}
              placeholder={copy.searchPlaceholder}
              className="h-11 w-full rounded-lg border border-thg-border bg-thg-surface pl-9 pr-3 text-sm text-thg-textMain outline-none placeholder:text-thg-textMuted/70 focus-visible:border-thg-gold focus-visible:ring-2 focus-visible:ring-thg-gold/30"
            />
          </span>
        </label>

        <FilterSelect
          name="category"
          label={copy.categoryLabel}
          value={query.category ?? ""}
          options={categoryOptions}
        />
        <FilterSelect
          name="origin"
          label={copy.originLabel}
          value={query.origin ?? ""}
          options={originOptions}
        />

        <button
          type="submit"
          className="h-11 rounded-lg bg-thg-textMain px-6 text-sm font-semibold text-thg-surface transition-colors hover:bg-thg-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-thg-gold/50"
        >
          {copy.searchSubmit}
        </button>

        {hasFilters ? (
          <Link
            href={catalogHref(lang)}
            className="flex h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-thg-textMuted no-underline transition-colors hover:text-thg-textMain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-thg-gold/50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            {copy.clearFilters}
          </Link>
        ) : null}
      </form>

      <p aria-live="polite" className="mt-6 font-mono text-xs uppercase tracking-widest text-thg-textMuted">
        {page.total} {copy.resultsCount}
      </p>

      {page.degraded ? (
        <p className="mt-8 rounded-xl border border-thg-border bg-thg-bg p-6 text-sm text-thg-textMuted">
          {copy.degraded}
        </p>
      ) : page.products.length === 0 ? (
        <div className="mt-8 rounded-xl border border-thg-border bg-thg-bg p-10 text-center">
          <p className="m-0 text-base font-semibold text-thg-textMain">{copy.emptyTitle}</p>
          <p className="mt-2 text-sm text-thg-textMuted">{copy.emptyHint}</p>
        </div>
      ) : (
        <ul className="mt-8 grid list-none grid-cols-2 gap-6 p-0 lg:grid-cols-3 xl:grid-cols-4">
          {page.products.map((product, i) => (
            <li key={product.id}>
              <ProductCard
                product={product}
                lang={lang}
                copy={copy}
                priority={i < 4}
                showLeadTime={false}
              />
            </li>
          ))}
        </ul>
      )}

      {page.pages > 1 ? (
        <nav className="mt-12 flex items-center justify-center gap-4" aria-label={copy.title}>
          {page.page > 1 ? (
            <Link
              href={catalogHref(lang, { ...query, page: page.page - 1 })}
              rel="prev"
              className="rounded-lg border border-thg-border px-4 py-2 text-sm font-medium text-thg-textMain no-underline transition-colors hover:border-thg-gold hover:text-thg-gold"
            >
              ← {copy.prevPage}
            </Link>
          ) : null}
          <span className="font-mono text-xs uppercase tracking-widest text-thg-textMuted">
            {copy.pageStatus} {page.page} {copy.pageOf} {page.pages}
          </span>
          {page.page < page.pages ? (
            <Link
              href={catalogHref(lang, { ...query, page: page.page + 1 })}
              rel="next"
              className="rounded-lg border border-thg-border px-4 py-2 text-sm font-medium text-thg-textMain no-underline transition-colors hover:border-thg-gold hover:text-thg-gold"
            >
              {copy.nextPage} →
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}
