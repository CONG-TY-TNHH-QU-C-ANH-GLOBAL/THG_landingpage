"use client";

// Client island for the hero's primary CTA. Extracted so `Button`/`LeadFormDialog`
// are constructed inside the client boundary — building them in the parent Server
// Component and passing the result via the `trigger` prop crosses the RSC boundary
// as a lazy reference that @radix-ui/react-slot's cloneElement can't resolve during
// SSR, producing a recoverable hydration mismatch (WEB-001).
import { ArrowRight } from "lucide-react";
import { LeadFormDialog } from "@/shared/ui/lead-form-dialog";
import { Button } from "@/shared/ui/button";
import type { Locale } from "@/shared/i18n";
import type { MarketingCopy } from "@/shared/i18n/marketing";

export function HeroPrimaryCta({ lang, copy, cta }: Readonly<{ lang: Locale; copy: MarketingCopy; cta: string }>) {
  return (
    <LeadFormDialog
      lang={lang}
      copy={copy}
      sourcePage="/"
      trigger={
        <Button
          // rounded-lg binds to the semantic --radius token (12px) — IMPLEMENTATION_BASELINE.md
          // "Restraint on rounding": rounded-full is a measured anti-pattern outside true
          // circular controls.
          className="bg-primary hover:bg-gold-dark text-primary-foreground rounded-lg px-8 py-6 text-base gap-2 hover:-translate-y-1 transition-all duration-300"
          style={{ boxShadow: "0 8px 25px hsl(36 45% 42% / 0.3)" }}
        >
          <span>{cta}</span> <ArrowRight className="w-4 h-4" />
        </Button>
      }
    />
  );
}
