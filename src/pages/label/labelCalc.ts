/** Whole-dollar USD, e.g. 1234.4 → "$1,234". */
export const formatUsd = (value: number) => `$${Math.round(value).toLocaleString("en-US")}`;

/** Savings maths for the Label calculator: retail spend, monthly/yearly saving and the discounted spend. */
export function estimateLabelSavings(labelsPerMonth: number, retailPrice: number, discountPct: number) {
  const retail = labelsPerMonth * retailPrice;
  const monthly = (retail * discountPct) / 100;
  return { retail, monthly, withThg: retail - monthly, yearly: monthly * 12 };
}
