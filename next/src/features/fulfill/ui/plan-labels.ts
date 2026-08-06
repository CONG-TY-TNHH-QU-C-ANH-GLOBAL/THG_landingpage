// PLAN LABELS — resolving the Operational Plan's content ids to localized text.
//
// The domain references everything by id and holds no strings, so this is where a plan becomes
// readable. It lives in the feature rather than in `shared/planning` for a boundary reason:
// resolution needs the feature's own copy trees, and `shared` may not import `features`. A future
// service builds its own resolver from its own content and passes it to the same renderer.
//
// ─────────────────────────────────────────────────────────────────────────────────────────────────
// DERIVED FIRST, AUTHORED ONLY WHERE NECESSARY.
//
// Most ids resolve to copy THG has already published — the journey steps, the capability
// descriptions, the Hub handbook chapters, the FAQ answers. Deriving rather than re-authoring means:
// no new business claim, three locales for free, and the label follows the source if the CMS
// overlays it.
//
// `AUTHORED` below is the complete list of strings that could NOT be derived — 12 ids, every one
// flagged for review. The five trade-offs are the commercially sensitive ones: each states only a
// STRUCTURAL choice (make-to-order vs batch, prepaid vs invoiced, storage vs per-order) and
// deliberately asserts no price relationship, because THG publishes no pricing.
//
// ─────────────────────────────────────────────────────────────────────────────────────────────────
// MODELLED BY ID, NOT BY LOCALE.
//
// Each id is declared once with `tr(vi, en, zh)` rather than in three parallel per-locale objects.
// Three objects sharing a key set share a structure: every id has to be added three times, a missed
// one is a silent English leak on a Vietnamese page, and the repeated structure is what a
// duplication gate measures regardless of the copy differing.
import { tr, localize, type Locale, type LocalizedText } from "@/shared/i18n";
import type { FulfillCopy } from "../localized-content";
import type { FulfillParityCopy } from "../parity-content";

/** Rendered where an id has no label at all — the same honesty rule the `absent` evidence kind
 *  follows: a gap is visible, never silent. Reaching this in production is a content bug. */
const MISSING = "—";

/**
 * Strings with no existing source in THG's content.
 *
 * REVIEW REQUIRED. Seller obligations describe work the seller must do; the trade-offs describe what
 * they accept. Both are assertions about how THG operates and neither is confirmed.
 */
const AUTHORED: Readonly<Record<string, LocalizedText>> = {
  // Constraints for sellers who have no operation yet — no existing copy describes this state.
  "constraint.no_operation_yet": tr(
    "Chưa có luồng vận hành nào để bắt đầu bán ở Mỹ.",
    "There is no fulfillment operation in place to start selling into the US.",
    "尚无可用于开始在美国销售的履约流程。",
  ),
  "constraint.no_supply_chain": tr(
    "Chưa có nguồn hàng và chưa có luồng xuất đơn.",
    "There is no supply source and no order-dispatch flow in place.",
    "尚无供货来源，也无出单流程。",
  ),

  // The one THG obligation with no published source: production geography is published, but
  // US-domestic dispatch as an undertaking is not stated anywhere in THG's own content.
  "obligation.thg.us_domestic_fulfillment": tr(
    "Sản xuất và xuất hàng nội địa Mỹ cho đơn đến Mỹ, thay vì gửi xuyên biên giới.",
    "Produce and dispatch inside the US for US destinations, instead of shipping cross-border.",
    "面向美国目的地在美国本土生产并发货，而非跨境运输。",
  ),

  // Seller-side obligations.
  "obligation.seller.print_ready_artwork": tr(
    "Cung cấp file thiết kế đúng template sản phẩm.",
    "Supply artwork that matches the product template.",
    "按产品模板提供设计文件。",
  ),
  "obligation.seller.sku_mapping": tr(
    "Ghép SKU của bạn với SKU trong catalog THG.",
    "Map your SKUs to the THG catalog SKUs.",
    "将您的 SKU 与 THG 目录 SKU 对应。",
  ),
  "obligation.seller.product_specs": tr(
    "Cung cấp thông tin và thông số sản phẩm cần tìm nguồn.",
    "Supply the product details and specifications to source against.",
    "提供需寻源的产品信息与规格。",
  ),
  "obligation.seller.stock_forecast": tr(
    "Dự báo lượng tồn cần lưu kho theo kỳ.",
    "Forecast the stock volume to be held per period.",
    "按周期预测需入库的库存量。",
  ),

  // Trade-offs — structural choices only, no price claim.
  "tradeoff.per_unit_vs_bulk": tr(
    "Sản xuất theo từng đơn thay vì đặt lô: không cần vốn tồn kho, chi phí tính theo từng sản phẩm.",
    "Production per order rather than per batch: no inventory capital, cost accounted per unit.",
    "按单生产而非批量下单：无需库存资金，成本按件计。",
  ),
  "tradeoff.us_production_cost_vs_transit": tr(
    "Sản xuất tại Mỹ để rút ngắn chặng giao, thay vì sản xuất tại VN/CN rồi vận chuyển xuyên biên.",
    "Producing inside the US to shorten the delivery leg, rather than producing in VN/CN and shipping cross-border.",
    "在美国本土生产以缩短配送段，而非在越南/中国生产后跨境运输。",
  ),
  "tradeoff.prepaid_model": tr(
    "Hub System vận hành theo mô hình trả trước — cần nạp ví trước khi lên đơn.",
    "The Hub System runs prepaid — the wallet is topped up before orders are placed.",
    "Hub System 采用预付费模式——下单前需为钱包充值。",
  ),
  "tradeoff.sourcing_scope_limits": tr(
    "Nguồn hàng giới hạn trong phạm vi THG hỗ trợ, không phải mọi sàn.",
    "Sourcing is limited to the marketplaces THG supports, not every platform.",
    "寻源范围限于 THG 支持的平台，并非全部平台。",
  ),
  "tradeoff.storage_vs_per_order": tr(
    "Giữ tồn tại kho THG thay vì tìm nguồn theo từng đơn.",
    "Holding stock in a THG warehouse rather than sourcing per order.",
    "在 THG 仓库备货，而非逐单寻源。",
  ),
};

