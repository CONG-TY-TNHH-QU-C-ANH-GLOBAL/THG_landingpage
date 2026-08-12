"use client";

import { Fragment, useState } from "react";
import type { FulfillParityCopy, FulfillGuideSection } from "../parity-content";
import { ChevronRight } from "lucide-react";
import { Alias } from "./section";

interface Props {
  parity: FulfillParityCopy;
}

export default function HubGuideSection({ parity }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const activeSection = parity.hubSections[activeTab] as FulfillGuideSection | undefined;

  if (!parity.hubSections || parity.hubSections.length === 0) return null;

  return (
    <section id="hub-guide" className="w-full py-24 bg-white border-t border-thg-border">
      {/* Retired-but-published anchors from the operate movement this section replaced: it is
       *  the Hub handbook, the order guide and the Hub CTA now, all in one chapter. */}
      <Alias id="handbook" />
      <Alias id="order-guide" />
      <Alias id="hub-cta" />
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header & Video */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-16 items-start lg:items-center justify-between animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col gap-4 max-w-2xl">
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-thg-gold m-0">
              {parity.hubEyebrow}
            </p>
            <h2 className="m-0 text-thg-textMain tracking-tight font-sans text-3xl md:text-5xl leading-snug font-bold">
              {parity.hubHeading}
            </h2>
            <p className="text-base text-thg-textMuted leading-relaxed m-0 max-w-xl">
              {parity.hubIntro}
            </p>
          </div>

          <div className="w-full lg:w-[500px] xl:w-[600px] shrink-0 rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-thg-border aspect-video bg-slate-100 relative group">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/AzlW2irPANQ" 
              title="THG Hub System Guide" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>
        </div>

        {/* Hub UI Grid */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Sidebar / Tabs
           *  Real tablist semantics, not just buttons that look like tabs. Without
           *  role/aria-selected/aria-controls a screen-reader user gets six unlabelled buttons
           *  and no indication that one of six panels is showing, or which. */}
          <div className="w-full lg:w-1/3 flex flex-col gap-2">
            <h3 id="hub-toc-label" className="text-xs font-mono font-semibold uppercase tracking-widest text-thg-textSubtle mb-4 pl-4">
              {parity.hubToc}
            </h3>
            <div role="tablist" aria-orientation="vertical" aria-labelledby="hub-toc-label" className="flex flex-col gap-2">
              {parity.hubSections.map((section, idx) => {
                const isActive = activeTab === idx;
                return (
                  // Each chapter stays individually deep-linkable. The panel is swapped, so the
                  // anchor rides on the tab — which is always rendered — rather than on the
                  // panel, which exists only while its chapter is selected.
                  <Fragment key={section.id}>
                  <Alias id={`hub-${section.id}`} />
                  <button
                    id={`hub-tab-${section.id}`}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    aria-controls={`hub-panel-${section.id}`}
                    // Roving tabindex: the tablist is ONE tab stop, arrowing moves between tabs.
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveTab(idx)}
                    className={`w-full text-left px-5 py-4 rounded-xl flex items-center justify-between transition-all duration-300 border ${
                      isActive
                        ? "bg-thg-textMain border-thg-textMain text-white shadow-md transform scale-[1.02]"
                        : "bg-thg-bg border-transparent text-thg-textMuted hover:bg-thg-surfaceSubtle hover:text-thg-textMain"
                    }`}
                  >
                    <span className="font-semibold">{section.title}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isActive ? "text-thg-gold translate-x-1" : "text-thg-textSubtle"}`} aria-hidden="true" />
                  </button>
                  </Fragment>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="w-full lg:w-2/3 bg-thg-bg rounded-3xl p-6 md:p-10 border border-thg-border shadow-sm relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-thg-gold/5 rounded-bl-full blur-3xl pointer-events-none" />
            
            {activeSection && (
              <div
                className="relative z-10 flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500"
                key={activeSection.id}
                id={`hub-panel-${activeSection.id}`}
                role="tabpanel"
                aria-labelledby={`hub-tab-${activeSection.id}`}
                tabIndex={0}
              >
                <h3 className="text-2xl font-bold text-thg-textMain mb-6 pb-6 border-b border-thg-border border-dashed">
                  {activeSection.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed mb-8">
                  {activeSection.intro}
                </p>

                {activeSection.bullets && activeSection.bullets.length > 0 && (
                  <ul className="flex flex-col gap-3 mb-8">
                    {activeSection.bullets.map((bullet, i) => (
                      <li key={i} className="flex gap-3 text-slate-600 leading-relaxed">
                        <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-thg-gold" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeSection.facts && activeSection.facts.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
                    {activeSection.facts.map((fact, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-thg-border shadow-sm flex flex-col gap-2 transition-all hover:border-thg-borderHover hover:shadow-md">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-thg-gold bg-thg-goldBg px-2 py-1 rounded inline-block w-fit">
                          {fact.label}
                        </span>
                        <p className="text-sm text-slate-600 m-0 leading-relaxed">
                          {fact.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
