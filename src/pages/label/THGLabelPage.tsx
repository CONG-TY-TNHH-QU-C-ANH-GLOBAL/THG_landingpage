import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Boxes,
  Check,
  CheckCircle2,
  CircleCheck,
  CreditCard,
  Download,
  FileUp,
  Headset,
  KeyRound,
  Landmark,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
  Warehouse,
  Package,
  ShoppingCart,
  Star,
  Unplug,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import ContactSection from "@/components/ContactSection";
import FAQAccordion from "@/components/FAQAccordion";
import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";
import { LeadFormDialog } from "@/components/lead/LeadFormDialog";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { JsonLdBreadcrumb, JsonLdFaqPage, JsonLdService } from "@/components/seo/JsonLd";
import { SeoHead } from "@/components/seo/SeoHead";
import { ServiceVideoCard } from "@/components/service-pages/ServiceVideoCard";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import "@/lib/i18n/translations/label";
import { LabelSavingsCalculator } from "./_components/LabelSavingsCalculator";

const LABEL_VIDEO_ID = "ZrgtgB30vPQ";
const OG_IMAGE = "https://thgfulfill.com/label/seller-portal-labels.jpg";

const CARRIERS = [
  { id: "usps", name: "USPS", descKey: "label_page.car_usps" },
  { id: "ups", name: "UPS", descKey: "label_page.car_ups" },
  { id: "fedex", name: "FedEx", descKey: "label_page.car_fedex" },
  { id: "dhl", name: "DHL", descKey: "label_page.car_dhl" },
] as const;

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

const GOLD_BUTTON =
  "bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold-dark))] text-white border-0 shadow-[0_0_20px_rgba(201,162,86,0.3)] hover:shadow-[0_0_30px_rgba(201,162,86,0.5)] px-8 py-6 rounded-full font-bold text-base";

/** Opens the shared lead dialog pre-attributed to the Label service. */
function QuoteButton({ children, source, className = GOLD_BUTTON }: Readonly<{ children: ReactNode; source: string; className?: string }>) {
  return (
    <LeadFormDialog
      sourcePage={`/thg-label#${source}`}
      primaryService="label"
      surface="label-inline"
      trigger={<Button className={className}>{children}</Button>}
    />
  );
}

function Eyebrow({ children }: Readonly<{ children: ReactNode }>) {
  return <p className="text-sm font-semibold text-accent uppercase tracking-[0.2em] mb-3">{children}</p>;
}

