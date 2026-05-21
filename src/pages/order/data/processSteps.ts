// 5-step "How it works" timeline rendered as numbered cards.

export interface ProcessStep {
  num: number;
  emoji: string;
  titleKey: string;
  descKey: string;
}

export const processSteps: ProcessStep[] = [
  { num: 1, emoji: "🔗", titleKey: "op.step1_t", descKey: "op.step1_d" },
  { num: 2, emoji: "💬", titleKey: "op.step2_t", descKey: "op.step2_d" },
  { num: 3, emoji: "🛒", titleKey: "op.step3_t", descKey: "op.step3_d" },
  { num: 4, emoji: "📹", titleKey: "op.step4_t", descKey: "op.step4_d" },
  { num: 5, emoji: "🏠", titleKey: "op.step5_t", descKey: "op.step5_d" },
];
