"use client";

// Client island for the consultation CTA (WEB-002). Builds Button + LeadFormDialog inside the
// client boundary (same RSC/Slot reason as HeroPrimaryCta) and reuses the existing, secured
// /leads submission path — NO prototype setTimeout simulation, no fake success. `variant`
// switches between the light hero CTA and the white-on-dark consultation CTA.
import { ArrowRight } from "lucide-react";
import { LeadFormDialog } from "@/shared/ui/lead-form-dialog";
import { Button } from "@/shared/ui/button";
import type { Locale } from "@/shared/i18n";
import type { MarketingCopy } from "@/shared/i18n/marketing";

interface Props {
  lang: Locale;
  copy: MarketingCopy;
  label: string;
  variant?: "ink" | "light";
}

export function ConsultCta({ lang, copy, label, variant = "ink" }: Readonly<Props>) {
  const className =
    variant === "light"
      ? "bg-white text-[var(--fx-ink)] hover:bg-white/90 rounded-xl px-8 py-6 text-base gap-2 hover:-translate-y-0.5 transition-all"
      : "bg-[var(--fx-ink)] text-white hover:bg-[var(--fx-ink)]/90 rounded-full px-6 py-5 text-sm gap-2 hover:-translate-y-0.5 transition-all";
  return (
    <LeadFormDialog
      lang={lang}
      copy={copy}
      sourcePage="/thg-fulfill"
      initialService="fulfill"
      trigger={
        <Button className={className}>
          <span>{label}</span> <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Button>
      }
    />
  );
}
