// Capabilities section (WEB-002, R2) — Server Component adapter over the shared bento grid.
//
// The seven capability groups become generic feature cards and the Hub System becomes a
// ServiceIntegrationFlow cell: the systems the work travels through are presented as an ordered
// pipeline rather than a static panel, which is the "ecosystem, not a logo list" shape every
// service page reuses. Card order, spans and icon tones are this route's editorial choices and
// stay here; the layout and card anatomy are shared.
//
// The Hub rail carries STATIC explanatory copy about operational visibility — no live order data
// and no fabricated statuses.
import { Globe, ScanLine, Package, LayoutGrid, Tag, Printer, MessageCircle } from "lucide-react";

import {
  ServiceFeatureGrid,
  ServiceIntegrationFlow,
  ServiceSectionHeader,
  type ServiceFeature,
} from "@/shared/service";
import type { FulfillCopy } from "../localized-content";

const TONE = { blue: "#0066ff", cyan: "#0891b2", ink: "#0a0a0b" } as const;

export default function CapabilitiesSection({ copy }: Readonly<{ copy: FulfillCopy }>) {
  const c = copy.capabilities;

  const features: ServiceFeature[] = [
    {
      id: "network",
      title: c.network.title,
      description: c.network.description,
      span: "wide",
      tone: TONE.blue,
      icon: <Globe className="w-6 h-6" aria-hidden="true" />,
    },
    {
      id: "qc",
      title: c.qc.title,
      description: c.qc.description,
      tone: TONE.cyan,
      icon: <ScanLine className="w-6 h-6" aria-hidden="true" />,
    },
    {
      id: "pack",
      title: c.pack.title,
      description: c.pack.description,
      tone: TONE.ink,
      icon: <Package className="w-6 h-6" aria-hidden="true" />,
    },
    {
      id: "hub",
      title: c.hub.title,
      description: c.hub.description,
      span: "wide",
      node: (
        <ServiceIntegrationFlow
          title={c.hub.title}
          description={c.hub.description}
          caption={copy.hubCaption}
          stages={copy.hubStages.map((label, i) => ({ id: `stage-${i}`, label }))}
          icon={<LayoutGrid className="w-6 h-6" aria-hidden="true" />}
        />
      ),
    },
    {
      id: "intake",
      title: c.intake.title,
      description: c.intake.description,
      tone: TONE.cyan,
      icon: <Tag className="w-6 h-6" aria-hidden="true" />,
    },
    {
      id: "print",
      title: c.print.title,
      description: c.print.description,
      tone: TONE.blue,
      icon: <Printer className="w-6 h-6" aria-hidden="true" />,
    },
    {
      id: "advisory",
      title: c.advisory.title,
      description: c.advisory.description,
      tone: TONE.ink,
      icon: <MessageCircle className="w-6 h-6" aria-hidden="true" />,
    },
  ];

  return (
    <section id="capabilities" className="py-24 relative" style={{ background: "var(--fx-bg)" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <ServiceSectionHeader
          eyebrow={copy.capabilitiesEyebrow}
          title={copy.capabilitiesTitle}
          intro={copy.capabilitiesIntro}
          className="mb-12"
        />
        <ServiceFeatureGrid features={features} />
      </div>
    </section>
  );
}
