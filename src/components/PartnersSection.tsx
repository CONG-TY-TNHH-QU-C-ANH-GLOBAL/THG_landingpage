import { useCmsPartners } from "@/hooks/useCmsContent";
import { useI18n } from "@/lib/i18n";
import ScrollReveal from "@/components/ScrollReveal";
import { SectionHeader } from "@/components/sections/SectionHeader";
import type { CmsPartner } from "@/lib/cmsSchemas";

/**
 * Business partners, distinct from the integrations strip below it. Integrations
 * claims THG syncs with a platform; this claims a working relationship with a
 * company, so the CMS keeps them in separate tables with separate publishing.
 *
 * THE SECTION DISAPPEARS WHEN THERE IS NOTHING TO SHOW. The CMS filters drafts
 * server-side, so an unapproved partner never reaches the browser — and until
 * someone publishes the first row, rendering an empty "our partners" heading
 * would be worse than rendering nothing. It also lets this ship before the CMS
 * endpoint exists: an unreachable /partners resolves to no data, and the
 * homepage looks exactly as it does today.
 */
const PartnersSection = () => {
    const { tVi } = useI18n();
    const { data } = useCmsPartners();
    const partners = data?.partners ?? [];

    if (partners.length === 0) return null;

    // One visual run must be wider than a normal desktop viewport; otherwise a
    // short partner list leaves a blank gap before the duplicate run arrives.
    // Repeating to at least 12 cards keeps the marquee continuous while still
    // letting a future long CMS list render only once per run.
    const repeatsPerRun = Math.max(1, Math.ceil(12 / partners.length));
    const marqueePartners = Array.from({ length: repeatsPerRun }, () => partners).flat();

    return (
        <section className="py-20 bg-background relative overflow-hidden">
            <div className="section-divider absolute top-0 left-0 right-0" />
            <div className="container mx-auto px-4 relative z-10">
                <ScrollReveal>
                    <SectionHeader
                        size="lg"
                        eyebrow={tVi("partners.eyebrow")}
                        title={tVi("partners.title")}
                        titleHighlight={tVi("partners.title_highlight")}
                    />
                    <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto -mt-4 mb-10">
                        {tVi("partners.desc")}
                    </p>
                </ScrollReveal>

                <ScrollReveal>
                    <div className="w-full overflow-hidden py-2">
                        <div
                            className="partners-marquee-track flex w-max will-change-transform hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
                            style={{ animation: "partners-marquee-right 38s linear infinite" }}
                        >
                            {[0, 1].map((run) => (
                                <div
                                    key={run}
                                    className="flex shrink-0 gap-4 pr-4 sm:gap-5 sm:pr-5"
                                    aria-hidden={run === 0 || undefined}
                                >
                                    {marqueePartners.map((partner, index) => (
                                        <PartnerCard
                                            key={`${run}-${index}-${partner.id}`}
                                            partner={partner}
                                            decorative={run === 0 || index >= partners.length}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>
            </div>
            <style>{`
                @keyframes partners-marquee-right {
                    from { transform: translateX(-50%); }
                    to { transform: translateX(0); }
                }
                @media (prefers-reduced-motion: reduce) {
                    .partners-marquee-track {
                        animation: none !important;
                        transform: translateX(-50%);
                    }
                }
            `}</style>
        </section>
    );
};

function PartnerCard({
    partner,
    decorative = false,
}: Readonly<{ partner: CmsPartner; decorative?: boolean }>) {
    const inner = (
        <div
            className="flex h-24 w-40 items-center justify-center rounded-2xl border border-border/60 bg-white/70 px-4 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated sm:w-44 sm:px-5"
            aria-hidden={decorative || undefined}
        >
            {partner.logo_url ? (
                <img
                    src={partner.logo_url}
                    // The partner name IS the alt text — a logo with a decorative
                    // alt would leave a screen reader with an unnamed link.
                    alt={decorative ? "" : partner.name}
                    loading="lazy"
                    className="max-h-12 max-w-full object-contain"
                />
            ) : (
                <span className="text-sm font-bold text-navy text-center leading-tight">{partner.name}</span>
            )}
        </div>
    );

    if (!partner.url) return inner;
    return (
        <a
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            // Partner sites are third-party destinations the operator entered;
            // noopener keeps them off window.opener.
            aria-label={decorative ? undefined : partner.name}
            aria-hidden={decorative || undefined}
            tabIndex={decorative ? -1 : undefined}
        >
            {inner}
        </a>
    );
}

export default PartnersSection;
