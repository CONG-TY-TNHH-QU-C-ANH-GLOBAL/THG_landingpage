import { Sec, Warn, RouteBadge } from "./PolicyUI";
import { useI18n } from "@/lib/i18n";
import larkPoliciesI18n from "@/data/larkPoliciesI18n.json";

const POLICY_ID = "7RqdMQ"; // THPHR — CN → WW Regular

/* ─── Vietnamese → English cleanup map for the EN field ─── */
const VI_TO_EN: [string, string][] = [
    // Section headings
    ["### ⚖️ Trọng lượng tính cước", "### ⚖️ Chargeable Weight"],
    ["### ⚖️ Giới hạn trọng lượng", "### ⚖️ Weight Limits"],
    ["### 💵 Giá trị khai báo & Ghi chú", "### 💵 Declared Value & Notes"],
    ["### 📍 Yêu cầu địa chỉ nhận hàng", "### 📍 Delivery Address Requirements"],
    ["### 🛡️ Tiêu chuẩn bồi thường", "### 🛡️ Compensation Standards"],
    ["### 📌 Yêu cầu khác", "### 📌 Other Requirements"],
    // Country names
    ["🇯🇵 Nhật Bản", "🇯🇵 Japan"],
    ["🇺🇸 Mỹ:", "🇺🇸 USA:"],
    ["🇺🇸 Mỹ,", "🇺🇸 USA,"],
    ["🇳🇴 Na Uy", "🇳🇴 Norway"],
    ["🇦🇺 Úc", "🇦🇺 Australia"],
    ["🇨🇭 Thụy Sĩ", "🇨🇭 Switzerland"],
    ["🇸🇦 Ả Rập Xê Út", "🇸🇦 Saudi Arabia"],
    ["🇫🇷 Pháp", "🇫🇷 France"],
    // Opening sentence
    ["**Từ 26/06/2021, KHÔNG thu VAT nếu có xuất trình IOSS hợp lệ.**",
        "**Effective 26/06/2021: THG will NOT collect VAT if a valid IOSS number is provided.**"],
];

/** Replace Vietnamese strings in EN content (ES2020 safe — no replaceAll) */
function cleanEn(text: string): string {
    let r = text;
    for (const [vi, en] of VI_TO_EN) {
        while (r.indexOf(vi) !== -1) r = r.replace(vi, en);
    }
    return r;
}

/** Map heading text → icon for Sec */
const ICON_RULES: [RegExp, string][] = [
    [/VAT|IOSS|THÔNG TIN CHUNG/i, "%"],
    [/Chargeable Weight|Trọng lượng tính cước/i, "⚖"],
    [/Weight Limits|Giới hạn trọng lượng/i, "⚖"],
    [/Countries|Serviceable|QUỐC GIA/i, "🌍"],
    [/Declared Value|Giá trị khai báo/i, "$"],
    [/Cargo|lô hàng/i, "📦"],
    [/Size|Kích thước/i, "📏"],
    [/Address|Địa chỉ/i, "📍"],
    [/Returns|Trả hàng|Re-?Delivery|Giao lại/i, "↩"],
    [/Compensation|Bồi thường/i, "🛡"],
    [/Other|Yêu cầu khác/i, "📌"],
    [/Tracking|Tra cứu/i, "🔍"],
    [/Force Majeure|Bất khả kháng/i, "⚡"],
    [/Lưu ý|Special Note|Điều kiện miễn trừ/i, "⚠"],
];

/** Strip leading emoji & whitespace from a heading title */
function stripEmoji(title: string): string {
    // Remove leading emoji (unicode ranges) + variation selectors + whitespace
    return title.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}%$⚖️🌍📦📏📍🛡📌🔍⚡⚠↩💵💠🔄\s]+/u, "").trim();
}

function getIcon(title: string): string {
    for (const [re, icon] of ICON_RULES) {
        if (re.test(title)) return icon;
    }
    return "📋";
}

