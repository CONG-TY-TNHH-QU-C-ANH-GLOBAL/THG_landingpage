import { useState, useEffect, useRef } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { LucideIcon } from "lucide-react";
import { Menu, X, ChevronDown, Package, Truck, Warehouse, ShoppingCart, Globe, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { Link, useLocation } from "react-router-dom";
import thgLogo from "@/assets/thg-logo.png";
import { LeadFormDialog } from "@/components/lead/LeadFormDialog";
import { DELAYS, SCROLL } from "@/lib/constants";

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

/** Rich dropdown row (icon box + title + description) used by both desktop dropdown panels. */
function DesktopDropdownItem({ item, onClick }: Readonly<{ item: NavMenuItem; onClick: () => void }>) {
  const { t, language } = useI18n();
  return (
    <Link
      to={`/${language}${item.href}`}
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
function MobileNavItem({ item, onClick }: Readonly<{ item: NavMenuItem; onClick: () => void }>) {
  const { t, language } = useI18n();
  return (
    <Link
      to={`/${language}${item.href}`}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/50 transition-colors"
      onClick={onClick}
    >
      <item.icon className="w-4 h-4 text-primary" />
      <span className="text-sm font-medium" translate="no">{t(item.titleKey)}</span>
    </Link>
  );
}

const Navbar = () => {
  const { t, language } = useI18n();
  /** Prefix any absolute path with the current language. */
  const lp = (path: string) => `/${language}${path}`;
  const [isOpen, setIsOpen] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pricingDropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const pricingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > SCROLL.NAVBAR_OPAQUE_THRESHOLD_PX);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);


  useEffect(() => {
    setShowServices(false);
    setShowPricing(false);
    setIsOpen(false);
  }, [location.pathname]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowServices(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowServices(false), DELAYS.NAVBAR_DROPDOWN_CLOSE_MS);
  };
  const handlePricingEnter = () => {
    if (pricingTimeoutRef.current) clearTimeout(pricingTimeoutRef.current);
    setShowPricing(true);
  };
  const handlePricingLeave = () => {
    pricingTimeoutRef.current = setTimeout(() => setShowPricing(false), DELAYS.NAVBAR_DROPDOWN_CLOSE_MS);
  };

  const navItems = [
    { label: t("nav.policy"), href: "/policy" },
    { label: t("nav.news"), href: "/blog" },
    { label: t("nav.faq"), href: "/#faq" },
    { label: t("nav.careers"), href: "/careers" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
      ? "bg-background/90 backdrop-blur-2xl shadow-[0_4px_30px_hsl(36_45%_42%/0.08)] border-b border-border/40"
      : "bg-transparent"
      }`}>
      <div className="container mx-auto flex items-center justify-between h-16 lg:h-20 px-4">
        <Link to={`/${language}`} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 overflow-hidden p-1.5">
            <img src={thgLogo} alt="THG" className="w-full h-full object-contain brightness-0 invert" />
          </div>
          <div>
            <span className="text-base font-bold text-navy leading-tight tracking-tight block">THG Fulfill</span>
            <span className="text-[9px] tracking-[0.15em] text-muted-foreground uppercase block">Transport Happiness Group</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {/* Services Dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50">
              <span translate="no">{t("nav.services")}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showServices ? "rotate-180" : ""}`} />
            </button>

            <div className={`absolute top-full left-0 pt-3 transition-all duration-300 ${showServices ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-3 pointer-events-none"
              }`}
              style={{ transitionTimingFunction: "var(--motion-spring)" }}
            >
              <div className="bg-card/95 backdrop-blur-2xl rounded-2xl border border-border/40 shadow-[0_20px_60px_-15px_hsl(36_45%_42%/0.15)] p-5 w-[480px] grid grid-cols-2 gap-2">
                {serviceItems.map((item) => (
                  <DesktopDropdownItem key={item.titleKey} item={item} onClick={() => setShowServices(false)} />
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Dropdown */}
          <div
            ref={pricingDropdownRef}
            className="relative"
            onMouseEnter={handlePricingEnter}
            onMouseLeave={handlePricingLeave}
          >
            <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50">
              <span translate="no">{t("nav.pricing")}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showPricing ? "rotate-180" : ""}`} />
            </button>

            <div className={`absolute top-full left-0 pt-3 transition-all duration-300 ${showPricing ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-3 pointer-events-none"
              }`}
              style={{ transitionTimingFunction: "var(--motion-spring)" }}
            >
              <div className="bg-card/95 backdrop-blur-2xl rounded-2xl border border-border/40 shadow-[0_20px_60px_-15px_hsl(36_45%_42%/0.15)] p-4 w-[320px] space-y-1">
                {pricingItems.map((item) => (
                  <DesktopDropdownItem key={item.titleKey} item={item} onClick={() => setShowPricing(false)} />
                ))}
              </div>
            </div>
          </div>

          {navItems.map((item) =>
            item.href.includes("#") ? (
              <a
                key={item.label}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-secondary/50 text-foreground/80 hover:text-foreground cursor-pointer`}
                onClick={(e) => {
                  e.preventDefault();
                  const hash = item.href.split("#")[1];
                  if (location.pathname === `/${language}`) {
                    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = `/${language}/#${hash}`;
                  }
                }}
              >
                <span translate="no">{item.label}</span>
              </a>
            ) : (
              <Link
                key={item.label}
                to={lp(item.href)}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-secondary/50 ${location.pathname === lp(item.href) ? "text-primary" : "text-foreground/80 hover:text-foreground"
                  }`}
              >
                <span translate="no">{item.label}</span>
              </Link>
            )
          )}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageSwitcher />
          <a
            href="https://hub.thgfulfill.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Hub System
          </a>
          <LeadFormDialog
            sourcePage="navbar-desktop"
            trigger={
              <Button className="bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold-dark))] text-white rounded-full px-6 py-5 text-sm font-bold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 border-0">
                {t("nav.consult")}
              </Button>
            }
          />
        </div>

        {/* Mobile toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            className="p-3 bg-secondary/30 hover:bg-secondary/60 rounded-xl transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} className="text-navy" /> : <Menu size={22} className="text-navy" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-card/95 backdrop-blur-2xl border-t border-border/40 px-4 py-6 space-y-1 animate-fade-in shadow-[0_20px_60px_-15px_hsl(36_45%_42%/0.1)] h-[calc(100vh-64px)] overflow-y-auto">
          <div className="flex justify-center mb-6 pb-4 border-b border-border/50">
            <LanguageSwitcher />
          </div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-2"><span translate="no">{t("nav.services")}</span></p>
          {serviceItems.map((item) => (
            <MobileNavItem key={item.titleKey} item={item} onClick={() => setIsOpen(false)} />
          ))}
          <div className="border-t border-border/50 my-3" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-2"><span translate="no">{t("nav.pricing")}</span></p>
          {pricingItems.map((item) => (
            <MobileNavItem key={item.titleKey} item={item} onClick={() => setIsOpen(false)} />
          ))}
          <div className="border-t border-border/50 my-3" />
          {navItems.map((item) =>
            item.href.includes("#") ? (
              <a
                key={item.label}
                href={item.href}
                className="block px-3 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground rounded-xl hover:bg-secondary/50 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                  const hash = item.href.split("#")[1];
                  if (location.pathname === `/${language}`) {
                    setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), DELAYS.NAVBAR_MOBILE_SCROLL_DELAY_MS);
                  } else {
                    window.location.href = `/${language}/#${hash}`;
                  }
                }}
              >
                <span translate="no">{item.label}</span>
              </a>
            ) : (
              <Link
                key={item.label}
                to={lp(item.href)}
                className="block px-3 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground rounded-xl hover:bg-secondary/50"
                onClick={() => setIsOpen(false)}
              >
                <span translate="no">{item.label}</span>
              </Link>
            )
          )}
          <div className="pt-3">
            <LeadFormDialog
              sourcePage="navbar-mobile"
              trigger={
                <Button className="w-full bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold-dark))] text-white px-5 py-6 text-base font-bold shadow-md rounded-xl mt-4">
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
