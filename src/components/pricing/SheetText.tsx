/** Inline <strong> inside the XKCN sheet's copy, rendered without any
 *  classes so the sheet's own stylesheet decides how it looks (each container
 *  colours its <strong> differently — gold on the navy notice, dark amber in a
 *  commodity note).
 *
 *  Split on the tag rather than handing it to dangerouslySetInnerHTML, for the
 *  reason RichText gives: nothing here needs more than bold. */
export function SheetText({ html }: Readonly<{ html: string }>) {
    const parts = html.split(/<\/?strong>/g);
    return <>{parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}</>;
}
