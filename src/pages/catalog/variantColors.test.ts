import { describe, expect, it } from "vitest";
import { resolveSwatch } from "./variantColors";

describe("resolveSwatch", () => {
  // Mười tên series có thật trong catalog, soát ngày 28/09/2026 trên 40 sản
  // phẩm. Nếu một tên ở đây ngừng tra được thì swatch của nó biến mất khỏi
  // trang mà không ai biết.
  const REAL_SERIES = ["Black", "Blue", "Gray", "Green", "Light Brown", "Navy", "Pink", "Red", "White"];

  it("tra được mọi tên series đang có trong catalog", () => {
    for (const name of REAL_SERIES) {
      expect(resolveSwatch(name), name).not.toBeNull();
    }
  });

  it("không phân biệt hoa thường — dữ liệu có cả 'Light Brown' lẫn 'Light brown'", () => {
    expect(resolveSwatch("Light brown")).toEqual(resolveSwatch("Light Brown"));
    expect(resolveSwatch("BLACK")).toEqual(resolveSwatch("black"));
  });

  it("coi Grey và Gray là một màu", () => {
    expect(resolveSwatch("Grey")).toEqual(resolveSwatch("Gray"));
  });

  it("bỏ tiền tố mô tả kiểu dệt", () => {
    expect(resolveSwatch("Heather Gray")).toEqual(resolveSwatch("Gray"));
  });

  it("KHÔNG đoán màu cho tên lạ", () => {
    // Đây là quy tắc quan trọng nhất của file. Khách đặt hàng theo màu họ nhìn
    // thấy trên màn hình, nên tô một màu sai còn tệ hơn không tô gì.
    expect(resolveSwatch("Camo Print")).toBeNull();
    expect(resolveSwatch("Style A")).toBeNull();
    expect(resolveSwatch("")).toBeNull();
    expect(resolveSwatch(null)).toBeNull();
    expect(resolveSwatch(undefined)).toBeNull();
  });

  it("không bắt màu từ một từ đơn lọt trong tên dài", () => {
    // "Blue Sky Print" là tên hoạ tiết, không phải màu xanh. Chỉ khớp khi cụm
    // từ ghép có trong bảng.
    expect(resolveSwatch("Blue Sky Print Edition")).toBeNull();
  });

  it("khớp cụm ghép nằm trong tên dài", () => {
    const light = resolveSwatch("Light Brown");
    expect(resolveSwatch("Light Brown Melange")).toEqual(light);
  });

  it("đánh dấu đúng màu sáng để chữ đè lên đọc được", () => {
    expect(resolveSwatch("White")?.isLight).toBe(true);
    expect(resolveSwatch("Black")?.isLight).toBe(false);
    expect(resolveSwatch("Navy")?.isLight).toBe(false);
  });

  it("luôn trả mã màu hex hợp lệ", () => {
    for (const name of REAL_SERIES) {
      expect(resolveSwatch(name)?.hex).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});
