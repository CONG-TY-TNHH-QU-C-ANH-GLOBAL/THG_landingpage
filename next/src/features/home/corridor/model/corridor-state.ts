// The corridor's answer state and everything derived from it. Pure — no React, no DOM, no I/O — so
// the recommendation rules can be read and tested without rendering a scene.
//
// Rule authority: src/reference/thg-world-camera-ro.html (`infer` / `render`). The reference's
// override order is reproduced exactly, including the deliberate one where a stated pain outranks
// an explicitly chosen lane: a seller who is already being penalised for late delivery is told
// about the US warehouse even if they tapped Express two gates earlier.
import { localize, tr, type LocalizedText } from "@/shared/i18n";
import type { Locale } from "@/shared/i18n";
import { tFrom, type MarketingCopy } from "@/shared/i18n/marketing";

import { WAYBILL } from "../content";
import {
  CORRIDOR_ASKS,
  DIAGNOSTICS,
  LANE_EXPRESS,
  LANE_WAREHOUSE,
  PAIN_COST,
  PAIN_LATE,
  SOURCE_POD,
  VOLUME_OVER,
  VOLUME_UNDER,
  type AskField,
} from "./questions";

export interface CorridorAnswers {
  readonly source: string | null;
  readonly lane: string | null;
  readonly volume: string | null;
  readonly channels: readonly string[];
  readonly pain: string | null;
}

export const EMPTY_ANSWERS: CorridorAnswers = {
  source: null,
  lane: null,
  volume: null,
  channels: [],
  pain: null,
};

export interface Recommendation {
  /** Always the seller's own answer — never inferred. */
  readonly source: string | null;
  /** The seller's answer, or the lane the rules below inferred for them. */
  readonly lane: string | null;
  /** Why, in the seller's own terms. `**text**` marks the emphasised span. */
  readonly reasons: readonly LocalizedText[];
}

const REASON = {
  pod: tr(
    "bạn chọn **in theo đơn** tại cổng 03",
    "you chose **print on demand** at gate 03",
    "你在第03关选择了**按需印制**",
  ),
  drop: tr(
    "bạn chọn **mua hộ từ Trung Quốc** tại cổng 03",
    "you chose **buying from China** at gate 03",
    "你在第03关选择了**从中国代购**",
  ),
  express: tr(
    "bạn chọn **bay thẳng** tại cổng 08",
    "you chose **direct air** at gate 08",
    "你在第08关选择了**直飞**",
  ),
  warehouse: tr(
    "bạn chọn **trữ tại kho Mỹ** tại cổng 08",
    "you chose **stocking in the US** at gate 08",
    "你在第08关选择了**备货美国仓**",
  ),
  volumeOver: tr(
    "sản lượng **trên 500 đơn/tháng** đủ để trữ hàng tại Mỹ mà không chết vốn",
    "**over 500 orders a month** is enough to stock in the US without freezing your capital",
    "**月单量500以上**足以在美国备货而不压死资金",
  ),
  volumeUnder: tr(
    "sản lượng **dưới 500 đơn/tháng** chưa nên ứng vốn tồn kho",
    "**under 500 orders a month** is not yet worth tying up capital in inventory",
    "**月单量500以下**还不适合把资金压在库存上",
  ),
  painLate: tr(
    "bạn đang **bị sàn phạt vì giao chậm** — giao nội địa từ kho Mỹ rút thời gian mạnh nhất",
    "you are **being penalised for late delivery** — domestic delivery from the US warehouse cuts the most time",
    "你正**因发货慢被平台处罚**——从美国仓本土派送最能压缩时效",
  ),
  painCost: tr(
    "với sản lượng này, **gom lô về kho Mỹ** là đòn bẩy giá lớn nhất",
    "at this volume, **consolidating into the US warehouse** is the biggest price lever",
    "在这个量级下，**整批入美国仓**是最大的降本杠杆",
  ),
} as const;

/**
 * Read the seller's answers and produce the combination THG would actually put them in.
 * Returns null while nothing has been answered — the surfaces render their empty state instead of
 * inventing a recommendation.
 */
