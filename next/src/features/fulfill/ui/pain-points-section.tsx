// Seller-challenge chapter (R3 content parity) — Server Component adapter.
//
// Restores the Vite page's "pain points" section, which the Next migration had dropped: the four
// challenges that motivate the whole service story, so the page reads problem → solution instead
// of opening on capabilities with nothing to answer. Copy is ported verbatim from the Vite
// production dictionary; nothing here is new marketing.
//
// Presentation reuses the R2 ServiceFeatureGrid rather than a bespoke card: the pain number maps
// to the grid's `metric` slot and the grid keeps the shared card anatomy, spacing and bento
// rhythm. Four cards need a fourth column at `lg`, which the grid's className hook provides.
import { Truck, Wallet, LayoutGrid, Gauge } from "lucide-react";

import { ServiceFeatureGrid, ServiceSectionHeader, type ServiceFeature } from "@/shared/service";
import type { FulfillCopy } from "../localized-content";

/** One glyph per challenge, in registry order (shipping, cost, system, control). */
const PAIN_ICONS = [
  <Truck key="ship" className="w-6 h-6" aria-hidden="true" />,
  <Wallet key="cost" className="w-6 h-6" aria-hidden="true" />,
  <LayoutGrid key="system" className="w-6 h-6" aria-hidden="true" />,
  <Gauge key="control" className="w-6 h-6" aria-hidden="true" />,
];

export default function PainPointsSection({ copy }: Readonly<{ copy: FulfillCopy }>) {
  const features: ServiceFeature[] = copy.pains.map((pain, i) => ({
    id: `pain-${pain.num}`,
    metric: pain.num,
    title: pain.title,
    description: pain.description,
    icon: PAIN_ICONS[i],
  }));

  return (
    <section id="challenges" className="py-24 bg-white border-t" style={{ borderColor: "var(--fx-border)" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <ServiceSectionHeader
          eyebrow={copy.painEyebrow}
          title={copy.painTitle}
          size="lg"
          className="mb-12"
        />
        <ServiceFeatureGrid features={features} rowClassName="" className="lg:grid-cols-4" />
      </div>
    </section>
  );
}
