// PLAN LABELS — resolving the Operational Plan's content ids to localized text.
//
// The domain references everything by id and holds no strings, so this is where a plan becomes
// readable. It lives in the feature rather than in `shared/planning` for a boundary reason:
// resolution needs the feature's own copy trees, and `shared` may not import `features`. A future
// service builds its own tables from its own content and passes the resolver to the same renderer.
//
// ─────────────────────────────────────────────────────────────────────────────────────────────────
// ONE TABLE PER REGISTRY, EXHAUSTIVE BY TYPE.
//
// Each table is `satisfies Record<Name, LabelSource>` over the registry in `shared/planning/ids.ts`.
// That is the point of the whole file: adding an id to the domain and forgetting to label it is a
// BUILD FAILURE, not a placeholder discovered in production. Before this, the ids existed twice —
// once in the catalogue, once here — with nothing holding the two lists together.
//
// A label is one of two things, and the table says which:
//
//   derived   the label IS content THG has already published, read from a copy tree. No new
//             business claim, three locales for free, and the label follows the source if a CMS
//             service-block overlays it.
//   authored  no published source exists. REVIEW REQUIRED — every one of these is an assertion
//             about how THG operates that nobody has confirmed.
//
// Making that distinction DATA rather than "which object it happened to be declared in" is what
// lets a reviewer enumerate the unverified claims (`AUTHORED_LABEL_IDS`) instead of grepping for a
// comment, and what would let a surface mark them.
import { localize, tr, type Locale, type LocalizedText } from "@/shared/i18n";
import {
  CONSTRAINTS,
  EVIDENCE,
  SELLER_OBLIGATIONS,
  THG_OBLIGATIONS,
  TRADEOFFS,
  constraintId,
  evidenceId,
  tradeoffId,
  type ConstraintName,
  type EvidenceName,
  type SellerObligationName,
  type ThgObligationName,
  type TradeoffName,
} from "@/shared/planning/ids";
import { CAPABILITIES, SITUATIONS, SUPPLY_MODELS } from "@/shared/planning/plan";
import type {
  CapabilityId,
  Confidence,
  EvidenceKind,
  SituationId,
  SupplyModel,
} from "@/shared/planning/plan";
import type { FulfillCopy } from "../localized-content";
import type { FulfillParityCopy } from "../parity-content";

/** Rendered where an id has no label at all — the same honesty rule the `absent` evidence kind
 *  follows: a gap is visible, never silent. The exhaustive tables below make it unreachable for a
 *  registry id; it remains for an unknown id arriving from outside the domain. */
const MISSING = "—";

/** The content a derived label reads from. */
interface LabelContent {
  copy: FulfillCopy;
  parity: FulfillParityCopy;
}

type LabelSource =
  | { readonly kind: "derived"; readonly read: (c: LabelContent) => string }
  | { readonly kind: "authored"; readonly text: LocalizedText };

/** The label is copy THG already publishes. */
const derived = (read: (c: LabelContent) => string): LabelSource => ({ kind: "derived", read });

/** No published source exists. Every use of this is an unconfirmed assertion awaiting review. */
const authored = (vi: string, en: string, zh: string): LabelSource => ({
  kind: "authored",
  text: tr(vi, en, zh),
});

/** A Hub chapter by id rather than by position — the chapters are content and may be reordered. */
function hubSection(c: LabelContent, id: string): string {
  return c.parity.hubSections.find((section) => section.id === id)?.intro ?? MISSING;
}

/** A canonical answer by its published position in the seven. */
function answer(c: LabelContent, index: number): string {
  return c.parity.faqFallback[index]?.answer ?? MISSING;
}

// ── Constraints ─────────────────────────────────────────────────────────────────────────────────

const CONSTRAINT_LABELS = {
  // Verbatim from the seller-challenge copy: the constraint a plan names is a pain THG has already
  // published, not a second description of it.
  transit_cancellations: derived((c) => c.copy.pains[0].description),
  order_management_errors: derived((c) => c.copy.pains[2].description),
  inventory_control: derived((c) => c.copy.pains[3].description),
  // No existing copy describes the state of having no operation at all.
  no_operation_yet: authored(
    "Chưa có luồng vận hành nào để bắt đầu bán ở Mỹ.",
    "There is no fulfillment operation in place to start selling into the US.",
    "尚无可用于开始在美国销售的履约流程。",
  ),
  no_supply_chain: authored(
    "Chưa có nguồn hàng và chưa có luồng xuất đơn.",
    "There is no supply source and no order-dispatch flow in place.",
    "尚无供货来源，也无出单流程。",
  ),
} as const satisfies Record<ConstraintName, LabelSource>;

