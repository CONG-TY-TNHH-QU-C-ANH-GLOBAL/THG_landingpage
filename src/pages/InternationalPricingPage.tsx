import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import { pricingData } from "@/data/pricingData";

import { ChevronDown, ChevronUp, Search, ExternalLink, FileSpreadsheet, FileText, FileIcon } from "lucide-react";
import { exportToExcel, exportToPdf, exportToWord } from "@/lib/exportUtils";
import { useLarkPricingContext, SyncBadge, transformSheetToEpacketData, transformSheetToBulkData, transformSheetToVnUsExpress } from "@/components/pricing/LarkPricingProvider";
import larkPoliciesI18n from "@/data/larkPoliciesI18n.json";

/* ═══════════════════════════════════════════════
   TYPES & CONFIG
   ═══════════════════════════════════════════════ */
type ServiceTab = "epacket" | "express" | "terms";
type EpacketRoute = "std-vn-ww" | "std-cn-ww" | "pri-vncn-us" | "cn-us-label";
type ExpressRoute = "vn-us" | "cn-us";
type CargoType = "standard" | "cosmetics" | "battery";

const ROUTES: Record<EpacketRoute, { nameVi: React.ReactNode; nameEn: React.ReactNode; nameZh: React.ReactNode; time: { vi: string; en: string; zh: string }; cargo: CargoType[]; type: string }> = {
  "std-vn-ww": {
    nameVi: <span className="notranslate" translate="no">🇻🇳 Standard VN → Worldwide</span>,
    nameEn: <span className="notranslate" translate="no">VN Standard VN → Worldwide</span>,
    nameZh: <span className="notranslate" translate="no">🇻🇳 标准 VN → 全球</span>,
    time: { vi: "⏱ 5–12 BSD", en: "⏱ 5–12 BSD", zh: "⏱ 5–12 工作日" },
    cargo: ["standard", "cosmetics"], type: "merchant"
  },
  "std-cn-ww": {
    nameVi: <span className="notranslate" translate="no">🇨🇳 Standard CN → Worldwide</span>,
    nameEn: <span className="notranslate" translate="no">CN Standard CN → Worldwide</span>,
    nameZh: <span className="notranslate" translate="no">🇨🇳 标准 CN → 全球</span>,
    time: { vi: "⏱ 6–12 BSD", en: "⏱ 6–12 BSD", zh: "⏱ 6–12 工作日" },
    cargo: ["standard", "cosmetics", "battery"], type: "merchant"
  },
  "pri-vncn-us": {
    nameVi: <span className="notranslate" translate="no">🇻🇳/🇨🇳 Priority VN/CN → US</span>,
    nameEn: <span className="notranslate" translate="no">VN/CN Priority VN/CN → US</span>,
    nameZh: <span className="notranslate" translate="no">🇻🇳/🇨🇳 优先 VN/CN → US</span>,
    time: { vi: "⏱ 5–10 BSD", en: "⏱ 5–10 BSD", zh: "⏱ 5–10 工作日" },
    cargo: [], type: "merchant"
  },
  "cn-us-label": {
    nameVi: <span className="notranslate" translate="no">🇨🇳 CN → US Ship by Label</span>,
    nameEn: <span className="notranslate" translate="no">CN CN → US Ship by Label</span>,
    nameZh: <span className="notranslate" translate="no">🇨🇳 CN → US 贴标发货</span>,
    time: { vi: "⏱ Theo lịch USPS", en: "⏱ Per USPS schedule", zh: "⏱ 按USPS时间表" },
    cargo: [], type: "label"
  },
};

const CARGO_LABELS: Record<CargoType, Record<string, string>> = {
  standard: { vi: "Hàng Thường", en: "Regular Items", zh: "普货" },
  cosmetics: { vi: "Mỹ Phẩm", en: "Cosmetics", zh: "化妆品" },
  battery: { vi: "Pin Điện", en: "Batteries", zh: "电池" },
};
const CARGO_ICONS: Record<CargoType, string> = { standard: "📦", cosmetics: "💄", battery: "🔋" };

const DATA_KEY_MAP: Record<string, string> = {
  "std-vn-ww_standard": "vnThuong",
  "std-vn-ww_cosmetics": "vnMypham",
  "std-cn-ww_standard": "cnThuong",
  "std-cn-ww_cosmetics": "cnMypham",
  "std-cn-ww_battery": "cnPin",
  "pri-vncn-us_standard": "uspsCn",
};

const countryNames: Record<string, string> = {
  us: "United States (US)", gb: "United Kingdom (GB)", uk: "United Kingdom (GB)",
  de: "Germany (DE)", fr: "France (FR)", it: "Italy (IT)", es: "Spain (ES)",
  nl: "Netherlands (NL)", at: "Austria (AT)", pl: "Poland (PL)",
  ca: "Canada (CA)", au: "Australia (AU)", nz: "New Zealand (NZ)",
  jp: "Japan (JP)", hk: "Hong Kong (HK)", sg: "Singapore (SG)",
  mx: "Mexico (MX)", br: "Brazil (BR)", ch: "Switzerland (CH)", cl: "Chile (CL)",
  ae: "UAE (AE)", uae: "UAE (AE)", sa: "Saudi Arabia (SA)",
  be: "Belgium (BE)", ie: "Ireland (IE)", se: "Sweden (SE)",
  my: "Malaysia (MY)", gr: "Greece (GR)", za: "South Africa (ZA)", lv: "Latvia (LV)",
  th: "Thailand (TH)", tw: "Taiwan (TW)",
  "us-united_states": "United States (US)", "uk-united_kindgom": "United Kingdom (GB)",
  "de-germany": "Germany (DE)", "fr-france": "France (FR)",
  "it-italy": "Italy (IT)", "es-spain": "Spain (ES)",
  "nl-netherlands": "Netherlands (NL)", "be-belgium": "Belgium (BE)",
  "se-sweden": "Sweden (SE)", "pl-poland": "Poland (PL)",
  "at-austria": "Austria (AT)", "dk-denmark": "Denmark (DK)",
  "fi-finland": "Finland (FI)", "ie-ireland": "Ireland (IE)",
  "bg-bulgaria": "Bulgaria (BG)", "cz-czechia": "Czechia (CZ)",
  "ee-estonia": "Estonia (EE)", "gr-greece": "Greece (GR)",
  "hr-croatia": "Croatia (HR)", "hu-hungary": "Hungary (HU)",
  "lt-lithuania": "Lithuania (LT)", "lv-latvia": "Latvia (LV)",
  "pt-portugal": "Portugal (PT)", "ro-romania": "Romania (RO)",
  "united_states": "United States (US)",
};

