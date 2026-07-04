import React, { useMemo, useState } from "react";
import { BatteryCharging, Info } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Link } from "react-router-dom";
import { EpacketRoute, CargoType, ROUTES, CARGO_LABELS, CARGO_ICONS, OriginCountry, type PricingRow } from "@/components/pricing/types";
import Accordion from "@/components/pricing/Accordion";
import PriceTable from "@/components/pricing/PriceTable";
import CompactAccordionTable from "@/components/pricing/CompactAccordionTable";
import ShipByLabelPanel from "@/components/pricing/ShipByLabelPanel";
import ShippingTermsQnAPanel from "@/components/pricing/ShippingTermsQnAPanel";
import { useCmsSiteSettings } from "@/hooks/useCmsContent";

interface EpacketPanelProps {
    route: EpacketRoute;
    cargo: CargoType;
    handleRouteSwitch: (r: EpacketRoute) => void;
    handleCargoSwitch: (c: CargoType) => void;
    routeConfig: typeof ROUTES[EpacketRoute];
    currentData: PricingRow[];
    tableColumns: { key: string; label: string }[];
    // Lark overlay is the CMS-edited blob — keys hold heterogeneous shapes
    // (PricingRow[], { regular, special }, etc.) so consumers cast per use.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    larkOverlay: Record<string, any>;
    vatData: PricingRow[];
    remoteSurcharge: PricingRow[];
    redeliveryData: PricingRow[];
    larkLoading?: boolean;
    larkError?: string | null;
    origin: OriginCountry;
    setOrigin: (o: OriginCountry) => void;
}

