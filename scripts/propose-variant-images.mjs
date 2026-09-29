#!/usr/bin/env node
/* Đề xuất "ảnh nào là màu nào" cho một sản phẩm, để người gắn tay nhanh hơn.
 *
 * VÌ SAO CẦN: hub không lưu quan hệ ảnh ↔ màu, và tên file phần lớn là
 * `78-1-.png`, `a-1-.png`. Bảng gắn tay ở src/pages/catalog/variantImageMap.ts
 * phải do người điền. Script này làm phần nhọc: tải ảnh, đo màu chủ đạo ở vùng
 * thân áo, rồi so với bảng màu để đề xuất tên.
 *
 * NÓ CHỈ ĐỀ XUẤT, KHÔNG TỰ GHI. Gắn nhầm ảnh nghĩa là khách bấm một màu và
 * thấy một chiếc áo màu khác — phải có người nhìn lại bằng mắt trước khi ghi.
 *
 * Mỗi đề xuất kèm khoảng cách màu. Khoảng cách lớn nghĩa là "không chắc" và
 * phải bỏ, không phải "gần đúng".
 *
 *   node scripts/propose-variant-images.mjs <productId>
 *   node scripts/propose-variant-images.mjs <productId> --save-montage out.png
 */
import sharp from "sharp";


const API = "https://hub.thgfulfill.com/api/public/catalog";
const productId = process.argv[2];
const montageArg = process.argv.indexOf("--save-montage");
const montagePath = montageArg > -1 ? process.argv[montageArg + 1] : null;

if (!productId) {
  console.error("Thiếu productId.\n  node scripts/propose-variant-images.mjs <productId>");
  process.exit(1);
}

/* Bảng màu tham chiếu. Phải khớp với PALETTE trong
   src/pages/catalog/variantColors.ts — đây là bản dùng cho Node, vì script
   không import được file TypeScript. Thêm màu ở một nơi thì thêm ở cả hai. */
const REFERENCE = {
  Black: "#1c1c1e", White: "#f6f5f2", Ivory: "#f3ecdd", Grey: "#9aa1a8",
  Graphite: "#4a4f54", Pepper: "#5a5a52", Navy: "#1f2a44", Denim: "#46586b",
  "Blue Jean": "#6e8ca8", Chambray: "#7b93a8", Berry: "#8c6078",
  Blossom: "#f5cfd8", Orchid: "#9b87c4", Crimson: "#9e1b32", Yam: "#c87d3f",
  Espresso: "#4a3728", Moss: "#6b6f4e", "Light Green": "#b5c9a8",
  Red: "#c0322f", Pink: "#efa3bb", Blue: "#2f5fd0", Green: "#2f7d4f",
  "Light Brown": "#b08155", Beige: "#ddcdb4", Khaki: "#bda87b",
};

const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const distance = (a, b) => Math.sqrt(a.reduce((sum, v, i) => sum + (v - b[i]) ** 2, 0));

const response = await fetch(`${API}/${productId}`);
const payload = await response.json();
const product = payload.data || payload;
if (!product?.images) {
  console.error("Không đọc được sản phẩm.");
  process.exit(1);
}

const series = [...new Set((product.variants || []).map((v) => v.series).filter((s) => s && s.trim()))];
console.log(`\n${product.name}`);
console.log(`${product.images.length} ảnh · ${series.length} màu\n`);

const known = series.filter((s) => REFERENCE[s]);
const unknown = series.filter((s) => !REFERENCE[s]);
if (unknown.length) {
  console.log(`Chưa có màu tham chiếu (không đề xuất được): ${unknown.join(", ")}\n`);
}

const thumbs = [];
for (const [index, url] of product.images.entries()) {
  const file = decodeURIComponent(url.split("?")[0].split("/").pop() || "");
  let buffer;
  try {
    buffer = Buffer.from(await (await fetch(url)).arrayBuffer());
  } catch (error) {
    console.log(`[${index}] ${file.padEnd(22)} tải hỏng: ${error.message}`);
    continue;
  }

  const meta = await sharp(buffer).metadata();
  /* Lấy vùng giữa phần dưới thân áo: tránh nền trắng quanh mép và tránh vùng
     in ở ngực, vì hình in làm lệch màu đo được. */
  const box = {
    left: Math.round(meta.width * 0.38),
    top: Math.round(meta.height * 0.62),
    width: Math.round(meta.width * 0.24),
    height: Math.round(meta.height * 0.18),
  };
  const { data, info } = await sharp(buffer).extract(box).raw().toBuffer({ resolveWithObject: true });

  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i] > 248 && data[i + 1] > 248 && data[i + 2] > 248) continue; // nền
    r += data[i]; g += data[i + 1]; b += data[i + 2]; n += 1;
  }
  if (!n) {
    console.log(`[${index}] ${file.padEnd(22)} không đo được (toàn nền trắng?)`);
    continue;
  }

  const rgb = [r / n, g / n, b / n];
  const hex = `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
  const ranked = known
    .map((name) => ({ name, d: distance(rgb, toRgb(REFERENCE[name])) }))
    .sort((a, b2) => a.d - b2.d);

  const best = ranked[0];
  const second = ranked[1];
  // Chắc chắn = gần màu đầu VÀ cách màu thứ hai đủ xa. Hai màu sát nhau thì
  // không có cơ sở chọn cái nào.
  const confident = best && best.d < 60 && (!second || second.d - best.d > 25);
  const mark = confident ? "  ✓" : "  ?";

  console.log(
    `[${index}] ${file.padEnd(22)} ${hex}${mark} ${best ? `${best.name} (lệch ${Math.round(best.d)})` : "—"}`
    + (second ? `   · kế tiếp: ${second.name} (${Math.round(second.d)})` : ""),
  );

  if (montagePath) {
    thumbs.push(await sharp(buffer).resize(160, 160, { fit: "contain", background: "#ffffff" }).toBuffer());
  }
}

console.log("\n  ✓ = đủ chắc để ghi vào bảng   ? = phải nhìn lại bằng mắt, đừng ghi vội");
console.log("  Bảng ở: src/pages/catalog/variantImageMap.ts\n");

if (montagePath && thumbs.length) {
  const cols = Math.min(6, thumbs.length);
  const rows = Math.ceil(thumbs.length / cols);
  await sharp({ create: { width: 160 * cols, height: 160 * rows, channels: 3, background: "#eeeeee" } })
    .composite(thumbs.map((input, i) => ({ input, left: (i % cols) * 160, top: Math.floor(i / cols) * 160 })))
    .png()
    .toFile(montagePath);
  console.log(`Đã ghép dải ảnh: ${montagePath}\n`);
}