// Maps each route+cargo combo to the relevant policy IDs in larkPoliciesI18n.json
const ROUTE_POLICY_MAP: Record<string, string[]> = {
  "std-vn-ww_standard": ["amsgWr"],           // VNTHZXR
  "std-vn-ww_cosmetics": ["BWc7wA"],          // VNMUZXR
  "std-cn-ww_standard": ["7RqdMQ"],           // THPHR
  "std-cn-ww_cosmetics": ["dECGAK"],          // MUZXR
  "std-cn-ww_battery": ["s46HNu"],            // THZXR
  "pri-vncn-us_standard": ["LSTxjV", "yjyfP8"], // VN-YTYCPREC + YTYCPREC
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
const PriceTable = ({ title, badge, note, data, columns, rate = 1, currencySymbol = "$", sla }: {
  title: string; badge?: React.ReactNode; note?: React.ReactNode;
  data: any[]; columns: { key: string; label: string }[];
  rate?: number; currencySymbol?: string;
  sla?: Record<string, string>;
}) => {
  const { tVi } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  const tableId = useMemo(() => "table-price-" + Math.random().toString(36).substring(2, 9), []);
  if (!data || data.length === 0) return null;

  const exportConfig = useMemo(() => {
    const headers = ["Cân Nặng (KG)", ...columns.map(c => c.label)];
    const rows = data.map((row: any) => {
      return [
        row.kg ?? row.weight ?? "—",
        ...columns.map(c => {
          const val = row[c.key];
          if (val === null || val === undefined) return "—";
          if (typeof val === "number") return "$" + val.toFixed(2);
          return val;
        })
      ];
    });
    return { filename: title, headers, rows };
  }, [data, columns, title]);

  const displayData = isExpanded ? data : data.slice(0, 6);

  return (
    <div className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden shadow-sm">
      <div className="bg-navy px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white font-bold text-[13px]">📋 {title}</span>
          {badge && <span className="bg-[rgba(184,146,42,0.25)] text-[#D4A843] text-[12px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {note && <span className="text-[#9CA3AF] text-[12px] mr-2">{note}</span>}
          <button onClick={() => exportToExcel(exportConfig)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất Excel">
            <FileSpreadsheet size={14} />
          </button>
          <button onClick={() => exportToWord(exportConfig)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất Word">
            <FileText size={14} />
          </button>
          <button onClick={() => exportToPdf(exportConfig)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất PDF">
            <FileIcon size={14} />
          </button>
        </div>
      </div>
      {/* Mobile Cards (Hidden on md+) */}
      <div className="md:hidden flex flex-col gap-3 p-4 bg-secondary/10">
        {displayData.map((row: any, i: number) => (
          <div key={i} className="bg-white border border-[var(--pricing-border)] rounded-xl p-4 shadow-sm relative">
            <div className="font-bold text-navy text-[15px] mb-3 pb-2 border-b border-[var(--pricing-border)]/50 flex justify-between">
              <span>Cân Nặng:</span>
              <span className="text-primary notranslate">{row.kg ?? row.weight ?? "—"} kg</span>
            </div>
            <div className="space-y-2">
              {columns.map(c => {
                const val = row[c.key];
                const isNull = val === null || val === undefined;
                const isContact = typeof val === 'string' && val.includes('Liên hệ');
                return (
                  <div key={c.key} className="flex justify-between items-center">
                    <span className="text-[13px] font-medium text-navy/70">{c.label}</span>
                    <span className={`text-[14px] whitespace-nowrap ${isNull ? "text-muted-foreground/30" : isContact ? "text-primary font-bold" : "font-bold text-navy"}`}>
                      {isNull ? (
                        <span className="inline-block px-1.5 py-0 bg-muted/20 rounded text-[12px] backdrop-blur-sm">—</span>
                      ) : typeof val === "number" ? (
                        <span className="notranslate" translate="no">
                          {currencySymbol === "₫"
                            ? `${Math.round(val * rate).toLocaleString("vi-VN")} ₫`
                            : `${currencySymbol}${(val * rate).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`}
                        </span>
                      ) : val}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table (Hidden on mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <table id={tableId} className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-[#FAFAF8]">
              <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-muted-foreground border-b border-[var(--pricing-border)] whitespace-nowrap">Cân Nặng (KG)</th>
              {columns.map(c => (
                <th key={c.key} className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-muted-foreground border-b border-[var(--pricing-border)] whitespace-nowrap">{c.label}</th>
              ))}
            </tr>
            {/* SLA working days sub-header */}
            {sla && Object.keys(sla).length > 0 && (
              <tr className="bg-[#FFF8E7]">
                <td className="px-4 py-1.5 text-[11px] text-muted-foreground italic border-b border-[var(--pricing-border)]">—</td>
                {columns.map(c => {
                  const slaVal = sla[c.key] || sla[c.key.toLowerCase()] || "";
                  return (
                    <td key={c.key} className="px-4 py-1.5 text-[11px] text-amber-700 font-medium italic border-b border-[var(--pricing-border)] whitespace-nowrap">
                      {slaVal ? `⏱ ${slaVal}` : "—"}
                    </td>
                  );
                })}
              </tr>
            )}
          </thead>
          <tbody>
            {displayData.map((row: any, i: number) => (
              <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                <td className="px-4 py-2.5 font-medium whitespace-nowrap">{row.kg ?? row.weight ?? "—"}</td>
                {columns.map(c => {
                  const val = row[c.key];
                  const isNull = val === null || val === undefined;
                  const isContact = typeof val === 'string' && val.includes('Liên hệ');
                  return (
                    <td key={c.key} className={`px-4 py-2.5 whitespace-nowrap ${isNull ? "text-muted-foreground/30" : isContact ? "text-primary font-bold" : "font-bold"}`}>
                      {isNull ? (
                        <span className="inline-block px-1.5 py-0 bg-muted/20 rounded text-[12px] backdrop-blur-sm">—</span>
                      ) : typeof val === "number" ? (
                        <span className="notranslate" translate="no">
                          {currencySymbol === "₫"
                            ? `${Math.round(val * rate).toLocaleString("vi-VN")} ₫`
                            : `${currencySymbol}${(val * rate).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`}
                        </span>
                      ) : val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expand/Collapse Buttons */}
      {!isExpanded && data.length > 6 && (
        <div className="border-t border-[var(--pricing-border)]">
          <button onClick={() => setIsExpanded(true)} className="w-full py-3 md:py-2.5 text-[13px] font-bold text-primary hover:bg-[#FFFBF0] transition-colors flex items-center justify-center gap-1">
            {tVi("pricing.btn_expand").replace("{count}", (data.length - 6).toString())} <ChevronDown size={14} />
          </button>
        </div>
      )}
      {isExpanded && data.length > 6 && (
        <div className="border-t border-[var(--pricing-border)]">
          <button onClick={() => setIsExpanded(false)} className="w-full py-3 md:py-2.5 text-[13px] font-bold text-primary hover:bg-[#FFFBF0] transition-colors flex items-center justify-center gap-1">
            {tVi("pricing.btn_collapse")} <ChevronUp size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   COMPACT ACCORDION TABLE CONTROLLER
   ═══════════════════════════════════════════════ */
const CompactAccordionTable = ({ headers, data, renderRow, title = "Data Table", extractRowData }: { headers: string[], data: any[], renderRow: (row: any, i: number) => React.ReactNode, title?: string, extractRowData?: (row: any) => (string | number)[] }) => {
  const { tVi } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  const tableId = useMemo(() => "table-compact-" + Math.random().toString(36).substring(2, 9), []);
  if (!data || data.length === 0) return null;

  const exportConfig = useMemo(() => {
    const rows = extractRowData ? data.map(extractRowData) : data.map((r: any) => Object.values(r) as string[]);
    return { filename: title, headers, rows };
  }, [data, headers, title, extractRowData]);
  const displayData = isExpanded ? data : data.slice(0, 6);

  return (
    <div className="relative">
      <div className="absolute top-[-36px] right-0 flex items-center gap-1">
        <button onClick={() => exportToExcel(exportConfig)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Xuất Excel">
          <FileSpreadsheet size={13} />
        </button>
        <button onClick={() => exportToWord(exportConfig)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Xuất Word">
          <FileText size={13} />
        </button>
        <button onClick={() => exportToPdf(exportConfig)} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Xuất PDF">
          <FileIcon size={13} />
        </button>
      </div>
      <table id={tableId} className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="bg-[#FAFAF8]">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left text-[12px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)] whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayData.map((row, i) => renderRow(row, i))}
          {!isExpanded && data.length > 6 && (
            <tr>
              <td colSpan={100} className="p-0 border-t border-[var(--pricing-border)]">
                <button onClick={() => setIsExpanded(true)} className="w-full py-2.5 text-[13px] font-bold text-primary hover:bg-[#FFFBF0] transition-colors flex items-center justify-center gap-1">
                  {tVi("pricing.btn_expand").replace("{count}", (data.length - 6).toString())} <ChevronDown size={14} />
                </button>
              </td>
            </tr>
          )}
          {isExpanded && data.length > 6 && (
            <tr>
              <td colSpan={100} className="p-0 border-t border-[var(--pricing-border)]">
                <button onClick={() => setIsExpanded(false)} className="w-full py-2.5 text-[13px] font-bold text-primary hover:bg-[#FFFBF0] transition-colors flex items-center justify-center gap-1">
                  {tVi("pricing.btn_collapse")} <ChevronUp size={14} />
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   TERMINOLOGY PANEL COMPONENT
   ═══════════════════════════════════════════════ */
const TerminologyPanel = () => {
  const { effectiveLanguage: language } = useI18n();

  const groups: Array<{
    title: { vi: string; en: string; zh: string };
    terms: Array<{
      term: { vi: string; en: string; zh: string };
      desc: { vi: string; en: string; zh: string };
    }>;
  }> = [
      {
        title: { vi: "⏱ Nhóm 1 — Thời gian & Đơn vị", en: "⏱ Group 1 — Time & Units", zh: "⏱ 第1组 — 时间与单位" },
        terms: [
          {
            term: { vi: "BSD — Ngày làm việc vận chuyển", en: "BSD — Business Shipping Days", zh: "BSD — 工作运输日" },
            desc: {
              vi: "Chỉ tính các ngày từ Thứ Hai đến Thứ Sáu, không bao gồm Thứ Bảy, Chủ nhật và các ngày lễ quốc gia tại nước đến. Ví dụ: 5 BSD không có nghĩa là 5 ngày liên tiếp, mà là 5 ngày làm việc thực tế.",
              en: "Only weekdays (Monday to Friday) are counted, excluding Saturdays, Sundays, and public holidays in the destination country. For example, 5 BSD does not mean 5 consecutive calendar days, but 5 actual business days.",
              zh: "仅计算周一至周五的工作日，不包括周六、周日及目的地国家的法定节假日。例如：5 BSD 不代表连续5天，而是5个实际工作日。"
            }
          },
          {
            term: { vi: "5–12 BSD — Thời gian giao hàng dự kiến", en: "5–12 BSD — Estimated Delivery Window", zh: "5–12 BSD — 预计送达时间" },
            desc: {
              vi: "Thời gian giao hàng dự kiến từ 5 đến 12 ngày làm việc, được tính bắt đầu từ thời điểm THG Fulfill tiếp nhận và gửi hàng đi (không phải từ lúc khách hàng đặt đơn). Thời gian thực tế có thể thay đổi tùy theo điều kiện thông quan và quốc gia đến.",
              en: "Estimated delivery window of 5 to 12 business shipping days, calculated from the moment THG Fulfill receives and dispatches the shipment — not from when the customer places the order. Actual delivery time may vary depending on customs clearance conditions and the destination country.",
              zh: "预计送达时间为5至12个工作运输日，从THG Fulfill接收并发出货物时开始计算，而非客户下单时间。实际时间可能因清关情况和目的地国家而有所不同。"
            }
          }
        ]
      },
      {
        title: { vi: "🚚 Nhóm 2 — Loại dịch vụ", en: "🚚 Group 2 — Service Types", zh: "🚚 第2组 — 服务类型" },
        terms: [
          {
            term: { vi: "Epacket (Bưu kiện nhỏ quốc tế)", en: "Epacket (International Small Parcel)", zh: "Epacket（国际小包）" },
            desc: {
              vi: "Dịch vụ vận chuyển bưu kiện nhỏ quốc tế, thường áp dụng cho hàng hóa có trọng lượng dưới 2kg để tối ưu chi phí vận chuyển. Phù hợp với các đơn hàng lẻ từ các nền tảng thương mại điện tử như Shopify, Etsy, Amazon.",
              en: "An international small parcel delivery service, typically for items weighing under 2 kg to optimize shipping costs. Ideal for individual orders from e-commerce platforms such as Shopify, Etsy, and Amazon.",
              zh: "适用于2公斤以下小件货物的国际小包服务，用于降低运费。适合Shopify、Etsy、Amazon等电商平台的零售订单。"
            }
          },
          {
            term: { vi: "Bulk Shipping (Vận chuyển hàng sỉ)", en: "Bulk Shipping", zh: "Bulk Shipping（大货运输）" },
            desc: {
              vi: "Dịch vụ vận chuyển hàng sỉ, áp dụng cho các lô hàng lớn về số lượng hoặc trọng lượng, thường vận chuyển bằng đường biển hoặc đường hàng không. Phù hợp với doanh nghiệp muốn nhập kho hoặc phân phối số lượng lớn sang thị trường quốc tế.",
              en: "A shipping service for large-volume or heavyweight consignments, typically transported by sea freight or air freight. Suited for businesses looking to import to a warehouse or distribute large quantities to international markets.",
              zh: "适用于大批量或重货的运输服务，通常通过海运或空运进行。适合希望进仓或向国际市场大批量分销的企业。"
            }
          },
          {
            term: { vi: "Express Shipping (Chuyển phát nhanh)", en: "Express Shipping", zh: "Express Shipping（快递）" },
            desc: {
              vi: "Dịch vụ chuyển phát nhanh quốc tế, ưu tiên xử lý và giao hàng trong thời gian ngắn hơn so với Standard. Thường đi qua các hãng vận chuyển như DHL, FedEx, UPS.",
              en: "International expedited delivery with prioritized processing and faster transit times compared to Standard. Typically handled by carriers such as DHL, FedEx, or UPS.",
              zh: "国际快递服务，处理优先、时效比标准快。通常由DHL、FedEx、UPS等承运商承运。"
            }
          },
          {
            term: { vi: "Standard Shipping (Vận chuyển tiêu chuẩn)", en: "Standard Shipping", zh: "Standard Shipping（标准运输）" },
            desc: {
              vi: "Dịch vụ vận chuyển tiêu chuẩn với chi phí tối ưu. Thời gian giao hàng dài hơn Express nhưng phù hợp với phần lớn đơn hàng thương mại điện tử thông thường.",
              en: "Cost-effective standard shipping service. Delivery times are longer than Express but suitable for the majority of regular e-commerce orders.",
              zh: "经济实惠的标准运输服务。时效比快递慢，但适合大多数普通电商订单。"
            }
          },
          {
            term: { vi: "Ship by Merchant (Merchant mua nhãn)", en: "Ship by Merchant", zh: "Ship by Merchant（商家购标发货）" },
            desc: {
              vi: "Hình thức merchant mua nhãn vận chuyển (shipping label) trực tiếp từ THG Fulfill. THG Fulfill chịu trách nhiệm toàn bộ hành trình vận chuyển — từ khi tiếp nhận hàng tại kho cho đến khi giao thành công đến tay người nhận cuối cùng tại nước đích.",
              en: "A shipping arrangement where the merchant purchases a shipping label directly from THG Fulfill. THG Fulfill is responsible for the entire shipping journey — from receiving the goods at the warehouse through to successful delivery to the end recipient in the destination country.",
              zh: "商家直接从THG Fulfill购买运输标签的发货方式。THG Fulfill负责从仓库接货到最终目的地收件人成功签收的全程运输。"
            }
          },
          {
            term: { vi: "Ship by Label (Merchant tự có nhãn)", en: "Ship by Label", zh: "Ship by Label（商家自备标签）" },
            desc: {
              vi: "Hình thức merchant tự cung cấp nhãn vận chuyển đã có sẵn — do merchant tự mua hoặc được nền tảng bán hàng cấp phát. THG Fulfill chịu trách nhiệm vận chuyển kiện hàng từ kho đến điểm tiếp nhận (drop-off point) của đơn vị phát hành label tương ứng (ví dụ: label USPS thì drop-off tại bưu cục USPS). Toàn bộ quá trình giao hàng nội địa đến người nhận cuối sẽ do đơn vị phát hành label đảm nhận.",
              en: "A shipping arrangement where the merchant provides their own shipping label — either self-purchased or issued by a selling platform. THG Fulfill is responsible for transporting the parcel from the warehouse to the drop-off point of the corresponding carrier (e.g., USPS label goes to a USPS post office). Last-mile delivery to the end recipient is handled entirely by the label-issuing carrier.",
              zh: "商家自行提供运输标签（自购或由销售平台发放）的发货方式。THG Fulfill负责将包裹从仓库运至对应承运商的交接点（如USPS标签则交至USPS邮局）。最后一公里配送由标签发行承运商全权负责。"
            }
          },
          {
            term: { vi: "Drop-off USPS (Bàn giao tại USPS)", en: "Drop-off USPS", zh: "Drop-off USPS（USPS交接）" },
            desc: {
              vi: "THG bàn giao hàng hóa tại post office của USPS, trách nhiệm vận chuyển hàng đến tay khách hàng cuối cùng do USPS đảm nhận. Thường áp dụng cho tuyến Priority CN — US Ship by Label.",
              en: "THG Fulfill hands over shipments at a USPS post office. Delivery to the final customer is then handled entirely by USPS. Typically applied to the Priority CN — US Ship by Label route.",
              zh: "THG Fulfill将货物移交至USPS邮局，之后由USPS负责配送至最终客户。通常适用于Priority CN — US Ship by Label线路。"
            }
          }
        ]
      },
      {
        title: { vi: "💲 Nhóm 3 — Thuật ngữ giá cước", en: "💲 Group 3 — Pricing Terms", zh: "💲 第3组 — 价格术语" },
        terms: [
          {
            term: { vi: "Remote Area Surcharge (Phụ phí vùng xa)", en: "Remote Area Surcharge", zh: "Remote Area Surcharge（偏远地区附加费）" },
            desc: {
              vi: "Khoản phụ phí phát sinh khi địa chỉ giao hàng nằm tại khu vực xa trung tâm, hẻo lánh hoặc khó tiếp cận. Mức phí được phân chia theo Zone (vùng) từ 1 đến 6, do các hãng vận chuyển quốc tế (như FedEx, DHL, USPS) quy định dựa trên mật độ dân số và khả năng tiếp cận logistics. Giá hiển thị trong bảng chưa bao gồm khoản phụ phí này.",
              en: "An additional fee applied when the delivery address is located in a remote, rural, or difficult-to-access area. Fees are tiered by Zone (1 to 6) as defined by international carriers (e.g., FedEx, DHL, USPS) based on population density and logistics accessibility. This surcharge is NOT included in the base price displayed in the price table.",
              zh: "当收货地址位于偏远、农村或难以到达地区时产生的附加费。费用按Zone（区域）1至6分级，由FedEx、DHL、USPS等国际承运商根据人口密度和物流可及性制定。此附加费不含在价格表显示的基础运费中。"
            }
          },
          {
            term: { vi: "Zone 1 – Zone 6 (Hệ thống phân vùng địa lý)", en: "Zone 1 – Zone 6", zh: "Zone 1 – Zone 6（地理分区系统）" },
            desc: {
              vi: "Hệ thống phân vùng địa lý do hãng vận chuyển quy định để tính phụ phí vùng xa. Zone càng cao thì khu vực càng xa xôi và phụ phí càng lớn. Khách hàng có thể tra cứu Zone của địa chỉ cụ thể ngay trên trang bảng giá.",
              en: "A geographic zoning system used by carriers to calculate remote area surcharges. Higher zones indicate more remote areas and therefore higher surcharge rates. Customers can look up the zone for a specific delivery address directly on the pricing page.",
              zh: "承运商用于计算偏远地区附加费的地理分区系统。区号越高，地区越偏远，附加费越高。客户可直接在定价页面查询特定收货地址的区号。"
            }
          },
          {
            term: { vi: "VAT (Thuế giá trị gia tăng)", en: "VAT (Value Added Tax)", zh: "VAT（增值税）" },
            desc: {
              vi: "Thuế giá trị gia tăng áp dụng tại quốc gia nhận hàng. Mức VAT khác nhau theo từng nước (ví dụ: Tây Ban Nha 21%, Thụy Điển 25%). Đây là nghĩa vụ thuế của người nhận hàng và THG sẽ thu hộ để khai báo với cơ quan thuế nước sở tại.",
              en: "Import value-added tax applied by the destination country. VAT rates vary by country (e.g., Spain 21%, Sweden 25%). This is a tax obligation of the recipient, and THG Fulfill collects it on behalf of the local tax authority.",
              zh: "目的地国家征收的进口增值税。各国税率不同（例如：西班牙21%，瑞典25%）。这是收件人的纳税义务，THG Fulfill代为收取并向当地税务机关申报。"
            }
          },
          {
            term: { vi: "Service Charge 2% (Phí xử lý VAT)", en: "Service Charge (2%)", zh: "Service Charge 2%（VAT处理费）" },
            desc: {
              vi: "Phí xử lý và quản lý thu hộ thuế (VAT) của THG Fulfill, tính bằng 2% trên tổng giá trị lô hàng. Khoản phí này chỉ áp dụng ở các quốc gia có yêu cầu khai báo VAT.",
              en: "A handling and VAT collection fee charged by THG Fulfill, equal to 2% of the total shipment value. This fee only applies in countries that require VAT reporting.",
              zh: "THG Fulfill收取的VAT代收处理费，为货物总价值的2%。此费用仅适用于需要申报VAT的国家。"
            }
          },
          {
            term: { vi: "Giá chưa bao gồm phụ phí vùng xa và VAT", en: "Price excludes remote area surcharges and VAT", zh: "价格不含偏远附加费和增值税" },
            desc: {
              vi: "Cảnh báo quan trọng: giá hiển thị trong bảng là giá cước vận chuyển cơ bản, chưa tính phụ phí vùng xa và thuế VAT. Giá thực tế khách hàng phải trả có thể cao hơn tùy theo địa chỉ giao hàng và quốc gia đến. Luôn kiểm tra địa chỉ giao hàng trong công cụ tra cứu Remote Area trước khi xác nhận đơn.",
              en: "Important disclaimer: the prices shown in the table are base shipping rates only and do not include remote area surcharges or VAT. The final amount charged may be higher depending on the delivery address and destination country. Always verify the delivery address using the Remote Area lookup tool before confirming an order.",
              zh: "重要提示：价格表中显示的价格仅为基础运费，不含偏远地区附加费和增值税。实际收费可能因收货地址和目的地国家而更高。确认订单前，请务必使用偏远地区查询工具核实收货地址。"
            }
          }
        ]
      },
      {
        title: { vi: "🌏 Nhóm 4 — Tuyến vận chuyển", en: "🌏 Group 4 — Shipping Routes", zh: "🌏 第4组 — 运输线路" },
        terms: [
          {
            term: { vi: "Standard <span translate='no'>VN</span> → Worldwide", en: "Standard <span translate='no'>VN</span> → Worldwide", zh: "Standard <span translate='no'>VN</span> → Worldwide" },
            desc: {
              vi: "Tuyến vận chuyển tiêu chuẩn từ Việt Nam đến các quốc gia trên toàn thế giới. Hàng được giao trực tiếp đến tay người nhận tại nước đến. Phù hợp với hàng thông thường và mỹ phẩm. Tracking number được cung cấp là tracking của Yun Express.",
              en: "Standard shipping route from Vietnam to destinations worldwide. Parcels are delivered directly to the recipient in the destination country. Supports regular goods and cosmetics. Tracking numbers provided are Yun Express tracking numbers.",
              zh: "越南至全球目的地的标准运输线路。包裹直接送达目的地收件人。支持普通货物和化妆品。提供的追踪号为Yun Express追踪号。"
            }
          },
          {
            term: { vi: "Standard <span translate='no'>CN</span> → Worldwide", en: "Standard <span translate='no'>CN</span> → Worldwide", zh: "Standard <span translate='no'>CN</span> → Worldwide" },
            desc: {
              vi: "Tuyến vận chuyển tiêu chuẩn từ Trung Quốc đến toàn cầu. Ngoài hàng thông thường và mỹ phẩm, tuyến này còn hỗ trợ vận chuyển hàng có pin (battery). Tracking number được cung cấp là tracking của Yun Express.",
              en: "Standard shipping route from China to worldwide destinations. In addition to regular goods and cosmetics, this route also supports items containing batteries. Tracking numbers provided are Yun Express tracking numbers.",
              zh: "中国至全球目的地的标准运输线路。除普通货物和化妆品外，还支持含电池商品。提供的追踪号为Yun Express追踪号。"
            }
          },
          {
            term: { vi: "Priority <span translate='no'>VN/CN</span> → <span translate='no'>US</span> (Tuyến ưu tiên đi Mỹ)", en: "Priority <span translate='no'>VN/CN</span> → <span translate='no'>US</span>", zh: "Priority <span translate='no'>VN/CN</span> → <span translate='no'>US</span>（越/中至美优先线路）" },
            desc: {
              vi: "Tuyến ưu tiên từ Việt Nam hoặc Trung Quốc đến Mỹ với thời gian xử lý nhanh hơn (5–10 BSD). Tracking number được cung cấp bằng USPS và sẽ được active trong vòng 24 giờ kể từ thời điểm tạo tracking. Phù hợp cho khách hàng bán hàng qua các nền tảng như Amazon, TikTok.",
              en: "Priority route from Vietnam or China to the United States with faster processing (5–10 BSD). Tracking numbers are provided by USPS and will be activated within 24 hours of the tracking number being created. Suitable for sellers on platforms such as Amazon and TikTok.",
              zh: "越南或中国至美国的优先线路，处理更快（5–10 BSD）。提供USPS追踪号，自创建起24小时内激活。适合在Amazon、TikTok等平台销售的卖家。"
            }
          },
          {
            term: { vi: "CN — US Ship by Label (Trung Quốc → Mỹ theo nhãn)", en: "CN — US Ship by Label", zh: "CN — US Ship by Label（中国至美国贴标线路）" },
            desc: {
              vi: "Tuyến vận chuyển từ Trung Quốc đến Mỹ theo hình thức Ship by Label. Các đơn hàng đã có sẵn label từ merchant (tự mua hoặc label của nền tảng như TikTok, Amazon). THG chỉ có trách nhiệm vận chuyển các đơn hàng đến điểm tiếp nhận của đơn vị phát hành label. Toàn bộ quá trình giao hàng nội địa đến người nhận cuối sẽ do đơn vị phát hành label đảm nhận.",
              en: "Shipping route from China to the United States using the Ship by Label method. Orders already have labels provided by the merchant (either self-purchased or issued by an e-commerce platform such as TikTok or Amazon). THG is only responsible for transporting orders to the drop-off point of the label-issuing carrier. Last-mile delivery to the end recipient is handled entirely by the label-issuing carrier.",
              zh: "以Ship by Label方式从中国运往美国的线路。订单已有商家提供的标签（自购或TikTok、Amazon等平台发放）。THG仅负责将订单运至标签承运商的交接点，最后一公里配送由标签承运商全权负责。"
            }
          },
          {
            term: { vi: "Tax included (Đã bao gồm thuế)", en: "Tax included", zh: "Tax included（含税）" },
            desc: {
              vi: "Thuế nhập khẩu hoặc VAT đã được tính và bao gồm trong giá cước hiển thị. Khách hàng không phải trả thêm bất kỳ khoản thuế nào cho lô hàng đó tại nước đến.",
              en: "Import duties or VAT are already calculated and included in the displayed shipping rate. Customers will not be charged any additional taxes for that shipment upon delivery in the destination country.",
              zh: "进口关税或增值税已计算并包含在显示的运费中。客户在目的地国家收货时无需额外支付任何税费。"
            }
          },
          {
            term: { vi: "Active USPS (Trạng thái USPS hoạt động)", en: "Active USPS", zh: "Active USPS（USPS正常运营状态）" },
            desc: {
              vi: "Trạng thái xác nhận rằng hệ thống USPS đang hoạt động bình thường và chấp nhận lô hàng từ tuyến này. Thông tin này được cập nhật theo thời gian thực để đảm bảo không có gián đoạn dịch vụ.",
              en: "A real-time status confirming that the USPS network is operating normally and accepting shipments on this route. This information is updated in real time to ensure there are no service interruptions.",
              zh: "实时状态确认，表明USPS网络运营正常并接受本线路的货物。此信息实时更新，确保服务不中断。"
            }
          }
        ]
      },
      {
        title: { vi: "📦 Nhóm 5 — Loại hàng hóa", en: "📦 Group 5 — Product Types", zh: "📦 第5组 — 货物类型" },
        terms: [
          {
            term: { vi: "Regular Items / Hàng thông thường", en: "Regular Items / Regular Goods", zh: "Regular Items / 普通货物" },
            desc: {
              vi: "Các mặt hàng tiêu dùng thông thường không thuộc danh mục đặc biệt: quần áo, phụ kiện thời trang, đồ gia dụng, đồ chơi, văn phòng phẩm, v.v. Đây là loại hàng được chấp nhận trên hầu hết tất cả các tuyến vận chuyển.",
              en: "Standard consumer goods that do not fall under any special category: clothing, fashion accessories, household items, toys, stationery, etc. This product type is accepted on almost all available shipping routes.",
              zh: "不属于任何特殊类别的普通消费品：服装、时尚配件、家居用品、玩具、文具等。该类货物几乎适用于所有可用运输线路。"
            }
          },
          {
            term: { vi: "Cosmetics (Mỹ phẩm)", en: "Cosmetics", zh: "Cosmetics（化妆品）" },
            desc: {
              vi: "Sản phẩm chăm sóc sắc đẹp và cơ thể như kem dưỡng da, son môi, nước hoa, dầu gội, v.v. Mỹ phẩm có thể yêu cầu thêm giấy tờ kiểm định hoặc khai báo thành phần tùy theo quy định hải quan của quốc gia đến. Không phải tuyến nào cũng hỗ trợ gửi mỹ phẩm.",
              en: "Beauty and personal care products such as moisturizers, lipsticks, perfumes, shampoos, etc. Cosmetics may require additional certification documents or ingredient declarations depending on customs regulations in the destination country. Not all routes support cosmetics.",
              zh: "美容和个人护理产品，如润肤霜、口红、香水、洗发水等。化妆品可能需要根据目的地国家海关法规提供额外认证文件或成分申报。并非所有线路都支持化妆品运输。"
            }
          },
          {
            term: { vi: "Battery (Hàng có pin)", en: "Battery", zh: "Battery（含电池货物）" },
            desc: {
              vi: "Được chấp nhận: pin tích hợp trong sản phẩm và pin đi kèm sản phẩm (công suất không vượt quá 100Wh). Không được chấp nhận: pin nguyên chất (pin không kèm thiết bị), chất lỏng, bột, súng, đạn dược và các vật phẩm bị cấm khác. Chỉ một số tuyến nhất định hỗ trợ gửi hàng có pin. Vui lòng liên hệ đội ngũ tư vấn THG Fulfill trước khi gửi hàng có pin lithium.",
              en: "Accepted: batteries integrated into a product and batteries included alongside a product (capacity must not exceed 100Wh). Not accepted: standalone batteries (not attached to a device), liquids, powders, firearms, ammunition, and other prohibited items. Only specific routes support battery shipments. Please contact the THG Fulfill advisory team before shipping any lithium battery products.",
              zh: "允许：集成在产品中的电池及随产品附带的电池（容量不超过100Wh）。不允许：独立电池（不附带设备）、液体、粉末、枪支、弹药及其他禁运物品。仅特定线路支持含电池货物。寄送锂电池产品前请联系THG Fulfill顾问团队。"
            }
          }
        ]
      },
      {
        title: { vi: "🏷️ Nhóm 6 — Mã vận đơn & Tracking", en: "🏷️ Group 6 — Shipping Codes & Tracking", zh: "🏷️ 第6组 — 运单号与追踪" },
        terms: [
          {
            term: { vi: "YTYCPREC (VN) — Epacket VN-WW", en: "YTYCPREC (VN) — Epacket VN-WW", zh: "YTYCPREC (VN) — Epacket VN-WW" },
            desc: {
              vi: "Mã tracking bắt đầu bằng YTYCPREC hoặc chứa 'VN' trong mã dịch vụ là thuộc tuyến Epacket xuất phát từ Việt Nam đi toàn cầu (VN → Worldwide). Quy tắc nhận biết: mã nào có chữ VN là hàng xuất từ Việt Nam.",
              en: "Tracking codes starting with YTYCPREC or containing 'VN' in the service code belong to the Epacket line originating from Vietnam to worldwide (VN → WW). Rule of thumb: any code containing 'VN' indicates shipment from Vietnam.",
              zh: "以YTYCPREC开头或服务代码中含有'VN'的追踪号属于从越南发往全球的Epacket线路。识别规则：代码中含'VN'表示从越南发货。"
            }
          },
          {
            term: { vi: "YTYCPREC (CN) — Epacket CN-WW", en: "YTYCPREC (CN) — Epacket CN-WW", zh: "YTYCPREC (CN) — Epacket CN-WW" },
            desc: {
              vi: "Mã tracking YTYCPREC không chứa 'VN' trong mã dịch vụ là thuộc tuyến Epacket xuất phát từ Trung Quốc đi toàn cầu (CN → Worldwide). Quy tắc nhận biết: mã nào không có chữ VN là hàng xuất từ Trung Quốc.",
              en: "Tracking codes YTYCPREC without 'VN' in the service code belong to the Epacket line originating from China to worldwide (CN → WW). Rule of thumb: any code without 'VN' indicates shipment from China.",
              zh: "不含'VN'的YTYCPREC追踪号属于从中国发往全球的Epacket线路。识别规则：代码中不含'VN'表示从中国发货。"
            }
          },
          {
            term: { vi: "Cách phân biệt mã VN và CN", en: "How to distinguish VN vs CN codes", zh: "如何区分VN和CN代码" },
            desc: {
              vi: "Nguyên tắc chung: mã nào có chứa 'VN' thì thuộc về tuyến Việt Nam, mã nào không có 'VN' thì thuộc về tuyến Trung Quốc (China). Điều này áp dụng cho tất cả các mã dịch vụ epacket của THG Fulfill.",
              en: "General rule: any code containing 'VN' belongs to the Vietnam route, any code without 'VN' belongs to the China route. This applies to all THG Fulfill epacket service codes.",
              zh: "通用规则：含'VN'的代码属于越南线路，不含'VN'的代码属于中国线路。适用于THG Fulfill所有epacket服务代码。"
            }
          }
        ]
      }
    ];

  return (
    <div className="bg-white border border-[var(--pricing-border)] rounded-xl p-6 md:p-8 shadow-sm">
      <h3 className="text-xl font-black text-navy mb-6 pb-4 border-b border-[var(--pricing-border)]">
        {language === 'vi' ? '📝 Bảng giải thích thuật ngữ' : language === 'en' ? '📝 Glossary of Terms' : '📝 术语解释表'}
      </h3>
      <p className="text-[12px] text-muted-foreground mb-8 -mt-2">
        {language === 'vi'
          ? 'Dành cho khách hàng sử dụng dịch vụ vận chuyển quốc tế THG Fulfill · Cập nhật: Tháng 3/2026'
          : language === 'en'
            ? 'For customers using THG Fulfill international shipping services · Updated: March 2026'
            : '适用于使用THG Fulfill国际运输服务的客户 · 更新：2026年3月'}
      </p>
      <div className="space-y-10">
        {groups.map((group, gi) => (
          <div key={gi}>
            <h4 className="text-[13px] font-extrabold text-primary uppercase tracking-widest mb-4 pb-2 border-b border-[var(--pricing-border)]">
              {group.title[language as keyof typeof group.title]}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.terms.map((t, ti) => (
                <div key={ti} className="bg-[#FAFAF8] p-5 rounded-lg border border-[#E9E9E6]">
                  <h5 className="font-bold text-[14px] text-navy mb-2 notranslate"
                    dangerouslySetInnerHTML={{ __html: t.term[language as keyof typeof t.term] }}
                  />
                  <p className="text-[12.5px] text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: t.desc[language as keyof typeof t.desc] }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 pt-6 border-t border-[var(--pricing-border)] text-center text-[12px] text-muted-foreground">
        {language === 'vi'
          ? 'Cần hỗ trợ thêm? Email: info@thgfulfill.com · Hotline: 0335.124.089'
          : language === 'en'
            ? 'Need further assistance? Email: info@thgfulfill.com · Hotline: 0335.124.089'
            : '需要更多帮助？邮箱：info@thgfulfill.com · 热线：0335.124.089'}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */
const InternationalPricingPage = () => {
  const { t, tVi, effectiveLanguage: lang } = useI18n();
  // Helper: get route name by language
  const getRouteName = (r: typeof ROUTES[EpacketRoute]) => {
    if (lang === 'zh') return r.nameZh;
    if (lang === 'en') return r.nameEn;
    return r.nameVi;
  };
  const getRouteTime = (r: typeof ROUTES[EpacketRoute]) => {
    if (lang === 'zh') return r.time.zh;
    if (lang === 'en') return r.time.en;
    return r.time.vi;
  };
  const getCargoLabel = (c: CargoType) => {
    if (lang === 'zh') return CARGO_LABELS[c].zh;
    if (lang === 'en') return CARGO_LABELS[c].en;
    return CARGO_LABELS[c].vi;
  };
  const lark = useLarkPricingContext();

  // State
  const [service, setService] = useState<ServiceTab>("epacket");
  const [route, setRoute] = useState<EpacketRoute>("std-vn-ww");
  const [cargo, setCargo] = useState<CargoType>("standard");
  const [expressRoute, setExpressRoute] = useState<ExpressRoute>("vn-us");
  const [city, setCity] = useState<"hcm" | "hn">("hcm");

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

  // Detect if data is from Lark overlay (VND for VN routes) or hardcoded fallback (always USD)
  const isLarkData = useMemo(() => {
    if (route === "cn-us-label") return false;
    const dataKey = DATA_KEY_MAP[`${route}_${cargo}`];
    if (!dataKey) return false;
    return !!(larkOverlay[dataKey]?.length);
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

  const routeConfig = ROUTES[route];

  /* ─── Extras data (Lark overlay → fallback) ─── */
  const vatData = larkOverlay.vatData?.length ? larkOverlay.vatData : (pricingData as any).vatData || [];
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
    { dest: "Canada", charge: "355.697 VND (for first 1KG) 56.342 VND/KG (for next 1kg)", period: "20 days" },
    { dest: "Mexico", charge: "108.252 VND/parcel", period: "15 days" },
    { dest: "Switzerland", charge: "216.820 VND/parcel", period: "14 days" },
    { dest: "France", charge: "216.820 VND/parcel", period: "14 days" },
    { dest: "Norway", charge: "216.820 VND/parcel", period: "14 days" },
    { dest: "Australia", charge: "216.820 VND/parcel", period: "14 days" },
    { dest: "Saudi Arabia", charge: "268.729 VND/parcel (for within 5KG) 32.286 VND/KG (over 5KG, for each 1kg)", period: "15 days" },
    { dest: "United Arab Emirates", charge: "126.610 VND/parcel (for within 5KG) 32.286 VND/KG (over 5KG, for each 1kg)", period: "15 days" },
    { dest: "Japan", charge: "173.455 VND/parcel", period: "14 days" },
    { dest: "Hong Kong", charge: "A new YT tracking number will be generated for re-delivery, and the re-delivery fee will be charged at the VN-HK freight rate.", period: "14 days" },
    { dest: "United Kingdom", charge: "173.455 VND/parcel", period: "14 days" },
    { dest: "Singapore", charge: "260.183 VND/parcel", period: "14 days" },
    { dest: "Brazil", charge: "260.183 VND/parcel", period: "14 days" },
    { dest: "Malta, Cyprus, Slovenia, Romania...", charge: "Re-delivery service for overseas returns is not provided", period: "—" },
  ];
  const redeliveryData = larkOverlay.redeliveryData?.length ? larkOverlay.redeliveryData : (pricingData as any).redeliveryData?.length ? (pricingData as any).redeliveryData : FALLBACK_REDELIVERY;

  /* ─── Express data (Lark overlay → fallback) ─── */
  const loThuong = larkOverlay.loThuong?.length ? larkOverlay.loThuong : (pricingData as any).loThuong || [];
  const loPin = larkOverlay.loPin?.length ? larkOverlay.loPin : (pricingData as any).loPin || [];
  const loMypham = larkOverlay.loMypham?.length ? larkOverlay.loMypham : (pricingData as any).loMypham || [];

  /* ─── Search Widget State ─── */
  const [searchFrom, setSearchFrom] = useState("VN");
  const [searchTo, setSearchTo] = useState("ALL");
  const [searchSvc, setSearchSvc] = useState("epacket");
  const [searchCargo, setSearchCargo] = useState("standard");
  const [searchWeight, setSearchWeight] = useState(1);
  const [showResult, setShowResult] = useState(false);






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

      const data = larkOverlay[dataKey]?.length ? larkOverlay[dataKey] : (pricingData as any)[dataKey] || [];
      if (!data.length) return { error: "Dữ liệu đang cập nhật" };

      // Detect if data is VND (VN routes from Lark)
      const isVndData = searchFrom === "VN" && larkOverlay[dataKey]?.length;

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
  }, [searchFrom, searchTo, searchSvc, searchCargo, searchWeight, showResult, larkOverlay]);

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
            <div className="mt-3">
              <SyncBadge />
            </div>
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
                {searchCountries.map((col: any) => (
                  <option key={col.key} value={col.key.toUpperCase()}>{col.label}</option>
                ))}
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
                <div className="inline-block bg-[rgba(184,146,42,0.15)] text-[#B8922A] text-[12px] font-bold tracking-[0.1em] px-3 py-1 rounded-full uppercase mb-4">
                  {tVi("pricing.res_title")} · {searchSvc === 'epacket' ? tVi("pricing.svc_epa") : tVi("pricing.svc_exp")}
                </div>
                <h3 className="text-xl md:text-2xl font-black text-navy flex items-center justify-center md:justify-start gap-3">
                  {searchFrom === 'VN' ? tVi("pricing.opt_vn") : tVi("pricing.opt_cn")}
                  <span className="text-gray-400">✈️</span>
                  {searchTo === 'ALL' ? tVi("pricing.opt_all") : (countryNames[searchTo.toLowerCase()] || searchTo.toUpperCase())}
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
                    <div className="text-[12px] font-bold text-muted-foreground uppercase tracking-[0.1em] mb-1">{tVi("pricing.res_base")}</div>
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
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          {([
            { id: "epacket" as ServiceTab, icon: "📦", name: tVi("pricing.svc_epa"), desc: tVi("pricing.tab_epa_desc") },
            { id: "express" as ServiceTab, icon: "🚢✈️", name: tVi("pricing.svc_exp"), desc: tVi("pricing.tab_exp_desc") },
            { id: "terms" as ServiceTab, icon: "📚", name: tVi("pricing.svc_terms"), desc: tVi("pricing.tab_terms_desc") }
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setService(tab.id)}
              className={`flex-1 w-full border-2 rounded-xl p-4 text-left transition-all relative overflow-hidden cursor-pointer ${service === tab.id
                ? "border-primary bg-[#FFFBF0]"
                : "border-[var(--pricing-border)] bg-white hover:border-primary/40"
                }`}
            >
              {service === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary" />}
              <div className="text-xl mb-1">{tab.icon}</div>
              <div className={`font-bold text-[15px] ${service === tab.id ? "text-primary" : "text-navy"}`}>{tab.name}</div>
              <div className="text-[13px] text-muted-foreground mt-1">{tab.desc}</div>
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════
            PANEL: TERMINOLOGY
           ═══════════════════════════════ */}
        {service === "terms" && (
          <TerminologyPanel />
        )}

        {/* ═══════════════════════════════
            PANEL: EPACKET
           ═══════════════════════════════ */}
        {service === "epacket" && (
          <div>
            {/* ──── ROUTE TABS (Level 2) ──── */}
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">{lang === 'zh' ? '选择运输路线' : lang === 'en' ? 'SELECT SHIPPING ROUTE' : 'CHỌN TUYẾN VẬN CHUYỂN'}</p>
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
                  <span className={`font-bold text-[13px] leading-snug ${route === rid ? "text-primary" : "text-navy"}`}>{getRouteName(r)}</span>
                  <span className="text-[12px] text-muted-foreground">{getRouteTime(r)}</span>
                  <div className="flex gap-1 flex-wrap mt-0.5">
                    {r.type === "merchant" && <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 notranslate" translate="no">🛒 Ship by Merchant</span>}
                    {r.type === "label" && (
                      <>
                        <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 notranslate" translate="no">🏷️ Ship by Label</span>
                        <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 notranslate" translate="no">📬 Drop-off USPS</span>
                      </>
                    )}
                    {rid === "pri-vncn-us" && <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{lang === 'zh' ? '✅ 含税 · Active USPS' : lang === 'en' ? '✅ Tax Included · Active USPS' : '✅ Bao thuế · Active USPS'}</span>}
                    {r.cargo.length > 0 && (
                      <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                        {r.cargo.map(c => CARGO_ICONS[c]).join(" ")} {r.cargo.map(c => getCargoLabel(c)).join(" · ")}
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
                  <h3 className="font-extrabold text-base text-navy mb-2 notranslate">🏷️ <span translate='no'>CN</span> – <span translate='no'>US</span> Ship by Label</h3>
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

                {/* Ship by Label sub-tabs */}
                <ShipByLabelPanel larkData={larkOverlay["shipByLabelCnUs"]} />
              </div>
            ) : (
              <>
                {/* ──── CARGO FILTER ──── */}
                <div className="flex items-center gap-3 mb-4 flex-wrap justify-between">
                  {routeConfig.cargo.length > 0 && (
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[13px] font-semibold text-muted-foreground whitespace-nowrap">Loại hàng:</span>
                      <div className="flex gap-2 flex-wrap">
                        {(["standard", "cosmetics", "battery"] as CargoType[]).map(c => {
                          const enabled = routeConfig.cargo.includes(c);
                          return (
                            <button
                              key={c}
                              onClick={() => handleCargoSwitch(c)}
                              disabled={!enabled}
                              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold border-[1.5px] transition-all ${!enabled
                                ? "opacity-30 cursor-not-allowed border-[var(--pricing-border)] bg-white"
                                : cargo === c
                                  ? "bg-primary border-primary text-white"
                                  : "border-[var(--pricing-border)] bg-white hover:border-primary hover:text-primary"
                                }`}
                            >
                              {CARGO_ICONS[c]} {getCargoLabel(c)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* ──── ANNOTATION ──── */}
                <div key={`anno-${route}`} className="bg-[#FFFBEE] border-[1.5px] border-dashed border-[#D4A843] rounded-[10px] p-3 text-[12px] text-[#92670A] mb-4 flex gap-2">
                  <span>ℹ️</span>
                  <div>
                    <strong>{lang === 'zh' ? '当前显示：' : lang === 'en' ? 'Showing:' : 'Đang hiển thị:'}</strong> {route === "pri-vncn-us"
                      ? <>Priority · {getRouteName(routeConfig)} — {lang === 'zh' ? '含税, Active USPS 追踪。不含偏远附加费。' : lang === 'en' ? 'Tax included, Active USPS tracking. Excludes remote surcharges.' : 'Bao thuế, Active USPS tracking. Giá chưa bao gồm phụ phí vùng sâu.'}</>
                      : <>Epacket · {getRouteName(routeConfig)} {routeConfig.cargo.length > 0 ? `· ${getCargoLabel(cargo)}` : ""} — {lang === 'zh' ? '送达目的国。不含偏远附加费和增值税。' : lang === 'en' ? 'Delivered to destination. Excludes remote surcharges & VAT.' : 'Giao tận tay khách hàng tại quốc gia đích. Giá chưa bao gồm phụ phí vùng sâu & VAT.'}</>
                    }
                  </div>
                </div>

                {/* ──── FEE INFO BANNER ──── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="bg-white border border-[var(--pricing-border)] rounded-xl px-4 py-3 flex items-center gap-3 text-[13px]">
                    <span className="text-lg">💳</span>
                    <div>
                      <span className="font-bold text-navy notranslate" translate="no">
                        {lang === 'zh' ? '订单处理费' : lang === 'en' ? 'Order processing fee' : 'Phí xử lý đơn hàng'}:
                      </span>{" "}
                      <span className="text-primary font-extrabold notranslate" translate="no">0.7$</span>
                      <p className="text-muted-foreground text-[11px] mt-0.5">
                        {lang === 'zh' ? '(如使用THG仓库系统处理订单)' : lang === 'en' ? '(If using THG warehouse system)' : '(Nếu sử dụng hệ thống kho THG để xử lý đơn hàng)'}
                      </p>
                    </div>
                  </div>
                  {route === "pri-vncn-us" && (
                    <div className="bg-white border border-[var(--pricing-border)] rounded-xl px-4 py-3 flex items-center gap-3 text-[13px]">
                      <span className="text-lg">📡</span>
                      <div>
                        <span className="font-bold text-navy notranslate" translate="no">
                          {lang === 'zh' ? 'Active tracking费' : lang === 'en' ? 'Active tracking fee' : 'Phí active tracking'}:
                        </span>{" "}
                        <span className="text-primary font-extrabold notranslate" translate="no">1$</span>
                        <p className="text-muted-foreground text-[11px] mt-0.5">
                          {lang === 'zh' ? '(如使用USPS的active tracking服务)' : lang === 'en' ? '(If using Active USPS tracking)' : '(Nếu sử dụng dịch vụ active tracking trước với USPS)'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* ──── PRICE TABLE ──── */}
                <div key={`table-${route}`}>
                  {route === "pri-vncn-us" ? (
                    <div className="flex flex-col gap-6">
                      <PriceTable
                        title="Bảng Giá Chi Tiết VN → US (Priority)"
                        badge={<span className="notranslate font-bold" translate='no'>VN-US (VND) · Priority Service (7-9 bsd)</span>}
                        data={larkOverlay["uspsCn"]?.length ? larkOverlay["uspsCn"] : (pricingData as any)["uspsVn"] || []}
                        columns={[{ key: "rate", label: "VN-US · Priority Service (VNĐ)" }]}
                        currencySymbol="₫"
                      />
                      <PriceTable
                        title="Bảng Giá Chi Tiết CN → US (Priority)"
                        badge={<span className="notranslate font-bold" translate='no'>CN-US (USD) · Priority Service (5-10 bsd)</span>}
                        data={larkOverlay["uspsCnUs"]?.length ? larkOverlay["uspsCnUs"] : (pricingData as any)["uspsCn"] || []}
                        columns={[{ key: "rate", label: "CN-US · Priority Service ($)" }]}
                      />
                    </div>
                  ) : (
                    <PriceTable
                      title="Bảng Giá Chi Tiết"
                      badge={<div className="flex items-center gap-1">{getRouteName(routeConfig)} <span className="opacity-50">·</span> <span>{getCargoLabel(cargo)}</span></div>}
                      data={currentData}
                      columns={tableColumns.map(c => ({ ...c, label: c.label }))}
                      currencySymbol={route.startsWith("std-vn") ? "₫" : "$"}
                      sla={(currentData as any)?.meta}
                    />
                  )}
                </div>

                {/* ──── POST-TABLE ACCORDIONS ──── */}
                <div className="flex flex-col gap-3 mt-6">
                  {/* 1. Surcharges */}
                  <Accordion icon="💰" title="Phụ Phí & Dịch Vụ Khác" defaultOpen>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-[13px] text-navy mb-2">📍 Phụ Phí Vùng Sâu (Remote Area Zipcode)</h4>
                        <p className="text-[12px] text-muted-foreground mb-3">
                          Tải file danh sách zipcode remote area để kiểm tra. Dữ liệu được tự động đồng bộ từ nguồn gốc khi có cập nhật.
                        </p>
                        <div className="flex flex-col gap-2">
                          {[
                            { label: "🇺🇸 U.S. Remote Area Price Table", icon: "📊", url: "https://thgfulfill.sg.larksuite.com/sheets/GeOhsIMqrhJ3JztNKVDlfWi9gAe?sheet=Wsz3Aw" },
                            { label: "🇯🇵 Japan (JP) Remote Zipcode", icon: "📮", url: "https://thgfulfill.sg.larksuite.com/sheets/GeOhsIMqrhJ3JztNKVDlfWi9gAe?sheet=rfsGfU" },
                            { label: "🇭🇷 Croatia (HR) Remote Zipcode", icon: "📮", url: "https://thgfulfill.sg.larksuite.com/sheets/GeOhsIMqrhJ3JztNKVDlfWi9gAe?sheet=PQLJFL" },
                            { label: "🇬🇧 Great Britain (GB) Remote Zipcode", icon: "📮", url: "https://thgfulfill.sg.larksuite.com/sheets/GeOhsIMqrhJ3JztNKVDlfWi9gAe?sheet=XzQ2aN" },
                            { label: "🇸🇪 Sweden (SE) Remote Zipcode", icon: "📮", url: "https://thgfulfill.sg.larksuite.com/sheets/GeOhsIMqrhJ3JztNKVDlfWi9gAe?sheet=DqD99A" },
                          ].map((file, i) => (
                            <a
                              key={i}
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-[var(--pricing-border)] hover:border-primary hover:bg-[#FFFBF0] transition-all group text-[13px]"
                            >
                              <span className="text-xl shrink-0">{file.icon}</span>
                              <span className="flex-1 font-medium text-navy group-hover:text-primary transition-colors">{file.label}</span>
                              <span className="text-[11px] text-muted-foreground bg-secondary px-2 py-1 rounded-full flex items-center gap-1">
                                📥 Tải file
                              </span>
                            </a>
                          ))}
                        </div>

                      </div>
                      <div>
                        <h4 className="font-bold text-[13px] text-navy mb-2">🌍 Thuế VAT & Phí Xử Lý</h4>
                        {vatData.length > 0 ? (
                          <CompactAccordionTable
                            headers={["Quốc Gia", "VAT %", "Service Charge"]}
                            data={vatData}
                            renderRow={(v, i) => (
                              <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                                <td className="px-4 py-3"><span className="notranslate">{v.country}</span></td>
                                <td className="px-4 py-3"><span className="notranslate" translate="no">{v.vat}</span></td>
                                <td className="px-4 py-3 font-bold"><span className="notranslate" translate="no">{v.service}</span></td>
                              </tr>
                            )}
                          />
                        ) : (
                          <p className="text-muted-foreground text-[13px] italic">Dữ liệu đang cập nhật</p>
                        )}
                      </div>
                    </div>
                  </Accordion>

                  {/* 2. Re-delivery */}
                  <Accordion icon="🔁" title="Phí Reship (Gửi Lại)">
                    {redeliveryData.length > 0 ? (
                      <div>
                        <p className="text-[13px] text-muted-foreground italic mb-3">* Phí reship áp dụng khi kiện hàng bị trả về do địa chỉ sai, không có người nhận, hoặc bị từ chối nhận. Nếu không có phản hồi trong thời gian quy định, kiện hàng sẽ bị tiêu hủy theo mặc định.</p>
                        <CompactAccordionTable
                          headers={["Country", "Re-delivery charge", "Request re-delivery period"]}
                          data={redeliveryData}
                          renderRow={(r, i) => (
                            <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                              <td className="px-4 py-3"><span className="notranslate font-medium">{r.dest || r.country}</span></td>
                              <td className="px-4 py-3 text-[12px]"><span className="notranslate">{r.charge || r.usd}</span></td>
                              <td className="px-4 py-3 text-[12px] font-bold"><span className="notranslate">{r.period || "—"}</span></td>
                            </tr>
                          )}
                        />
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-[13px] italic text-center py-4">📝 Dữ liệu phí reship đang được cập nhật.</p>
                    )}
                  </Accordion>

                  {/* 3. Shipping Policy — filtered by active route+cargo */}
                  {(() => {
                    const effectiveCargo = routeConfig.cargo.length > 0 ? cargo : "standard";
                    const ids = ROUTE_POLICY_MAP[`${route}_${effectiveCargo}`] ?? [];
                    const policies = larkPoliciesI18n.filter(p => ids.includes(p.id));
                    if (policies.length === 0) return null;
                    return (
                      <Accordion key={`policy-${route}-${effectiveCargo}`} icon="🛡️" title="Chính Sách Vận Chuyển">
                        <RoutePolicyContent policies={policies} />
                      </Accordion>
                    );
                  })()}

                  {/* 4. Terms & FAQ */}
                  <Accordion icon="📄" title="Điều Khoản Vận Chuyển & FAQ">
                    <ShippingTermsQnAPanel />
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
                <span className={`font-bold text-[13px] ${expressRoute === "vn-us" ? "text-primary" : "text-navy"}`}>🇻🇳 VN → US (UPS)</span>
                <span className="text-[12px] text-muted-foreground">⏱ 3–7 BSD</span>
                <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 w-fit">⚠️ Chưa gồm tax NK US</span>
              </button>
              <button
                onClick={() => setExpressRoute("cn-us")}
                className={`flex flex-col gap-1 border-[1.5px] rounded-[10px] p-3 text-left transition-all ${expressRoute === "cn-us" ? "border-primary bg-[#FFFBF0]" : "border-[var(--pricing-border)] bg-white hover:border-primary/40"
                  }`}
              >
                <span className={`font-bold text-[13px] ${expressRoute === "cn-us" ? "text-primary" : "text-navy"}`}>🇨🇳 CN → US (Air & Sea)</span>
                <span className="text-[12px] text-muted-foreground">⏱ 6–25 BSD</span>
                <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 w-fit">✈️ Air · 🚢 Sea</span>
              </button>
            </div>



            {expressRoute === "vn-us" && (
              <div>
                <div className="flex justify-center mb-6">
                  <div className="bg-[#FAF9F6] border-[1.5px] border-[var(--pricing-border)] p-1 rounded-xl inline-flex shadow-sm">
                    <button
                      onClick={() => setCity("hcm")}
                      className={`px-8 py-2.5 rounded-lg text-[13px] font-bold transition-all ${city === "hcm"
                        ? "bg-white text-primary shadow-sm border border-[var(--pricing-border)]"
                        : "text-muted-foreground hover:bg-white/50 border border-transparent"
                        }`}
                    >
                      KHO HỒ CHÍ MINH
                    </button>
                    <button
                      onClick={() => setCity("hn")}
                      className={`px-8 py-2.5 rounded-lg text-[13px] font-bold transition-all ${city === "hn"
                        ? "bg-white text-primary shadow-sm border border-[var(--pricing-border)]"
                        : "text-muted-foreground hover:bg-white/50 border border-transparent"
                        }`}
                    >
                      KHO HÀ NỘI
                    </button>
                  </div>
                </div>

                {larkOverlay["expressVnUs"] && (
                  <div className="space-y-6">
                    {/* Saver <= 20kg Table */}
                    <div className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-navy px-5 py-3 flex items-center justify-between flex-wrap gap-2">
                        <span className="text-white font-bold text-[13px] flex items-center gap-2">
                          ✈️ UPS Saver — Phân Mức KG
                        </span>
                        <span className="bg-[rgba(184,146,42,0.25)] text-[#D4A843] text-[12px] font-bold px-2 py-0.5 rounded-full">
                          ⏱ {city === "hcm" ? "3-5" : "3-5"} BSD
                        </span>
                      </div>
                      <table className="w-full border-collapse text-[13px]">
                        <thead>
                          <tr className="bg-[#FAFAF8]">
                            <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Cân nặng (kg)</th>
                            <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Giá cước (VNĐ)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(larkOverlay["expressVnUs"]?.[city]?.saver || []).map((r: any, i: number) => (
                            <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                              <td className="px-5 py-2">{r.kg}</td>
                              <td className="px-5 py-2 font-bold text-navy notranslate">
                                {r.price && r.price !== "Liên hệ"
                                  ? `${Number(r.price).toLocaleString("vi-VN")} ₫`
                                  : r.price}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Expedited > 20kg Table */}
                    <div className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-[#16213E] px-5 py-3 flex items-center justify-between flex-wrap gap-2">
                        <span className="text-white font-bold text-[13px] flex items-center gap-2">
                          🚢 UPS Expedited — Hàng Bulk
                        </span>
                        <span className="bg-[rgba(184,146,42,0.25)] text-[#D4A843] text-[12px] font-bold px-2 py-0.5 rounded-full">
                          ⏱ {city === "hcm" ? "5-7" : "5-7"} BSD
                        </span>
                      </div>
                      <table className="w-full border-collapse text-[13px]">
                        <thead>
                          <tr className="bg-[#FAFAF8]">
                            <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Hạng mức (kg)</th>
                            <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Giá cước (VNĐ/kg)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(larkOverlay["expressVnUs"]?.[city]?.expedited || []).map((r: any, i: number) => (
                            <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                              <td className="px-5 py-2">{r.bracket}</td>
                              <td className="px-5 py-2 font-bold text-navy notranslate">
                                {r.price && r.price !== "Liên hệ"
                                  ? `${Number(r.price).toLocaleString("vi-VN")} ₫${String(r.bracket).includes("-") || String(r.bracket).includes(">") ? " / kg" : ""}`
                                  : r.price}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-3 mt-6">
                  <Accordion icon="💰" title="Phụ Phí, Dịch Vụ & Re-delivery" defaultOpen>
                    <div className="flex flex-col gap-6">
                      <div>
                        <h4 className="font-bold text-[13px] text-navy mb-2">📍 Phụ Phí Vùng Sâu (Remote Area – US)</h4>
                        {larkOverlay.usRemoteSurcharge?.priceRows?.length ? (
                          <>
                            <CompactAccordionTable
                              headers={["Weight (kg)", "Phụ phí (VNĐ)"]}
                              data={larkOverlay.usRemoteSurcharge.priceRows}
                              renderRow={(r: any, i: number) => (
                                <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                                  <td className="px-4 py-3"><span className="notranslate" translate="no">{r.kg} kg</span></td>
                                  <td className="px-4 py-3 font-bold"><span className="notranslate" translate="no">{Math.round(r.vnd).toLocaleString("vi-VN")} ₫</span></td>
                                </tr>
                              )}
                            />
                            {larkOverlay.usRemoteSurcharge.zipcodeRows?.length > 0 && (
                              <div className="mt-4">
                                <h5 className="font-bold text-[12px] text-navy mb-2">📮 US Remote Zipcode List ({larkOverlay.usRemoteSurcharge.zipcodeRows.length} entries)</h5>
                                <div className="max-h-[200px] overflow-y-auto border border-[var(--pricing-border)] rounded-lg">
                                  <table className="w-full border-collapse text-[12px]">
                                    <thead className="sticky top-0"><tr className="bg-[#FAFAF8]">
                                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Zipcode Range</th>
                                      <th className="px-3 py-2 text-left text-[10px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">State</th>
                                    </tr></thead>
                                    <tbody>
                                      {larkOverlay.usRemoteSurcharge.zipcodeRows.map((z: any, i: number) => (
                                        <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0]">
                                          <td className="px-3 py-1.5 font-mono notranslate">{z.zipcode}</td>
                                          <td className="px-3 py-1.5 notranslate">{z.state}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </>
                        ) : remoteSurcharge.length > 0 ? (
                          <CompactAccordionTable
                            headers={["Weight (kg)", "Surcharge ($)"]}
                            data={remoteSurcharge}
                            renderRow={(r: any, i: number) => (
                              <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                                <td className="px-4 py-3"><span className="notranslate" translate="no">{r.kg} kg</span></td>
                                <td className="px-4 py-3 font-bold"><span className="notranslate" translate="no">{r.usd ? `$${parseFloat(r.usd).toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "Liên hệ THG"}</span></td>
                              </tr>
                            )}
                          />
                        ) : (
                          <p className="text-muted-foreground text-[13px] italic">📝 Dữ liệu Remote Surcharge đang cập nhật.</p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-[13px] text-navy mb-2">🔁 Phí Re-delivery (Gửi Lại)</h4>
                        <p className="text-[12px] text-muted-foreground italic mb-2">* Áp dụng khi hàng bị trả về do sai địa chỉ, không nhận, hoặc từ chối. Nếu không có phản hồi trong thời gian quy định, kiện hàng sẽ bị tiêu hủy theo mặc định.</p>
                        {redeliveryData.length > 0 ? (
                          <CompactAccordionTable
                            headers={["Country", "Re-delivery charge", "Request re-delivery period"]}
                            data={redeliveryData}
                            renderRow={(r: any, i: number) => (
                              <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                                <td className="px-4 py-3"><span className="notranslate font-medium">{r.dest || r.country}</span></td>
                                <td className="px-4 py-3 text-[12px]"><span className="notranslate">{r.charge || r.usd}</span></td>
                                <td className="px-4 py-3 font-bold text-[12px]"><span className="notranslate">{r.period || "—"}</span></td>
                              </tr>
                            )}
                          />
                        ) : (
                          <p className="text-muted-foreground text-[13px] italic">📝 Dữ liệu Re-delivery đang cập nhật.</p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-[13px] text-navy mb-2">📦 Phí Dịch Vụ Thêm</h4>
                        <table className="w-full border-collapse text-[13px]">
                          <thead><tr className="bg-[#FAFAF8]">
                            <th className="px-4 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Dịch Vụ</th>
                            <th className="px-4 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Phí</th>
                          </tr></thead>
                          <tbody>
                            <tr className="border-b border-[var(--pricing-border)]"><td className="px-4 py-3">Khai báo hải quan</td><td className="px-4 py-3 font-bold">Liên hệ THG</td></tr>
                            <tr className="border-b border-[var(--pricing-border)]"><td className="px-4 py-3">Đóng gói thêm</td><td className="px-4 py-3 font-bold">Liên hệ THG</td></tr>
                            <tr><td className="px-4 py-3">Bảo hiểm hàng hóa</td><td className="px-4 py-3 font-bold">Liên hệ THG</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Accordion>
                  <Accordion icon="📄" title="Điều Khoản Vận Chuyển & FAQ">
                    <ShippingTermsQnAPanel />
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
                    { name: "✈️ DHL Air – Hỏa Tốc", time: "3–5 BSD", bg: "bg-[#C8102E]", tax: false, price: 11 },
                    { name: "✈️ UPS Air – Nhanh", time: "6–10 BSD", bg: "bg-navy", tax: true, price: 10.50 },
                    { name: "✈️ UPS Air – Tiêu Chuẩn", time: "8–10 BSD", bg: "bg-[#16213E]", tax: true, price: 9 },
                    { name: "🚢 Mason Sea", time: "20–25 BSD", bg: "bg-[#0F3460]", tax: true, price: 3 },
                  ].map((line, i) => (
                    <div key={i} className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden shadow-sm">
                      <div className={`${line.bg} px-5 py-3 flex items-center justify-between flex-wrap gap-2`}>
                        <span className="text-white font-bold text-[13px] flex items-center gap-2">
                          {line.name} <span className="font-normal text-[13px] opacity-80">{line.time}</span>
                        </span>
                        <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${line.tax ? "bg-emerald-100/20 text-emerald-300" : "bg-amber-100/20 text-amber-300"}`}>
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
                          <tr className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                            <td className="px-5 py-3 font-medium">21KG+</td>
                            <td className="px-5 py-3 font-bold text-navy notranslate">
                              <span translate="no">{`$${line.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}`}</span>
                            </td>
                            <td className="px-5 py-3 text-muted-foreground text-[12px] italic">Báo giá theo lô</td>
                          </tr>
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
                            headers={["Weight (kg)", "Surcharge ($)"]}
                            data={remoteSurcharge}
                            renderRow={(r: any, i: number) => (
                              <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                                <td className="px-4 py-3"><span className="notranslate" translate="no">{r.kg} kg</span></td>
                                <td className="px-4 py-3 font-bold"><span className="notranslate" translate="no">{r.usd ? `$${parseFloat(r.usd).toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "Liên hệ THG"}</span></td>
                              </tr>
                            )}
                          />
                        ) : (
                          <p className="text-muted-foreground text-[13px] italic">Dữ liệu đang cập nhật</p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-[13px] text-navy mb-2">📦 Phí Dịch Vụ Thêm</h4>
                        <table className="w-full border-collapse text-[13px]">
                          <thead><tr className="bg-[#FAFAF8]">
                            <th className="px-4 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Dịch Vụ</th>
                            <th className="px-4 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Phí</th>
                          </tr></thead>
                          <tbody>
                            <tr className="border-b border-[var(--pricing-border)]"><td className="px-4 py-3">Kiểm tra hàng tại kho</td><td className="px-4 py-3 font-bold">Liên hệ THG</td></tr>
                            <tr className="border-b border-[var(--pricing-border)]"><td className="px-4 py-3">Đóng gói / Re-pack</td><td className="px-4 py-3 font-bold">Liên hệ THG</td></tr>
                            <tr><td className="px-4 py-3">Bảo hiểm lô hàng</td><td className="px-4 py-3 font-bold">Liên hệ THG</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Accordion>
                  {/* Shipping Policy for Priority route */}
                  {(() => {
                    const ids = ROUTE_POLICY_MAP[`${route}_standard`] ?? [];
                    const policies = larkPoliciesI18n.filter(p => ids.includes(p.id));
                    if (policies.length === 0) return null;
                    return (
                      <Accordion key={`policy-pri-${route}`} icon="🛡️" title="Chính Sách Vận Chuyển">
                        <RoutePolicyContent policies={policies} />
                      </Accordion>
                    );
                  })()}
                  <Accordion icon="📄" title="Điều Khoản Vận Chuyển & FAQ">
                    <ShippingTermsQnAPanel />
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
   SHIP BY LABEL PANEL (CN-US Regular & Special)
   ═══════════════════════════════════════════════ */
const ShipByLabelPanel = ({ larkData }: { larkData?: { regular: any[]; special: any[] } | null }) => {
  const [tab, setTab] = useState<"regular" | "special">("regular");

  const tabs = [
    { id: "regular" as const, label: "🇺🇸 CN → US (Regular)", fallbackKey: "tiktokCnUsNormal" },
    { id: "special" as const, label: "🇺🇸 CN → US (Special)", fallbackKey: "tiktokCnUsSpecial" },
  ];

  const activeTab = tabs.find(t => t.id === tab)!;
  const data = larkData?.[tab]?.length ? larkData[tab] : (pricingData as any)[activeTab.fallbackKey] || [];

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">📦 BẢNG GIÁ CN — US SHIP BY LABEL</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold border transition-all ${tab === t.id
              ? "bg-primary text-white border-primary shadow-md"
              : "bg-white border-[var(--pricing-border)] text-muted-foreground hover:border-primary/40"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <PriceTable
        title={`CN → US · ${tab === "regular" ? "Regular Product" : "Special Product"}`}
        badge="Ship by Label"
        data={data}
        columns={[{ key: "rate", label: "Cước ($)" }]}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════
   BULK DATA TABLE (for Express panel)
   ═══════════════════════════════════════════════ */
const BulkDataTable = ({ title, badge, data, rate = 1, currencySymbol = "$" }: { title: string; badge: React.ReactNode; data: any[]; rate?: number; currencySymbol?: string }) => {
  const { tVi } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  const tableId = useMemo(() => "table-bulk-" + Math.random().toString(36).substring(2, 9), []);
  if (!data || data.length === 0) return null;

  const weightKeys = data[0]?.prices ? Object.keys(data[0].prices).sort((a, b) => Number(a) - Number(b)) : [];

  const exportConfig = useMemo(() => {
    const headers = ["Vùng (Zone)", ...weightKeys.map(k => k + " kg"), "Thời gian (SLA)"];
    const rows = data.map((row: any) => {
      return [
        row.name,
        ...weightKeys.map(k => {
          const val = row.prices[k];
          return (val === null || val === undefined) ? "—" : "$" + val.toFixed(2);
        }),
        row.sla || "—"
      ];
    });
    return { filename: title, headers, rows };
  }, [data, weightKeys, title]);
  const displayData = isExpanded ? data : data.slice(0, 6);

  return (
    <div className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden shadow-sm">
      <div className="bg-navy px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
        <span className="text-white font-bold text-[13px] flex items-center gap-2">
          {title}
          <span className="bg-[rgba(184,146,42,0.25)] text-[#D4A843] text-[12px] font-bold px-2 py-0.5 rounded-full">{badge}</span>
        </span>
        <div className="flex items-center gap-1.5 ml-auto">
          <button onClick={() => exportToExcel(exportConfig)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất Excel">
            <FileSpreadsheet size={14} />
          </button>
          <button onClick={() => exportToWord(exportConfig)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất Word">
            <FileText size={14} />
          </button>
          <button onClick={() => exportToPdf(exportConfig)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Xuất PDF">
            <FileIcon size={14} />
          </button>
        </div>
      </div>
      {/* Mobile Cards (Hidden on md+) */}
      <div className="md:hidden flex flex-col gap-3 p-4 bg-secondary/10">
        {displayData.map((row: any, i: number) => (
          <div key={i} className="bg-white border border-[var(--pricing-border)] rounded-xl p-4 shadow-sm relative">
            <div className="font-bold text-navy text-[15px] mb-3 pb-2 border-b border-[var(--pricing-border)]/50">
              <span className="notranslate">{row.name}</span>
              <div className="text-[12px] text-muted-foreground font-normal mt-0.5">⏱ {row.sla}</div>
            </div>
            <div className="space-y-2">
              {weightKeys.map(w => {
                const price = row.prices?.[w];
                return (
                  <div key={w} className="flex justify-between items-center">
                    <span className="text-[13px] font-medium text-navy/70 notranslate" translate="no">{w} KG+</span>
                    <span className="text-[14px] font-bold text-navy whitespace-nowrap">
                      <span className="notranslate" translate="no">
                        {price != null ? `${currencySymbol}${(price * rate).toLocaleString("en-US", { maximumFractionDigits: currencySymbol === "₫" ? 0 : 2, minimumFractionDigits: currencySymbol === "₫" ? 0 : 2 })}` : "—"}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table (Hidden on mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <table id={tableId} className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-[#FAFAF8]">
              <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-muted-foreground border-b border-[var(--pricing-border)] whitespace-nowrap">Zone / SLA</th>
              {weightKeys.map(w => (
                <th key={w} className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-muted-foreground border-b border-[var(--pricing-border)] whitespace-nowrap">
                  <span className="notranslate" translate="no">{w} KG+</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.map((row: any, i: number) => (
              <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <div className="font-bold text-navy text-[13px]"><span className="notranslate">{row.name}</span></div>
                  <div className="text-[12px] text-muted-foreground mt-0.5">⏱ {row.sla}</div>
                </td>
                {weightKeys.map(w => {
                  const price = row.prices?.[w];
                  return (
                    <td key={w} className="px-4 py-2.5 font-bold whitespace-nowrap">
                      <span className="notranslate" translate="no">
                        {price != null ? `${currencySymbol}${(price * rate).toLocaleString("en-US", { maximumFractionDigits: currencySymbol === "₫" ? 0 : 2, minimumFractionDigits: currencySymbol === "₫" ? 0 : 2 })}` : "—"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expand/Collapse Buttons */}
      {!isExpanded && data.length > 6 && (
        <div className="border-t border-[var(--pricing-border)]">
          <button onClick={() => setIsExpanded(true)} className="w-full py-3 md:py-2.5 text-[13px] font-bold text-primary hover:bg-[#FFFBF0] transition-colors flex items-center justify-center gap-1">
            {tVi("pricing.btn_expand").replace("{count}", (data.length - 6).toString())} <ChevronDown size={14} />
          </button>
        </div>
      )}
      {isExpanded && data.length > 6 && (
        <div className="border-t border-[var(--pricing-border)]">
          <button onClick={() => setIsExpanded(false)} className="w-full py-3 md:py-2.5 text-[13px] font-bold text-primary hover:bg-[#FFFBF0] transition-colors flex items-center justify-center gap-1">
            {tVi("pricing.btn_collapse")} <ChevronUp size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   SHIPPING TERMS & QnA PANEL
   ═══════════════════════════════════════════════ */
const qnaList = [
  {
    q: "Thời gian drop từ CN-US là bao nhiêu ngày?",
    a: "Thời gian đơn hàng từ Taobao về kho THG (Đông Hoản): khoảng 2 ngày.\nTừ kho ở Trung Quốc đến Mỹ: 5-8 ngày sẽ được giao đến tay người nhận ở Mỹ.\n=> Tổng thời gian vận chuyển có thể từ 8 - 10 ngày."
  },
  {
    q: "Có hỗ trợ active tracking phù hợp với policy của TikTok không?",
    a: "THG có hỗ trợ active tracking. Khi bạn lên đơn hàng buổi sáng THG sẽ trả tracking trong buổi chiều hoặc tối. Sau đó tracking sẽ được active theo đúng policy của TikTok trong vòng 48h."
  },
  {
    q: "THG hỗ trợ những tuyến đường vận chuyển nào và thời gian giao hàng như thế nào?",
    a: "THG cung cấp đa dạng tuyến vận chuyển bao gồm Việt Nam -> Mỹ, Trung Quốc -> Mỹ, và Việt Nam/Trung Quốc -> Worldwide. Chúng tôi có các line chuyên biệt cho TikTok Shop (US/UK/DE), cả hàng lô và epacket để tối ưu chi phí và thời gian giao hàng theo nhu cầu của từng seller."
  },
  {
    q: "THG có nhận gửi hàng cồng kềnh hay chỉ gửi được hàng nhỏ thôi?",
    a: "THG có thể xử lý đa dạng loại hàng hóa từ nhỏ đến cồng kềnh. Với quy trình kiểm tra chất lượng và đóng gói chuẩn, chúng tôi đảm bảo hàng hóa được bảo vệ tối ưu trong quá trình vận chuyển dù kích thước hay trọng lượng ra sao."
  },
  {
    q: "Chi phí vận chuyển của THG có cạnh tranh không? Có phát sinh chi phí ẩn nào không?",
    a: "THG cam kết báo cáo chi phí chi tiết và rõ ràng, không có chi phí phát sinh. Chúng tôi tối ưu chi phí thông qua việc cung cấp cả hàng lô và epacket, giúp seller lựa chọn phương án phù hợp với ngân sách và yêu cầu giao hàng của mình."
  },
  {
    q: "Seller có thể theo dõi trạng thái đơn hàng như thế nào?",
    a: "THG cung cấp hệ thống tracking real-time, cho phép bạn chủ động tra cứu trạng thái đơn hàng bất cứ lúc nào. Mỗi đơn hàng được vận hành qua hệ thống khép kín từ đồng bộ dữ liệu, đóng gói đến theo dõi trạng thái chi tiết."
  },
  {
    q: "THG tính cước vận chuyển dựa trên tiêu chí gì? Có phải theo trọng lượng thật không?",
    a: "THG tính cước theo nguyên tắc lấy cao nhất giữa trọng lượng thực tế (Gross Weight) và trọng lượng thể tích (Volume Weight = L×W×H / 6000).\n\n• Ví dụ: kiện hàng có trọng lượng thực 0.9kg nhưng trọng lượng thể tích 1.1kg thì cước vận chuyển sẽ tính theo 1.1kg.\n• Áp dụng cho tất cả tuyến US/Canada/Mexico/EU.\n• Trọng lượng tối đa: 30kg/kiện."
  },
  {
    q: "Chính sách bồi thường của THG?",
    a: "THG bồi thường 100% giá trị hàng hóa bị thất lạc/hư hỏng do lỗi trong quá trình xử lý tại THG.\n\n• Mức bồi thường tối đa: $500/kiện hàng.\n• Thời hạn khiếu nại: trong vòng 14 ngày kể từ ngày giao hàng dự kiến.\n• Không áp dụng cho: hàng cấm, hàng không khai báo đúng, hoặc hàng bị hải quan tịch thu."
  },
  {
    q: "Dịch vụ ePacket từ Trung Quốc sang Mỹ có giới hạn kích thước và trọng lượng ra sao?",
    a: "Với dịch vụ Line ePacket CHINA - US, kiện hàng có thể nặng tối đa 30kg.\n\n• Kích thước tiêu chuẩn: 55×40×35cm (không tính thêm phí).\n• Kích thước tối đa: 68×43×43cm (có phí bổ sung).\n• Kích thước tối thiểu: 10×15cm để đảm bảo an toàn vận chuyển."
  },
  {
    q: "Giá trị khai báo tối đa trên mỗi kiện hàng là bao nhiêu?",
    a: "Theo quy định từ hãng vận chuyển và hải quan nước đến, giá trị khai báo tối đa khác nhau tùy quốc gia:\n\n• USA: Max USD $60 (nghiêm ngặt).\n• EU: Max EUR €150 / ~USD $155.\n• UK: Max GBP £135 / ~USD $155.\n• Japan: Max USD $110.\n\n⚠️ Lưu ý: Khai báo vượt giới hạn có thể dẫn đến kiện hàng bị giữ lại hoặc thuế phát sinh. Vui lòng liên hệ THG nếu cần tư vấn."
  },
  {
    q: "Chính sách hoàn hàng (Return) và gửi lại (Re-delivery) như thế nào?",
    a: "Khi kiện hàng bị trả về kho hải ngoại (do sai địa chỉ, không có người nhận, hoặc bị từ chối nhận):\n\n• Khách hàng có 14-20 ngày (tùy quốc gia) để yêu cầu Re-delivery.\n• Nếu không có phản hồi trong thời hạn, kiện hàng sẽ bị hủy.\n• THG KHÔNG hỗ trợ hoàn hàng từ nước ngoài về lại Trung Quốc/Việt Nam.\n\nPhí Re-delivery:\n• USA: $10.50/đơn\n• UK: $7.00/đơn\n• Germany: $10.50/đơn\n• Japan: $7.60/đơn\n• Các nước khác: $8.00/đơn"
  },
  {
    q: "Pickup tại kho và Return to Sender phí bao nhiêu?",
    a: "THG cung cấp dịch vụ xử lý hàng trả về:\n\n• Pickup tại kho US (PA/NC): $1.15/đơn\n• Return to Sender: $1.50/đơn\n\nCác đơn hàng pickup tại kho cần đặt lịch trước ít nhất 24h qua hệ thống THG."
  },
  {
    q: "Remote Area (Vùng sâu) được xác định như thế nào?",
    a: "Vùng sâu (Remote Area) được xác định theo hệ thống ZIP code của các hãng vận chuyển quốc tế (USPS, FedEx, DHL).\n\nBao gồm:\n• Alaska, Hawaii, Puerto Rico, Guam\n• APO/FPO (địa chỉ quân sự)\n• Các vùng nông thôn hoặc khó tiếp cận\n\nPhụ phí vùng sâu được tính theo trọng lượng kiện hàng, từ $1.95 (0.05kg) đến $87.82 (30kg). Xem chi tiết trong bảng Phụ Phí Vùng Sâu."
  },
  {
    q: "THG hỗ trợ dịch vụ POD (Print on Demand) không?",
    a: "Có, THG cung cấp dịch vụ POD (Print on Demand) với chất lượng cao:\n\n• Thời gian sản xuất: 2-4 ngày làm việc.\n• Chính sách đổi trả: 7 ngày cho vấn đề chất lượng.\n• Tích hợp TikTok Shipping: tự động tạo nhãn vận chuyển và đồng bộ real-time.\n• Hỗ trợ gửi từ cả VN và CN đi USA/Worldwide."
  }
];

const renderPolicyContent = (text: string) => {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return null;
    if (line.startsWith('### ')) {
      return <strong key={i} className="block mt-5 mb-2 text-navy text-[14px] uppercase tracking-wide">{line.replace('### ', '')}</strong>;
    }
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <span key={i} className="block mb-2 pl-2">
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="text-navy font-bold">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </span>
    );
  });
};

/* ─── Route Policy Content (standalone, used by separate Accordion) ─── */
const RoutePolicyContent = ({ policies }: { policies: typeof larkPoliciesI18n }) => {
  const { effectiveLanguage: language } = useI18n();

  // Trilingual labels
  const headerTitle = language === 'vi' ? 'Chính sách vận chuyển (Shipping Policies)'
    : language === 'zh' ? '运输政策 (Shipping Policies)'
      : 'Shipping Policies';
  const headerDesc = language === 'vi' ? 'Các điều khoản và chính sách áp dụng cho tuyến vận chuyển này.'
    : language === 'zh' ? '适用于此运输路线的条款和政策。'
      : 'Terms and policies applicable to this shipping route.';
  const policyPrefix = language === 'vi' ? 'Điều khoản tuyến'
    : language === 'zh' ? '路线条款'
      : 'Route Terms';

  return (
    <div className="flex flex-col gap-2.5 pb-2">
      <div className="bg-[#F7F5F0] border border-[var(--pricing-border)] rounded-xl px-4 py-3 mb-2 flex gap-3 text-[13px]">
        <span className="text-xl">🛡️</span>
        <div>
          <strong className="text-navy block mb-1 notranslate" translate="no">{headerTitle}</strong>
          <p className="text-muted-foreground notranslate" translate="no">{headerDesc}</p>
        </div>
      </div>
      {policies.map((item, idx) => {
        const content = language === 'vi'
          ? (item.content?.vi || item.content?.en || '')
          : (item.content?.en || '');
        const langAttr = language === 'zh' ? 'en' : language;
        // Always extract the descriptive route name from Vietnamese title (en/zh titles have technical codes like "Policy VNTHZXR")
        const rawTitle = item.title?.vi || item.title?.en || '';
        let cleanTitle = rawTitle
          .replace(/^Điều khoản tuyến\s*/i, '')
          .replace(/^Policy\s*/i, '');
        // Translate Vietnamese cargo labels in parentheses for EN/ZH
        if (language === 'en') {
          cleanTitle = cleanTitle
            .replace(/\(Hàng Thường\)/gi, '(Regular Goods)')
            .replace(/\(Mỹ Phẩm\)/gi, '(Cosmetics)')
            .replace(/\(Pin\)/gi, '(Batteries)');
        } else if (language === 'zh') {
          cleanTitle = cleanTitle
            .replace(/\(Hàng Thường\)/gi, '(普通货物)')
            .replace(/\(Mỹ Phẩm\)/gi, '(化妆品)')
            .replace(/\(Pin\)/gi, '(电池)');
        }
        return (
          <details key={"policy-" + idx} className="group bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden" open={policies.length === 1}>
            <summary className="flex items-center justify-between cursor-pointer px-5 py-4 font-bold text-[13px] md:text-[14px] text-navy hover:text-primary transition-colors">
              <span className="flex items-start gap-3">
                <span className="flex items-center justify-center w-[22px] h-[22px] mt-0.5 shrink-0 rounded-full bg-[#1A2E44] text-white text-[12px] font-black">{idx + 1}</span>
                <span className="leading-snug notranslate" translate="no">{policyPrefix} {cleanTitle}</span>
              </span>
              <span className="transition-transform duration-300 group-open:-rotate-180 shrink-0 ml-4">
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </span>
            </summary>
            <div lang={langAttr} translate="yes" className="px-[52px] pb-6 text-[13px] text-navy/80 font-medium leading-relaxed border-t border-[var(--pricing-border)]/30 mt-1 pt-3">
              {renderPolicyContent(content)}
            </div>
          </details>
        );
      })}
    </div>
  );
};

const ShippingTermsQnAPanel = () => {
  return (
    <div className="flex flex-col gap-2.5 pb-2">
      <div className="bg-[#F7F5F0] border border-[var(--pricing-border)] rounded-xl px-4 py-3 mb-2 flex gap-3 text-[13px]">
        <span className="text-xl">📄</span>
        <div>
          <strong className="text-navy block mb-1">Mục Điều khoản quy định chung</strong>
          <p className="text-muted-foreground">Để đảm bảo quyền lợi, vui lòng đọc kỹ Các câu hỏi thường gặp bên dưới. Những thắc mắc khác vui lòng liên hệ trực tiếp cho Support của THG.</p>
        </div>
      </div>
      {qnaList.map((item, index) => (
        <details key={index} className="group bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex items-center justify-between cursor-pointer px-5 py-4 font-bold text-[13px] md:text-[14px] text-navy hover:text-primary transition-colors">
            <span className="flex items-start gap-3">
              <span className="flex items-center justify-center w-[22px] h-[22px] mt-0.5 shrink-0 rounded-full bg-primary/10 text-primary text-[12px] font-black">{index + 1}</span>
              <span className="leading-snug">{item.q}</span>
            </span>
            <span className="transition-transform duration-300 group-open:-rotate-180 shrink-0 ml-4">
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </span>
          </summary>
          <div className="px-[52px] pb-4 text-[14px] text-navy/80 font-medium leading-relaxed whitespace-pre-line border-t border-[var(--pricing-border)]/30 mt-1 pt-3">
            {item.a}
          </div>
        </details>
      ))}
    </div>
  );
};

export default InternationalPricingPage;
