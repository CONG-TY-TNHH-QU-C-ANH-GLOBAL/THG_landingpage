// Bảng gắn tay: ảnh nào là ảnh của màu nào.
//
// VÌ SAO PHẢI GẮN TAY: hub không lưu quan hệ ảnh ↔ màu. `variants[].color` là
// null, variant không có trường ảnh, `images` chỉ là mảng URL ở cấp sản phẩm,
// và tên file do Vận hành đặt phần lớn là `78-1-.png`, `a-1-.png`. Máy không
// đọc ra được. Nên người nhìn ảnh, nhận ra màu, rồi ghi vào đây.
//
// Ưu tiên khi chọn ảnh cho một màu:
//   1. tên file có tên màu       → tự động, xem variantImages.ts
//   2. bảng dưới đây             → gắn tay
//   3. không có                  → giữ nguyên ảnh đang xem
//
// Cách bổ sung một sản phẩm: chạy `node scripts/propose-variant-images.mjs <id>`
// để lấy màu chủ đạo đo được của từng ảnh kèm đề xuất, NHÌN LẠI BẰNG MẮT, rồi
// ghi vào đây. Script chỉ đề xuất; nó không tự ghi, vì gắn nhầm ảnh nghĩa là
// khách bấm một màu và thấy một chiếc áo màu khác.

export interface ProductImageMap {
  /** Ghi chú để người sau biết bảng này dựng thế nào. */
  note?: string;
  /** tên file ảnh (đúng như trên CDN) → tên series (đúng như trong dữ liệu) */
  byFile: Record<string, string>;
}

export const VARIANT_IMAGE_MAP: Record<string, ProductImageMap> = {
  // Comfort Colors Unisex T-Shirt 1717
  // 12 ảnh / 18 màu. Đối chiếu bằng mắt ngày 28/09/2026, kèm màu chủ đạo đo
  // được ở vùng thân áo.
  cmucu315306ao01ozwwx8gksb: {
    note: "11 ảnh áo + 1 bảng size, cho 18 màu. Bảy màu nhận diện chắc chắn.",
    byFile: {
      "black-1-.png": "Black", // #252525 đen
      "ivory-1-.png": "Ivory", // #ebe2d6 trắng ngà
      "56-1-.png": "Berry", // #8c6078 mận
      "c-1-.png": "Orchid", // #9789c3 tím lavender
      "b-1-.png": "Blossom", // #f7d7e4 hồng phấn
      "a-1-.png": "Moss", // #727766 xanh rêu ô liu
      "34-1-.png": "Denim", // #525866 xanh xám
    },
  },
};

/* ── CHƯA GẮN — cần Vận hành xác nhận ────────────────────────────────────

   Comfort Colors 1717, bốn tấm KHÔNG gắn được, vì màu đo được không khớp rõ
   ràng với bất kỳ tên nào trong danh sách 18 màu của sản phẩm:

     78-1-.png   #f0727c  hồng san hô   — gần "Watermelon" của Comfort Colors,
                                          màu đó không có trong danh sách.
                                          "Crimson" thì đỏ sẫm hơn hẳn.
     THG-3-.png  #76aca5  xanh ngọc     — gần "Seafoam", không có trong danh
                                          sách. "Light Green" là xanh sage nhạt.
     123-1-.png  #beb29a  be cát        — gần "Sandstone". "Yam" là cam đất.
     99-1-.png   #5f746d  xanh rêu đậm  — gần "Blue Spruce", không có trong
                                          danh sách. "Moss" đã gắn cho a-1-.png.

   Và 1717.jpg là BẢNG SIZE, không phải ảnh áo — không gắn cho màu nào.

   Mười một màu này KHÔNG CÓ ẢNH NÀO: Blue Jean, Chambray, Crimson, Espresso,
   Graphite, Grey, Light Green, Navy, Pepper, White, Yam.

   Espresso là nâu đậm — trong 12 tấm không có tấm nâu nào. Nên bấm Espresso mà
   khung hình đứng im không phải lỗi giao diện: chưa có ảnh để nhảy tới. Giao
   diện nói rõ điều đó thay vì im lặng.

   Hai việc cần Vận hành làm, theo thứ tự đáng làm:
     1. Xác nhận 4 tấm trên là màu gì → ghi vào bảng, xong ngay.
     2. Up ảnh cho 11 màu còn thiếu. Đặt tên có màu, ví dụ espresso-1.png, thì
        không cần ai gắn tay nữa, kể cả cho sản phẩm mới.

   BÀI HỌC khi điền bảng này: lần đầu điền, bốn dòng bị gắn sai vì ghép nhầm vị
   trí trong dải ảnh với tên file — ảnh thứ 7 trong dải không phải là file thứ
   7 mình đang nhìn. Luôn chạy scripts/propose-variant-images.mjs để lấy tên
   file ĐI KÈM màu đo được, đừng đếm bằng mắt.                                */

const fileNameOf = (url: string): string => {
  const path = url.split("?")[0].split("/").pop() || "";
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
};

/**
 * Bảng gắn tay của một sản phẩm, đổi sang dạng series → danh sách chỉ số ảnh.
 *
 * Nhận `images` đã lọc sẵn (bỏ ảnh hỏng) để chỉ số trả về khớp đúng với mảng
 * mà giao diện đang dựng.
 */
export function manualImagesBySeries(
  productId: string,
  images: string[],
): Map<string, number[]> {
  const result = new Map<string, number[]>();
  const entry = VARIANT_IMAGE_MAP[productId];
  if (!entry) return result;

  images.forEach((url, index) => {
    const series = entry.byFile[fileNameOf(url)];
    if (!series) return;
    if (!result.has(series)) result.set(series, []);
    result.get(series)!.push(index);
  });
  return result;
}
