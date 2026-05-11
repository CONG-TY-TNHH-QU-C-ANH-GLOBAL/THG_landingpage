import { ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";

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
