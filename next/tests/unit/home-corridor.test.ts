import { describe, it, expect } from "vitest";

import {
  EMPTY_ANSWERS,
  WAYBILL_META_ROWS,
  WAYBILL_ROWS,
  buildWaybillPayload,
  generateWaybillCode,
  inferRecommendation,
  isCompleteRecommendation,
  waybillCompletion,
  waybillValue,
  type CorridorAnswers,
} from "@/features/home/corridor/model/corridor-state";
import { RECOMMENDATION } from "@/features/home/corridor/content";
import { corridorLeadContext, corridorLeadIntent } from "@/features/home/corridor/model/lead-mapping";
import { CORRIDOR_GATES, GATE_COUNT } from "@/features/home/corridor/model/gates";
import {
  CORRIDOR_ASKS,
  LANE_EXPRESS,
  LANE_WAREHOUSE,
  PAIN_COST,
  PAIN_LATE,
  SOURCE_DROP,
  SOURCE_POD,
  VOLUME_OVER,
  VOLUME_UNDER,
} from "@/features/home/corridor/model/questions";
import { gatePosition, gatePresence } from "@/features/home/corridor/ui/corridor-track.client";

const answers = (partial: Partial<CorridorAnswers>): CorridorAnswers => ({ ...EMPTY_ANSWERS, ...partial });

describe("corridor recommendation rules", () => {
  it("recommends nothing until something is answered", () => {
    expect(inferRecommendation(EMPTY_ANSWERS)).toBeNull();
  });

  it("keeps both halves when the seller answered both", () => {
    const result = inferRecommendation(answers({ source: SOURCE_POD, lane: LANE_EXPRESS }));
    expect(isCompleteRecommendation(result)).toBe(true);
    expect(result).toMatchObject({ source: SOURCE_POD, lane: LANE_EXPRESS });
    expect(result?.reasons).toHaveLength(2);
  });

  it("infers the lane from volume when the seller skipped gate 08", () => {
    expect(inferRecommendation(answers({ volume: VOLUME_OVER }))?.lane).toBe(LANE_WAREHOUSE);
    expect(inferRecommendation(answers({ volume: VOLUME_UNDER }))?.lane).toBe(LANE_EXPRESS);
  });

  it("lets a stated late-delivery penalty override an explicitly chosen Express lane", () => {
    // Deliberate, and the reason it is worth a test: a seller already being penalised is told
    // about the US warehouse even though they tapped Express two gates earlier.
    const result = inferRecommendation(answers({ source: SOURCE_POD, lane: LANE_EXPRESS, pain: PAIN_LATE }));
    expect(result?.lane).toBe(LANE_WAREHOUSE);
    expect(result?.reasons).toHaveLength(3);
  });

  it("only applies the cost lever at volume", () => {
    expect(inferRecommendation(answers({ pain: PAIN_COST, volume: VOLUME_OVER }))?.lane).toBe(LANE_WAREHOUSE);
    expect(inferRecommendation(answers({ pain: PAIN_COST, volume: VOLUME_UNDER }))?.lane).toBe(LANE_EXPRESS);
  });
});

describe("waybill", () => {
  it("counts only answered rows", () => {
    expect(waybillCompletion(EMPTY_ANSWERS, null)).toMatchObject({ filled: 0, percent: 0 });
    const full = answers({
      source: SOURCE_DROP,
      lane: LANE_WAREHOUSE,
      volume: VOLUME_OVER,
      channels: ["etsy"],
      pain: PAIN_COST,
    });
    expect(waybillCompletion(full, inferRecommendation(full)).percent).toBe(100);
  });

  it("returns empty string (never a fabricated value) for unanswered rows", () => {
    expect(waybillValue("en", "combo", EMPTY_ANSWERS, null)).toBe("");
    expect(waybillValue("en", "channels", EMPTY_ANSWERS, null)).toBe("");
  });

  it("mints a THG-MMDD-NNNN code", () => {
    expect(generateWaybillCode(new Date(2026, 7, 9), 0)).toBe("THG-0809-1000");
    expect(generateWaybillCode(new Date(2026, 11, 25), 0.5)).toMatch(/^THG-1225-\d{4}$/);
  });
});

