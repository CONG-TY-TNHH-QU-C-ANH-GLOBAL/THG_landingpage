// Sample pricing data structure matching the Vue components
// Each array: rows sorted by kg ascending, with country codes as keys holding USD prices

export interface PriceRow {
  kg: number;
  [countryCode: string]: number;
}

export interface BulkZone {
  name: string;
  prices: Record<number, number>;
  sla: string;
}

export const countryNames: Record<string, string> = {
  us: "Mỹ (US)",
  uk: "Anh (UK)",
  de: "Đức (DE)",
  fr: "Pháp (FR)",
  it: "Ý (IT)",
  es: "Tây Ban Nha",
  nl: "Hà Lan",
  be: "Bỉ (BE)",
  ie: "Ireland",
  se: "Thụy Điển",
  ch: "Thụy Sĩ",
  at: "Áo (AT)",
  pl: "Ba Lan",
  ca: "Canada",
  mx: "Mexico",
  br: "Brazil",
  au: "Úc (AU)",
  nz: "New Zealand",
  jp: "Nhật Bản",
  hk: "Hong Kong",
  sg: "Singapore",
  cl: "Chile",
  ae: "UAE",
  sa: "Saudi Arabia",
};

// VN Standard shipping data
export const vnStandard: PriceRow[] = [
  { kg: 0.1, us: 5.20, uk: 5.80, de: 6.10, fr: 6.30, ca: 7.00 },
  { kg: 0.2, us: 5.50, uk: 6.10, de: 6.40, fr: 6.60, ca: 7.30 },
  { kg: 0.3, us: 5.80, uk: 6.40, de: 6.70, fr: 6.90, ca: 7.60 },
  { kg: 0.5, us: 6.50, uk: 7.20, de: 7.50, fr: 7.70, ca: 8.30 },
  { kg: 1.0, us: 8.50, uk: 9.50, de: 9.80, fr: 10.0, ca: 11.0 },
  { kg: 1.5, us: 10.5, uk: 11.8, de: 12.1, fr: 12.3, ca: 13.5 },
  { kg: 2.0, us: 12.5, uk: 14.0, de: 14.5, fr: 14.8, ca: 16.0 },
  { kg: 2.5, us: 14.5, uk: 16.3, de: 16.8, fr: 17.1, ca: 18.5 },
  { kg: 3.0, us: 16.5, uk: 18.5, de: 19.0, fr: 19.5, ca: 21.0 },
  { kg: 4.0, us: 20.0, uk: 22.5, de: 23.0, fr: 23.5, ca: 25.5 },
  { kg: 5.0, us: 23.5, uk: 26.5, de: 27.0, fr: 27.5, ca: 30.0 },
];

// VN Cosmetics
export const vnCosmetics: PriceRow[] = [
  { kg: 0.1, us: 6.00, uk: 6.80, de: 7.10, fr: 7.30 },
  { kg: 0.2, us: 6.50, uk: 7.30, de: 7.60, fr: 7.80 },
  { kg: 0.5, us: 7.80, uk: 8.80, de: 9.10, fr: 9.30 },
  { kg: 1.0, us: 10.5, uk: 12.0, de: 12.3, fr: 12.5 },
  { kg: 1.5, us: 13.0, uk: 14.8, de: 15.1, fr: 15.3 },
  { kg: 2.0, us: 15.5, uk: 17.5, de: 18.0, fr: 18.3 },
];

// CN Standard
export const cnStandard: PriceRow[] = [
  { kg: 0.1, us: 4.80, uk: 5.50, de: 5.80, fr: 6.00, ca: 6.80 },
  { kg: 0.2, us: 5.10, uk: 5.80, de: 6.10, fr: 6.30, ca: 7.10 },
  { kg: 0.3, us: 5.40, uk: 6.10, de: 6.40, fr: 6.60, ca: 7.40 },
  { kg: 0.5, us: 6.00, uk: 6.80, de: 7.10, fr: 7.30, ca: 8.10 },
  { kg: 1.0, us: 7.80, uk: 9.00, de: 9.30, fr: 9.50, ca: 10.5 },
  { kg: 1.5, us: 9.80, uk: 11.2, de: 11.5, fr: 11.7, ca: 13.0 },
  { kg: 2.0, us: 11.8, uk: 13.5, de: 13.8, fr: 14.0, ca: 15.5 },
  { kg: 2.5, us: 13.8, uk: 15.7, de: 16.0, fr: 16.3, ca: 18.0 },
  { kg: 3.0, us: 15.8, uk: 18.0, de: 18.3, fr: 18.5, ca: 20.5 },
  { kg: 4.0, us: 19.0, uk: 21.5, de: 22.0, fr: 22.5, ca: 24.5 },
  { kg: 5.0, us: 22.0, uk: 25.0, de: 25.5, fr: 26.0, ca: 28.5 },
];

// CN Cosmetics
export const cnCosmetics: PriceRow[] = [
  { kg: 0.1, us: 5.50, uk: 6.30, de: 6.60, fr: 6.80 },
  { kg: 0.2, us: 6.00, uk: 6.80, de: 7.10, fr: 7.30 },
  { kg: 0.5, us: 7.30, uk: 8.30, de: 8.60, fr: 8.80 },
  { kg: 1.0, us: 9.80, uk: 11.3, de: 11.6, fr: 11.8 },
  { kg: 1.5, us: 12.3, uk: 14.0, de: 14.3, fr: 14.5 },
  { kg: 2.0, us: 14.8, uk: 16.8, de: 17.1, fr: 17.3 },
];

// TikTok Lines
export const tiktokVN_UK: PriceRow[] = [
  { kg: 0.1, uk: 5.80 },
  { kg: 0.2, uk: 6.10 },
  { kg: 0.5, uk: 7.20 },
  { kg: 1.0, uk: 9.50 },
  { kg: 1.5, uk: 11.80 },
  { kg: 2.0, uk: 14.00 },
];

export const tiktokCN: PriceRow[] = [
  { kg: 0.1, us: 4.50, uk: 5.30, de: 5.60 },
  { kg: 0.2, us: 4.80, uk: 5.60, de: 5.90 },
  { kg: 0.5, us: 5.80, uk: 6.60, de: 6.90 },
  { kg: 1.0, us: 7.50, uk: 8.80, de: 9.10 },
  { kg: 1.5, us: 9.50, uk: 11.0, de: 11.3 },
  { kg: 2.0, us: 11.5, uk: 13.2, de: 13.5 },
];

// Bulk data
export const bulkVN: BulkZone[] = [
  { name: "Air Standard", prices: { 12: 9.5, 21: 8.2, 71: 7.5, 100: 7.0 }, sla: "5-8 Ngày" },
  { name: "Air Express", prices: { 12: 12.0, 21: 11.5, 71: 10.0, 100: 9.5 }, sla: "3-5 Ngày" },
];

export const bulkCN: BulkZone[] = [
  { name: "Sea (Mason)", prices: { 12: 5.5, 21: 4.2, 71: 3.8, 100: 3.5 }, sla: "20-25 Ngày" },
  { name: "Air (USP)", prices: { 12: 10.5, 21: 9.0, 71: 8.5, 100: 8.0 }, sla: "8-10 Ngày" },
];

// Helper to get data by origin/type
export const getPricingData = (origin: string, itemType: string): PriceRow[] => {
  if (origin === "vn") {
    return itemType === "cosmetic" ? vnCosmetics : vnStandard;
  }
  return itemType === "cosmetic" ? cnCosmetics : cnStandard;
};

export const getBulkData = (origin: string): BulkZone[] => {
  return origin === "cn" ? bulkCN : bulkVN;
};
