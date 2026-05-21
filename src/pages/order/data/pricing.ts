// Two pricing tables shown under the "Bảng giá vận chuyển" tabs.
// Both are operator-edited tables; eventual CMS migration would back them
// by a pricing collection (rows + columns metadata).

export interface EpacketRow {
  wt: string;
  price: string;
  perKg: string;
  /** Highlights the row in gold (volume discount tiers). */
  gold?: boolean;
}

export interface BulkRow {
  zone: string;
  /** i18n key for the ZIP-code list under the zone label. */
  zipKey: string;
  p12: string;
  p21: string;
  p71: string;
  p100: string;
}

export const epacketRows: EpacketRow[] = [
  { wt: "0.1 kg", price: "$6.84", perKg: "$68.4/kg" },
  { wt: "0.2 kg", price: "$9.00", perKg: "$45.0/kg" },
  { wt: "0.3 kg", price: "$11.07", perKg: "$36.9/kg" },
  { wt: "0.4 kg", price: "$13.50", perKg: "$33.8/kg" },
  { wt: "0.5 kg", price: "$15.89", perKg: "$31.8/kg" },
  { wt: "0.6 kg", price: "$18.36", perKg: "$30.6/kg" },
  { wt: "0.7 kg", price: "$20.71", perKg: "$29.6/kg" },
  { wt: "0.8 kg", price: "$23.99", perKg: "$30.0/kg" },
  { wt: "0.9 kg", price: "$27.28", perKg: "$30.3/kg" },
  { wt: "1.0 kg", price: "$28.82", perKg: "$28.8/kg", gold: true },
  { wt: "1.5 kg", price: "$45.44", perKg: "$30.3/kg", gold: true },
  { wt: "2.0 kg", price: "$46.36", perKg: "$23.2/kg", gold: true },
  { wt: "3.0 kg", price: "$60.80", perKg: "$20.3/kg", gold: true },
  { wt: "5.0 kg", price: "$82.01", perKg: "$16.4/kg", gold: true },
  { wt: "10.0 kg", price: "$149.00", perKg: "$14.9/kg", gold: true },
  { wt: "15.0 kg", price: "$215.36", perKg: "$14.4/kg", gold: true },
  { wt: "20.0 kg", price: "$281.71", perKg: "$14.1/kg", gold: true },
];

export const bulkRows: BulkRow[] = [
  { zone: "Zone 1 🗺️", zipKey: "op.bulk_z1", p12: "$11.79", p21: "$11.25", p71: "$10.54", p100: "$10.18" },
  { zone: "Zone 2 🗺️", zipKey: "op.bulk_z2", p12: "$11.96", p21: "$11.43", p71: "$10.71", p100: "$10.36" },
  { zone: "Zone 3 🗺️", zipKey: "op.bulk_z3", p12: "$12.14", p21: "$11.61", p71: "$10.89", p100: "$10.54" },
];
