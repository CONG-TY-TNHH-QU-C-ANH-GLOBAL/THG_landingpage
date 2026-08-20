import { Link } from "react-router-dom";
import { Ship, Plane, FileCheck, ArrowLeft, ArrowRight } from "lucide-react";

import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import ScrollReveal from "@/components/ScrollReveal";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";
import { CmsRateTable, CmsMetaList } from "@/components/pricing/CmsRateTable";
import { LeadFormDialog } from "@/components/lead/LeadFormDialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

/** Rate-card slugs seeded by CMS migration 0042. Every one is read through the
 *  same schema-driven renderer, so column changes made in the Rate Card Builder
 *  reach this page without a deploy. */
const SLUGS = {
    matsonLcl: "chinhNgachMatsonLcl",
    matsonSurcharge: "chinhNgachMatsonSurcharge",
    matsonFcl: "chinhNgachMatsonFcl",
    seaLcl: "chinhNgachSeaLcl",
    seaFcl: "chinhNgachSeaFcl",
    air: "chinhNgachAir",
    customs: "chinhNgachCustoms",
    meta: "chinhNgachMeta",
} as const;

const MATSON_META = ["matson_etd", "matson_cutoff", "matson_transit_port", "matson_transit_inland", "matson_transit_total", "cfs_haiphong", "cfs_hochiminh", "cfs_us", "excl_matson"] as const;
const SEA_META = ["sea_thuong_cutoff", "excl_sea_lcl", "excl_sea_fcl"] as const;
const AIR_META = ["excl_air"] as const;
const VALIDITY_META = ["validity"] as const;

function SectionHeading({ icon: Icon, title, subtitle }: Readonly<{
    icon: typeof Ship; title: string; subtitle?: string;
}>) {
    return (
        <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <div>
                <h2 className="text-xl sm:text-2xl font-black text-navy">{title}</h2>
                {subtitle && <p className="text-[13px] text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
        </div>
    );
}

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

                {/* ══════════ MATSON ══════════ */}
                <ScrollReveal>
                    <section className="mb-12">
                        <SectionHeading icon={Ship} title={t("chinhngach.matson_title")} subtitle={t("chinhngach.matson_subtitle")} />
                        <div className="space-y-4">
                            <CmsMetaList slug={SLUGS.meta} keys={MATSON_META} />
                            <CmsRateTable slug={SLUGS.matsonLcl} />
                            <CmsRateTable slug={SLUGS.matsonSurcharge} />
                            <CmsRateTable slug={SLUGS.matsonFcl} />
                            <CmsMetaList slug={SLUGS.meta} keys={VALIDITY_META} />
                        </div>
                    </section>
                </ScrollReveal>

                {/* ══════════ SEA THƯỜNG ══════════ */}
                <ScrollReveal>
                    <section className="mb-12">
                        <SectionHeading icon={Ship} title={t("chinhngach.sea_title")} subtitle={t("chinhngach.sea_subtitle")} />
                        <div className="space-y-4">
                            <CmsRateTable slug={SLUGS.seaLcl} />
                            <CmsRateTable slug={SLUGS.seaFcl} />
                            <CmsMetaList slug={SLUGS.meta} keys={SEA_META} />
                        </div>
                    </section>
                </ScrollReveal>

                {/* ══════════ AIR ══════════ */}
                <ScrollReveal>
                    <section className="mb-12">
                        <SectionHeading icon={Plane} title={t("chinhngach.air_title")} subtitle={t("chinhngach.air_subtitle")} />
                        <div className="space-y-4">
                            <CmsRateTable slug={SLUGS.air} />
                            <CmsMetaList slug={SLUGS.meta} keys={AIR_META} />
                        </div>
                    </section>
                </ScrollReveal>

                {/* ══════════ HẢI QUAN ══════════ */}
                <ScrollReveal>
                    <section className="mb-12">
                        <SectionHeading icon={FileCheck} title={t("chinhngach.customs_title")} subtitle={t("chinhngach.customs_subtitle")} />
                        <CmsRateTable slug={SLUGS.customs} />
                    </section>
                </ScrollReveal>

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
