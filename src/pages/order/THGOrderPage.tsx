// /thg-order — sourcing service (Taobao + 1688 → USA). Orchestrator only:
// every section lives in its own file under `_components/`, every constant
// in `data/`. Interactive state (pricing tab, FAQ accordion, video play)
// stays inside the relevant sub-component because nothing outside reads it.
//
// Note for editors:
//   - To rearrange sections, just swap the lines below.
//   - To change copy/data, edit the matching `data/*.ts` file.
//   - To touch one section's layout, open `_components/Order<Section>.tsx`.

import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLdBreadcrumb, JsonLdService } from "@/components/seo/JsonLd";
import { useI18n } from "@/lib/i18n";

import { OrderHero } from "./_components/OrderHero";
import { OrderPainPoints } from "./_components/OrderPainPoints";
import { OrderProcessSteps } from "./_components/OrderProcessSteps";
import { OrderSolutions } from "./_components/OrderSolutions";
import { OrderVideos } from "./_components/OrderVideos";
import { OrderTestimonials } from "./_components/OrderTestimonials";
import { OrderShippingLanes } from "./_components/OrderShippingLanes";
import { OrderPricingTabs } from "./_components/OrderPricingTabs";
import { OrderPolicies } from "./_components/OrderPolicies";
import { OrderFAQ } from "./_components/OrderFAQ";
import { OrderTrustCTA } from "./_components/OrderTrustCTA";

const THGOrderPage = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="THG Order — Buy from Taobao & 1688 Direct to USA"
        description={t("op.hero_desc")}
        path="/thg-order"
      />
      <JsonLdService
        name="THG Order — Taobao & 1688 Sourcing to USA"
        description="Sourcing service for Vietnamese Americans buying from Taobao and 1688. Safe purchase, no language barrier, direct delivery from China to USA."
        url="https://thgfulfill.com/thg-order"
      />
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://thgfulfill.com/" },
          { name: "THG Order", url: "https://thgfulfill.com/thg-order" },
        ]}
      />
      <Navbar />

      <OrderHero />
      <OrderPainPoints />
      <OrderProcessSteps />
      <OrderSolutions />
      <OrderVideos />
      <OrderTestimonials />
      <OrderShippingLanes />
      <OrderPricingTabs />
      <OrderPolicies />
      <OrderFAQ />
      <OrderTrustCTA />

      <div id="order-cta">
        <ContactSection />
      </div>
    </div>
  );
};

export default THGOrderPage;
