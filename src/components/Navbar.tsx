import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Package, Truck, Warehouse, ShoppingCart, Globe, DollarSign, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { Link, useLocation } from "react-router-dom";
import thgLogo from "@/assets/thg-logo.png";

const serviceItems = [
  { icon: Package, titleKey: "nav.thg_fulfill", descKey: "nav.fulfill_desc", href: "/thg-fulfill" },
  { icon: Truck, titleKey: "nav.thg_express", descKey: "nav.express_desc", href: "/thg-express" },
  { icon: Warehouse, titleKey: "nav.thg_warehouse", descKey: "nav.warehouse_desc", href: "/thg-warehouse" },
  { icon: ShoppingCart, titleKey: "nav.thg_order", descKey: "nav.order_desc", href: "/thg-order" },
];

const pricingItems = [
  { icon: Globe, titleKey: "nav.intl_pricing", descKey: "nav.intl_pricing_desc", href: "/bang-gia-quoc-te" },
  { icon: MapPin, titleKey: "nav.domestic_pricing", descKey: "nav.domestic_pricing_desc", href: "/bang-gia-noi-dia" },
];

const Navbar = () => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pricingDropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const pricingTimeoutRef = useRef<NodeJS.Timeout>();
  const gtDesktopSlotRef = useRef<HTMLDivElement>(null);
  const gtMobileSlotRef = useRef<HTMLDivElement>(null);
  const gtWidgetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Inject GTranslate widget — single instance
  useEffect(() => {
    // Create the single widget container
    if (!gtWidgetRef.current) {
      gtWidgetRef.current = document.createElement("div");
      gtWidgetRef.current.className = "gtranslate_wrapper";
    }

    if (!(window as any).gtranslateSettings) {
      (window as any).gtranslateSettings = {
        default_language: "en",
        languages: ["en", "vi", "zh-CN"],
        wrapper_selector: ".gtranslate_wrapper",
        alt_flags: { en: "usa" },
      };
      const script = document.createElement("script");
      script.src = "https://cdn.gtranslate.net/widgets/latest/popup.js";
      script.defer = true;
      document.body.appendChild(script);
    }

    // Move the single widget into the correct slot based on viewport
    const placeWidget = () => {
      const widget = gtWidgetRef.current;
      if (!widget) return;
      const isDesktop = window.innerWidth >= 1024; // lg breakpoint
      const target = isDesktop ? gtDesktopSlotRef.current : gtMobileSlotRef.current;
      if (target && !target.contains(widget)) {
        target.appendChild(widget);
      }
    };

    placeWidget();
    window.addEventListener("resize", placeWidget);
    return () => window.removeEventListener("resize", placeWidget);
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
    timeoutRef.current = setTimeout(() => setShowServices(false), 150);
  };
  const handlePricingEnter = () => {
    if (pricingTimeoutRef.current) clearTimeout(pricingTimeoutRef.current);
    setShowPricing(true);
  };
  const handlePricingLeave = () => {
    pricingTimeoutRef.current = setTimeout(() => setShowPricing(false), 150);
  };

  const navItems = [
    { label: t("nav.policy"), href: "/chinh-sach" },
    { label: t("nav.news"), href: "/tin-tuc" },
    { label: t("nav.faq"), href: "/#faq" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
      ? "bg-background/90 backdrop-blur-2xl shadow-[0_4px_30px_hsl(36_45%_42%/0.08)] border-b border-border/40"
      : "bg-transparent"
      }`}>
      <div className="container mx-auto flex items-center justify-between h-16 lg:h-20 px-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 overflow-hidden p-1.5">
            <img src={thgLogo} alt="THG" className="w-full h-full object-contain brightness-0 invert" />
          </div>
          <div>
            <h1 className="text-base font-bold text-navy leading-tight tracking-tight">THG Fulfill</h1>
            <p className="text-[9px] tracking-[0.15em] text-muted-foreground uppercase">Transport Happiness Group</p>
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
              {t("nav.services")}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showServices ? "rotate-180" : ""}`} />
            </button>

            <div className={`absolute top-full left-0 pt-3 transition-all duration-400 ${showServices ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-3 pointer-events-none"
              }`}
              style={{ transitionTimingFunction: "var(--motion-spring)" }}
            >
              <div className="bg-card/95 backdrop-blur-2xl rounded-2xl border border-border/40 shadow-[0_20px_60px_-15px_hsl(36_45%_42%/0.15)] p-5 w-[480px] grid grid-cols-2 gap-2">
                {serviceItems.map((item) => (
                  <Link
                    key={item.titleKey}
                    to={item.href}
                    className="flex gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-all duration-300 group/item hover:shadow-sm"
                    onClick={() => setShowServices(false)}
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 group-hover/item:bg-primary group-hover/item:text-primary-foreground group-hover/item:scale-110 group-hover/item:shadow-lg transition-all duration-300">
                      <item.icon className="w-5 h-5 text-primary group-hover/item:text-primary-foreground transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t(item.titleKey)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{t(item.descKey)}</p>
                    </div>
                  </Link>
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
              {t("nav.pricing")}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showPricing ? "rotate-180" : ""}`} />
            </button>

            <div className={`absolute top-full left-0 pt-3 transition-all duration-400 ${showPricing ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-3 pointer-events-none"
              }`}
              style={{ transitionTimingFunction: "var(--motion-spring)" }}
            >
              <div className="bg-card/95 backdrop-blur-2xl rounded-2xl border border-border/40 shadow-[0_20px_60px_-15px_hsl(36_45%_42%/0.15)] p-4 w-[320px] space-y-1">
                {pricingItems.map((item) => (
                  <Link
                    key={item.titleKey}
                    to={item.href}
                    className="flex gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-all duration-300 group/item hover:shadow-sm"
                    onClick={() => setShowPricing(false)}
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 group-hover/item:bg-primary group-hover/item:text-primary-foreground group-hover/item:scale-110 group-hover/item:shadow-lg transition-all duration-300">
                      <item.icon className="w-5 h-5 text-primary group-hover/item:text-primary-foreground transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t(item.titleKey)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{t(item.descKey)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-secondary/50 ${location.pathname === item.href ? "text-primary" : "text-foreground/80 hover:text-foreground"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <div ref={gtDesktopSlotRef} />
          <Button className="bg-primary hover:bg-gold-dark text-primary-foreground rounded-full px-6 text-sm font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            style={{ boxShadow: "0 4px 15px hsl(36 45% 42% / 0.3)" }}
          >
            {t("nav.consult")}
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <div ref={gtMobileSlotRef} />
          <button className="p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-card/95 backdrop-blur-2xl border-t border-border/40 px-4 py-6 space-y-1 animate-fade-in shadow-[0_20px_60px_-15px_hsl(36_45%_42%/0.1)]">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-2">{t("nav.services")}</p>
          {serviceItems.map((item) => (
            <Link
              key={item.titleKey}
              to={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{t(item.titleKey)}</span>
            </Link>
          ))}
          <div className="border-t border-border/50 my-3" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-2">{t("nav.pricing")}</p>
          {pricingItems.map((item) => (
            <Link
              key={item.titleKey}
              to={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{t(item.titleKey)}</span>
            </Link>
          ))}
          <div className="border-t border-border/50 my-3" />
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="block px-3 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground rounded-xl hover:bg-secondary/50"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3">
            <Button className="w-full bg-primary hover:bg-gold-dark text-primary-foreground rounded-full shadow-lg">
              {t("nav.consult")}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
