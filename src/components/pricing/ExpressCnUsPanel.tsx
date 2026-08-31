import { useI18n } from "@/lib/i18n";
import { LeadFormDialog } from "@/components/lead/LeadFormDialog";
import CnUsRateCard from "@/components/pricing/CnUsRateCard";

interface ExpressCnUsPanelProps {
    route: string;
}

const ExpressCnUsPanel = (_: ExpressCnUsPanelProps) => {
    const { t } = useI18n();

    return (
        <div>
            <CnUsRateCard />

            {/* Post-table CN-US — Express policy notice */}
            <div className="bg-[#F0F7FF] border border-blue-200 rounded-xl p-5 mt-6 text-center">
                <p className="text-[14px] font-semibold text-navy mb-1">
                    {t("evn.express_policy")}
                </p>
                <p className="text-[12px] text-muted-foreground">
                    {t("evn.express_note")}
                </p>
            </div>

            <div className="text-center mt-5">
                <LeadFormDialog
                    sourcePage="/international-pricing#express-cn-us"
                    trigger={
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-gold-dark text-white rounded-lg px-7 py-3 font-bold text-sm transition-all shadow-lg"
                        >
                            {t("ecn.contact_btn")}
                        </button>
                    }
                />
            </div>
        </div>
    );
};

export default ExpressCnUsPanel;