/**
 * Service names. NOT localized: they are registered brand marks, and passing them through the
 * translation layer would invite a well-meaning translator to render one of them in Vietnamese.
 */
const CAPABILITY_NAMES: Readonly<Record<string, string>> = {
  "capability.fulfill": "THG Fulfill",
  "capability.express": "THG Express",
  "capability.warehouse": "THG Warehouse",
  "capability.dropship": "THG Dropship",
};

/**
 * How a seller describes their own business, and how firmly a plan is stated.
 *
 * Separate from the interface chrome below because it is read by the seller as a description of
 * themselves; the wording is a product decision, and it also travels into the sales handoff.
 */
const PLAN_VOCABULARY: Readonly<Record<string, LocalizedText>> = {
  "situation.starting": tr("Mới bắt đầu", "Just starting", "刚开始"),
  "situation.expanding": tr("Đang mở rộng sang Mỹ", "Expanding into the US", "正在拓展美国市场"),
  "situation.operating": tr("Đã bán ở Mỹ", "Already selling in the US", "已在美国销售"),
  "supply.custom": tr("In thiết kế của tôi", "I print my own design", "印制我自己的设计"),
  "supply.sourced": tr("Bán hàng tìm nguồn", "I resell sourced goods", "转售寻源商品"),
  "confidence.low": tr("Cần trao đổi thêm", "Needs a conversation", "需进一步沟通"),
  "confidence.medium": tr(
    "Dựa trên cam kết vận hành",
    "Based on operational commitments",
    "基于运营承诺",
  ),
  "confidence.high": tr("Dựa trên dữ liệu đã công bố", "Based on published data", "基于已公布数据"),
};

/**
 * Field names for the plan summary serialized into the lead message.
 *
 * Their audience is a salesperson reading a CRM record, not a visitor, so they change for different
 * reasons than anything on screen and are kept apart from it.
 */
const HANDOFF_LABELS: Readonly<Record<string, LocalizedText>> = {
  "handoff.situation": tr("Bối cảnh", "Context", "背景"),
  "handoff.constraint": tr("Vướng mắc", "Constraint", "瓶颈"),
  "handoff.course": tr("Đề xuất", "Recommendation", "建议"),
  "handoff.destination": tr("Điểm đến", "Destination", "目的地"),
};

/** Interface chrome: what the planner calls its own parts on screen. */
const CHROME: Readonly<Record<string, LocalizedText>> = {
  "ui.constraint": tr("Vướng mắc vận hành", "Operational constraint", "运营瓶颈"),
  "ui.course": tr("Kế hoạch vận hành", "Operational plan", "运营方案"),
  "ui.thg_does": tr("THG thực hiện", "THG does", "THG 负责"),
  "ui.you_do": tr("Bạn cần chuẩn bị", "You provide", "您需提供"),
  "ui.tradeoff": tr("Đánh đổi", "Trade-off", "取舍"),
  "ui.grounds": tr("Căn cứ", "On what basis", "依据"),
  "ui.no_data_yet": tr(
    "THG chưa công bố số liệu này",
    "THG has not published this figure yet",
    "THG 尚未公布该数据",
  ),
  "ui.q_situation": tr(
    "Tình trạng hiện tại của bạn?",
    "Where are you today?",
    "您目前处于哪个阶段？",
  ),
  "ui.q_supply": tr("Bạn bán loại hàng nào?", "What do you sell?", "您销售哪类商品？"),
  "ui.all_plans": tr(
    "Ba tình huống · hai mô hình hàng hoá",
    "Three situations · two supply models",
    "三种情境 · 两种货品模式",
  ),
  "ui.confidence": tr("Mức tin cậy", "Confidence", "可信度"),
  "ui.identity": tr("Mã kế hoạch", "Plan reference", "方案编号"),
  "ui.inferred": tr("suy ra", "inferred", "推断"),
  "ui.deferred": tr("Xác định khi tư vấn", "Resolved in consultation", "在咨询中确定"),

  // Storage cost has no CMS field yet, so it always renders as a labelled gap — under its own
  // name, because labelling it "basecost" would name the wrong figure.
  "evidence.storage_cost": tr("Chi phí lưu kho", "Storage cost", "仓储成本"),

  "field.capital": tr("Vốn", "Capital", "资金"),
  "field.monthlyVolume": tr("Sản lượng/tháng", "Monthly volume", "月出货量"),

  // The evidence kinds. Shown, not implied: a measured fact and a stated commitment must not look
  // identical, because a reader who cannot tell them apart discounts both.
  "kind.measured": tr("Đo được", "Measured", "已测量"),
  "kind.published": tr("Đã công bố", "Published", "已公布"),
  "kind.committed": tr("Cam kết", "Committed", "承诺"),
  "kind.absent": tr("Chưa công bố", "Not yet published", "尚未公布"),
};