describe("waybill payload rows", () => {
  // Labels resolve through the shared marketing dictionary; a bare map is enough here and keeps
  // the assertions about identity rather than about copy.
  const COPY = {
    "lead_form.name_label": "Full name",
    "lead_form.email_label": "Email",
    "lead_form.phone_label": "Phone",
  };
  const payload = (a: CorridorAnswers, contact = { name: "", email: "", phone: "" }) =>
    buildWaybillPayload({
      lang: "en",
      copy: COPY,
      answers: a,
      recommendation: inferRecommendation(a),
      waybillCode: "THG-0811-1234",
      contact,
      sourcePage: "home-corridor",
    });

  const COMBINATIONS: ReadonlyArray<readonly [string, CorridorAnswers]> = [
    ["empty", EMPTY_ANSWERS],
    ["POD + Express", answers({ source: SOURCE_POD, lane: LANE_EXPRESS })],
    ["POD + US Warehouse", answers({ source: SOURCE_POD, lane: LANE_WAREHOUSE })],
    ["Dropship + Express", answers({ source: SOURCE_DROP, lane: LANE_EXPRESS })],
    ["Dropship + US Warehouse", answers({ source: SOURCE_DROP, lane: LANE_WAREHOUSE })],
    [
      "fully answered",
      answers({
        source: SOURCE_DROP,
        lane: LANE_WAREHOUSE,
        volume: VOLUME_OVER,
        channels: ["etsy", "amazon"],
        pain: PAIN_COST,
      }),
    ],
  ];

  // The regression this file exists for: `sourcePage` (the /leads source_page attribution) once
  // shipped as `source`, colliding with the SOURCING answer row and making React render two
  // children with the same key.
  it.each(COMBINATIONS)("payload row keys are unique — %s", (_name, a) => {
    const keys = payload(a).map((row) => row.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("keeps the sourcing answer and the provenance page as two distinct rows", () => {
    const rows = payload(answers({ source: SOURCE_POD, lane: LANE_EXPRESS }));
    const sourcing = rows.find((r) => r.key === "source");
    const provenance = rows.find((r) => r.key === "sourcePage");
    expect(sourcing?.value).toBe("POD");
    expect(provenance?.value).toBe("home-corridor");
    // Different concepts must also read differently to a human, not just to React.
    expect(sourcing?.label).not.toBe(provenance?.label);
  });

  it("covers every declared identity exactly once, in panel order", () => {
    const keys = payload(EMPTY_ANSWERS).map((row) => row.key);
    expect(keys).toEqual([
      "waybillCode",
      ...WAYBILL_ROWS.map((r) => r.key),
      "name",
      "email",
      "phone",
      "sourcePage",
    ]);
    expect([...WAYBILL_META_ROWS].sort()).toEqual(
      keys.filter((k) => !WAYBILL_ROWS.some((r) => r.key === k)).sort(),
    );
  });

  it("reflects the seller's answers, not defaults", () => {
    const rows = payload(answers({ source: SOURCE_DROP, lane: LANE_WAREHOUSE }));
    const value = (k: string) => rows.find((r) => r.key === k)?.value;
    expect(value("combo")).toBe("Dropship + US Warehouse");
    expect(value("source")).toBe("Dropship");
    expect(value("lane")).toBe("US Warehouse");
    // Untouched dimensions stay empty so the panel shows the em-dash rather than a made-up value.
    expect(value("volume")).toBe("");
    expect(value("pain")).toBe("");
  });

  it("carries the contact fields the form holds", () => {
    const rows = payload(EMPTY_ANSWERS, { name: "Mai", email: "mai@example.com", phone: "0901" });
    expect(rows.find((r) => r.key === "name")).toMatchObject({ label: "Full name", value: "Mai" });
    expect(rows.find((r) => r.key === "email")?.value).toBe("mai@example.com");
  });
});

describe("lead mapping", () => {
  it("makes sourcing the primary service and the lane an adjacent interest", () => {
    const source = answers({ source: SOURCE_POD, lane: LANE_WAREHOUSE });
    expect(corridorLeadIntent(inferRecommendation(source))).toEqual({
      primaryService: "fulfill",
      serviceInterests: ["fulfill", "warehouse"],
    });
    const drop = answers({ source: SOURCE_DROP, lane: LANE_EXPRESS });
    expect(corridorLeadIntent(inferRecommendation(drop))).toEqual({
      primaryService: "dropship",
      serviceInterests: ["dropship", "express"],
    });
  });

  it("never defaults a primary the seller did not choose", () => {
    const laneOnly = corridorLeadIntent(inferRecommendation(answers({ lane: LANE_EXPRESS })));
    expect(laneOnly.primaryService).toBeNull();
    expect(laneOnly.serviceInterests).toEqual(["express"]);
    expect(corridorLeadIntent(null)).toEqual({ primaryService: null, serviceInterests: [] });
  });

  it("adds no message context when nothing was answered", () => {
    expect(corridorLeadContext("en", EMPTY_ANSWERS, null, "HEAD")).toBe("");
  });

  it("carries the untyped answers as plain text under the heading", () => {
    const a = answers({ source: SOURCE_POD, volume: VOLUME_UNDER, pain: PAIN_COST });
    const context = corridorLeadContext("en", a, inferRecommendation(a), "HEAD");
    expect(context.startsWith("HEAD\n")).toBe(true);
    expect(context).toContain("Under 500");
    expect(context).toContain("Cost per order is too high");
  });
});

describe("camera", () => {
  it("walks from the first gate to the last across the scroll track", () => {
    expect(gatePosition(0)).toBe(0);
    expect(gatePosition(1)).toBe(GATE_COUNT - 1);
    expect(gatePosition(0.5)).toBeGreaterThan(0);
    expect(gatePosition(0.5)).toBeLessThan(GATE_COUNT - 1);
  });

  it("never runs backwards", () => {
    let previous = -1;
    for (let p = 0; p <= 1; p += 0.01) {
      const position = gatePosition(p);
      expect(position).toBeGreaterThanOrEqual(previous);
      previous = position;
    }
  });

  it("dwells at each gate — the position holds while the copy is being read", () => {
    // Between two gates the camera should spend a visible slice of its budget parked at the first.
    const atGate2 = 0.05 + (2 / (GATE_COUNT - 1)) * (0.93 - 0.05);
    const justAfter = atGate2 + 0.4 / (GATE_COUNT - 1) / 2;
    expect(Math.abs(gatePosition(justAfter) - 2)).toBeLessThan(0.35);
  });

  it("gives exactly one gate the panel at a time", () => {
    for (let i = 0; i < GATE_COUNT; i += 1) {
      const dominant = CORRIDOR_GATES.map((_, j) => gatePresence(i, j));
      expect(dominant[i]).toBe(1);
      expect(dominant.filter((v) => v > 0.45)).toHaveLength(1);
    }
  });
});

describe("content integrity", () => {
  it("asks every question at a real gate", () => {
    for (const ask of CORRIDOR_ASKS) {
      expect(ask.atGateIndex).toBeGreaterThanOrEqual(0);
      expect(ask.atGateIndex).toBeLessThan(GATE_COUNT);
    }
  });

  it("numbers the gates 1..11 in order", () => {
    expect(CORRIDOR_GATES.map((g) => g.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  // The recommendation's prep list is keyed by its own English text (there is no id on those
  // items). That is fine while the strings are distinct — this pins it, so a copy edit that made
  // two lines identical would fail here instead of as a duplicate-key warning in the browser.
  it("keeps every prep line distinct within each lane branch", () => {
    for (const laneSpecific of [
      RECOMMENDATION.prepExpress,
      RECOMMENDATION.prepWarehouse,
      RECOMMENDATION.prepUnknownLane,
    ]) {
      const lines = [...RECOMMENDATION.prepBase, ...laneSpecific].map((item) => item.en);
      expect(new Set(lines).size).toBe(lines.length);
    }
  });
});
