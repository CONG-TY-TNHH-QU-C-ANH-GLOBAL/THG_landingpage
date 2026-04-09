import React from "react";
import { useI18n } from "@/lib/i18n";
import { Link } from "react-router-dom";
import { EpacketRoute, CargoType, ROUTES, CARGO_LABELS, CARGO_ICONS } from "@/components/pricing/types";
import Accordion from "@/components/pricing/Accordion";
import PriceTable from "@/components/pricing/PriceTable";
import CompactAccordionTable from "@/components/pricing/CompactAccordionTable";
import ShipByLabelPanel from "@/components/pricing/ShipByLabelPanel";
import { pricingData } from "@/data/pricingData";
import ShippingTermsQnAPanel from "@/components/pricing/ShippingTermsQnAPanel";

interface EpacketPanelProps {
    route: EpacketRoute;
    cargo: CargoType;
    handleRouteSwitch: (r: EpacketRoute) => void;
    handleCargoSwitch: (c: CargoType) => void;
    routeConfig: typeof ROUTES[EpacketRoute];
    currentData: any[];
    tableColumns: { key: string; label: string }[];
    larkOverlay: Record<string, any>;
    vatData: any[];
    remoteSurcharge: any[];
    redeliveryData: any[];
    larkLoading?: boolean;
    larkError?: string | null;
}

