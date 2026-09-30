// Tên màu (series) → mã màu, để vẽ ô màu trong modal sản phẩm.
//
// HAI NGUỒN, BẢNG CÔNG TY ĐỨNG TRƯỚC:
//
//   1. catalogPalette.generated.ts — sinh từ "Bảng màu - 2D.xlsx", 38 màu kèm
//      72 mã SKU. Đây là mã màu CHÍNH THỨC do công ty xác nhận.
//   2. FALLBACK bên dưới — ước lượng theo tên, chỉ dùng cho màu chưa có trong
//      bảng công ty.
//
// KHÔNG ĐOÁN. Tên nào không có ở cả hai nguồn thì trả `null` và giao diện hiện
// chip chữ như cũ. Tô sai một màu còn tệ hơn không tô: khách đặt hàng theo
// đúng thứ họ nhìn thấy trên màn hình.
//
// Dữ liệu catalog không nhất quán hoa thường ("Light Brown" và "Light brown"),
// nên tra cứu luôn chuẩn hoá về chữ thường.

import { CATALOG_PALETTE } from "./catalogPalette.generated";

export interface VariantSwatch {
  /** Mã màu để tô. */
  hex: string;
  /** Màu sáng thì chữ/viền đè lên phải là màu tối. */
  isLight: boolean;
}

/** Dự phòng cho màu chưa có trong bảng công ty. Chọn theo sắc độ vải thật, không
 *  phải màu nguyên bản rực rỡ — áo "Red" ngoài đời không bao giờ là #ff0000.
 *  Màu nào được bổ sung vào file Excel thì mã ở đây tự hết tác dụng, vì bảng
 *  công ty được tra trước. */
const FALLBACK: Record<string, string> = {
  // Mười tên đang có trong catalog
  black: "#1c1c1e",
  blue: "#2f5fd0",
  gray: "#9aa1a8",
  green: "#2f7d4f",
  "light brown": "#b08155",
  navy: "#1f2a44",
  pink: "#efa3bb",
  // Bảng công ty chưa ghi ô màu cho BERRY (1717). Mã này đo TỪ CHÍNH ẢNH sản
  // phẩm của công ty (56-1-.png, vùng thân áo) — không phải màu tự nghĩ ra.
  berry: "#8c6078",
  red: "#c0322f",
  white: "#f6f5f2",

  // Dự phòng cho sản phẩm thêm sau — vẫn là màu vải, không phải màu neon
  "dark gray": "#4a4f54",
  "light gray": "#cfd3d6",
  charcoal: "#3c4147",
  silver: "#c6cace",
  ivory: "#f3ecdd",
  cream: "#f0e6d2",
  beige: "#ddcdb4",
  sand: "#d9c7a3",
  khaki: "#bda87b",
  brown: "#6b4a2f",
  "dark brown": "#4a3322",
  maroon: "#6b1f2a",
  burgundy: "#5d1a2b",
  orange: "#e07b28",
  yellow: "#f0c33c",
  mustard: "#c9992b",
  gold: "#c9a227",
  olive: "#6b7a3a",
  "forest green": "#1f4d33",
  "light green": "#a7e0bd",
  mint: "#a9ddc6",
  teal: "#177a70",
  turquoise: "#3fb8b0",
  "sky blue": "#8ec9ee",
  "light blue": "#9dc9e8",
  "royal blue": "#1d4ed8",
  purple: "#6b4ba1",
  lavender: "#c4b5e8",
  violet: "#7b52ab",
  "hot pink": "#e6558f",
};

/** Màu sáng cần chữ tối đè lên. Tính một lần, không đoán bằng mắt. */
const isLightHex = (hex: string): boolean => {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  // Độ sáng cảm nhận (ITU-R BT.601) — mắt người nhạy với xanh lá hơn đỏ và lam.
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.72;
};

const normalize = (raw: string): string =>
  raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    // "Grey" và "Gray" là một màu, dữ liệu dùng lẫn cả hai.
    .replace(/\bgrey\b/g, "gray")
    // "Heather Gray", "Heather Navy" — tiền tố mô tả kiểu dệt, không phải màu.
    .replace(/^heather\s+/, "")
    .replace(/^solid\s+/, "");

/**
 * Tra mã màu cho một tên series.
 *
 * Trả `null` khi không chắc — giao diện sẽ hiện chip chữ như cũ. Đó là hành vi
 * đúng: thà không hiện màu còn hơn hiện sai màu.
 */
/* Khoá của bảng công ty phải đi qua ĐÚNG hàm chuẩn hoá đang dùng để tra, nếu
   không sẽ trượt trong im lặng: `normalize` đổi "Grey" thành "gray", mà bảng
   công ty ghi khoá là "GREY" — tra thẳng sẽ không thấy và rơi xuống bảng dự
   phòng dù bảng công ty có màu đó. */
const OFFICIAL: Record<string, string> = Object.fromEntries(
  Object.entries(CATALOG_PALETTE).map(([name, hex]) => [normalize(name), hex]),
);

/** Bảng công ty tra trước, dự phòng tra sau. */
const lookup = (key: string): string | undefined => OFFICIAL[key] ?? FALLBACK[key];

export function resolveSwatch(name?: string | null): VariantSwatch | null {
  if (!name) return null;
  const key = normalize(name);
  if (!key) return null;

  const hex = lookup(key);
  if (hex) return { hex, isLight: isLightHex(hex) };

  // Tên ghép kiểu "Navy Blue" hay "Light Brown Melange": thử từ cuối về đầu để
  // lấy cụm dài nhất khớp được. KHÔNG khớp theo một từ đơn bất kỳ — "Blue Sky
  // Print" không phải màu xanh.
  const words = key.split(" ");
  for (let start = 0; start < words.length; start += 1) {
    for (let end = words.length; end > start + 1; end -= 1) {
      const candidate = lookup(words.slice(start, end).join(" "));
      if (candidate) return { hex: candidate, isLight: isLightHex(candidate) };
    }
  }
  return null;
}

/** Có vẽ được swatch cho ít nhất một series không — dùng để quyết định có thêm
 *  slide xem màu vào bộ ảnh hay không. */
export const hasAnySwatch = (names: (string | null | undefined)[]): boolean =>
  names.some((n) => resolveSwatch(n) !== null);
