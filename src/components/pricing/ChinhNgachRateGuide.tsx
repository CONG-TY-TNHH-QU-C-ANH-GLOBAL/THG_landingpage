import { GUIDE_BLOCKS, type GuideBlock, type GuideTone } from "@/data/chinhNgachGuide";
import { RichText } from "@/components/pricing/RichText";

/** The sheet's own palette, kept rather than mapped onto the site's generic
 *  tones: green means "this is the right choice", amber means "only in these
 *  cases", blue means "cross-reference". Re-colouring would flatten that. */
const BOX: Record<GuideTone, string> = {
    green: "bg-[#E3F4EA] border-[#A9D8BC]",
    amber: "bg-[#fffbeb] border-[#fde68a]",
    blue: "bg-[#eff6ff] border-[#bfdbfe]",
    gray: "bg-[#f7fafd] border-[#DDD8CE]",
};

const NOTE: Record<GuideTone, string> = {
    green: "bg-[#E3F4EA] border-[#A9D8BC] text-[#1A8754]",
    amber: "bg-[#fffbeb] border-[#fde68a] text-[#92400e]",
    blue: "bg-[#eff6ff] border-[#bfdbfe] text-[#1E5BC6]",
    gray: "bg-[#f7fafd] border-[#DDD8CE] text-muted-foreground",
};

/** Navy block, gold serif numeral, navy2 body — the sheet's section marker.
 *  The numeral is a label ("?", "1", "📖"), not an ordinal, so it is rendered
 *  as given instead of being counted. */
function Banner({ num, title, sub }: Readonly<{ num: string; title: string; sub: string }>) {
    return (
        <div className="flex items-stretch overflow-hidden rounded-[10px]">
            <div className="flex w-12 flex-shrink-0 items-center justify-center bg-navy font-serif text-xl font-extrabold text-primary">
                {num}
            </div>
            <div className="flex-1 bg-[#1B2A4A] px-[18px] py-[13px]">
                <p className="text-base font-extrabold text-white">{title}</p>
                {sub && <p className="text-[12px] text-[#8aa0c4]">{sub}</p>}
            </div>
        </div>
    );
}

function Block({ block, onJump }: Readonly<{ block: GuideBlock; onJump?: () => void }>) {
    switch (block.kind) {
        case "divider":
            return <hr className="my-6 border-0 border-t border-[#DDD8CE]" />;

        case "banner":
            return <Banner num={block.num} title={block.title} sub={block.sub} />;

        case "para":
            return (
                <p className="text-[13px] leading-relaxed text-foreground/80">
                    <RichText html={block.html} />
                </p>
            );

        case "cols":
            return (
                <div className="grid gap-3 sm:grid-cols-2">
                    {block.boxes.map((box) => (
                        <div key={box.heading} className={`rounded-[9px] border px-4 py-3.5 ${BOX[box.tone] ?? BOX.gray}`}>
                            <p className="mb-1.5 text-[13px] font-bold text-navy">{box.heading}</p>
                            {box.text && <p className="text-[12.5px] leading-relaxed text-foreground/80">{box.text}</p>}
                            {box.items.length > 0 && (
                                <ul className="space-y-1">
                                    {box.items.map((it) => (
                                        <li key={it} className="relative pl-3 text-[12.5px] leading-snug text-foreground/80">
                                            <span className="absolute left-0 top-[0.55em] h-1 w-1 rounded-full bg-muted-foreground" aria-hidden="true" />
                                            {it}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            );

        case "note":
            return (
                <p className={`rounded-lg border px-3.5 py-2.5 text-[12.5px] leading-relaxed ${NOTE[block.tone] ?? NOTE.gray}`}>
                    <RichText html={block.html} />
                    {block.link && onJump && (
                        <>
                            {" "}
                            <button type="button" onClick={onJump} className="font-bold underline underline-offset-2">
                                {block.link}
                            </button>
                        </>
                    )}
                </p>
            );

        case "table":
            return (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-[13px]">
                        <thead>
                            <tr>
                                {block.head.map((h, i) => (
                                    <th
                                        key={h}
                                        className={`bg-navy px-3 py-2.5 text-left text-[11px] font-bold text-white ${i === 0 ? "rounded-l-md" : ""} ${i === block.head.length - 1 ? "rounded-r-md" : ""}`}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {block.rows.map((r, i) => (
                                <tr
                                    key={i}
                                    className={r.hl ? "bg-[#fdf8ec] font-semibold text-navy" : i % 2 === 1 ? "bg-[#f9f8f5]" : ""}
                                >
                                    {r.cells.map((c, j) => (
                                        <td
                                            key={j}
                                            className={`border-b border-[#eef1f7] px-[11px] py-2 ${c.pr ? "font-mono text-[14px] font-extrabold text-[#0d6e3f]" : ""}`}
                                        >
                                            {c.txt}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );

        case "gloss":
            return (
                <dl className="grid gap-2 sm:grid-cols-2">
                    {block.items.map((g) => (
                        <div key={g.term} className="rounded-lg border border-[#DDD8CE] bg-white px-[13px] py-2.5">
                            <dt className="text-[12.5px] font-bold text-navy">{g.term}</dt>
                            <dd className="text-[12px] text-muted-foreground">{g.def}</dd>
                        </div>
                    ))}
                </dl>
            );

        default:
            return null;
    }
}

export function ChinhNgachRateGuide({ onJumpToQuotation }: Readonly<{ onJumpToQuotation?: () => void }>) {
    return (
        <div className="space-y-4">
            {GUIDE_BLOCKS.map((block, i) => (
                <Block key={i} block={block} onJump={onJumpToQuotation} />
            ))}
        </div>
    );
}
