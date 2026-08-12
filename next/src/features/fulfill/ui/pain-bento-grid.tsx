// ACT 2 — PAIN BENTO GRID (Light Theme & Animated Route)
import { DollarSign, PackageX, Eye } from "lucide-react";
import type { FulfillCopy } from "../localized-content";
import { MOVEMENT_INDEX } from "./movement-copy";

interface Props {
  copy: FulfillCopy;
}

// Route node for the mini shipping diagram in cell 01
function RouteNode({ label, sub, accent }: { label: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 ${accent ? "text-thg-gold" : "text-thg-textMuted"}`}>
      <div
        className={`w-9 h-9 rounded-full border flex items-center justify-center text-[11px] font-mono font-bold bg-white z-10 ${
          accent 
            ? "border-thg-gold text-thg-gold shadow-sm" 
            : "border-thg-border text-thg-textMuted shadow-sm"
        }`}
      >
        {label}
      </div>
      {sub && <span className="text-[9px] font-mono uppercase tracking-wider text-thg-textMuted/70">{sub}</span>}
    </div>
  );
}

// Animated SVG Arrow connector between route nodes
function AnimatedRouteFlow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1 min-w-0 relative">
      <div className="relative w-full h-[2px] flex items-center">
        {/* Background track line */}
        <div className="absolute inset-x-0 h-px bg-thg-border" />
        
        {/* Animated flow line */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <line 
            x1="0" y1="1" x2="100%" y2="1" 
            stroke="url(#goldGradient)" 
            strokeWidth="2" 
            strokeDasharray="4 8"
            className="animate-line-flow"
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C29B38" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#C29B38" stopOpacity="1" />
              <stop offset="100%" stopColor="#C29B38" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Arrow head */}
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="absolute right-0 shrink-0 -mt-[3px]">
          <path d="M1 4h6M4.5 1l3 3-3 3" stroke="#C29B38" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
      {label && (
        <span className="text-[9px] font-mono uppercase tracking-wider text-thg-gold font-semibold mt-1">
          {label}
        </span>
      )}
    </div>
  );
}

export default function PainBentoGrid({ copy }: Readonly<Props>) {
  const [pain1, pain2, pain3, pain4] = copy.pains;

  return (
    <section
      id="challenges"
      className="w-full bg-thg-bg py-24 lg:py-32 relative border-t border-thg-border overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-8 relative z-10">

        {/* ── SECTION HEADER ──────────────────────────────────── */}
        <div className="flex flex-col gap-4 mb-14 lg:mb-20 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-thg-textMuted m-0">
            <span className="text-thg-gold mr-3">{MOVEMENT_INDEX.recognise}</span>
            {copy.painEyebrow}
          </p>
          <h2 className="m-0 text-thg-textMain tracking-tight font-sans tracking-tight text-3xl md:text-5xl leading-tight font-bold">
            {copy.painTitle}
          </h2>
        </div>

        {/* ── BENTO GRID ────────────────────────────────────────── */}
        <div
          className="grid gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150"
          style={{
            gridTemplateColumns: "repeat(12, 1fr)",
            gridTemplateAreas: `
              "p1 p1 p1 p1 p1 p1 p1 p2 p2 p2 p2 p2"
              "p1 p1 p1 p1 p1 p1 p1 p3 p3 p3 p3 p3"
              "p4 p4 p4 p4 p4 p4 p4 p4 p4 p4 p4 p4"
            `,
          }}
        >

          {/* ── CELL 01 — SHIPPING ROUTE DIAGRAM ───────────────── */}
          <div
            className="group bg-gradient-to-br from-white via-thg-bg to-thg-surfaceSubtle p-8 md:p-10 min-h-[340px] rounded-3xl border border-thg-border shadow-sm overflow-hidden relative flex flex-col justify-between hover:shadow-md hover:border-thg-borderHover transition-all duration-500"
            style={{ gridArea: "p1" }}
          >
            {/* Number */}
            <span className="absolute top-6 right-6 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-300">
              {pain1.num}
            </span>

            {/* Top: eyebrow + problem statement */}
            <div className="flex flex-col gap-3 relative z-10">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-thg-gold m-0">
                Seller pain · Vận chuyển
              </p>
              <h3 className="m-0 text-thg-textMain leading-snug font-sans tracking-tight text-3xl font-bold">
                {pain1.title}
              </h3>
              <p className="text-base text-thg-textMuted m-0 leading-relaxed max-w-md">
                {pain1.description}
              </p>
            </div>

            {/* Bottom: Route diagram */}
            <div className="flex flex-col gap-5 mt-8 relative z-10 bg-white p-6 rounded-2xl border border-thg-border shadow-sm">
              {/* Route diagram */}
              <div className="flex items-center gap-3 relative">
                <div className="flex flex-col gap-3 z-10">
                  <RouteNode label="VN" sub="HAN·SGN" />
                  <RouteNode label="CN" sub="GZH·SHZ" />
                </div>
                
                <AnimatedRouteFlow label="Linehaul" />
                
                {/* THG Hub node */}
                <div className="flex flex-col items-center gap-1.5 z-10 mx-2">
                  <div className="w-14 h-14 rounded-full border-2 border-thg-cyanTech bg-blue-50 flex items-center justify-center relative shadow-sm">
                    <div className="absolute inset-0 rounded-full border-2 border-thg-cyanTech animate-ping opacity-30" />
                    <span className="text-[11px] font-mono font-bold text-thg-cyanTech uppercase">HUB</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-thg-cyanTech font-semibold">US·UK</span>
                </div>

                <AnimatedRouteFlow label="Last mile" />
                
                <div className="flex flex-col gap-3 z-10">
                  <RouteNode label="US" accent />
                  <RouteNode label="UK" />
                  <RouteNode label="WW" />
                </div>
              </div>

              {/* Transit time statement */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-thg-border border-dashed">
                <div className="w-2.5 h-2.5 rounded-full bg-thg-gold shadow-sm animate-pulse" />
                <p className="text-sm font-semibold text-thg-gold m-0">
                  Cắt giảm triệt để 10–20 ngày transit time bằng cách inject thẳng vào carrier nội địa Mỹ.
                </p>
              </div>
            </div>
          </div>

          {/* ── CELL 02 — CHI PHÍ ─────────────────────────────── */}
          <div
            className="group bg-white border border-thg-border shadow-sm rounded-2xl p-6 md:p-8 min-h-[160px] flex flex-col hover:border-thg-borderHover hover:shadow-md transition-all duration-500 relative overflow-hidden"
            style={{ gridArea: "p2" }}
          >
            <div className="relative flex flex-col justify-between h-full z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-thg-bg border border-thg-border text-thg-textMuted group-hover:bg-thg-goldBg group-hover:border-yellow-300 group-hover:text-thg-gold transition-all duration-300 shadow-sm">
                  <DollarSign className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-300">{pain2.num}</span>
              </div>
              <div className="mt-6">
                <h3 className="m-0 text-thg-textMain text-xl font-bold leading-snug">{pain2.title}</h3>
                <p className="mt-2 text-base text-thg-textMuted leading-relaxed m-0">{pain2.description}</p>
              </div>
            </div>
          </div>

          {/* ── CELL 03 — HỆ THỐNG ───────────────────────────── */}
          <div
            className="group bg-white border border-thg-border shadow-sm rounded-2xl p-6 md:p-8 min-h-[160px] flex flex-col hover:border-thg-borderHover hover:shadow-md transition-all duration-500 relative overflow-hidden"
            style={{ gridArea: "p3" }}
          >
            <div className="relative flex flex-col justify-between h-full z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-thg-bg border border-thg-border text-thg-textMuted group-hover:bg-thg-goldBg group-hover:border-yellow-300 group-hover:text-thg-gold transition-all duration-300 shadow-sm">
                  <PackageX className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-300">{pain3.num}</span>
              </div>
              <div className="mt-6">
                <h3 className="m-0 text-thg-textMain text-xl font-bold leading-snug">{pain3.title}</h3>
                <p className="mt-2 text-base text-thg-textMuted leading-relaxed m-0">{pain3.description}</p>
              </div>
            </div>
          </div>

          {/* ── CELL 04 — KIỂM SOÁT (full-width) ─────────────── */}
          <div
            className="group bg-white border border-thg-border shadow-sm rounded-2xl p-6 md:p-8 hover:border-thg-borderHover hover:shadow-md transition-all duration-500"
            style={{ gridArea: "p4" }}
          >
            <div className="flex items-start md:items-center gap-6 flex-col md:flex-row">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-thg-bg border border-thg-border text-thg-textMuted group-hover:bg-thg-goldBg group-hover:border-yellow-300 group-hover:text-thg-gold transition-all duration-300 shrink-0 shadow-sm">
                <Eye className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <h3 className="m-0 text-thg-textMain text-xl font-bold leading-snug">
                    {pain4.title}
                  </h3>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-300">{pain4.num}</span>
                </div>
                <p className="text-base text-thg-textMuted leading-relaxed m-0 max-w-4xl">
                  {pain4.description}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ── MOBILE: simple stacked list ─────────────────────── */}
        <style>{`
          @media (max-width: 1023px) {
            #challenges [style*="gridTemplateAreas"] {
              display: flex !important;
              flex-direction: column !important;
              gap: 24px !important;
            }
            #challenges [style*="gridArea"] {
              min-height: auto !important;
            }
          }
        `}</style>

      </div>
    </section>
  );
}
