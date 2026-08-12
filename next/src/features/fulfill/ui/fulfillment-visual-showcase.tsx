"use client";

import { useState } from "react";
import Image from "next/image";
import { Printer, Search, PackageCheck, CheckCircle2, ShieldCheck, Truck, Barcode, Palette, Globe2, ScanFace } from "lucide-react";
import type { FulfillCopy } from "../localized-content";
import { Alias } from "./section";

const TABS = [
  {
    id: "print",
    label: "In Ấn POD (DTG/DTF)",
    icon: Printer,
  },
  {
    id: "qc",
    label: "Kiểm Định Chất Lượng",
    icon: Search,
  },
  {
    id: "pack",
    label: "Đóng Gói & Dán Nhãn",
    icon: PackageCheck,
  },
];

export default function FulfillmentVisualShowcase({ copy }: Readonly<{ copy: FulfillCopy }>) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="studio" className="w-full py-24 bg-white border-y border-thg-border overflow-hidden">
      {/* `#studio` and `#evidence` are retired-but-published anchors from the movements this
       *  section replaced. They resolve here because this IS the studio/proof chapter now —
       *  printing, item-level QC and packing, shown rather than claimed. */}
      <Alias id="evidence" />
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <p className="text-[11px] font-mono font-semibold uppercase tracking-widest text-thg-gold mb-4">
            {`// ${copy.showcaseEyebrow}`}
          </p>
          <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-thg-textMain max-w-4xl leading-tight text-balance">
            {copy.showcaseTitle}
          </h2>
        </div>

        {/* Studio Container */}
        <div className="max-w-6xl mx-auto bg-thg-bg border border-thg-border rounded-3xl p-2 md:p-4 shadow-sm">
          {/* Switcher Bar */}
          <div className="flex flex-col md:flex-row gap-2 mb-4 bg-white p-2 rounded-2xl border border-thg-border shadow-sm overflow-x-auto no-scrollbar">
            {TABS.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeTab === idx;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(idx)}
                  className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? "bg-thg-textMain text-white shadow-md"
                      : "text-thg-textMuted hover:bg-thg-surfaceSubtle hover:text-thg-textMain"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-thg-gold" : ""}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Interactive Display Area */}
          <div className="bg-white rounded-2xl border border-thg-border overflow-hidden min-h-[500px] flex">
            {/* TAB 01: In Ấn POD */}
            {activeTab === 0 && (
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 animate-in fade-in zoom-in-95 duration-500">
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-thg-border">
                  <h3 className="text-2xl font-bold tracking-tight text-thg-textMain mb-8">
                    High-Resolution DTG / DTF Printing
                  </h3>
                  <div className="flex flex-col gap-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-thg-bg flex items-center justify-center shrink-0 border border-thg-border">
                        <Printer className="w-5 h-5 text-thg-gold" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-thg-textMain mb-1">Công nghệ in thế hệ mới</h4>
                        <p className="text-thg-textMuted text-sm leading-relaxed">Direct-to-Garment (DTG) & Direct-to-Film (DTF) mang lại chi tiết siêu nét và độ bền màu vượt trội.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-thg-bg flex items-center justify-center shrink-0 border border-thg-border">
                        <Globe2 className="w-5 h-5 text-thg-gold" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-thg-textMain mb-1">Nodes sản xuất linh hoạt</h4>
                        <p className="text-thg-textMuted text-sm leading-relaxed">Xưởng in trực tiếp tại Việt Nam, Trung Quốc và trung tâm xử lý nội địa Mỹ (US Hub).</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-thg-bg flex items-center justify-center shrink-0 border border-thg-border">
                        <Palette className="w-5 h-5 text-thg-gold" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-thg-textMain mb-1">Chuẩn màu sRGB/CMYK</h4>
                        <p className="text-thg-textMuted text-sm leading-relaxed">In sắc nét, bền màu, khớp 99% với thiết kế trên màn hình — tối ưu cho Etsy & Shopify.</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Visual Mockup 01 */}
                <div className="relative bg-gradient-to-br from-thg-bg to-thg-border/30 p-8 flex flex-col items-center justify-center overflow-hidden min-h-[400px]">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-thg-gold/5 rounded-bl-full blur-3xl" />
                  
                  {/* Abstract Printer Representation */}
                  <div className="relative z-10 w-full max-w-sm">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-thg-border transform transition-transform hover:scale-105 duration-500">
                      
                      {/* Design File Processing UI */}
                      <div className="w-full h-40 bg-slate-900 rounded-xl mb-4 border border-slate-700 p-4 flex flex-col justify-between overflow-hidden relative font-mono">
                        <div className="flex justify-between items-center z-10">
                          <span className="text-xs text-thg-gold font-bold">THG.RIP_ENGINE</span>
                          <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">PROCESSING</span>
                        </div>
                        
                        <div className="flex flex-col gap-2 z-10">
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span>Vector Rendering...</span>
                            <span>84%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-thg-gold w-[84%] animate-pulse" />
                          </div>
                          <div className="flex gap-2 mt-1">
                            <span className="text-[9px] text-slate-500">CMYK Profile: Fogra39</span>
                            <span className="text-[9px] text-slate-500">•</span>
                            <span className="text-[9px] text-slate-500">300 DPI</span>
                          </div>
                        </div>

                        {/* Grid background effect */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:1rem_1rem] [mask-image:linear-gradient(to_bottom,transparent,black)] opacity-20" />
                      </div>

                      <div className="flex gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-thg-gold/10 text-thg-gold text-xs font-mono font-medium tracking-tight">
                          [DTG Engine]
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-mono font-medium tracking-tight border border-blue-100">
                          [Color Calibrated]
                        </span>
                      </div>
                      <div className="mt-3 inline-flex items-center px-2.5 py-1 rounded-md bg-green-50 text-green-600 text-xs font-mono font-medium tracking-tight border border-green-100">
                        [No Minimum Order]
                      </div>
                    </div>
                    
                    {/* Laser scanning line animation effect */}
                    <div className="absolute top-10 -inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-thg-gold to-transparent opacity-50 shadow-[0_0_8px_#C29B38] animate-[bounce_3s_infinite_alternate]" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 02: Quy Trình Kiểm Định Từng Đơn */}
            {activeTab === 1 && (
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 animate-in fade-in zoom-in-95 duration-500">
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-thg-border">
                  <h3 className="text-2xl font-bold tracking-tight text-thg-textMain mb-8">
                    Item-Level QC Gate
                  </h3>
                  <div className="flex flex-col gap-8 relative before:absolute before:inset-y-2 before:left-[19px] before:w-px before:bg-thg-border">
                    <div className="flex gap-6 relative z-10">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border-2 border-thg-border shadow-sm">
                        <ScanFace className="w-4 h-4 text-thg-textMuted" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-thg-textMain mb-1">1. Check Định Dạng & File</h4>
                        <p className="text-thg-textMuted text-sm leading-relaxed">AI & Operator kiểm tra file thiết kế vector/raster độ phân giải cao, căn lề và safe-zone.</p>
                      </div>
                    </div>
                    <div className="flex gap-6 relative z-10">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border-2 border-thg-border shadow-sm">
                        <Palette className="w-4 h-4 text-thg-textMuted" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-thg-textMain mb-1">2. Check Màu Sắc Thực Tế</h4>
                        <p className="text-thg-textMuted text-sm leading-relaxed">So sánh màu sắc in ấn thực tế với chuẩn catalog thương mại điện tử để loại trừ sai lệch.</p>
                      </div>
                    </div>
                    <div className="flex gap-6 relative z-10">
                      <div className="w-10 h-10 rounded-full bg-thg-textMain flex items-center justify-center shrink-0 border-2 border-thg-textMain shadow-md ring-4 ring-thg-textMain/10">
                        <CheckCircle2 className="w-5 h-5 text-thg-gold" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-thg-textMain mb-1">3. QC Gate (Dấu mộc kiểm định)</h4>
                        <p className="text-thg-textMuted text-sm leading-relaxed">Sản phẩm hoàn hảo 100% được đóng mộc số hóa, đảm bảo không lỗi trước khi sang khâu đóng gói.</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Visual Mockup 02 */}
                <div className="relative bg-thg-bg p-8 flex flex-col items-center justify-center overflow-hidden min-h-[400px]">
                  <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />
                  
                  <div className="relative z-10 w-full max-w-sm flex flex-col gap-4">
                    {/* Simulated QC Interface */}
                    <div className="bg-white rounded-xl shadow-lg border border-thg-border overflow-hidden">
                      <div className="bg-thg-bg px-4 py-3 border-b border-thg-border flex justify-between items-center">
                        <span className="font-mono text-xs font-semibold text-thg-textMuted">SYSTEM.QC_GATE</span>
                        <span className="flex gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        </span>
                      </div>
                      <div className="p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-medium text-emerald-900">Resolution Check</span>
                          </div>
                          <span className="font-mono text-xs text-emerald-600 font-bold">1200 DPI</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-medium text-emerald-900">Color Match</span>
                          </div>
                          <span className="font-mono text-xs text-emerald-600 font-bold">ΔE &lt; 2.0</span>
                        </div>
                        
                        <div className="mt-2 py-3 border-t border-dashed border-thg-border flex justify-center">
                          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-thg-textMain text-white">
                            <CheckCircle2 className="w-4 h-4 text-thg-gold" />
                            <span className="text-xs font-bold tracking-wide">QC PASSED • 99.8% RATE</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 03: Đóng Gói Chuẩn Sàn TMĐT */}
            {activeTab === 2 && (
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 animate-in fade-in zoom-in-95 duration-500">
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-thg-border">
                  <h3 className="text-2xl font-bold tracking-tight text-thg-textMain mb-8">
                    Standardized Packaging
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="p-5 rounded-2xl bg-thg-bg border border-thg-border">
                      <PackageCheck className="w-6 h-6 text-thg-gold mb-3" />
                      <h4 className="font-semibold text-thg-textMain mb-1">Custom & Standard Boxing</h4>
                      <p className="text-thg-textMuted text-sm leading-relaxed">Đóng gói hộp tiêu chuẩn e-commerce, hỗ trợ custom packaging (thẻ cảm ơn, túi niêm phong riêng) để tăng giá trị thương hiệu.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white border border-thg-border shadow-sm flex flex-col justify-center">
                        <Barcode className="w-5 h-5 text-thg-textMuted mb-2" />
                        <h4 className="font-semibold text-thg-textMain text-sm mb-1">Smart Tracking</h4>
                        <p className="text-thg-textSubtle text-xs">Dán nhãn chuẩn USPS / FedEx / DHL.</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-thg-border shadow-sm flex flex-col justify-center">
                        <Truck className="w-5 h-5 text-thg-textMuted mb-2" />
                        <h4 className="font-semibold text-thg-textMain text-sm mb-1">Volume Optimized</h4>
                        <p className="text-thg-textSubtle text-xs">Tối ưu chi phí volumetric weight cho seller.</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Visual Mockup 03 */}
                <div className="relative bg-thg-textMain flex flex-col items-center justify-center overflow-hidden min-h-[400px]">
                  <Image
                    src="/assets/fulfill/operations-floor.jpg"
                    alt={copy.showcaseEyebrow}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover opacity-80 mix-blend-overlay hover:opacity-100 hover:mix-blend-normal transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-thg-textMain via-thg-textMain/20 to-transparent pointer-events-none" />
                  
                  <div className="relative z-10 w-full p-8 mt-auto">
                    {/* Eco Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/95 shadow-sm backdrop-blur-sm border border-white/20">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-800 tracking-wider">USPS REAL PACKAGING</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
