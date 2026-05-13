// 4 policy cards (refund / restrictions / process / disclosures). Each card
// has a tag chip, icon, title, and a bullet list of i18n keys.

export interface Policy {
  icon: string;
  tagKey: string;
  titleKey: string;
  items: string[];
}

export const policies: Policy[] = [
  { icon: "💰", tagKey: "op.pol1_tag", titleKey: "op.pol1_t", items: ["op.pol1_i1", "op.pol1_i2", "op.pol1_i3", "op.pol1_i4"] },
  { icon: "🚫", tagKey: "op.pol2_tag", titleKey: "op.pol2_t", items: ["op.pol2_i1", "op.pol2_i2", "op.pol2_i3", "op.pol2_i4", "op.pol2_i5", "op.pol2_i6"] },
  { icon: "📋", tagKey: "op.pol3_tag", titleKey: "op.pol3_t", items: ["op.pol3_i1", "op.pol3_i2", "op.pol3_i3", "op.pol3_i4", "op.pol3_i5"] },
  { icon: "📣", tagKey: "op.pol4_tag", titleKey: "op.pol4_t", items: ["op.pol4_i1", "op.pol4_i2", "op.pol4_i3", "op.pol4_i4"] },
];
