export const THREE_PL_PACK_TIERS = [
  { maxLbs: 2, price: 1.2, label: "≤ 2 lbs" },
  { maxLbs: 4, price: 1.7, label: "2–4 lbs" },
  { maxLbs: 6, price: 2.2, label: "4–6 lbs" },
  { maxLbs: 8, price: 2.7, label: "6–8 lbs" },
  { maxLbs: 10, price: 3.2, label: "8–10 lbs" },
] as const;

export const THREE_PL_PACKAGING = [
  { key: "poly", label: "Poly mailer", price: 0, note: "Included" },
  { key: "bubble", label: "Bubble mailer", price: 0.5, note: null },
  { key: "box6", label: "Box 6×4×4 in", price: 1, note: null },
  { key: "box10", label: "Box 10×6×4 in", price: 1.5, note: null },
  { key: "box9", label: "Box 9×7×3 in", price: 1.7, note: null },
  { key: "own", label: "Your own packaging", price: 0, note: "No handling fee" },
] as const;

// USPS Ground Advantage shipping rates for 3PL come from the label rate card's
// Tier 1 (CMS uspsGaLabelT1); see src/data/uspsGaLabelRates.ts.
