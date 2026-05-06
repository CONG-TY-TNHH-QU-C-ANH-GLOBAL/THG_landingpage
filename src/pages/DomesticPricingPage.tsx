import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";

import ScrollReveal from "@/components/ScrollReveal";
import { domesticPricingRows as fallbackRows } from "@/data/domesticPricingData";
import { DomesticPricingRow } from "@/data/domesticPricingData";
import { Link } from "react-router-dom";
import {
    MapPin, Package, Truck, Globe, Shield,
    ChevronDown, ChevronUp, ArrowRight, ArrowLeft, Warehouse, CheckCircle2,
    FileSpreadsheet, FileText, ChevronLeft, ChevronRight, Mail, Layers, Box
} from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";
import { useLarkPricingContext, SyncBadge, transformSheetToDomesticData } from "@/components/pricing/LarkPricingProvider";
import { useI18n } from "@/lib/i18n";
import packagingImg from "@/assets/Warehouse_bao bì.png";

const ZONES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const INITIAL_ROWS = 6;

const OZ_VALUES = [
    "4 oz", "8 oz", "12 oz", "16 oz", "32 oz", "48 oz", "64 oz", "80 oz", "96 oz",
    "112 oz", "128 oz", "144 oz", "160 oz", "176 oz", "192 oz", "208 oz", "224 oz", "240 oz", "256 oz",
    "272 oz", "288 oz", "304 oz", "320 oz", "336 oz", "352 oz", "368 oz", "384 oz", "400 oz", "416 oz",
    "432 oz", "448 oz", "464 oz", "480 oz", "496 oz", "512 oz", "528 oz", "544 oz", "560 oz", "576 oz",
    "592 oz", "608 oz", "624 oz", "640 oz", "656 oz", "672 oz", "688 oz", "704 oz", "720 oz", "736 oz",
    "752 oz", "768 oz", "784 oz", "800 oz", "816 oz", "832 oz", "848 oz", "864 oz", "880 oz", "896 oz",
    "912 oz", "928 oz", "944 oz", "960 oz", "976 oz", "992 oz", "1008 oz", "1024 oz", "1040 oz", "1056 oz",
    "1072 oz", "1088 oz", "1104 oz", "1120 oz",
];

