// R3 content-parity chapters — Server Components, no client JS.
//
// These restore the Vite page's remaining business sections. Presentation is rebuilt on the R2
// shared template (ServiceSectionHeader / ServiceFeatureGrid / ServiceVideo); copy comes from
// parity-content.ts, ported verbatim. Nothing here invents content.
import Link from "next/link";
import { ArrowRight, ExternalLink, FileSpreadsheet } from "lucide-react";

import { ServiceSectionHeader, ServiceVideo } from "@/shared/service";
import type { Locale } from "@/shared/i18n";
import type { FulfillParityCopy } from "../parity-content";
import styles from "./fulfill.module.css";

/** Approved production asset used by the Vite advantage block. */
const ECOSYSTEM_IMAGE =
  "https://w.ladicdn.com/s750x750/67e69e24e8a7ba001127c80a/img_9873-20250801074610-q-tfu.jpg";
/** Video ids ported verbatim from the Vite page. */
const INTRO_VIDEO_ID = "2VEEFotO42I";
const ECOUNT_VIDEO_ID = "AzlW2irPANQ";
const SKU_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1CE_mzKMyfFK93iS1Dm8Sk9-zijjsxdKRO786EweoCUI/edit?gid=0#gid=0";
const HUB_URL = "https://hub.thgfulfill.com";

/** Solution chapter: the two POD advantages, each paired with its proof (a photo, then a film). */
export function SolutionSection({ copy }: Readonly<{ copy: FulfillParityCopy }>) {
  const [ecosystem, transparent] = copy.advantages;
  return (
    <section id="solution" className="py-24 bg-white border-t" style={{ borderColor: "var(--fx-border)" }}>
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <ServiceSectionHeader
          eyebrow={copy.solutionEyebrow}
          title={copy.solutionTitle}
          intro={copy.solutionIntro}
          size="lg"
          className="mb-14"
        />

        <div className="space-y-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">{ecosystem.title}</h3>
              <p className="leading-relaxed" style={{ color: "var(--fx-gray)" }}>
                {ecosystem.description}
              </p>
            </div>
            {/* Remote CMS-hosted asset served by the approved production CDN. Plain lazy <img>
                rather than next/image on purpose: next/image would require adding the host to
                next.config remotePatterns, and this sprint does not change build config. */}
            <div
              className="relative h-64 rounded-2xl overflow-hidden border shadow-lg"
              style={{ borderColor: "var(--fx-border)" }}
            >
              <img
                src={ECOSYSTEM_IMAGE}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <ServiceVideo
              videoId={INTRO_VIDEO_ID}
              title="THG Fulfill Introduction"
              className="order-2 lg:order-1"
            />
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl font-bold mb-4 tracking-tight">{transparent.title}</h3>
              <p className="leading-relaxed" style={{ color: "var(--fx-gray)" }}>
                {transparent.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Chapter I of the system guide: the order-placement film plus the SKU reference sheet. */
export function EcountGuideSection({ copy }: Readonly<{ copy: FulfillParityCopy }>) {
  return (
    <section id="order-guide" className="py-24" style={{ background: "var(--fx-bg)" }}>
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <ServiceSectionHeader
          eyebrow={copy.ecountEyebrow}
          title={copy.ecountTitle}
          intro={copy.ecountIntro}
          introClassName="max-w-2xl"
          className="mb-12"
        />
        <ServiceVideo
          videoId={ECOUNT_VIDEO_ID}
          title={copy.ecountTitle}
          className="max-w-3xl mx-auto"
        />
        <div className="mt-8 flex justify-center">
          <a
            href={SKU_SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--fx-blue)" }}
          >
            <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
            {copy.ecountSkuLink}
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

/** Chapter II: the six-part Hub System walkthrough. Rendered as an ordered document rather than
 *  the Vite sidebar+panel widget — same six sections, same text, no client state, and every
 *  section is reachable and printable instead of hidden behind a tab. */
export function HubGuideSection({ copy }: Readonly<{ copy: FulfillParityCopy }>) {
  return (
    <section id="hub-guide" className="py-24 bg-white border-t" style={{ borderColor: "var(--fx-border)" }}>
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <ServiceSectionHeader
          eyebrow={copy.hubEyebrow}
          title={copy.hubHeading}
          size="lg"
          className="mb-4"
        />
        <p className="mb-10 text-sm" style={{ color: "var(--fx-gray)" }}>
          {copy.hubIntro}{" "}
          <a
            href={HUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-4"
            style={{ color: "var(--fx-blue)" }}
          >
            hub.thgfulfill.com
          </a>
        </p>

        {/* Contents — real in-page anchors, so the list is navigable by keyboard and linkable. */}
        <nav aria-label={copy.hubToc} className="mb-12">
          <p
            className={`${styles.mono} text-[10px] uppercase tracking-widest mb-3`}
            style={{ color: "var(--fx-gray)" }}
          >
            {copy.hubToc}
          </p>
          <ol className="grid gap-2 sm:grid-cols-2 list-none p-0 m-0">
            {copy.hubSections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#hub-${s.id}`}
                  className="text-sm font-medium underline-offset-4 hover:underline"
                  style={{ color: "var(--fx-blue)" }}
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-12">
          {copy.hubSections.map((s) => (
            <article key={s.id} id={`hub-${s.id}`} className="scroll-mt-28">
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--fx-gray)" }}>
                {s.intro}
              </p>

              {s.facts.length > 0 ? (
                <dl className="grid gap-3 sm:grid-cols-2 mb-4">
                  {s.facts.map((f) => (
                    <div
                      key={f.label}
                      className="rounded-2xl border p-4"
                      style={{ borderColor: "var(--fx-border)" }}
                    >
                      <dt className="font-semibold text-sm mb-1">{f.label}</dt>
                      <dd className="text-sm" style={{ color: "var(--fx-gray)" }}>
                        {f.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {s.bullets.length > 0 ? (
                <ul className="space-y-2 list-none p-0">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm" style={{ color: "var(--fx-gray)" }}>
                      <span
                        aria-hidden="true"
                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: "var(--fx-blue)" }}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The two closing CTAs: try the Hub, and read the fulfillment policy. */
export function ParityCtaSections({
  lang,
  copy,
}: Readonly<{ lang: Locale; copy: FulfillParityCopy }>) {
  return (
    <section id="hub-cta" className="py-20" style={{ background: "var(--fx-bg)" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12 grid gap-6 lg:grid-cols-2">
        <div
          className="relative overflow-hidden rounded-3xl p-10 flex flex-col justify-between gap-8"
          style={{ background: "var(--fx-ink)" }}
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
              {copy.hubCtaTitle}
            </h2>
            <p className="text-white/70 leading-relaxed">{copy.hubCtaDesc}</p>
          </div>
          <a
            href={HUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start rounded-xl px-6 py-3 font-bold text-white transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--fx-blue)" }}
          >
            {copy.hubCtaLabel}
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>

        <div
          className="relative overflow-hidden rounded-3xl p-10 flex flex-col justify-between gap-8 border bg-white"
          style={{ borderColor: "var(--fx-border)" }}
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
              {copy.policyTitle}
            </h2>
            <p className="leading-relaxed" style={{ color: "var(--fx-gray)" }}>
              {copy.policyDesc}
            </p>
          </div>
          <Link
            prefetch={false}
            href={`/${lang}/policy`}
            className="inline-flex items-center gap-2 self-start rounded-xl border px-6 py-3 font-bold transition-transform hover:-translate-y-0.5"
            style={{ borderColor: "var(--fx-ink)" }}
          >
            {copy.policyCta}
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
