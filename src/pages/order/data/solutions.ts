// 6 value-prop cards rendered after Pain Points to position THG Order against
// generic forwarders. Each entry has a chip tag, an emoji icon, and i18n keys.

export interface Solution {
  icon: string;
  tagKey: string;
  titleKey: string;
  descKey: string;
}

export const solutions: Solution[] = [
  { icon: "🛡️", tagKey: "op.sol1_tag", titleKey: "op.sol1_t", descKey: "op.sol1_d" },
  { icon: "🇨🇳", tagKey: "op.sol2_tag", titleKey: "op.sol2_t", descKey: "op.sol2_d" },
  { icon: "📹", tagKey: "op.sol3_tag", titleKey: "op.sol3_t", descKey: "op.sol3_d" },
  { icon: "↩️", tagKey: "op.sol4_tag", titleKey: "op.sol4_t", descKey: "op.sol4_d" },
  { icon: "✈️", tagKey: "op.sol5_tag", titleKey: "op.sol5_t", descKey: "op.sol5_d" },
  { icon: "📡", tagKey: "op.sol6_tag", titleKey: "op.sol6_t", descKey: "op.sol6_d" },
];