const DomesticPricingContent = () => {
    const { t } = useI18n();
    const lark = useLarkPricingContext();
    const [showAll, setShowAll] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Always re-fetch fresh data when navigating to this page
    useEffect(() => {
        lark.refetch();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const checkScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 2);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        checkScroll();
        el.addEventListener("scroll", checkScroll, { passive: true });
        const ro = new ResizeObserver(checkScroll);
        ro.observe(el);
        return () => { el.removeEventListener("scroll", checkScroll); ro.disconnect(); };
    }, [checkScroll]);

    const scrollBy = (dir: number) => {
        scrollRef.current?.scrollBy({ left: dir * 150, behavior: "smooth" });
    };

    const domesticPricingRows = useMemo(() => {
        if (!lark.sheets) return fallbackRows;
        for (const [, sheet] of Object.entries(lark.sheets)) {
            const title = sheet.title?.trim().toLowerCase();
            if (title === "domesticpricing" || title === "noidia" || title === "nội địa" || title === "domestic" || title === "us domestic pricing") {
                const transformed = transformSheetToDomesticData(sheet.data);
                if (transformed.length > 0) {
                    return transformed.map(r => ({
                        STT: r.STT || r.No || "",
                        weight: r["Weight Not Over (in ounces)"] || r["Weight Not Over (ounces)"] || "",
                        gram: r.Gram || r.gram || "",
                        zones: {
                            1: r["Zone 1"] || "",
                            2: r["Zone 2"] || "",
                            3: r["Zone 3"] || "",
                            4: r["Zone 4"] || "",
                            5: r["Zone 5"] || "",
                            6: r["Zone 6"] || "",
                            7: r["Zone 7"] || "",
                            8: r["Zone 8"] || "",
                            9: r["Zone 9"] || "",
                        },
                    })) as DomesticPricingRow[];
                }
            }
        }
        return fallbackRows;
    }, [lark.sheets]);

    const displayRows = showAll ? domesticPricingRows : domesticPricingRows.slice(0, INITIAL_ROWS);
    const hasMore = domesticPricingRows.length > INITIAL_ROWS;

    const exportConfig = useMemo(() => {
        const headers = ["Weight Not Over (in ounces)", "Gram", ...ZONES.map(z => `Zone ${z}`)];
        const rows = domesticPricingRows.map((row, i) => [
            row.weight ? (String(row.weight).includes('oz') ? row.weight : `${row.weight} oz`) : (OZ_VALUES[i] || ""),
            row.gram,
            ...ZONES.map(z => row.zones[z])
        ]);
        return { filename: 'THG_Domestic_Pricing_All_Zones', headers, rows };
    }, [domesticPricingRows]);

    const fulfillmentRows = useMemo(() => [
        { stt: 1, label: t("fulfill.s1"), price: t("fulfill.s1_price") },
        {
            stt: 2, label: t("fulfill.s2"), subRows: [
                { desc: t("fulfill.s2_r1"), price: t("fulfill.s2_r1_price") },
                { desc: t("fulfill.s2_r2"), price: "2.5$ /carton" },
                { desc: t("fulfill.s2_r3"), price: "6.25$ /carton" },
                { desc: t("fulfill.s2_r4"), price: "38$ /CBM" },
                { desc: t("fulfill.s2_r5"), price: "30$ /hour\n30$ / 1500pcs", note: t("fulfill.s2_r5_note") },
                { desc: t("fulfill.s2_r6"), price: "", note: t("fulfill.s2_r6_note") },
            ],
        },
        { stt: 3, label: t("fulfill.s3"), price: t("fulfill.s3_price") },
        {
            stt: 4, label: t("fulfill.s4"), subRows: [
                { desc: "- Items ≤ 2 lbs", price: "1.2$ /pc" },
                { desc: "- Item > 2 lbs; ≤ 4 lbs", price: "1.7$ /pc" },
                { desc: "- Item > 4 lbs; ≤ 6 lbs", price: "2.2$ /pc" },
                { desc: "- Item > 6 lbs; ≤ 8 lbs", price: "2.7$ /pc" },
                { desc: "- Item > 8 lbs; ≤ 10 lbs", price: "3.2$ /pc" },
                { desc: "- Item > 10 lbs", price: "", note: t("fulfill.s4_r6_note") },
            ],
            note: t("fulfill.s4_note"),
        },
        { stt: 5, label: t("fulfill.s5"), price: "$0.5 - $1", note: t("fulfill.s5_note") },
        { stt: 6, label: t("fulfill.s6"), price: t("fulfill.s6_price"), note: t("fulfill.s6_note") },
        { stt: 7, label: t("fulfill.s7"), price: t("fulfill.s7_price") },
        { stt: 8, label: t("fulfill.s8"), price: "2.5$ /carton", note: t("fulfill.s8_note") },
    ], [t]);

    return (
        <main className="pt-20 pb-16 bg-background">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Back + Nav */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-medium text-[12px] transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> {t("domestic.back_home")}
                    </Link>
                    <div className="flex gap-2">
                        <Link
                            to="/domestic-pricing"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold text-[12px] shadow-sm"
                        >
                            <MapPin className="w-3.5 h-3.5" /> {t("domestic.tab_domestic")}
                        </Link>
                        <Link
                            to="/international-pricing"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-secondary text-foreground font-semibold text-[12px] hover:bg-secondary/80 transition-colors"
                        >
                            <Globe className="w-3.5 h-3.5" /> {t("domestic.tab_intl")}
                        </Link>
                    </div>
                </div>

                {/* Hero */}
                <ScrollReveal>
                    <div className="text-center mb-8">
                        <h1 className="text-2xl md:text-4xl font-bold text-navy mb-2 tracking-tight">
                            {t("domestic.hero_title")} <span className="text-primary">{t("domestic.hero_highlight")}</span>
                        </h1>
                        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                            {t("domestic.hero_desc")} <span className="notranslate font-semibold">THG Warehouse</span>
                        </p>
                        <div className="mt-2"><SyncBadge /></div>
                    </div>
                </ScrollReveal>

                {/* Full Zones Pricing Table */}
                <ScrollReveal>
                    <div className="bg-card border border-border/40 rounded-xl shadow-sm overflow-hidden mb-6">
                        <div className="px-4 py-3 border-b border-border/40 bg-secondary/30 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                                    <Package className="w-4 h-4 text-primary-foreground" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-foreground text-sm truncate">{t("domestic.table_title")}</h3>
                                    <p className="text-[10px] md:text-[11px] text-muted-foreground truncate">{t("domestic.table_desc")}</p>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <button onClick={() => exportToExcel(exportConfig)} className="p-1.5 bg-secondary hover:bg-primary/20 rounded text-primary transition-colors" title="Export Excel">
                                    <FileSpreadsheet size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="bg-amber-50/50 dark:bg-amber-900/10 px-4 py-2 border-b border-border/30">
                            <p className="text-[11px] md:text-xs text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1.5 italic">
                                <span>*</span> {t("domestic.fuel_surcharge")}
                            </p>
                        </div>

                        {(canScrollLeft || canScrollRight) && (
                            <div className="flex items-center justify-between px-3 py-1.5 bg-amber-50 border-b border-border/30 md:hidden">
                                <span className="text-[10px] text-amber-700 font-medium">{t("domestic.swipe_hint")}</span>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => scrollBy(-1)} disabled={!canScrollLeft} className="p-1 rounded bg-white border border-amber-200 disabled:opacity-30"><ChevronLeft size={12} className="text-amber-700" /></button>
                                    <button onClick={() => scrollBy(1)} disabled={!canScrollRight} className="p-1 rounded bg-white border border-amber-200 disabled:opacity-30"><ChevronRight size={12} className="text-amber-700" /></button>
                                </div>
                            </div>
                        )}

                        <div className="relative">
                            <div ref={scrollRef} className="overflow-x-auto scroll-smooth">
                                <table id="table-domestic" className="w-full text-[11px] md:text-[13px] border-collapse">
                                    <thead>
                                        <tr className="bg-navy text-white">
                                            <th className="px-2 md:px-3 py-2 text-center font-semibold text-[10px] md:text-[11px] uppercase tracking-wider sticky left-0 bg-navy z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.15)] min-w-[50px] border-r border-white/20">{t("domestic.th_stt")}</th>
                                            <th className="px-2 md:px-3 py-2 text-center font-semibold text-[10px] md:text-[11px] uppercase tracking-wider whitespace-nowrap min-w-[80px] border-r border-white/20">Weight Not Over<br />(in ounces)</th>
                                            <th className="px-2 md:px-3 py-2 text-center font-semibold text-[10px] md:text-[11px] uppercase tracking-wider whitespace-nowrap min-w-[70px] border-r border-white/20">Gram</th>
                                            {ZONES.map((z) => (
                                                <th key={z} className="px-2 md:px-3 py-2 text-center font-semibold text-[10px] md:text-[11px] uppercase tracking-wider whitespace-nowrap min-w-[70px] border-r border-white/20 last:border-r-0">Zone {z}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayRows.map((row, idx) => (
                                            <tr
                                                key={idx}
                                                className={`border-b border-border/20 transition-colors hover:bg-primary/5 ${idx % 2 === 0 ? "bg-background" : "bg-secondary/20"}`}
                                            >
                                                <td className="px-2 md:px-3 py-1.5 md:py-2 text-center font-semibold text-navy whitespace-nowrap sticky left-0 z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)] border-r border-border/30" style={{ backgroundColor: 'inherit' }}>
                                                    <span className="text-[11px] md:text-[13px]">{idx + 1}</span>
                                                </td>
                                                <td className="px-2 md:px-3 py-1.5 md:py-2 text-center font-semibold whitespace-nowrap border-r border-border/30">
                                                    <span className="text-[11px] md:text-[13px]">{row.weight ? (String(row.weight).includes('oz') ? row.weight : `${row.weight} oz`) : (OZ_VALUES[idx] || "")}</span>
                                                </td>
                                                <td className="px-2 md:px-3 py-1.5 md:py-2 text-center font-semibold whitespace-nowrap border-r border-border/30">
                                                    <span className="text-[11px] md:text-[13px]">{row.gram}</span>
                                                </td>
                                                {ZONES.map((z) => {
                                                    const val = row.zones[z];
                                                    const displayVal = (val && val !== "-" && !String(val).includes("$")) ? `$${val}` : val;
                                                    return (
                                                        <td key={z} className="px-2 md:px-3 py-1.5 md:py-2 text-center font-bold text-primary whitespace-nowrap border-r border-border/20 last:border-r-0">
                                                            <span className="notranslate" translate="no">{displayVal}</span>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {canScrollRight && (
                                <div className="absolute top-0 right-0 bottom-0 w-6 pointer-events-none bg-gradient-to-l from-white to-transparent z-20 md:hidden" />
                            )}
                        </div>

                        {hasMore && (
                            <div className="flex justify-center py-3 border-t border-border/20">
                                <button
                                    onClick={() => setShowAll((prev) => !prev)}
                                    className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-[12px] font-semibold text-navy transition-all"
                                >
                                    {showAll ? (
                                        <>{t("domestic.collapse")} <ChevronUp className="w-3.5 h-3.5" /></>
                                    ) : (
                                        <>{t("domestic.see_more").replace("{count}", String(domesticPricingRows.length - INITIAL_ROWS))} <ChevronDown className="w-3.5 h-3.5" /></>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </ScrollReveal>

                {/* YouTube */}
                <ScrollReveal>
                    <div className="bg-card border border-border/40 rounded-xl p-4 md:p-5 shadow-sm mb-6 overflow-hidden">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground text-sm">{t("domestic.video_title")}</h3>
                                <p className="text-[10px] text-muted-foreground">{t("domestic.video_desc")}</p>
                            </div>
                        </div>
                        <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                            <iframe
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                src="https://www.youtube.com/embed/k-oETHQF7tE?start=19"
                                title="THG Fulfillment Pricing Guide"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </ScrollReveal>

                {/* Fulfillment Services */}
                <ScrollReveal>
                    <div className="bg-card border border-border/40 rounded-xl shadow-sm overflow-hidden mb-6">
                        <div className="px-4 py-3 border-b border-border/40 bg-secondary/30 flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                                <Warehouse className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <div>
                                <h2 className="font-bold text-foreground text-sm">{t("domestic.fulfill_title")}</h2>
                                <p className="text-[10px] md:text-[11px] text-muted-foreground">{t("domestic.fulfill_desc")}</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-[12px] md:text-[13px] border-collapse">
                                <thead>
                                    <tr className="bg-navy text-white">
                                        <th className="px-3 py-2.5 text-center font-semibold text-[10px] md:text-[11px] uppercase tracking-wider w-[50px] border-r border-white/20">{t("domestic.th_stt")}</th>
                                        <th className="px-3 py-2.5 text-left font-semibold text-[10px] md:text-[11px] uppercase tracking-wider border-r border-white/20">{t("domestic.th_service")}</th>
                                        <th className="px-3 py-2.5 text-left font-semibold text-[10px] md:text-[11px] uppercase tracking-wider border-r border-white/20 min-w-[140px]">{t("domestic.th_fee")}</th>
                                        <th className="px-3 py-2.5 text-left font-semibold text-[10px] md:text-[11px] uppercase tracking-wider min-w-[160px]">{t("domestic.th_note")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fulfillmentRows.map((row) => {
                                        if (row.subRows && row.subRows.length > 0) {
                                            return (
                                                <React.Fragment key={row.stt}>
                                                    <tr className="border-b border-border/20 bg-secondary/10">
                                                        <td rowSpan={row.subRows.length + 1 + (row.note ? 1 : 0)} className="px-3 py-2 text-center font-bold text-navy border-r border-border/30 align-middle">{row.stt}</td>
                                                        <td colSpan={3} className="px-3 py-2 font-bold text-foreground">{row.label}</td>
                                                    </tr>
                                                    {row.subRows.map((sub, si) => (
                                                        <tr key={si} className={`border-b border-border/20 ${si % 2 === 0 ? 'bg-background' : 'bg-secondary/10'}`}>
                                                            <td className="px-3 py-2 text-muted-foreground border-r border-border/30">{sub.desc}</td>
                                                            <td className="px-3 py-2 font-bold text-primary border-r border-border/30 whitespace-pre-line">{sub.price || ''}</td>
                                                            <td className="px-3 py-2 text-muted-foreground text-[11px]">{sub.note || ''}</td>
                                                        </tr>
                                                    ))}
                                                    {row.note && (
                                                        <tr className="border-b border-border/20 bg-amber-50/50 dark:bg-amber-900/10">
                                                            <td colSpan={3} className="px-3 py-2 text-amber-700 dark:text-amber-400 text-[11px] italic">⚠ {row.note}</td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            );
                                        }
                                        return (
                                            <tr key={row.stt} className={`border-b border-border/20 ${row.stt % 2 === 0 ? 'bg-secondary/10' : 'bg-background'}`}>
                                                <td className="px-3 py-2.5 text-center font-bold text-navy border-r border-border/30">{row.stt}</td>
                                                <td className="px-3 py-2.5 font-bold text-foreground border-r border-border/30">{row.label}</td>
                                                <td className="px-3 py-2.5 font-bold text-primary border-r border-border/30 whitespace-pre-line">{row.price}</td>
                                                <td className="px-3 py-2.5 text-muted-foreground text-[11px]">{row.note || ''}</td>
                                            </tr>
                                        );
                                    })}
                                    <tr className="bg-amber-50/80 dark:bg-amber-900/20">
                                        <td colSpan={4} className="px-4 py-3 text-amber-800 dark:text-amber-400 text-[11px] md:text-[12px] font-bold italic text-center border-t border-amber-200/50 shadow-inner">
                                            ✨ Miễn phí lưu kho 90 ngày cho khách hàng sử dụng kho lần đầu tiên / 1 CBM
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Packaging Fees section */}
                <ScrollReveal>
                    <div className="mb-10">
                        <img
                            src={packagingImg}
                            alt={t("warehouse_page.pkg_title")}
                            className="w-full max-w-3xl mx-auto rounded-xl shadow-sm"
                            loading="lazy"
                        />
                    </div>
                </ScrollReveal>

                {/* CTA */}
                <ScrollReveal>
                    <div className="bg-gradient-to-br from-navy via-navy/95 to-primary/80 text-white rounded-xl p-6 md:p-10 text-center">
                        <h3 className="text-xl md:text-2xl font-bold mb-2">{t("domestic.cta_title")}</h3>
                        <p className="text-white/70 mb-5 text-sm max-w-lg mx-auto">{t("domestic.cta_desc")}</p>
                        <a
                            href="/#contact"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-[13px] hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                        >
                            {t("domestic.cta_btn")} <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </ScrollReveal>
            </div>
        </main>
    );
};

const DomesticPricingPage = () => (
    <div className="min-h-screen bg-background">
        <Navbar />
        <DomesticPricingContent />

    </div>
);

export default DomesticPricingPage;
