import React, { useState, useMemo, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { domesticPricingRows as fallbackRows, fulfillmentServices } from "@/data/domesticPricingData";
import { DomesticPricingRow } from "@/data/domesticPricingData";
import { Link } from "react-router-dom";
import {
    MapPin, Package, Truck, Globe, Shield,
    ChevronDown, ChevronUp, ArrowRight, ArrowLeft, Warehouse, CheckCircle2,
    FileSpreadsheet, FileText
} from "lucide-react";
import { exportToExcel } from "@/lib/exportUtils";
import { useLarkPricingContext, SyncBadge, transformSheetToDomesticData } from "@/components/pricing/LarkPricingProvider";
import { useI18n } from "@/lib/i18n";

const ZONES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const INITIAL_ROWS = 6;

const DomesticPricingContent = () => {
    const lark = useLarkPricingContext();
    const { tVi } = useI18n();
    const [selectedZone, setSelectedZone] = useState<number>(1);
    const [showAll, setShowAll] = useState(false);
    const tableRef = useRef<HTMLDivElement>(null);

    const toggleShowAll = useCallback(() => {
        setShowAll((prev) => {
            if (prev && tableRef.current) {
                const rect = tableRef.current.getBoundingClientRect();
                const targetY = Math.max(0, window.scrollY + rect.top - 80);
                requestAnimationFrame(() => window.scrollTo({ top: targetY, behavior: "smooth" }));
            }
            return !prev;
        });
    }, []);

    const domesticPricingRows = useMemo(() => {
        if (!lark.sheets) return fallbackRows;
        for (const [, sheet] of Object.entries(lark.sheets)) {
            const title = sheet.title?.trim().toLowerCase();
            if (title === "domesticpricing" || title === "noidia" || title === "nội địa" || title === "domestic") {
                const transformed = transformSheetToDomesticData(sheet.data);
                if (transformed.length > 0) {
                    return transformed.map(r => ({
                        STT: r.STT || "",
                        weight: r["Weight Not Over (in ounces)"] || "",
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
        const headers = ["\u200B", "Oz", "Weight (grams)", `Fees (Zone ${selectedZone})`];
        const rows = domesticPricingRows.map((row, idx) => [
            idx + 1, row.weight, row.gram, row.zones[selectedZone]
        ]);
        return { filename: 'THG_Domestic_Pricing_Zone_' + selectedZone, headers, rows };
    }, [selectedZone, domesticPricingRows]);

    return (
        <main className="pt-20 pb-16 bg-background">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Back + Nav */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-medium text-[12px] transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Trang chủ
                    </Link>
                    <div className="flex gap-2">
                        <Link
                            to="/bang-gia-noi-dia"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold text-[12px] shadow-sm"
                        >
                            <MapPin className="w-3.5 h-3.5" /> {tVi("pricing.nav_domestic")}
                        </Link>
                        <Link
                            to="/bang-gia-quoc-te"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-secondary text-foreground font-semibold text-[12px] hover:bg-secondary/80 transition-colors"
                        >
                            <Globe className="w-3.5 h-3.5" /> {tVi("pricing.nav_international")}
                        </Link>
                    </div>
                </div>

                {/* Hero — compact */}
                <ScrollReveal>
                    <div className="text-center mb-8">
                        <h1 className="text-2xl md:text-4xl font-bold text-navy mb-2 tracking-tight">
                            Bảng Giá Cước <span className="text-primary">Nội Địa Mỹ</span>
                        </h1>
                        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                            Cước phí USPS cạnh tranh từ các trung tâm fulfillment của <span className="notranslate font-semibold">THG Warehouse</span>
                        </p>
                        <div className="mt-2"><SyncBadge /></div>
                    </div>
                </ScrollReveal>

                {/* Zone Selector — inline compact */}
                <ScrollReveal>
                    <div className="bg-card border border-border/40 rounded-xl p-4 md:p-5 shadow-sm mb-6">
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Truck className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground text-sm">Chọn Zone</h3>
                                <p className="text-[11px] text-muted-foreground">Phân vùng theo khoảng cách kho → điểm đích</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {ZONES.map((z) => (
                                <button
                                    key={z}
                                    onClick={() => setSelectedZone(z)}
                                    className={`px-3 py-2 rounded-lg font-bold text-[12px] transition-all duration-200 border ${selectedZone === z
                                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                                        : "bg-secondary/50 text-foreground border-transparent hover:border-primary/30 hover:bg-secondary"
                                        }`}
                                >
                                    Zone {z}
                                </button>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                {/* Pricing Table */}
                <ScrollReveal>
                    <div ref={tableRef} className="bg-card border border-border/40 rounded-xl shadow-sm overflow-hidden mb-6" translate="no">
                        {/* Table header bar */}
                        <div className="px-4 py-3 border-b border-border/40 bg-secondary/30 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                                    <Package className="w-4 h-4 text-primary-foreground" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-foreground text-sm truncate">
                                        Zone {selectedZone} — Bảng Giá Cước
                                    </h3>
                                    <p className="text-[10px] md:text-[11px] text-muted-foreground truncate">
                                        Giá tham khảo. Liên hệ THG để nhận báo giá chính xác.
                                    </p>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <button onClick={() => exportToExcel(exportConfig)} className="p-1.5 bg-secondary hover:bg-primary/20 rounded text-primary transition-colors" title="Xuất Excel">
                                    <FileSpreadsheet size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table id="table-domestic" className="w-full text-[12px] md:text-[13px]">
                                <thead>
                                    <tr className="bg-navy text-white">
                                        <th className="px-2 py-2 text-center font-semibold text-[10px] md:text-[11px] uppercase tracking-wider w-8 border-r border-white/20">{"\u200B"}</th>
                                        <th className="px-2 md:px-3 py-2 text-center font-semibold text-[10px] md:text-[11px] uppercase tracking-wider border-r border-white/20">Oz</th>
                                        <th className="px-2 md:px-3 py-2 text-center font-semibold text-[10px] md:text-[11px] uppercase tracking-wider border-r border-white/20">Weight (grams)</th>
                                        <th className="px-2 md:px-3 py-2 text-center font-semibold text-[10px] md:text-[11px] uppercase tracking-wider">
                                            Fees (Zone {selectedZone})
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayRows.map((row, idx) => (
                                        <tr
                                            key={row.weight}
                                            className={`border-b border-border/20 transition-colors hover:bg-primary/5 ${idx % 2 === 0 ? "bg-background" : "bg-secondary/20"}`}
                                        >
                                            <td className="px-2 py-1.5 md:py-2 text-center text-muted-foreground font-medium border-r border-border/30">{idx + 1}</td>
                                            <td className="px-2 md:px-3 py-1.5 md:py-2 text-center font-semibold text-navy whitespace-nowrap border-r border-border/30">{row.weight}</td>
                                            <td className="px-2 md:px-3 py-1.5 md:py-2 text-center text-navy/70 font-medium whitespace-nowrap border-r border-border/30">{row.gram}</td>
                                            <td className="px-2 md:px-3 py-1.5 md:py-2 text-center font-bold text-primary whitespace-nowrap">
                                                <span className="notranslate" translate="no">{row.zones[selectedZone]}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Expand/Collapse */}
                        {hasMore && (
                            <div className="flex justify-center py-3 border-t border-border/20 relative z-10">
                                <button
                                    onClick={toggleShowAll}
                                    className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-[12px] font-semibold text-navy transition-all active:scale-95 select-none cursor-pointer"
                                >
                                    {showAll ? (
                                        <>{tVi("pricing.btn_collapse")} <ChevronUp className="w-3.5 h-3.5" /></>
                                    ) : (
                                        <>{tVi("pricing.btn_expand").replace("{count}", String(domesticPricingRows.length - INITIAL_ROWS))} <ChevronDown className="w-3.5 h-3.5" /></>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </ScrollReveal>

                {/* Fulfillment Services */}
                <ScrollReveal>
                    <div className="mb-6">
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Warehouse className="w-4 h-4 text-primary" />
                            </div>
                            <h2 className="text-lg md:text-xl font-bold text-navy">
                                Chi Phí <span className="text-primary notranslate">Fulfillment</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Receiving — compact */}
                            <div className="bg-card border border-border/40 rounded-xl p-5 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground text-sm mb-0.5">{fulfillmentServices.receiving.label}</h4>
                                    <div className="text-2xl font-black text-emerald-600">
                                        <span className="notranslate" translate="no">{fulfillmentServices.receiving.price}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Storage — compact */}
                            <div className="bg-card border border-border/40 rounded-xl p-5 shadow-sm">
                                <div className="flex items-center gap-2.5 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        <Warehouse className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h4 className="font-bold text-foreground text-sm">{fulfillmentServices.storage.label}</h4>
                                </div>
                                <div className="space-y-2">
                                    {fulfillmentServices.storage.options.map((opt) => (
                                        <div key={opt.desc} className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-b-0">
                                            <span className="text-[12px] text-muted-foreground">{opt.desc}</span>
                                            <span className="font-bold text-blue-600 text-[13px] whitespace-nowrap ml-3">
                                                <span className="notranslate" translate="no">{opt.price}</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Inspection */}
                            <div className="bg-card border border-border/40 rounded-xl p-5 shadow-sm">
                                <div className="flex items-center gap-2.5 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <h4 className="font-bold text-foreground text-sm">{fulfillmentServices.inspection.label}</h4>
                                </div>
                                <div className="space-y-2">
                                    {fulfillmentServices.inspection.options.map((opt, i) => (
                                        <div key={i} className="py-1.5 border-b border-border/20 last:border-b-0">
                                            <span className="text-[12px] text-muted-foreground block">{opt.desc}</span>
                                            <span className="font-bold text-purple-600 text-[13px]">
                                                <span className="notranslate" translate="no">{opt.price}</span>
                                            </span>
                                            {opt.note && <span className="text-[11px] text-muted-foreground italic block">{opt.note}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pack & Label */}
                            <div className="bg-card border border-border/40 rounded-xl p-5 shadow-sm">
                                <div className="flex items-center gap-2.5 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                        <Package className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <h4 className="font-bold text-foreground text-sm">{fulfillmentServices.packLabel.label}</h4>
                                </div>
                                <div className="space-y-1.5 mb-3">
                                    {fulfillmentServices.packLabel.tiers.map((tier) => (
                                        <div key={tier.range} className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-b-0">
                                            <span className="text-[12px] text-muted-foreground flex items-center gap-1.5">
                                                <ArrowRight className="w-3 h-3 text-amber-500/50" /> {tier.range}
                                            </span>
                                            <span className="font-bold text-amber-600 text-[13px] whitespace-nowrap ml-3">
                                                <span className="notranslate" translate="no">{tier.price}</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 text-amber-700 text-[11px] font-medium leading-relaxed">
                                    <Shield className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                    {fulfillmentServices.packLabel.note}
                                </div>
                            </div>
                        </div>
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
                                <h3 className="font-bold text-foreground text-sm">Video Hướng Dẫn Bảng Giá Fulfill</h3>
                                <p className="text-[10px] text-muted-foreground">Chi tiết cách tính phí dịch vụ fulfillment tại kho Mỹ</p>
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

                {/* CTA */}
                <ScrollReveal>
                    <div className="bg-gradient-to-br from-navy via-navy/95 to-primary/80 text-white rounded-xl p-6 md:p-10 text-center">
                        <h3 className="text-xl md:text-2xl font-bold mb-2">Bạn Cần Báo Giá Tùy Chỉnh?</h3>
                        <p className="text-white/70 mb-5 text-sm max-w-lg mx-auto">
                            Liên hệ với đội ngũ THG để nhận bảng giá cá nhân hóa dựa trên sản lượng và nhu cầu của bạn.
                        </p>
                        <a
                            href="/#contact"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-[13px] hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                        >
                            Nhận Báo Giá Miễn Phí <ArrowRight className="w-4 h-4" />
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
        <Footer />
    </div>
);

export default DomesticPricingPage;
