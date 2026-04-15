import { useMemo } from "react";
import { useLarkPricingContext } from "@/components/pricing/LarkPricingProvider";

/* ═══════════════════════════════════════════════════════════
   useShippingPolicy — extracts policy data from already-fetched GSheet
   Uses the existing LarkPricingProvider (no extra API calls).
   ═══════════════════════════════════════════════════════════ */

/** GID → Route mapping for the 7 shipping policy tabs */
export const POLICY_GIDS = {
    VN_PRIORITY: "1437367264", // Policy VN-YTYCPREC VN priority US
    VN_REGULAR: "1366777313", // Policy VNTHZXR VN standard WW
    CN_PRIORITY: "1663964711", // Policy YTYCPREC priority CN US
    VN_COSMETICS: "1764855107", // Policy VNMUZXR standard VN WW(comestic)
    CN_REGULAR: "535541764",  // Policy THPHR (Standard CN hàng thường)
    CN_COSMETICS: "1814177658", // Policy MUZXR(Stand CN WW comestic)
    CN_BATTERIES: "1808506806", // Policy THZXR(Stand CN WW pin điện)
} as const;

export type PolicyKey = keyof typeof POLICY_GIDS;

export interface PolicySection {
    title: string;
    icon: string;
    lines: string[];
}

/** Map heading text → icon for Sec */
const ICON_RULES: [RegExp, string][] = [
    [/VAT|IOSS|THÔNG TIN CHUNG|General Info/i, "%"],
    [/Chargeable Weight|Trọng lượng tính cước|计费重量/i, "⚖"],
    [/Weight|Trọng lượng|Giới hạn trọng lượng|重量/i, "⚖"],
    [/Countries|Serviceable|QUỐC GIA|国家|Service Countries/i, "🌍"],
    [/Declared Value|Giá trị khai báo|申报价值/i, "$"],
    [/Cargo|lô hàng|Goods Properties|货物/i, "📦"],
    [/Size|Kích thước|尺寸/i, "📏"],
    [/Address|Địa chỉ|地址|Delivery/i, "📍"],
    [/Pre[- ]?alert|Pre-declaration|预报/i, "📋"],
    [/Returns|Trả hàng|Re-?Delivery|Giao lại|退货|重新投递/i, "↩"],
    [/Compensation|Bồi thường|赔偿/i, "🛡"],
    [/Other|Yêu cầu khác|其他/i, "📌"],
    [/Tracking|Tra cứu|查询/i, "🔍"],
    [/Force Majeure|Bất khả kháng|不可抗力/i, "⚡"],
    [/Lưu ý|Special Note|Điều kiện miễn trừ|注意/i, "⚠"],
    [/Order|Delivery Requirement|配送|Đặt hàng|下单/i, "📋"],
];

/** Strip leading emoji & whitespace from a heading title */
function stripEmoji(title: string): string {
    return title
        .replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}%$⚖️🌍📦📏📍🛡📌🔍⚡⚠↩💵💠🔄🔋💄\s]+/u, "")
        .trim();
}

function getIcon(title: string): string {
    for (const [re, icon] of ICON_RULES) {
        if (re.test(title)) return icon;
    }
    return "📋";
}

/**
 * Parse raw CSV rows (2D array) from a policy tab into structured sections.
 * 
 * Policy tab layout: Each row is a line of policy text.
 * Column A contains the text. Other columns are mostly empty.
 * Lines starting with Roman numerals (I, II, III...) or specific markers are section headers.
 */
export function parsePolicyRows(rows: any[][]): PolicySection[] {
    if (!rows || rows.length === 0) return [];

    // Extract text from column A of each row
    const lines = rows.map(row => String(row[0] ?? "").trim()).filter(Boolean);

    const sections: PolicySection[] = [];
    let current: PolicySection | null = null;

    // Regex for section headings: Roman numerals like "Ⅰ、", "II、", "III、", "IⅤ、", "V、", etc.
    // Also matches: "Ⅵ、", numbered headings, and "### " markdown-style headings
    const sectionHeadingRe = /^(?:Ⅰ|Ⅱ|Ⅲ|Ⅳ|Ⅴ|Ⅵ|Ⅶ|Ⅷ|Ⅸ|Ⅹ|Ⅺ|I{1,3}V?|IV|VI{0,3}|IX|X{0,3}I{0,3}V?)[\s、\.\,]|^###\s/i;

    for (const line of lines) {
        if (sectionHeadingRe.test(line)) {
            // This is a section heading
            if (current) sections.push(current);
            // Remove the Roman numeral prefix to get the title
            const title = line
                .replace(/^(?:Ⅰ|Ⅱ|Ⅲ|Ⅳ|Ⅴ|Ⅵ|Ⅶ|Ⅷ|Ⅸ|Ⅹ|Ⅺ|I{1,3}V?|IV|VI{0,3}|IX|X{0,3}I{0,3}V?)[\s、\.\,]\s*/i, "")
                .replace(/^###\s*/, "")
                .trim();
            const cleanTitle = stripEmoji(title);
            current = {
                title: cleanTitle || title,
                icon: getIcon(title),
                lines: [],
            };
        } else if (current) {
            current.lines.push(line);
        } else {
            // Content before first section → create a "General" section
            if (!sections.length) {
                current = {
                    title: "General Information",
                    icon: "%",
                    lines: [line],
                };
            }
        }
    }
    if (current) sections.push(current);

    return sections;
}

/**
 * Hook to get parsed policy data for all 7 shipping policy tabs.
 * Consumes data already fetched by LarkPricingProvider.
 */
export function useShippingPolicy() {
    const { sheets, loading, error, isLive } = useLarkPricingContext();

    const policies = useMemo(() => {
        if (!sheets) return null;

        const result: Record<PolicyKey, { title: string; sections: PolicySection[]; raw: any[][] }> = {} as any;

        for (const [key, gid] of Object.entries(POLICY_GIDS)) {
            const sheet = sheets[gid];
            if (sheet) {
                result[key as PolicyKey] = {
                    title: sheet.title,
                    sections: parsePolicyRows(sheet.data),
                    raw: sheet.data,
                };
            }
        }

        return Object.keys(result).length > 0 ? result : null;
    }, [sheets]);

    return { policies, loading, error, isLive };
}
