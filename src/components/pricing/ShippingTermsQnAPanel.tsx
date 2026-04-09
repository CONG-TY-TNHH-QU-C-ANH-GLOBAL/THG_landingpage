import { ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import larkPoliciesI18n from "@/data/larkPoliciesI18n.json";

/* ─── Policy Content Renderer ─── */
const renderPolicyContent = (text: string) => {
    return text.split('\n').map((line, i) => {
        if (!line.trim()) return null;
        if (line.startsWith('### ')) {
            return <strong key={i} className="block mt-5 mb-2 text-navy text-[14px] uppercase tracking-wide">{line.replace('### ', '')}</strong>;
        }
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
            <span key={i} className="block mb-2 pl-2">
                {parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j} className="text-navy font-bold">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                })}
            </span>
        );
    });
};

/* ─── Route Policy Content ─── */
export const RoutePolicyContent = ({ policies }: { policies: typeof larkPoliciesI18n }) => {
    const { effectiveLanguage: language } = useI18n();

    const headerTitle = language === 'vi' ? 'Chính sách vận chuyển (Shipping Policies)'
        : language === 'zh' ? '运输政策 (Shipping Policies)' : 'Shipping Policies';
    const headerDesc = language === 'vi' ? 'Các điều khoản và chính sách áp dụng cho tuyến vận chuyển này.'
        : language === 'zh' ? '适用于此运输路线的条款和政策。' : 'Terms and policies applicable to this shipping route.';
    const policyPrefix = language === 'vi' ? 'Điều khoản tuyến'
        : language === 'zh' ? '路线条款' : 'Route Terms';

    return (
        <div className="flex flex-col gap-2.5 pb-2">
            <div className="bg-[#F7F5F0] border border-[var(--pricing-border)] rounded-xl px-4 py-3 mb-2 flex gap-3 text-[13px]">
                <span className="text-xl">🛡️</span>
                <div>
                    <strong className="text-navy block mb-1 notranslate" translate="no">{headerTitle}</strong>
                    <p className="text-muted-foreground notranslate" translate="no">{headerDesc}</p>
                </div>
            </div>
            {policies.map((item, idx) => {
                const content = language === 'vi'
                    ? (item.content?.vi || item.content?.en || '')
                    : (item.content?.en || '');
                const langAttr = language === 'zh' ? 'en' : language;
                const rawTitle = item.title?.vi || item.title?.en || '';
                let cleanTitle = rawTitle
                    .replace(/^Điều khoản tuyến\s*/i, '')
                    .replace(/^Policy\s*/i, '');
                if (language === 'en') {
                    cleanTitle = cleanTitle
                        .replace(/\(Hàng Thường\)/gi, '(Regular Goods)')
                        .replace(/\(Mỹ Phẩm\)/gi, '(Cosmetics)')
                        .replace(/\(Pin\)/gi, '(Batteries)');
                } else if (language === 'zh') {
                    cleanTitle = cleanTitle
                        .replace(/\(Hàng Thường\)/gi, '(普通货物)')
                        .replace(/\(Mỹ Phẩm\)/gi, '(化妆品)')
                        .replace(/\(Pin\)/gi, '(电池)');
                }
                return (
                    <details key={"policy-" + idx} className="group bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden" open={policies.length === 1}>
                        <summary className="flex items-center justify-between cursor-pointer px-5 py-4 font-bold text-[13px] md:text-[14px] text-navy hover:text-primary transition-colors">
                            <span className="flex items-start gap-3">
                                <span className="flex items-center justify-center w-[22px] h-[22px] mt-0.5 shrink-0 rounded-full bg-[#1A2E44] text-white text-[12px] font-black">{idx + 1}</span>
                                <span className="leading-snug notranslate" translate="no">{policyPrefix} {cleanTitle}</span>
                            </span>
                            <span className="transition-transform duration-300 group-open:-rotate-180 shrink-0 ml-4">
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </span>
                        </summary>
                        <div lang={langAttr} translate="yes" className="px-[52px] pb-6 text-[13px] text-navy/80 font-medium leading-relaxed border-t border-[var(--pricing-border)]/30 mt-1 pt-3">
                            {renderPolicyContent(content)}
                        </div>
                    </details>
                );
            })}
        </div>
    );
};

/* ─── Shipping Terms Q&A Panel ─── */
const FAQ_COUNT = 14;

const ShippingTermsQnAPanel = () => {
    const { t } = useI18n();

    const qnaList = Array.from({ length: FAQ_COUNT }, (_, i) => ({
        q: t(`ship_faq.q${i + 1}`),
        a: t(`ship_faq.a${i + 1}`),
    }));

    return (
        <div className="flex flex-col gap-2.5 pb-2">
            <div className="bg-[#F7F5F0] border border-[var(--pricing-border)] rounded-xl px-4 py-3 mb-2 flex gap-3 text-[13px]">
                <span className="text-xl">📄</span>
                <div>
                    <strong className="text-navy block mb-1 notranslate" translate="no">{t('ship_faq.header_title')}</strong>
                    <p className="text-muted-foreground notranslate" translate="no">{t('ship_faq.header_desc')}</p>
                </div>
            </div>
            {qnaList.map((item, index) => (
                <details key={index} className="group bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between cursor-pointer px-5 py-4 font-bold text-[13px] md:text-[14px] text-navy hover:text-primary transition-colors">
                        <span className="flex items-start gap-3">
                            <span className="flex items-center justify-center w-[22px] h-[22px] mt-0.5 shrink-0 rounded-full bg-primary/10 text-primary text-[12px] font-black">{index + 1}</span>
                            <span className="leading-snug notranslate" translate="no">{item.q}</span>
                        </span>
                        <span className="transition-transform duration-300 group-open:-rotate-180 shrink-0 ml-4">
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </span>
                    </summary>
                    <div className="px-[52px] pb-4 text-[14px] text-navy/80 font-medium leading-relaxed whitespace-pre-line border-t border-[var(--pricing-border)]/30 mt-1 pt-3 notranslate" translate="no">
                        {item.a}
                    </div>
                </details>
            ))}
        </div>
    );
};

export default ShippingTermsQnAPanel;
