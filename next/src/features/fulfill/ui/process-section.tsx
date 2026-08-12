// ACT 3 — OPERATIONAL SYSTEM DIAGRAM (Light Theme & Animated Chain)
import type { Locale } from "@/shared/i18n";
import type { FulfillCopy } from "../localized-content";
import { MOVEMENT_INDEX } from "./movement-copy";
import { Alias } from "./section";

interface Props {
  copy: FulfillCopy;
  lang: Locale;
}

// Tech badge
function TechBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest border border-blue-200 text-thg-cyanTech bg-blue-50 rounded">
      {label}
    </span>
  );
}

// Connector arrow between stage cards (Animated)
function StageConnector({ isVertical }: { isVertical?: boolean }) {
  if (isVertical) {
    return (
      <div className="flex lg:hidden justify-center py-3">
        <div className="flex flex-col items-center">
          <svg width="2" height="24" className="overflow-visible">
            <line x1="1" y1="0" x2="1" y2="24" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" className="animate-line-flow" />
          </svg>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="mt-1">
            <path d="M5 6L0 0h10L5 6z" fill="#94A3B8" />
          </svg>
        </div>
      </div>
    );
  }
  return (
    <div className="hidden lg:flex items-center justify-center w-8 shrink-0">
      <div className="flex items-center relative w-full h-2">
        <svg width="100%" height="2" className="overflow-visible absolute inset-0">
          <line x1="0" y1="1" x2="100%" y2="1" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" className="animate-line-flow" />
        </svg>
        <svg width="6" height="10" viewBox="0 0 6 10" fill="none" className="absolute right-0 -mr-1">
          <path d="M6 5L0 0v10L6 5z" fill="#94A3B8" />
        </svg>
      </div>
    </div>
  );
}

// Individual stage card
interface StageCardProps {
  index: string;
  stageCode: string;
  title: string;
  description: string;
  techTags: string[];
  checkpoint?: string;
  delayIndex: number;
}

function StageCard({ index, stageCode, title, description, techTags, checkpoint, delayIndex }: StageCardProps) {
  return (
    <div 
      className="flex-1 min-w-0 flex flex-col bg-white border border-thg-border shadow-sm rounded-2xl overflow-hidden hover:border-thg-borderHover hover:shadow-md transition-all duration-300 group animate-in fade-in slide-in-from-bottom-8"
      style={{ animationDelay: `${delayIndex * 150}ms`, animationFillMode: "both" }}
    >
      {/* Stage header */}
      <div className="px-5 py-3 bg-thg-bg border-b border-thg-border flex items-center justify-between group-hover:bg-thg-goldBg transition-colors duration-300">
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-thg-gold">
          {index}
        </span>
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 group-hover:text-thg-gold transition-colors">
          {stageCode}
        </span>
      </div>

      {/* Stage body */}
      <div className="px-5 py-5 flex flex-col gap-3 flex-1">
        <h3 className="m-0 text-thg-textMain font-bold leading-snug text-base">
          {title}
        </h3>
        <p className="m-0 text-sm text-thg-textMuted leading-relaxed">{description}</p>

        {/* Tech tags */}
        {techTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-4">
            {techTags.map((tag) => (
              <TechBadge key={tag} label={tag} />
            ))}
          </div>
        )}
      </div>

      {/* Checkpoint row — if this stage has a quality gate */}
      {checkpoint && (
        <div className="px-5 py-3 border-t border-thg-border border-dashed bg-thg-bg flex items-center gap-2.5">
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0">
            <circle cx="6" cy="6" r="5.5" fill="#FDF8EC" stroke="#C29B38" strokeOpacity="0.4" />
            <path d="M3.5 6l1.5 1.5 3.5-3" stroke="#C29B38" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px] font-mono font-semibold text-thg-gold leading-tight">{checkpoint}</span>
        </div>
      )}
    </div>
  );
}