/** Render content lines within a section */
const SectionContent = ({ lines }: { lines: string[] }) => (
    <div className="space-y-1.5 mt-1">
        {lines.map((line, i) => {
            const t = line.trim();
            if (!t) return <div key={i} className="h-1" />;

            // Warning line (⚠ / ❌)
            if (t.startsWith("⚠") || t.startsWith("❌")) {
                return <Warn key={i}>{t}</Warn>;
            }

            // Bullet point (• or -)
            if (t.startsWith("•") || t.startsWith("- ")) {
                const text = t.replace(/^[•\-]\s*/, "");
                return (
                    <div key={i} className="flex gap-2 text-[12px] text-navy/80 leading-relaxed pl-1">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        <span dangerouslySetInnerHTML={{
                            __html: text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                        }} />
                    </div>
                );
            }

            // Numbered items
            if (/^[\(（]?\d+[\)）]|^[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭]/.test(t)) {
                return (
                    <div key={i} className="text-[12px] text-navy/80 leading-relaxed pl-4">
                        <span dangerouslySetInnerHTML={{
                            __html: t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                        }} />
                    </div>
                );
            }

            // Bold paragraph
            if (t.startsWith("**") && t.endsWith("**")) {
                return <p key={i} className="text-[12px] font-semibold text-navy mt-1">{t.replace(/\*\*/g, "")}</p>;
            }

            // URL
            if (t.startsWith("http")) {
                return (
                    <a key={i} href={t} target="_blank" rel="noopener noreferrer"
                        className="text-[11px] text-primary underline break-all pl-1 block">{t}</a>
                );
            }

            // Normal text
            return (
                <p key={i} className="text-[12px] text-navy/80 leading-relaxed"
                    dangerouslySetInnerHTML={{
                        __html: t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    }}
                />
            );
        })}
    </div>
);

/** Split raw content by ### headings into sections */
function parseSections(content: string): { title: string; lines: string[] }[] {
    // Fix split headings like "### Returns & Re\n-Delivery" → merge
    const fixed = content
        .replace(/### (Returns & Re)\n-Delivery/g, "### Returns & Redelivery")
        .replace(/### (Trả hàng) & (Giao lại)\n/g, "### Trả hàng & Giao lại\n");

    const allLines = fixed.split("\n");
    const sections: { title: string; lines: string[] }[] = [];
    let current: { title: string; lines: string[] } | null = null;

    for (const line of allLines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("### ")) {
            if (current) sections.push(current);
            const rawTitle = trimmed.replace(/^###\s*/, "");
            current = { title: stripEmoji(rawTitle), lines: [] };
        } else {
            if (current) {
                current.lines.push(line);
            } else {
                // Content before first ### → "General" section
                if (!sections.length && trimmed) {
                    current = { title: "VAT / IOSS", lines: [line] };
                }
            }
        }
    }
    if (current) sections.push(current);
    return sections;
}

/** Route: CN → WW · Regular (THPHR) */
const RouteCnRegular = () => {
    const { effectiveLanguage: lang } = useI18n();
    const en = lang === "en", zh = lang === "zh";

    const policy = larkPoliciesI18n.find((p: any) => p.id === POLICY_ID);
    if (!policy) return <p className="text-muted-foreground italic text-sm">Policy data not found.</p>;

    let content: string = (policy.content as any)?.[lang] || (policy.content as any)?.en || "";

    // Clean up Vietnamese strings mixed into the EN field
    if (lang === "en") content = cleanEn(content);

    const sections = parseSections(content);

    return (
        <div>
            <RouteBadge color="bg-[#e8f5e9] text-[#2e7d32]">
                {en ? "China → Worldwide · Regular" : zh ? "中国 → 全球 · 普通货物" : "Trung Quốc → Toàn Cầu · Hàng Thường"}
            </RouteBadge>

            {sections.map((sec, i) => (
                <Sec key={i} icon={getIcon(sec.title)} title={sec.title} defaultOpen={i === 0}>
                    <SectionContent lines={sec.lines} />
                </Sec>
            ))}
        </div>
    );
};

export default RouteCnRegular;
