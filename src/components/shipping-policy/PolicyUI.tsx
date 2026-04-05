import { useState } from "react";
import { ChevronDown } from "lucide-react";

/* ═══ Collapsible Section ═══ */
export const Sec = ({ icon, title, children, defaultOpen = false }: {
    icon: string; title: string; children: React.ReactNode; defaultOpen?: boolean;
}) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="bg-white border border-[var(--pricing-border)] rounded-[10px] mb-2 overflow-hidden">
            <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#fdf9f2] transition-colors cursor-pointer">
                <span className="flex items-center gap-2 text-[13px] font-semibold text-navy">
                    <span className="w-[22px] h-[22px] rounded-md flex items-center justify-center text-[12px] shrink-0">{icon}</span>
                    {title}
                </span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && <div className="px-4 pb-4 border-t border-[#f0ebe0] text-[13px] text-[#333] leading-relaxed">{children}</div>}
        </div>
    );
};

/* ═══ Alert Boxes ═══ */
export const Warn = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-[#fff8e8] border-l-[3px] border-[#c9973a] px-3 py-2 rounded-r-md text-[12px] text-[#5a4010] my-2">{children}</div>
);
export const Note = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-[#f0f4ff] border-l-[3px] border-[#3a6aaa] px-3 py-2 rounded-r-md text-[12px] text-[#1a3a6a] my-2">{children}</div>
);
export const Danger = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-[#fff0f0] border-l-[3px] border-[#c93a3a] px-3 py-2 rounded-r-md text-[12px] text-[#5a1010] my-2">{children}</div>
);

/* ═══ Sub-section Title ═══ */
export const SubTitle = ({ children }: { children: React.ReactNode }) => (
    <div className="text-[12px] font-semibold text-primary uppercase tracking-[0.4px] mt-3 mb-1.5">{children}</div>
);

/* ═══ Policy Table ═══ */
export const PT = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
    <table className="w-full text-[12px] border-collapse my-2">
        <thead>
            <tr>{headers.map((h, i) => <th key={i} className="text-left px-2 py-1.5 bg-[#f5f0e8] font-semibold text-[#4a3a1a]">{h}</th>)}</tr>
        </thead>
        <tbody>
            {rows.map((r, i) => (
                <tr key={i}>{r.map((c, j) => <td key={j} className="px-2 py-1.5 border-b border-[#ede5d5] align-top" dangerouslySetInnerHTML={{ __html: c }} />)}</tr>
            ))}
        </tbody>
    </table>
);

/* ═══ Route Badge ═══ */
export const RouteBadge = ({ children, color }: { children: string; color: string }) => (
    <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded mb-3 ${color}`}>{children}</span>
);
