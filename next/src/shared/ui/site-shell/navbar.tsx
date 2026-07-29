// The global site navigation — one shared floating-glass pill used on every public route
// (Home, THG Fulfill, and all future routes). The <nav> is a fixed, transparent positioning
// layer; the inner element is a centered, contained glass pill that provides its own contrast
// over any page background (light or dark hero), so no per-route variant or scroll tone is needed.
"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { Menu, X, ChevronDown, Package, Truck, Warehouse, ShoppingCart, Globe, MapPin, Tag, MessagesSquare, BadgeCheck, HelpCircle } from "lucide-react";

import { Button } from "@/shared/ui/button";
import type { Locale } from "@/shared/i18n";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";
import { LeadFormDialog } from "@/shared/ui/lead-form-dialog";
import LocaleSwitcher from "@/shared/ui/site-shell/locale-switcher";
import { DELAYS } from "@/shared/ui/constants";

const thgLogo = "/assets/thg-logo.png";

// The floating pill surface — a translucent light glass card, centered and contained, sitting
// clear of the page content. Shared by the closed desktop and mobile bars so both read as one
// product. bg-card is white; /78 keeps it legible over dark heroes while staying glassy.
const PILL_SURFACE =
  "border border-white/60 bg-[hsl(var(--card)/0.78)] backdrop-blur-xl shadow-[0_16px_40px_-12px_hsl(220_25%_12%/0.16)]";

interface NavMenuItem {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  href: string;
}

const serviceItems: NavMenuItem[] = [
  { icon: Package, titleKey: "nav.thg_fulfill", descKey: "nav.fulfill_desc", href: "/thg-fulfill" },
  { icon: Truck, titleKey: "nav.thg_express", descKey: "nav.express_desc", href: "/thg-express" },
  { icon: Warehouse, titleKey: "nav.thg_warehouse", descKey: "nav.warehouse_desc", href: "/thg-warehouse" },
  { icon: ShoppingCart, titleKey: "nav.thg_order", descKey: "nav.order_desc", href: "/thg-order" },
];

const pricingItems: NavMenuItem[] = [
  { icon: Globe, titleKey: "nav.intl_pricing", descKey: "nav.intl_pricing_desc", href: "/international-pricing" },
  { icon: MapPin, titleKey: "nav.domestic_pricing", descKey: "nav.domestic_pricing_desc", href: "/domestic-pricing" },
  { icon: Tag, titleKey: "nav.catalog", descKey: "nav.catalog_desc", href: "/catalog" },
];

const communityItems: NavMenuItem[] = [
  { icon: MessagesSquare, titleKey: "nav.community_qa", descKey: "nav.community_qa_desc", href: "/community" },
  { icon: BadgeCheck, titleKey: "nav.verified_reviews", descKey: "nav.verified_reviews_desc", href: "/community/reviews" },
];

/** Rich dropdown row (icon box + title + description) used by both desktop dropdown panels. */
function DesktopDropdownItem({ item, lang, t, onClick }: Readonly<{ item: NavMenuItem; lang: Locale; t: (key: string) => string; onClick: () => void }>) {
  return (
    <Link prefetch={false}
      href={`/${lang}${item.href}`}
      className="flex gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-all duration-300 group/item hover:shadow-sm"
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 group-hover/item:bg-primary group-hover/item:text-primary-foreground group-hover/item:scale-110 group-hover/item:shadow-lg transition-all duration-300">
        <item.icon className="w-5 h-5 text-primary group-hover/item:text-primary-foreground transition-colors" />
      </div>
      <div>
        <p className={`text-sm font-semibold text-foreground ${item.titleKey.includes("thg_") ? "notranslate" : ""}`}>{t(item.titleKey)}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{t(item.descKey)}</p>
      </div>
    </Link>
  );
}

/** Compact icon + label row used by both mobile menu groups. */
function MobileNavItem({ item, lang, t, onClick }: Readonly<{ item: NavMenuItem; lang: Locale; t: (key: string) => string; onClick: () => void }>) {
  return (
    <Link prefetch={false}
      href={`/${lang}${item.href}`}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/50 transition-colors"
      onClick={onClick}
    >
      <item.icon className="w-4 h-4 text-primary" />
      <span className="text-sm font-medium" translate="no">{t(item.titleKey)}</span>
    </Link>
  );
}

