// Hero-to-body handoff strip (Open Design artifact "PROOF STRIP") — only factual,
// already-established summary lines; no counts, times, or claims beyond what the
// production copy above the fold already states. Server Component, no island.
import { Globe2, Layers, Boxes } from "lucide-react";

import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";

const ITEMS = [
  { icon: Globe2, key: "proof.item1" },
  { icon: Layers, key: "proof.item2" },
  { icon: Boxes, key: "proof.item3" },
] as const;

const ProofStripSection = ({ copy }: Readonly<{ copy: MarketingCopy }>) => {
  const t = tFrom(copy);
  return (
    <section aria-label={t("proof.item2")} className="bg-card border-y border-border" data-testid="proof-strip">
      <div className="container mx-auto px-4 py-5 flex flex-wrap items-center justify-between gap-x-7 gap-y-3">
        {ITEMS.map(({ icon: Icon, key }) => (
          <div key={key} className="flex items-center gap-2.5 text-[13px] font-semibold text-muted-foreground">
            <Icon className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
            {t(key)}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProofStripSection;