// The header copy that used to live here as three inline locale objects now lives in
// localized-content.ts with the rest of the page copy (copy.process*). The stage table below
// stays local — it is a five-row narrative, not a string.
//
// This block also used to derive the locale by SNIFFING one copy string for CJK characters and
// Vietnamese diacritics. That is a guess, and one that fails silently: a Vietnamese sentence
// written without diacritics resolves to English, so the section would render in the wrong
// language with nothing to indicate why. The route already knows the locale — it is passed in.

// Stage definitions
const STAGES_VI = [
  {
    index: "01",
    stageCode: "ORDER",
    title: "Tiếp nhận & Định tuyến",
    description: "Seller upload đơn qua portal hoặc CSV. Hệ thống validate SKU, map catalog, gán ID vận hành cho từng đơn vị.",
    techTags: ["Portal", "CSV Upload", "SKU Validate"],
    checkpoint: undefined,
  },
  {
    index: "02",
    stageCode: "PRODUCE",
    title: "In ấn POD",
    description: "In DTG/DTF độ phân giải cao tại node sản xuất gần điểm đến nhất — VN · CN · US — theo kỹ thuật phù hợp với loại sản phẩm.",
    techTags: ["DTG", "DTF", "VN·CN·US"],
    checkpoint: undefined,
  },
  {
    index: "03",
    stageCode: "FULFILL",
    title: "Kiểm tra chất lượng",
    description: "QC từng đơn: định dạng file, màu sắc, chất lượng in — chuẩn TMĐT Mỹ. Đơn không đạt bị giữ lại, không xuất đi.",
    techTags: ["Item-level QC", "US eComm Std"],
    checkpoint: "QC Gate — không đạt → giữ lại",
  },
  {
    index: "04",
    stageCode: "SHIP",
    title: "Vận chuyển quốc tế",
    description: "Cross-border linehaul VN/CN → US. Inject vào mạng carrier nội địa US/UK tại hub trung chuyển — rút ngắn last-mile delivery.",
    techTags: ["Linehaul", "Carrier Inject", "US·UK·WW"],
    checkpoint: undefined,
  },
  {
    index: "05",
    stageCode: "DELIVER",
    title: "Tracking & Bàn giao",
    description: "Tracking number gắn theo đơn từ khi đóng gói. Trạng thái cập nhật theo từng bước trên Hub System — seller không cần hỏi.",
    techTags: ["Hub System", "Tracking"],
    checkpoint: "Tracking handoff seller",
  },
];

const STAGES_EN = [
  {
    index: "01",
    stageCode: "ORDER",
    title: "Intake & Routing",
    description: "Sellers upload orders via portal or CSV. The system validates SKUs, maps the catalog, and assigns an operational ID to every unit.",
    techTags: ["Portal", "CSV Upload", "SKU Validate"],
    checkpoint: undefined,
  },
  {
    index: "02",
    stageCode: "PRODUCE",
    title: "POD Printing",
    description: "High-resolution DTG/DTF printing at the nearest production node — VN · CN · US — routed by product type and technique.",
    techTags: ["DTG", "DTF", "VN·CN·US"],
    checkpoint: undefined,
  },
  {
    index: "03",
    stageCode: "FULFILL",
    title: "Quality Assurance",
    description: "Item-level QC: file format, color accuracy, print quality — to US eCommerce standard. Non-conforming units are held, not shipped.",
    techTags: ["Item-level QC", "US eComm Std"],
    checkpoint: "QC Gate — fail → hold",
  },
  {
    index: "04",
    stageCode: "SHIP",
    title: "Cross-border Shipping",
    description: "Cross-border linehaul VN/CN → US. Injected into US/UK domestic carrier networks at transit hubs — shortening last-mile delivery.",
    techTags: ["Linehaul", "Carrier Inject", "US·UK·WW"],
    checkpoint: undefined,
  },
  {
    index: "05",
    stageCode: "DELIVER",
    title: "Tracking & Handoff",
    description: "Tracking number attached at packing. Status updates at every step on Hub System — sellers see progress without asking.",
    techTags: ["Hub System", "Tracking"],
    checkpoint: "Tracking handoff to seller",
  },
];

