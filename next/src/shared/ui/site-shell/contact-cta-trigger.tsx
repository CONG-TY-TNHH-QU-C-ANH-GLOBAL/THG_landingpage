"use client";

// Client island for the contact card's CTA. Extracted so `Button`/`LeadFormDialog`
// are constructed inside the client boundary — building them in the parent Server
// Component and passing the result via the `trigger` prop crosses the RSC boundary
// as a lazy reference that @radix-ui/react-slot's cloneElement can't resolve during
// SSR, producing a recoverable hydration mismatch (WEB-001).
import { ArrowRight } from "lucide-react";
import { LeadFormDialog } from "@/shared/ui/lead-form-dialog";
import { Button } from "@/shared/ui/button";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import type { Locale } from "@/shared/i18n";

export function ContactCtaTrigger({ lang, copy }: Readonly<{ lang: Locale; copy: MarketingCopy }>) {
  const t = tFrom(copy);
  return (
    <LeadFormDialog
      lang={lang}
      copy={copy}
      trigger={
        <Button size="lg" className="w-full rounded-full font-semibold gap-2 text-sm">
          {t("contact.leave_info")}
          <ArrowRight className="w-4 h-4" />
        </Button>
      }
    />
  );
}
