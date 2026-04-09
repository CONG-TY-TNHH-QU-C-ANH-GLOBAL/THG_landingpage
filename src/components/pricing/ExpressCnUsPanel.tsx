import React from "react";
import { ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface ExpressCnUsPanelProps {
    route: string;
}

const ExpressCnUsPanel = ({ route }: ExpressCnUsPanelProps) => {
    const { t, effectiveLanguage: lang } = useI18n();
    return (
        <div>


            <div className="space-y-4">
                {/* CN Express Cards */}
                {[
                    { name: t("ecn.dhl_name"), time: "3–5 BSD", bg: "bg-[#C8102E]", tax: false, price: 11 },
                    { name: t("ecn.ups_fast"), time: "6–10 BSD", bg: "bg-navy", tax: true, price: 10.50 },
                    { name: t("ecn.ups_std"), time: "8–10 BSD", bg: "bg-[#16213E]", tax: true, price: 9 },
                    { name: t("ecn.mason_sea"), time: "20–25 BSD", bg: "bg-[#0F3460]", tax: true, price: 3 },
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
                                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">{t("ecn.weight_header")}</th>
                                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">{t("ecn.price_header")}</th>
                                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">{t("ecn.note_header")}</th>
                            </tr></thead>
                            <tbody>
                                <tr className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                                    <td className="px-5 py-3 font-medium">21KG+</td>
                                    <td className="px-5 py-3 font-bold text-navy notranslate">
                                        <span translate="no">{`$${line.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}`}</span>
                                    </td>
                                    <td className="px-5 py-3 text-muted-foreground text-[12px] italic">{t("ecn.bulk_quote")}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            {/* Post-table CN-US — Express policy notice */}
            <div className="bg-[#F0F7FF] border border-blue-200 rounded-xl p-5 mt-6 text-center">
                <p className="text-[14px] font-semibold text-navy mb-1">
                    {t("evn.express_policy")}
                </p>
                <p className="text-[12px] text-muted-foreground">
                    {t("evn.express_note")}
                </p>
            </div>

            <div className="text-center mt-5">
                <a href="https://order.thgfulfill.com/" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-gold-dark text-white rounded-lg px-7 py-3 font-bold text-sm transition-all shadow-lg">
                    {t("ecn.contact_btn")} <ExternalLink className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
};

export default ExpressCnUsPanel;
