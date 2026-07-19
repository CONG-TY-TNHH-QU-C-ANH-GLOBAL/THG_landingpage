import "server-only";

import type { Locale } from "@/shared/i18n";
import type { ContactLocation } from "../models/contactLocation";

// AUTHORITATIVE contact-location fallback (WEB-001 owner requirement: a network failure
// must never be presented as "THG has no locations").
//
// Source of every record: the PRODUCTION CMS payload of GET /contact-locations?lang=…
// (https://cms.thgfulfill.com/api/v1), captured verbatim on 2026-07-18 — nothing invented,
// nothing edited. The CMS stays the single source of truth: these rows render ONLY when the
// CMS is unreachable (ContactLocationsResult status "unavailable"), and any live CMS
// response — including a valid empty list — always wins. Refresh by re-capturing the
// production payload; do not hand-edit addresses here.
export const FALLBACK_CONTACT_LOCATIONS: Readonly<Record<Locale, readonly ContactLocation[]>> = {
  vi: [
    { id: 2, kind: "office", label: "VĂN PHÒNG HỒ CHÍ MINH", address: "121/5 Đ. Kênh 19/5, Sơn Kỳ, Tân Phú, TP.HCM", phone: null, url: null, langClass: null },
    { id: 22, kind: "office", label: "VĂN PHÒNG ĐÀ NẴNG", address: "Thanh Tùng Building, 153 Đống Đa, Hải Châu, Đà Nẵng.", phone: null, url: null, langClass: null },
    { id: 5, kind: "warehouse", label: "KHO Mỹ – PENNSYLVANIA", address: "108 Almond CT, Milford, PA 18337", phone: "+1 (570) 618-1169", url: null, langClass: null },
    { id: 8, kind: "warehouse", label: "KHO Mỹ – NORTH CAROLINA", address: "4136 Sunflower Circle, Winston-Salem, NC 27105", phone: null, url: null, langClass: null },
    { id: 11, kind: "warehouse", label: "KHO TRUNG QUỐC", address: "广东省东莞市常平镇霞坑新宅二区三街101", phone: null, url: null, langClass: "font-cn" },
    { id: 14, kind: "phone", label: "Hotline", address: null, phone: "0335.124.089", url: null, langClass: null },
    { id: 17, kind: "email", label: "Email", address: null, phone: null, url: "mailto:info@thgfulfill.com", langClass: null },
    { id: 20, kind: "website", label: "Website", address: null, phone: null, url: "https://thgfulfill.com", langClass: null },
    { id: 23, kind: "office", label: "CÔNG TY TNHH QUỐC ANH GLOBAL", address: "Tầng trệt, Tòa nhà More Building, 40A-40B Út Tịch, Phường Tân Sơn Nhất, TP Hồ Chí Minh", phone: "0335124089", url: null, langClass: null },
  ],
  en: [
    { id: 2, kind: "office", label: "HO CHI MINH OFFICE", address: "121/5 Kênh 19/5 Street, Sơn Kỳ, Tân Phú, Ho Chi Minh City", phone: null, url: null, langClass: null },
    { id: 22, kind: "office", label: "DANANG OFFICE", address: "Thanh Tùng Building, 153 Đống Đa, Hải Châu, Danang.", phone: null, url: null, langClass: null },
    { id: 5, kind: "warehouse", label: "US WAREHOUSE – PENNSYLVANIA", address: "108 Almond CT, Milford, PA 18337", phone: "+1 (570) 618-1169", url: null, langClass: null },
    { id: 8, kind: "warehouse", label: "US WAREHOUSE – NORTH CAROLINA", address: "4136 Sunflower Circle, Winston-Salem, NC 27105", phone: null, url: null, langClass: null },
    { id: 11, kind: "warehouse", label: "CHINA WAREHOUSE", address: "广东省东莞市常平镇霞坑新宅二区三街101", phone: null, url: null, langClass: "font-cn" },
    { id: 14, kind: "phone", label: "Hotline", address: null, phone: "0335.124.089", url: null, langClass: null },
    { id: 17, kind: "email", label: "Email", address: null, phone: null, url: "mailto:info@thgfulfill.com", langClass: null },
    { id: 20, kind: "website", label: "Website", address: null, phone: null, url: "https://thgfulfill.com", langClass: null },
  ],
  zh: [
    { id: 2, kind: "office", label: "胡志明市办公室", address: "121/5 Kênh 19/5街, Sơn Kỳ, Tân Phú, 胡志明市", phone: null, url: null, langClass: null },
    { id: 22, kind: "office", label: "岘港办公室", address: "Thanh Tùng大厦, 153 Đống Đa, Hải Châu, 岘港.", phone: null, url: null, langClass: null },
    { id: 5, kind: "warehouse", label: "美国仓库 – 宾夕法尼亚", address: "108 Almond CT, Milford, PA 18337", phone: "+1 (570) 618-1169", url: null, langClass: null },
    { id: 8, kind: "warehouse", label: "美国仓库 – 北卡罗来纳", address: "4136 Sunflower Circle, Winston-Salem, NC 27105", phone: null, url: null, langClass: null },
    { id: 11, kind: "warehouse", label: "中国仓库", address: "广东省东莞市常平镇霞坑新宅二区三街101", phone: null, url: null, langClass: "font-cn" },
    { id: 14, kind: "phone", label: "热线电话", address: null, phone: "0335.124.089", url: null, langClass: null },
    { id: 17, kind: "email", label: "电子邮件", address: null, phone: null, url: "mailto:info@thgfulfill.com", langClass: null },
    { id: 20, kind: "website", label: "官方网站", address: null, phone: null, url: "https://thgfulfill.com", langClass: null },
  ],
};