export function inferRecommendation(answers: CorridorAnswers): Recommendation | null {
  const source = answers.source;
  let lane = answers.lane;
  const reasons: LocalizedText[] = [];

  if (source) reasons.push(source === SOURCE_POD ? REASON.pod : REASON.drop);

  if (lane) {
    reasons.push(lane === LANE_EXPRESS ? REASON.express : REASON.warehouse);
  } else if (answers.volume === VOLUME_OVER) {
    lane = LANE_WAREHOUSE;
    reasons.push(REASON.volumeOver);
  } else if (answers.volume === VOLUME_UNDER) {
    lane = LANE_EXPRESS;
    reasons.push(REASON.volumeUnder);
  }

  // Stated pain outranks the tapped lane — see the file header.
  if (answers.pain === PAIN_LATE) {
    lane = LANE_WAREHOUSE;
    reasons.push(REASON.painLate);
  }
  if (answers.pain === PAIN_COST && answers.volume === VOLUME_OVER) {
    lane = LANE_WAREHOUSE;
    reasons.push(REASON.painCost);
  }

  if (!source && !lane && reasons.length === 0) return null;
  return { source, lane, reasons };
}

/** True once the recommendation names a complete pairing (both halves of the combination). */
export function isCompleteRecommendation(
  recommendation: Recommendation | null,
): recommendation is Recommendation & { source: string; lane: string } {
  return Boolean(recommendation?.source && recommendation?.lane);
}

/** Stable identifier for a matrix cell — `source-lane`, e.g. "pod-exp". */
export function comboId(source: string, lane: string): string {
  return `${source}-${lane}`;
}

/** Localized label for an answer value, resolved from the question that owns it. There is no second
 *  label table: the corridor question IS the label source, so a rename cannot drift. */
export function askOptionLabel(lang: Locale, field: AskField, value: string): string {
  const ask = CORRIDOR_ASKS.find((a) => a.field === field);
  const option = ask?.options.find((o) => o.value === value);
  return option ? localize(lang, option.label) : value;
}

function diagnosticLabel(lang: Locale, field: "channels" | "pain", value: string): string {
  const question = DIAGNOSTICS.find((q) => q.field === field);
  const option = question?.options.find((o) => o.value === value);
  return option ? localize(lang, option.label) : value;
}

/** The six ANSWER rows of the waybill, in the order the dossier and the Sales payload both show
 *  them. `source` here is the seller's SOURCING answer (POD / Dropship) — see WAYBILL_META_ROWS
 *  below for why that distinction has to be stated. */
export const WAYBILL_ROWS = [
  { key: "combo", label: tr("Tổ hợp", "Combination", "组合") },
  { key: "source", label: tr("Nguồn hàng", "Sourcing", "货源") },
  { key: "lane", label: tr("Làn giao", "Delivery lane", "交付通道") },
  { key: "volume", label: tr("Sản lượng", "Volume", "单量") },
  { key: "channels", label: tr("Sàn", "Channels", "平台") },
  { key: "pain", label: tr("Nỗi đau", "Pain", "痛点") },
] as const;

export type WaybillRowKey = (typeof WAYBILL_ROWS)[number]["key"];

/** Resolve one waybill row to display text. Empty string means "not answered yet" — callers render
 *  the em-dash placeholder, so an unanswered row never reads as a real value. */
export function waybillValue(
  lang: Locale,
  key: WaybillRowKey,
  answers: CorridorAnswers,
  recommendation: Recommendation | null,
): string {
  switch (key) {
    case "combo":
      return isCompleteRecommendation(recommendation)
        ? `${askOptionLabel(lang, "source", recommendation.source)} + ${askOptionLabel(lang, "lane", recommendation.lane)}`
        : "";
    case "source":
      return recommendation?.source ? askOptionLabel(lang, "source", recommendation.source) : "";
    case "lane":
      return recommendation?.lane ? askOptionLabel(lang, "lane", recommendation.lane) : "";
    case "volume":
      return answers.volume ? askOptionLabel(lang, "volume", answers.volume) : "";
    case "channels":
      return answers.channels.map((c) => diagnosticLabel(lang, "channels", c)).join(", ");
    case "pain":
      return answers.pain ? diagnosticLabel(lang, "pain", answers.pain) : "";
  }
}