// ── Obligations ─────────────────────────────────────────────────────────────────────────────────

const THG_OBLIGATION_LABELS = {
  print_on_demand: derived((c) => c.copy.steps[1].description),
  item_level_qc: derived((c) => c.copy.steps[2].description),
  us_standard_pack: derived((c) => c.copy.steps[3].description),
  route_by_destination: derived((c) => c.copy.capabilities.network.description),
  hub_visibility: derived((c) => c.copy.capabilities.hub.description),
  store_and_id: derived((c) => c.copy.capabilities.intake.description),
  bulk_intake: derived((c) => c.parity.hubSections[1]?.bullets[1] ?? MISSING),
  support_channels: derived((c) => hubSection(c, "support")),
  source_per_order: derived((c) => answer(c, 6)),
  ship_per_order: derived((c) => answer(c, 0)),
  // Production geography is published; US-domestic dispatch as an undertaking is not stated
  // anywhere in THG's own content.
  us_domestic_fulfillment: authored(
    "Sản xuất và xuất hàng nội địa Mỹ cho đơn đến Mỹ, thay vì gửi xuyên biên giới.",
    "Produce and dispatch inside the US for US destinations, instead of shipping cross-border.",
    "面向美国目的地在美国本土生产并发货，而非跨境运输。",
  ),
} as const satisfies Record<ThgObligationName, LabelSource>;

const SELLER_OBLIGATION_LABELS = {
  sku_sync: derived((c) => hubSection(c, "catalog")),
  prepaid_wallet: derived((c) => hubSection(c, "finance")),
  // What the SELLER must do has no published source at all: THG's content describes what THG does.
  print_ready_artwork: authored(
    "Cung cấp file thiết kế đúng template sản phẩm.",
    "Supply artwork that matches the product template.",
    "按产品模板提供设计文件。",
  ),
  sku_mapping: authored(
    "Ghép SKU của bạn với SKU trong catalog THG.",
    "Map your SKUs to the THG catalog SKUs.",
    "将您的 SKU 与 THG 目录 SKU 对应。",
  ),
  product_specs: authored(
    "Cung cấp thông tin và thông số sản phẩm cần tìm nguồn.",
    "Supply the product details and specifications to source against.",
    "提供需寻源的产品信息与规格。",
  ),
  stock_forecast: authored(
    "Dự báo lượng tồn cần lưu kho theo kỳ.",
    "Forecast the stock volume to be held per period.",
    "按周期预测需入库的库存量。",
  ),
} as const satisfies Record<SellerObligationName, LabelSource>;

// ── Trade-offs ──────────────────────────────────────────────────────────────────────────────────
//
// The commercially sensitive set, and the only table that is authored throughout. Each states a
// STRUCTURAL choice — make-to-order vs batch, prepaid vs invoiced, storage vs per-order — and
// deliberately asserts no price relationship, because THG publishes no pricing.

const TRADEOFF_LABELS = {
  per_unit_vs_bulk: authored(
    "Sản xuất theo từng đơn thay vì đặt lô: không cần vốn tồn kho, chi phí tính theo từng sản phẩm.",
    "Production per order rather than per batch: no inventory capital, cost accounted per unit.",
    "按单生产而非批量下单：无需库存资金，成本按件计。",
  ),
  us_production_cost_vs_transit: authored(
    "Sản xuất tại Mỹ để rút ngắn chặng giao, thay vì sản xuất tại VN/CN rồi vận chuyển xuyên biên.",
    "Producing inside the US to shorten the delivery leg, rather than producing in VN/CN and shipping cross-border.",
    "在美国本土生产以缩短配送段，而非在越南/中国生产后跨境运输。",
  ),
  prepaid_model: authored(
    "Hub System vận hành theo mô hình trả trước — cần nạp ví trước khi lên đơn.",
    "The Hub System runs prepaid — the wallet is topped up before orders are placed.",
    "Hub System 采用预付费模式——下单前需为钱包充值。",
  ),
  sourcing_scope_limits: authored(
    "Nguồn hàng giới hạn trong phạm vi THG hỗ trợ, không phải mọi sàn.",
    "Sourcing is limited to the marketplaces THG supports, not every platform.",
    "寻源范围限于 THG 支持的平台，并非全部平台。",
  ),
  storage_vs_per_order: authored(
    "Giữ tồn tại kho THG thay vì tìm nguồn theo từng đơn.",
    "Holding stock in a THG warehouse rather than sourcing per order.",
    "在 THG 仓库备货，而非逐单寻源。",
  ),
} as const satisfies Record<TradeoffName, LabelSource>;

