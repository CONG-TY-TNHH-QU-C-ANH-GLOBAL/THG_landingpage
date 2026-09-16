import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { useScrollAffordance } from "@/hooks/useScrollAffordance";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";

import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import {
    MapPin, Package, Globe, Calculator, PlayCircle,
    ChevronDown, ChevronUp, ArrowRight, ArrowLeft, Warehouse,
    FileSpreadsheet, ChevronLeft, ChevronRight,
} from "lucide-react";
// xlsx + jspdf weigh ~290KB combined; lazy-load only when user actually exports.
async function lazyExportToExcel(config: import("@/lib/exportUtils").ExportConfig) {
    const { exportToExcel } = await import("@/lib/exportUtils");
    exportToExcel(config);
}
import { useI18n } from "@/lib/i18n";
import { LeadFormDialog } from "@/components/lead/LeadFormDialog";
import { Button } from "@/components/ui/button";
import { ThreePlEstimator } from "@/components/pricing/ThreePlEstimator";
import { RateTrustBar } from "@/components/pricing/RateTrustBar";
import { FulfillmentRateCatalog, type RateCategory } from "@/components/pricing/FulfillmentRateCatalog";
import {
    BubbleMailerArt,
    CartonBoxArt,
    OwnPackagingArt,
    PolyMailerArt,
} from "@/components/pricing/PackagingArt";
import { THREE_PL_USPS_RATES } from "@/data/threePlPricing";
import { trackEvent } from "@/lib/analytics";

interface DomesticPricingRow {
    STT: string;
    weight: string;
    gram: string;
    zones: Record<number, string>;
}

const ZONES = [1, 2, 3, 4, 5, 6, 7, 8];
const INITIAL_ROWS = 6;

// Reveals the rows the show-more button hides, and drops JS-only controls,
// when the page is read without scripting.
const NO_SCRIPT_CSS = `
[data-table-collapsed="true"] tr[data-overflow-row="true"]{display:table-row!important}
.rate-js-only{display:none!important}
`;

// Format weight cell: add "oz" suffix if missing.
function formatWeight(weight: string): string {
    if (!weight) return "";
    return weight.includes("oz") ? weight : `${weight} oz`;
}

