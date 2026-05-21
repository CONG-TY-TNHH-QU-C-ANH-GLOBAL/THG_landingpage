import { useI18n } from "@/lib/i18n";
import { useLarkPricingContext } from "@/components/pricing/LarkPricingProvider";
import { LeadFormDialog } from "@/components/lead/LeadFormDialog";

interface ExpressCnUsPanelProps {
    route: string;
}

interface ExpressLine {
    name: string;
    time: string;
    price: number | string;
    tax_included: boolean | string;
    color: string;
}

const ExpressCnUsPanel = (_: ExpressCnUsPanelProps) => {
    const { t } = useI18n();
    const { cmsOverlay } = useLarkPricingContext();

    const lines: ExpressLine[] = Array.isArray(cmsOverlay["expressCnUs"])
        ? (cmsOverlay["expressCnUs"] as ExpressLine[])
        : [];

    const formatPrice = (price: number | string): string => {
        if (typeof price === "number") {
            return `$${price.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
        }
        const trimmed = String(price).trim();
        if (trimmed.startsWith("$")) return trimmed;
        const num = Number(trimmed);
        if (Number.isFinite(num)) return `$${num.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
        return trimmed;
    };

    const isTaxIncluded = (v: boolean | string): boolean => {
        if (typeof v === "boolean") return v;
        return ["true", "1", "yes", "y", "có"].includes(String(v).trim().toLowerCase());
    };

    return (
        <div>
            <div className="space-y-4">
                {lines.length === 0 ? (
                    <div className="bg-white border border-[var(--pricing-border)] rounded-xl p-8 text-center text-muted-foreground text-sm">
                        Bảng giá Express CN-US chưa được cập nhật. Vận hành mở CMS để thêm dữ liệu.
                    </div>
                ) : (
                    lines.map((line, i) => {
                        const tax = isTaxIncluded(line.tax_included);
                        const bg = line.color || "#1A2342";
                        return (
                            <div key={i} className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden shadow-sm">
                                <div className="px-5 py-3 flex items-center justify-between flex-wrap gap-2" style={{ backgroundColor: bg }}>
                                    <span className="text-white font-bold text-[13px] flex items-center gap-2 notranslate" translate="no">
                                        {line.name} <span className="font-normal text-[13px] opacity-80">{line.time}</span>
                                    </span>
                                    <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full notranslate ${tax ? "bg-emerald-100/20 text-emerald-300" : "bg-amber-100/20 text-amber-300"}`} translate="no">
                                        {tax ? "✅ Import tax US included" : "⚠️ Import tax US excluded"}
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
                                                <span translate="no">{formatPrice(line.price)}</span>
                                            </td>
                                            <td className="px-5 py-3 text-muted-foreground text-[12px] italic">{t("ecn.bulk_quote")}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        );
                    })
                )}
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
                <LeadFormDialog
                    sourcePage="/international-pricing#express-cn-us"
                    trigger={
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-gold-dark text-white rounded-lg px-7 py-3 font-bold text-sm transition-all shadow-lg"
                        >
                            {t("ecn.contact_btn")}
                        </button>
                    }
                />
            </div>
        </div>
    );
};

export default ExpressCnUsPanel;
