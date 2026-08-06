"use client";

// The consultation trigger. A client island because Button + LeadFormDialog must be constructed
// inside the client boundary — a Server Component that builds a trigger element and passes it across
// the RSC boundary hands the slot pattern a lazy reference it cannot resolve during SSR, and the
// server then emits nothing at that position.
//
// It reuses the existing, secured /leads path. No simulated submit, no fabricated success.
//
// Two ranks, and only two, so a reader can always tell which action matters: `primary` is the gold
// fill used at a conversion moment, `quiet` is the outline used where the CTA accompanies content
// that is still being read. Colour resolves through the Tier 2 surface contract, so the same
// component is correct on the cream canvas and on the inverted surface without knowing which it is
// on. White on gold measures 5.0:1; navy on gold is 2.9:1 and is never used.
import { ArrowRight } from "lucide-react";

import { LeadFormDialog } from "@/shared/ui/lead-form-dialog";
import { Button } from "@/shared/ui/button";
import type { Locale } from "@/shared/i18n";
import type { MarketingCopy } from "@/shared/i18n/marketing";

interface Props {
  lang: Locale;
  copy: MarketingCopy;
  label: string;
  rank?: "primary" | "quiet";
  /**
   * Prefills the dialog's message field. The planner passes its Operational Plan summary here, so a
   * consultation request arrives already carrying the plan it came from — including the plan id and
   * catalogue version, which is what makes the recommendation reproducible months later.
   *
   * Visible and editable on purpose. It goes into the field labelled "your message", so the seller
   * can read exactly what is being sent and delete it; silently attaching text to a field the user
   * believes they authored would be the wrong trade for cleaner data.
   */
  message?: string;
}

const BASE =
  "min-h-[48px] px-5 py-0 gap-2 rounded-[var(--radius)] text-[length:var(--step-button)] " +
  "font-semibold transition-colors";

const RANKS: Readonly<Record<NonNullable<Props["rank"]>, string>> = {
  primary:
    "bg-[var(--ui-accent)] text-[var(--ui-on-accent)] hover:bg-[var(--ui-accent-text)] border-0",
  quiet:
    "bg-transparent text-[var(--ui-ink)] border border-[var(--ui-line-strong)] " +
    "hover:bg-[var(--ui-sunk)]",
};

export function ConsultCta({ lang, copy, label, rank = "primary", message }: Readonly<Props>) {
  return (
    <LeadFormDialog
      lang={lang}
      copy={copy}
      sourcePage="/thg-fulfill"
      initialService="fulfill"
      defaultMessage={message}
      trigger={
        <Button className={`${BASE} ${RANKS[rank]}`}>
          <span>{label}</span>
          <ArrowRight size={16} aria-hidden="true" />
        </Button>
      }
    />
  );
}
