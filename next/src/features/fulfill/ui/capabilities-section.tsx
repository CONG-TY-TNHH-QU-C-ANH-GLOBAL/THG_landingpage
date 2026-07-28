// Capabilities section (WEB-002) — Server Component. A glass-panel bento of the capability
// groups. The Hub System panel carries STATIC explanatory copy about operational visibility —
// the prototype's fake live "unit status" ledger is intentionally omitted (no fabricated
// statuses, no implied real-time sync).
import type { ReactNode } from "react";
import { Globe, ScanLine, Package, LayoutGrid, Tag, Printer, MessageCircle } from "lucide-react";

import type { FulfillCopy, FulfillCapabilityCopy } from "../copy";
import styles from "./fulfill.module.css";

function Icon({ children, tone }: Readonly<{ children: ReactNode; tone: string }>) {
  return (
    <div
      className="w-12 h-12 rounded-2xl flex items-center justify-center"
      style={{ background: `color-mix(in srgb, ${tone} 12%, transparent)`, color: tone }}
    >
      {children}
    </div>
  );
}

function Card({
  cap,
  icon,
  className = "",
}: Readonly<{ cap: FulfillCapabilityCopy; icon: ReactNode; className?: string }>) {
  return (
    <div className={`${styles.glass} p-7 rounded-3xl flex flex-col justify-between gap-6 ${className}`}>
      {icon}
      <div>
        <h3 className="font-bold text-xl mb-2">{cap.title}</h3>
        <p className="text-sm" style={{ color: "var(--fx-gray)" }}>
          {cap.description}
        </p>
      </div>
    </div>
  );
}

export default function CapabilitiesSection({ copy }: Readonly<{ copy: FulfillCopy }>) {
  const c = copy.capabilities;
  return (
    <section
      id="capabilities"
      className="py-24 relative"
      style={{ background: "var(--fx-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-12">
          <span className={styles.sectionIndex}>{copy.capabilitiesEyebrow}</span>
          <h2 className="text-2xl md:text-3xl font-bold mt-4 mb-3">{copy.capabilitiesTitle}</h2>
          <p className="text-sm max-w-xl" style={{ color: "var(--fx-gray)" }}>
            {copy.capabilitiesIntro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card
            cap={c.network}
            className="md:col-span-2"
            icon={
              <Icon tone="#0066ff">
                <Globe className="w-6 h-6" aria-hidden="true" />
              </Icon>
            }
          />
          <Card
            cap={c.qc}
            icon={
              <Icon tone="#0891b2">
                <ScanLine className="w-6 h-6" aria-hidden="true" />
              </Icon>
            }
          />
          <Card
            cap={c.pack}
            icon={
              <Icon tone="#0a0a0b">
                <Package className="w-6 h-6" aria-hidden="true" />
              </Icon>
            }
          />

          {/* Hub System — static visibility explanation. */}
          <div className={`${styles.glass} md:col-span-2 rounded-3xl overflow-hidden flex flex-col md:flex-row`}>
            <div className="p-8 flex-1 flex flex-col justify-center gap-4">
              <Icon tone="#0066ff">
                <LayoutGrid className="w-6 h-6" aria-hidden="true" />
              </Icon>
              <div>
                <h3 className="font-bold text-2xl mb-2">{c.hub.title}</h3>
                <p className="text-sm max-w-sm" style={{ color: "var(--fx-gray)" }}>
                  {c.hub.description}
                </p>
              </div>
            </div>
            <div
              className={`${styles.mono} w-full md:w-[42%] p-6 text-[11px] leading-loose flex flex-col justify-center gap-2`}
              style={{ background: "var(--fx-ink)" }}
            >
              <div className="uppercase tracking-widest text-[8px] mb-1" style={{ color: "var(--fx-gray)" }}>
                {copy.hubCaption}
              </div>
              {copy.hubStages.map((stage) => (
                <div key={stage} className="flex justify-between text-gray-300">
                  <span>{stage}</span>
                  <span style={{ color: "var(--fx-cyan)" }}>—</span>
                </div>
              ))}
            </div>
          </div>

          <Card
            cap={c.intake}
            icon={
              <Icon tone="#0891b2">
                <Tag className="w-6 h-6" aria-hidden="true" />
              </Icon>
            }
          />
          <Card
            cap={c.print}
            icon={
              <Icon tone="#0066ff">
                <Printer className="w-6 h-6" aria-hidden="true" />
              </Icon>
            }
          />
          <Card
            cap={c.advisory}
            icon={
              <Icon tone="#0a0a0b">
                <MessageCircle className="w-6 h-6" aria-hidden="true" />
              </Icon>
            }
          />
        </div>
      </div>
    </section>
  );
}
