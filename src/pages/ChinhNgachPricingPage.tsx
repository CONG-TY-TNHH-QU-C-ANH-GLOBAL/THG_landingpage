import { Link } from "react-router-dom";
import { Ship, ArrowLeft, ArrowRight } from "lucide-react";

import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import ScrollReveal from "@/components/ScrollReveal";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";
import CnUsRateCard from "@/components/pricing/CnUsRateCard";
import { LeadFormDialog } from "@/components/lead/LeadFormDialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const ChinhNgachPricingPage = () => {
    const { t } = useI18n();

    return (
        <div className="min-h-screen bg-cream">
            <SeoHead
                title={t("seo.chinhngach_pricing_title")}
                description={t("seo.chinhngach_pricing_desc")}
                path="/chinh-ngach-pricing"
            />
            <JsonLdBreadcrumb
                items={[
                    { name: "Home", url: "https://thgfulfill.com/" },
                    { name: "Chinh Ngach Pricing", url: "https://thgfulfill.com/chinh-ngach-pricing" },
                ]}
            />
            <Navbar variant="darkHero" />

            {/* ══════════ HERO ══════════ */}
            <section className="pt-28 pb-10 md:pt-36 md:pb-14 bg-gradient-to-b from-navy via-navy/95 to-navy/85 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                </div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <ScrollReveal>
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                            <Ship className="w-4 h-4 text-primary" aria-hidden="true" />
                            <span className="text-sm text-white/80">{t("chinhngach.badge")}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            {t("chinhngach.title")}
                        </h1>
                        <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                            {t("chinhngach.subtitle")}
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            <main className="container mx-auto px-4 py-8 sm:py-10 max-w-5xl">
                <Link
                    to="/international-pricing"
                    className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-primary transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" /> {t("chinhngach.back_intl")}
                </Link>

                <div className="bg-[#FFF8E7] border border-primary/30 rounded-xl p-4 sm:p-5 mb-8">
                    <p className="text-[13px] text-navy leading-relaxed">{t("chinhngach.scope_notice")}</p>
                </div>

                <ScrollReveal><CnUsRateCard /></ScrollReveal>

                {/* ══════════ CTA ══════════ */}
                <ScrollReveal>
                    <div className="bg-gradient-to-br from-navy to-navy/85 rounded-2xl p-8 text-center">
                        <h2 className="text-white text-xl sm:text-2xl font-black mb-2">{t("chinhngach.cta_title")}</h2>
                        <p className="text-white/70 text-[14px] mb-6 max-w-xl mx-auto">{t("chinhngach.cta_desc")}</p>
                        <LeadFormDialog
                            sourcePage="/chinh-ngach-pricing#cta"
                            trigger={
                                <Button className="bg-primary hover:bg-gold-dark text-white rounded-full px-8 py-6 text-base font-bold shadow-lg transition-transform hover:-translate-y-1">
                                    {t("chinhngach.cta_btn")} <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                                </Button>
                            }
                        />
                    </div>
                </ScrollReveal>
            </main>

            <ContactSection />
        </div>
    );
};

export default ChinhNgachPricingPage;
