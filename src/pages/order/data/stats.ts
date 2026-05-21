// Hero section social-proof stats (count of orders / on-time / fees / rating).
// `val` is the rendered number; `labelKey` resolves through i18n at the call site.
// When migrating to CMS, this maps 1:1 to a `stats` collection rows.

export interface StatItem {
  val: string;
  labelKey: string;
}

export const stats: StatItem[] = [
  { val: "500+", labelKey: "op.stat1" },
  { val: "98%", labelKey: "op.stat2" },
  { val: "$0", labelKey: "op.stat3" },
  { val: "5★", labelKey: "op.stat4" },
  { val: "3", labelKey: "op.stat5" },
];
