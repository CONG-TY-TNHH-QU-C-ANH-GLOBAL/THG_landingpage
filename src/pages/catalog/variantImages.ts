// Nối ảnh sản phẩm với màu (series) — qua TÊN FILE, vì không còn đường nào khác.
//
// ĐÃ ĐO TRÊN TOÀN BỘ CATALOG, ngày 28/09/2026, 493 sản phẩm:
//   188  sản phẩm có màu (series)
//     1  sản phẩm có ít nhất một ảnh đặt tên theo màu
//     0  sản phẩm có đủ ảnh cho mọi màu
//
// API không cho đường nào khác để nối: `variants[].color` là null, variant
// không có trường ảnh, và `images` chỉ là mảng chuỗi URL ở cấp sản phẩm. Tên
// file thật đang là `78-1-.png`, `a-1-.png`, `123-1-.png` — Vận hành có up ảnh
// từng màu lên thật, nhưng đặt tên không đọc được bằng máy.
//
// Nên cơ chế này CHẠY SẴN VÀ NẰM CHỜ. Nó chưa làm được gì cho 187/188 sản
// phẩm, và sẽ tự hoạt động ngay khi ảnh được đặt tên có màu. Quy ước đặt tên
// ở cuối file này.
//
// KHỚP CHẶT, KHÔNG ĐOÁN. Khách chọn màu theo đúng tấm ảnh họ nhìn thấy, nên
// gán nhầm ảnh còn tệ hơn không gán.

/** Escape ký tự đặc biệt để ghép tên màu vào biểu thức chính quy. */
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Tên màu có xuất hiện trong tên file như một từ trọn vẹn không.
 *
 * Bắt buộc có RANH GIỚI hai đầu, không dùng so khớp chuỗi con. Lý do cụ thể:
 * `white-background.png` KHÔNG được tính là ảnh màu White, còn `white-2.png`
 * thì có. So khớp chuỗi con sẽ nuốt luôn trường hợp đầu.
 *
 * Giữa các từ cho phép gạch, gạch dưới, chấm hoặc khoảng trắng, nên
 * "Light Green" khớp được `light-green-1.png` lẫn `light_green.png`.
 */
const matchesName = (fileName: string, seriesName: string): boolean => {
  const words = seriesName.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return false;
  const body = words.map(escapeRe).join("[-_\\s.]*");
  return new RegExp(`(?:^|[^a-z])${body}(?:[^a-z]|$)`, "i").test(fileName);
};

const fileNameOf = (url: string): string => {
  try {
    return decodeURIComponent(url.split("?")[0].split("/").pop() || "");
  } catch {
    return url.split("?")[0].split("/").pop() || "";
  }
};

/**
 * Trả map: tên series → danh sách CHỈ SỐ ảnh thuộc màu đó.
 *
 * Series nào không có ảnh nào thì không xuất hiện trong map — nơi gọi rơi về
 * khung minh hoạ màu.
 *
 * Một tấm ảnh khớp NHIỀU màu thì bị bỏ hẳn, không gán cho màu nào. Ví dụ một
 * file tên `black-and-white.png` là ảnh so sánh hai màu, không phải ảnh của
 * riêng màu nào; đoán bừa một trong hai là hiển thị sai cho khách.
 *
 * Màu tên dài thắng màu tên ngắn khi cùng khớp một file: `light-green-1.png`
 * khớp cả "Light Green" lẫn "Green", và đáp án đúng là "Light Green".
 */
export function matchImagesToSeries(
  images: string[],
  seriesNames: string[],
): Map<string, number[]> {
  const result = new Map<string, number[]>();
  const usable = seriesNames.filter((s) => s && s.trim());
  if (!images.length || !usable.length) return result;

  // Tên dài xét trước để cụm dài thắng khi lồng nhau.
  const ordered = [...usable].sort((a, b) => b.trim().length - a.trim().length);

  images.forEach((url, index) => {
    const file = fileNameOf(url);
    if (!file) return;

    const hits = ordered.filter((name) => matchesName(file, name));
    if (hits.length === 0) return;

    // Lọc bỏ những tên bị tên dài hơn bao trùm: "Light Green" đã khớp thì
    // "Green" trong cùng file không phải một màu thứ hai.
    const distinct = hits.filter(
      (name) => !hits.some((other) => other !== name && other.toLowerCase().includes(name.toLowerCase())),
    );
    if (distinct.length !== 1) return; // mơ hồ thật sự → bỏ qua

    const key = distinct[0];
    if (!result.has(key)) result.set(key, []);
    result.get(key)!.push(index);
  });

  return result;
}

/* ── Quy ước đặt tên ảnh, gửi đội Vận hành ────────────────────────────────

   Đặt tên file có tên màu ĐÚNG NHƯ trong series, là ảnh tự nhảy khi khách bấm
   màu đó. Không cần đổi gì ở hub, không cần ai deploy lại.

     black-1.png          → màu Black
     light-green-2.png    → màu Light Green
     blue_jean.png        → màu Blue Jean
     ivory.png            → màu Ivory

   Không nhận:

     78-1-.png            không có tên màu — ảnh vẫn hiện, chỉ không tự nhảy
     whitebackground.png  "white" dính liền chữ khác, không tính
     black-and-white.png  khớp hai màu → bỏ, vì không biết ảnh của màu nào

   Nhiều ảnh cùng một màu thì giữ nguyên thứ tự up lên; tấm đầu là tấm hiện ra
   khi bấm màu. */
