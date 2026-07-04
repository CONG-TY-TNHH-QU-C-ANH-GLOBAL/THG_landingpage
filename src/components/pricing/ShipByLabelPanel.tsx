import { useState } from "react";
import { Info } from "lucide-react";
import PriceTable from "./PriceTable";
import { useI18n } from "@/lib/i18n";
import { useLarkPricingContext } from "@/components/pricing/LarkPricingProvider";

const ShipByLabelPanel = ({ larkData }: { larkData?: { regular: any[]; special: any[] } | null }) => {
    const [tab, setTab] = useState<"regular" | "special">("regular");
    const { t } = useI18n();
    const { cmsOverlay } = useLarkPricingContext();

    const tabs = [
        { id: "regular" as const, label: t("sbl.tab_regular"), cmsSlug: "tiktokCnUsNormal" },
        { id: "special" as const, label: t("sbl.tab_special"), cmsSlug: "tiktokCnUsSpecial" },
    ];

    const activeTab = tabs.find(tb => tb.id === tab)!;
    const cmsData = (cmsOverlay[activeTab.cmsSlug] as any[]) ?? [];
    const data = larkData?.[tab]?.length ? larkData[tab] : cmsData;

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground notranslate" translate="no">{t("sbl.panel_title")}</p>
            </div>

            {/* Transit time + Fee banners */}
            <div className="bg-[#FFFBEE] border-[1.5px] border-dashed border-[#D4A843] rounded-[10px] p-3 text-[12px] text-[#92670A] mb-4 flex gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                    <strong>{t("sbl.transit_time")}</strong> {t("sbl.transit_desc")}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="bg-white border border-[var(--pricing-border)] rounded-xl px-4 py-3 flex items-center gap-3 text-[13px]">
                    <span className="text-lg">💳</span>
                    <div>
                        <span className="font-bold text-navy notranslate" translate="no">{t("sbl.order_fee_label")}</span>{" "}
                        <span className="text-primary font-extrabold notranslate" translate="no">0.7$</span>
                        <p className="text-muted-foreground text-[11px] mt-0.5 notranslate" translate="no">{t("sbl.order_fee_note")}</p>
                    </div>
                </div>
                <div className="bg-white border border-[var(--pricing-border)] rounded-xl px-4 py-3 flex items-center gap-3 text-[13px]">
                    <span className="text-lg">📡</span>
                    <div>
                        <span className="font-bold text-navy notranslate" translate="no">{t("sbl.tracking_fee_label")}</span>{" "}
                        <span className="text-primary font-extrabold notranslate" translate="no">0.5$</span>
                        <p className="text-muted-foreground text-[11px] mt-0.5 notranslate" translate="no">{t("sbl.tracking_fee_note")}</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
                {tabs.map(tb => (
                    <button
                        key={tb.id}
                        onClick={() => setTab(tb.id)}
                        className={`px-4 py-2 rounded-lg text-[13px] font-bold border transition-all ${tab === tb.id
                            ? "bg-primary text-white border-primary shadow-md"
                            : "bg-white border-[var(--pricing-border)] text-muted-foreground hover:border-primary/40"
                            }`}
                    >
                        {tb.label}
                    </button>
                ))}
            </div>
            <PriceTable
                title={`CN → US · ${tab === "regular" ? t("sbl.title_regular") : t("sbl.title_special")}`}
                badge="Ship by Label"
                data={data}
                columns={[{ key: "rate", label: "Shipping fee ($)" }]}
            />
        </div>
    );
};

export default ShipByLabelPanel;
