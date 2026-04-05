import { useState } from "react";
import { pricingData } from "@/data/pricingData";
import PriceTable from "./PriceTable";

const ShipByLabelPanel = ({ larkData }: { larkData?: { regular: any[]; special: any[] } | null }) => {
    const [tab, setTab] = useState<"regular" | "special">("regular");

    const tabs = [
        { id: "regular" as const, label: "🇺🇸 CN → US (Regular)", fallbackKey: "tiktokCnUsNormal" },
        { id: "special" as const, label: "🇺🇸 CN → US (Special)", fallbackKey: "tiktokCnUsSpecial" },
    ];

    const activeTab = tabs.find(t => t.id === tab)!;
    const data = larkData?.[tab]?.length ? larkData[tab] : (pricingData as any)[activeTab.fallbackKey] || [];

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">📦 BẢNG GIÁ CN — US SHIP BY LABEL</p>
            </div>

            {/* Transit time + Fee banners */}
            <div className="bg-[#FFFBEE] border-[1.5px] border-dashed border-[#D4A843] rounded-[10px] p-3 text-[12px] text-[#92670A] mb-4 flex gap-2">
                <span>ℹ️</span>
                <div>
                    <strong>Thời gian vận chuyển:</strong> 7–10 BSD (theo lịch USPS). Bao gồm Import Tax US.
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="bg-white border border-[var(--pricing-border)] rounded-xl px-4 py-3 flex items-center gap-3 text-[13px]">
                    <span className="text-lg">💳</span>
                    <div>
                        <span className="font-bold text-navy notranslate" translate="no">Order Handling Fee:</span>{" "}
                        <span className="text-primary font-extrabold notranslate" translate="no">0.7$</span>
                        <p className="text-muted-foreground text-[11px] mt-0.5">(Nếu sử dụng hệ thống kho THG)</p>
                    </div>
                </div>
                <div className="bg-white border border-[var(--pricing-border)] rounded-xl px-4 py-3 flex items-center gap-3 text-[13px]">
                    <span className="text-lg">📡</span>
                    <div>
                        <span className="font-bold text-navy notranslate" translate="no">Active tracking fee:</span>{" "}
                        <span className="text-primary font-extrabold notranslate" translate="no">0.5$</span>
                        <p className="text-muted-foreground text-[11px] mt-0.5">(Nếu sử dụng dịch vụ active tracking USPS)</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`px-4 py-2 rounded-lg text-[13px] font-bold border transition-all ${tab === t.id
                            ? "bg-primary text-white border-primary shadow-md"
                            : "bg-white border-[var(--pricing-border)] text-muted-foreground hover:border-primary/40"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
            <PriceTable
                title={`CN → US · ${tab === "regular" ? "Regular Product" : "Special Product"}`}
                badge="Ship by Label"
                data={data}
                columns={[{ key: "rate", label: "Shipping fee ($)" }]}
            />
        </div>
    );
};

export default ShipByLabelPanel;