function CheckList({ items }: Readonly<{ items: string[] }>) {
  return (
    <ul className="space-y-3 text-left">
      {items.map((text) => (
        <li key={text} className="flex items-start gap-3 text-navy/80">
          <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}

function IconCard({ icon: Icon, title, desc }: Readonly<{ icon: LucideIcon; title: string; desc: string }>) {
  return (
    <div className="glass-card rounded-2xl p-6 h-full">
      <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="text-base font-bold text-navy mb-2">{title}</h3>
      <p className="text-sm text-navy/70 leading-relaxed">{desc}</p>
    </div>
  );
}

/** A decorative 4x6 shipping label so the hero shows the product, not stock art. */
function LabelMock() {
  const { t } = useI18n();
  const chips = [
    { title: "PDF · ZPL", textKey: "label_page.chip_print", pos: "-top-3 -left-2 md:-left-8" },
    { title: "Tracking", textKey: "label_page.chip_track", pos: "top-1/3 -right-2 md:-right-8" },
    { title: "Import", textKey: "label_page.chip_import", pos: "bottom-6 -left-2 md:-left-10" },
    { title: "1–5%", textKey: "label_page.chip_save", pos: "-bottom-4 right-6" },
  ];
  return (
    <div className="relative mx-auto w-full max-w-sm py-6" aria-hidden="true">
      <div className="rotate-[-2deg] rounded-xl border-2 border-navy bg-white p-4 font-mono text-[11px] leading-snug text-navy shadow-2xl">
        <div className="flex items-start justify-between border-b-2 border-navy pb-2">
          <div>
            <div className="font-bold">USPS GROUND ADVANTAGE™</div>
            <div>4 x 6 THERMAL</div>
          </div>
          <div className="text-5xl font-black leading-none">G</div>
        </div>
        <div className="border-b border-navy/40 py-2">
          FROM: ACME STORE LLC
          <br />
          1200 SAMPLE AVE
          <br />
          HOUSTON TX 77002
        </div>
        <div className="py-3 text-sm font-bold">
          SHIP TO:
          <br />
          JANE SAMPLE
          <br />
          500 EXAMPLE ST APT 4
          <br />
          AUSTIN TX 78701
        </div>
        <div
          className="h-14 w-full"
          style={{
            background:
              "repeating-linear-gradient(90deg, hsl(220 25% 12%) 0 2px, transparent 2px 5px, hsl(220 25% 12%) 5px 6px, transparent 6px 9px)",
          }}
        />
        <div className="mt-1 text-center tracking-widest">9400 1XXX XXXX XXXX XXXX XX</div>
      </div>
      {chips.map((c) => (
        <div
          key={c.title}
          className={`absolute ${c.pos} rounded-xl border border-border/60 bg-card px-3 py-2 text-xs shadow-lg`}
        >
          <b className="block text-primary">{c.title}</b>
          <span className="text-navy/70">{t(c.textKey)}</span>
        </div>
      ))}
    </div>
  );
}

const PROBLEMS = [1, 2, 3] as const;
const STEPS = [1, 2, 3, 4] as const;
const FEATURES: { icon: LucideIcon; n: number }[] = [
  { icon: CircleCheck, n: 1 },
  { icon: CreditCard, n: 2 },
  { icon: FileUp, n: 3 },
  { icon: Star, n: 4 },
  { icon: Download, n: 5 },
  { icon: Search, n: 6 },
  { icon: ShoppingBag, n: 7 },
  { icon: KeyRound, n: 8 },
  { icon: Headset, n: 9 },
];
const GUARANTEES: { icon: LucideIcon; n: number }[] = [
  { icon: ShieldCheck, n: 1 },
  { icon: Unplug, n: 2 },
  { icon: RotateCcw, n: 3 },
  { icon: Landmark, n: 4 },
];
const TABS = ["portal", "import", "api"] as const;
type TabId = (typeof TABS)[number];

/** Hotspot position (% of the screenshot) + legend copy per numbered marker. */
const HOTSPOTS: { k: number; left: number; top: number; titleKey?: string; title?: string; descKey: string }[] = [
  { k: 1, left: 12.3, top: 10, titleKey: "label_page.leg1_t", descKey: "label_page.leg1_d" },
  { k: 2, left: 12.3, top: 38.6, titleKey: "label_page.leg2_t", descKey: "label_page.leg2_d" },
  { k: 3, left: 44, top: 12.1, title: "Buy Label · Import · Export", descKey: "label_page.leg3_d" },
  { k: 4, left: 37.5, top: 20.7, titleKey: "label_page.leg4_t", descKey: "label_page.leg4_d" },
  { k: 5, left: 51.5, top: 27.7, titleKey: "label_page.leg5_t", descKey: "label_page.leg5_d" },
  { k: 6, left: 77, top: 34.6, titleKey: "label_page.leg6_t", descKey: "label_page.leg6_d" },
  { k: 7, left: 93.5, top: 34.6, title: "Label · Cancel", descKey: "label_page.leg7_d" },
  { k: 8, left: 12.3, top: 81.2, title: "API & Webhooks · Shopify", descKey: "label_page.leg8_d" },
];

function HowItWorksTabs() {
  const { t } = useI18n();
  const [tab, setTab] = useState<TabId>("portal");
  const tabLabel: Record<TabId, string> = {
    portal: t("label_page.tab_portal"),
    import: t("label_page.tab_import"),
    api: t("label_page.tab_api"),
  };
  const bullets = (prefix: "p1" | "p2" | "p3") => range(3).map((n) => t(`label_page.${prefix}_b${n}`));
  const rows = [
    ["LBL60412", "Franklin, GA", "$4.49", "created"],
    ["LBL60398", "Syracuse, NY", "$4.65", "created"],
    ["LBL60371", "Tampa, FL", "$4.49", "failed"],
    ["LBL60350", "Tacoma, WA", "$4.96", "created"],
  ];

  return (
    <div className="max-w-5xl mx-auto mt-14">
      <div role="tablist" aria-label="Methods" className="mb-6 inline-flex rounded-full bg-secondary p-1">
        {TABS.map((id) => (
          <button
            key={id}
            role="tab"
            id={`label-tab-${id}`}
            aria-selected={tab === id}
            aria-controls={`label-panel-${id}`}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              tab === id ? "bg-navy text-white shadow" : "text-navy/70 hover:text-navy"
            }`}
          >
            {tabLabel[id]}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`label-panel-${tab}`}
        aria-labelledby={`label-tab-${tab}`}
        className="grid md:grid-cols-2 gap-8 items-start glass-card rounded-2xl p-6 md:p-8"
      >
        {tab === "portal" && (
          <>
            <div>
              <h3 className="text-2xl font-bold text-navy mb-4">{t("label_page.p1_title")}</h3>
              <CheckList items={bullets("p1")} />
              <Button asChild variant="outline" className="mt-6 rounded-full px-6 py-5 gap-2">
                <a href="#seller-portal">
                  {t("label_page.p1_cta")} <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </div>
            <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
              <div className="border-b border-border/60 px-4 py-2 text-xs font-medium text-navy/60">{t("label_page.p1_win")}</div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-navy/60">
                    <tr>
                      {["th_label", "th_recipient", "th_price", "th_status"].map((k) => (
                        <th key={k} className="px-4 py-2 font-semibold">
                          {t(`label_page.${k}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(([id, to, price, status]) => (
                      <tr key={id} className="border-t border-border/40">
                        <td className="px-4 py-2 font-mono">{id}</td>
                        <td className="px-4 py-2">{to}</td>
                        <td className="px-4 py-2 font-semibold">{price}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`rounded-full px-2 py-0.5 font-semibold ${
                              status === "created" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {t(`label_page.st_${status}`)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === "import" && (
          <>
            <div>
              <h3 className="text-2xl font-bold text-navy mb-4">{t("label_page.p2_title")}</h3>
              <CheckList items={bullets("p2")} />
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-4">
              <div className="rounded-lg border-2 border-dashed border-border px-4 py-8 text-center text-sm text-navy/60">
                {t("label_page.p2_drop")}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["your_order_no", "recipient", "address", "city", "state", "zip", "weight_oz", "carrier", "service"].map((c) => (
                  <code key={c} className="rounded bg-secondary px-2 py-1 text-[11px] text-navy">
                    {c}
                  </code>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "api" && (
          <>
            <div>
              <h3 className="text-2xl font-bold text-navy mb-4">{t("label_page.p3_title")}</h3>
              <CheckList items={bullets("p3")} />
            </div>
            <div className="rounded-xl bg-navy text-white overflow-hidden">
              <div className="border-b border-white/15 px-4 py-2 text-xs text-white/60">{t("label_page.p3_win")}</div>
              <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
                <span className="text-[hsl(var(--gold))]">POST</span>
                {` /v1/labels
{
  "carrier": "usps",
  "service": "ground_advantage",
  "your_order_no": "PP261105",
  "to": { "name": "Jane Sample", "zip": "78701" },
  "weight_oz": 12
}
`}
                <span className="text-[hsl(var(--gold))]">→</span>
                {` { "status": "created", "tracking": "9400 1XXX ..." }`}
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SellerPortalShowcase() {
  const { t } = useI18n();
  const [active, setActive] = useState<number | null>(null);
  const menus: { tag: string; title: string; body: ReactNode }[] = [
    { tag: "OVERVIEW", title: "Dashboard", body: null },
    { tag: "APPS", title: "Orders", body: "POD · Express · Warehouse · Labels · Dropship · Catalog · Seller SKU" },
    { tag: "BILLING", title: "Wallet", body: null },
    { tag: "SUPPORT", title: "Requests · To-do", body: "Trouble · Guide" },
    { tag: "ACCOUNT", title: "Account", body: "API & Webhooks · Shopify" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <p className="text-center text-sm font-semibold uppercase tracking-wider text-navy/60 mb-3">{t("label_page.shot_eyebrow")}</p>
      <div className="relative rounded-2xl overflow-hidden border border-border/60 shadow-xl bg-card">
        <img
          src="/label/seller-portal-labels.jpg"
          alt={t("label_page.shot_alt")}
          width={1830}
          height={895}
          loading="lazy"
          className="w-full h-auto block"
        />
        {HOTSPOTS.map((h) => (
          <span
            key={h.k}
            aria-hidden="true"
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white ring-2 ring-white transition-transform ${
              active === h.k ? "scale-150 bg-[hsl(var(--gold))]" : ""
            }`}
            style={{ left: `${h.left}%`, top: `${h.top}%` }}
          >
            {h.k}
          </span>
        ))}
      </div>

      <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {HOTSPOTS.map((h) => (
          <li
            key={h.k}
            onMouseEnter={() => setActive(h.k)}
            onMouseLeave={() => setActive(null)}
            className="flex gap-3 rounded-xl border border-border/50 bg-card p-4"
          >
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">{h.k}</span>
            <div>
              <b className="block text-sm text-navy">{h.titleKey ? t(h.titleKey) : h.title}</b>
              <span className="text-xs text-navy/70 leading-relaxed">{t(h.descKey)}</span>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {menus.map((m) => (
          <div key={m.tag} className="glass-card rounded-xl p-4">
            <span className="text-[10px] font-bold tracking-[0.18em] text-accent">{m.tag}</span>
            <h4 className="text-base font-bold text-navy mt-1">{m.title}</h4>
            {m.body && <p className="mt-1 text-xs text-navy/70 leading-relaxed">{m.body}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

const ECOSYSTEM: { id: string; name: string; href?: string; icon: LucideIcon; descKey: string }[] = [
  { id: "fulfill", name: "Fulfill", href: "/thg-fulfill", icon: Package, descKey: "label_page.eco_fulfill" },
  { id: "express", name: "Express", href: "/thg-express", icon: Truck, descKey: "label_page.eco_express" },
  { id: "warehouse", name: "Warehouse", href: "/thg-warehouse", icon: Warehouse, descKey: "label_page.eco_warehouse" },
  { id: "dropship", name: "Dropship", href: "/thg-order", icon: ShoppingCart, descKey: "label_page.eco_dropship" },
  { id: "label", name: "Label", icon: Tag, descKey: "label_page.eco_label" },
];

const TierLadder = () => {
  const { t } = useI18n();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 max-w-6xl mx-auto">
      {range(5).map((n) => {
        const best = n === 5;
        return (
          <div
            key={n}
            className={`rounded-2xl p-6 flex flex-col ${best ? "bg-navy text-white shadow-xl" : "glass-card"}`}
          >
            <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${best ? "text-[hsl(var(--gold))]" : "text-accent"}`}>
              {t("label_page.tier")} {n}
              {best ? ` · ${t("label_page.tier_best")}` : ""}
            </p>
            <p className="my-3 text-5xl font-extrabold tracking-tight">{n}%</p>
            <p className={`mb-5 text-sm leading-relaxed ${best ? "text-white/75" : "text-navy/70"}`}>{t(`label_page.tier${n}_d`)}</p>
            <div className="mt-auto">
              <QuoteButton
                source={`tier-${n}`}
                className={
                  best
                    ? GOLD_BUTTON
                    : "w-full rounded-full border border-border bg-transparent text-navy hover:bg-secondary shadow-none px-6 py-5 font-semibold"
                }
              >
                {best ? t("label_page.tier_cta_partner") : t("label_page.tier_cta")}
              </QuoteButton>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const THGLabelPage = () => {
  const { t, language } = useI18n();
  const faqs = range(9).map((n) => ({ question: t(`label_faq.q${n}`), answer: t(`label_faq.a${n}`) }));

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SeoHead title={t("seo.label_title")} description={t("seo.label_desc")} path="/thg-label" ogImage={OG_IMAGE} />
      <JsonLdService
        name="TH Group Label — USPS, UPS, FedEx, DHL Shipping Labels"
        description={t("seo.label_desc")}
        url="https://thgfulfill.com/thg-label"
      />
      <JsonLdFaqPage faqs={faqs} />
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://thgfulfill.com/" },
          { name: "TH Group Label", url: "https://thgfulfill.com/thg-label" },
        ]}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-20 bg-gradient-hero relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
          <div>
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-navy/70 mb-6">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                {t("label_page.badge")}
              </span>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h1 className="text-3xl md:text-5xl font-bold text-navy tracking-tight leading-tight mb-5">
                <span className="text-gradient-gold">{t("label_page.hero_hl")}</span> {t("label_page.hero_rest")}
              </h1>
              <p className="text-lg text-navy/70 leading-relaxed mb-6 max-w-xl">{t("label_page.hero_lead")}</p>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <CheckList items={range(4).map((n) => t(`label_page.check${n}`))} />
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <QuoteButton source="hero">
                  {t("label_page.cta_quote")} <ArrowRight className="ml-2 w-4 h-4" />
                </QuoteButton>
                <Button asChild variant="outline" className="rounded-full px-8 py-6 text-base font-semibold">
                  <a href="#seller-portal">{t("label_page.cta_portal")}</a>
                </Button>
              </div>
              <p className="mt-4 text-sm text-navy/60">{t("label_page.hero_micro")}</p>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={250} direction="right">
            <LabelMock />
          </ScrollReveal>
        </div>
      </section>

      {/* Carriers strip + stats */}
      <section className="py-14 bg-card border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 mb-10">
            <span className="text-sm font-medium text-navy/60">{t("label_page.strip")}</span>
            {CARRIERS.map((c) => (
              <img key={c.id} src={`/label/${c.id}.png`} alt={c.name} height={32} loading="lazy" className="h-8 w-auto object-contain" />
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              ["4", "label_page.stat1"],
              ["1–5%", "label_page.stat2"],
              ["100%", "label_page.stat3"],
              ["24h", "label_page.stat4"],
            ].map(([value, key]) => (
              <div key={key} className="rounded-xl bg-background border border-border/50 px-4 py-4 text-center">
                <b className="block text-3xl font-extrabold text-primary">{value}</b>
                <span className="text-xs text-navy/70">{t(key)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <SectionHeader className="mb-12" eyebrow={t("label_page.problem_eyebrow")} title={t("label_page.problem_title")} description={t("label_page.problem_sub")} />
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PROBLEMS.map((n, i) => (
              <ScrollReveal key={n} delay={i * 100}>
                <div className="glass-card rounded-2xl p-6 h-full">
                  <span className="font-mono text-sm font-bold text-accent">{String(n).padStart(2, "0")}</span>
                  <h3 className="text-lg font-bold text-navy mt-2 mb-2">{t(`label_page.problem${n}_t`)}</h3>
                  <p className="text-sm text-navy/70 leading-relaxed">{t(`label_page.problem${n}_d`)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 max-w-6xl items-center">
          <ScrollReveal>
            <ServiceVideoCard videoId={LABEL_VIDEO_ID} title={t("label_page.video_title_attr")} clickToPlay />
          </ScrollReveal>
          <ScrollReveal delay={150} direction="right">
            <div>
              <Eyebrow>{t("label_page.video_eyebrow")}</Eyebrow>
              <h2 className="text-2xl md:text-4xl font-bold text-navy tracking-tight mb-4">{t("label_page.video_title")}</h2>
              <p className="text-navy/70 leading-relaxed mb-6">{t("label_page.video_sub")}</p>
              <CheckList items={range(4).map((n) => t(`label_page.vlist${n}`))} />
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <QuoteButton source="video">
                  {t("label_page.cta_quote")} <ArrowRight className="ml-2 w-4 h-4" />
                </QuoteButton>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Savings calculator */}
      <section id="calc" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <SectionHeader className="mb-12" eyebrow={t("label_page.calc_eyebrow")} title={t("label_page.calc_title")} description={t("label_page.calc_sub")} />
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <LabelSavingsCalculator />
          </ScrollReveal>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <SectionHeader className="mb-12" eyebrow={t("label_page.how_eyebrow")} title={t("label_page.how_title")} description={t("label_page.how_sub")} />
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {STEPS.map((n, i) => (
              <ScrollReveal key={n} delay={i * 80}>
                <div className="glass-card rounded-2xl p-6 h-full">
                  <span className="font-mono text-xs font-bold tracking-widest text-accent">STEP {n}</span>
                  <h3 className="text-base font-bold text-navy mt-2 mb-2">{t(`label_page.step${n}_t`)}</h3>
                  <p className="text-sm text-navy/70 leading-relaxed">{t(`label_page.step${n}_d`)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <HowItWorksTabs />
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <SectionHeader className="mb-12" eyebrow={t("label_page.feat_eyebrow")} title={t("label_page.feat_title")} />
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {FEATURES.map((f, i) => (
              <ScrollReveal key={f.n} delay={(i % 3) * 80}>
                <IconCard icon={f.icon} title={t(`label_page.feat${f.n}_t`)} desc={t(`label_page.feat${f.n}_d`)} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Carriers */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <SectionHeader className="mb-12" eyebrow={t("label_page.car_eyebrow")} title={t("label_page.car_title")} description={t("label_page.car_sub")} />
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {CARRIERS.map((c, i) => (
              <ScrollReveal key={c.id} delay={i * 80}>
                <div className="glass-card rounded-2xl p-6 h-full text-center">
                  <div className="flex h-16 items-center justify-center mb-4">
                    <img src={`/label/${c.id}.png`} alt={c.name} height={48} loading="lazy" className="max-h-12 w-auto object-contain" />
                  </div>
                  <b className="block text-lg text-navy mb-1">{c.name}</b>
                  <p className="text-xs text-navy/70 leading-relaxed">{t(c.descKey)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-navy/60">{t("label_page.car_more")}</p>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <SectionHeader className="mb-12" eyebrow={t("label_page.who_eyebrow")} title={t("label_page.who_title")} />
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {[
              { title: "POD", descKey: "label_page.who1_d" },
              { title: "Dropship", descKey: "label_page.who2_d" },
              { title: "TikTok Shop · Etsy · eBay", descKey: "label_page.who3_d" },
              { title: t("label_page.who4_t"), descKey: "label_page.who4_d" },
            ].map((w, i) => (
              <ScrollReveal key={w.descKey} delay={i * 80}>
                <IconCard icon={i === 3 ? Boxes : CheckCircle2} title={w.title} desc={t(w.descKey)} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Seller Portal */}
      <section id="seller-portal" className="py-24 bg-card scroll-mt-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <SectionHeader className="mb-12" eyebrow="Seller Portal" title={t("label_page.portal_title")} description={t("label_page.portal_sub")} />
          </ScrollReveal>
          <SellerPortalShowcase />
          <div className="mt-10 text-center">
            <QuoteButton source="portal">
              {t("label_page.portal_cta")} <ArrowRight className="ml-2 w-4 h-4" />
            </QuoteButton>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <SectionHeader className="mb-12" eyebrow={t("label_page.gar_eyebrow")} title={t("label_page.gar_title")} />
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {GUARANTEES.map((g, i) => (
              <ScrollReveal key={g.n} delay={i * 80}>
                <IconCard icon={g.icon} title={t(`label_page.gar${g.n}_t`)} desc={t(`label_page.gar${g.n}_d`)} />
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-6 max-w-6xl mx-auto flex items-start gap-4 rounded-2xl border border-primary/30 bg-secondary/50 p-6">
            <ShieldCheck className="h-6 w-6 flex-shrink-0 text-primary" />
            <div>
              <b className="block text-navy">{t("label_page.seal_t")}</b>
              <p className="text-sm text-navy/70 leading-relaxed">{t("label_page.seal_d")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <SectionHeader className="mb-12" eyebrow={t("label_page.eco_eyebrow")} title={t("label_page.eco_title")} description={t("label_page.eco_sub")} />
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {ECOSYSTEM.map((s, i) => {
              const body = (
                <>
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-bold text-navy mb-1">
                    {s.name}
                    {!s.href && <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">{t("nav.badge_new")}</span>}
                  </h3>
                  <p className="text-xs text-navy/70 leading-relaxed mb-3 flex-1">{t(s.descKey)}</p>
                  <span className="text-xs font-semibold text-primary">
                    {s.href ? `${t("label_page.eco_more")} ↗` : t("label_page.eco_here")}
                  </span>
                </>
              );
              return (
                <ScrollReveal key={s.id} delay={i * 60}>
                  {s.href ? (
                    <Link to={`/${language}${s.href}`} className="glass-card rounded-2xl p-5 h-full flex flex-col hover-lift">
                      {body}
                    </Link>
                  ) : (
                    <div className="rounded-2xl p-5 h-full flex flex-col border-2 border-primary/50 bg-secondary/40">{body}</div>
                  )}
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-background scroll-mt-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <SectionHeader className="mb-12" eyebrow={t("label_page.price_eyebrow")} title={t("label_page.price_title")} description={t("label_page.price_sub")} />
          </ScrollReveal>
          <TierLadder />
          <p className="mt-8 text-center text-sm text-navy/60">{t("label_page.price_note")}</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <SectionHeader className="mb-12" eyebrow="FAQ" title={t("label_faq.title")} />
          </ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-3xl bg-navy px-6 py-12 text-center text-white md:px-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--gold))] mb-3">{t("label_page.final_eyebrow")}</p>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">{t("label_page.final_title")}</h2>
            <p className="text-white/75 mb-6">{t("label_page.final_sub")}</p>
            <ul className="mb-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/85">
              {range(3).map((n) => (
                <li key={n} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[hsl(var(--gold))]" strokeWidth={3} />
                  {t(`label_page.final${n}`)}
                </li>
              ))}
            </ul>
            <QuoteButton source="final">
              {t("label_page.cta_quote")} <ArrowRight className="ml-2 w-4 h-4" />
            </QuoteButton>
          </div>
        </div>
      </section>

      <ContactSection />

      <p className="container mx-auto px-4 py-8 text-center text-xs text-navy/50 leading-relaxed">{t("label_page.legal")}</p>
    </div>
  );
};

export default THGLabelPage;
