// HUB System Guide — section II of the Fulfill page (sidebar nav + 6 content
// sections walking sellers through hub.thgfulfill.com). Fulfill-specific:
// moved out of THGFulfillPage.tsx for page-file size, not for reuse.
// Sections are a data table rendered by one body component so no two section
// definitions share a duplicated code shape.

import React from "react";
import {
  LayoutDashboard,
  PackageCheck,
  BookOpen,
  Wallet,
  Headphones,
  UserCog,
  Menu,
  X as XIcon,
} from "lucide-react";

import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const INTRO_CLASS = "text-muted-foreground leading-relaxed mb-4";
const NAV_ACTIVE_CLASS = "bg-primary/10 text-primary font-semibold";

/** [literal product label, i18n key of its description] */
type HubItem = [label: string, descKey: string];

interface HubSectionDef {
  id: string;
  icon: React.ElementType;
  titleKey: string;
  /** Plain intro paragraph; the dashboard section renders its own instead. */
  introKey?: string;
  /** "Label: description" rows. Labels stay literal — they appear in English inside the Hub product UI. */
  items?: HubItem[];
  /** Dot-bulleted rows (i18n keys). */
  bullets?: string[];
}

const HUB_SECTIONS: HubSectionDef[] = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    titleKey: "hub.s1_title",
    items: [
      ["Wallet Balance", "hub.s1_wallet_desc"],
      ["Total Orders", "hub.s1_orders_desc"],
      ["In Process", "hub.s1_inprocess_desc"],
      ["Revenue", "hub.s1_revenue_desc"],
    ],
  },
  {
    id: "orders",
    icon: PackageCheck,
    titleKey: "hub.s2_title",
    introKey: "hub.s2_p1",
    bullets: ["hub.s2_li1", "hub.s2_li2"],
  },
  { id: "catalog", icon: BookOpen, titleKey: "hub.s3_title", introKey: "hub.s3_p1" },
  {
    id: "billing",
    icon: Wallet,
    titleKey: "hub.s4_title",
    introKey: "hub.s4_p1",
    items: [
      ["Wallet", "hub.s4_wallet_desc"],
      ["Top-up", "hub.s4_topup_desc"],
      ["Transaction", "hub.s4_transaction_desc"],
    ],
  },
  {
    id: "support",
    icon: Headphones,
    titleKey: "hub.s5_title",
    introKey: "hub.s5_p1",
    items: [
      ["Request", "hub.s5_request_desc"],
      ["Trouble", "hub.s5_trouble_desc"],
    ],
  },
  {
    id: "account",
    icon: UserCog,
    titleKey: "hub.s6_title",
    introKey: "hub.s6_p1",
    items: [
      ["Account Setting", "hub.s6_account_desc"],
      ["Team Member", "hub.s6_team_desc"],
    ],
  },
];

/** Hub link rendered inline inside localized copy. */
const HubLink = () => (
  <a
    href="https://hub.thgfulfill.com"
    target="_blank"
    rel="noopener noreferrer"
    className="text-primary font-semibold hover:underline"
  >
    hub.thgfulfill.com
  </a>
);

/** One section's body, driven entirely by its HubSectionDef. */
const HubSectionBody = ({ def }: Readonly<{ def: HubSectionDef }>) => {
  const { t } = useI18n();
  const isDashboard = def.id === "dashboard";
  return (
    <>
      {isDashboard && (
        <p className={INTRO_CLASS}>
          {t("hub.s1_p1a")}
          <HubLink />
          {t("hub.s1_p1b")}
        </p>
      )}
      {def.introKey && <p className={INTRO_CLASS}>{t(def.introKey)}</p>}
      {def.items && (
        <ul className={cn("space-y-2", isDashboard && "mb-4")}>
          {def.items.map(([label, descKey]) => (
            <li key={label} className="flex gap-2 text-sm">
              <span className="font-semibold text-navy whitespace-nowrap">{label}:</span>
              <span className="text-muted-foreground">{t(descKey)}</span>
            </li>
          ))}
        </ul>
      )}
      {def.bullets && (
        <ul className="space-y-3">
          {def.bullets.map((key) => (
            <li key={key} className="flex gap-3 text-sm">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span className="text-muted-foreground">{t(key)}</span>
            </li>
          ))}
        </ul>
      )}
      {isDashboard && (
        <p className="text-sm text-muted-foreground leading-relaxed">{t("hub.s1_p2")}</p>
      )}
    </>
  );
};

const stripNumber = (title: string) => title.replace(/^\d+\.\s/, "");

export function FulfillHubSystemGuide() {
  const { t } = useI18n();
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState("dashboard");

  const handleNav = (id: string) => {
    setActive(id);
    setOpen(false);
    const el = document.getElementById(`hub-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // One nav renderer for both the desktop sidebar and the mobile dropdown;
  // only paddings, the active border, and title numbering differ.
  const renderNavItems = (mobile: boolean) =>
    HUB_SECTIONS.map((s) => {
      const title = t(s.titleKey);
      return (
        <button
          key={s.id}
          onClick={() => handleNav(s.id)}
          className={cn(
            "w-full flex items-center gap-2.5 px-4 text-left text-sm transition-colors",
            mobile ? "py-3" : "py-2.5",
            active === s.id
              ? cn(NAV_ACTIVE_CLASS, !mobile && "border-l-2 border-primary")
              : cn("text-muted-foreground hover:bg-secondary/60", !mobile && "hover:text-foreground"),
          )}
        >
          <s.icon className="w-4 h-4 flex-shrink-0" />
          <span className="leading-tight">{mobile ? title : stripNumber(title)}</span>
        </button>
      );
    });

  const activeTitle = HUB_SECTIONS.find((s) => s.id === active)?.titleKey;

  return (
    <section className="py-24 bg-card border-t border-border/50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">{t("hub.eyebrow")}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">
              II. <span className="text-gradient-gold">{t("hub.heading")}</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-sm leading-relaxed">
              {t("hub.subtitle_before")}
              <HubLink />
            </p>
          </div>
        </ScrollReveal>

        <div className="flex gap-8 items-start">
          {/* ── Sidebar (desktop) ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-24">
            <nav className="bg-background rounded-2xl border border-border/50 shadow-sm overflow-hidden">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-4 pt-4 pb-2">{t("hub.toc")}</p>
              {renderNavItems(false)}
            </nav>
          </aside>

          {/* ── Mobile hamburger ── */}
          <div className="lg:hidden w-full mb-4">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 px-4 py-2.5 bg-background border border-border/50 rounded-xl text-sm font-medium text-foreground shadow-sm w-full"
            >
              {open ? <XIcon className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              {t("hub.toc")} - {stripNumber(activeTitle ? t(activeTitle) : "")}
            </button>
            {open && (
              <nav className="mt-2 bg-background border border-border/50 rounded-xl shadow-lg overflow-hidden">
                {renderNavItems(true)}
              </nav>
            )}
          </div>

          {/* ── Main content ── */}
          <main className="flex-1 min-w-0 space-y-6">
            {HUB_SECTIONS.map((s, i) => (
              <ScrollReveal key={s.id} delay={i * 60}>
                <div
                  id={`hub-${s.id}`}
                  className="bg-background rounded-2xl border border-border/40 shadow-sm p-6 md:p-8 scroll-mt-28"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <s.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-navy">{t(s.titleKey)}</h3>
                  </div>
                  <HubSectionBody def={s} />
                </div>
              </ScrollReveal>
            ))}
          </main>
        </div>
      </div>
    </section>
  );
}