// ── Evidence ────────────────────────────────────────────────────────────────────────────────────
//
// Derived throughout, and necessarily so: a claim THG has not published cannot be evidence for
// anything. The unpublished ones resolve to their field NAME, because the renderer shows the name
// beside the labelled gap — "Basecost from · not yet published" says more than a bare gap.

const EVIDENCE_LABELS = {
  production_geography: derived((c) => c.copy.capabilities.network.description),
  item_level_qc: derived((c) => c.copy.capabilities.qc.description),
  us_standard_pack: derived((c) => c.copy.capabilities.pack.description),
  tracking: derived((c) => c.copy.steps[3].description),
  intake_operational_id: derived((c) => c.copy.steps[0].description),
  hub_modules: derived((c) => c.copy.capabilities.hub.description),
  bulk_csv_intake: derived((c) => c.parity.hubSections[1]?.bullets[1] ?? MISSING),
  prepaid_transparency: derived((c) => hubSection(c, "finance")),
  destination_coverage: derived((c) => answer(c, 0)),
  payment_rails: derived((c) => answer(c, 3)),
  compensation_policy: derived((c) => answer(c, 5)),
  sourcing_scope: derived((c) => answer(c, 6)),
  basecost: derived((c) => c.parity.basecostLabel),
  lead_time: derived((c) => c.parity.leadTimeLabel),
  // Not the base cost: naming a per-unit production price as a warehousing figure would publish a
  // number THG has never stated.
  storage_cost: authored("Chi phí lưu kho", "Storage cost", "仓储成本"),
} as const satisfies Record<EvidenceName, LabelSource>;

// ── The seller's own vocabulary ─────────────────────────────────────────────────────────────────
//
// Exhaustive over the domain enums for the same reason: adding a situation without labelling it is
// a build failure rather than an unlabelled control.

const SITUATION_LABELS = {
  starting: tr("Mới bắt đầu", "Just starting", "刚开始"),
  expanding: tr("Đang mở rộng sang Mỹ", "Expanding into the US", "正在拓展美国市场"),
  operating: tr("Đã bán ở Mỹ", "Already selling in the US", "已在美国销售"),
} as const satisfies Record<SituationId, LocalizedText>;

const SUPPLY_LABELS = {
  custom: tr("In thiết kế của tôi", "I print my own design", "印制我自己的设计"),
  sourced: tr("Bán hàng tìm nguồn", "I resell sourced goods", "转售寻源商品"),
} as const satisfies Record<SupplyModel, LocalizedText>;

const CONFIDENCE_LABELS = {
  low: tr("Cần trao đổi thêm", "Needs a conversation", "需进一步沟通"),
  medium: tr("Dựa trên cam kết vận hành", "Based on operational commitments", "基于运营承诺"),
  high: tr("Dựa trên dữ liệu đã công bố", "Based on published data", "基于已公布数据"),
} as const satisfies Record<Confidence, LocalizedText>;

/** Registered brand marks, not localized: routing them through the translation layer invites a
 *  well-meaning translator to render one of them in Vietnamese. */
const CAPABILITY_LABELS = {
  fulfill: "THG Fulfill",
  express: "THG Express",
  warehouse: "THG Warehouse",
  dropship: "THG Dropship",
} as const satisfies Record<CapabilityId, string>;

const EVIDENCE_KIND_LABELS = {
  measured: tr("Đo được", "Measured", "已测量"),
  published: tr("Đã công bố", "Published", "已公布"),
  committed: tr("Cam kết", "Committed", "承诺"),
  absent: tr("Chưa công bố", "Not yet published", "尚未公布"),
} as const satisfies Record<EvidenceKind, LocalizedText>;

