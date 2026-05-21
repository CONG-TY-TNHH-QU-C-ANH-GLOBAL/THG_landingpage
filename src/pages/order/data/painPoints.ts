// "Why this matters" — 6 pain points shown above the Solutions section.
// Each entry is an emoji-icon + i18n keys for title/description.

export interface PainPoint {
  emoji: string;
  titleKey: string;
  descKey: string;
}

export const painPoints: PainPoint[] = [
  { emoji: "🔍", titleKey: "op.pain1_t", descKey: "op.pain1_d" },
  { emoji: "🈷️", titleKey: "op.pain2_t", descKey: "op.pain2_d" },
  { emoji: "⚠️", titleKey: "op.pain3_t", descKey: "op.pain3_d" },
  { emoji: "💸", titleKey: "op.pain4_t", descKey: "op.pain4_d" },
  { emoji: "🔄", titleKey: "op.pain5_t", descKey: "op.pain5_d" },
  { emoji: "🕰️", titleKey: "op.pain6_t", descKey: "op.pain6_d" },
];
