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

describe("bảng màu công ty", () => {
  // Mã lấy từ 'Bảng màu - 2D.xlsx'. Nếu một dòng ở đây hỏng nghĩa là file sinh
  // ra đã lệch khỏi bảng gốc — chạy lại py scripts/gen-catalog-palette.py.
  const OFFICIAL: Array<[string, string]> = [
    ["Ivory", "#f5f1e8"],
    ["Orchid", "#b08cc9"],
    ["Blossom", "#e8b7c7"],
    ["Moss", "#6e7a47"],
    ["Denim", "#3d5a80"],
    ["Espresso", "#4a2f24"],
    ["Crimson", "#9e2a2f"],
    ["Yam", "#c96a2d"],
    ["Blue Jean", "#6f8faf"],
    ["Chambray", "#8daec7"],
    ["Graphite", "#51565c"],
    ["Pepper", "#4a4a4a"],
  ];

  it("dùng mã chính thức, không dùng mã tôi tự ước lượng", () => {
    for (const [name, hex] of OFFICIAL) {
      expect(resolveSwatch(name)?.hex, name).toBe(hex);
    }
  });

  it("màu bảng công ty chưa ghi thì rơi về bảng dự phòng, không phải null", () => {
    // BERRY của 1717 không có ô màu trong file Excel. Ô màu vẫn phải vẽ được,
    // chỉ là mã đến từ bảng dự phòng.
    expect(resolveSwatch("Berry")).not.toBeNull();
  });
});
