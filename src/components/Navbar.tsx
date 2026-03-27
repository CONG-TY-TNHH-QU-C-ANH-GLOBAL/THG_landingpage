import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Package, Truck, Warehouse, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Link, useLocation } from "react-router-dom";

const serviceItems = [
  { icon: Package, titleKey: "nav.thg_fulfill", descKey: "nav.fulfill_desc", href: "#services" },
  { icon: Truck, titleKey: "nav.thg_express", descKey: "nav.express_desc", href: "#services" },
  { icon: Warehouse, titleKey: "nav.thg_warehouse", descKey: "nav.warehouse_desc", href: "#services" },
  { icon: ShoppingCart, titleKey: "nav.thg_order", descKey: "nav.order_desc", href: "#services" },
];

const Navbar = () => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navItems = [
    { label: t("nav.pricing"), href: "/bang-gia" },
    { label: t("nav.policy"), href: "/chinh-sach" },
    { label: t("nav.news"), href: "/tin-tuc" },
    { label: t("nav.faq"), href: "/#faq" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? "bg-background/95 backdrop-blur-xl shadow-sm border-b border-border/50" : "bg-transparent"
    }`}>
      <div className="container mx-auto flex items-center justify-between h-16 lg:h-20 px-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <span className="text-primary-foreground font-bold text-sm tracking-tight">THG</span>
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
            className="relative"
            onMouseEnter={() => setShowServices(true)}
            onMouseLeave={() => setShowServices(false)}
          >
            <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50">
              {t("nav.services")}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showServices ? "rotate-180" : ""}`} />
            </button>

            {/* Mega Menu */}
            <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-300 ${
              showServices ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
            }`}>
              <div className="bg-card/98 backdrop-blur-xl rounded-2xl border border-border/60 shadow-2xl p-6 w-[520px] grid grid-cols-2 gap-3">
                {serviceItems.map((item) => (
                  <a
                    key={item.titleKey}
                    href={item.href}
                    className="flex gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-all duration-200 group/item"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors">
                      <item.icon className="w-5 h-5 text-primary group-hover/item:text-primary-foreground transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t(item.titleKey)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{t(item.descKey)}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-secondary/50 ${
                location.pathname === item.href ? "text-primary" : "text-foreground/80 hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageSwitcher />
          <Button className="bg-primary hover:bg-gold-dark text-primary-foreground rounded-full px-6 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300">
            {t("nav.consult")}
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <LanguageSwitcher />
          <button className="p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-card/98 backdrop-blur-xl border-t border-border/50 px-4 py-6 space-y-1 animate-fade-in">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-2">{t("nav.services")}</p>
          {serviceItems.map((item) => (
            <a
              key={item.titleKey}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{t(item.titleKey)}</span>
            </a>
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
            <Button className="w-full bg-primary hover:bg-gold-dark text-primary-foreground rounded-full">
              {t("nav.consult")}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
