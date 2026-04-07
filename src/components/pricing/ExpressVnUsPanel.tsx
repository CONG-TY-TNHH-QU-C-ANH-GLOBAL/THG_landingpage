import React, { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { pricingData } from "@/data/pricingData";

interface ExpressVnUsPanelProps {
    larkOverlay: Record<string, any>;
}

const ExpressVnUsPanel = ({ larkOverlay }: ExpressVnUsPanelProps) => {
    const [city, setCity] = useState<"hcm" | "hn">("hcm");
    const { effectiveLanguage: lang } = useI18n();

    // Use larkOverlay if available, otherwise fallback to pricingData
    const expressData = larkOverlay["expressVnUs"] || (pricingData as any).expressVnUs;

    return (
        <div>
            {/* City Toggle - mobile friendly */}
            <div className="flex justify-center mb-6">
                <div className="bg-secondary/50 border-[1.5px] border-[hsl(var(--pricing-border))] p-1 rounded-xl inline-flex shadow-sm w-full sm:w-auto">
                    <button
                        onClick={() => setCity("hcm")}
                        className={`flex-1 sm:flex-none px-6 sm:px-8 py-2.5 rounded-lg text-[13px] font-bold transition-all ${city === "hcm"
                            ? "bg-card text-primary shadow-sm border border-[hsl(var(--pricing-border))]"
                            : "text-muted-foreground hover:bg-card/50 border border-transparent"
                            }`}
                    >
                        KHO HỒ CHÍ MINH
                    </button>
                    <button
                        onClick={() => setCity("hn")}
                        className={`flex-1 sm:flex-none px-6 sm:px-8 py-2.5 rounded-lg text-[13px] font-bold transition-all ${city === "hn"
                            ? "bg-card text-primary shadow-sm border border-[hsl(var(--pricing-border))]"
                            : "text-muted-foreground hover:bg-card/50 border border-transparent"
                            }`}
                    >
                        KHO HÀ NỘI
                    </button>
                </div>
            </div>

            {expressData && (

                <div className="space-y-6">
                    {/* Saver <= 20kg */}
                    <div className="bg-card border border-[hsl(var(--pricing-border))] rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-navy px-4 sm:px-5 py-3 flex items-center justify-between flex-wrap gap-2">
                            <span className="text-primary-foreground font-bold text-[13px] flex items-center gap-2">
                                ✈️ UPS Saver — Phân Mức KG
                            </span>
                            <span className="bg-[rgba(184,146,42,0.25)] text-[#D4A843] text-[12px] font-bold px-2 py-0.5 rounded-full">
                                ⏱ {city === "hcm" ? "3-5" : "3-5"} BSD
                            </span>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden flex flex-col gap-3 p-3">
                            {(expressData?.[city]?.saver || []).map((r: any, i: number) => (
                                <div key={i} className="bg-card border border-[hsl(var(--pricing-border))] rounded-lg p-3 flex justify-between items-center">
                                    <div>
                                        <span className="text-[11px] font-bold text-muted-foreground uppercase">Cân nặng</span>
                                        <div className="text-[14px] font-bold text-primary notranslate" translate="no">{r.kg} kg</div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[11px] font-bold text-muted-foreground uppercase">Shipping fee</span>
                                        <div className="text-[14px] font-bold text-navy notranslate" translate="no">
                                            {r.price && r.price !== "Liên hệ"
                                                ? `${Number(r.price).toLocaleString("vi-VN")} ₫${Number(r.kg) >= 21 ? " / kg" : ""}`
                                                : r.price}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden md:block">
                            <table className="w-full border-collapse text-[13px]">
                                <thead>
                                    <tr className="bg-secondary/30">
                                        <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[hsl(var(--pricing-border))]">Cân nặng (kg)</th>
                                        <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[hsl(var(--pricing-border))]">Shipping fee (VNĐ)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(expressData?.[city]?.saver || []).map((r: any, i: number) => (
                                        <tr key={i} className="border-b border-[hsl(var(--pricing-border))] last:border-0 hover:bg-accent/5 transition-colors">
                                            <td className="px-5 py-2 notranslate" translate="no">{r.kg}</td>
                                            <td className="px-5 py-2 font-bold text-navy notranslate" translate="no">
                                                {r.price && r.price !== "Liên hệ"
                                                    ? `${Number(r.price).toLocaleString("vi-VN")} ₫${Number(r.kg) >= 21 ? " / kg" : ""}`
                                                    : r.price}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Expedited > 20kg */}
                    <div className="bg-card border border-[hsl(var(--pricing-border))] rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-[#16213E] px-4 sm:px-5 py-3 flex items-center justify-between flex-wrap gap-2">
                            <span className="text-primary-foreground font-bold text-[13px] flex items-center gap-2">
                                🚢 UPS Expedited — Hàng Bulk
                            </span>
                            <span className="bg-[rgba(184,146,42,0.25)] text-[#D4A843] text-[12px] font-bold px-2 py-0.5 rounded-full">
                                ⏱ {city === "hcm" ? "5-7" : "5-7"} BSD
                            </span>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden flex flex-col gap-3 p-3">
                            {(expressData?.[city]?.expedited || []).map((r: any, i: number) => (
                                <div key={i} className="bg-card border border-[hsl(var(--pricing-border))] rounded-lg p-3 flex justify-between items-center">
                                    <div>
                                        <span className="text-[11px] font-bold text-muted-foreground uppercase">Hạng mức</span>
                                        <div className="text-[14px] font-bold text-primary notranslate" translate="no">{r.bracket}</div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[11px] font-bold text-muted-foreground uppercase">Shipping fee</span>
                                        <div className="text-[14px] font-bold text-navy notranslate" translate="no">
                                            {r.price && r.price !== "Liên hệ"
                                                ? `${Number(r.price).toLocaleString("vi-VN")} ₫${String(r.bracket).includes("-") || String(r.bracket).includes(">") ? " / kg" : ""}`
                                                : r.price}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden md:block">
                            <table className="w-full border-collapse text-[13px]">
                                <thead>
                                    <tr className="bg-secondary/30">
                                        <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[hsl(var(--pricing-border))]">Hạng mức (kg)</th>
                                        <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[hsl(var(--pricing-border))]">Shipping fee (VNĐ)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(expressData?.[city]?.expedited || []).map((r: any, i: number) => (
                                        <tr key={i} className="border-b border-[hsl(var(--pricing-border))] last:border-0 hover:bg-accent/5 transition-colors">
                                            <td className="px-5 py-2 notranslate" translate="no">{r.bracket}</td>
                                            <td className="px-5 py-2 font-bold text-navy notranslate" translate="no">
                                                {r.price && r.price !== "Liên hệ"
                                                    ? `${Number(r.price).toLocaleString("vi-VN")} ₫${String(r.bracket).includes("-") || String(r.bracket).includes(">") ? " / kg" : ""}`
                                                    : r.price}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Express policy notice */}
            <div className="bg-[#F0F7FF] border border-blue-200 rounded-xl p-4 sm:p-5 mt-6 text-center">
                <p className="text-[13px] sm:text-[14px] font-semibold text-navy mb-1">
                    {lang === 'zh' ? '📋 如需了解 Express 详细运输政策，请联系 THG' : lang === 'en' ? '📋 Please contact THG for detailed shipping policy on express cargo.' : '📋 Liên hệ THG để biết thêm chi tiết chính sách vận chuyển hàng Express.'}
                </p>
                <p className="text-[11px] sm:text-[12px] text-muted-foreground">
                    {lang === 'zh' ? 'Express 路线不适用 Epacket 的偏远附加费和退件重寄政策。' : lang === 'en' ? 'Express routes do not apply Epacket remote surcharge or re-delivery policies.' : 'Tuyến Express không áp dụng phụ phí vùng sâu và chính sách reship của Epacket.'}
                </p>
            </div>
        </div>
    );
};

export default ExpressVnUsPanel;
