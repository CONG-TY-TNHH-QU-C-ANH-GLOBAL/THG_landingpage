import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { domesticPricingRows, fulfillmentServices } from "@/data/domesticPricingData";
import { Link } from "react-router-dom";
import {
    MapPin, Package, Truck, Globe, DollarSign, Shield,
    ChevronDown, ChevronUp, ArrowRight, Warehouse, CheckCircle2
} from "lucide-react";

const ZONES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const INITIAL_ROWS = 6;

const DomesticPricingContent = () => {
    const [selectedZone, setSelectedZone] = useState<number>(5);
    const [showAll, setShowAll] = useState(false);
    const displayRows = showAll ? domesticPricingRows : domesticPricingRows.slice(0, INITIAL_ROWS);
    const hasMore = domesticPricingRows.length > INITIAL_ROWS;

    return (
        <main className="pt-24 pb-20 bg-background">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Hero */}
                <ScrollReveal>
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary mb-6">
                            <MapPin className="w-4 h-4" />
                            US Domestic Shipping
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-navy mb-4 tracking-tight">
                            US Domestic <span className="text-primary">Shipping Rates</span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                            Zone-based pricing for US domestic shipping. Competitive USPS rates from <span className="notranslate" translate="no">THG Warehouse</span> fulfillment centers.
                        </p>

                        {/* Tab navigation to International */}
                        <div className="flex justify-center gap-3 mt-8 flex-wrap">
                            <Link
                                to="/bang-gia-noi-dia"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md"
                            >
                                <MapPin className="w-4 h-4" /> Domestic Pricing
                            </Link>
                            <Link
                                to="/bang-gia-quoc-te"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-foreground font-semibold text-sm hover:bg-secondary/80 transition-colors"
                            >
                                <Globe className="w-4 h-4" /> International Pricing
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
                                    <h3 className="font-bold text-foreground">Select Shipping Zone</h3>
                                    <p className="text-xs text-muted-foreground">Zones 1-9 based on origin-destination distance</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
                            {ZONES.map((z) => (
                                <button
                                    key={z}
                                    onClick={() => setSelectedZone(z)}
                                    className={`
                    relative px-3 py-3 rounded-xl font-bold text-sm transition-all duration-300 border-2
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
                                        <h3 className="font-bold text-foreground text-lg">
                                            Zone {selectedZone} — Shipping Rates
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            Prices are reference only. Contact THG for actual quotes.
                                        </p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                    <DollarSign className="w-3.5 h-3.5" />
                                    {domesticPricingRows.length} weight tiers
                                </span>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto notranslate" translate="no">
                            <table className="w-full text-sm min-w-[500px] whitespace-nowrap">
                                <thead>
                                    <tr className="bg-navy text-white">
                                        <th className="px-4 py-3 text-left font-semibold w-16">#</th>
                                        <th className="px-4 py-3 text-left font-semibold">Weight (oz)</th>
                                        <th className="px-4 py-3 text-left font-semibold">Weight (gram)</th>
                                        <th className="px-4 py-3 text-right font-semibold">
                                            Price (Zone {selectedZone})
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayRows.map((row, idx) => (
                                        <tr
                                            key={row.STT}
                                            className={`
                        border-b border-border/20 transition-colors hover:bg-primary/5
                        ${idx % 2 === 0 ? "bg-background" : "bg-secondary/20"}
                      `}
                                        >
                                            <td className="px-4 py-3 text-muted-foreground font-medium">{row.STT}</td>
                                            <td className="px-4 py-3 font-semibold text-navy">{row.weight}</td>
                                            <td className="px-4 py-3 text-navy/70 font-medium">{row.gram}</td>
                                            <td className="px-4 py-3 text-right font-bold text-primary text-base">
                                                {row.zones[selectedZone]}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {hasMore && (
                                <div className="flex justify-center py-4 border-t border-border/20">
                                    <button
                                        onClick={() => setShowAll(!showAll)}
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-sm font-semibold text-navy transition-all duration-300 hover:shadow-md"
                                    >
                                        {showAll ? (
                                            <>Show Less <ChevronUp className="w-4 h-4" /></>
                                        ) : (
                                            <>See More ({domesticPricingRows.length - INITIAL_ROWS} rows) <ChevronDown className="w-4 h-4" /></>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </ScrollReveal>

                {/* Fulfillment Services */}
                <ScrollReveal>
                    <div className="mb-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary mb-4">
                                <Warehouse className="w-4 h-4" />
                                US Warehouse Services
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-navy">
                                Fulfillment <span className="text-primary">Service Costs</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* Receiving */}
                            <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <h4 className="font-bold text-foreground">{fulfillmentServices.receiving.label}</h4>
                                </div>
                                <div className="text-3xl font-black text-emerald-600 mb-2">{fulfillmentServices.receiving.price}</div>
                                <p className="text-sm text-muted-foreground">{fulfillmentServices.receiving.note}</p>
                            </div>

                            {/* Storage */}
                            <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                        <Warehouse className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h4 className="font-bold text-foreground">{fulfillmentServices.storage.label}</h4>
                                </div>
                                <div className="space-y-2 mb-3">
                                    {fulfillmentServices.storage.options.map((opt) => (
                                        <div key={opt.desc} className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">{opt.desc}</span>
                                            <span className="font-bold text-blue-600">{opt.price}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                                    <Shield className="w-3.5 h-3.5" />
                                    {fulfillmentServices.storage.note}
                                </div>
                            </div>

                            {/* Pack & Label */}
                            <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                        <Package className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <h4 className="font-bold text-foreground">{fulfillmentServices.packLabel.label}</h4>
                                </div>
                                <div className="space-y-2">
                                    {fulfillmentServices.packLabel.tiers.map((tier) => (
                                        <div key={tier.range} className="flex items-center justify-between py-1 border-b border-border/20 last:border-b-0">
                                            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                                                <ArrowRight className="w-3 h-3" /> {tier.range}
                                            </span>
                                            <span className="font-bold text-amber-600">{tier.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* CTA */}
                <ScrollReveal>
                    <div className="bg-gradient-to-br from-navy via-navy/95 to-primary/80 text-white rounded-2xl p-8 md:p-12 text-center">
                        <h3 className="text-2xl md:text-3xl font-bold mb-3">Need a Custom Quote?</h3>
                        <p className="text-white/70 mb-6 max-w-xl mx-auto">
                            Contact THG team for personalized shipping rates based on your volume and requirements.
                        </p>
                        <a
                            href="/#contact"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                        >
                            Get Free Quote <ArrowRight className="w-4 h-4" />
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
