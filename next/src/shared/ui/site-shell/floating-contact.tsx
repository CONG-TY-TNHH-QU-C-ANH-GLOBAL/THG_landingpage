"use client";

// Parity source: src/components/FloatingContact.tsx. The phone/zalo/messenger derivations
// now live upstream (FND-005 site-settings mapper) — this island receives the resolved
// links; null hides that button, exactly like today. The shell declares its own link shape
// (structurally identical to the FND-005 SiteSettings model): shared/ must not import
// features/, and models graduate to shared/cms/models in a dedicated PR.
import { useEffect, useState } from "react";
import { ArrowUp, Phone, MessageCircle } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { LeadFormDialog } from "@/shared/ui/lead-form-dialog";
import { SCROLL } from "@/shared/ui/constants";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import type { Locale } from "@/shared/i18n";

export interface ContactLinks {
  telUrl: string | null;
  zaloUrl: string | null;
  messengerUrl: string | null;
}

const ZaloIcon = ({ className }: { className?: string }) => (
  // Simplified Z monogram — Zalo's official mark is trademarked, this stays
  // recognizable to VN users (familiar with blue Z badge) without infringing.
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M5 4h14a1 1 0 0 1 1 1v9a4 4 0 0 1-4 4h-3.5l-3.4 2.6a.5.5 0 0 1-.8-.4V18H7a3 3 0 0 1-3-3V5a1 1 0 0 1 1-1zm3.6 6.3v1h2.7L8.6 14.5v1h4.8v-1h-2.9l2.8-3.2v-1H8.6zm6.4-.1h-1.1v5.3H15v-5.3zm.6-1.4a.7.7 0 1 1-1.4 0 .7.7 0 0 1 1.4 0z"/>
  </svg>
);

export function FloatingContact({ lang, copy, links }: Readonly<{ lang: Locale; copy: MarketingCopy; links: ContactLinks }>) {
  const t = tFrom(copy);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > SCROLL.BACK_TO_TOP_THRESHOLD_PX);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { telUrl, zaloUrl, messengerUrl } = links;

  const consultLabel = t("nav.consult");
  const callLabel = t("floating.call");
  const zaloLabel = t("floating.zalo");
  const chatLabel = t("floating.chat");
  const backToTopLabel = t("floating.back_to_top");

  return (
    <>
      {/* Desktop floating chat stack — bottom right above page footer. */}
      <div className="hidden lg:flex fixed right-5 bottom-6 z-40 flex-col gap-3 print:hidden">
        {showBackToTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label={backToTopLabel}
            className="w-11 h-11 rounded-full bg-navy text-white shadow-lg shadow-navy/25 hover:bg-navy/90 hover:-translate-y-0.5 transition-all flex items-center justify-center"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
        {zaloUrl && (
          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={zaloLabel}
            className="w-12 h-12 rounded-full bg-[#0068ff] text-white shadow-lg shadow-[#0068ff]/30 hover:scale-110 transition-all flex items-center justify-center"
          >
            <ZaloIcon className="w-6 h-6" />
          </a>
        )}
        {messengerUrl && (
          <a
            href={messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={chatLabel}
            className="w-12 h-12 rounded-full bg-[#0866ff] text-white shadow-lg shadow-[#0866ff]/30 hover:scale-110 transition-all flex items-center justify-center"
          >
            <MessageCircle className="w-6 h-6" />
          </a>
        )}
      </div>

      {/* Mobile sticky bottom bar — 3 columns when phone + zalo + lead are all
          available. Always shows the lead-form trigger as the primary action. */}
      <div
        className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-background/95 backdrop-blur-md border-t border-border shadow-[0_-4px_24px_rgba(0,0,0,0.12)] print:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-3 divide-x divide-border">
          {telUrl ? (
            <a
              href={telUrl}
              aria-label={callLabel}
              className="flex flex-col items-center justify-center py-2.5 text-[11px] font-medium text-foreground/80 active:bg-secondary/50 transition-colors"
            >
              <Phone className="w-5 h-5 text-primary mb-0.5" />
              {callLabel}
            </a>
          ) : (
            <div />
          )}
          {zaloUrl ? (
            <a
              href={zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={zaloLabel}
              className="flex flex-col items-center justify-center py-2.5 text-[11px] font-medium text-foreground/80 active:bg-secondary/50 transition-colors"
            >
              <ZaloIcon className="w-5 h-5 text-[#0068ff] mb-0.5" />
              {zaloLabel}
            </a>
          ) : (
            <div />
          )}
          <LeadFormDialog
            lang={lang}
            copy={copy}
            sourcePage="mobile-sticky-cta"
            trigger={
              <Button
                className="h-full rounded-none bg-primary text-primary-foreground font-bold text-[12px] tracking-wide hover:bg-gold-dark"
              >
                {consultLabel}
              </Button>
            }
          />
        </div>
      </div>

      {/* Spacer so page content can scroll fully into view above the mobile bar. */}
      <div className="lg:hidden h-16" aria-hidden="true" />
    </>
  );
}
