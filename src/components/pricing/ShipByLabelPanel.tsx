import { useState } from "react";
import { pricingData } from "@/data/pricingData";
import { useI18n } from "@/lib/i18n";
import PriceTable from "./PriceTable";

const ShipByLabelPanel = ({ larkData }: { larkData?: { regular: any[]; special: any[] } | null }) => {
    const { effectiveLanguage: lang } = useI18n();
    const [tab, setTab] = useState<"regular" | "special">("regular");

    const tabs = [
        { id: "regular" as const, fallbackKey: "tiktokCnUsNormal" },
        { id: "special" as const, fallbackKey: "tiktokCnUsSpecial" },
    ];

    const activeTab = tabs.find(t => t.id === tab)!;
    const data = larkData?.[tab]?.length ? larkData[tab] : (pricingData as any)[activeTab.fallbackKey] || [];

    const tabLabel = (id: "regular" | "special") => {
        const suffix = id === "regular"
            ? (lang === "zh" ? "普通产品" : lang === "en" ? "Regular" : "Thường")
            : (lang === "zh" ? "特殊产品" : lang === "en" ? "Special" : "Đặc Biệt");
        return `🇺🇸 CN → US (${suffix})`;
    };

    const sectionTitle = lang === "zh" ? "CN — US Ship by Label 价格表"
        : lang === "en" ? "PRICE LIST CN — US SHIP BY LABEL"
        : "BẢNG GIÁ CN — US SHIP BY LABEL";

    const tableTitle = `CN → US · ${tab === "regular"
        ? (lang === "zh" ? "普通产品" : lang === "en" ? "Regular Product" : "Hàng Thường")
        : (lang === "zh" ? "特殊产品" : lang === "en" ? "Special Product" : "Hàng Đặc Biệt")}`;

    const colLabel = lang === "zh" ? "运费 ($)" : lang === "en" ? "Shipping fee ($)" : "Phí vận chuyển ($)";

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">📦 {sectionTitle}</p>
            </div>

            {/* Transit time banner */}
            <div className="bg-[#FFFBEE] border-[1.5px] border-dashed border-[#D4A843] rounded-[10px] p-3 text-[12px] text-[#92670A] mb-4 flex gap-2">
                <span>ℹ️</span>
                <div><strong>{lang === "zh" ? "运输时间：" : lang === "en" ? "Shipping time:" : "Thời gian vận chuyển:"}</strong> {lang === "zh" ? "7–10 个工作日（按 USPS 时间表）。含美国进口税。" : lang === "en" ? "7–10 BSD (according to USPS schedule). Includes US import tax." : "7–10 BSD (theo lịch USPS). Bao gồm Import Tax US."}</div>
            </div>

            {/* Fee banners */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="bg-white border border-[var(--pricing-border)] rounded-xl px-4 py-3 flex items-center gap-3 text-[13px]">
                    <span className="text-lg">💳</span>
                    <div>
                        <span className="font-bold text-navy notranslate" translate="no">Order Handling Fee:</span>{" "}
                        <span className="text-primary font-extrabold notranslate" translate="no">0.7$</span>
                        <p className="text-muted-foreground text-[11px] mt-0.5">
                            {lang === "zh" ? "(如使用THG仓库系统)" : lang === "en" ? "(If using the THG warehouse system)" : "(Nếu sử dụng hệ thống kho THG)"}
                        </p>
                    </div>
                </div>
                <div className="bg-white border border-[var(--pricing-border)] rounded-xl px-4 py-3 flex items-center gap-3 text-[13px]">
                    <span className="text-lg">📡</span>
                    <div>
                        <span className="font-bold text-navy notranslate" translate="no">Active tracking fee:</span>{" "}
                        <span className="text-primary font-extrabold notranslate" translate="no">0.5$</span>
                        <p className="text-muted-foreground text-[11px] mt-0.5">
                            {lang === "zh" ? "(如使用USPS的active tracking服务)" : lang === "en" ? "(If using USPS active tracking service)" : "(Nếu sử dụng dịch vụ active tracking USPS)"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tab buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`px-4 py-2 rounded-lg text-[13px] font-bold border transition-all notranslate ${tab === t.id
                            ? "bg-primary text-white border-primary shadow-md"
                            : "bg-white border-[var(--pricing-border)] text-muted-foreground hover:border-primary/40"
                            }`}
                        translate="no"
                    >
                        {tabLabel(t.id)}
                    </button>
                ))}
            </div>

            <PriceTable
                title={tableTitle}
                badge="Ship by Label"
                data={data}
                columns={[{ key: "rate", label: colLabel }]}
            />
        </div>
    );
};

export default ShipByLabelPanel;
