import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { useI18n } from "@/lib/i18n";
import { pricingData } from "@/data/pricingData";


import { useLarkPricingContext, transformSheetToEpacketData, transformSheetToBulkData, transformSheetToVnUsExpress } from "@/components/pricing/LarkPricingProvider";


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
  const { tVi, effectiveLanguage: lang } = useI18n();
  const lark = useLarkPricingContext();

  // State
  const [service, setService] = useState<ServiceTab>("epacket");
  const [route, setRoute] = useState<EpacketRoute>("std-vn-ww");
  const [cargo, setCargo] = useState<CargoType>("standard");
  const [expressRoute, setExpressRoute] = useState<ExpressRoute>("vn-us");

  /* ─── Currency: raw from Lark Sheet, no conversion ─── */
  const rates: Record<string, number> | null = null;

  // ── Build a mapping of Lark sheet title → internal dataKey ──
  // Actual Lark titles look like "Epacket - Standard VN - WW (VNTHZXR)"
  const TITLE_TO_KEY: Array<{ match: (t: string) => boolean; key: string; type: "epacket" | "bulk" | "express" }> = [
    // ePacket sheets — MUST contain "epacket" to avoid matching Policy sheets
    { match: t => t.includes("epacket") && t.includes("standard vn") && t.includes("ww") && !t.includes("cosm") && !t.includes("cosmestic") && !t.includes("muz"), key: "vnThuong", type: "epacket" },
    { match: t => t.includes("epacket") && t.includes("standard vn") && (t.includes("cosm") || t.includes("muz")), key: "vnMypham", type: "epacket" },
    { match: t => t.includes("epacket") && t.includes("standard cn") && t.includes("regular"), key: "cnThuong", type: "epacket" },
    { match: t => t.includes("epacket") && t.includes("standard cn") && (t.includes("cosm") || t.includes("muzxr")), key: "cnMypham", type: "epacket" },
    { match: t => t.includes("epacket") && t.includes("standard cn") && (t.includes("battery") || t.includes("thzxr")), key: "cnPin", type: "epacket" },
    { match: t => t.includes("epacket") && t.includes("priority") && t.includes("usps") && t.includes("vn"), key: "uspsCn", type: "priority" as any },
    { match: t => t.includes("epacket") && t.includes("priority") && t.includes("usps") && !t.includes("vn"), key: "uspsCnUs", type: "priority" as any },
    // Express sheets
    { match: t => t.includes("express vn-us"), key: "expressVnUs", type: "express" },
    { match: t => t.includes("express cn-us"), key: "expressCnUs", type: "bulk" },
    // Ship by Label
    { match: t => t.includes("ship by label") && t.includes("cn"), key: "shipByLabelCnUs", type: "label" as any },
    // Misc
    { match: t => t.includes("re-delivery") || t.includes("redelivery"), key: "redeliveryData", type: "epacket" },
    // Remote area sheets
    { match: t => t.includes("us remote") || t.includes("u.s. remote"), key: "usRemoteSurcharge", type: "remote" as any },
    // EU Rate
    { match: t => t.includes("eu rate"), key: "euRate", type: "epacket" },
  ];

  const larkOverlay = useMemo(() => {
    if (!lark.sheets) return {};
    const overlay: Record<string, any> = {};

    Object.entries(lark.sheets).forEach(([_sheetId, sheet]) => {
      const title = sheet.title?.trim();
      if (!title || !sheet.data?.length) return;

      const titleLower = title.toLowerCase();

      // Find matching key from the title map
      const mapping = TITLE_TO_KEY.find(m => m.match(titleLower));
      if (!mapping) return;

      if (mapping.type === "express") {
        overlay[mapping.key] = transformSheetToVnUsExpress(sheet.data, rates);
      } else if (mapping.type === "bulk") {
        overlay[mapping.key] = transformSheetToBulkData(sheet.data);
      } else if ((mapping as any).type === "priority") {
        // ──── Priority USPS: single price column → { kg, rate } format ────
        const rows = sheet.data;
        if (!rows || rows.length < 2) return;
        // Detect if VND from the header (column 1 has something like "VN-US(VND)")
        const col1Header = String(rows[0]?.[1] ?? "").toLowerCase();
        const isVnd = col1Header.includes("vnd");
        // Data starts at row 1 (header at row 0, no sub-headers for Priority)
        const result: any[] = [];
        let lastWeight: number | null = null;
        for (let r = 1; r < rows.length; r++) {
          const rawKg = rows[r][0];
          const rawPrice = rows[r][1];
          if (rawKg === null || rawKg === undefined || rawKg === "") continue;
          // Parse weight (handle Lark formula refs)
          let w: number;
          if (typeof rawKg === "number") {
            w = rawKg;
          } else {
            const s = String(rawKg).replace(/,/g, "");
            const fm = s.match(/^([0-9.]+)\+[A-Za-z]/);
            if (fm && lastWeight !== null) {
              w = Math.round((lastWeight + parseFloat(fm[1])) * 1000) / 1000;
            } else {
              w = parseFloat(s.replace(/\+.*/, ""));
            }
          }
          if (isNaN(w)) continue;
          lastWeight = w;
          if (rawPrice === null || rawPrice === undefined || rawPrice === "") continue;
          let price = typeof rawPrice === "number" ? rawPrice : parseFloat(String(rawPrice).replace(/,/g, "").replace(/\$/g, ""));
          if (isNaN(price)) continue;
          // Keep raw price — VND stays VND, USD stays USD
          result.push({ kg: w, rate: price });
        }
        overlay[mapping.key] = result;
      } else if ((mapping as any).type === "label") {
        // Ship by Label: columns are Weight, Regular price (USD), Special price (USD)
        const rows = sheet.data;
        if (rows && rows.length > 1) {
          const regular: any[] = [];
          const special: any[] = [];
          for (let r = 1; r < rows.length; r++) {
            const kg = rows[r][0];
            if (kg === null || kg === undefined || kg === "") continue;
            const w = typeof kg === "number" ? kg : parseFloat(String(kg));
            if (isNaN(w)) continue;
            const regPrice = rows[r][1];
            const specPrice = rows[r][2];
            if (regPrice !== null && regPrice !== undefined && regPrice !== "") {
              regular.push({ kg: w, rate: typeof regPrice === "number" ? regPrice : parseFloat(String(regPrice)) });
            }
            if (specPrice !== null && specPrice !== undefined && specPrice !== "") {
              special.push({ kg: w, rate: typeof specPrice === "number" ? specPrice : parseFloat(String(specPrice)) });
            }
          }
          overlay[mapping.key] = { regular, special };
        }
      } else if ((mapping as any).type === "remote") {
        // ──── US Remote: parse Weight+Surcharge VND + Zipcode list ────
        const rows = sheet.data;
        if (!rows || rows.length < 3) return;
        const priceRows: any[] = [];
        const zipcodeRows: any[] = [];
        // Find header row (row 1 typically has "Weight (KG)" and "Remote Surcharge VND")
        let startRow = 2; // data starts at row 2 (row 0=title, row 1=header)
        for (let r = startRow; r < rows.length; r++) {
          const kg = rows[r][0];
          const surcharge = rows[r][1];
          if (kg !== null && kg !== undefined && kg !== '' && typeof kg === 'number') {
            priceRows.push({ kg, vnd: typeof surcharge === 'number' ? surcharge : 0 });
          }
          const zip = rows[r][3];
          const state = rows[r][4];
          if (zip !== null && zip !== undefined && zip !== '') {
            zipcodeRows.push({ zipcode: String(zip), state: String(state || '') });
          }
        }
        overlay[mapping.key] = { priceRows, zipcodeRows };
      } else {
        overlay[mapping.key] = transformSheetToEpacketData(sheet.data, rates);
      }
    });

    return overlay;
  }, [lark.sheets, rates]);

  // Get current data — prefer Lark overlay, fallback to hardcoded
  const currentData = useMemo(() => {
    if (route === "cn-us-label") return [];
    const dataKey = DATA_KEY_MAP[`${route}_${cargo}`];
    if (!dataKey) return [];
    // Check Lark overlay first
    if (larkOverlay[dataKey]?.length) return larkOverlay[dataKey];
    return (pricingData as any)[dataKey] || [];
  }, [route, cargo, larkOverlay]);



  // Get columns from data
  const tableColumns = useMemo(() => {
    if (!currentData || currentData.length === 0) return [];
    // For USPS data that uses 'rate' key
    if (currentData[0]?.rate !== undefined) {
      return [{ key: "rate", label: route === "pri-vncn-us" ? "Cước CN → US ($)" : "Cước ($)" }];
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



  /* ─── Extras data (Lark overlay → fallback) ─── */
  const rawVatData = larkOverlay.vatData?.length ? larkOverlay.vatData : ((pricingData as any).euRate || []).map((e: any) => ({ country: e.country, vat: e.vat, service: e.serviceCharge }));
  // Deduplicate: keep only the first occurrence of each country
  const vatData = rawVatData.filter((item: any, index: number, arr: any[]) =>
    arr.findIndex((v: any) => v.country === item.country) === index
  );
  /* Remote surcharge from Lark Sheet tab Wsz3Aw — VND converted to USD at ~22,650 VND/USD */
  const FALLBACK_REMOTE_SURCHARGE = [
    { kg: "0.05", usd: "1.95" },
    { kg: "0.1", usd: "1.95" },
    { kg: "0.15", usd: "2.25" },
    { kg: "0.2", usd: "2.25" },
    { kg: "0.25", usd: "2.85" },
    { kg: "0.3", usd: "2.85" },
    { kg: "0.35", usd: "3.15" },
    { kg: "0.4", usd: "3.15" },
    { kg: "0.45", usd: "3.50" },
    { kg: "0.5", usd: "3.50" },
    { kg: "0.6", usd: "4.00" },
    { kg: "0.7", usd: "4.50" },
    { kg: "0.8", usd: "5.00" },
    { kg: "0.9", usd: "5.50" },
    { kg: "1", usd: "6.00" },
    { kg: "1.5", usd: "7.51" },
    { kg: "2", usd: "8.50" },
    { kg: "2.5", usd: "9.80" },
    { kg: "3", usd: "10.50" },
    { kg: "3.5", usd: "11.30" },
    { kg: "4", usd: "11.80" },
    { kg: "4.5", usd: "12.00" },
    { kg: "5", usd: "12.16" },
    { kg: "6", usd: "14.50" },
    { kg: "7", usd: "16.80" },
    { kg: "8", usd: "19.10" },
    { kg: "9", usd: "21.40" },
    { kg: "10", usd: "24.17" },
    { kg: "11", usd: "26.90" },
    { kg: "12", usd: "29.60" },
    { kg: "13", usd: "32.30" },
    { kg: "14", usd: "35.00" },
    { kg: "15", usd: "37.70" },
    { kg: "16", usd: "40.50" },
    { kg: "17", usd: "43.30" },
    { kg: "18", usd: "46.00" },
    { kg: "19", usd: "48.80" },
    { kg: "20", usd: "63.35" },
    { kg: "21", usd: "66.05" },
    { kg: "22", usd: "68.80" },
    { kg: "23", usd: "71.50" },
    { kg: "24", usd: "74.25" },
    { kg: "25", usd: "77.00" },
    { kg: "26", usd: "79.70" },
    { kg: "27", usd: "82.45" },
    { kg: "28", usd: "85.15" },
    { kg: "29", usd: "85.50" },
    { kg: "30", usd: "87.82" },
  ];
  const remoteSurcharge = larkOverlay.remoteSurcharge?.length ? larkOverlay.remoteSurcharge : (pricingData as any).remoteSurcharge?.length ? (pricingData as any).remoteSurcharge : FALLBACK_REMOTE_SURCHARGE;
  /* Re-delivery fees from Lark Sheet — by country/region */
  const FALLBACK_REDELIVERY = [
    { dest: "Canada", charge: "355,697 VND (for first 1KG) + 56,342 VND/KG (for each additional kg)", period: "20 days" },
    { dest: "Mexico", charge: "108,252 VND/parcel", period: "15 days" },
    { dest: "Switzerland", charge: "216,820 VND/parcel", period: "14 days" },
    { dest: "France", charge: "216,820 VND/parcel", period: "14 days" },
    { dest: "Norway", charge: "216,820 VND/parcel", period: "14 days" },
    { dest: "Australia", charge: "216,820 VND/parcel", period: "14 days" },
    { dest: "Saudi Arabia", charge: "268,729 VND/parcel (≤5KG) + 32,286 VND/KG (over 5KG)", period: "15 days" },
    { dest: "United Arab Emirates", charge: "126,610 VND/parcel (≤5KG) + 32,286 VND/KG (over 5KG)", period: "15 days" },
    { dest: "Japan", charge: "173,455 VND/parcel", period: "14 days" },
    { dest: "Hong Kong", charge: "A new YT tracking number will be generated for re-delivery, and the re-delivery fee will be charged at the VN-HK freight rate.", period: "14 days" },
    { dest: "United Kingdom", charge: "173,455 VND/parcel", period: "14 days" },
    { dest: "Singapore", charge: "260,183 VND/parcel", period: "14 days" },
    { dest: "Brazil", charge: "260,183 VND/parcel", period: "14 days" },
    { dest: "Malta, Cyprus, Slovenia, Croatia, Romania, Bulgaria, Chile", charge: "Re-delivery service is NOT provided", period: "—" },
    { dest: "Other countries except above mentioned country", charge: "237,394 VND/parcel", period: "14 days" },
  ];
  const redeliveryData = larkOverlay.redeliveryData?.length ? larkOverlay.redeliveryData : (pricingData as any).redelivery?.length ? (pricingData as any).redelivery : FALLBACK_REDELIVERY;

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
    const data = larkOverlay[dataKey]?.length ? larkOverlay[dataKey] : (pricingData as any)[dataKey] || [];
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
          error: lang === 'zh'
            ? '电池产品可通过 "Standard VN-WW" 渠道发货，但请参阅附带的运输政策了解具体要求。'
            : lang === 'en'
              ? 'Battery products can be shipped via the "Standard VN-WW" channel; however, please refer to the attached Shipping Policy for specific requirements.'
              : 'Hàng Pin Điện có thể vận chuyển qua kênh "Standard VN-WW"; tuy nhiên, vui lòng tham khảo Chính sách Vận chuyển đính kèm để biết yêu cầu cụ thể.'
        };
      } else {
        if (searchCargo === "standard") dataKey = "cnThuong";
        else if (searchCargo === "cosmetic") dataKey = "cnMypham";
        else if (searchCargo === "battery") dataKey = "cnPin";
      }

      const data = larkOverlay[dataKey]?.length ? larkOverlay[dataKey] : (pricingData as any)[dataKey] || [];
      if (!data.length) return { error: "Dữ liệu đang cập nhật" };

      // Detect if data is VND (VN routes from Lark)
      // VN routes always use VND (both Lark overlay and pricingData)
      const isVndData = searchFrom === "VN";

      const row = data.find((r: any) => parseFloat(r.kg || r.weight) >= searchWeight);
      if (!row) return { error: "Vượt quá cân nặng tối đa" };

      if (searchTo === "ALL") {
        const prices: number[] = [];
        Object.entries(row).forEach(([k, v]) => {
          if (k !== "kg" && k !== "weight" && typeof v === "number") prices.push(v);
        });
        if (!prices.length) return { error: "Chưa có báo giá" };
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
        if (typeof v === "string" && v.includes("Liên hệ")) return { error: "Tuyến này vui lòng Liên hệ THG báo giá" };
        return { error: "Chưa có báo giá cho quốc gia này" };
      }
    }

    else if (searchSvc === "express") {
      if (searchFrom === "CN") {
        return { type: "contact", text: "Liên hệ THG báo giá theo lô" };
      }

      if (searchTo !== "US" && searchTo !== "ALL") {
        return { error: "VN Express hiện chỉ hỗ trợ tuyến US" };
      }

      let dataKey = "";
      if (searchCargo === "standard") dataKey = "loThuong";
      else if (searchCargo === "cosmetic") dataKey = "loMypham";
      else return { error: "VN Express không hỗ trợ hàng Pin" };

      const data = (pricingData as any)[dataKey] || [];
      if (!data.length) return { error: "Dữ liệu đang cập nhật" };

      if (searchWeight < 12) {
        return { error: "Hàng Lô Express yêu cầu mức tối thiểu 12 KG" };
      }

      const rates: number[] = [];
      data.forEach((zoneObj: any) => {
        const prices = zoneObj.prices;
        if (!prices) return;
        const weightTiers = Object.keys(prices).map(Number).sort((a, b) => a - b);
        let applicableTier = weightTiers[0];
        for (const t of weightTiers) {
          if (t <= searchWeight) applicableTier = t;
        }
        const r = prices[applicableTier.toString()];
        if (typeof r === "number") rates.push(r);
      });

      if (!rates.length) return { error: "Chưa có báo giá" };

      const minRate = Math.min(...rates);
      const maxRate = Math.max(...rates);

      const minPrice = minRate * searchWeight;
      const maxPrice = maxRate * searchWeight;

      return {
        type: "kg",
        text: minPrice === maxPrice ? `$${minPrice.toFixed(2)}` : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`
      };
    }

    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFrom, searchTo, searchSvc, searchCargo, searchWeight, showResult, searchTrigger, larkOverlay]);
  return (
    <div className="min-h-screen bg-background pb-12 sm:pb-20">
      <Navbar />

      {/* ══════════ HERO ══════════ */}
      <HeroSection />

      {/* ══════════ VIDEO GIỚI THIỆU ══════════ */}
      <div className="max-w-[800px] mx-auto px-3 sm:px-6 pt-5 sm:pt-10 pb-1 sm:pb-2">
        <h2 className="text-center text-[13px] sm:text-[15px] font-bold text-navy mb-3 sm:mb-4">🎬 Giới thiệu tổng quan Bảng giá vận chuyển</h2>
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

        {/* ──── SERVICE TABS (Level 1) ──── */}
        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3 mt-2 sm:mt-4">
          <div className="flex-1 h-[1px] bg-[var(--pricing-border)]"></div>
          <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground whitespace-nowrap">{tVi("pricing.tab_header")}</p>
          <div className="flex-1 h-[1px] bg-[var(--pricing-border)]"></div>
        </div>
        {/* Mobile: horizontal scrollable pills | Desktop: full cards */}
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
            larkError={lark.error}
          />
        )}

        {/* ═══════════ PANEL: EXPRESS / HÀNG LÔ ═══════════ */}
        {service === "express" && (
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-2 sm:mb-3">CHỌN TUYẾN</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 sm:mb-5">
              <button
                onClick={() => setExpressRoute("vn-us")}
                className={`flex flex-col gap-0.5 sm:gap-1 border-[1.5px] rounded-lg sm:rounded-[10px] p-2.5 sm:p-3 text-left transition-all ${expressRoute === "vn-us" ? "border-primary bg-[#FFFBF0]" : "border-[var(--pricing-border)] bg-white hover:border-primary/40"}`}
              >
                <span className={`font-bold text-[12px] sm:text-[13px] ${expressRoute === "vn-us" ? "text-primary" : "text-navy"}`}>🇻🇳 VN → US (UPS)</span>
                <span className="text-[11px] sm:text-[12px] text-muted-foreground">⏱ 3–7 BSD</span>
                <span className="text-[11px] sm:text-[12px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 w-fit">⚠️ Chưa gồm tax NK US</span>
              </button>
              <button
                onClick={() => setExpressRoute("cn-us")}
                className={`flex flex-col gap-0.5 sm:gap-1 border-[1.5px] rounded-lg sm:rounded-[10px] p-2.5 sm:p-3 text-left transition-all ${expressRoute === "cn-us" ? "border-primary bg-[#FFFBF0]" : "border-[var(--pricing-border)] bg-white hover:border-primary/40"}`}
              >
                <span className={`font-bold text-[12px] sm:text-[13px] ${expressRoute === "cn-us" ? "text-primary" : "text-navy"}`}>🇨🇳 CN → US (Air & Sea)</span>
                <span className="text-[11px] sm:text-[12px] text-muted-foreground">⏱ 6–25 BSD</span>
                <span className="text-[11px] sm:text-[12px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 w-fit">✈️ Air · 🚢 Sea</span>
              </button>
            </div>

            {expressRoute === "vn-us" && (
              <ExpressVnUsPanel larkOverlay={larkOverlay} />
            )}

            {expressRoute === "cn-us" && (
              <ExpressCnUsPanel route={route} />
            )}
          </div>
        )}
      </div>

      <ContactSection />
      <Footer />
    </div>
  );
};

export default InternationalPricingPage;
