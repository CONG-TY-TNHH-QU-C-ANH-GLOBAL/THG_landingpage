import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import { pricingData } from "@/data/pricingData";
import { countryNames } from "@/data/pricingHelpers";
import { ChevronDown, ChevronUp, Search, ExternalLink } from "lucide-react";

/* ═══════════════════════════════════════════════
   TYPES & CONFIG
   ═══════════════════════════════════════════════ */
type ServiceTab = "epacket" | "express";
type EpacketRoute = "std-vn-ww" | "std-cn-ww" | "pri-vncn-us" | "cn-us-label";
type ExpressRoute = "vn-us" | "cn-us";
type CargoType = "standard" | "cosmetics" | "battery";

const ROUTES: Record<EpacketRoute, { name: string; nameVi: string; time: string; cargo: CargoType[]; type: string }> = {
  "std-vn-ww": { name: "Standard VN → Worldwide", nameVi: "🇻🇳 Standard VN → Worldwide", time: "⏱ 5–12 BSD", cargo: ["standard", "cosmetics"], type: "merchant" },
  "std-cn-ww": { name: "Standard CN → Worldwide", nameVi: "🇨🇳 Standard CN → Worldwide", time: "⏱ 6–12 BSD", cargo: ["standard", "cosmetics", "battery"], type: "merchant" },
  "pri-vncn-us": { name: "Priority VN/CN → US", nameVi: "🇻🇳/🇨🇳 Priority VN/CN → US", time: "⏱ 5–10 BSD", cargo: ["standard"], type: "merchant" },
  "cn-us-label": { name: "CN → US Ship by Label", nameVi: "🇨🇳 CN → US Ship by Label", time: "⏱ Theo lịch USPS", cargo: [], type: "label" },
};

const CARGO_LABELS: Record<CargoType, string> = { standard: "Hàng Thường", cosmetics: "Mỹ Phẩm", battery: "Pin Điện" };
const CARGO_ICONS: Record<CargoType, string> = { standard: "📦", cosmetics: "💄", battery: "🔋" };

const DATA_KEY_MAP: Record<string, string> = {
  "std-vn-ww_standard": "vnThuong",
  "std-vn-ww_cosmetics": "vnMypham",
  "std-cn-ww_standard": "cnThuong",
  "std-cn-ww_cosmetics": "cnMypham",
  "std-cn-ww_battery": "cnPin",
  "pri-vncn-us_standard": "uspsCn",
};

/* ═══════════════════════════════════════════════
   ACCORDION COMPONENT
   ═══════════════════════════════════════════════ */
