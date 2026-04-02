import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { domesticPricingRows as fallbackRows, fulfillmentServices } from "@/data/domesticPricingData";
import { DomesticPricingRow } from "@/data/domesticPricingData";
import { Link } from "react-router-dom";
import {
    MapPin, Package, Truck, Globe, DollarSign, Shield,
    ChevronDown, ChevronUp, ArrowRight, Warehouse, CheckCircle2,
    FileSpreadsheet, FileText, FileIcon
} from "lucide-react";
import { exportToExcel, exportToWord, exportToPdf } from "@/lib/exportUtils";
import { useLarkPricingContext, SyncBadge, transformSheetToDomesticData } from "@/components/pricing/LarkPricingProvider";

const ZONES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const INITIAL_ROWS = 6;

const DomesticPricingContent = () => {
    const lark = useLarkPricingContext();
    const [selectedZone, setSelectedZone] = useState<number>(5);
    const [showAll, setShowAll] = useState(false);

    // Overlay Lark data if sheet named "domesticPricing" or "noidia" exists
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

    // Export Data Mapping
    const exportConfig = React.useMemo(() => {
        const headers = ["STT", "Cân nặng (oz)", "Cân nặng (gram)", `Cước phí (Zone ${selectedZone})`];
        const rows = domesticPricingRows.map((row, idx) => [
            idx + 1, row.weight, row.gram, row.zones[selectedZone]
        ]);
        return { filename: 'THG_Domestic_Pricing_Zone_' + selectedZone, headers, rows };
    }, [selectedZone]);

    return (
        <main className="pt-24 pb-20 bg-background">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Hero */}
                <ScrollReveal>
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-[13px] font-medium text-primary mb-6">
                            <MapPin className="w-4 h-4" />
                            Vận Chuyển Nội Địa Mỹ
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-navy mb-4 tracking-tight">
                            Bảng Giá Cước <span className="text-primary tracking-normal">Nội Địa Mỹ</span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                            Bảng giá cước vận chuyển nội địa Mỹ theo phân vùng (Zone). Cước phí USPS cạnh tranh trực tiếp từ các trung tâm fulfillment của <span className="notranslate font-semibold">THG Warehouse</span>.
                        </p>
                        <div className="mt-3">
                            <SyncBadge />
                        </div>

                        {/* Tab navigation to International */}
                        <div className="flex justify-center gap-3 mt-8 flex-wrap">
                            <Link
                                to="/bang-gia-noi-dia"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-[13px] shadow-md"
                            >
                                <MapPin className="w-4 h-4" /> Bảng Giá Nội Địa
                            </Link>
                            <Link
                                to="/bang-gia-quoc-te"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-foreground font-semibold text-[13px] hover:bg-secondary/80 transition-colors"
                            >
                                <Globe className="w-4 h-4" /> Bảng Giá Quốc Tế
                            </Link>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Zone Selector */}
                <ScrollReveal>
                    <div className="bg-card border border-border/40 rounded-2xl p-6 md:p-8 shadow-sm mb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Truck className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">Chọn Vùng Giao Hàng (Zone)</h3>
                                    <p className="text-xs text-muted-foreground">Vùng 1-9 phân chia dựa trên khoảng cách từ kho đến điểm đích</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
                            {ZONES.map((z) => (
                                <button
                                    key={z}
                                    onClick={() => setSelectedZone(z)}
                                    className={`
                    relative px-3 py-3 rounded-xl font-bold text-[13px] transition-all duration-300 border-2
                    ${selectedZone === z
                                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                                            : "bg-secondary/50 text-foreground border-transparent hover:border-primary/30 hover:bg-secondary"
                                        }
                  `}
                                >
                                    Zone {z}
                                </button>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                {/* Pricing Table */}
                <ScrollReveal>
                    <div className="bg-card border border-border/40 rounded-2xl shadow-sm overflow-hidden mb-8">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-border/40 bg-secondary/30">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                                        <Package className="w-5 h-5 text-primary-foreground" />
                                    </div>
                                    <div>
                                        <h3 key={selectedZone} className="font-bold text-foreground text-lg">
                                            Zone {selectedZone} — Bảng Giá Cước
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            Giá mang tính chất tham khảo. Vui lòng liên hệ THG để nhận báo giá chính xác.
                                        </p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                    <DollarSign className="w-3.5 h-3.5" />
                                    {domesticPricingRows.length} mốc trọng lượng
                                </span>
                                <div className="flex items-center gap-1.5 ml-2">
                                    <button onClick={() => exportToExcel(exportConfig)} className="p-1.5 bg-secondary hover:bg-primary/20 rounded-md text-primary transition-colors" title="Xuất Excel">
                                        <FileSpreadsheet size={16} />
                                    </button>
                                    <button onClick={() => exportToWord(exportConfig)} className="p-1.5 bg-secondary hover:bg-primary/20 rounded-md text-primary transition-colors" title="Xuất Word">
                                        <FileText size={16} />
                                    </button>
                                    <button onClick={() => exportToPdf(exportConfig)} className="p-1.5 bg-secondary hover:bg-primary/20 rounded-md text-primary transition-colors" title="Xuất PDF">
                                        <FileIcon size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Cards (Hidden on md+) */}
                        <div className="md:hidden flex flex-col gap-3 p-4 bg-secondary/10">
                            {displayRows.map((row, idx) => (
                                <div key={row.weight} className="bg-white border border-border/40 rounded-xl p-4 shadow-sm relative">
                                    <div className="absolute top-4 right-4 text-xs font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                                        STT: {idx + 1}
                                    </div>
                                    <div className="font-bold text-navy text-base mb-1">{row.weight}</div>
                                    <div className="text-[13px] text-muted-foreground mb-4">{row.gram}</div>
                                    <div className="flex justify-between items-center border-t border-border/40 pt-3 mt-1">
                                        <span className="text-[13px] font-medium text-navy">Cước phí (Zone <span className="notranslate" translate="no">{selectedZone}</span>)</span>
                                        <span className="text-lg font-bold text-primary">
                                            <span className="notranslate" translate="no">{row.zones[selectedZone]}</span>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table (Hidden on mobile) */}
                        <div className="hidden md:block overflow-x-auto">
                            <table id="table-domestic" className="w-full text-[13px] min-w-[500px] whitespace-nowrap">
                                <thead>
                                    <tr className="bg-navy text-white">
                                        <th className="px-5 py-3 text-left font-semibold w-16">STT</th>
                                        <th className="px-5 py-3 text-left font-semibold">Cân nặng (oz)</th>
                                        <th className="px-5 py-3 text-left font-semibold">Cân nặng (gram)</th>
                                        <th key={selectedZone} className="px-5 py-3 text-right font-semibold">
                                            Cước phí (Zone {selectedZone})
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayRows.map((row, idx) => (
                                        <tr
                                            key={row.weight}
                                            className={`
                        border-b border-border/20 transition-colors hover:bg-primary/5
                        ${idx % 2 === 0 ? "bg-background" : "bg-secondary/20"}
                      `}
                                        >
                                            <td className="px-5 py-3 text-muted-foreground font-medium">{idx + 1}</td>
                                            <td className="px-5 py-3 font-semibold text-navy">{row.weight}</td>
                                            <td className="px-5 py-3 text-navy/70 font-medium">{row.gram}</td>
                                            <td className="px-5 py-3 text-right font-bold text-primary text-base">
                                                <span className="notranslate" translate="no">{row.zones[selectedZone]}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {hasMore && (
                            <div className="flex justify-center py-4 border-t border-border/20 mx-4 md:mx-0">
                                <button
                                    onClick={() => setShowAll((prev) => !prev)}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-[13px] font-semibold text-navy transition-all duration-300 hover:shadow-md"
                                >
                                    <span className={showAll ? "hidden" : "flex items-center gap-2"}>
                                        Xem thêm ({domesticPricingRows.length - INITIAL_ROWS} dòng) <ChevronDown className="w-4 h-4" />
                                    </span>
                                    <span className={showAll ? "flex items-center gap-2" : "hidden"}>
                                        Thu gọn <ChevronUp className="w-4 h-4" />
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </ScrollReveal>

                {/* Fulfillment Services */}
                <ScrollReveal>
                    <div className="mb-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-[13px] font-medium text-primary mb-4">
                                <Warehouse className="w-4 h-4" />
                                Dịch Vụ Kho Mỹ
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-navy">
                                Chi Phí Dịch Vụ <span className="text-primary notranslate">Fulfillment</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                            {/* Receiving */}
                            <div className="bg-card border border-border/40 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center items-center text-center">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5">
                                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                                </div>
                                <h4 className="font-bold text-foreground text-lg mb-3">{fulfillmentServices.receiving.label}</h4>
                                <div className="text-4xl font-black text-emerald-600">
                                    <span className="notranslate" translate="no">{fulfillmentServices.receiving.price}</span>
                                </div>
                            </div>

                            {/* Inspection */}
                            <div className="bg-card border border-border/40 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h4 className="font-bold text-foreground text-lg">{fulfillmentServices.inspection.label}</h4>
                                </div>
                                <div className="space-y-3">
                                    {fulfillmentServices.inspection.options.map((opt, i) => (
                                        <div key={i} className="flex flex-col gap-1 py-2 border-b border-border/20 last:border-b-0">
                                            <span className="text-[13px] font-medium text-muted-foreground">{opt.desc}</span>
                                            <span className="font-bold text-purple-600 text-sm">
                                                <span className="notranslate" translate="no">{opt.price}</span>
                                            </span>
                                            {opt.note && <span className="text-xs text-muted-foreground italic mt-0.5">{opt.note}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Storage */}
                            <div className="bg-card border border-border/40 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                        <Warehouse className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h4 className="font-bold text-foreground text-lg">{fulfillmentServices.storage.label}</h4>
                                </div>
                                <div className="space-y-3">
                                    {fulfillmentServices.storage.options.map((opt) => (
                                        <div key={opt.desc} className="flex items-center justify-between py-3 border-b border-border/20 last:border-b-0">
                                            <span className="text-[14px] font-medium text-muted-foreground">{opt.desc}</span>
                                            <span className="font-bold text-blue-600 text-[15px]">
                                                <span className="notranslate" translate="no">{opt.price}</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pack & Label */}
                            <div className="bg-card border border-border/40 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                        <Package className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <h4 className="font-bold text-foreground text-lg">{fulfillmentServices.packLabel.label}</h4>
                                </div>
                                <div className="space-y-2 mb-5">
                                    {fulfillmentServices.packLabel.tiers.map((tier) => (
                                        <div key={tier.range} className="flex items-center justify-between py-2 border-b border-border/20 last:border-b-0">
                                            <span className="text-[13px] text-muted-foreground flex items-center gap-2">
                                                <ArrowRight className="w-3.5 h-3.5 text-amber-500/50" /> {tier.range}
                                            </span>
                                            <span className="font-bold text-amber-600">
                                                <span className="notranslate" translate="no">{tier.price}</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-start gap-2.5 p-4 rounded-xl bg-amber-500/10 text-amber-700 text-[13px] font-medium leading-relaxed">
                                    <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    {fulfillmentServices.packLabel.note}
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* CTA */}
                <ScrollReveal>
                    <div className="bg-gradient-to-br from-navy via-navy/95 to-primary/80 text-white rounded-2xl p-8 md:p-12 text-center">
                        <h3 className="text-2xl md:text-3xl font-bold mb-3">Bạn Cần Báo Giá Tùy Chỉnh?</h3>
                        <p className="text-white/70 mb-6 max-w-xl mx-auto">
                            Liên hệ với đội ngũ THG để nhận bảng giá vận chuyển cá nhân hóa dựa trên sản lượng và nhu cầu của bạn.
                        </p>
                        <a
                            href="/#contact"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-[13px] hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
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
