// GDPR cookie consent banner. Tracking scripts (GA4/GTM/Pixel) read window.__thgConsent
// or the consent dataLayer event before firing. See index.html for the load gate.

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const STORAGE_KEY = "thg-consent-v1";
type ConsentValue = "accepted" | "rejected";

declare global {
  interface Window {
    __thgConsent?: ConsentValue;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

function readStored(): ConsentValue | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

function persist(value: ConsentValue) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* storage unavailable — fall through */
  }
  window.__thgConsent = value;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "thg_consent_update", consent: value });
}

export function ConsentBanner() {
  const { t } = useI18n();
  const [decision, setDecision] = useState<ConsentValue | null>(() => readStored());

  useEffect(() => {
    if (decision) {
      window.__thgConsent = decision;
    }
  }, [decision]);

  if (decision) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t("consent.aria_label") || "Cookie consent"}
      className="fixed bottom-0 left-0 right-0 z-[60] border-t border-border bg-background/95 backdrop-blur shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
    >
      <div className="container mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-foreground/90 max-w-3xl">
          {t("consent.message") ||
            "Chúng tôi sử dụng cookie để cải thiện trải nghiệm và phân tích traffic. Bạn có thể chấp nhận hoặc từ chối tracking analytics."}
        </p>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="ghost"
            className="text-sm"
            onClick={() => {
              persist("rejected");
              setDecision("rejected");
            }}
          >
            {t("consent.reject") || "Reject"}
          </Button>
          <Button
            className="bg-primary hover:bg-gold-dark text-primary-foreground text-sm"
            onClick={() => {
              persist("accepted");
              setDecision("accepted");
            }}
          >
            {t("consent.accept") || "Accept"}
          </Button>
        </div>
      </div>
    </div>
  );
}
