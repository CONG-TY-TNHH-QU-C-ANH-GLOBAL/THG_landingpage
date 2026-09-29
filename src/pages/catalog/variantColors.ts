// Tên màu (series) → mã màu thật để vẽ swatch.
//
// VÌ SAO CẦN: API catalog trả `images` ở CẤP SẢN PHẨM, không có ảnh riêng cho
// từng màu. Một áo có 6 series nhưng chỉ 4 tấm ảnh mockup dùng chung. Nên
// không thể đổi ảnh theo màu — thứ duy nhất khác giữa các variant là SKU.
//
// Cách bù: vẽ đúng màu ra bằng swatch và một hình minh hoạ, để khách nhìn
// thấy màu mình đang chọn thay vì đọc chữ "Light Brown".
//
// KHÔNG ĐOÁN. Tên nào không có trong bảng thì trả `null`, và giao diện hiện
// chip chữ như cũ. Đoán sai một màu còn tệ hơn không hiện màu: khách đặt hàng
// theo thứ họ nhìn thấy trên màn hình.
//
// Mười tên đang có thật trong catalog (soát ngày 28/09/2026 trên 40 sản phẩm):
//   Black · Blue · Gray · Green · Light Brown · Light brown · Navy · Pink ·
//   Red · White
// Lưu ý "Light Brown" và "Light brown" — dữ liệu không nhất quán hoa/thường,
// nên tra cứu luôn chuẩn hoá về chữ thường.

export interface VariantSwatch {
  /** Mã màu để tô. */
  hex: string;
  /** Màu sáng thì chữ/viền đè lên phải là màu tối. */
  isLight: boolean;
}

/** Màu chọn theo sắc độ vải thật, không phải màu nguyên bản rực rỡ — một chiếc
 *  áo "Red" ngoài đời không bao giờ là #ff0000. */
const PALETTE: Record<string, string> = {
  // Mười tên đang có trong catalog
  black: "#1c1c1e",
  blue: "#2f5fd0",
  gray: "#9aa1a8",
  green: "#2f7d4f",
  "light brown": "#b08155",
  navy: "#1f2a44",
  pink: "#efa3bb",
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
export function resolveSwatch(name?: string | null): VariantSwatch | null {
  if (!name) return null;
  const key = normalize(name);
  if (!key) return null;

  const hex = PALETTE[key];
  if (hex) return { hex, isLight: isLightHex(hex) };

  // Tên ghép kiểu "Navy Blue" hay "Light Brown Melange": thử từ cuối về đầu để
  // lấy cụm dài nhất khớp được. KHÔNG khớp theo một từ đơn bất kỳ — "Blue Sky
  // Print" không phải màu xanh.
  const words = key.split(" ");
  for (let start = 0; start < words.length; start += 1) {
    for (let end = words.length; end > start + 1; end -= 1) {
      const candidate = PALETTE[words.slice(start, end).join(" ")];
      if (candidate) return { hex: candidate, isLight: isLightHex(candidate) };
    }
  }
  return null;
}

/** Có vẽ được swatch cho ít nhất một series không — dùng để quyết định có thêm
 *  slide xem màu vào bộ ảnh hay không. */
export const hasAnySwatch = (names: (string | null | undefined)[]): boolean =>
  names.some((n) => resolveSwatch(n) !== null);
