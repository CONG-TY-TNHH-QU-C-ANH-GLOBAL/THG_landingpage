import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";

const CHIP_KEYS = ["op.chip1", "op.chip2", "op.chip3", "op.chip4", "op.chip5", "op.chip6"];

/** Final conversion banner: gradient + chip-list of guarantees + a CTA to
 *  the catalog. CTA target is intentional (not the lead form) — visitors
 *  who scrolled this far have already seen the lead modal pitch upstream. */
export function OrderTrustCTA() {
  const { t } = useI18n();

  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">{t("op.trust_title")}</h2>
          <p className="text-white/75 mb-8 max-w-lg mx-auto">{t("op.trust_sub")}</p>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {CHIP_KEYS.map((ck) => (
              <span key={ck} className="bg-white/15 text-white px-4 py-1.5 rounded-full text-xs font-semibold border border-white/20">
                {t(ck)}
              </span>
            ))}
          </div>
          <Link to="/catalog">
            <Button className="bg-white text-primary hover:bg-white/90 rounded-full px-10 py-6 text-base font-bold shadow-lg hover:-translate-y-1 transition-all">
              🚀 {t("op.trust_cta")}
            </Button>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
