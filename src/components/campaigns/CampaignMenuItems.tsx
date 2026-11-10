import { ChevronRight } from "lucide-react";

import { resolveCampaignHref, type CampaignMenuItem } from "@/lib/campaigns";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { CampaignLink } from "./CampaignLink";

interface Props {
  items: readonly CampaignMenuItem[];
  /** "rows": icon + title + subtitle + chevron (mega-menu, mobile, detail).
   *  "cards": compact tiles for the home banner. */
  variant?: "rows" | "cards";
  /** Highlight the first row (mega-menu). */
  highlightFirst?: boolean;
  /** Mega-menu: index (in `items`) of the hovered/focused row. It is the
   *  highlighted row once set, and drives the promo card beside the list. */
  activeIndex?: number | null;
  /** Called with a row's index in `items` when the pointer or keyboard
   *  reaches it. */
  onActivate?: (index: number) => void;
  onNavigate?: () => void;
  className?: string;
}

/** The campaign's menu_items as real links. Items with an unusable href are
 *  dropped rather than rendered as dead links. */
export function CampaignMenuItems({
  items,
  variant = "rows",
  highlightFirst = false,
  activeIndex = null,
  onActivate,
  onNavigate,
  className,
}: Readonly<Props>) {
  const { language } = useI18n();
  const links = items.flatMap((item, index) => {
    const target = resolveCampaignHref(item.href, language);
    return target ? [{ item, target, index, key: `${index}-${item.title}` }] : [];
  });
  if (links.length === 0) return null;
  const highlighted = activeIndex ?? (highlightFirst ? links[0].index : null);

  if (variant === "cards") {
    return (
      <ul className={cn("flex gap-3 overflow-x-auto pb-1 snap-x md:grid md:grid-cols-4 md:overflow-visible", className)}>
        {links.map(({ item, target, key }) => (
          <li key={key} className="snap-start shrink-0">
            <CampaignLink
              target={target}
              onClick={onNavigate}
              className="flex w-44 md:w-auto items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <span className="text-xl leading-none" aria-hidden="true">
                {item.icon}
              </span>
              <span className="min-w-0 truncate text-sm font-semibold">{item.title}</span>
            </CampaignLink>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={cn("space-y-1", className)}>
      {links.map(({ item, target, index, key }) => (
        <li key={key}>
          <CampaignLink
            target={target}
            onClick={onNavigate}
            onMouseEnter={onActivate ? () => onActivate(index) : undefined}
            onFocus={onActivate ? () => onActivate(index) : undefined}
            className={cn(
              "group/row flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none",
              highlighted === index && "bg-red-50 ring-1 ring-red-200",
            )}
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-lg shadow-sm ring-1 ring-border/60"
              aria-hidden="true"
            >
              {item.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-foreground">{item.title}</span>
              {item.subtitle ? (
                <span className="block truncate text-xs text-muted-foreground">{item.subtitle}</span>
              ) : null}
            </span>
            <ChevronRight
              className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover/row:translate-x-0.5 group-hover/row:text-red-600"
              aria-hidden="true"
            />
          </CampaignLink>
        </li>
      ))}
    </ul>
  );
}
