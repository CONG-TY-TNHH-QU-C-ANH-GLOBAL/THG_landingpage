"use client";

import Image from "next/image";

import type { FulfillContent } from "../models/fulfill";
import type { FulfillCopy } from "../localized-content";
import type { FulfillParityCopy } from "../parity-content";

interface Props {
  copy: FulfillCopy;
  /** The flow-diagram labels live in the parity tree, which already owned them. */
  parity: FulfillParityCopy;
  content: FulfillContent;
}

export default function HeroSection({ copy, parity, content }: Readonly<Props>) {
  return (
    <section
      id="top"
      className="relative w-full min-h-[90vh] flex flex-col justify-center overflow-hidden bg-thg-bg pb-12"
    >
      {/* Background radial gradient & Grid pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-50/60 via-transparent to-transparent pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-thg-border to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-24 flex flex-col items-center text-center gap-10">
        
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-thg-gold/40 bg-thg-goldBg shadow-sm">
          <span className="text-[12px] font-mono font-bold text-thg-gold tracking-widest uppercase">
            ✦ [{copy.heroInfraBadge}]
          </span>
        </div>

        {/* Headline — the page's single H1. Localized: it rendered its Vietnamese draft on
         *  /en and /zh as well until this key moved into the copy module. */}
        <h1 className="font-sans text-4xl md:text-6xl lg:text-7xl font-bold text-thg-textMain max-w-5xl leading-tight tracking-tight text-balance">
          {copy.heroHeadlineLong}
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-base md:text-lg text-thg-textMuted max-w-2xl leading-relaxed">
          {content.heroSubtitle || copy.heroSubtitleFallback}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <button
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.set("consult", "open");
              window.history.pushState({}, "", url.toString());
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
            className="inline-flex items-center justify-center px-8 py-4 bg-thg-gold text-white font-semibold rounded-lg hover:shadow-md hover:scale-105 transition-all duration-300 active:scale-95 w-full sm:w-auto"
          >
            {copy.heroPrimaryCta}
          </button>
          <a
            href="#process"
            className="inline-flex items-center justify-center px-8 py-4 bg-white border border-thg-border text-thg-textMain font-medium rounded-lg shadow-sm hover:border-thg-borderHover hover:bg-thg-surfaceSubtle transition-all duration-300 w-full sm:w-auto"
          >
            {copy.heroSecondaryCta}
          </a>
        </div>

        {/* POD Process Visual (Áo phôi -> In -> Thành phẩm) */}
        <div className="mt-12 md:mt-16 bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-thg-border shadow-sm w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-32 bg-thg-gold/5 blur-3xl rounded-full" />

          <p className="text-xs font-mono font-bold text-thg-gold tracking-widest uppercase mb-8 text-center relative z-10">
            {parity.podProcess}
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 relative z-10 w-full px-4 md:px-12">
            
            {/* Conveyor Belt Background Line (Desktop only) */}
            <div className="hidden md:block absolute left-24 right-24 top-1/2 -translate-y-1/2 h-1 bg-thg-surfaceSubtle z-0 overflow-hidden rounded-full shadow-inner border border-thg-border">
               <div className="w-full h-full bg-[linear-gradient(90deg,transparent_50%,#C29B38_50%)] bg-[length:24px_100%] opacity-40 motion-reduce:animate-none"
                    style={{ animation: 'conveyor 1.5s linear infinite' }} />
            </div>

            {/* Blank Shirt */}
            <div className="flex flex-col items-center gap-4 group relative z-10 bg-white/60 p-2 md:p-4 rounded-3xl backdrop-blur-sm">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-thg-surfaceSubtle border-2 border-thg-borderHover flex items-center justify-center p-6 relative overflow-hidden transition-all duration-500 hover:border-thg-textMuted hover:shadow-md">
                <Image src="/assets/fulfill/ao-phoi.png" alt={parity.blankTshirt} width={160} height={160} className="w-full h-full object-contain opacity-90 drop-shadow-md group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105" />
              </div>
              <span className="text-sm font-semibold text-thg-textMuted">{parity.blankTshirt}</span>
            </div>

            {/* Printer Icon */}
            <div className="flex flex-col items-center justify-center gap-3 relative z-10 bg-white/60 p-2 md:p-4 rounded-3xl backdrop-blur-sm">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-white to-thg-bg border-2 border-thg-border shadow-sm flex items-center justify-center relative">
                <svg className="w-8 h-8 text-thg-textMuted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                {/* Active light indicator */}
                <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_6px_#34d399]" />
              </div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-thg-textMuted">{parity.dtgPrint}</span>
            </div>

            {/* Branded Product */}
            <div className="flex flex-col items-center gap-4 group relative z-10 bg-white/60 p-2 md:p-4 rounded-3xl backdrop-blur-sm">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-b from-thg-goldBg to-white border-2 border-thg-gold/30 flex items-center justify-center p-6 relative overflow-hidden shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                <Image src="/assets/fulfill/apparel.png" alt={parity.brandedProduct} width={160} height={160} className="w-full h-full object-contain relative z-10 transform transition-transform duration-700 group-hover:scale-110 drop-shadow-md" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-thg-gold">{parity.brandedProduct}</span>
                <span className="text-[10px] text-thg-gold/70 font-medium tracking-wide mt-1">{parity.yourBrand}</span>
              </div>
            </div>
            
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes conveyor {
              to { background-position: -24px 0; }
            }
          `}} />
        </div>
      </div>

      {/* Stat Bar Bottom */}
      <div className="relative z-10 w-full flex justify-center px-4 mt-auto">
        <div className="max-w-4xl w-full bg-white shadow-sm border border-thg-border rounded-2xl py-4 px-8 flex flex-col md:flex-row items-center justify-between divide-y md:divide-y-0 md:divide-x divide-thg-border">
          <div className="flex-1 py-2 flex flex-col items-center justify-center w-full">
            <span className="font-mono text-sm text-thg-gold uppercase tracking-widest font-bold">VN · CN · US</span>
            <span className="text-[11px] text-thg-textMuted mt-1">Production Nodes</span>
          </div>
          <div className="flex-1 py-2 flex flex-col items-center justify-center w-full">
            <span className="font-mono text-sm text-thg-textMain uppercase tracking-widest font-bold">POD & Dropship</span>
            <span className="text-[11px] text-thg-textMuted mt-1">Core Services</span>
          </div>
          <div className="flex-1 py-2 flex flex-col items-center justify-center w-full">
            <span className="font-mono text-sm text-thg-cyanTech uppercase tracking-widest font-bold">Item-Level QC</span>
            <span className="text-[11px] text-thg-textMuted mt-1">Standardized Check</span>
          </div>
        </div>
      </div>
    </section>
  );
}
