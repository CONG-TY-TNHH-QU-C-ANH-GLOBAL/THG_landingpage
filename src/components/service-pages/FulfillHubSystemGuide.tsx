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
import { cn } from "@/lib/utils";

type Translate = (key: string) => string;

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

/** "Label: description" rows — the layout every Hub feature list uses. */
const HubLabeledList = ({
  items,
  className = "space-y-2",
}: Readonly<{ items: { label: string; desc: string }[]; className?: string }>) => (
  <ul className={className}>
    {items.map((item) => (
      <li key={item.label} className="flex gap-2 text-sm">
        <span className="font-semibold text-navy whitespace-nowrap">{item.label}:</span>
        <span className="text-muted-foreground">{item.desc}</span>
      </li>
    ))}
  </ul>
);

/** Dot-bulleted rows used by the orders section. */
const HubBulletList = ({ items }: Readonly<{ items: string[] }>) => (
  <ul className="space-y-3">
    {items.map((item) => (
      <li key={item} className="flex gap-3 text-sm">
        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
        <span className="text-muted-foreground">{item}</span>
      </li>
    ))}
  </ul>
);

/** One nav entry, shared by the desktop sidebar and the mobile dropdown. */
const HubNavButton = ({
  icon: Icon,
  label,
  active,
  onClick,
  className,
  activeClassName,
}: Readonly<{
  icon: React.ElementType | undefined;
  label: string;
  active: boolean;
  onClick: () => void;
  className: string;
  activeClassName: string;
}>) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-2.5 px-4 text-left text-sm transition-colors",
      className,
      active ? activeClassName : "text-muted-foreground hover:bg-secondary/60",
    )}
  >
    {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
    <span className="leading-tight">{label}</span>
  </button>
);

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
            <HubLink />
            {t("hub.s1_p1b")}
          </p>
          <HubLabeledList
            className="space-y-2 mb-4"
            items={[
              { label: "Wallet Balance", desc: t("hub.s1_wallet_desc") },
              { label: "Total Orders", desc: t("hub.s1_orders_desc") },
              { label: "In Process", desc: t("hub.s1_inprocess_desc") },
              { label: "Revenue", desc: t("hub.s1_revenue_desc") },
            ]}
          />
          <p className="text-sm text-muted-foreground leading-relaxed">{t("hub.s1_p2")}</p>
        </>
      ),
    },
    {
      id: "orders",
      icon: "PackageCheck",
      title: t("hub.s2_title"),
      content: (
        <>
          <p className="text-muted-foreground leading-relaxed mb-4">{t("hub.s2_p1")}</p>
          <HubBulletList items={[t("hub.s2_li1"), t("hub.s2_li2")]} />
        </>
      ),
    },
    {
      id: "catalog",
      icon: "BookOpen",
      title: t("hub.s3_title"),
      content: <p className="text-muted-foreground leading-relaxed">{t("hub.s3_p1")}</p>,
    },
    {
      id: "billing",
      icon: "Wallet",
      title: t("hub.s4_title"),
      content: (
        <>
          <p className="text-muted-foreground leading-relaxed mb-4">{t("hub.s4_p1")}</p>
          <HubLabeledList
            items={[
              { label: "Wallet", desc: t("hub.s4_wallet_desc") },
              { label: "Top-up", desc: t("hub.s4_topup_desc") },
              { label: "Transaction", desc: t("hub.s4_transaction_desc") },
            ]}
          />
        </>
      ),
    },
    {
      id: "support",
      icon: "HeadphonesIcon",
      title: t("hub.s5_title"),
      content: (
        <>
          <p className="text-muted-foreground leading-relaxed mb-4">{t("hub.s5_p1")}</p>
          <HubLabeledList
            items={[
              { label: "Request", desc: t("hub.s5_request_desc") },
              { label: "Trouble", desc: t("hub.s5_trouble_desc") },
            ]}
          />
        </>
      ),
    },
    {
      id: "account",
      icon: "UserCog",
      title: t("hub.s6_title"),
      content: (
        <>
          <p className="text-muted-foreground leading-relaxed mb-4">{t("hub.s6_p1")}</p>
          <HubLabeledList
            items={[
              { label: "Account Setting", desc: t("hub.s6_account_desc") },
              { label: "Team Member", desc: t("hub.s6_team_desc") },
            ]}
          />
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

const stripNumber = (title: string) => title.replace(/^\d+\.\s/, "");

export function FulfillHubSystemGuide() {
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
              <HubLink />
            </p>
          </div>
        </ScrollReveal>

        <div className="flex gap-8 items-start">
          {/* ── Sidebar (desktop) ── */}
          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-24">
            <nav className="bg-background rounded-2xl border border-border/50 shadow-sm overflow-hidden">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-4 pt-4 pb-2">{t("hub.toc")}</p>
              {sections.map((s) => (
                <HubNavButton
                  key={s.id}
                  icon={ICON_MAP[s.icon]}
                  label={stripNumber(s.title)}
                  active={active === s.id}
                  onClick={() => handleNav(s.id)}
                  className="py-2.5 hover:text-foreground"
                  activeClassName="bg-primary/10 text-primary font-semibold border-l-2 border-primary"
                />
              ))}
            </nav>
          </aside>

          {/* ── Mobile hamburger ── */}
          <div className="lg:hidden w-full mb-4">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 px-4 py-2.5 bg-background border border-border/50 rounded-xl text-sm font-medium text-foreground shadow-sm w-full"
            >
              {open ? <XIcon className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              {t("hub.toc")} - {stripNumber(sections.find((s) => s.id === active)?.title ?? "")}
            </button>
            {open && (
              <nav className="mt-2 bg-background border border-border/50 rounded-xl shadow-lg overflow-hidden">
                {sections.map((s) => (
                  <HubNavButton
                    key={s.id}
                    icon={ICON_MAP[s.icon]}
                    label={s.title}
                    active={active === s.id}
                    onClick={() => handleNav(s.id)}
                    className="py-3"
                    activeClassName="bg-primary/10 text-primary font-semibold"
                  />
                ))}
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
