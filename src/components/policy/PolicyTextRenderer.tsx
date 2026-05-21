import { AlertTriangle, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useCmsPolicy } from "@/hooks/useCmsContent";
import type { CmsPolicyTextBlock } from "@/lib/cmsClient";

interface PolicyTextRendererProps {
    sectionId: string;
}

/** Render a single block (heading + bullet list). */
const Block = ({ block }: { block: CmsPolicyTextBlock }) => {
    const isWarn = block.type === "warn";
    const isInfo = block.type === "info";

    return (
        <div
            className={`rounded-xl border p-5 mb-4 ${isWarn
                ? "border-[#e8c06a] bg-[#fdf6e8]"
                : isInfo
                    ? "border-[#93c5fd] bg-[#eff6ff]"
                    : "border-[#d4c9b0] bg-white"
                }`}
        >
            <h3 className="text-[14px] font-bold text-navy mb-3 flex items-center gap-2 notranslate" translate="no">
                {isWarn && <AlertTriangle className="w-4 h-4 text-[#b8860b]" />}
                {isInfo && <Info className="w-4 h-4 text-[#2563eb]" />}
                {block.heading}
            </h3>
            <ul className="space-y-2">
                {block.content.map((line, i) => (
                    <li key={i} className="text-[13px] text-navy/80 leading-relaxed flex gap-2">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        <span className="notranslate" translate="no">{line}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

/**
 * Text-based policy renderer — fetches text_blocks from CMS per slug+locale.
 *
 * Special-case: section "shipping" always renders a redirect button to the
 * dedicated /shipping-policy page (regardless of CMS content).
 */
const PolicyTextRenderer = ({ sectionId }: PolicyTextRendererProps) => {
    const { effectiveLanguage, language } = useI18n();
    const lang = effectiveLanguage as "en" | "vi" | "zh";
    const cmsLang = language;

    // Always call the hook to satisfy rules-of-hooks; the `enabled` flag below
    // skips the request when we're rendering the shipping shortcut instead.
    const isShipping = sectionId === "shipping";
    const { data, isLoading, error } = useCmsPolicy(isShipping ? "" : sectionId, cmsLang);

    if (isShipping) {
        const desc = lang === "vi"
            ? "Nội dung chính sách vận chuyển đã được trình bày chi tiết tại trang riêng."
            : lang === "zh"
                ? "详细的运输政策内容已在专用页面展示。"
                : "Detailed shipping policy content is available on the dedicated page.";
        const btnText = lang === "vi"
            ? "🚚 Xem chính sách vận chuyển chi tiết →"
            : lang === "zh"
                ? "🚚 查看详细运输政策 →"
                : "🚚 View detailed shipping policy →";
        return (
            <div className="rounded-xl border border-[#d4c9b0] bg-white p-6 text-center">
                <p className="text-[14px] text-navy mb-4 notranslate" translate="no">
                    {desc}
                </p>
                <Link
                    to="/shipping-policy"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium text-[13px] hover:opacity-90 transition-opacity notranslate"
                    translate="no"
                >
                    {btnText}
                </Link>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="py-8 text-center text-muted-foreground text-sm">
                Đang tải nội dung...
            </div>
        );
    }

    const blocks = data?.policy?.text_blocks ?? [];
    if (error || blocks.length === 0) {
        return (
            <div className="py-8 text-center text-muted-foreground text-sm">
                Nội dung chính sách này chưa có. Vận hành cập nhật trong CMS.
            </div>
        );
    }

    return (
        <div className="space-y-0">
            {blocks.map((block, i) => (
                <Block key={i} block={block} />
            ))}
        </div>
    );
};

export default PolicyTextRenderer;
