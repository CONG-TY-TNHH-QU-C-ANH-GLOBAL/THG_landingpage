import { policyTextContent, type PolicyTextBlock } from "@/data/policyTextContent";
import { AlertTriangle, Info } from "lucide-react";
import { Link } from "react-router-dom";

interface PolicyTextRendererProps {
    sectionId: string;
}

/** Render a single block */
const Block = ({ block }: { block: PolicyTextBlock }) => {
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
            <h3 className="text-[14px] font-bold text-navy mb-3 flex items-center gap-2">
                {isWarn && <AlertTriangle className="w-4 h-4 text-[#b8860b]" />}
                {isInfo && <Info className="w-4 h-4 text-[#2563eb]" />}
                {block.heading}
            </h3>
            <ul className="space-y-2">
                {block.content.map((line, i) => (
                    <li key={i} className="text-[13px] text-navy/80 leading-relaxed flex gap-2">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        <span>{line}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

/**
 * Text-based policy renderer dùng cho EN/ZH.
 * GTranslate tự dịch text Vietnamese → English/Chinese.
 */
const PolicyTextRenderer = ({ sectionId }: PolicyTextRendererProps) => {
    const section = policyTextContent[sectionId];

    if (!section) return null;

    /* Mục "Vận chuyển" → link sang page chuyên biệt */
    if (sectionId === "shipping") {
        return (
            <div className="rounded-xl border border-[#d4c9b0] bg-white p-6 text-center">
                <p className="text-[14px] text-navy mb-4">
                    Nội dung chính sách vận chuyển đã được trình bày chi tiết tại trang riêng.
                </p>
                <Link
                    to="/chinh-sach-van-chuyen"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium text-[13px] hover:opacity-90 transition-opacity"
                >
                    🚚 Xem chính sách vận chuyển chi tiết →
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-0">
            {section.blocks.map((block, i) => (
                <Block key={i} block={block} />
            ))}
        </div>
    );
};

export default PolicyTextRenderer;