// ── Interface chrome ────────────────────────────────────────────────────────────────────────────
//
// Not registry-bound: these name the planner's own parts and the fields of the sales handoff. Two
// audiences kept apart because they change for different reasons — one is read by a visitor on
// screen, the other by a salesperson in a CRM record.

const HANDOFF_LABELS: Readonly<Record<string, LocalizedText>> = {
  "handoff.situation": tr("Bối cảnh", "Context", "背景"),
  "handoff.constraint": tr("Vướng mắc", "Constraint", "瓶颈"),
  "handoff.course": tr("Đề xuất", "Recommendation", "建议"),
  "handoff.destination": tr("Điểm đến", "Destination", "目的地"),
};

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
  "ui.unverified": tr(
    "Bản nháp — chờ vận hành duyệt",
    "Draft — pending operations review",
    "草案——待运营审核",
  ),
  "field.capital": tr("Vốn", "Capital", "资金"),
  "field.monthlyVolume": tr("Sản lượng/tháng", "Monthly volume", "月出货量"),
};

// ── Resolution ──────────────────────────────────────────────────────────────────────────────────

/** Each registry table with the qualifier that turns a name into the id the domain emits. */
const REGISTRY_TABLES = [
  {
    table: CONSTRAINT_LABELS as Record<string, LabelSource>,
    names: Object.keys(CONSTRAINTS),
    id: (n: string) => constraintId(n as ConstraintName),
  },
  {
    table: THG_OBLIGATION_LABELS as Record<string, LabelSource>,
    names: THG_OBLIGATIONS,
    id: (n: string) => `obligation.thg.${n}`,
  },
  {
    table: SELLER_OBLIGATION_LABELS as Record<string, LabelSource>,
    names: SELLER_OBLIGATIONS,
    id: (n: string) => `obligation.seller.${n}`,
  },
  {
    table: TRADEOFF_LABELS as Record<string, LabelSource>,
    names: TRADEOFFS,
    id: (n: string) => tradeoffId(n as TradeoffName),
  },
  {
    table: EVIDENCE_LABELS as Record<string, LabelSource>,
    names: EVIDENCE,
    id: (n: string) => evidenceId(n as EvidenceName),
  },
] as const;

/**
 * Build the label resolver for this route.
 *
 * Flattened into one map up front rather than resolved per lookup: several surfaces ask for the
 * same id, and a derived label walks the copy tree on every call.
 */
export function buildPlanLabels(
  lang: Locale,
  copy: FulfillCopy,
  parity: FulfillParityCopy,
): (id: string) => string {
  const content: LabelContent = { copy, parity };
  const labels = new Map<string, string>();
  const put = (id: string, text: LocalizedText) => labels.set(id, localize(lang, text));

  for (const { table, names, id } of REGISTRY_TABLES) {
    for (const name of names) {
      const source = table[name];
      labels.set(id(name), source.kind === "derived" ? source.read(content) : localize(lang, source.text));
    }
  }

  for (const situation of SITUATIONS) put(`situation.${situation}`, SITUATION_LABELS[situation]);
  for (const supply of SUPPLY_MODELS) put(`supply.${supply}`, SUPPLY_LABELS[supply]);
  for (const capability of CAPABILITIES) {
    labels.set(`capability.${capability}`, CAPABILITY_LABELS[capability]);
  }
  for (const [level, text] of Object.entries(CONFIDENCE_LABELS)) put(`confidence.${level}`, text);
  for (const [kind, text] of Object.entries(EVIDENCE_KIND_LABELS)) put(`kind.${kind}`, text);
  for (const [id, text] of Object.entries({ ...HANDOFF_LABELS, ...CHROME })) put(id, text);

  // An empty resolution is a content gap, not a label: falling through keeps the gap visible
  // rather than rendering nothing where a claim belongs.
  return (id: string) => labels.get(id) || MISSING;
}

/**
 * The ids whose label is an unconfirmed assertion about how THG operates.
 *
 * Exported so a reviewer — or a future surface that marks unverified claims — can enumerate them
 * rather than grep for a comment. The number should fall as operations signs each one off.
 */
export const AUTHORED_LABEL_IDS: readonly string[] = REGISTRY_TABLES.flatMap(({ table, names, id }) =>
  names.filter((name) => table[name].kind === "authored").map((name) => id(name)),
);
