// Regional coverage (Open Design artifact "REGIONAL COVERAGE") — navy feature strip
// with the five network regions. Roles are neutral, derived from verified production
// claims only (hero.badge "4 warehouses in 3 countries", adv.a3 VN/CN/US warehouses,
// nav.express_desc VN/CN → US/UK/EU): UK/EU are labelled shipping destinations, not
// warehouse locations. Server Component, no island.
import ScrollReveal from "@/shared/ui/scroll-reveal";
import { SectionHeader } from "@/shared/ui/section-header";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";

const REGIONS = [1, 2, 3, 4, 5] as const;

const CoverageSection = ({ copy }: Readonly<{ copy: MarketingCopy }>) => {
  const t = tFrom(copy);
  return (
    <section id="coverage" className="py-28 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <SectionHeader
            align="left"
            className="mb-10 max-w-2xl"
            eyebrow={t("coverage.eyebrow")}
            title={t("coverage.title")}
          />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div className="relative bg-gradient-dark text-white rounded-2xl p-7 md:p-11 overflow-hidden">
            {/* cartographic dot texture on navy */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--gold-light)) 1px, transparent 0)",
                backgroundSize: "26px 26px",
              }}
            />
            <ul className="relative z-10 grid grid-cols-2 lg:grid-cols-5 gap-4 list-none m-0 p-0">
              {REGIONS.map((i) => (
                <li key={i} className="border border-white/15 rounded-xl px-4 py-4 bg-white/[0.03]">
                  <span
                    className="block w-2 h-2 rounded-full bg-[hsl(var(--gold-light))] mb-2.5"
                    style={{ boxShadow: "0 0 0 4px hsl(var(--gold-light) / 0.18)" }}
                    aria-hidden="true"
                  />
                  <b className="block text-sm font-semibold">{t(`coverage.r${i}_name`)}</b>
                  <span className="block text-xs text-white/60 mt-1">{t(`coverage.r${i}_role`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CoverageSection;
