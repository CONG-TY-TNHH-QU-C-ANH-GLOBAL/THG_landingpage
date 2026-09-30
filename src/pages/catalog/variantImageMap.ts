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

/* ── ĐÃ ĐỐI CHIẾU VỚI BẢNG MÀU CÔNG TY ───────────────────────────────────

   Nguồn: "Bảng màu - 2D.xlsx" — 7 sản phẩm, 72 dòng màu, 38 mã màu chính
   thức. Mã màu nằm ở màu chữ của ký tự █, không phải màu nền ô.

   Bảy màu ở bảng trên đã được kiểm bằng cách đặt ẢNH cạnh Ô MÀU CHÍNH THỨC,
   nhìn từng cặp một. Cả bảy khớp.

   BỐN TẤM KHÔNG GẮN ĐƯỢC. Đã so với cả 11 màu còn lại của sản phẩm, không
   tấm nào khớp — đây là kết luận dựa trên bảng của công ty, không phải phỏng
   đoán:

     78-1-.png   hồng san hô   ≠ Yam #c96a2d (cam đất) · ≠ Crimson #9e2a2f (đỏ sẫm)
     THG-3-.png  xanh ngọc     ≠ Light Green #a8c686 (xanh vàng) · ≠ Chambray #8daec7 (xanh lam)
     123-1-.png  be cát        ≠ Grey #b8b8b8 · ≠ Light Green #a8c686
     99-1-.png   xanh rêu đậm  ≠ Moss #6e7a47 (đã gắn cho a-1-.png) · ≠ Graphite #51565c

   Tức là Vận hành đã up ảnh của những màu KHÔNG nằm trong 18 màu sản phẩm này
   bán. Và 1717.jpg là bảng size, không phải ảnh áo.

   MƯỜI MỘT MÀU KHÔNG CÓ ẢNH NÀO: Blue Jean, Chambray, Crimson, Espresso,
   Graphite, Grey, Light Green, Navy, Pepper, White, Yam.

   Espresso là nâu đậm (#4a2f24 theo bảng công ty) — trong 12 tấm không có tấm
   nâu nào. Bấm Espresso mà khung hình đứng im KHÔNG phải lỗi giao diện.

   Việc cần Vận hành làm:
     1. Xác nhận 4 tấm trên là màu gì, hoặc gỡ chúng nếu là ảnh sai sản phẩm.
     2. Up ảnh cho 11 màu còn thiếu. Đặt tên có màu, ví dụ espresso-1.png, thì
        không cần ai gắn tay nữa.
     3. Bổ sung ô màu cho BERRY (1717) trong file Excel — dòng đó chỉ có chữ,
        không có ô █. Mã đang dùng là màu đo từ chính ảnh 56-1-.png.

   BÀI HỌC khi điền bảng này: lần đầu điền, bốn dòng bị gắn sai vì ghép nhầm vị
   trí trong dải ảnh với tên file — ảnh thứ 7 trong dải không phải file thứ 7
   mình đang nhìn. Luôn chạy scripts/propose-variant-images.mjs để lấy tên file
   ĐI KÈM màu đo được, đừng đếm bằng mắt.                                    */

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
