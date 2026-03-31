import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n";
import { pricingData } from "@/data/pricingData";
import { countryNames } from "@/data/pricingHelpers";
import { ChevronDown, ChevronUp, Search, ExternalLink, FileSpreadsheet, FileText, FileIcon } from "lucide-react";
import { exportToExcel, exportToPdf, exportToWord } from "@/lib/exportUtils";

/* ═══════════════════════════════════════════════
   TYPES & CONFIG
   ═══════════════════════════════════════════════ */
type ServiceTab = "epacket" | "express" | "terms";
type EpacketRoute = "std-vn-ww" | "std-cn-ww" | "pri-vncn-us" | "cn-us-label";
type ExpressRoute = "vn-us" | "cn-us";
type CargoType = "standard" | "cosmetics" | "battery";

const ROUTES: Record<EpacketRoute, { name: React.ReactNode; nameVi: React.ReactNode; time: string; cargo: CargoType[]; type: string }> = {
  "std-vn-ww": { name: <span className="notranslate font-semibold tracking-wide">Standard <span translate='no'>VN</span> → Worldwide</span>, nameVi: <>🇻🇳 Standard <span translate='no'>VN</span> → Worldwide</>, time: "⏱ 5–12 BSD", cargo: ["standard", "cosmetics"], type: "merchant" },
  "std-cn-ww": { name: <span className="notranslate font-semibold tracking-wide">Standard <span translate='no'>CN</span> → Worldwide</span>, nameVi: <>🇨🇳 Standard <span translate='no'>CN</span> → Worldwide</>, time: "⏱ 6–12 BSD", cargo: ["standard", "cosmetics", "battery"], type: "merchant" },
  "pri-vncn-us": { name: <span className="notranslate font-semibold tracking-wide">Priority <span translate='no'>VN/CN</span> → <span translate='no'>US</span></span>, nameVi: <>🇻🇳/🇨🇳 Priority <span translate='no'>VN/CN</span> → <span translate='no'>US</span></>, time: "⏱ 5–10 BSD", cargo: ["standard"], type: "merchant" },
  "cn-us-label": { name: <span className="notranslate font-semibold tracking-wide"><span translate='no'>CN</span> → <span translate='no'>US</span> Ship by Label</span>, nameVi: <>🇨🇳 <span translate='no'>CN</span> → <span translate='no'>US</span> Ship by Label</>, time: "⏱ Theo lịch USPS", cargo: [], type: "label" },
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
  title: string; badge?: React.ReactNode; note?: React.ReactNode;
  data: any[]; columns: { key: string; label: string }[];
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
      <div className="overflow-x-auto">
        <table id={tableId} className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-[#FAFAF8]">
              <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-muted-foreground border-b border-[var(--pricing-border)] whitespace-nowrap">Cân Nặng (KG)</th>
              {columns.map(c => (
                <th key={c.key} className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-muted-foreground border-b border-[var(--pricing-border)] whitespace-nowrap">{c.label}</th>
              ))}
            </tr>
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
                  <h5 className="font-bold text-[14px] text-navy mb-2 notranslate">
                    {t.term[language as keyof typeof t.term]}
                  </h5>
                  <p className="text-[12.5px] text-muted-foreground leading-relaxed">
                    {t.desc[language as keyof typeof t.desc]}
                  </p>
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
                <div className="inline-block bg-[rgba(184,146,42,0.15)] text-[#B8922A] text-[12px] font-bold tracking-[0.1em] px-3 py-1 rounded-full uppercase mb-4">
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
                  <span className={`font-bold text-[13px] truncate ${route === rid ? "text-primary" : "text-navy"}`}>{r.nameVi}</span>
                  <span className="text-[12px] text-muted-foreground">{r.time}</span>
                  <div className="flex gap-1 flex-wrap mt-0.5">
                    {r.type === "merchant" && <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">🛒 Ship by Merchant</span>}
                    {r.type === "label" && (
                      <>
                        <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">🏷️ Ship by Label</span>
                        <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700">📬 Drop-off USPS</span>
                      </>
                    )}
                    {rid === "pri-vncn-us" && <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">✅ Bao thuế · Active USPS</span>}
                    {r.cargo.length > 0 && (
                      <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
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

                {/* TikTok sub-tabs */}
                <TikTokPanel />
              </div>
            ) : (
              <>
                {/* ──── CARGO FILTER ──── */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
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
                {route === "pri-vncn-us" ? (
                  <div className="flex flex-col gap-6">
                    <PriceTable
                      title="Bảng Giá Chi Tiết VN ➝ US (Priority)"
                      badge={<div className="flex items-center gap-1"><span className="notranslate font-bold" translate='no'>Priority VN ➝ US</span> <span className="opacity-50">·</span> <span>{CARGO_LABELS[cargo]}</span></div>}
                      note="Cập nhật: 29/03/2026"
                      data={(pricingData as any)["uspsVn"] || []}
                      columns={[{key: "rate", label: "Cước ($)"}]}
                    />
                    <PriceTable
                      title="Bảng Giá Chi Tiết CN ➝ US (Priority)"
                      badge={<div className="flex items-center gap-1"><span className="notranslate font-bold" translate='no'>Priority CN ➝ US</span> <span className="opacity-50">·</span> <span>{CARGO_LABELS[cargo]}</span></div>}
                      note="Cập nhật: 29/03/2026"
                      data={(pricingData as any)["uspsCn"] || []}
                      columns={[{key: "rate", label: "Cước ($)"}]}
                    />
                  </div>
                ) : (
                  <PriceTable
                    title="Bảng Giá Chi Tiết"
                    badge={<div className="flex items-center gap-1">{routeConfig.name} <span className="opacity-50">·</span> <span>{CARGO_LABELS[cargo]}</span></div>}
                    note="Cập nhật: 29/03/2026"
                    data={currentData}
                    columns={tableColumns}
                  />
                )}

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
                                <td className="px-4 py-3"><span className="notranslate">{r.zone || r.name || `Zone ${i + 1}`}</span></td>
                                <td className="px-4 py-3 font-bold">{r.usd ? `$${r.usd}` : "Liên hệ THG"}</td>
                              </tr>
                            )}
                          />
                        ) : (
                          <p className="text-muted-foreground text-[13px] italic">Dữ liệu đang cập nhật</p>
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
                                <td className="px-4 py-3"><span className="notranslate">{v.country}</span></td>
                                <td className="px-4 py-3">{v.vat}</td>
                                <td className="px-4 py-3 font-bold">{v.service}</td>
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
                        <p className="text-[13px] text-muted-foreground italic mb-3">* Phí reship áp dụng khi kiện hàng bị trả về do địa chỉ sai, không có người nhận, hoặc bị từ chối nhận.</p>
                        <CompactAccordionTable
                          headers={["Khu Vực", "Mã QG", "Phí ($)"]}
                          data={redeliveryData}
                          renderRow={(r, i) => (
                            <tr key={i} className="border-b border-[var(--pricing-border)] last:border-0 hover:bg-[#FFFBF0] transition-colors">
                              <td className="px-4 py-3"><span className="notranslate">{r.dest}</span></td>
                              <td className="px-4 py-3"><span className="notranslate">{r.code}</span></td>
                              <td className="px-4 py-3 font-bold">{r.usd ? `$${r.usd}` : "Liên hệ THG"}</td>
                            </tr>
                          )}
                        />
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-[13px] italic text-center py-4">📝 Dữ liệu phí reship đang được cập nhật.</p>
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
                            <th className="px-4 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Khu Vực</th>
                            <th className="px-4 py-3 text-left text-[11px] font-bold uppercase text-muted-foreground border-b border-[var(--pricing-border)]">Surcharge</th>
                          </tr></thead>
                          <tbody>
                            <tr className="border-b border-[var(--pricing-border)]"><td className="px-4 py-3">Alaska / Hawaii</td><td className="px-4 py-3 font-bold">Liên hệ THG</td></tr>
                            <tr className="border-b border-[var(--pricing-border)]"><td className="px-4 py-3">Puerto Rico</td><td className="px-4 py-3 font-bold">Liên hệ THG</td></tr>
                            <tr><td className="px-4 py-3">Remote ZIP Codes</td><td className="px-4 py-3 font-bold">Liên hệ THG</td></tr>
                          </tbody>
                        </table>
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
                          {[
                            { w: "< 100 kg" }, { w: "100–500 kg" }, { w: "> 500 kg" },
                          ].map((r, j) => (
                            <tr key={j} className="border-b border-[var(--pricing-border)] last:border-0">
                              <td className="px-5 py-2">{r.w}</td>
                              <td className="px-5 py-2 text-primary font-bold">Liên hệ THG</td>
                              <td className="px-5 py-2 text-muted-foreground text-[13px]">Báo giá theo lô</td>
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
                                <td className="px-4 py-3"><span className="notranslate">{r.zone || r.name || `Zone ${i + 1}`}</span></td>
                                <td className="px-4 py-3 font-bold">{r.usd ? `$${r.usd}` : "Liên hệ THG"}</td>
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
    { id: "vnSeller", label: <>🇻🇳 <span translate='no'>VN</span> → <span translate='no'>US</span> (Seller)</>, dataKey: "tiktokVnSeller" },
    { id: "vnTiktok", label: <>🇻🇳 <span translate='no'>VN</span> → <span translate='no'>US</span> (TikTok)</>, dataKey: "tiktokVnTiktok" },
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
const BulkDataTable = ({ title, badge, data }: { title: string; badge: React.ReactNode; data: any[] }) => {
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
      <div className="overflow-x-auto">
        <table id={tableId} className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-[#FAFAF8]">
              <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-muted-foreground border-b border-[var(--pricing-border)] whitespace-nowrap">Zone / SLA</th>
              {weightKeys.map(w => (
                <th key={w} className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-muted-foreground border-b border-[var(--pricing-border)] whitespace-nowrap">
                  {w} KG+
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
                      {price != null ? `$${price}` : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
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
    </div>
  );
};

export default InternationalPricingPage;