const DomesticPricingContent = () => {
    const { t, language } = useI18n();
    const [showAll, setShowAll] = useState(false);
    const { scrollRef, canScrollLeft, canScrollRight, scrollBy } = useScrollAffordance(150);

    useEffect(() => {
        trackEvent("view_pricing", { pricing_type: "us_3pl", locale: language });
    }, [language]);

    const domesticPricingRows = useMemo<DomesticPricingRow[]>(() => {
        return THREE_PL_USPS_RATES.map((r, idx) => ({
            STT: String(idx + 1),
            weight: String(r[0]),
            gram: String(Math.round(r[0] * 28.3495)),
            zones: Object.fromEntries(ZONES.map((zone) => [zone, r[zone].toFixed(2)])),
        }));
    }, []);

    const hasMore = domesticPricingRows.length > INITIAL_ROWS;

    const exportConfig = useMemo(() => {
        const headers = ["Weight Not Over (in ounces)", "Gram", ...ZONES.map(z => `Zone ${z}`)];
        const rows = domesticPricingRows.map((row) => [
            formatWeight(row.weight),
            row.gram,
            ...ZONES.map(z => row.zones[z])
        ]);
        return { filename: 'THG_Domestic_Pricing_All_Zones', headers, rows };
    }, [domesticPricingRows]);

    const rateCategories = useMemo<RateCategory[]>(() => [
        {
            key: "inbound",
            title: t("domestic.cat_inbound"),
            items: [
                { label: t("fulfill.s1"), price: t("fulfill.s1_price") },
                {
                    label: t("fulfill.s2"), subRows: [
                        { desc: t("fulfill.s2_r1"), price: t("fulfill.s2_r1_price") },
                        { desc: t("fulfill.s2_r2"), price: "2.5$ /carton" },
                        { desc: t("fulfill.s2_r3"), price: "6.25$ /carton" },
                        { desc: t("fulfill.s2_r4"), price: "38$ /CBM" },
                        { desc: t("fulfill.s2_r5"), price: "30$ /hour\n30$ / 1500pcs", note: t("fulfill.s2_r5_note") },
                        { desc: t("fulfill.s2_r6"), price: "", note: t("fulfill.s2_r6_note") },
                    ],
                },
            ],
        },
        {
            key: "storage",
            title: t("domestic.cat_storage"),
            items: [{ label: t("fulfill.s3"), price: t("fulfill.s3_price") }],
        },
        {
            key: "outbound",
            title: t("domestic.cat_outbound"),
            items: [
                {
                    label: t("fulfill.s4"), subRows: [
                        { desc: "- Items ≤ 2 lbs", price: "1.2$ /pc" },
                        { desc: "- Item > 2 lbs; ≤ 4 lbs", price: "1.7$ /pc" },
                        { desc: "- Item > 4 lbs; ≤ 6 lbs", price: "2.2$ /pc" },
                        { desc: "- Item > 6 lbs; ≤ 8 lbs", price: "2.7$ /pc" },
                        { desc: "- Item > 8 lbs; ≤ 10 lbs", price: "3.2$ /pc" },
                        { desc: "- Item > 10 lbs", price: "", note: t("fulfill.s4_r6_note") },
                    ],
                    note: t("fulfill.s4_note"),
                },
                { label: t("fulfill.s5"), price: "$0.5 - $1", note: t("fulfill.s5_note") },
                { label: t("fulfill.s7"), price: t("fulfill.s7_price") },
            ],
        },
        {
            key: "returns",
            title: t("domestic.cat_returns"),
            items: [
                { label: t("fulfill.s6"), price: t("fulfill.s6_price"), note: t("fulfill.s6_note") },
                { label: t("fulfill.s8"), price: "2.5$ /carton", note: t("fulfill.s8_note") },
            ],
        },
    ], [t]);

    const packagingCards = useMemo(() => [
        {
            key: "poly",
            title: "Poly mailer",
            value: t("domestic.pkg_free"),
            free: true,
            desc: t("domestic.pkg_poly_desc"),
            art: <PolyMailerArt />,
        },
        {
            key: "bubble",
            title: "Bubble mailer",
            value: "$0.50",
            unit: t("domestic.pkg_bubble_unit"),
            desc: t("domestic.pkg_bubble_desc"),
            art: <BubbleMailerArt />,
        },
        {
            key: "carton",
            title: t("domestic.pkg_carton_title"),
            sizes: [
                { label: "6 × 4 × 4 in", price: "$1.00" },
                { label: "10 × 6 × 4 in", price: "$1.50" },
                { label: "9 × 7 × 3 in", price: "$1.70" },
            ],
            desc: t("domestic.pkg_carton_desc"),
            art: <CartonBoxArt />,
        },
        {
            key: "own",
            title: t("domestic.pkg_own_title"),
            value: t("domestic.pkg_own_value"),
            free: true,
            desc: t("domestic.pkg_own_desc"),
            art: <OwnPackagingArt />,
        },
    ], [t]);

    const heroMetrics = [
        { value: "1–8", label: "Zone" },
        { value: String(domesticPricingRows.length), label: t("domestic.weight_ounces") },
        {
            value: String(rateCategories.reduce((sum, cat) => sum + cat.items.length, 0)),
            label: t("domestic.th_service"),
        },
    ];

    const trustItems = [
        { value: t("fulfill.s1_price"), label: t("fulfill.s1") },
        { value: t("fulfill.s6_price"), label: t("fulfill.s6") },
        { value: "2.5$ /carton", label: t("fulfill.s8") },
    ];

    const summaryCards = [
        { icon: Package, title: t("domestic.table_title"), desc: t("domestic.table_desc"), href: "#rate-table" },
        { icon: Warehouse, title: t("domestic.fulfill_title"), desc: t("domestic.fulfill_desc"), href: "#fee-catalog" },
        { icon: Calculator, title: t("domestic.estimator_title"), desc: t("domestic.estimator_desc"), href: "#estimator" },
        { icon: PlayCircle, title: t("domestic.video_title"), desc: t("domestic.video_desc"), href: "#guide-video" },
    ];

    return (
        <main>
            {/* 1 — Hero. Rendered eagerly: wrapping it in a reveal blanks the LCP element. */}
            <section className="bg-navy text-white">
                <div className="mx-auto max-w-[1200px] px-6 pb-[68px] pt-[76px]">
                    <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
                        <Link
                            to={`/${language}`}
                            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 text-[12px] font-semibold text-white/80 transition-colors hover:text-white"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" /> {t("domestic.back_home")}
                        </Link>
                        <div className="flex gap-2">
                            <Link
                                to={`/${language}/domestic-pricing`}
                                aria-current="page"
                                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-primary px-4 text-[12px] font-bold text-primary-foreground"
                            >
                                <MapPin className="h-3.5 w-3.5" /> {t("domestic.tab_domestic")}
                            </Link>
                            <Link
                                to={`/${language}/international-pricing`}
                                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-white/20 px-4 text-[12px] font-bold text-white transition-colors hover:border-primary hover:text-primary"
                            >
                                <Globe className="h-3.5 w-3.5" /> {t("domestic.tab_intl")}
                            </Link>
                        </div>
                    </div>

                    <p className="rate-eyebrow text-primary">{t("domestic.tab_domestic")}</p>
                    <h1 className="rate-display mt-3 max-w-3xl font-bold tracking-tight">
                        {t("domestic.hero_title")} <span className="text-primary">{t("domestic.hero_highlight")}</span>
                    </h1>
                    <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-white/70 md:text-base">
                        {t("domestic.hero_desc")} <span className="notranslate font-semibold text-white">THG Warehouse</span>
                    </p>

                    <ul className="mt-9 flex flex-wrap gap-x-10 gap-y-5">
                        {heroMetrics.map((metric) => (
                            <li key={metric.label} className="border-l-[3px] border-primary pl-3.5">
                                <p className="text-[28px] font-extrabold leading-none">{metric.value}</p>
                                <p className="rate-eyebrow mt-1.5 max-w-[150px] text-white/70">{metric.label}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* 2 — Sticky commitments */}
            <RateTrustBar items={trustItems} />

            {/* 3 — What this rate card covers */}
            <section className="px-6 py-[72px]">
                <div className="mx-auto max-w-[1200px]">
                    <ScrollReveal>
                        <ul className="grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
                            {summaryCards.map((card) => (
                                <li key={card.href}>
                                    <a
                                        href={card.href}
                                        className="flex h-full flex-col rounded-[16px] border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/60 hover:shadow-lg"
                                    >
                                        <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                                            <card.icon className="h-5 w-5" />
                                        </span>
                                        <p className="text-[15px] font-bold leading-snug text-foreground">{card.title}</p>
                                        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{card.desc}</p>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </ScrollReveal>
                </div>
            </section>

            {/* 4 — Guide video, on the dark surface as a break between dense data blocks */}
            <section id="guide-video" className="bg-navy px-6 py-[72px] text-white">
                <div className="mx-auto max-w-[1200px]">
                    <ScrollReveal>
                        <p className="rate-eyebrow text-primary">{t("domestic.video_desc")}</p>
                        <h2 className="rate-section-title mt-3 font-bold">{t("domestic.video_title")}</h2>
                        <div className="rate-dark-card mt-8 overflow-hidden rounded-[16px] border border-white/15 bg-white/[0.04] p-4">
                            <div className="relative w-full overflow-hidden rounded-[12px]" style={{ paddingBottom: "56.25%" }}>
                                <iframe
                                    className="absolute left-0 top-0 h-full w-full"
                                    src="https://www.youtube.com/embed/k-oETHQF7tE?start=19"
                                    title="THG Fulfillment Pricing Guide"
                                    loading="lazy"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* 5 — Fee catalogue: searchable accordion */}
            <section id="fee-catalog" className="px-6 py-[72px]">
                <div className="mx-auto max-w-[1200px]">
                    <ScrollReveal>
                        <div className="mx-auto mb-9 max-w-[900px]">
                            <p className="rate-eyebrow text-primary">{t("domestic.fulfill_desc")}</p>
                            <h2 className="rate-section-title mt-3 font-bold text-navy">{t("domestic.fulfill_title")}</h2>
                        </div>
                        <FulfillmentRateCatalog categories={rateCategories} />
                        <p className="mx-auto mt-5 max-w-[900px] rounded-[14px] border border-amber-200/70 bg-amber-50 px-5 py-4 text-center text-[12px] font-bold italic text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 md:text-[13px]">
                            {t("domestic.free_storage_promo")}
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* 6 — Packaging fee sheet on the dark surface */}
            <section className="bg-navy px-6 py-[72px] text-white">
                <div className="mx-auto max-w-[1200px]">
                    <ScrollReveal>
                        <p className="rate-eyebrow text-primary">{t("domestic.pkg_eyebrow")}</p>
                        <h2 className="rate-section-title mt-3 font-bold">{t("warehouse_page.pkg_title")}</h2>
                        <p className="mt-4 max-w-[65ch] text-[15px] leading-relaxed text-white/70">
                            {t("domestic.pkg_intro")}
                        </p>
                        <ul className="pk-grid mt-8">
                            {packagingCards.map((card) => (
                                <li key={card.key} className="pk-card">
                                    <div className="pk-artwrap">{card.art}</div>
                                    <h3 className="mb-2 mt-1.5 text-[18px] font-extrabold text-white">{card.title}</h3>
                                    <div className="mb-2.5">
                                        {card.sizes ? (
                                            <div className="flex flex-col gap-1">
                                                {card.sizes.map((size) => (
                                                    <div key={size.label} className="pk-size text-[14.5px] text-white/80">
                                                        <span>{size.label}</span>
                                                        <span className="whitespace-nowrap font-extrabold text-primary">{size.price}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : card.free ? (
                                            <span className="pk-free inline-block rounded-full border-2 border-primary/55 px-4 py-0.5 text-[20px] font-black uppercase tracking-wide text-primary">
                                                {card.value}
                                            </span>
                                        ) : (
                                            <span>
                                                <span className="text-[30px] font-black tracking-tight text-primary">{card.value}</span>
                                                <span className="text-[14px] font-semibold text-white/60"> {card.unit}</span>
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[14.5px] leading-relaxed text-white/70">{card.desc}</p>
                                </li>
                            ))}
                        </ul>
                    </ScrollReveal>
                </div>
            </section>

            {/* 8 — Long zone rate table. Every row ships in the HTML; JS only collapses. */}
            <section id="rate-table" className="px-6 py-[72px]">
                <div className="mx-auto max-w-[1200px]">
                    <ScrollReveal>
                        <div className="mx-auto mb-9 max-w-[900px]">
                            <p className="rate-eyebrow text-primary">{t("domestic.table_desc")}</p>
                            <h2 className="rate-section-title mt-3 font-bold text-navy">{t("domestic.table_title")}</h2>
                        </div>

                        <div
                            data-table-collapsed={showAll ? "false" : "true"}
                            className="overflow-hidden rounded-[16px] border border-border/60 bg-card shadow-sm"
                        >
                            <div className="flex items-center justify-end border-b border-border/40 bg-secondary/40 px-5 py-2.5">
                                <button
                                    onClick={() => lazyExportToExcel(exportConfig)}
                                    className="rate-js-only flex h-9 w-9 items-center justify-center rounded-lg bg-card text-primary shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                                    title={t("pt.export_excel")}
                                    aria-label={t("pt.export_excel")}
                                >
                                    <FileSpreadsheet size={15} />
                                </button>
                            </div>

                            <p className="border-b border-amber-200/60 bg-amber-50 px-5 py-2.5 text-[11px] font-medium italic text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 md:text-xs">
                                * {t("domestic.fuel_surcharge")}
                            </p>

                            {(canScrollLeft || canScrollRight) && (
                                <div className="rate-js-only flex items-center justify-between border-b border-border/30 bg-secondary/30 px-4 py-2 md:hidden">
                                    <span className="text-[10px] font-medium text-muted-foreground">{t("domestic.swipe_hint")}</span>
                                    <div className="flex items-center gap-1.5">
                                        <button onClick={() => scrollBy(-1)} disabled={!canScrollLeft} aria-label="Scroll left" className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card disabled:opacity-30"><ChevronLeft size={13} /></button>
                                        <button onClick={() => scrollBy(1)} disabled={!canScrollRight} aria-label="Scroll right" className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card disabled:opacity-30"><ChevronRight size={13} /></button>
                                    </div>
                                </div>
                            )}

                            <div className="relative">
                                <div ref={scrollRef} className="overflow-x-auto scroll-smooth">
                                    <table id="table-domestic" className="w-full min-w-[720px] border-collapse text-[11px] md:text-[13px]">
                                        <thead>
                                            <tr className="bg-navy text-white">
                                                <th className="rate-eyebrow sticky left-0 z-10 min-w-[50px] border-r border-white/20 bg-navy px-3 py-2.5 text-center shadow-[2px_0_4px_-2px_rgba(0,0,0,0.15)]">{t("domestic.th_stt")}</th>
                                                <th className="rate-eyebrow min-w-[110px] whitespace-nowrap border-r border-white/20 px-3 py-2.5 text-center">{t("domestic.weight_ounces")}</th>
                                                <th className="rate-eyebrow min-w-[70px] whitespace-nowrap border-r border-white/20 px-3 py-2.5 text-center">Gram</th>
                                                {ZONES.map((z) => (
                                                    <th key={z} className="rate-eyebrow min-w-[70px] whitespace-nowrap border-r border-white/20 px-3 py-2.5 text-center last:border-r-0">Zone {z}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {domesticPricingRows.map((row, idx) => (
                                                <tr
                                                    key={row.STT}
                                                    data-overflow-row={idx >= INITIAL_ROWS ? "true" : undefined}
                                                    className={`border-b border-border/20 transition-colors hover:bg-primary/5 ${idx % 2 === 0 ? "bg-background" : "bg-secondary/20"}`}
                                                >
                                                    <td className="sticky left-0 z-10 whitespace-nowrap border-r border-border/30 px-3 py-2 text-center font-semibold text-navy shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]" style={{ backgroundColor: "inherit" }}>
                                                        {idx + 1}
                                                    </td>
                                                    <td className="whitespace-nowrap border-r border-border/30 px-3 py-2 text-center font-semibold">
                                                        {formatWeight(row.weight)}
                                                    </td>
                                                    <td className="whitespace-nowrap border-r border-border/30 px-3 py-2 text-center font-semibold">
                                                        {row.gram}
                                                    </td>
                                                    {ZONES.map((z) => {
                                                        const val = row.zones[z];
                                                        const displayVal = (val && val !== "-" && !String(val).includes("$")) ? `$${val}` : val;
                                                        return (
                                                            <td key={z} className="whitespace-nowrap border-r border-border/20 px-3 py-2 text-center font-bold text-primary last:border-r-0">
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
                                    <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-6 bg-gradient-to-l from-white to-transparent md:hidden" />
                                )}
                            </div>

                            {hasMore && (
                                <div className="rate-js-only flex justify-center border-t border-border/30 py-3">
                                    <button
                                        onClick={() => setShowAll((prev) => !prev)}
                                        aria-expanded={showAll}
                                        aria-controls="table-domestic"
                                        className="flex min-h-[44px] items-center gap-1.5 rounded-full bg-secondary px-6 text-[12px] font-bold text-navy transition-colors hover:bg-secondary/70"
                                    >
                                        {showAll ? (
                                            <>{t("domestic.collapse")} <ChevronUp className="h-3.5 w-3.5" /></>
                                        ) : (
                                            <>{t("domestic.see_more").replace("{count}", String(domesticPricingRows.length - INITIAL_ROWS))} <ChevronDown className="h-3.5 w-3.5" /></>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* 9 — Estimator */}
            <section id="estimator" className="px-6 pb-[72px]">
                <div className="mx-auto max-w-[820px]">
                    <ScrollReveal>
                        <ThreePlEstimator />
                    </ScrollReveal>
                </div>
            </section>

            {/* 10 — Closing CTA */}
            <section className="bg-navy px-6 py-[72px] text-white">
                <div className="mx-auto max-w-[820px] text-center">
                    <ScrollReveal>
                        <h2 className="rate-section-title font-bold">{t("domestic.cta_title")}</h2>
                        <p className="mx-auto mt-4 max-w-[65ch] text-sm leading-relaxed text-white/70">{t("domestic.cta_desc")}</p>
                        <div className="mt-8">
                            <LeadFormDialog
                                sourcePage="/domestic-pricing#cta"
                                primaryService="warehouse"
                                surface="warehouse-inline"
                                trigger={
                                    <Button
                                        className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-primary px-7 text-[13px] font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-colors hover:bg-primary/90"
                                    >
                                        {t("domestic.cta_btn")} <ArrowRight className="h-4 w-4" />
                                    </Button>
                                }
                            />
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </main>
    );
};

const DomesticPricingPage = () => {
    const { t, language } = useI18n();
    const localizedPath = `/${language}/domestic-pricing`;
    return (
        <div className="rate-page min-h-screen bg-background">
            <SeoHead
                title={t("seo.domestic_pricing_title")}
                description={t("seo.domestic_pricing_desc")}
                path="/domestic-pricing"
            />
            <JsonLdBreadcrumb
                items={[
                    { name: t("domestic.back_home"), url: `https://thgfulfill.com/${language}` },
                    { name: `${t("domestic.hero_title")} ${t("domestic.hero_highlight")}`, url: `https://thgfulfill.com${localizedPath}` },
                ]}
            />
            <noscript>
                <style>{NO_SCRIPT_CSS}</style>
            </noscript>
            <Navbar />
            <div className="pt-16 lg:pt-20">
                <DomesticPricingContent />
            </div>
        </div>
    );
};

export default DomesticPricingPage;
