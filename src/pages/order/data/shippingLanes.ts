// 3-lane shipping compare (Air / Express / Sea). Each lane lists 5 features
// (translated via i18n keys) and a footnote.

export interface ShippingLane {
  emoji: string;
  /** Colour hint used only for legacy class composition — kept for future styling. */
  color: "primary" | "gold" | "navy";
  tagKey: string;
  timeKey: string;
  titleKey: string;
  features: string[];
  noteKey: string;
}

export const shippingLanes: ShippingLane[] = [
  {
    emoji: "✈️",
    color: "primary",
    tagKey: "op.ship1_tag",
    timeKey: "op.ship1_time",
    titleKey: "op.ship1_t",
    features: ["op.ship1_f1", "op.ship1_f2", "op.ship1_f3", "op.ship1_f4", "op.ship1_f5"],
    noteKey: "op.ship1_note",
  },
  {
    emoji: "🚀",
    color: "gold",
    tagKey: "op.ship2_tag",
    timeKey: "op.ship2_time",
    titleKey: "op.ship2_t",
    features: ["op.ship2_f1", "op.ship2_f2", "op.ship2_f3", "op.ship2_f4", "op.ship2_f5"],
    noteKey: "op.ship2_note",
  },
  {
    emoji: "🚢",
    color: "navy",
    tagKey: "op.ship3_tag",
    timeKey: "op.ship3_time",
    titleKey: "op.ship3_t",
    features: ["op.ship3_f1", "op.ship3_f2", "op.ship3_f3", "op.ship3_f4", "op.ship3_f5"],
    noteKey: "op.ship3_note",
  },
];
