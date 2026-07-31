"use client";

// Client island for the service-page CTA. Builds Button + LeadFormDialog inside the client
// boundary (same RSC/Slot reason as the Fulfill ConsultCta) and reuses the existing, secured
// /leads submission path — no page-local form, no direct post anywhere else, no fake success.

import { ArrowRight } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { LeadFormDialog } from "@/shared/ui/lead-form-dialog";
import type { LeadServiceKey } from "@/shared/ui/lead-services";
import type { Locale } from "@/shared/i18n";
import type { MarketingCopy } from "@/shared/i18n/marketing";

interface Props {
  lang: Locale;
  copy: MarketingCopy;
  label: string;
  /** Locale-less route path, e.g. "/thg-express" — recorded as the lead's source page. */
  sourcePage: string;
  /** Canonical lead service key. NOT the CMS slug: `thg-order` is the CMS page for the
   *  service whose canonical lead key is `dropship`. */
  service: LeadServiceKey;
}

// `surface` is deliberately NOT passed: LeadFormDialog does not accept one today, and adding
// a prop to the shared dialog would change the lead payload for every existing caller. The
// service is already carried by `initialService` and the page by `sourcePage`.

export function ServiceLeadCta({ lang, copy, label, sourcePage, service }: Readonly<Props>) {
  return (
    <LeadFormDialog
      lang={lang}
      copy={copy}
      sourcePage={sourcePage}
      initialService={service}
      trigger={
        <Button className="gap-2 rounded-full px-6 py-5 text-sm">
          <span>{label}</span> <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      }
    />
  );
}
