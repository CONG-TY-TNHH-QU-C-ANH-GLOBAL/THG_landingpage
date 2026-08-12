"use client";

import { ArrowRight } from "lucide-react";
import { useCallback } from "react";

import type { FulfillCopy } from "../localized-content";
import { Alias } from "./section";

export default function ConsultCTASection({ copy }: Readonly<{ copy: FulfillCopy }>) {
  const openConsultation = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("consult", "open");
    window.history.pushState({}, "", url.toString());
    // Dispatch a popstate event so listeners know the URL changed
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);

  return (
    // `#consult` is LIVE, not retired: the ecosystem advisory card and the catalog product
    // detail both link to /{lang}/thg-fulfill#consult. Nothing owned that id after the
    // redesign, so those links scrolled nowhere. This section is the consultation CTA — it
    // owns it. `#plan` and `#contact` are retired ids from movements it replaced.
    <section id="consult" className="w-full py-24 bg-gradient-to-b from-white to-thg-bg border-y border-thg-border relative overflow-hidden">
      <Alias id="plan" />
      <Alias id="contact" />
      {/* Decorative background element */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
        <div className="w-[800px] h-[300px] bg-thg-gold/10 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white border border-thg-border mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-thg-gold animate-pulse" />
          <span className="text-xs font-mono text-thg-gold tracking-widest uppercase">
            {`// ${copy.consultEyebrow}`}
          </span>
        </div>

        <h2 className="text-3xl md:text-5xl font-sans tracking-tight font-bold text-thg-textMain max-w-3xl mb-6 text-balance">
          {copy.consultTitle}
        </h2>

        <p className="max-w-2xl mb-10 text-base leading-relaxed text-thg-textMuted">
          {copy.consultIntro}
        </p>

        <button
          onClick={openConsultation}
          className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-thg-gold text-white font-semibold text-lg rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative z-10">{copy.consultCta}</span>
          <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
