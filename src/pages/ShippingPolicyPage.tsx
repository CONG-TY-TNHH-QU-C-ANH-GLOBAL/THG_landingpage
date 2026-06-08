import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";

import ContactSection from "@/components/ContactSection";
import { RouteRenderer } from "@/components/shipping-policy/RouteRenderer";
import { useCmsShippingRoutes } from "@/hooks/useCmsContent";
import { useI18n } from "@/lib/i18n";

const ShippingPolicyPage = () => {
  const { t, language } = useI18n();
  const cms = useCmsShippingRoutes(language);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const tabs = useMemo(() => {
    if (!cms.data) return [];
    return cms.data.routes
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((r) => ({ slug: r.slug, label: r.title }));
  }, [cms.data]);

  const active = tabs[activeIdx] ?? tabs[0];

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <SeoHead
        title={t("seo.shipping_policy_title")}
        description={t("seo.shipping_policy_desc")}
        path="/shipping-policy"
      />
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://thgfulfill.com/" },
          { name: t("spolicy.title"), url: "https://thgfulfill.com/shipping-policy" },
        ]}
      />
      <Navbar />
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-28 pb-20">
        <h1 className="text-xl font-semibold text-navy mb-1 notranslate">{t("spolicy.title")}</h1>
        <p className="text-[13px] text-muted-foreground mb-6 notranslate">{t("spolicy.subtitle")}</p>

        {/* Route Tabs */}
        <div className="flex gap-2 flex-wrap mb-5">
          {tabs.map((tab, i) => (
            <button
              key={tab.slug}
              onClick={() => setActiveIdx(i)}
              className={`px-4 py-2 border-[1.5px] rounded-lg text-[13px] font-medium transition-all ${
                activeIdx === i
                  ? "bg-primary border-primary text-white"
                  : "border-[#d4b96a] bg-white text-navy hover:bg-[#fdf6e8]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {active ? (
          <RouteRenderer slug={active.slug} />
        ) : cms.isLoading ? (
          <div className="py-8 text-center text-muted-foreground text-sm">{t("spolicy.loading")}</div>
        ) : (
          <div className="py-8 text-center text-muted-foreground text-sm">{t("spolicy.empty")}</div>
        )}
      </div>
      <ContactSection />
    </div>
  );
};

export default ShippingPolicyPage;
