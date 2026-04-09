/**
 * Dữ liệu chính sách THG — cào từ saranimkr.online/chinh-sach
 * 70 ảnh HD (1300x950px) chia thành 5 mục.
 * Tách riêng file data để không mất khi chỉnh sửa giao diện.
 */

export interface PolicySection {
    id: string;
    title: string;
    titleKey: string;
    icon: string;
    images: string[];
}

const BASE = "https://w.ladicdn.com/s1300x950/67e69e24e8a7ba001127c80a";

export const policySections: PolicySection[] = [
    {
        id: "warehouse",
        title: "Chính sách Warehouse",
        titleKey: "policy.warehouse",
        icon: "🏭",
        images: [
            `${BASE}/1-20251008092840-fut0q.png`,
            `${BASE}/2-20251008092838-0vk2q.png`,
            `${BASE}/3-20251008092835-rjhgz.png`,
            `${BASE}/4-20251008092832-nhfwp.png`,
            `${BASE}/5-20251008092829-4uioy.png`,
            `${BASE}/6-20251008092611-te6ha.png`,
            `${BASE}/7-20251008092608-xj_vi.png`,
            `${BASE}/8-20251008092606-tqunb.png`,
            `${BASE}/9-20251008092604-rgrp4.png`,
            `${BASE}/10-20251008092602-tvddd.png`,
            `${BASE}/11-20251008092600-wcb72.png`,
            `${BASE}/12-20251008092558-d1_3i.png`,
            `${BASE}/13-20251008092557-bymwu.png`,
            `${BASE}/14-20251008092556-rakdb.png`,
            `${BASE}/15-20251008092555-qsgcy.png`,
        ],
    },
    {
        id: "pod-dropship",
        title: "Chính sách POD / Dropship",
        titleKey: "policy.pod",
        icon: "📦",
        images: [
            `${BASE}/1-20250917083038--r_av.png`,
            `${BASE}/2-20250917083036-ukrkt.png`,
            `${BASE}/3-20250917083034-xeo7c.png`,
            `${BASE}/4-20250917083031-cmse8.png`,
            `${BASE}/5-20250917083029-cckwi.png`,
            `${BASE}/6-20250917083027-hh20q.png`,
            `${BASE}/7-20250917083025-bdg3b.png`,
            `${BASE}/8-20250917083023-aieps.png`,
            `${BASE}/9-20250917083023-dnzcy.png`,
            `${BASE}/10-20250917082922-jucw0.png`,
            `${BASE}/11-20250917082919-c6kk6.png`,
            `${BASE}/12-20250917082916-_a_oo.png`,
            `${BASE}/13-20250917082913-ewj3f.png`,
            `${BASE}/14-20250917082911-3scct.png`,
            `${BASE}/15-20250917082908-tqsjg.png`,
            `${BASE}/16-20250917082905-f5wmx.png`,
            `${BASE}/17-20250917082903-sdyv1.png`,
            `${BASE}/18-20250917082902-bqomy.png`,
            `${BASE}/19-20250917082901-iaz2t.png`,
        ],
    },
    {
        id: "shipping",
        title: "Chính sách Vận chuyển",
        titleKey: "policy.shipping",
        icon: "🚚",
        images: [
            `${BASE}/thg-chinh-sach-van-chuyen-20250905023019-mwbba.png`,
            `${BASE}/2-20250905022908-tbqif.png`,
            `${BASE}/3-20250905022905-szgw2.png`,
            `${BASE}/4-20250905022902-8ak5l.png`,
            `${BASE}/6-20250917031023-igkgl.png`,
            `${BASE}/5-20250917031020-zofvu.png`,
            `${BASE}/6-20250905022856-k-523.png`,
            `${BASE}/8-20250905022851-na_u1.png`,
            `${BASE}/9-20250905022851-zoove.png`,
            `${BASE}/10-20250905022849-jsaah.png`,
            `${BASE}/11-20250905022615-pbyar.png`,
            `${BASE}/12-20250905022612-z5hdl.png`,
            `${BASE}/13-20250905022609-_ayfk.png`,
            `${BASE}/14-20250905022606-hjp34.png`,
            `${BASE}/thg-chinh-sach-van-chuyen-1-20251103091531-vddfm.png`,
            `${BASE}/15-20250905022602-75zby.png`,
            `${BASE}/16-20250905022600-epmtb.png`,
            `${BASE}/17-20250905022559-oycqy.png`,
            `${BASE}/19-20250917031030-n8tyi.png`,
            `${BASE}/18-20250917031030-mt8rm.png`,
            `${BASE}/20-20250917031031-kzfbl.png`,
            `${BASE}/19-20250905022557-yzcwc.png`,
        ],
    },
    {
        id: "bulk-compensation",
        title: "Chính sách đền bù hàng lô",
        titleKey: "policy.compensation",
        icon: "🛡️",
        images: [
            `${BASE}/1-20251106024732-9vfbw.png`,
            `${BASE}/2-20251106024730-tzhmp.png`,
            `${BASE}/3-20251106024728-onhcv.png`,
            `${BASE}/4-20251106024726-n8elp.png`,
            `${BASE}/5-20251106024723-rza1j.png`,
            `${BASE}/6-20251106024721-f8wcd.png`,
            `${BASE}/7-20251106024719-xhl0a.png`,
        ],
    },
    {
        id: "pod-tiktok",
        title: "Chính sách POD – TikTok Shipping",
        titleKey: "policy.tiktok",
        icon: "tiktok",
        images: [
            `${BASE}/1-20260122014211-gq2sj.png`,
            `${BASE}/2-20260122014209-lyxe6.png`,
            `${BASE}/3-20260122014206-fnhsc.png`,
            `${BASE}/4-20260122014204-nbt6c.png`,
            `${BASE}/5-20260122014201-tmynl.png`,
            `${BASE}/6-20260122014200-_emky.png`,
            `${BASE}/7-20260122014159-ucozv.png`,
        ],
    },
];