const EpacketPanel = ({
    route, cargo,
    handleRouteSwitch, handleCargoSwitch,
    routeConfig, currentData, tableColumns,
    larkOverlay, vatData, remoteSurcharge: _remoteSurcharge, redeliveryData,
    larkLoading, larkError,
    origin, setOrigin: _setOrigin,
}: EpacketPanelProps) => {
    const { t, effectiveLanguage: lang } = useI18n();
    const { data: settings } = useCmsSiteSettings();
    const remoteAreaLinks = settings?.remote_area_links ?? [];
    const [reshipSearch, setReshipSearch] = useState("");

    const RESHIP_FLAGS: Record<string, string> = {
        "Canada": "🇨🇦", "Mexico": "🇲🇽", "Switzerland": "🇨🇭", "France": "🇫🇷", "Norway": "🇳🇴",
        "Australia": "🇦🇺", "Saudi Arabia": "🇸🇦", "United Arab Emirates": "🇦🇪", "Japan": "🇯🇵",
        "Hong Kong": "🇭🇰", "United Kingdom": "🇬🇧", "Singapore": "🇸🇬", "Brazil": "🇧🇷",
        "Malta": "🇲🇹", "Cyprus": "🇨🇾", "Slovenia": "🇸🇮", "Romania": "🇷🇴", "Croatia": "🇭🇷",
        "Bulgaria": "🇧🇬", "Chile": "🇨🇱", "Other countries": "🌐"
    };
    const filteredReship = useMemo(() =>
        redeliveryData.filter((d: any) => (d.country || "").toLowerCase().includes(reshipSearch.toLowerCase())),
        [redeliveryData, reshipSearch]
    );

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

    // Filter routes by selected origin
    const visibleRoutes = useMemo(() =>
        (Object.entries(ROUTES) as [EpacketRoute, typeof ROUTES[EpacketRoute]][])
            .filter(([_, r]) => r.origin.includes(origin)),
        [origin]
    );

    return (
        <div>
            {/* ──── STEP 3: ROUTE ──── */}
            <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                <div className="flex-1 h-[1px] bg-[var(--pricing-border)]"></div>
                <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground whitespace-nowrap">
                    {lang === 'zh' ? `第 3 步 — 选择路线 (${origin === 'vn' ? '🇻🇳 VN' : '🇨🇳 CN'})` : lang === 'en' ? `Step 3 — Choose Route (${origin === 'vn' ? '🇻🇳 VN' : '🇨🇳 CN'})` : `Bước 3 — Chọn Tuyến (${origin === 'vn' ? '🇻🇳 VN' : '🇨🇳 CN'})`}
                </p>
                <div className="flex-1 h-[1px] bg-[var(--pricing-border)]"></div>
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${visibleRoutes.length >= 3 ? "lg:grid-cols-3" : ""} gap-2 mb-5`}>
                {visibleRoutes.map(([rid, r]) => (
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
                            {(rid === "pri-vn-us" || rid === "pri-cn-us") && <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 notranslate" translate="no">{t("ep.import_tax_badge")}</span>}
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
                    {/* ──── STEP 4: CARGO ──── */}
                    {routeConfig.cargo.length > 0 && (
                        <>
                            <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                                <div className="flex-1 h-[1px] bg-[var(--pricing-border)]"></div>
                                <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground whitespace-nowrap">
                                    {t("pricing.step4_cargo")}
                                </p>
                                <div className="flex-1 h-[1px] bg-[var(--pricing-border)]"></div>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 justify-between">
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
                            </div>
                        </>
                    )}

                    {/* Battery notice for VN routes */}
                    {route.startsWith("std-vn") && (
                        <div className="bg-[#FFF7ED] border border-orange-200 rounded-[10px] p-3 text-[12px] text-orange-800 mb-4 flex gap-2">
                            <BatteryCharging className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                            <div>
                                <strong>{t("ep.battery_label")}</strong>{" "}
                                {t("ep.battery_note")}
                            </div>
                        </div>
                    )}

                    {/* ──── ANNOTATION ──── */}
                    <div key={`anno-${route}`} className="bg-[#FFFBEE] border-[1.5px] border-dashed border-[#D4A843] rounded-[10px] p-3 text-[12px] text-[#92670A] mb-4 flex gap-2">
                        <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                            <strong>{t("ep.showing")}</strong> {(route === "pri-vn-us" || route === "pri-cn-us")
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
                        {(route === "pri-vn-us" || route === "pri-cn-us") && (
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
                        {route === "pri-vn-us" ? (
                            <PriceTable
                                title={t("ep.detail_table_vn_us")}
                                badge={<span className="notranslate font-bold" translate='no'>VN-US (VND) · Priority Service (7-9 bsd)</span>}
                                data={larkOverlay["uspsCn"] ?? []}
                                columns={[{ key: "rate", label: "VN-US · Priority Service (VNĐ)" }]}
                                currencySymbol="₫"
                            />
                        ) : route === "pri-cn-us" ? (
                            <PriceTable
                                title={t("ep.detail_table_cn_us")}
                                badge={<span className="notranslate font-bold" translate='no'>CN-US (USD) · Priority Service (5-10 bsd)</span>}
                                data={larkOverlay["uspsCnUs"] ?? []}
                                columns={[{ key: "rate", label: "CN-US · Priority Service ($)" }]}
                            />
                        ) : (
                            <PriceTable
                                title={t("ep.detail_table")}
                                badge={<div className="flex items-center gap-1">{getRouteName(routeConfig)} <span className="opacity-50">·</span> <span>{getCargoLabel(cargo)}</span></div>}
                                data={currentData}
                                columns={tableColumns.map(c => ({ ...c, label: c.label }))}
                                currencySymbol={route.startsWith("std-vn") ? "₫" : "$"}
                                sla={(currentData as any)?.meta || (() => {
                                    const keyMap: Record<string, string> = { "std-vn-ww_standard": "vnThuongMeta", "std-vn-ww_cosmetics": "vnMyphamMeta", "std-cn-ww_standard": "cnThuongMeta", "std-cn-ww_cosmetics": "cnMyphamMeta", "std-cn-ww_battery": "cnPinMeta" };
                                    return larkOverlay[keyMap[`${route}_${cargo}`]];
                                })()}
                            />
                        )}
                        {/* Fallback when no price data is available */}
                        {(!currentData || currentData.length === 0) && route !== "pri-vn-us" && route !== "pri-cn-us" && (
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
                        {/* Empty state for Priority route */}
                        {route === "pri-vn-us" && !larkOverlay["uspsCn"]?.length && (
                            <div className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden shadow-sm">
                                <div className="bg-navy px-4 py-2.5">
                                    <span className="text-white font-bold text-[13px]">📋 {t("ep.price_table_pri")}</span>
                                </div>
                                <div className="p-8 text-center">
                                    {larkLoading ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                                            <p className="text-[13px] text-muted-foreground">{t("ep.loading_lark")}</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="text-3xl">📊</span>
                                            <p className="text-[13px] text-muted-foreground">{t("ep.data_unavailable")}</p>
                                            {larkError && <p className="text-[11px] text-orange-500 mt-1">⚠️ {larkError}</p>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {route === "pri-cn-us" && !larkOverlay["uspsCnUs"]?.length && (
                            <div className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden shadow-sm">
                                <div className="bg-navy px-4 py-2.5">
                                    <span className="text-white font-bold text-[13px]">📋 {t("ep.price_table_pri")}</span>
                                </div>
                                <div className="p-8 text-center">
                                    {larkLoading ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                                            <p className="text-[13px] text-muted-foreground">{t("ep.loading_lark")}</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="text-3xl">📊</span>
                                            <p className="text-[13px] text-muted-foreground">{t("ep.data_unavailable")}</p>
                                            {larkError && <p className="text-[11px] text-orange-500 mt-1">⚠️ {larkError}</p>}
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
                                {remoteAreaLinks.length > 0 && (
                                    <div>
                                        <h4 className="font-bold text-[13px] text-navy mb-2">{t("ep.remote_title")}</h4>
                                        <p className="text-[12px] text-muted-foreground mb-3">
                                            {t("ep.remote_desc")}
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            {remoteAreaLinks.map((file, i) => (
                                                <a
                                                    key={i}
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-[var(--pricing-border)] hover:border-primary hover:bg-[#FFFBF0] transition-all group text-[13px]"
                                                >
                                                    {file.icon && <span className="text-xl shrink-0">{file.icon}</span>}
                                                    <span className="flex-1 font-medium text-navy group-hover:text-primary transition-colors">{file.label}</span>
                                                    <span className="text-[11px] text-muted-foreground bg-secondary px-2 py-1 rounded-full flex items-center gap-1">
                                                        {t("ep.download_file")}
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                                    {/* Header: product tags */}
                                    <div className="bg-white border border-[#d0dce8] rounded-xl p-5 mb-4 shadow-sm">
                                        <p className="text-[12px] text-[#5a7a9a] mb-2">Applicable products:</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            <span className="bg-[#e3f0ff] border border-[#b3d0f5] text-[#1565c0] text-[11px] px-2.5 py-0.5 rounded-full font-medium">Epacket – Standard VN-WW</span>
                                            <span className="bg-[#e3f0ff] border border-[#b3d0f5] text-[#1565c0] text-[11px] px-2.5 py-0.5 rounded-full font-medium">Epacket – Standard VN-WW Cosmetic</span>
                                            <span className="bg-[#e3f0ff] border border-[#b3d0f5] text-[#1565c0] text-[11px] px-2.5 py-0.5 rounded-full font-medium">Epacket – Priority USPS VN-US</span>
                                        </div>
                                    </div>

                                    {/* Search bar */}
                                    <div className="flex items-center gap-2.5 mb-3.5">
                                        <input
                                            type="text"
                                            placeholder="🔍  Search country..."
                                            value={reshipSearch}
                                            onChange={e => setReshipSearch(e.target.value)}
                                            className="flex-1 bg-white border border-[#c8d8e8] text-[#1a2a3a] px-3.5 py-2 rounded-lg text-[13px] outline-none shadow-sm transition-colors focus:border-[#1565c0] placeholder:text-[#90a8be]"
                                        />
                                        <span className="bg-[#e3f0ff] text-[#1565c0] text-[12px] px-3 py-1 rounded-full font-semibold whitespace-nowrap border border-[#b3d0f5]">
                                            {filteredReship.length} countries
                                        </span>
                                    </div>

                                    {/* Note */}
                                    <p className="text-[13px] text-muted-foreground italic mb-3">{t("ep.reship_note")}</p>

                                    {/* Table */}
                                    <div className="bg-white border border-[#d0dce8] rounded-xl overflow-hidden shadow-sm">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-[#e8f0fa]">
                                                    <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#1565c0] border-b-2 border-[#c0d4ec] w-[44px]"></th>
                                                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#1565c0] border-b-2 border-[#c0d4ec] whitespace-nowrap">Country</th>
                                                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#1565c0] border-b-2 border-[#c0d4ec] whitespace-nowrap">Re-delivery Charge</th>
                                                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#1565c0] border-b-2 border-[#c0d4ec] whitespace-nowrap">Additional Rate</th>
                                                    <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-[#1565c0] border-b-2 border-[#c0d4ec] whitespace-nowrap">Request Period</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredReship.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="text-center py-10 text-[#90a8be] text-[14px]">No countries found.</td>
                                                    </tr>
                                                ) : filteredReship.map((d: any, i: number) => (
                                                    <tr key={i} className="border-b border-[#e8eef5] last:border-0 hover:bg-[#f4f8ff] transition-colors">
                                                        <td className="px-4 py-[11px] text-[20px] text-center w-[44px]">{RESHIP_FLAGS[d.country] || "🌐"}</td>
                                                        <td className="px-4 py-[11px] text-[13px] font-semibold text-[#1a2a3a] whitespace-nowrap">{d.country}</td>
                                                        <td className="px-4 py-[11px] text-[13px] leading-relaxed">
                                                            {d.charge === "no-service" ? (
                                                                <span className="text-[#c0392b] text-[12px] italic">❌ Re-delivery service not provided</span>
                                                            ) : d.charge === "special" ? (
                                                                <span className="text-[#5a7a9a] text-[12px] italic">New YT tracking number issued; fee charged at VN-HK freight rate</span>
                                                            ) : (
                                                                <span className="text-[#1565c0] font-medium">{d.charge}</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-[11px] text-[12px] text-[#5a7a9a]">
                                                            {d.charge !== "no-service" && d.charge !== "special" ? d.extra : ""}
                                                        </td>
                                                        <td className="px-4 py-[11px] text-center whitespace-nowrap">
                                                            {d.period == null ? (
                                                                <span className="text-[12px] text-[#5a7a9a]">—</span>
                                                            ) : (
                                                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${d.period === 14 ? "bg-[#e6f9ed] text-[#1e7e34] border border-[#a8ddb8]" :
                                                                    d.period === 15 ? "bg-[#fff8e0] text-[#b07d00] border border-[#f0d070]" :
                                                                        "bg-[#fff0e8] text-[#c04a00] border border-[#f0b090]"
                                                                    }`}>
                                                                    {d.period} days
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-[13px] italic text-center py-4">{t("ep.reship_data_updating")}</p>
                            )}
                        </Accordion>

                        {/* 3. Shipping Policy — link to dedicated page */}
                        <Link
                            to={`/${lang}/shipping-policy`}
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
