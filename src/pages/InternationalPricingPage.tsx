import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";

import ContactSection from "@/components/ContactSection";
import { useI18n } from "@/lib/i18n";


import { useLarkPricingContext } from "@/components/pricing/LarkPricingProvider";


// Extracted Components
import { ServiceTab, EpacketRoute, ExpressRoute, CargoType, ROUTES, DATA_KEY_MAP, countryNames } from "@/components/pricing/types";
import TerminologyPanel from "@/components/pricing/TerminologyPanel";

// Section Components
import HeroSection from "@/components/pricing/HeroSection";
import SearchWidget from "@/components/pricing/SearchWidget";
import EpacketPanel from "@/components/pricing/EpacketPanel";
import ExpressVnUsPanel from "@/components/pricing/ExpressVnUsPanel";
import ExpressCnUsPanel from "@/components/pricing/ExpressCnUsPanel";
/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */
const InternationalPricingPage = () => {
  const { t, tVi, effectiveLanguage: lang } = useI18n();
  const lark = useLarkPricingContext();

  // Always re-fetch fresh data when navigating to this page
  useEffect(() => {
    lark.refetch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // State
  const [service, setService] = useState<ServiceTab>("epacket");
  const [origin, setOriginState] = useState<"vn" | "cn">("vn");
  const [route, setRoute] = useState<EpacketRoute>("std-vn-ww");
  const [cargo, setCargo] = useState<CargoType>("standard");
  const [expressRoute, setExpressRoute] = useState<ExpressRoute>("vn-us");

  // When changing origin, snap route + expressRoute to first available for that origin
  const setOrigin = (o: "vn" | "cn") => {
    setOriginState(o);
    // ePacket route reset
    const firstRoute = (Object.entries(ROUTES) as [EpacketRoute, typeof ROUTES[EpacketRoute]][])
      .find(([, r]) => r.origin.includes(o));
    if (firstRoute && !ROUTES[route].origin.includes(o)) {
      const [rid] = firstRoute;
      setRoute(rid);
      if (!ROUTES[rid].cargo.includes(cargo)) {
        setCargo(ROUTES[rid].cargo[0] || "standard");
      }
    }
    // Express route reset to match origin
    setExpressRoute(o === "vn" ? "vn-us" : "cn-us");
  };

  // CMS pricing overlay (slug → flat row-array).
  const larkOverlay = useMemo(
    () => (lark.cmsOverlay as Record<string, any>) ?? {},
    [lark.cmsOverlay],
  );

  // Get current data from CMS overlay.
  const currentData = useMemo(() => {
    if (route === "cn-us-label") return [];
    const dataKey = DATA_KEY_MAP[`${route}_${cargo}`];
    if (!dataKey) return [];
    return larkOverlay[dataKey] ?? [];
  }, [route, cargo, larkOverlay]);



  // Get columns from data
  const tableColumns = useMemo(() => {
    if (!currentData || currentData.length === 0) return [];
    // For USPS data that uses 'rate' key
    if (currentData[0]?.rate !== undefined) {
      return [{ key: "rate", label: (route === "pri-vn-us" || route === "pri-cn-us") ? t("intl_pricing.rate_label") : t("intl_pricing.rate_label_generic") }];
    }
    // For standard multi-country data
    const keys = new Set<string>();
    currentData.forEach((row: any) => {
      Object.keys(row).forEach(k => { if (k !== "kg") keys.add(k); });
    });
    // Deduplicate: remove short 2-letter codes (e.g. "us") if a longer key starting with same prefix exists (e.g. "us-united_states")
    const allKeys = Array.from(keys);
    const filtered = allKeys.filter(k => {
      if (k.length <= 3) {
        return !allKeys.some(other => other.length > 3 && other.startsWith(k));
      }
      return true;
    });
    return filtered.map(k => ({
      key: k,
      label: countryNames[k.toLowerCase()] || k.toUpperCase()
    }));
  }, [currentData, route]);

  // Handle cargo switch with validation
  const handleCargoSwitch = (c: CargoType) => {
    if (ROUTES[route].cargo.includes(c)) {
      setCargo(c);
    }
  };

  // Handle route switch
  const handleRouteSwitch = (r: EpacketRoute) => {
    setRoute(r);
    // Reset cargo to first available if current is not supported
    if (!ROUTES[r].cargo.includes(cargo)) {
      setCargo(ROUTES[r].cargo[0] || "standard");
    }
  };



  /* ─── Extras data — CMS overlay only ─── */
  const rawVatData = (larkOverlay.euRate ?? []).map((e: any) => ({ country: e.country, vat: e.vat, service: e.serviceCharge }));
  // Deduplicate: keep only the first occurrence of each country
  const vatData = rawVatData.filter((item: any, index: number, arr: any[]) =>
    arr.findIndex((v: any) => v.country === item.country) === index
  );
  const remoteSurcharge = larkOverlay.remoteSurcharge ?? [];
  const redeliveryData = larkOverlay.redelivery ?? [];

  /* ─── Search Widget State ─── */
  const [searchFrom, setSearchFrom] = useState("VN");
  const [searchTo, setSearchTo] = useState("ALL");
  const [searchSvc, setSearchSvc] = useState("epacket");
  const [searchCargo, setSearchCargo] = useState("standard");
  const [searchWeight, setSearchWeight] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState(0);

  // Derive country options for the search dropdown based on search widget state (independent of main tabs)
  const searchCountries = useMemo(() => {
    let dataKey = "";
    if (searchFrom === "VN") {
      if (searchCargo === "standard") dataKey = "vnThuong";
      else if (searchCargo === "cosmetic") dataKey = "vnMypham";
      else dataKey = "vnThuong"; // fallback
    } else {
      if (searchCargo === "standard") dataKey = "cnThuong";
      else if (searchCargo === "cosmetic") dataKey = "cnMypham";
      else if (searchCargo === "battery") dataKey = "cnPin";
      else dataKey = "cnThuong";
    }
    const data = (larkOverlay[dataKey] as any[]) ?? [];
    if (!data.length) return [];
    const keys = new Set<string>();
    data.forEach((row: any) => {
      Object.keys(row).forEach(k => { if (k !== "kg" && k !== "weight") keys.add(k); });
    });
    const allKeys = Array.from(keys);
    const filtered = allKeys.filter(k => {
      if (k.length <= 3) {
        return !allKeys.some(other => other.length > 3 && other.startsWith(k));
      }
      return true;
    });
    return filtered.map(k => ({
      key: k,
      label: countryNames[k.toLowerCase()] || k.toUpperCase()
    }));
  }, [searchFrom, searchCargo, larkOverlay]);

  const handleSearch = () => {
    setSearchTrigger(prev => prev + 1);
    setShowResult(true);
  };

  const estimatedPrice = useMemo(() => {
    if (!showResult) return null;

    if (searchSvc === "epacket") {
      let dataKey = "";
      if (searchFrom === "VN") {
        if (searchCargo === "standard") dataKey = "vnThuong";
        else if (searchCargo === "cosmetic") dataKey = "vnMypham";
        else return {
          error: t("intl_pricing.err_battery_note")
        };
      } else {
        if (searchCargo === "standard") dataKey = "cnThuong";
        else if (searchCargo === "cosmetic") dataKey = "cnMypham";
        else if (searchCargo === "battery") dataKey = "cnPin";
      }

      const data = (larkOverlay[dataKey] as any[]) ?? [];
      if (!data.length) return { error: t("intl_pricing.err_updating") };

      // VN routes always use VND
      const isVndData = searchFrom === "VN";

      const row = data.find((r: any) => parseFloat(r.kg || r.weight) >= searchWeight);
      if (!row) return { error: t("intl_pricing.err_max_weight") };

      if (searchTo === "ALL") {
        const prices: number[] = [];
        Object.entries(row).forEach(([k, v]) => {
          if (k !== "kg" && k !== "weight" && typeof v === "number") prices.push(v);
        });
        if (!prices.length) return { error: t("intl_pricing.err_no_quote") };
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        if (isVndData) {
          return { type: "flat", text: min === max ? `${Math.round(min).toLocaleString("vi-VN")} ₫` : `${Math.round(min).toLocaleString("vi-VN")} ₫ - ${Math.round(max).toLocaleString("vi-VN")} ₫` };
        }
        return { type: "flat", text: min === max ? `$${min.toFixed(2)}` : `$${min.toFixed(2)} - $${max.toFixed(2)}` };
      } else {
        // Try exact key match, then lowercase, then substring match
        const searchKey = searchTo.toLowerCase();
        let v: any = row[searchKey];
        if (v === undefined) {
          // Try finding key that starts with searchKey (e.g. "us" matches "us-united_states")
          const matchedKey = Object.keys(row).find(k => k.toLowerCase().startsWith(searchKey + "-") || k.toLowerCase() === searchKey);
          if (matchedKey) v = row[matchedKey];
        }
        if (typeof v === "number") {
          if (isVndData) return { type: "flat", text: `${Math.round(v).toLocaleString("vi-VN")} ₫` };
          return { type: "flat", text: `$${v.toFixed(2)}` };
        }
        if (typeof v === "string" && v.includes("Liên hệ")) return { error: t("intl_pricing.err_contact_quote") };
        return { error: t("intl_pricing.err_no_country") };
      }
    }

    else if (searchSvc === "express") {
      // Express (Hàng Lô / Bulk) bookings ≥12 kg are quoted manually because the
      // rate depends on warehouse origin (HCM vs HN), carrier route, fuel surcharge
      // and seasonal adjustments. Always route the user to contact.
      if (searchWeight < 12) {
        return { error: t("intl_pricing.err_min_12kg") };
      }
      if (searchCargo === "battery") {
        return { error: t("intl_pricing.err_no_battery") };
      }
      if (searchFrom === "VN" && searchTo !== "US" && searchTo !== "ALL") {
        return { error: t("intl_pricing.err_vn_us_only") };
      }
      return { type: "contact", text: t("intl_pricing.err_contact") };
    }

    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFrom, searchTo, searchSvc, searchCargo, searchWeight, showResult, searchTrigger, larkOverlay]);
  return (
    <div className="min-h-screen bg-background pb-12 sm:pb-20">
      <SeoHead
        title="International Shipping Pricing — VN/CN to USA | THG Fulfill"
        description="Transparent international shipping rates from Vietnam and China to USA. UPS, Air & Sea routes. Updated weekly with real-time tracking and delivery estimates."
        path="/international-pricing"
      />
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://thgfulfill.com/" },
          { name: "International Pricing", url: "https://thgfulfill.com/international-pricing" },
        ]}
      />
      <Navbar />

      {/* ══════════ HERO ══════════ */}
      <HeroSection />

      {/* ══════════ VIDEO GIỚI THIỆU ══════════ */}
      <div className="max-w-[800px] mx-auto px-3 sm:px-6 pt-5 sm:pt-10 pb-1 sm:pb-2">
        <h2 className="text-center text-[13px] sm:text-[15px] font-bold text-navy mb-3 sm:mb-4">{t("intl_pricing.video_heading")}</h2>
        <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-[var(--pricing-border)]" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/pnA2doqMT-o"
            title="Giới thiệu tổng quan Bảng giá vận chuyển THG"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* ══════════ MAIN ══════════ */}
      <div className="max-w-[1100px] mx-auto px-2 sm:px-6 lg:px-12 py-4 sm:py-10 pb-12 sm:pb-20">

        {/* ──── SEARCH WIDGET ──── */}
        <SearchWidget
          searchFrom={searchFrom} setSearchFrom={setSearchFrom}
          searchTo={searchTo} setSearchTo={setSearchTo}
          searchSvc={searchSvc} setSearchSvc={setSearchSvc}
          searchCargo={searchCargo} setSearchCargo={setSearchCargo}
          searchWeight={searchWeight} setSearchWeight={setSearchWeight}
          showResult={showResult} handleSearch={handleSearch}
          searchCountries={searchCountries}
          estimatedPrice={estimatedPrice}
          searchTrigger={searchTrigger}
        />

        {/* ──── STEP 1: ORIGIN COUNTRY ──── */}
        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3 mt-2 sm:mt-4">
          <div className="flex-1 h-[1px] bg-[var(--pricing-border)]"></div>
          <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground whitespace-nowrap">
            {lang === 'zh' ? "第 1 步 — 选择发货国" : lang === 'en' ? "Step 1 — Choose Origin Country" : "Bước 1 — Chọn Quốc Gia Gửi Hàng"}
          </p>
          <div className="flex-1 h-[1px] bg-[var(--pricing-border)]"></div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-5 sm:mb-6">
          {([
            { id: "vn" as const, flag: "🇻🇳", title: lang === 'zh' ? "从越南发货" : lang === 'en' ? "Ship from Vietnam" : "Gửi từ Việt Nam", subtitle: "ePacket · Priority · Bulk-Express", border: "border-blue-500", bg: "bg-gradient-to-br from-blue-50 to-white", text: "text-blue-700", icon: "bg-blue-100" },
            { id: "cn" as const, flag: "🇨🇳", title: lang === 'zh' ? "从中国发货" : lang === 'en' ? "Ship from China" : "Gửi từ China", subtitle: "ePacket · Priority · Ship by Label · Bulk-Express", border: "border-rose-500", bg: "bg-gradient-to-br from-rose-50 to-white", text: "text-rose-700", icon: "bg-rose-100" },
          ]).map(card => {
            const active = origin === card.id;
            return (
              <button key={card.id} onClick={() => setOrigin(card.id)}
                className={`relative overflow-hidden border-2 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-left transition-all ${active ? `${card.border} ${card.bg} shadow-md` : "border-[var(--pricing-border)] bg-white hover:border-primary/40"}`}>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-2xl sm:text-3xl ${active ? card.icon : "bg-secondary"}`}>{card.flag}</div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-extrabold text-[14px] sm:text-[16px] leading-tight ${active ? card.text : "text-navy"}`}>{card.title}</div>
                    <div className="text-[11px] sm:text-[12px] text-muted-foreground mt-0.5 truncate">{card.subtitle}</div>
                  </div>
                  {active && <div className={`hidden sm:flex w-6 h-6 rounded-full items-center justify-center ${card.icon}`}><span className={`${card.text} text-sm font-bold`}>✓</span></div>}
                </div>
              </button>
            );
          })}
        </div>

        {/* ──── STEP 2: SERVICE TYPE ──── */}
        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
          <div className="flex-1 h-[1px] bg-[var(--pricing-border)]"></div>
          <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground whitespace-nowrap">
            {lang === 'zh' ? "第 2 步 — 选择服务类型" : lang === 'en' ? "Step 2 — Choose Service Type" : "Bước 2 — Chọn Loại Dịch Vụ"}
          </p>
          <div className="flex-1 h-[1px] bg-[var(--pricing-border)]"></div>
        </div>
        <div className="flex sm:flex-row gap-2 sm:gap-3 mb-5 sm:mb-8 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 -mx-2 px-2 sm:mx-0 sm:px-0">
          {([
            { id: "epacket" as ServiceTab, icon: "📦", name: tVi("pricing.svc_epa"), desc: tVi("pricing.tab_epa_desc") },
            { id: "express" as ServiceTab, icon: "🚢✈️", name: tVi("pricing.svc_exp"), desc: tVi("pricing.tab_exp_desc") },
            { id: "terms" as ServiceTab, icon: "📚", name: tVi("pricing.svc_terms"), desc: tVi("pricing.tab_terms_desc") }
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setService(tab.id)}
              className={`flex-shrink-0 sm:flex-1 border-[1.5px] sm:border-2 rounded-lg sm:rounded-xl px-3 py-2 sm:p-4 text-left transition-all relative overflow-hidden cursor-pointer ${service === tab.id
                ? "border-primary bg-[#FFFBF0]"
                : "border-[var(--pricing-border)] bg-white hover:border-primary/40"
                }`}
            >
              {service === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[2px] sm:h-[3px] bg-primary" />}
              <div className="flex items-center gap-1.5 sm:flex-col sm:items-start sm:gap-0">
                <div className="text-base sm:text-xl">{tab.icon}</div>
                <div className={`font-bold text-[13px] sm:text-[15px] whitespace-nowrap ${service === tab.id ? "text-primary" : "text-navy"}`}>{tab.name}</div>
              </div>
              <div className="text-[12px] sm:text-[13px] text-muted-foreground mt-1 hidden sm:block">{tab.desc}</div>
            </button>
          ))}
        </div>

        {/* ═══════════ PANEL: TERMINOLOGY ═══════════ */}
        {service === "terms" && <TerminologyPanel />}

        {/* ═══════════ PANEL: EPACKET ═══════════ */}
        {service === "epacket" && (
          <EpacketPanel
            route={route}
            cargo={cargo}
            handleRouteSwitch={handleRouteSwitch}
            handleCargoSwitch={handleCargoSwitch}
            routeConfig={ROUTES[route]}
            currentData={currentData}
            tableColumns={tableColumns}
            larkOverlay={larkOverlay}
            vatData={vatData}
            remoteSurcharge={remoteSurcharge}
            redeliveryData={redeliveryData}
            larkLoading={lark.loading}
            larkError={null}
            origin={origin}
            setOrigin={setOrigin}
          />
        )}

        {/* ═══════════ PANEL: EXPRESS / HÀNG LÔ ═══════════ */}
        {service === "express" && (
          <div>
            {/* Origin info banner */}
            <div className={`mb-4 sm:mb-5 rounded-xl border-[1.5px] p-3 sm:p-4 flex items-center gap-3 ${origin === "vn" ? "border-blue-200 bg-blue-50/40" : "border-rose-200 bg-rose-50/40"}`}>
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xl sm:text-2xl ${origin === "vn" ? "bg-blue-100" : "bg-rose-100"}`}>
                {origin === "vn" ? "🇻🇳" : "🇨🇳"}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-bold text-[13px] sm:text-[14px] ${origin === "vn" ? "text-blue-700" : "text-rose-700"}`}>
                  {origin === "vn"
                    ? (lang === 'zh' ? "VN → US (UPS Air)" : t("intl_pricing.vn_us_ups"))
                    : (lang === 'zh' ? "CN → US (空运 / 海运)" : t("intl_pricing.cn_us_air_sea"))}
                </div>
                <div className="text-[11px] sm:text-[12px] text-muted-foreground">
                  {origin === "vn" ? t("intl_pricing.vn_us_time") : t("intl_pricing.cn_us_time")}
                </div>
              </div>
              <span className={`hidden sm:inline-block text-[11px] sm:text-[12px] font-bold px-2 py-0.5 rounded-full ${origin === "vn" ? "bg-amber-50 text-amber-800" : "bg-blue-50 text-blue-700"}`}>
                {origin === "vn" ? t("intl_pricing.no_us_tax") : t("intl_pricing.air_sea")}
              </span>
            </div>

            {origin === "vn" && <ExpressVnUsPanel larkOverlay={larkOverlay} />}
            {origin === "cn" && <ExpressCnUsPanel route={route} />}
          </div>
        )}
      </div>

      <ContactSection />

    </div>
  );
};

export default InternationalPricingPage;