/** Shared desktop dropdown trigger + hover panel. */
function DesktopDropdown({
  label,
  open,
  panelWidth,
  onEnter,
  onLeave,
  children,
}: Readonly<{
  label: string;
  open: boolean;
  panelWidth: string;
  onEnter: () => void;
  onLeave: () => void;
  children: ReactNode;
}>) {
  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button type="button" className="flex items-center gap-1 px-3 py-2 text-sm font-medium whitespace-nowrap rounded-lg text-foreground/80 hover:text-foreground hover:bg-secondary/50 transition-colors">
        <span translate="no">{label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`absolute top-full left-0 pt-3 transition-all duration-300 ${open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-3 pointer-events-none"}`}
        style={{ transitionTimingFunction: "var(--motion-spring)" }}
      >
        <div className={`bg-card/95 backdrop-blur-2xl rounded-2xl border border-border/40 shadow-[0_20px_60px_-15px_hsl(36_45%_42%/0.15)] p-4 ${panelWidth}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

const Navbar = ({ lang, copy }: Readonly<{ lang: Locale; copy: MarketingCopy }>) => {
  const t = tFrom(copy);
  /** Prefix any absolute path with the current language. */
  const lp = (path: string) => `/${lang}${path}`;
  const [isOpen, setIsOpen] = useState(false);
  // One open dropdown at a time (hover-driven), shared close timeout.
  const [openMenu, setOpenMenu] = useState<"services" | "pricing" | "community" | null>(null);
  const pathname = usePathname();
  const menuTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  // Close menus when the route changes — derived-state-during-render form (the effect variant
  // trips react-hooks/set-state-in-effect under the React compiler lint).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpenMenu(null);
    setIsOpen(false);
  }

  // Mobile menu a11y: lock body scroll, close on Escape, and return focus to the toggle on close.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const menuEnter = (menu: "services" | "pricing" | "community") => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setOpenMenu(menu);
  };
  const menuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => setOpenMenu(null), DELAYS.NAVBAR_DROPDOWN_CLOSE_MS);
  };

  // The static FAQ lives on the homepage as an anchor section; smooth-scroll when already there,
  // otherwise navigate to the homepage hash.
  const goToFaq = () => {
    setOpenMenu(null);
    setIsOpen(false);
    if (pathname === `/${lang}`) {
      document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
    } else {
      globalThis.location.href = `/${lang}/#faq`;
    }
  };

  const navItems = [
    { label: t("nav.policy"), href: "/policy" },
    { label: t("nav.news"), href: "/blog" },
    { label: t("nav.careers"), href: "/careers" },
  ];

  return (
    <nav aria-label="Primary" className="fixed top-0 left-0 right-0 z-50">
      {/* Floating glass pill — centered, contained, clear of page content. */}
      <div className={`mx-auto mt-3 flex items-center justify-between h-14 xl:h-16 w-[calc(100%-1.5rem)] max-w-6xl rounded-full px-3 xl:px-5 ${PILL_SURFACE}`}>
        <Link prefetch={false} href={`/${lang}`} className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-navy flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden p-1.5">
            <img src={thgLogo} alt="THG" className="w-full h-full object-contain brightness-0 invert" />
          </div>
          {/* Single-line lockup keeps the logo compact so menu labels never wrap; the descriptor
              (Transport Happiness Group) lives in the footer, not the constrained pill. */}
          <span className="font-display text-base font-bold tracking-tight text-navy whitespace-nowrap">THG Fulfill</span>
        </Link>

        {/* Desktop nav — shown only at xl+, where the pill has room for the full menu on one line.
            Below xl the compact pill + hamburger carry the same full navigation. */}
        <div className="hidden xl:flex items-center gap-0.5">
          <DesktopDropdown label={t("nav.services")} open={openMenu === "services"} panelWidth="w-[480px] grid grid-cols-2 gap-2" onEnter={() => menuEnter("services")} onLeave={menuLeave}>
            {serviceItems.map((item) => (
              <DesktopDropdownItem key={item.titleKey} item={item} lang={lang} t={t} onClick={() => setOpenMenu(null)} />
            ))}
          </DesktopDropdown>

          <DesktopDropdown label={t("nav.pricing")} open={openMenu === "pricing"} panelWidth="w-[320px] space-y-1" onEnter={() => menuEnter("pricing")} onLeave={menuLeave}>
            {pricingItems.map((item) => (
              <DesktopDropdownItem key={item.titleKey} item={item} lang={lang} t={t} onClick={() => setOpenMenu(null)} />
            ))}
          </DesktopDropdown>

          <DesktopDropdown label={t("nav.community")} open={openMenu === "community"} panelWidth="w-[340px] space-y-1" onEnter={() => menuEnter("community")} onLeave={menuLeave}>
            {communityItems.map((item) => (
              <DesktopDropdownItem key={item.titleKey} item={item} lang={lang} t={t} onClick={() => setOpenMenu(null)} />
            ))}
            <button
              type="button"
              onClick={goToFaq}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-all duration-300 border-t border-border/40 mt-1 pt-3 text-left"
            >
              <HelpCircle className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
              <span>
                <span className="text-sm font-semibold text-foreground block">{t("nav.faq")}</span>
                <span className="text-xs text-muted-foreground">{t("nav.faq_desc")}</span>
              </span>
            </button>
          </DesktopDropdown>

          {navItems.map((item) => (
            <Link prefetch={false}
              key={item.label}
              href={lp(item.href)}
              className={`px-3 py-2 text-sm font-medium whitespace-nowrap rounded-lg transition-colors ${pathname === lp(item.href) ? "text-primary" : "text-foreground/80 hover:text-foreground hover:bg-secondary/50"}`}
            >
              <span translate="no">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="hidden xl:flex items-center gap-2 shrink-0">
          <LocaleSwitcher lang={lang} />
          <a
            href="https://hub.thgfulfill.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium whitespace-nowrap text-muted-foreground hover:text-foreground transition-colors"
          >
            Hub System
          </a>
          <LeadFormDialog
            lang={lang}
            copy={copy}
            sourcePage="navbar-desktop"
            trigger={
              <Button className="bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold-dark))] text-white rounded-full px-5 py-4 text-sm font-bold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 border-0 whitespace-nowrap">
                {t("nav.consult")}
              </Button>
            }
          />
        </div>

        {/* Mobile toggle */}
        <div className="flex xl:hidden items-center">
          <button
            ref={toggleRef}
            type="button"
            className="p-2.5 rounded-xl bg-secondary/40 hover:bg-secondary/70 text-navy transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu — a floating glass panel dropping below the pill (same surface language). */}
      {isOpen && (
        <div
          id="mobile-nav-menu"
          className={`xl:hidden mx-3 mt-2 rounded-2xl px-4 py-5 space-y-1 max-h-[calc(100vh-6rem)] overflow-y-auto animate-fade-in ${PILL_SURFACE}`}
        >
          <div className="flex justify-center mb-5 pb-4 border-b border-border/50">
            <LocaleSwitcher lang={lang} />
          </div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-2"><span translate="no">{t("nav.services")}</span></p>
          {serviceItems.map((item) => (
            <MobileNavItem key={item.titleKey} item={item} lang={lang} t={t} onClick={() => setIsOpen(false)} />
          ))}
          <div className="border-t border-border/50 my-3" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-2"><span translate="no">{t("nav.pricing")}</span></p>
          {pricingItems.map((item) => (
            <MobileNavItem key={item.titleKey} item={item} lang={lang} t={t} onClick={() => setIsOpen(false)} />
          ))}
          <div className="border-t border-border/50 my-3" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-2"><span translate="no">{t("nav.community")}</span></p>
          {communityItems.map((item) => (
            <MobileNavItem key={item.titleKey} item={item} lang={lang} t={t} onClick={() => setIsOpen(false)} />
          ))}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              if (pathname === `/${lang}`) {
                setTimeout(() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" }), DELAYS.NAVBAR_MOBILE_SCROLL_DELAY_MS);
              } else {
                globalThis.location.href = `/${lang}/#faq`;
              }
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/50 transition-colors text-left"
          >
            <HelpCircle className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium" translate="no">{t("nav.faq")}</span>
          </button>
          <div className="border-t border-border/50 my-3" />
          {navItems.map((item) => (
            <Link prefetch={false}
              key={item.label}
              href={lp(item.href)}
              className="block px-3 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground rounded-xl hover:bg-secondary/50"
              onClick={() => setIsOpen(false)}
            >
              <span translate="no">{item.label}</span>
            </Link>
          ))}
          <div className="pt-3">
            <LeadFormDialog
              lang={lang}
              copy={copy}
              sourcePage="navbar-mobile"
              trigger={
                <Button className="w-full bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold-dark))] text-white px-5 py-6 text-base font-bold shadow-md rounded-xl">
                  {t("nav.consult")}
                </Button>
              }
            />
            <a
              href="https://hub.thgfulfill.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center mt-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Hub System
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
