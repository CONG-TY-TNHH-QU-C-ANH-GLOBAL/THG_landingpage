// Fee catalogue as collapsed category bands with a live search. Categories use
// native <details> so they stay openable with JavaScript disabled; the search
// field is a JS-only enhancement hidden by the page's <noscript> stylesheet.

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

import { useI18n } from "@/lib/i18n";

export interface RateLeaf {
  desc: string;
  price?: string;
  note?: string;
  /** Draws the row as an offer rather than a charge: primary accent bar, tinted
   *  background, and the price as the same FREE pill the packaging cards use.
   *  For a line that is good news — the 90-day free storage — which read as just
   *  another fee when it was styled like one. */
  highlight?: boolean;
}

export interface RateItem {
  label: string;
  price?: string;
  note?: string;
  highlight?: boolean;
  subRows?: RateLeaf[];
}

export interface RateCategory {
  key: string;
  title: string;
  items: RateItem[];
}

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/** Leaf count drives the "N mục" badge: a grouped item counts its children. */
function leafCount(item: RateItem): number {
  return item.subRows?.length ?? 1;
}

/** Parent label is folded in so searching "kiểm đếm" still finds its children. */
function leafHaystack(item: RateItem, leaf?: RateLeaf): string {
  const parts = leaf
    ? [item.label, leaf.desc, leaf.price ?? "", leaf.note ?? ""]
    : [item.label, item.price ?? "", item.note ?? ""];
  return normalize(parts.join(" "));
}

function itemMatches(item: RateItem, term: string): boolean {
  if (!term) return true;
  if (!item.subRows?.length) return leafHaystack(item).includes(term);
  return item.subRows.some((leaf) => leafHaystack(item, leaf).includes(term));
}

function NoteRow({ note }: Readonly<{ note: string }>) {
  return (
    <p className="border-b border-border/40 bg-amber-50 px-5 py-2.5 text-[12px] italic text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
      ⚠ {note}
    </p>
  );
}

function LeafRow({ leaf, indented }: Readonly<{ leaf: RateLeaf; indented: boolean }>) {
  // The accent bar is 3px of the row's left padding, so a highlighted row stays
  // flush with the plain ones above and below it.
  const rowClass = leaf.highlight
    ? "border-l-4 border-l-primary bg-primary/[0.13] pl-4 pr-5"
    : `bg-card px-5 ${indented ? "pl-9" : ""}`;

  return (
    <div className={`flex items-start justify-between gap-6 border-b border-border/40 py-3.5 ${rowClass}`}>
      <div className="min-w-0">
        <p
          className={
            leaf.highlight
              ? "text-[14.5px] font-extrabold text-navy"
              : "text-[14px] font-medium text-muted-foreground"
          }
        >
          {leaf.desc}
        </p>
        {leaf.note ? (
          <p
            className={`mt-1 text-[12px] leading-relaxed ${leaf.highlight ? "text-navy/70" : "text-muted-foreground/80"}`}
          >
            {leaf.note}
          </p>
        ) : null}
      </div>
      {leaf.price ? (
        leaf.highlight ? (
          // Filled, not the outlined packaging-card pill: this one sits in a
          // column of black price figures and has to win against them.
          <span className="inline-block flex-shrink-0 whitespace-nowrap rounded-full bg-primary px-4 py-1 text-[13.5px] font-black uppercase tracking-wide text-primary-foreground shadow-sm shadow-primary/30">
            {leaf.price}
          </span>
        ) : (
          <p className="whitespace-pre-line text-right text-[14px] font-extrabold text-navy">
            {leaf.price}
          </p>
        )
      ) : null}
    </div>
  );
}

function ItemRows({ item, term }: Readonly<{ item: RateItem; term: string }>) {
  if (!item.subRows?.length) {
    if (term && !leafHaystack(item).includes(term)) return null;
    return (
      <>
        <LeafRow
          leaf={{
            desc: item.label,
            price: item.price,
            // A highlighted row keeps its note inside itself. NoteRow is the
            // amber ⚠ caveat band — right for "this rate has a catch", wrong for
            // the terms of an offer, which would read as a warning about it.
            note: item.highlight ? item.note : undefined,
            highlight: item.highlight,
          }}
          indented={false}
        />
        {item.note && !item.highlight ? <NoteRow note={item.note} /> : null}
      </>
    );
  }

  const visible = item.subRows.filter(
    (leaf) => !term || leafHaystack(item, leaf).includes(term),
  );
  if (visible.length === 0) return null;

  return (
    <>
      <p className="rate-row-title border-b border-border/40 bg-card px-5 pb-2 pt-3.5 text-navy">
        {item.label}
      </p>
      {visible.map((leaf) => (
        <LeafRow key={leaf.desc} leaf={leaf} indented />
      ))}
      {item.note ? <NoteRow note={item.note} /> : null}
    </>
  );
}

export function FulfillmentRateCatalog({
  categories,
}: Readonly<{ categories: readonly RateCategory[] }>) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [openKeys, setOpenKeys] = useState<ReadonlySet<string>>(new Set());

  const term = normalize(query.trim());

  const visible = useMemo(
    () =>
      categories
        .map((cat) => ({ cat, items: cat.items.filter((item) => itemMatches(item, term)) }))
        .filter((entry) => entry.items.length > 0),
    [categories, term],
  );

  // A search pulls matching categories open; clearing it collapses them again.
  useEffect(() => {
    if (!term) {
      setOpenKeys(new Set());
      return;
    }
    setOpenKeys(
      new Set(
        categories
          .filter((cat) => cat.items.some((item) => itemMatches(item, term)))
          .map((cat) => cat.key),
      ),
    );
  }, [categories, term]);

  const toggle = (key: string, open: boolean) =>
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (open) next.add(key);
      else next.delete(key);
      return next;
    });

  return (
    <div className="mx-auto max-w-[900px]">
      <div className="rate-js-only relative mb-5 max-w-[420px]">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("domestic.rate_search_placeholder")}
          aria-label={t("pricing.search_btn")}
          className="h-11 w-full rounded-[10px] border border-navy/40 bg-card pl-10 pr-4 text-sm text-foreground"
        />
      </div>

      <div className="overflow-hidden rounded-[14px] border border-navy/50 bg-card shadow-[0_4px_14px_hsl(var(--navy)/0.10)]">
        {visible.map(({ cat, items }) => (
          <details
            key={cat.key}
            className="rate-cat"
            open={openKeys.has(cat.key)}
            onToggle={(event) => toggle(cat.key, event.currentTarget.open)}
          >
            <summary>
              <div className="flex min-h-[56px] items-center justify-between gap-4 px-5 py-4">
                <span className="flex items-center gap-2.5">
                  <ChevronDown
                    className="rate-chevron h-4 w-4 flex-shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="rate-cat-title rate-eyebrow text-navy">{cat.title}</span>
                </span>
                <span className="rate-cat-count text-[12.5px] text-muted-foreground">
                  {t("domestic.rate_items").replace(
                    "{count}",
                    String(items.reduce((sum, item) => sum + leafCount(item), 0)),
                  )}
                </span>
              </div>
            </summary>
            <div>
              {items.map((item) => (
                <ItemRows key={item.label} item={item} term={term} />
              ))}
            </div>
          </details>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-4 rounded-[14px] border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          {t("domestic.rate_search_empty")}
        </p>
      ) : null}
    </div>
  );
}
