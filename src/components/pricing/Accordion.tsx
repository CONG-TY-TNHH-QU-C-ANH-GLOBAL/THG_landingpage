import { useState } from "react";
import { ChevronDown } from "lucide-react";

const Accordion = ({ icon, title, defaultOpen = false, children }: { icon: string; title: string; defaultOpen?: boolean; children: React.ReactNode }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden shadow-sm">
            <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#FAFAF8] transition-colors">
                <span className="flex items-center gap-2.5 font-bold text-sm text-navy">
                    <span className="text-lg">{icon}</span> {title}
                </span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>
            {open && <div className="border-t border-[var(--pricing-border)] px-5 py-4">{children}</div>}
        </div>
    );
};

export default Accordion;
