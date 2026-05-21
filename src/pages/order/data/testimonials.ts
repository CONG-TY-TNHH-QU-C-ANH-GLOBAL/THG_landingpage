// Customer testimonials shown in a horizontal scroll on /thg-order.
// Avatars are CMS-hosted (R2 bucket) — see src/config/cmsAssets.ts.

import { TESTIMONIAL_AVATARS } from "@/config/cmsAssets";

export interface Testimonial {
  nameKey: string;
  locKey: string;
  tagKey: string;
  textKey: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  { nameKey: "Ms. Lan Huong", locKey: "📍 California, USA", tagKey: "op.testi1_tag", textKey: "op.testi1_text", avatar: TESTIMONIAL_AVATARS.lanHuong },
  { nameKey: "Mr. Minh Khoa", locKey: "📍 Texas, USA", tagKey: "op.testi2_tag", textKey: "op.testi2_text", avatar: TESTIMONIAL_AVATARS.minhKhoa },
  { nameKey: "Ms. Thuy Phuong", locKey: "📍 Virginia, USA", tagKey: "op.testi3_tag", textKey: "op.testi3_text", avatar: TESTIMONIAL_AVATARS.thuyPhuong },
  { nameKey: "Mr. Quang Tri", locKey: "📍 New York, USA", tagKey: "op.testi4_tag", textKey: "op.testi4_text", avatar: TESTIMONIAL_AVATARS.quangTri },
  { nameKey: "Ms. Bao Ngoc", locKey: "📍 Georgia, USA", tagKey: "op.testi5_tag", textKey: "op.testi5_text", avatar: TESTIMONIAL_AVATARS.baoNgoc },
];
