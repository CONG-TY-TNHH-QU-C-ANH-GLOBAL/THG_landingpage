import React from "react";
import { ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface ExpressCnUsPanelProps {
    route: string;
}

const ExpressCnUsPanel = ({ route }: ExpressCnUsPanelProps) => {
    const { effectiveLanguage: lang } = useI18n();
    return (
        <div>


            <div className="space-y-4">
                {/* CN Express Cards */}
                {[
                    { name: "✈️ DHL Air – Hỏa Tốc", time: "3–5 BSD", bg: "bg-[#C8102E]", tax: false, price: 11 },
                    { name: "✈️ UPS Air – Nhanh", time: "6–10 BSD", bg: "bg-navy", tax: true, price: 10.50 },
                    { name: "✈️ UPS Air – Tiêu Chuẩn", time: "8–10 BSD", bg: "bg-[#16213E]", tax: true, price: 9 },
                    { name: "🚢 Mason Sea", time: "20–25 BSD", bg: "bg-[#0F3460]", tax: true, price: 3 },
                ].map((line, i) => (
                    <div key={i} className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden shadow-sm">
                        <div className={`${line.bg} px-5 py-3 flex items-center justify-between flex-wrap gap-2`}>
                            <span className="text-white font-bold text-[13px] flex items-center gap-2">
                                {line.name} <span className="font-normal text-[13px] opacity-80">{line.time}</span>
                            </span>
                            <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full notranslate ${line.tax ? "bg-emerald-100/20 text-emerald-300" : "bg-amber-100/20 text-amber-300"}`} translate="no">
                                {line.tax ? "✅ Import tax US included" : "⚠️ Import tax US excluded"}
                            </span>
                        </div>
                        <table className="w-full border-collapse text-[13px]">
                            <thead><tr className="bg-[#FAFAF8]">
                                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Cân Nặng</th>
                                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Giá ($/kg)</th>
                                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Ghi chú</th>
                            </tr></thead>
                            <tbody>
                                <tr className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                                    <td className="px-5 py-3 font-medium">21KG+</td>
                                    <td className="px-5 py-3 font-bold text-navy notranslate">
                                        <span translate="no">{`$${line.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}`}</span>
                                    </td>
                                    <td className="px-5 py-3 text-muted-foreground text-[12px] italic">Báo giá theo lô</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            {/* Post-table CN-US — Express policy notice */}
            <div className="bg-[#F0F7FF] border border-blue-200 rounded-xl p-5 mt-6 text-center">
                <p className="text-[14px] font-semibold text-navy mb-1">
                    {lang === 'zh' ? '📋 如需了解 Express 详细运输政策，请联系 THG' : lang === 'en' ? '📋 Please contact THG for detailed shipping policy on express cargo.' : '📋 Liên hệ THG để biết thêm chi tiết chính sách vận chuyển hàng Express.'}
                </p>
                <p className="text-[12px] text-muted-foreground">
                    {lang === 'zh' ? 'Express 路线不适用 Epacket 的偏远附加费和退件重寄政策。' : lang === 'en' ? 'Express routes do not apply Epacket remote surcharge or re-delivery policies.' : 'Tuyến Express không áp dụng phụ phí vùng sâu và chính sách reship của Epacket.'}
                </p>
            </div>

            <div className="text-center mt-5">
                <a href="https://order.thgfulfill.com/" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-gold-dark text-white rounded-lg px-7 py-3 font-bold text-sm transition-all shadow-lg">
                    📞 Liên hệ báo giá CN–US <ExternalLink className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
};

export default ExpressCnUsPanel;
