import { describe, expect, it } from "vitest";
import { matchImagesToSeries } from "./variantImages";

const cdn = (name: string) => `https://cdn.thgfulfill.com/catalog/${name}`;

describe("matchImagesToSeries", () => {
  it("khớp đúng sản phẩm thật Comfort Colors 1717", () => {
    // Dữ liệu thật lấy từ hub ngày 28/09/2026: 12 ảnh, 18 màu, và chỉ đúng hai
    // tên file đọc được là black-1-.png với ivory-1-.png.
    const images = [
      "78-1-.png", "THG-3-.png", "black-1-.png", "ivory-1-.png",
      "123-1-.png", "34-1-.png", "56-1-.png", "99-1-.png",
      "a-1-.png", "b-1-.png", "c-1-.png", "1717.jpg",
    ].map(cdn);
    const series = [
      "Berry", "Black", "Blossom", "Blue Jean", "Chambray", "Crimson",
      "Denim", "Espresso", "Graphite", "Grey", "Ivory", "Light Green",
      "Moss", "Navy", "Orchid", "Pepper", "White", "Yam",
    ];

    const map = matchImagesToSeries(images, series);
    expect(map.get("Black")).toEqual([2]);
    expect(map.get("Ivory")).toEqual([3]);
    expect(map.size).toBe(2); // 16 màu còn lại không có ảnh nào đặt tên được
  });

  it("tên màu phải là từ trọn vẹn, không so khớp chuỗi con", () => {
    // Đây là lý do không dùng includes(): một tấm nền trắng không phải ảnh của
    // màu White, và khách sẽ thấy sai ảnh khi bấm White.
    const map = matchImagesToSeries([cdn("whitebackground.png")], ["White"]);
    expect(map.size).toBe(0);
  });

  it("nhận dấu gạch, gạch dưới và khoảng trắng giữa các từ", () => {
    const series = ["Light Green"];
    for (const file of ["light-green-1.png", "light_green.png", "Light Green 2.png"]) {
      expect(matchImagesToSeries([cdn(file)], series).get("Light Green"), file).toEqual([0]);
    }
  });

  it("màu tên dài thắng màu tên ngắn khi cùng khớp", () => {
    const map = matchImagesToSeries([cdn("light-green-1.png")], ["Green", "Light Green"]);
    expect(map.get("Light Green")).toEqual([0]);
    expect(map.has("Green")).toBe(false);
  });

  it("ảnh khớp hai màu khác nhau thì bỏ hẳn, không đoán", () => {
    const map = matchImagesToSeries([cdn("black-and-white.png")], ["Black", "White"]);
    expect(map.size).toBe(0);
  });

  it("gom nhiều ảnh cùng một màu, giữ nguyên thứ tự up lên", () => {
    const images = ["navy-1.png", "berry.png", "navy-2.png"].map(cdn);
    const map = matchImagesToSeries(images, ["Navy", "Berry"]);
    expect(map.get("Navy")).toEqual([0, 2]);
    expect(map.get("Berry")).toEqual([1]);
  });

  it("bỏ qua tham số truy vấn và phần đường dẫn", () => {
    const map = matchImagesToSeries([cdn("black-1.png?v=3&w=800")], ["Black"]);
    expect(map.get("Black")).toEqual([0]);
  });

  it("không vỡ khi thiếu dữ liệu", () => {
    expect(matchImagesToSeries([], ["Black"]).size).toBe(0);
    expect(matchImagesToSeries([cdn("black.png")], []).size).toBe(0);
    expect(matchImagesToSeries([cdn("black.png")], ["", "  "]).size).toBe(0);
  });
});