const Accordion = ({ icon, title, defaultOpen = false, children }: { icon: string; title: string; defaultOpen?: boolean; children: React.ReactNode }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden shadow-sm">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#FAFAF8] transition-colors">
        <span className="flex items-center gap-2.5 font-bold text-sm text-navy">
          <span className="text-lg">{icon}</span> {title}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t border-[var(--pricing-border)] px-5 py-4">{children}</div>}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   PRICE TABLE COMPONENT
   ═══════════════════════════════════════════════ */
const PriceTable = ({ title, badge, note, data, columns }: {
  title: string; badge?: string; note?: string;
  data: any[]; columns: { key: string; label: string }[];
}) => {
  const { tVi } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  if (!data || data.length === 0) return null;

  const displayData = isExpanded ? data : data.slice(0, 6);

  return (
    <div className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden shadow-sm">
      <div className="bg-navy px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white font-bold text-xs">📋 {title}</span>
          {badge && <span className="bg-[rgba(184,146,42,0.25)] text-[#D4A843] text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
        </div>
        {note && <span className="text-[#9CA3AF] text-[10px]">{note}</span>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-[#FAFAF8]">
              <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-[var(--pricing-border)] whitespace-nowrap">Cân Nặng (KG)</th>
              {columns.map(c => (
                <th key={c.key} className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-[var(--pricing-border)] whitespace-nowrap">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.map((row: any, i: number) => (
              <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                <td className="px-3 py-1.5 font-medium whitespace-nowrap">{row.kg ?? row.weight ?? "—"}</td>
                {columns.map(c => {
                  const val = row[c.key];
                  const isNull = val === null || val === undefined;
                  const isContact = typeof val === 'string' && val.includes('Liên hệ');
                  return (
                    <td key={c.key} className={`px-3 py-1.5 whitespace-nowrap ${isNull ? "text-muted-foreground/30" : isContact ? "text-primary font-bold" : "font-bold"}`}>
                      {isNull ? (
                        <span className="inline-block px-1.5 py-0 bg-muted/20 rounded text-[10px] backdrop-blur-sm">—</span>
                      ) : typeof val === "number" ? (
                        `$${val.toFixed(2)}`
                      ) : val}
                    </td>
                  );
                })}
              </tr>
            ))}
            {!isExpanded && data.length > 6 && (
              <tr>
                <td colSpan={100} className="p-0 border-t border-[var(--pricing-border)]">
                  <button onClick={() => setIsExpanded(true)} className="w-full py-2.5 text-xs font-bold text-primary hover:bg-[#FFFBF0] transition-colors flex items-center justify-center gap-1">
                    {tVi("pricing.btn_expand").replace("{count}", (data.length - 6).toString())} <ChevronDown size={14} />
                  </button>
                </td>
              </tr>
            )}
            {isExpanded && data.length > 6 && (
              <tr>
                <td colSpan={100} className="p-0 border-t border-[var(--pricing-border)]">
                  <button onClick={() => setIsExpanded(false)} className="w-full py-2.5 text-xs font-bold text-primary hover:bg-[#FFFBF0] transition-colors flex items-center justify-center gap-1">
                    {tVi("pricing.btn_collapse")} <ChevronUp size={14} />
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   COMPACT ACCORDION TABLE CONTROLLER
   ═══════════════════════════════════════════════ */
const CompactAccordionTable = ({ headers, data, renderRow }: { headers: string[], data: any[], renderRow: (row: any, i: number) => React.ReactNode }) => {
  const { tVi } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  if (!data || data.length === 0) return null;
  const displayData = isExpanded ? data : data.slice(0, 6);

  return (
    <table className="w-full border-collapse text-xs">
      <thead>
        <tr className="bg-[#FAFAF8]">
          {headers.map((h, i) => (
            <th key={i} className="px-3 py-2 text-left text-[10px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)] whitespace-nowrap">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {displayData.map((row, i) => renderRow(row, i))}
        {!isExpanded && data.length > 6 && (
          <tr>
            <td colSpan={100} className="p-0 border-t border-[var(--pricing-border)]">
              <button onClick={() => setIsExpanded(true)} className="w-full py-2.5 text-xs font-bold text-primary hover:bg-[#FFFBF0] transition-colors flex items-center justify-center gap-1">
                {tVi("pricing.btn_expand").replace("{count}", (data.length - 6).toString())} <ChevronDown size={14} />
              </button>
            </td>
          </tr>
        )}
        {isExpanded && data.length > 6 && (
          <tr>
            <td colSpan={100} className="p-0 border-t border-[var(--pricing-border)]">
              <button onClick={() => setIsExpanded(false)} className="w-full py-2.5 text-xs font-bold text-primary hover:bg-[#FFFBF0] transition-colors flex items-center justify-center gap-1">
                {tVi("pricing.btn_collapse")} <ChevronUp size={14} />
              </button>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */
const InternationalPricingPage = () => {
  const { t, tVi } = useI18n();

  // State
  const [service, setService] = useState<ServiceTab>("epacket");
  const [route, setRoute] = useState<EpacketRoute>("std-vn-ww");
  const [cargo, setCargo] = useState<CargoType>("standard");
  const [expressRoute, setExpressRoute] = useState<ExpressRoute>("vn-us");
  const [city, setCity] = useState<"hcm" | "hn">("hcm");

  // Get current data
  const currentData = useMemo(() => {
    if (route === "cn-us-label") return [];
    const dataKey = DATA_KEY_MAP[`${route}_${cargo}`];
    if (!dataKey) return [];
    return (pricingData as any)[dataKey] || [];
  }, [route, cargo]);

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
    return Array.from(keys).map(k => ({
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

  const routeConfig = ROUTES[route];

  /* ─── Extras data ─── */
  const vatData = (pricingData as any).vatData || [];
  const remoteSurcharge = (pricingData as any).remoteSurcharge || [];
  const redeliveryData = (pricingData as any).redeliveryData || [];

  /* ─── Express data ─── */
  const loThuong = (pricingData as any).loThuong || [];
  const loPin = (pricingData as any).loPin || [];
  const loMypham = (pricingData as any).loMypham || [];

  /* ─── Search Widget State ─── */
  const [searchFrom, setSearchFrom] = useState("VN");
  const [searchTo, setSearchTo] = useState("ALL");
  const [searchSvc, setSearchSvc] = useState("epacket");
  const [searchCargo, setSearchCargo] = useState("standard");
  const [searchWeight, setSearchWeight] = useState(1);
  const [showResult, setShowResult] = useState(false);

  const handleSearch = () => {
    setShowResult(true);
  };

  const estimatedPrice = useMemo(() => {
    if (!showResult) return null;

    if (searchSvc === "epacket") {
      let dataKey = "";
      if (searchFrom === "VN") {
        if (searchCargo === "standard") dataKey = "vnThuong";
        else if (searchCargo === "cosmetic") dataKey = "vnMypham";
        else return { error: "VN không hỗ trợ mã Pin Epacket. Vui lòng chọn gửi từ CN." };
      } else {
        if (searchCargo === "standard") dataKey = "cnThuong";
        else if (searchCargo === "cosmetic") dataKey = "cnMypham";
        else if (searchCargo === "battery") dataKey = "cnPin";
      }

      const data = (pricingData as any)[dataKey] || [];
      if (!data.length) return { error: "Dữ liệu đang cập nhật" };

      const row = data.find((r: any) => parseFloat(r.kg || r.weight) >= searchWeight);
      if (!row) return { error: "Vượt quá cân nặng tối đa của Epacket (thường là 2-3kg)" };

      if (searchTo === "ALL") {
        const prices: number[] = [];
        Object.entries(row).forEach(([k, v]) => {
          if (k !== "kg" && k !== "weight" && typeof v === "number") prices.push(v);
        });
        if (!prices.length) return { error: "Chưa có báo giá" };
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return { type: "flat", text: min === max ? `$${min.toFixed(2)}` : `$${min.toFixed(2)} - $${max.toFixed(2)}` };
      } else {
        const key = searchTo.toLowerCase();
        const v = row[key];
        if (typeof v === "number") return { type: "flat", text: `$${v.toFixed(2)}` };
        if (typeof v === "string" && v.includes("Liên hệ")) return { error: "Tuyển này vui lòng Liên hệ THG báo giá" };
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
  }, [searchFrom, searchTo, searchSvc, searchCargo, searchWeight, showResult]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />

      {/* ══════════ HERO ══════════ */}
      <section className="bg-gradient-to-b from-[hsl(36_30%_96%)] to-[hsl(36_25%_93%)] pt-28 pb-10 text-center border-b border-[var(--pricing-border)]">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <span className="inline-block bg-[#F3EDD8] text-primary border border-[#E8D9A0] text-[11px] font-bold tracking-widest uppercase px-4 py-1 rounded-full mb-4">
              BẢNG GIÁ QUỐC TẾ
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-3">
              Tra cứu cước <span className="text-gradient-gold font-sans font-bold">vận chuyển quốc tế</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Bảng giá minh bạch, cập nhật real-time cho tất cả tuyến vận chuyển từ Việt Nam & Trung Quốc.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════ MAIN ══════════ */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-12 py-10 pb-20">

        {/* ──── SEARCH WIDGET (Added per task) ──── */}
        <div className="bg-white rounded-2xl p-6 mb-10 border border-[var(--pricing-border)] overflow-visible shadow-lg shadow-black/5 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-2 tracking-widest">{tVi("pricing.search_from")}</label>
              <select
                value={searchFrom} onChange={(e) => setSearchFrom(e.target.value)}
                className="w-full h-[46px] bg-white border border-[var(--pricing-border)] rounded-lg px-4 text-sm font-medium outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
              >
                <option value="VN">{tVi("pricing.opt_vn")}</option>
                <option value="CN">{tVi("pricing.opt_cn")}</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-2 tracking-widest">{tVi("pricing.search_to")}</label>
              <select
                value={searchTo} onChange={(e) => setSearchTo(e.target.value)}
                className="w-full h-[46px] bg-white border border-[var(--pricing-border)] rounded-lg px-4 text-sm font-medium outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
              >
                <option value="ALL">{tVi("pricing.opt_all")}</option>
                <option value="US">{tVi("pricing.opt_us")}</option>
                <option value="UK">{tVi("pricing.opt_uk")}</option>
                <option value="DE">{tVi("pricing.opt_de")}</option>
                <option value="FR">{tVi("pricing.opt_fr")}</option>
                <option value="AU">{tVi("pricing.opt_au")}</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-2 tracking-widest">{tVi("pricing.search_svc")}</label>
              <select
                value={searchSvc} onChange={(e) => setSearchSvc(e.target.value)}
                className="w-full h-[46px] bg-white border border-[var(--pricing-border)] rounded-lg px-4 text-sm font-medium outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
              >
                <option value="epacket">{tVi("pricing.svc_epa")}</option>
                <option value="express">{tVi("pricing.svc_exp")}</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-2 tracking-widest">{tVi("pricing.search_cargo")}</label>
              <select
                value={searchCargo} onChange={(e) => setSearchCargo(e.target.value)}
                className="w-full h-[46px] bg-white border border-[var(--pricing-border)] rounded-lg px-4 text-sm font-medium outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
              >
                <option value="standard">{tVi("pricing.cargo_std")}</option>
                <option value="cosmetic">{tVi("pricing.cargo_cos")}</option>
                <option value="battery">{tVi("pricing.cargo_bat")}</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-2 tracking-widest">{tVi("pricing.search_weight")}</label>
              <input
                type="number" value={searchWeight} onChange={(e) => setSearchWeight(e.target.value ? Number(e.target.value) : 1)} min="0.1" step="0.5"
                placeholder="Vd: 1"
                className="w-full h-[46px] bg-white border border-[var(--pricing-border)] rounded-lg px-4 text-sm font-medium outline-none focus:border-gold transition-colors"
              />
            </div>

            <div className="w-full lg:w-auto mt-2 lg:mt-0">
              <button
                onClick={handleSearch}
                className="w-full lg:w-[130px] h-[46px] bg-[#161B29] hover:bg-[#1f2638] text-white rounded-lg text-[13px] font-bold tracking-wide transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-[#8B5CF6] text-lg">🔍</span> {tVi("pricing.search_btn")}
              </button>
            </div>
          </div>
        </div>

        {/* Display Search Results Demo */}
        {showResult && (
          <div className="mb-10 bg-white border-[1.5px] border-[var(--pricing-border)] border-dashed rounded-xl p-6 shadow-sm overflow-hidden animate-fade-in relative z-10 mx-auto max-w-[1000px]">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block bg-[rgba(184,146,42,0.15)] text-[#B8922A] text-[10px] font-bold tracking-[0.1em] px-3 py-1 rounded-full uppercase mb-4">
                  {tVi("pricing.res_title")} · {searchSvc === 'epacket' ? tVi("pricing.svc_epa") : tVi("pricing.svc_exp")}
                </div>
                <h3 className="text-xl md:text-2xl font-black text-navy flex items-center justify-center md:justify-start gap-3">
                  {searchFrom === 'VN' ? tVi("pricing.opt_vn") : tVi("pricing.opt_cn")}
                  <span className="text-gray-400">✈️</span>
                  {searchTo === 'ALL' ? tVi("pricing.opt_all") : tVi("pricing.opt_us")}
                </h3>
                <div className="mt-3 flex justify-center md:justify-start gap-4 text-sm text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5"><span className="text-navy">⚖️</span> {searchWeight} KG</span>
                  <span className="flex items-center gap-1.5"><span className="text-navy">⏱</span> {tVi("pricing.res_days")}</span>
                </div>
              </div>
              <div className="bg-[#FAFAF8] border border-[var(--pricing-border)] rounded-lg p-5 min-w-[240px] text-center shadow-sm flex flex-col justify-center">
                {estimatedPrice?.error ? (
                  <div className="text-red-500 font-bold text-[13px]">{estimatedPrice.error}</div>
                ) : estimatedPrice?.type === "contact" ? (
                  <div className="text-primary font-bold text-lg">{estimatedPrice.text}</div>
                ) : (
                  <>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] mb-1">{tVi("pricing.res_base")}</div>
                    <div className="text-3xl font-black text-navy drop-shadow-sm"><span className="text-gold text-2xl align-top mr-1 font-bold"></span>{estimatedPrice?.text}</div>
                    <div className="text-[11px] text-muted-foreground mt-2 italic">{tVi("pricing.res_note")}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ──── SERVICE TABS (Level 1) ──── */}
        <div className="flex items-center gap-4 mb-3 mt-4">
          <div className="flex-1 h-[1px] bg-[var(--pricing-border)]"></div>
          <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground whitespace-nowrap">{tVi("pricing.tab_header")}</p>
          <div className="flex-1 h-[1px] bg-[var(--pricing-border)]"></div>
        </div>
        <div className="flex gap-3 mb-8">
          {([
            { id: "epacket" as ServiceTab, icon: "📦", name: tVi("pricing.svc_epa"), desc: tVi("pricing.tab_epa_desc") },
            { id: "express" as ServiceTab, icon: "🚢✈️", name: tVi("pricing.svc_exp"), desc: tVi("pricing.tab_exp_desc") },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setService(tab.id)}
              className={`flex-1 max-w-[300px] border-2 rounded-xl p-4 text-left transition-all relative overflow-hidden cursor-pointer ${service === tab.id
                ? "border-primary bg-[#FFFBF0]"
                : "border-[var(--pricing-border)] bg-white hover:border-primary/40"
                }`}
            >
              {service === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary" />}
              <div className="text-xl mb-1">{tab.icon}</div>
              <div className={`font-bold text-[15px] ${service === tab.id ? "text-primary" : "text-navy"}`}>{tab.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{tab.desc}</div>
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════
            PANEL: EPACKET
           ═══════════════════════════════ */}
        {service === "epacket" && (
          <div>
            {/* ──── ROUTE TABS (Level 2) ──── */}
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">CHỌN TUYẾN VẬN CHUYỂN</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-5">
              {(Object.entries(ROUTES) as [EpacketRoute, typeof ROUTES[EpacketRoute]][]).map(([rid, r]) => (
                <button
                  key={rid}
                  onClick={() => handleRouteSwitch(rid)}
                  className={`flex flex-col gap-1 border-[1.5px] rounded-[10px] p-3 text-left transition-all ${route === rid
                    ? "border-primary bg-[#FFFBF0]"
                    : "border-[var(--pricing-border)] bg-white hover:border-primary/40"
                    }`}
                >
                  <span className={`font-bold text-xs truncate ${route === rid ? "text-primary" : "text-navy"}`}>{r.nameVi}</span>
                  <span className="text-[10px] text-muted-foreground">{r.time}</span>
                  <div className="flex gap-1 flex-wrap mt-0.5">
                    {r.type === "merchant" && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">🛒 Ship by Merchant</span>}
                    {r.type === "label" && (
                      <>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">🏷️ Ship by Label</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700">📬 Drop-off USPS</span>
                      </>
                    )}
                    {rid === "pri-vncn-us" && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">✅ Bao thuế · Active USPS</span>}
                    {r.cargo.length > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                        {r.cargo.map(c => CARGO_ICONS[c]).join(" ")} {r.cargo.map(c => CARGO_LABELS[c]).join(" · ")}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* ──── Ship by Label info panel ──── */}
            {route === "cn-us-label" ? (
              <div>
                <div className="bg-white border border-[var(--pricing-border)] rounded-xl p-6 shadow-sm">
                  <h3 className="font-extrabold text-base text-navy mb-2">🏷️ CN – US Ship by Label</h3>
                  <p className="text-muted-foreground text-[13px] mb-3">
                    Dịch vụ dành cho đơn hàng <strong>đã có sẵn shipping label</strong> từ TikTok Shop và Marketplace.
                  </p>
                  <div className="bg-[#FEF9EC] border border-[#F59E0B] rounded-[10px] p-4 text-[12px] text-[#92400E] mb-4 flex gap-2">
                    <span>⚠️</span>
                    <div>
                      <strong>Lưu ý:</strong> Hàng vận chuyển từ Trung Quốc đến <strong>bưu cục USPS</strong> tại Mỹ — USPS thực hiện last-mile delivery. <strong>Không giao tận tay người nhận.</strong>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { label: "Điều kiện", value: "Phải có label hợp lệ" },
                      { label: "Chặng cuối", value: "USPS Last-mile" },
                      { label: "Phù hợp", value: "TikTok Shop, Marketplace" },
                    ].map(item => (
                      <div key={item.label} className="bg-[#F7F5F0] rounded-lg p-3 flex-1 min-w-[140px]">
                        <div className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground mb-1">{item.label}</div>
                        <div className="text-[13px] font-semibold text-navy">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TikTok sub-tabs */}
                <TikTokPanel />
              </div>
            ) : (
              <>
                {/* ──── CARGO FILTER ──── */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Loại hàng:</span>
                  <div className="flex gap-2 flex-wrap">
                    {(["standard", "cosmetics", "battery"] as CargoType[]).map(c => {
                      const enabled = routeConfig.cargo.includes(c);
                      return (
                        <button
                          key={c}
                          onClick={() => handleCargoSwitch(c)}
                          disabled={!enabled}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold border-[1.5px] transition-all ${!enabled
                            ? "opacity-30 cursor-not-allowed border-[var(--pricing-border)] bg-white"
                            : cargo === c
                              ? "bg-primary border-primary text-white"
                              : "border-[var(--pricing-border)] bg-white hover:border-primary hover:text-primary"
                            }`}
                        >
                          {CARGO_ICONS[c]} {CARGO_LABELS[c]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ──── ANNOTATION ──── */}
                <div className="bg-[#FFFBEE] border-[1.5px] border-dashed border-[#D4A843] rounded-[10px] p-3 text-[12px] text-[#92670A] mb-4 flex gap-2">
                  <span>ℹ️</span>
                  <div>
                    <strong>Đang hiển thị:</strong> Epacket · {routeConfig.name} · {CARGO_LABELS[cargo]} — Giao tận tay khách hàng tại quốc gia đích. Giá chưa bao gồm phụ phí vùng sâu & VAT.
                  </div>
                </div>

                {/* ──── PRICE TABLE ──── */}
                <PriceTable
                  title="Bảng Giá Chi Tiết"
                  badge={`${routeConfig.name} · ${CARGO_LABELS[cargo]}`}
                  note="Cập nhật: 29/03/2026"
                  data={currentData}
                  columns={tableColumns}
                />

                {/* ──── POST-TABLE ACCORDIONS ──── */}
                <div className="flex flex-col gap-3 mt-6">
                  {/* 1. Surcharges */}
                  <Accordion icon="💰" title="Phụ Phí & Dịch Vụ Khác" defaultOpen>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-[13px] text-navy mb-2">📍 Phụ Phí Vùng Sâu (Remote Area)</h4>
                        {remoteSurcharge.length > 0 ? (
                          <CompactAccordionTable
                            headers={["Zone", "Surcharge ($)"]}
                            data={remoteSurcharge}
                            renderRow={(r, i) => (
                              <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                                <td className="px-3 py-2"><span className="notranslate">{r.zone || r.name || `Zone ${i + 1}`}</span></td>
                                <td className="px-3 py-2 font-bold">{r.usd ? `$${r.usd}` : "Liên hệ THG"}</td>
                              </tr>
                            )}
                          />
                        ) : (
                          <p className="text-muted-foreground text-xs italic">Dữ liệu đang cập nhật</p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-[13px] text-navy mb-2">🌍 Thuế VAT & Phí Xử Lý</h4>
                        {vatData.length > 0 ? (
                          <CompactAccordionTable
                            headers={["Quốc Gia", "VAT %", "Service Charge"]}
                            data={vatData}
                            renderRow={(v, i) => (
                              <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                                <td className="px-3 py-2"><span className="notranslate">{v.country}</span></td>
                                <td className="px-3 py-2">{v.vat}</td>
                                <td className="px-3 py-2 font-bold">{v.service}</td>
                              </tr>
                            )}
                          />
                        ) : (
                          <p className="text-muted-foreground text-xs italic">Dữ liệu đang cập nhật</p>
                        )}
                      </div>
                    </div>
                  </Accordion>

                  {/* 2. Re-delivery */}
                  <Accordion icon="🔁" title="Phí Reship (Gửi Lại)">
                    {redeliveryData.length > 0 ? (
                      <div>
                        <p className="text-xs text-muted-foreground italic mb-3">* Phí reship áp dụng khi kiện hàng bị trả về do địa chỉ sai, không có người nhận, hoặc bị từ chối nhận.</p>
                        <CompactAccordionTable
                          headers={["Khu Vực", "Mã QG", "Phí ($)"]}
                          data={redeliveryData}
                          renderRow={(r, i) => (
                            <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                              <td className="px-3 py-2"><span className="notranslate">{r.dest}</span></td>
                              <td className="px-3 py-2"><span className="notranslate">{r.code}</span></td>
                              <td className="px-3 py-2 font-bold">{r.usd ? `$${r.usd}` : "Liên hệ THG"}</td>
                            </tr>
                          )}
                        />
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-xs italic text-center py-4">📝 Dữ liệu phí reship đang được cập nhật.</p>
                    )}
                  </Accordion>

                  {/* 3. Terms */}
                  <Accordion icon="📄" title="Điều Khoản Vận Chuyển">
                    <div className="text-center py-6">
                      <p className="text-muted-foreground text-[13px] italic bg-[#F7F5F0] border-[1.5px] border-dashed border-[var(--pricing-border)] rounded-lg px-4 py-3">
                        📝 Nội dung điều khoản vận chuyển đang được cập nhật. THG sẽ bổ sung chi tiết trong thời gian sớm nhất.
                      </p>
                    </div>
                  </Accordion>
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══════════════════════════════
            PANEL: EXPRESS / HÀNG LÔ
           ═══════════════════════════════ */}
        {service === "express" && (
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">CHỌN TUYẾN VẬN CHUYỂN</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
              <button
                onClick={() => setExpressRoute("vn-us")}
                className={`flex flex-col gap-1 border-[1.5px] rounded-[10px] p-3 text-left transition-all ${expressRoute === "vn-us" ? "border-primary bg-[#FFFBF0]" : "border-[var(--pricing-border)] bg-white hover:border-primary/40"
                  }`}
              >
                <span className={`font-bold text-xs ${expressRoute === "vn-us" ? "text-primary" : "text-navy"}`}>🇻🇳 VN → US (UPS)</span>
                <span className="text-[10px] text-muted-foreground">⏱ 3–7 BSD</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 w-fit">⚠️ Chưa gồm tax NK US</span>
              </button>
              <button
                onClick={() => setExpressRoute("cn-us")}
                className={`flex flex-col gap-1 border-[1.5px] rounded-[10px] p-3 text-left transition-all ${expressRoute === "cn-us" ? "border-primary bg-[#FFFBF0]" : "border-[var(--pricing-border)] bg-white hover:border-primary/40"
                  }`}
              >
                <span className={`font-bold text-xs ${expressRoute === "cn-us" ? "text-primary" : "text-navy"}`}>🇨🇳 CN → US (Air & Sea)</span>
                <span className="text-[10px] text-muted-foreground">⏱ 6–25 BSD</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 w-fit">✈️ Air · 🚢 Sea</span>
              </button>
            </div>

            {expressRoute === "vn-us" && (
              <div>
                {/* Bulk Tables for VN */}
                <div className="space-y-6">
                  {loThuong.length > 0 && (
                    <BulkDataTable title="🛒 Hàng Lô Sản Phẩm Thường" badge="VN → US" data={loThuong} />
                  )}
                  {loMypham.length > 0 && (
                    <BulkDataTable title="💧 Hàng Lô Dung Dịch & Mỹ Phẩm" badge="VN → US" data={loMypham} />
                  )}
                </div>

                {/* Post-table Express */}
                <div className="flex flex-col gap-3 mt-6">
                  <Accordion icon="💰" title="Phụ Phí & Dịch Vụ Khác" defaultOpen>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-[13px] text-navy mb-2">📍 Phụ Phí Vùng Sâu (Remote Area – US)</h4>
                        <table className="w-full border-collapse text-[13px]">
                          <thead><tr className="bg-[#FAFAF8]">
                            <th className="px-3 py-2 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Khu Vực</th>
                            <th className="px-3 py-2 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Surcharge</th>
                          </tr></thead>
                          <tbody>
                            <tr className="border-b border-[var(--pricing-border)]"><td className="px-3 py-2">Alaska / Hawaii</td><td className="px-3 py-2 font-bold">Liên hệ THG</td></tr>
                            <tr className="border-b border-[var(--pricing-border)]"><td className="px-3 py-2">Puerto Rico</td><td className="px-3 py-2 font-bold">Liên hệ THG</td></tr>
                            <tr><td className="px-3 py-2">Remote ZIP Codes</td><td className="px-3 py-2 font-bold">Liên hệ THG</td></tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <h4 className="font-bold text-[13px] text-navy mb-2">📦 Phí Dịch Vụ Thêm</h4>
                        <table className="w-full border-collapse text-[13px]">
                          <thead><tr className="bg-[#FAFAF8]">
                            <th className="px-3 py-2 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Dịch Vụ</th>
                            <th className="px-3 py-2 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Phí</th>
                          </tr></thead>
                          <tbody>
                            <tr className="border-b border-[var(--pricing-border)]"><td className="px-3 py-2">Khai báo hải quan</td><td className="px-3 py-2 font-bold">Liên hệ THG</td></tr>
                            <tr className="border-b border-[var(--pricing-border)]"><td className="px-3 py-2">Đóng gói thêm</td><td className="px-3 py-2 font-bold">Liên hệ THG</td></tr>
                            <tr><td className="px-3 py-2">Bảo hiểm hàng hóa</td><td className="px-3 py-2 font-bold">Liên hệ THG</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Accordion>
                  <Accordion icon="📄" title="Điều Khoản Vận Chuyển">
                    <p className="text-muted-foreground text-[13px] italic bg-[#F7F5F0] border-[1.5px] border-dashed border-[var(--pricing-border)] rounded-lg px-4 py-3 text-center">
                      📝 Nội dung điều khoản vận chuyển đang được cập nhật. THG sẽ bổ sung chi tiết trong thời gian sớm nhất.
                    </p>
                  </Accordion>
                </div>
              </div>
            )}

            {expressRoute === "cn-us" && (
              <div>
                <div className="bg-[#FFFBEE] border-[1.5px] border-dashed border-[#D4A843] rounded-[10px] p-3 text-[12px] text-[#92670A] mb-4 flex gap-2">
                  <span>ℹ️</span>
                  <div>Hiển thị đồng thời tất cả line. Giá $/kg — liên hệ THG để nhận báo giá chính xác theo lô hàng.</div>
                </div>

                <div className="space-y-4">
                  {/* CN Express Cards */}
                  {[
                    { name: "✈️ DHL Air – Hỏa Tốc", time: "3–5 BSD", bg: "bg-[#C8102E]", tax: false },
                    { name: "✈️ UPS Air – Nhanh", time: "6–10 BSD", bg: "bg-navy", tax: true },
                    { name: "✈️ UPS Air – Tiêu Chuẩn", time: "8–10 BSD", bg: "bg-[#16213E]", tax: true },
                    { name: "🚢 Mason Sea", time: "20–25 BSD", bg: "bg-[#0F3460]", tax: true },
                  ].map((line, i) => (
                    <div key={i} className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden shadow-sm">
                      <div className={`${line.bg} px-5 py-3 flex items-center justify-between flex-wrap gap-2`}>
                        <span className="text-white font-bold text-[13px] flex items-center gap-2">
                          {line.name} <span className="font-normal text-xs opacity-80">{line.time}</span>
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${line.tax ? "bg-emerald-100/20 text-emerald-300" : "bg-amber-100/20 text-amber-300"}`}>
                          {line.tax ? "✅ Đã bao gồm tax NK US" : "⚠️ Chưa bao gồm tax NK US"}
                        </span>
                      </div>
                      <table className="w-full border-collapse text-[13px]">
                        <thead><tr className="bg-[#FAFAF8]">
                          <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Cân Nặng</th>
                          <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Giá ($/kg)</th>
                          <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Ghi chú</th>
                        </tr></thead>
                        <tbody>
                          {[
                            { w: "< 100 kg" }, { w: "100–500 kg" }, { w: "> 500 kg" },
                          ].map((r, j) => (
                            <tr key={j} className="border-b border-[var(--pricing-border)] last:border-0">
                              <td className="px-5 py-2">{r.w}</td>
                              <td className="px-5 py-2 text-primary font-bold">Liên hệ THG</td>
                              <td className="px-5 py-2 text-muted-foreground text-xs">Báo giá theo lô</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>

                {/* Post-table CN-US */}
                <div className="flex flex-col gap-3 mt-6">
                  <Accordion icon="💰" title="Phụ Phí & Dịch Vụ Khác" defaultOpen>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-[13px] text-navy mb-2">📍 Phụ Phí Vùng Sâu (Remote Area – US)</h4>
                        {remoteSurcharge.length > 0 ? (
                          <CompactAccordionTable
                            headers={["Zone", "Surcharge ($)"]}
                            data={remoteSurcharge}
                            renderRow={(r, i) => (
                              <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                                <td className="px-3 py-2"><span className="notranslate">{r.zone || r.name || `Zone ${i + 1}`}</span></td>
                                <td className="px-3 py-2 font-bold">{r.usd ? `$${r.usd}` : "Liên hệ THG"}</td>
                              </tr>
                            )}
                          />
                        ) : (
                          <p className="text-muted-foreground text-xs italic">Dữ liệu đang cập nhật</p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-[13px] text-navy mb-2">📦 Phí Dịch Vụ Thêm</h4>
                        <table className="w-full border-collapse text-[13px]">
                          <thead><tr className="bg-[#FAFAF8]">
                            <th className="px-3 py-2 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Dịch Vụ</th>
                            <th className="px-3 py-2 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Phí</th>
                          </tr></thead>
                          <tbody>
                            <tr className="border-b border-[var(--pricing-border)]"><td className="px-3 py-2">Kiểm tra hàng tại kho</td><td className="px-3 py-2 font-bold">Liên hệ THG</td></tr>
                            <tr className="border-b border-[var(--pricing-border)]"><td className="px-3 py-2">Đóng gói / Re-pack</td><td className="px-3 py-2 font-bold">Liên hệ THG</td></tr>
                            <tr><td className="px-3 py-2">Bảo hiểm lô hàng</td><td className="px-3 py-2 font-bold">Liên hệ THG</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Accordion>
                  <Accordion icon="📄" title="Điều Khoản Vận Chuyển">
                    <p className="text-muted-foreground text-[13px] italic bg-[#F7F5F0] border-[1.5px] border-dashed border-[var(--pricing-border)] rounded-lg px-4 py-3 text-center">
                      📝 Nội dung điều khoản vận chuyển đang được cập nhật. THG sẽ bổ sung chi tiết trong thời gian sớm nhất.
                    </p>
                  </Accordion>
                </div>

                <div className="text-center mt-5">
                  <a href="https://order.thgfulfill.com/" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-gold-dark text-white rounded-lg px-7 py-3 font-bold text-sm transition-all shadow-lg">
                    📞 Liên hệ báo giá CN–US <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ContactSection />
      <Footer />
    </div>
  );
};

/* ═══════════════════════════════════════════════
   TIKTOK PANEL (under Ship by Label)
   ═══════════════════════════════════════════════ */
const TikTokPanel = () => {
  const [tab, setTab] = useState("cnUsNormal");

  const tabs = [
    { id: "cnUsNormal", label: "🇺🇸 CN → US (Thường)", dataKey: "tiktokCnUsNormal" },
    { id: "cnUsSpecial", label: "🇺🇸 CN → US (Đặc Biệt)", dataKey: "tiktokCnUsSpecial" },
    { id: "cnUk", label: "🇬🇧 CN → UK", dataKey: "tiktokCnUk" },
    { id: "cnDe", label: "🇩🇪 CN → DE", dataKey: "tiktokCnDe" },
    { id: "vnSeller", label: "🇻🇳 VN → US (Seller)", dataKey: "tiktokVnSeller" },
    { id: "vnTiktok", label: "🇻🇳 VN → US (TikTok)", dataKey: "tiktokVnTiktok" },
  ];

  const activeTab = tabs.find(t => t.id === tab)!;
  const data = (pricingData as any)[activeTab.dataKey] || [];

  return (
    <div className="mt-6">
      <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">🎵 BẢNG GIÁ TIKTOK SHOP DEDICATED</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${tab === t.id
              ? "bg-primary text-white border-primary shadow-md"
              : "bg-white border-[var(--pricing-border)] text-muted-foreground hover:border-primary/40"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <PriceTable
        title={`TikTok · ${activeTab.label}`}
        badge="Ship by Label"
        note="Cập nhật: 29/03/2026"
        data={data}
        columns={[{ key: "rate", label: `Cước ($)` }]}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════
   BULK DATA TABLE (for Express panel)
   ═══════════════════════════════════════════════ */
const BulkDataTable = ({ title, badge, data }: { title: string; badge: string; data: any[] }) => {
  const { tVi } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  if (!data || data.length === 0) return null;

  // The Bulk data structure is: { name: "Zone 1", prices: { "12": 10.5, "21": 9.5 ... }, sla: "3-5 jours" }
  // We need to extract the weight keys from the 'prices' object of the first row
  const weightKeys = data[0]?.prices ? Object.keys(data[0].prices).sort((a, b) => Number(a) - Number(b)) : [];
  const displayData = isExpanded ? data : data.slice(0, 6);

  return (
    <div className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden shadow-sm">
      <div className="bg-navy px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
        <span className="text-white font-bold text-xs flex items-center gap-2">
          {title}
          <span className="bg-[rgba(184,146,42,0.25)] text-[#D4A843] text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-[#FAFAF8]">
              <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-[var(--pricing-border)] whitespace-nowrap">Zone / SLA</th>
              {weightKeys.map(w => (
                <th key={w} className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-[var(--pricing-border)] whitespace-nowrap">
                  {w} KG+
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.map((row: any, i: number) => (
              <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                <td className="px-3 py-1.5 whitespace-nowrap">
                  <div className="font-bold text-navy text-xs"><span className="notranslate">{row.name}</span></div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">⏱ {row.sla}</div>
                </td>
                {weightKeys.map(w => {
                  const price = row.prices?.[w];
                  return (
                    <td key={w} className="px-3 py-1.5 font-bold whitespace-nowrap">
                      {price != null ? `$${price}` : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
            {!isExpanded && data.length > 6 && (
              <tr>
                <td colSpan={100} className="p-0 border-t border-[var(--pricing-border)]">
                  <button onClick={() => setIsExpanded(true)} className="w-full py-2.5 text-xs font-bold text-primary hover:bg-[#FFFBF0] transition-colors flex items-center justify-center gap-1">
                    {tVi("pricing.btn_expand").replace("{count}", (data.length - 6).toString())} <ChevronDown size={14} />
                  </button>
                </td>
              </tr>
            )}
            {isExpanded && data.length > 6 && (
              <tr>
                <td colSpan={100} className="p-0 border-t border-[var(--pricing-border)]">
                  <button onClick={() => setIsExpanded(false)} className="w-full py-2.5 text-xs font-bold text-primary hover:bg-[#FFFBF0] transition-colors flex items-center justify-center gap-1">
                    {tVi("pricing.btn_collapse")} <ChevronUp size={14} />
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InternationalPricingPage;
