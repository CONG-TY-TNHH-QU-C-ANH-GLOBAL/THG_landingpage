import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowUpDown, RefreshCw, TrendingUp } from "lucide-react";

/* ─── Currency definitions ─── */
const CURRENCIES = [
    { code: "USD", labelVi: "Đô la Mỹ", flag: "us" },
    { code: "EUR", labelVi: "Euro", flag: "eu" },
    { code: "AUD", labelVi: "Đô la Úc", flag: "au" },
    { code: "GBP", labelVi: "Bảng Anh", flag: "gb" },
    { code: "CNY", labelVi: "Nhân dân tệ", flag: "cn" },
    { code: "VND", labelVi: "Việt Nam Đồng", flag: "vn" },
];

const flagUrl = (code: string) => `https://flagcdn.com/w40/${code}.png`;

/* ─── Custom dropdown (no <select> so Google Translate won't touch it) ─── */
function CurrencyDropdown({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (code: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const selected = CURRENCIES.find((c) => c.code === value)!;

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                {label}
            </span>
            <div ref={ref} className="relative">
                {/* Trigger */}
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    className="flex items-center gap-2 border border-[var(--pricing-border)] rounded-xl px-3 py-2 bg-[#FAFAF8] w-full min-w-[130px] hover:border-primary/40 transition-colors"
                >
                    <img
                        src={flagUrl(selected.flag)}
                        alt={selected.code}
                        className="w-7 h-5 rounded object-cover shadow-sm flex-shrink-0"
                    />
                    <span className="notranslate font-bold text-[14px] text-navy flex-1 text-left" translate="no">
                        {selected.code}
                    </span>
                    <svg className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Dropdown panel */}
                {open && (
                    <div className="absolute z-50 mt-1 w-[190px] bg-white border border-[var(--pricing-border)] rounded-xl shadow-xl overflow-hidden">
                        {CURRENCIES.map((c) => (
                            <button
                                key={c.code}
                                type="button"
                                onClick={() => { onChange(c.code); setOpen(false); }}
                                className={`flex items-center gap-2.5 px-3 py-2.5 w-full text-left hover:bg-[#FFFBF0] transition-colors ${c.code === value ? "bg-primary/5 font-bold" : ""}`}
                            >
                                <img src={flagUrl(c.flag)} alt={c.code} className="w-7 h-5 rounded object-cover shadow-sm flex-shrink-0" />
                                <span className="notranslate font-semibold text-[13px] text-navy" translate="no">{c.code}</span>
                                <span className="text-[12px] text-muted-foreground truncate">{c.labelVi}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── Main Widget ─── */
export default function CurrencyConverter() {
    const [from, setFrom] = useState("USD");
    const [to, setTo] = useState("VND");
    const [amount, setAmount] = useState<number>(1);
    const [result, setResult] = useState<number | null>(null);
    const [rate, setRate] = useState<number | null>(null);
    const [lastUpdate, setLastUpdate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const fetchRate = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
            const data = await res.json();
            if (data.result === "success") {
                const r: number = data.rates[to];
                setRate(r);
                setResult(amount * r);
                const d = new Date(data.time_last_update_utc);
                setLastUpdate(
                    `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`
                );
            } else {
                setError(true);
            }
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [from, to, amount]);

    useEffect(() => { fetchRate(); }, [fetchRate]);

    const handleSwap = () => { setFrom(to); setTo(from); };

    const fmt = (val: number, cur: string) =>
        cur === "VND"
            ? val.toLocaleString("vi-VN", { maximumFractionDigits: 0 })
            : val.toLocaleString("vi-VN", { minimumFractionDigits: 2, maximumFractionDigits: 4 });

    return (
        <div className="bg-white border border-[var(--pricing-border)] rounded-2xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1A2238] to-[#2C3E6B] px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp size={15} className="text-yellow-300" />
                    <span className="text-white font-bold text-[13px] tracking-wide notranslate" translate="no">
                        Quy Đổi Tỷ Giá Real-time
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    {lastUpdate && (
                        <span className="text-white/50 text-[11px] hidden sm:block notranslate" translate="no">
                            Cập nhật: {lastUpdate}
                        </span>
                    )}
                    <button
                        onClick={fetchRate}
                        disabled={loading}
                        className={`p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white ${loading ? "animate-spin" : ""}`}
                        title="Làm mới tỷ giá"
                    >
                        <RefreshCw size={13} />
                    </button>
                    {/* "Live" wrapped in notranslate */}
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-green-300 notranslate" translate="no">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
                        Live
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5">
                <div className="flex flex-wrap gap-3 items-end">
                    {/* Amount */}
                    <div className="flex-1 min-w-[120px]">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Số tiền
                        </span>
                        <input
                            type="number"
                            value={amount}
                            min={0}
                            step="any"
                            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                            className="w-full border border-[var(--pricing-border)] rounded-xl px-4 py-[9px] text-[15px] font-bold text-navy bg-[#FAFAF8] focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                    </div>

                    {/* From */}
                    <CurrencyDropdown label="Từ" value={from} onChange={setFrom} />

                    {/* Swap button */}
                    <div className="flex flex-col justify-end pb-0.5">
                        <button
                            onClick={handleSwap}
                            className="bg-primary text-white p-2 rounded-full hover:opacity-80 transition-all hover:rotate-180 duration-300 shadow-md"
                            title="Hoán đổi"
                        >
                            <ArrowUpDown size={16} />
                        </button>
                    </div>

                    {/* To */}
                    <CurrencyDropdown label="Sang" value={to} onChange={setTo} />

                    {/* Result */}
                    <div className="flex-1 min-w-[140px]">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Kết quả
                        </span>
                        <div className="border border-primary/30 bg-primary/5 rounded-xl px-4 py-[9px] min-h-[42px] flex items-center">
                            {loading ? (
                                <span className="text-muted-foreground text-[13px] animate-pulse">Đang tải...</span>
                            ) : error ? (
                                <span className="text-red-500 text-[12px]">Lỗi kết nối</span>
                            ) : result !== null ? (
                                <span className="font-extrabold text-[15px] text-primary whitespace-nowrap notranslate" translate="no">
                                    {fmt(result, to)} <span className="text-[12px] opacity-70">{to}</span>
                                </span>
                            ) : (
                                <span className="text-muted-foreground">—</span>
                            )}
                        </div>
                        {rate !== null && !error && !loading && (
                            <p className="text-[11px] text-muted-foreground mt-1 px-1 notranslate" translate="no">
                                1 {from} ≈ {rate.toLocaleString("vi-VN", { maximumFractionDigits: 4 })} {to}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
