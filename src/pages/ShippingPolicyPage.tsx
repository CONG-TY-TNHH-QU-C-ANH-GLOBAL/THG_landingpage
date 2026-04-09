import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { useI18n } from "@/lib/i18n";

/* ─── Route Components ─── */
import RouteVnRegular from "@/components/shipping-policy/RouteVnRegular";
import RouteVnCosmetics from "@/components/shipping-policy/RouteVnCosmetics";
import RouteCnCosmetics from "@/components/shipping-policy/RouteCnCosmetics";
import RouteCnBatteries from "@/components/shipping-policy/RouteCnBatteries";
import RouteVnPriority from "@/components/shipping-policy/RouteVnPriority";
import RouteCnPriority from "@/components/shipping-policy/RouteCnPriority";

const ROUTE_KEYS = [
  "spolicy.r0", "spolicy.r1", "spolicy.r2",
  "spolicy.r3", "spolicy.r4", "spolicy.r5",
] as const;

const ROUTE_COMPONENTS = [
  RouteVnRegular, RouteVnCosmetics, RouteCnCosmetics,
  RouteCnBatteries, RouteVnPriority, RouteCnPriority,
];

const ShippingPolicyPage = () => {
  const { t } = useI18n();
  const [activeRoute, setActiveRoute] = useState(0);
  const ActiveComponent = ROUTE_COMPONENTS[activeRoute];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <Navbar />
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-28 pb-20">
        <h1 className="text-xl font-semibold text-navy mb-1 notranslate">{t("spolicy.title")}</h1>
        <p className="text-[13px] text-muted-foreground mb-6 notranslate">{t("spolicy.subtitle")}</p>

        {/* Route Tabs */}
        <div className="flex gap-2 flex-wrap mb-5">
          {ROUTE_KEYS.map((key, i) => (
            <button
              key={i}
              onClick={() => setActiveRoute(i)}
              className={`px-4 py-2 border-[1.5px] rounded-lg text-[13px] font-medium transition-all ${activeRoute === i
                ? "bg-primary border-primary text-white"
                : "border-[#d4b96a] bg-white text-navy hover:bg-[#fdf6e8]"
                }`}
            >
              {t(key)}
            </button>
          ))}
        </div>

        {/* Active Route Content */}
        <ActiveComponent />
      </div>
      <ContactSection />
      <Footer />
    </div>
  );
};

export default ShippingPolicyPage;