const EpacketPanel = ({
    route, cargo,
    handleRouteSwitch, handleCargoSwitch,
    routeConfig, currentData, tableColumns,
    larkOverlay, vatData, remoteSurcharge, redeliveryData,
    larkLoading, larkError,
}: EpacketPanelProps) => {
    const { t, effectiveLanguage: lang } = useI18n();

    const getRouteName = (r: typeof ROUTES[EpacketRoute]) => {
        if (lang === 'zh') return r.nameZh;
        if (lang === 'en') return r.nameEn;
        return r.nameVi;
    };
    const getRouteTime = (r: typeof ROUTES[EpacketRoute]) => {
        if (lang === 'zh') return r.time.zh;
        if (lang === 'en') return r.time.en;
        return r.time.vi;
    };
    const getCargoLabel = (c: CargoType) => {
        if (lang === 'zh') return CARGO_LABELS[c].zh;
        if (lang === 'en') return CARGO_LABELS[c].en;
        return CARGO_LABELS[c].vi;
    };

    return (
        <div>
            {/* ──── ROUTE TABS (Level 2) ──── */}
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">{t("ep.select_route")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-5">
                {(Object.entries(ROUTES) as [EpacketRoute, typeof ROUTES[EpacketRoute]][]).map(([rid, r]) => (
                    <button
                        key={rid}
                        onClick={() => handleRouteSwitch(rid)}
                        className={`flex flex-col gap-1 border-[1.5px] rounded-[10px] p-3 text-left transition-all ${route === rid
                            ? "border-primary bg-[#FFFBF0]"
                            : "border-[var(--pricing-border)] bg-white hover:border-primary/40"
                            }`}
                    >
                        <span className={`font-bold text-[13px] leading-snug ${route === rid ? "text-primary" : "text-navy"}`}>{getRouteName(r)}</span>
                        <span className="text-[12px] text-muted-foreground">{getRouteTime(r)}</span>
                        <div className="flex gap-1 flex-wrap mt-0.5">
                            {r.type === "merchant" && <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 notranslate" translate="no">🛒 Ship by Merchant</span>}
                            {r.type === "label" && (
                                <>
                                    <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 notranslate" translate="no">🏷️ Ship by Label</span>
                                    <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 notranslate" translate="no">✅ Import tax included</span>
                                </>
                            )}
                            {rid === "pri-vncn-us" && <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 notranslate" translate="no">{t("ep.import_tax_badge")}</span>}
                            {r.cargo.length > 0 && (
                                <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                                    <span className="notranslate" translate="no">{r.cargo.map(c => CARGO_ICONS[c]).join(" ")} {r.cargo.map(c => getCargoLabel(c)).join(" · ")}</span>
                                </span>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {/* ──── Ship by Label info panel ──── */}
            {route === "cn-us-label" ? (
                <div>
                    <div className="bg-white border border-[var(--pricing-border)] rounded-xl p-6 shadow-sm">
                        <h3 className="font-extrabold text-base text-navy mb-2 notranslate">🏷️ <span translate='no'>CN</span> – <span translate='no'>US</span> Ship by Label</h3>
                        <p className="text-muted-foreground text-[13px] mb-3">
                            {t("sbl.desc")}
                        </p>
                        <div className="bg-[#FEF9EC] border border-[#F59E0B] rounded-[10px] p-4 text-[12px] text-[#92400E] mb-4 flex gap-2">
                            <span>⚠️</span>
                            <div>
                                <strong>{t("sbl.note_title")}</strong> {t("sbl.note_desc")}
                            </div>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            {[
                                { label: t("sbl.condition"), value: t("sbl.condition_val") },
                                { label: t("sbl.lastmile"), value: t("sbl.lastmile_val") },
                                { label: t("sbl.suitable"), value: t("sbl.suitable_val") },
                            ].map(item => (
                                <div key={item.label} className="bg-[#F7F5F0] rounded-lg p-3 flex-1 min-w-[140px]">
                                    <div className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{item.label}</div>
                                    <div className="text-[13px] font-semibold text-navy">{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <ShipByLabelPanel larkData={larkOverlay["shipByLabelCnUs"]} />
                </div>
            ) : (
                <>
                    {/* ──── CARGO FILTER ──── */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 justify-between">
                        {routeConfig.cargo.length > 0 && (
                            <div className="flex items-center gap-1 sm:gap-3 w-full overflow-x-auto">
                                <span className="text-[11px] sm:text-[13px] font-semibold text-muted-foreground whitespace-nowrap shrink-0">{t("ep.cargo_label")}</span>
                                <div className="flex gap-1 sm:gap-2">
                                    {(["standard", "cosmetics", "battery"] as CargoType[]).map(c => {
                                        const enabled = routeConfig.cargo.includes(c);
                                        if (c === "battery" && !enabled) return null;
                                        return (
                                            <button
                                                key={c}
                                                onClick={() => handleCargoSwitch(c)}
                                                disabled={!enabled}
                                                className={`px-2 sm:px-4 py-0.5 sm:py-1.5 rounded-full text-[10px] sm:text-[13px] font-semibold border-[1.5px] transition-all whitespace-nowrap ${!enabled
                                                    ? "opacity-30 cursor-not-allowed border-[var(--pricing-border)] bg-white"
                                                    : cargo === c
                                                        ? "bg-primary border-primary text-white"
                                                        : "border-[var(--pricing-border)] bg-white hover:border-primary hover:text-primary"
                                                    }`}
                                            >
                                                <span className="notranslate" translate="no">{CARGO_ICONS[c]} {getCargoLabel(c)}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Battery notice for VN routes */}
                    {route.startsWith("std-vn") && (
                        <div className="bg-[#FFF7ED] border border-orange-200 rounded-[10px] p-3 text-[12px] text-orange-800 mb-4 flex gap-2">
                            <span>🔋</span>
                            <div>
                                <strong>{t("ep.battery_label")}</strong>{" "}
                                {t("ep.battery_note")}
                            </div>
                        </div>
                    )}

                    {/* ──── ANNOTATION ──── */}
                    <div key={`anno-${route}`} className="bg-[#FFFBEE] border-[1.5px] border-dashed border-[#D4A843] rounded-[10px] p-3 text-[12px] text-[#92670A] mb-4 flex gap-2">
                        <span>ℹ️</span>
                        <div>
                            <strong>{t("ep.showing")}</strong> {route === "pri-vncn-us"
                                ? <>Priority · {getRouteName(routeConfig)} — {t("ep.pri_desc")}</>
                                : <><span className="notranslate" translate="no">Epacket · {getRouteName(routeConfig)} {routeConfig.cargo.length > 0 ? `· ${getCargoLabel(cargo)}` : ""}</span> — {t("ep.epacket_desc")}</>
                            }
                        </div>
                    </div>

                    {/* ──── FEE INFO BANNER ──── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <div className="bg-white border border-[var(--pricing-border)] rounded-xl px-4 py-3 flex items-center gap-3 text-[13px]">
                            <span className="text-lg">💳</span>
                            <div>
                                <span className="font-bold text-navy notranslate" translate="no">
                                    {t("ep.order_fee")}:
                                </span>{" "}
                                <span className="text-primary font-extrabold notranslate" translate="no">0.7$</span>

                            </div>
                        </div>
                        {route === "pri-vncn-us" && (
                            <div className="bg-white border border-[var(--pricing-border)] rounded-xl px-4 py-3 flex items-center gap-3 text-[13px]">
                                <span className="text-lg">📡</span>
                                <div>
                                    <span className="font-bold text-navy notranslate" translate="no">
                                        {t("ep.tracking_fee")}:
                                    </span>{" "}
                                    <span className="text-primary font-extrabold notranslate" translate="no">0.5$</span>
                                    <p className="text-muted-foreground text-[11px] mt-0.5">
                                        {t("ep.tracking_note")}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ──── PRICE TABLE ──── */}
                    <div key={`table-${route}`}>
                        {route === "pri-vncn-us" ? (
                            <div className="flex flex-col gap-6">
                                <PriceTable
                                    title={t("ep.detail_table_vn_us")}
                                    badge={<span className="notranslate font-bold" translate='no'>VN-US (VND) · Priority Service (7-9 bsd)</span>}
                                    data={larkOverlay["uspsCn"]?.length ? larkOverlay["uspsCn"] : (pricingData as any)["uspsCn"] || []}
                                    columns={[{ key: "rate", label: "VN-US · Priority Service (VNĐ)" }]}
                                    currencySymbol="₫"
                                />
                                <PriceTable
                                    title={t("ep.detail_table_cn_us")}
                                    badge={<span className="notranslate font-bold" translate='no'>CN-US (USD) · Priority Service (5-10 bsd)</span>}
                                    data={larkOverlay["uspsCnUs"]?.length ? larkOverlay["uspsCnUs"] : (pricingData as any)["uspsCnUs"] || []}
                                    columns={[{ key: "rate", label: "CN-US · Priority Service ($)" }]}
                                />
                            </div>
                        ) : (
                            <PriceTable
                                title={t("ep.detail_table")}
                                badge={<div className="flex items-center gap-1">{getRouteName(routeConfig)} <span className="opacity-50">·</span> <span>{getCargoLabel(cargo)}</span></div>}
                                data={currentData}
                                columns={tableColumns.map(c => ({ ...c, label: c.label }))}
                                currencySymbol={route.startsWith("std-vn") ? "₫" : "$"}
                                sla={(currentData as any)?.meta || (() => {
                                    const keyMap: Record<string, string> = { "std-vn-ww_standard": "vnThuongMeta", "std-vn-ww_cosmetics": "vnMyphamMeta", "std-cn-ww_standard": "cnThuongMeta", "std-cn-ww_cosmetics": "cnMyphamMeta", "std-cn-ww_battery": "cnPinMeta" };
                                    return (pricingData as any)?.[keyMap[`${route}_${cargo}`]];
                                })()}
                            />
                        )}
                        {/* Fallback when no price data is available */}
                        {(!currentData || currentData.length === 0) && route !== "pri-vncn-us" && (
                            <div className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden shadow-sm">
                                <div className="bg-navy px-4 py-2.5">
                                    <span className="text-white font-bold text-[13px]">📋 {t("ep.price_table")}</span>
                                </div>
                                <div className="p-8 text-center">
                                    {larkLoading ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                                            <p className="text-[13px] text-muted-foreground">
                                                {t("ep.loading_lark")}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="text-3xl">📊</span>
                                            <p className="text-[13px] text-muted-foreground">
                                                {t("ep.data_unavailable")}
                                            </p>
                                            {larkError && (
                                                <p className="text-[11px] text-orange-500 mt-1">⚠️ {larkError}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {/* Fallback for Priority route when both tables are empty */}
                        {route === "pri-vncn-us" && !larkOverlay["uspsCn"]?.length && !larkOverlay["uspsCnUs"]?.length && !(pricingData as any)["uspsCn"]?.length && !(pricingData as any)["uspsCnUs"]?.length && (
                            <div className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden shadow-sm">
                                <div className="bg-navy px-4 py-2.5">
                                    <span className="text-white font-bold text-[13px]">📋 {t("ep.price_table_pri")}</span>
                                </div>
                                <div className="p-8 text-center">
                                    {larkLoading ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                                            <p className="text-[13px] text-muted-foreground">
                                                {t("ep.loading_lark")}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="text-3xl">📊</span>
                                            <p className="text-[13px] text-muted-foreground">
                                                {t("ep.data_unavailable")}
                                            </p>
                                            {larkError && (
                                                <p className="text-[11px] text-orange-500 mt-1">⚠️ {larkError}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ──── POST-TABLE ACCORDIONS ──── */}
                    <div className="flex flex-col gap-3 mt-6">
                        {/* 1. Surcharges */}
                        <Accordion icon="💰" title={t("ep.surcharges")} defaultOpen>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold text-[13px] text-navy mb-2">{t("ep.remote_title")}</h4>
                                    <p className="text-[12px] text-muted-foreground mb-3">
                                        {t("ep.remote_desc")}
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        {[
                                            { label: "🇺🇸 U.S. Remote Area Price Table", icon: "📊", url: "https://thgfulfill.sg.larksuite.com/sheets/GeOhsIMqrhJ3JztNKVDlfWi9gAe?sheet=Wsz3Aw" },
                                            { label: "🇯🇵 Japan (JP) Remote Zipcode", icon: "📮", url: "https://thgfulfill.sg.larksuite.com/sheets/GeOhsIMqrhJ3JztNKVDlfWi9gAe?sheet=rfsGfU" },
                                            { label: "🇭🇷 Croatia (HR) Remote Zipcode", icon: "📮", url: "https://thgfulfill.sg.larksuite.com/sheets/GeOhsIMqrhJ3JztNKVDlfWi9gAe?sheet=PQLJFL" },
                                            { label: "🇬🇧 Great Britain (GB) Remote Zipcode", icon: "📮", url: "https://thgfulfill.sg.larksuite.com/sheets/GeOhsIMqrhJ3JztNKVDlfWi9gAe?sheet=XzQ2aN" },
                                            { label: "🇸🇪 Sweden (SE) Remote Zipcode", icon: "📮", url: "https://thgfulfill.sg.larksuite.com/sheets/GeOhsIMqrhJ3JztNKVDlfWi9gAe?sheet=DqD99A" },
                                        ].map((file, i) => (
                                            <a
                                                key={i}
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-[var(--pricing-border)] hover:border-primary hover:bg-[#FFFBF0] transition-all group text-[13px]"
                                            >
                                                <span className="text-xl shrink-0">{file.icon}</span>
                                                <span className="flex-1 font-medium text-navy group-hover:text-primary transition-colors">{file.label}</span>
                                                <span className="text-[11px] text-muted-foreground bg-secondary px-2 py-1 rounded-full flex items-center gap-1">
                                                    {t("ep.download_file")}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[13px] text-navy mb-2">{t("ep.vat_title")}</h4>
                                    {vatData.length > 0 ? (
                                        <CompactAccordionTable
                                            headers={[t("ep.vat_country"), "VAT %", "Service Charge"]}
                                            data={vatData}
                                            renderRow={(v, i) => (
                                                <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                                                    <td className="px-4 py-3"><span className="notranslate">{v.country}</span></td>
                                                    <td className="px-4 py-3"><span className="notranslate" translate="no">{v.vat}</span></td>
                                                    <td className="px-4 py-3 font-bold"><span className="notranslate" translate="no">{v.service}</span></td>
                                                </tr>
                                            )}
                                        />
                                    ) : (
                                        <p className="text-muted-foreground text-[13px] italic">{t("ep.data_updating")}</p>
                                    )}
                                </div>
                            </div>
                        </Accordion>

                        {/* 2. Re-delivery */}
                        <Accordion icon="🔁" title={t("ep.reship_title")}>
                            {redeliveryData.length > 0 ? (
                                <div>
                                    <p className="text-[13px] text-muted-foreground italic mb-3">{t("ep.reship_note")}</p>
                                    <CompactAccordionTable
                                        headers={["Country", "Re-delivery charge", "Request re-delivery period"]}
                                        data={redeliveryData}
                                        renderRow={(r, i) => (
                                            <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                                                <td className="px-4 py-3"><span className="notranslate font-medium">{r.dest || r.country}</span></td>
                                                <td className="px-4 py-3 text-[12px]"><span className="notranslate">{r.charge || r.usd}</span></td>
                                                <td className="px-4 py-3 text-[12px] font-bold"><span className="notranslate">{r.period || "—"}</span></td>
                                            </tr>
                                        )}
                                    />
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-[13px] italic text-center py-4">{t("ep.reship_data_updating")}</p>
                            )}
                        </Accordion>

                        {/* 3. Shipping Policy — link to dedicated page */}
                        <Link
                            to="/chinh-sach-van-chuyen"
                            className="flex items-center gap-3 px-5 py-4 bg-white rounded-xl border-[1.5px] border-[var(--pricing-border)] hover:border-primary hover:bg-[#FFFBF0] transition-all group"
                        >
                            <span className="text-xl">🛡️</span>
                            <span className="flex-1 font-bold text-[14px] text-navy group-hover:text-primary transition-colors">
                                {t("ep.view_policy")}
                            </span>
                            <span className="text-[12px] text-muted-foreground bg-secondary px-3 py-1 rounded-full">→</span>
                        </Link>

                        {/* 4. Terms & FAQ */}
                        <Accordion icon="📄" title="FAQ">
                            <ShippingTermsQnAPanel />
                        </Accordion>
                    </div>
                </>
            )}
        </div>
    );
};

export default EpacketPanel;
