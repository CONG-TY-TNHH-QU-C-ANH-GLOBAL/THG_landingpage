import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { catalogData, CatalogItem } from "@/data/catalogData";
import { Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function CatalogPage() {
    const { t } = useI18n();
    const [filter, setFilter] = useState<"all" | "mens" | "womens" | "accessories">("all");
    const [search, setSearch] = useState("");

    const filteredData = catalogData.filter((item) => {
        const matchCategory = filter === "all" || item.category === filter;
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
        return matchCategory && matchSearch;
    });

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <section className="relative pt-32 pb-16 bg-gradient-to-br from-[hsl(220_20%_97%)] via-[hsl(220_15%_95%)] to-[hsl(220_10%_92%)] overflow-hidden">
                {/* Decorative Grid */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 pointer-events-none mix-blend-overlay" />
                <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[size:32px_32px]" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <ScrollReveal>
                        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium bg-secondary text-primary mb-6 ring-1 ring-primary/20">
                            <Tag className="w-4 h-4" /> THG Catalog
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-navy mb-6">
                            {t("catalog_page.title")}
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                            {t("catalog_page.subtitle")}
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            <section className="py-12 bg-background">
                <div className="container mx-auto px-4">
                    <ScrollReveal delay={100}>
                        {/* Controls */}
                        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                            <div className="flex bg-secondary/50 p-1.5 rounded-xl border border-border/50 overflow-x-auto w-full md:w-auto">
                                {(["all", "mens", "womens", "accessories"] as const).map((cat) => {
                                    const labelMap: Record<string, string> = {
                                        "all": t("catalog_page.filter_all"),
                                        "mens": t("catalog_page.filter_mens"),
                                        "womens": t("catalog_page.filter_womens"),
                                        "accessories": t("catalog_page.filter_acc"),
                                    };
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setFilter(cat)}
                                            className={`px-6 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg whitespace-nowrap ${filter === cat
                                                ? "bg-white text-primary shadow-sm ring-1 ring-border"
                                                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                                }`}
                                        >
                                            {labelMap[cat]}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    className="pl-10 h-11 bg-white border-border/50 rounded-xl shadow-sm focus-visible:ring-primary/20"
                                    placeholder="Search products or SKU..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {filteredData.map((item: CatalogItem, i) => (
                                <ScrollReveal key={item.id} delay={i * 30}>
                                    <div className="group rounded-2xl overflow-hidden hover-lift border border-border/80 transition-all duration-500 shadow-sm hover:shadow-[var(--shadow-lg)] bg-white h-full cursor-pointer flex flex-col justify-center items-center">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                                            loading="lazy"
                                        />
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>

                        {filteredData.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-muted-foreground">No products found for "{search}".</p>
                            </div>
                        )}
                    </ScrollReveal>
                </div>
            </section>

            <ContactSection />
            <Footer />
        </div>
    );
}
