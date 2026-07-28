// Consultation chapter (WEB-002) — dark Server Component. Preserves the prototype's OLED
// consultation surface but the actual submission reuses the existing, secured LeadFormDialog
// (/leads + Turnstile) via the ConsultCta client island — NOT the prototype's setTimeout
// simulation, and with no "publish to Community" side-channel (moderation-first stays in the
// Community workflow). The operational checklist reflects the same verified points as the hero.
import { Printer, ShieldCheck, Package } from "lucide-react";

import type { Locale } from "@/shared/i18n";
import type { MarketingCopy } from "@/shared/i18n/marketing";
import type { FulfillContent } from "../models/fulfill";
import type { FulfillCopy } from "../copy";
import FulfillConsultationForm from "./fulfill-consultation-form";
import styles from "./fulfill.module.css";

interface Props {
  lang: Locale;
  marketingCopy: MarketingCopy;
  copy: FulfillCopy;
  content: FulfillContent;
}

export default function ConsultationSection({ lang, marketingCopy, copy, content }: Readonly<Props>) {
  const checklist = content.points.length > 0 ? content.points : copy.pointsFallback;
  const icons = [Printer, ShieldCheck, Package];

  return (
    <section id="consult" className={`${styles.consult} py-28 md:py-32 relative overflow-hidden`}>
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[110px] pointer-events-none"
        style={{ background: "rgba(0,102,255,0.1)" }}
      />
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div
              className={`${styles.mono} inline-flex text-[10px] uppercase tracking-widest border px-3 py-1 rounded-full mb-6`}
              style={{ color: "var(--fx-orange)", borderColor: "rgba(255,92,0,0.3)" }}
            >
              {copy.consultEyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ letterSpacing: "-0.04em" }}>
              {copy.consultTitle}
            </h2>
            <p className="text-lg mb-10 max-w-md" style={{ color: "#9ca3af" }}>
              {copy.consultIntro}
            </p>
            <ul className="space-y-4 mb-10">
              {checklist.map((point, i) => {
                const IconComp = icons[i % icons.length];
                return (
                  <li key={point} className="flex items-center gap-4" style={{ color: "#d1d5db" }}>
                    <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <IconComp className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span className="font-medium text-sm">{point}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lg:justify-self-end w-full max-w-md">
            <FulfillConsultationForm lang={lang} copy={marketingCopy} />
          </div>
        </div>
      </div>
    </section>
  );
}