const STAGES_ZH = [
  {
    index: "01",
    stageCode: "ORDER",
    title: "接单与路由",
    description: "卖家通过门户或CSV上传订单。系统验证SKU，映射商品目录，并为每个单元分配运营ID。",
    techTags: ["Portal", "CSV Upload", "SKU Validate"],
    checkpoint: undefined,
  },
  {
    index: "02",
    stageCode: "PRODUCE",
    title: "POD打印",
    description: "在最近的生产节点——越南·中国·美国——进行高分辨率DTG/DTF打印，按产品类型和工艺路由。",
    techTags: ["DTG", "DTF", "VN·CN·US"],
    checkpoint: undefined,
  },
  {
    index: "03",
    stageCode: "FULFILL",
    title: "品质检验",
    description: "逐单质检：文件格式、色彩准确性、印刷质量——达到美国电商标准。不合格品扣留，不发出。",
    techTags: ["逐单质检", "美国电商标准"],
    checkpoint: "QC关卡 — 不合格 → 扣留",
  },
  {
    index: "04",
    stageCode: "SHIP",
    title: "跨境运输",
    description: "越南/中国→美国跨境干线运输。在转运枢纽注入美国/英国国内承运人网络——缩短最后一公里配送。",
    techTags: ["干线运输", "承运人注入", "US·UK·WW"],
    checkpoint: undefined,
  },
  {
    index: "05",
    stageCode: "DELIVER",
    title: "追踪与交接",
    description: "包装时附上追踪号。每个步骤的状态在Hub System上更新——卖家无需询问即可查看进展。",
    techTags: ["Hub System", "追踪"],
    checkpoint: "追踪交接给卖家",
  },
];

const STAGES_BY_LANG = { vi: STAGES_VI, en: STAGES_EN, zh: STAGES_ZH } as const;

export default function ProcessSection({ copy, lang }: Readonly<Props>) {
  const stages = STAGES_BY_LANG[lang];

  return (
    <div id="process" className="w-full bg-thg-bg border-t border-thg-border">
      {/* Retired ids that used to address this content. An anchor is a published contract — the
       *  movements that owned these were replaced, so their targets live on here, at the section
       *  that now tells the same story (the five-stage journey, and the unit's own record). */}
      <Alias id="journey" />
      <Alias id="passport" />
      <div className="container mx-auto px-4 md:px-8 py-24 lg:py-32">

        {/* ── SECTION HEADER ────────────────────────────────────── */}
        <div className="flex flex-col gap-4 max-w-2xl mb-16 lg:mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-thg-textMuted m-0">
            <span className="text-thg-gold mr-3">{MOVEMENT_INDEX.process}</span>
            {copy.processEyebrow}
          </p>
          <h2 className="m-0 text-thg-textMain font-sans tracking-tight text-3xl md:text-4xl leading-snug font-bold">
            {copy.processTitle}
          </h2>
          <p className="text-base text-thg-textMuted leading-relaxed m-0 max-w-xl">
            {copy.processLead}
          </p>
        </div>

        {/* ── OPERATIONAL SYSTEM SCHEMATIC ──────────────────────── */}
        <div className="flex flex-col lg:flex-row items-stretch gap-0 relative">
          {stages.map((stage, i) => (
            <div key={stage.stageCode} className="flex flex-col lg:flex-row items-stretch flex-1 min-w-0">
              <StageCard {...stage} delayIndex={i} />
              {i < stages.length - 1 && (
                <>
                  <StageConnector isVertical={false} />
                  <StageConnector isVertical={true} />
                </>
              )}
            </div>
          ))}
        </div>

        {/* ── SYSTEM FOOTER — honesty note ─────────────────────── */}
        <div className="mt-14 pt-8 border-t border-thg-border border-dashed flex items-start gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-thg-border bg-white shadow-sm shrink-0 text-thg-textMuted">
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeOpacity="0.4" />
              <path d="M7 5v4M7 3.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-xs text-thg-textMuted leading-relaxed m-0 font-mono max-w-2xl mt-1">
            {copy.processHonesty}
          </p>
        </div>

      </div>
    </div>
  );
}
