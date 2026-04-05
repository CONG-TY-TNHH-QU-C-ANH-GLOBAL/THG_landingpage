import React, { useState } from "react";
import { useI18n } from "@/lib/i18n";

interface ExpressVnUsPanelProps {
    larkOverlay: Record<string, any>;
}

const ExpressVnUsPanel = ({ larkOverlay }: ExpressVnUsPanelProps) => {
    const [city, setCity] = useState<"hcm" | "hn">("hcm");
    const { effectiveLanguage: lang } = useI18n();

    return (
        <div>
            <div className="flex justify-center mb-6">
                <div className="bg-[#FAF9F6] border-[1.5px] border-[var(--pricing-border)] p-1 rounded-xl inline-flex shadow-sm">
                    <button
                        onClick={() => setCity("hcm")}
                        className={`px-8 py-2.5 rounded-lg text-[13px] font-bold transition-all ${city === "hcm"
                            ? "bg-white text-primary shadow-sm border border-[var(--pricing-border)]"
                            : "text-muted-foreground hover:bg-white/50 border border-transparent"
                            }`}
                    >
                        KHO HỒ CHÍ MINH
                    </button>
                    <button
                        onClick={() => setCity("hn")}
                        className={`px-8 py-2.5 rounded-lg text-[13px] font-bold transition-all ${city === "hn"
                            ? "bg-white text-primary shadow-sm border border-[var(--pricing-border)]"
                            : "text-muted-foreground hover:bg-white/50 border border-transparent"
                            }`}
                    >
                        KHO HÀ NỘI
                    </button>
                </div>
            </div>

            {larkOverlay["expressVnUs"] && (
                <div className="space-y-6">
                    {/* Saver <= 20kg Table */}
                    <div className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-navy px-5 py-3 flex items-center justify-between flex-wrap gap-2">
                            <span className="text-white font-bold text-[13px] flex items-center gap-2">
                                ✈️ UPS Saver — Phân Mức KG
                            </span>
                            <span className="bg-[rgba(184,146,42,0.25)] text-[#D4A843] text-[12px] font-bold px-2 py-0.5 rounded-full">
                                ⏱ {city === "hcm" ? "3-5" : "3-5"} BSD
                            </span>
                        </div>
                        <table className="w-full border-collapse text-[13px]">
                            <thead>
                                <tr className="bg-[#FAFAF8]">
                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Cân nặng (kg)</th>
                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Shipping fee (VNĐ)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(larkOverlay["expressVnUs"]?.[city]?.saver || []).map((r: any, i: number) => (
                                    <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
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

                    {/* Expedited > 20kg Table */}
                    <div className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-[#16213E] px-5 py-3 flex items-center justify-between flex-wrap gap-2">
                            <span className="text-white font-bold text-[13px] flex items-center gap-2">
                                🚢 UPS Expedited — Hàng Bulk
                            </span>
                            <span className="bg-[rgba(184,146,42,0.25)] text-[#D4A843] text-[12px] font-bold px-2 py-0.5 rounded-full">
                                ⏱ {city === "hcm" ? "5-7" : "5-7"} BSD
                            </span>
                        </div>
                        <table className="w-full border-collapse text-[13px]">
                            <thead>
                                <tr className="bg-[#FAFAF8]">
                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Hạng mức (kg)</th>
                                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Shipping fee (VNĐ)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(larkOverlay["expressVnUs"]?.[city]?.expedited || []).map((r: any, i: number) => (
                                    <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
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
            )}

            {/* Express policy notice — no Remote/Re-delivery for Express */}
            <div className="bg-[#F0F7FF] border border-blue-200 rounded-xl p-5 mt-6 text-center">
                <p className="text-[14px] font-semibold text-navy mb-1">
                    {lang === 'zh' ? '📋 如需了解 Express 详细运输政策，请联系 THG' : lang === 'en' ? '📋 Please contact THG for detailed shipping policy on express cargo.' : '📋 Liên hệ THG để biết thêm chi tiết chính sách vận chuyển hàng Express.'}
                </p>
                <p className="text-[12px] text-muted-foreground">
                    {lang === 'zh' ? 'Express 路线不适用 Epacket 的偏远附加费和退件重寄政策。' : lang === 'en' ? 'Express routes do not apply Epacket remote surcharge or re-delivery policies.' : 'Tuyến Express không áp dụng phụ phí vùng sâu và chính sách reship của Epacket.'}
                </p>
            </div>
        </div>
    );
};

export default ExpressVnUsPanel;