/**
 * Build the label resolver for this route.
 *
 * The `DERIVED` map is the interesting half: each entry points at copy that already exists, so the
 * plan inherits THG's own wording — including any CMS service-block overlay applied upstream —
 * instead of carrying a second, drifting copy of it.
 */
export function buildPlanLabels(
  lang: Locale,
  copy: FulfillCopy,
  parity: FulfillParityCopy,
): (id: string) => string {
  const [pain0, , pain2, pain3] = copy.pains;
  const [, , hubCatalog, hubFinance, hubSupport] = parity.hubSections;
  const hubOrders = parity.hubSections[1];
  const faq = parity.faqFallback;

  const DERIVED: Readonly<Record<string, string>> = {
    // ── Constraints, taken verbatim from the seller-challenge copy ──
    "constraint.transit_cancellations": pain0.description,
    "constraint.order_management_errors": pain2.description,
    "constraint.inventory_control": pain3.description,

    // ── THG obligations, from the journey steps and capability descriptions ──
    "obligation.thg.print_on_demand": copy.steps[1].description,
    "obligation.thg.item_level_qc": copy.steps[2].description,
    "obligation.thg.us_standard_pack": copy.steps[3].description,
    "obligation.thg.route_by_destination": copy.capabilities.network.description,
    "obligation.thg.hub_visibility": copy.capabilities.hub.description,
    "obligation.thg.store_and_id": copy.capabilities.intake.description,
    "obligation.thg.bulk_intake": hubOrders.bullets[1] ?? MISSING,
    "obligation.thg.support_channels": hubSupport.intro,
    "obligation.thg.source_per_order": faq[6]?.answer ?? MISSING,
    "obligation.thg.ship_per_order": faq[0]?.answer ?? MISSING,
    // ── Seller obligations that DO have a source ──
    "obligation.seller.sku_sync": hubCatalog.intro,
    "obligation.seller.prepaid_wallet": hubFinance.intro,

    // ── Evidence ──
    "evidence.production_geography": copy.capabilities.network.description,
    "evidence.item_level_qc": copy.capabilities.qc.description,
    "evidence.us_standard_pack": copy.capabilities.pack.description,
    "evidence.tracking": copy.steps[3].description,
    "evidence.intake_operational_id": copy.steps[0].description,
    "evidence.hub_modules": copy.capabilities.hub.description,
    "evidence.bulk_csv_intake": hubOrders.bullets[1] ?? MISSING,
    "evidence.prepaid_transparency": hubFinance.intro,
    "evidence.destination_coverage": faq[0]?.answer ?? MISSING,
    "evidence.payment_rails": faq[3]?.answer ?? MISSING,
    "evidence.compensation_policy": faq[5]?.answer ?? MISSING,
    "evidence.sourcing_scope": faq[6]?.answer ?? MISSING,
    // Absent by design — the CMS fields exist and are empty. The renderer shows a labelled gap.
    "evidence.basecost": parity.basecostLabel,
    "evidence.lead_time": parity.leadTimeLabel,
  };

  // Resolution order: content THG already publishes, then the brand marks that are never
  // translated, then the localized tables. First hit wins, so a derived label can never be
  // shadowed by an authored one.
  const LOCALIZED = [AUTHORED, PLAN_VOCABULARY, HANDOFF_LABELS, CHROME] as const;

  return (id: string) => {
    // An empty derived value is a content gap, not a label: falling through to MISSING keeps the
    // gap visible instead of rendering nothing where a claim should be.
    const derived = DERIVED[id] || CAPABILITY_NAMES[id];
    if (derived) return derived;

    for (const table of LOCALIZED) {
      const text = table[id];
      if (text) return localize(lang, text);
    }
    return MISSING;
  };
}
