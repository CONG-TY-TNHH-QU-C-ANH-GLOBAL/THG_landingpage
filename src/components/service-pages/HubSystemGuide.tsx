// HUB System Guide — section II of the Fulfill page (sidebar nav + 6 content
// sections walking sellers through hub.thgfulfill.com). Fulfill-specific:
// moved out of THGFulfillPage.tsx for page-file size, not for reuse.

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

type Translate = (key: string) => string;

// Built per-render with the i18n `t` so the guide localizes to vi/en/zh.
// Product feature labels (Wallet Balance, Order, Upload Orders…) stay literal
// because they appear in English inside the actual Hub product UI.
function buildHubSections(t: Translate) {
  return [
  {
    id: "dashboard",
    icon: "LayoutDashboard",
    title: t("hub.s1_title"),
    content: (
      <>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {t("hub.s1_p1a")}
          <a href="https://hub.thgfulfill.com" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
            hub.thgfulfill.com
          </a>
          {t("hub.s1_p1b")}
        </p>
        <ul className="space-y-2 mb-4">
          {[
            { label: "Wallet Balance", desc: t("hub.s1_wallet_desc") },
            { label: "Total Orders", desc: t("hub.s1_orders_desc") },
            { label: "In Process", desc: t("hub.s1_inprocess_desc") },
            { label: "Revenue", desc: t("hub.s1_revenue_desc") },
          ].map((item) => (
            <li key={item.label} className="flex gap-2 text-sm">
              <span className="font-semibold text-navy whitespace-nowrap">{item.label}:</span>
              <span className="text-muted-foreground">{item.desc}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("hub.s1_p2")}
        </p>
      </>
    ),
  },
  {
    id: "orders",
    icon: "PackageCheck",
    title: t("hub.s2_title"),
    content: (
      <>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {t("hub.s2_p1")}
        </p>
        <ul className="space-y-3">
          <li className="flex gap-3 text-sm">
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
            <span className="text-muted-foreground">{t("hub.s2_li1")}</span>
          </li>
          <li className="flex gap-3 text-sm">
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
            <span className="text-muted-foreground">{t("hub.s2_li2")}</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "catalog",
    icon: "BookOpen",
    title: t("hub.s3_title"),
    content: (
      <p className="text-muted-foreground leading-relaxed">
        {t("hub.s3_p1")}
      </p>
    ),
  },
  {
    id: "billing",
    icon: "Wallet",
    title: t("hub.s4_title"),
    content: (
      <>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {t("hub.s4_p1")}
        </p>
        <ul className="space-y-2">
          {[
            { label: "Wallet", desc: t("hub.s4_wallet_desc") },
            { label: "Top-up", desc: t("hub.s4_topup_desc") },
            { label: "Transaction", desc: t("hub.s4_transaction_desc") },
          ].map((item) => (
            <li key={item.label} className="flex gap-2 text-sm">
              <span className="font-semibold text-navy whitespace-nowrap">{item.label}:</span>
              <span className="text-muted-foreground">{item.desc}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "support",
    icon: "HeadphonesIcon",
    title: t("hub.s5_title"),
    content: (
      <>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {t("hub.s5_p1")}
        </p>
        <ul className="space-y-2">
          {[
            { label: "Request", desc: t("hub.s5_request_desc") },
            { label: "Trouble", desc: t("hub.s5_trouble_desc") },
          ].map((item) => (
            <li key={item.label} className="flex gap-2 text-sm">
              <span className="font-semibold text-navy whitespace-nowrap">{item.label}:</span>
              <span className="text-muted-foreground">{item.desc}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "account",
    icon: "UserCog",
    title: t("hub.s6_title"),
    content: (
      <>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {t("hub.s6_p1")}
        </p>
        <ul className="space-y-2">
          {[
            { label: "Account Setting", desc: t("hub.s6_account_desc") },
            { label: "Team Member", desc: t("hub.s6_team_desc") },
          ].map((item) => (
            <li key={item.label} className="flex gap-2 text-sm">
              <span className="font-semibold text-navy whitespace-nowrap">{item.label}:</span>
              <span className="text-muted-foreground">{item.desc}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  ];
}

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  PackageCheck,
  BookOpen,
  Wallet,
  HeadphonesIcon: Headphones,
  UserCog,
};

export function HubSystemGuide() {
  const { t } = useI18n();
  const sections = buildHubSections(t);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState("dashboard");

  const handleNav = (id: string) => {
    setActive(id);
    setOpen(false);
    const el = document.getElementById(`hub-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
              <a href="https://hub.thgfulfill.com" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
                hub.thgfulfill.com
              </a>
            </p>
          </div>
        </ScrollReveal>

        <div className="flex gap-8 items-start">
          {/* ── Sidebar (desktop) ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-24">
            <nav className="bg-background rounded-2xl border border-border/50 shadow-sm overflow-hidden">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-4 pt-4 pb-2">{t("hub.toc")}</p>
              {sections.map((s) => {
                const Icon = ICON_MAP[s.icon];
                return (
                  <button
                    key={s.id}
                    onClick={() => handleNav(s.id)}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors ${
                      active === s.id
                        ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                    <span className="leading-tight">{s.title.replace(/^\d+\.\s/, "")}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ── Mobile hamburger ── */}
          <div className="lg:hidden w-full mb-4">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 px-4 py-2.5 bg-background border border-border/50 rounded-xl text-sm font-medium text-foreground shadow-sm w-full"
            >
              {open ? <XIcon className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              {t("hub.toc")} - {sections.find((s) => s.id === active)?.title.replace(/^\d+\.\s/, "")}
            </button>
            {open && (
              <nav className="mt-2 bg-background border border-border/50 rounded-xl shadow-lg overflow-hidden">
                {sections.map((s) => {
                  const Icon = ICON_MAP[s.icon];
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleNav(s.id)}
                      className={`w-full flex items-center gap-2.5 px-4 py-3 text-left text-sm transition-colors ${
                        active === s.id ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-secondary/60"
                      }`}
                    >
                      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                      {s.title}
                    </button>
                  );
                })}
              </nav>
            )}
          </div>

          {/* ── Main content ── */}
          <main className="flex-1 min-w-0 space-y-6">
            {sections.map((s, i) => {
              const Icon = ICON_MAP[s.icon];
              return (
                <ScrollReveal key={s.id} delay={i * 60}>
                  <div
                    id={`hub-${s.id}`}
                    className="bg-background rounded-2xl border border-border/40 shadow-sm p-6 md:p-8 scroll-mt-28"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {Icon && <Icon className="w-5 h-5 text-primary" />}
                      </div>
                      <h3 className="text-lg font-bold text-navy">{s.title}</h3>
                    </div>
                    {s.content}
                  </div>
                </ScrollReveal>
              );
            })}
          </main>
        </div>
      </div>
    </section>
  );
}
