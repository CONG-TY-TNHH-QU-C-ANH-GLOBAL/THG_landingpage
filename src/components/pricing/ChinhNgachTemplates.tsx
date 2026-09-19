import { useState } from "react";
import { ChevronDown, Download } from "lucide-react";

import {
    DOC_ASSET_BASE,
    DOC_TEMPLATES,
    type DocTemplate,
    type TemplateBlock,
    type Tone,
} from "@/data/chinhNgachTemplates";
import { RichText } from "@/components/pricing/RichText";
import { trackEvent } from "@/lib/analytics";

const TONES: Record<Tone, string> = {
    green: "bg-emerald-50 border-emerald-200",
    amber: "bg-amber-50 border-amber-200",
    blue: "bg-blue-50 border-blue-200",
    red: "bg-rose-50 border-rose-200",
    gray: "bg-[#FAFAF8] border-[var(--pricing-border)]",
    plain: "bg-[#FAFAF8] border-[var(--pricing-border)]",
};

/** The customs lanes keep the sheet's own Vietnamese class names, because the
 *  colour IS the meaning here: green clears immediately, red is a physical
 *  inspection. Mapping them to the generic tones would lose that. */
const LANE_TONES: Record<string, string> = {
    xanh: "bg-emerald-50 border-emerald-200",
    vang: "bg-amber-50 border-amber-200",
    do: "bg-rose-50 border-rose-200",
};

function SectionTitle({ children }: Readonly<{ children: string }>) {
    if (!children) return null;
    return <p className="text-[13px] font-bold text-navy mb-2">{children}</p>;
}

function Block({ block, templateId }: Readonly<{ block: TemplateBlock; templateId: string }>) {
    switch (block.kind) {
        case "prose":
            return (
                <div>
                    <SectionTitle>{block.title}</SectionTitle>
                    {block.paras.map((p, i) => (
                        <p key={i} className="text-[13px] text-foreground/80 leading-relaxed mb-2 last:mb-0">
                            <RichText html={p} />
                        </p>
                    ))}
                </div>
            );

        case "facts":
            return (
                <dl className="grid gap-2 sm:grid-cols-2">
                    {block.items.map((f) => (
                        <div key={f.label} className="bg-[#FAFAF8] border border-[var(--pricing-border)] rounded-lg px-3 py-2">
                            <dt className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{f.label}</dt>
                            <dd className="text-[12.5px] text-foreground/80 mt-0.5">{f.value}</dd>
                        </div>
                    ))}
                </dl>
            );

        case "columns":
            return (
                <div>
                    <SectionTitle>{block.title}</SectionTitle>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {block.boxes.map((box) => (
                            <div key={box.heading} className={`rounded-lg border p-3 ${TONES[box.tone] ?? TONES.plain}`}>
                                <p className="text-[12.5px] font-bold text-navy mb-1.5">{box.heading}</p>
                                <ul className="space-y-1">
                                    {box.items.map((it) => (
                                        <li key={it} className="text-[12.5px] text-foreground/80 leading-snug pl-3 relative">
                                            <span className="absolute left-0 top-[0.55em] w-1 h-1 rounded-full bg-muted-foreground" aria-hidden="true" />
                                            {it}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            );

        case "steps":
            return (
                <div>
                    <SectionTitle>{block.title}</SectionTitle>
                    <ol className="space-y-2">
                        {block.items.map((s) => (
                            <li key={s.n} className="flex gap-3">
                                <span className="w-6 h-6 rounded-lg bg-primary/15 text-primary text-[11px] font-bold grid place-items-center flex-shrink-0 mt-0.5">
                                    {s.n}
                                </span>
                                <span>
                                    <span className="block text-[12.5px] font-bold text-navy">{s.heading}</span>
                                    <span className="block text-[12.5px] text-foreground/80 leading-snug">{s.body}</span>
                                </span>
                            </li>
                        ))}
                    </ol>
                </div>
            );

        case "lanes":
            return (
                <div>
                    <SectionTitle>{block.title}</SectionTitle>
                    <div className="grid gap-2 sm:grid-cols-3">
                        {block.items.map((lane) => (
                            <div key={lane.name} className={`rounded-lg border p-3 ${LANE_TONES[lane.tone] ?? TONES.plain}`}>
                                <p className="text-[12.5px] font-bold text-navy">{lane.name}</p>
                                <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mt-0.5">{lane.tag}</p>
                                <p className="text-[12px] text-foreground/80 leading-snug mt-1">{lane.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );

        case "callout":
            return (
                <p className={`text-[12.5px] text-foreground/85 leading-relaxed rounded-lg border px-3 py-2 ${TONES[block.tone] ?? TONES.plain}`}>
                    <RichText html={block.html} />
                </p>
            );

        case "files":
            return (
                <div>
                    <SectionTitle>{block.title}</SectionTitle>
                    {block.note && <p className="text-[12.5px] text-muted-foreground mb-2 leading-relaxed">{block.note}</p>}
                    <div className="flex flex-wrap gap-2">
                        {block.files.map((f) => (
                            <a
                                key={f.file}
                                href={`${DOC_ASSET_BASE}${f.file}`}
                                download={f.file}
                                onClick={() => trackEvent("download_template", { template: templateId, file: f.file })}
                                className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-navy bg-white border border-[var(--pricing-border)] rounded-lg px-3 py-2 hover:bg-[#FFFBF0] hover:border-primary/40 transition-colors"
                            >
                                <Download className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                                {f.label.replace(/^[^\p{L}\p{N}]+/u, "")}
                            </a>
                        ))}
                    </div>
                    {block.footer && (
                        <p className="text-[12px] text-muted-foreground mt-2 leading-relaxed">
                            <RichText html={block.footer} />
                        </p>
                    )}
                </div>
            );

        default:
            return null;
    }
}

function TemplateCard({ tpl, open, onToggle }: Readonly<{
    tpl: DocTemplate; open: boolean; onToggle: () => void;
}>) {
    return (
        <div className="bg-white border border-[var(--pricing-border)] rounded-xl overflow-hidden">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[#FFFBF0] transition-colors"
            >
                <span className="text-xl flex-shrink-0" aria-hidden="true">{tpl.icon}</span>
                <span className="flex-1 min-w-0">
                    <span className="block text-[14px] font-bold text-navy">{tpl.title}</span>
                    <span className="block text-[12.5px] text-muted-foreground">{tpl.sub}</span>
                </span>
                <ChevronDown
                    className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                    aria-hidden="true"
                />
            </button>
            {open && (
                <div className="px-4 pb-4 pt-1 border-t border-[var(--pricing-border)] space-y-4">
                    {tpl.blocks.map((block, i) => (
                        <Block key={i} block={block} templateId={tpl.id} />
                    ))}
                </div>
            )}
        </div>
    );
}

export function ChinhNgachTemplates() {
    // First card open: the tab is otherwise four collapsed rows with nothing to
    // read, which looks like it failed to load.
    const [openIds, setOpenIds] = useState<ReadonlySet<string>>(new Set([DOC_TEMPLATES[0]?.id]));

    const toggle = (id: string) =>
        setOpenIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    return (
        <div className="space-y-3">
            <p className="text-[13px] text-muted-foreground leading-relaxed">
                Bấm vào từng mục để xem hướng dẫn chi tiết và tải file mẫu.
            </p>
            {DOC_TEMPLATES.map((tpl) => (
                <TemplateCard key={tpl.id} tpl={tpl} open={openIds.has(tpl.id)} onToggle={() => toggle(tpl.id)} />
            ))}
        </div>
    );
}
