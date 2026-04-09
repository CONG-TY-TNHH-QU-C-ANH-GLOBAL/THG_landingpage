import { useI18n } from "@/lib/i18n";
import { countryNames, CARGO_LABELS, type CargoType } from "@/components/pricing/types";

interface SearchWidgetProps {
    searchFrom: string;
    setSearchFrom: (v: string) => void;
    searchTo: string;
    setSearchTo: (v: string) => void;
    searchSvc: string;
    setSearchSvc: (v: string) => void;
    searchCargo: string;
    setSearchCargo: (v: string) => void;
    searchWeight: number;
    setSearchWeight: (v: number) => void;
    showResult: boolean;
    handleSearch: () => void;
    searchCountries: { key: string; label: string }[];
    estimatedPrice: any;
    searchTrigger: number;
}

const SearchWidget = ({
    searchFrom, setSearchFrom,
    searchTo, setSearchTo,
    searchSvc, setSearchSvc,
    searchCargo, setSearchCargo,
    searchWeight, setSearchWeight,
    showResult, handleSearch,
    searchCountries, estimatedPrice, searchTrigger,
}: SearchWidgetProps) => {
    const { t, tVi, effectiveLanguage: lang } = useI18n();
    const getCargoLabel = (c: CargoType) => CARGO_LABELS[c]?.[lang] || CARGO_LABELS[c]?.vi || c;

    const selectClass = "w-full h-[40px] sm:h-[46px] bg-white border border-[var(--pricing-border)] rounded-lg px-3 sm:px-4 text-[13px] sm:text-sm font-medium outline-none focus:border-gold transition-colors appearance-none cursor-pointer";

    return (
        <>
            {/* ──── SEARCH WIDGET ──── */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 mb-4 sm:mb-10 border border-[var(--pricing-border)] overflow-visible shadow-lg shadow-black/5 relative z-20">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:flex gap-2 sm:gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase mb-1 sm:mb-2 tracking-widest">{tVi("pricing.search_from")}</label>
                        <select value={searchFrom} onChange={(e) => setSearchFrom(e.target.value)} className={selectClass}>
                            <option value="VN">{tVi("pricing.opt_vn")}</option>
                            <option value="CN">{tVi("pricing.opt_cn")}</option>
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="block text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase mb-1 sm:mb-2 tracking-widest">{tVi("pricing.search_to")}</label>
                        <select value={searchTo} onChange={(e) => setSearchTo(e.target.value)} className={selectClass}>
                            <option value="ALL">{tVi("pricing.opt_all")}</option>
                            {searchCountries.map((col: any) => (
                                <option key={col.key} value={col.key.toUpperCase()}>{col.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="block text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase mb-1 sm:mb-2 tracking-widest">{tVi("pricing.search_svc")}</label>
                        <select value={searchSvc} onChange={(e) => setSearchSvc(e.target.value)} className={selectClass}>
                            <option value="epacket">{tVi("pricing.svc_epa")}</option>
                            <option value="express">{tVi("pricing.svc_exp")}</option>
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="block text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase mb-1 sm:mb-2 tracking-widest">{tVi("pricing.search_cargo")}</label>
                        <select
                            value={searchCargo} onChange={(e) => setSearchCargo(e.target.value)}
                            className={`${selectClass} notranslate`}
                            translate="no"
                        >
                            <option value="standard">{getCargoLabel("standard")}</option>
                            <option value="cosmetic">{getCargoLabel("cosmetics")}</option>
                            <option value="battery">{getCargoLabel("battery")}</option>
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="block text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase mb-1 sm:mb-2 tracking-widest">{tVi("pricing.search_weight")}</label>
                        <input
                            type="number" value={searchWeight} onChange={(e) => setSearchWeight(e.target.value ? Number(e.target.value) : 1)} min="0.1" step="0.5"
                            placeholder={t("pricing_sw.placeholder")}
                            className="w-full h-[40px] sm:h-[46px] bg-white border border-[var(--pricing-border)] rounded-lg px-3 sm:px-4 text-[13px] sm:text-sm font-medium outline-none focus:border-gold transition-colors"
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1 w-full lg:w-auto mt-1 sm:mt-0">
                        <button
                            onClick={handleSearch}
                            className="w-full lg:w-[130px] h-[40px] sm:h-[46px] bg-[#161B29] hover:bg-[#1f2638] text-white rounded-lg text-[13px] font-bold tracking-wide transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="text-[#8B5CF6] text-lg">🔍</span> {tVi("pricing.search_btn")}
                        </button>
                    </div>
                </div>
            </div>

            {/* Display Search Results */}
            {showResult && (
                <div key={searchTrigger} className="mb-4 sm:mb-10 bg-white border-[1.5px] border-[var(--pricing-border)] border-dashed rounded-xl p-3 sm:p-6 shadow-sm overflow-hidden animate-fade-in relative z-10 mx-auto max-w-[1000px]">
                    <div className="flex flex-col md:flex-row gap-4 sm:gap-6 justify-between items-center">
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-block bg-[rgba(184,146,42,0.15)] text-[#B8922A] text-[11px] sm:text-[12px] font-bold tracking-[0.1em] px-3 py-1 rounded-full uppercase mb-3 sm:mb-4">
                                {tVi("pricing.res_title")} · {searchSvc === 'epacket' ? tVi("pricing.svc_epa") : tVi("pricing.svc_exp")}
                            </div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-navy flex items-center justify-center md:justify-start gap-2 sm:gap-3">
                                {searchFrom === 'VN' ? tVi("pricing.opt_vn") : tVi("pricing.opt_cn")}
                                <span className="text-gray-400">✈️</span>
                                {searchTo === 'ALL' ? tVi("pricing.opt_all") : (countryNames[searchTo.toLowerCase()] || searchTo.toUpperCase())}
                            </h3>
                            <div className="mt-2 sm:mt-3 flex justify-center md:justify-start gap-3 sm:gap-4 text-[13px] sm:text-sm text-muted-foreground font-medium">
                                <span className="flex items-center gap-1.5"><span className="text-navy">⚖️</span> {searchWeight} KG</span>
                                <span className="flex items-center gap-1.5"><span className="text-navy">⏱</span> {tVi("pricing.res_days")}</span>
                            </div>
                        </div>
                        <div className="bg-[#FAFAF8] border border-[var(--pricing-border)] rounded-lg p-4 sm:p-5 min-w-[200px] sm:min-w-[240px] text-center shadow-sm flex flex-col justify-center">
                            {estimatedPrice?.error ? (
                                <div className="text-red-500 font-bold text-[13px]">{estimatedPrice.error}</div>
                            ) : estimatedPrice?.type === "contact" ? (
                                <div className="text-primary font-bold text-base sm:text-lg">{estimatedPrice.text}</div>
                            ) : (
                                <>
                                    <div className="text-[11px] sm:text-[12px] font-bold text-muted-foreground uppercase tracking-[0.1em] mb-1">{tVi("pricing.res_base")}</div>
                                    <div className="text-2xl sm:text-3xl font-black text-navy drop-shadow-sm"><span className="text-gold text-xl sm:text-2xl align-top mr-1 font-bold"></span>{estimatedPrice?.text}</div>
                                    <div className="text-[10px] sm:text-[11px] text-muted-foreground mt-2 italic">{tVi("pricing.res_note")}</div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SearchWidget;