// ── The Sales payload ────────────────────────────────────────────────────────────────────────
//
// The payload panel renders the six answer rows above AND five more — the waybill code, the three
// contact fields the form collects, and the lead's provenance page — as ONE keyed list. Those five
// used to be minted as free-form strings inside the panel component, which is how `sourcePage`
// came to be written as `source` and collide with the SOURCING row above: two different concepts,
// one key, and nothing able to see the overlap because the two lists lived in different files.
//
// They are declared here, next to WAYBILL_ROWS, so the two key namespaces are visible together,
// and the payload is composed here rather than in the panel so the UI never invents an identity.

/** The non-answer rows of the payload. `sourcePage` is the /leads contract's `source_page`. */
export const WAYBILL_META_ROWS = ["waybillCode", "name", "email", "phone", "sourcePage"] as const;
export type WaybillMetaKey = (typeof WAYBILL_META_ROWS)[number];

/** Every identity the payload panel can render. The two halves must stay disjoint; the unit test
 *  `payload row keys are unique` asserts that for every combination of answers. */
export type WaybillPayloadKey = WaybillRowKey | WaybillMetaKey;

export interface WaybillPayloadRow {
  readonly key: WaybillPayloadKey;
  readonly label: string;
  /** "" means not answered / not typed yet — callers render the em-dash placeholder. */
  readonly value: string;
}

/** The contact half of the payload, as the lead form currently holds it. */
export interface WaybillContact {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
}

/**
 * Compose exactly what the panel shows: the request, row by row. The contact labels come from the
 * shared marketing dictionary (the same keys the form's own inputs use, so the panel can never
 * disagree with the field above it); the rest come from this feature's content.
 */
export function buildWaybillPayload(input: {
  lang: Locale;
  copy: MarketingCopy;
  answers: CorridorAnswers;
  recommendation: Recommendation | null;
  waybillCode: string;
  contact: WaybillContact;
  /** The `source_page` this lead will be attributed to. */
  sourcePage: string;
}): WaybillPayloadRow[] {
  const { lang, copy, answers, recommendation, waybillCode, contact, sourcePage } = input;
  const t = tFrom(copy);
  // A Record over WaybillMetaKey, not an array of literals: TypeScript rejects a duplicated
  // property outright, and a missing one too, so this half cannot drift.
  const meta: Readonly<Record<WaybillMetaKey, { label: string; value: string }>> = {
    waybillCode: { label: localize(lang, WAYBILL.codeLabel), value: waybillCode },
    name: { label: t("lead_form.name_label"), value: contact.name },
    email: { label: t("lead_form.email_label"), value: contact.email },
    phone: { label: t("lead_form.phone_label"), value: contact.phone },
    sourcePage: { label: localize(lang, WAYBILL.sourcePageLabel), value: sourcePage },
  };
  return [
    { key: "waybillCode", ...meta.waybillCode },
    ...WAYBILL_ROWS.map((row) => ({
      key: row.key,
      label: localize(lang, row.label),
      value: waybillValue(lang, row.key, answers, recommendation),
    })),
    { key: "name", ...meta.name },
    { key: "email", ...meta.email },
    { key: "phone", ...meta.phone },
    { key: "sourcePage", ...meta.sourcePage },
  ];
}

/** How much of the waybill is filled, 0–100. Drives the dossier meter and its CTA state. */
export function waybillCompletion(
  answers: CorridorAnswers,
  recommendation: Recommendation | null,
): { filled: number; total: number; percent: number } {
  const total = WAYBILL_ROWS.length;
  const filled = WAYBILL_ROWS.filter(
    (row) => waybillValue("en", row.key, answers, recommendation) !== "",
  ).length;
  return { filled, total, percent: Math.round((filled / total) * 100) };
}

/** Waybill code shown to the seller — THG-MMDD-NNNN. Generated client-side per visit; it is a
 *  reference the seller and Sales can say out loud, not an identifier the backend trusts. */
export function generateWaybillCode(now: Date, random: number): string {
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const suffix = String(1000 + Math.floor(random * 9000));
  return `THG-${mm}${dd}-${suffix}`;
}
