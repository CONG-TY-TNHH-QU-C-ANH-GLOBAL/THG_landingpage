import { useMemo } from "react";

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

    const groups = useMemo(() => {
        const partners = data?.partners ?? [];
        // Group by `tier` while preserving the operator's ordering: the first
        // time a tier appears fixes its place, so reordering rows in the admin
        // reorders the groups too. Untiered partners collect under one unlabelled
        // group rendered last.
        const byTier = new Map<string, CmsPartner[]>();
        for (const p of partners) {
            const key = p.tier?.trim() || "";
            const bucket = byTier.get(key);
            if (bucket) bucket.push(p);
            else byTier.set(key, [p]);
        }
        return [...byTier.entries()]
            .sort(([a], [b]) => (a === "" ? 1 : 0) - (b === "" ? 1 : 0))
            .map(([tier, items]) => ({ tier, items }));
    }, [data]);

    if (groups.length === 0) return null;

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

                <div className="max-w-5xl mx-auto space-y-8">
                    {groups.map(({ tier, items }) => (
                        <div key={tier || "_untiered"}>
                            {tier && (
                                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4 text-center">
                                    {tier}
                                </p>
                            )}
                            <div className="flex flex-wrap justify-center gap-4">
                                {items.map((p, i) => (
                                    <ScrollReveal key={p.id} delay={i * 60}>
                                        <PartnerCard partner={p} />
                                    </ScrollReveal>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

function PartnerCard({ partner }: Readonly<{ partner: CmsPartner }>) {
    const inner = (
        <div className="h-24 w-44 rounded-2xl border border-border/60 bg-white/70 backdrop-blur-sm flex items-center justify-center px-5 transition-all hover:border-primary/40 hover:shadow-elevated hover:-translate-y-0.5">
            {partner.logo_url ? (
                <img
                    src={partner.logo_url}
                    // The partner name IS the alt text — a logo with a decorative
                    // alt would leave a screen reader with an unnamed link.
                    alt={partner.name}
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
            aria-label={partner.name}
        >
            {inner}
        </a>
    );
}

export default PartnersSection;
