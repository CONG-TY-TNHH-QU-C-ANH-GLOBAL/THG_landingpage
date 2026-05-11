import { useI18n } from "@/lib/i18n";
import { useCmsSiteSettings } from "@/hooks/useCmsContent";

const TerminologyPanel = () => {
    const { effectiveLanguage: language } = useI18n();
    const { data: settings } = useCmsSiteSettings();
    const groups = settings?.terminology ?? [];

    return (
        <div className="bg-white border border-[var(--pricing-border)] rounded-xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-black text-navy mb-6 pb-4 border-b border-[var(--pricing-border)]">
                {language === 'vi' ? '📝 Bảng giải thích thuật ngữ' : language === 'en' ? '📝 Glossary of Terms' : '📝 术语解释表'}
            </h3>
            <p className="text-[12px] text-muted-foreground mb-8 -mt-2">
                {language === 'vi'
                    ? 'Dành cho khách hàng sử dụng dịch vụ vận chuyển quốc tế THG Fulfill · Cập nhật: Tháng 3/2026'
                    : language === 'en'
                        ? 'For customers using THG Fulfill international shipping services · Updated: March 2026'
                        : '适用于使用THG Fulfill国际运输服务的客户 · 更新：2026年3月'}
            </p>
            {groups.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm italic">
                    {language === 'vi'
                        ? 'Bảng thuật ngữ đang được cập nhật...'
                        : language === 'en'
                            ? 'Terminology glossary is being updated...'
                            : '术语表正在更新中...'}
                </div>
            ) : (
                <div className="space-y-10">
                    {groups.map((group, gi) => (
                        <div key={gi}>
                            <h4 className="text-[13px] font-extrabold text-primary uppercase tracking-widest mb-4 pb-2 border-b border-[var(--pricing-border)]">
                                {group.title[language as keyof typeof group.title]}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {group.terms.map((t, ti) => (
                                    <div key={ti} className="bg-[#FAFAF8] p-5 rounded-lg border border-[#E9E9E6]">
                                        <h5 className="font-bold text-[14px] text-navy mb-2 notranslate"
                                            dangerouslySetInnerHTML={{ __html: t.term[language as keyof typeof t.term] }}
                                        />
                                        <p className="text-[12.5px] text-muted-foreground leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: t.desc[language as keyof typeof t.desc] }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-8 pt-6 border-t border-[var(--pricing-border)] text-center text-[12px] text-muted-foreground">
                {language === 'vi'
                    ? 'Cần hỗ trợ thêm? Email: info@thgfulfill.com · Hotline: 0335.124.089'
                    : language === 'en'
                        ? 'Need further assistance? Email: info@thgfulfill.com · Hotline: 0335.124.089'
                        : '需要更多帮助？邮箱：info@thgfulfill.com · 热线：0335.124.089'}
            </div>
        </div>
    );
};

export default TerminologyPanel;
