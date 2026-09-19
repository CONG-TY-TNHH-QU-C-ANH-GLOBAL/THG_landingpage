/** The source sheet writes emphasis as inline <strong> inside otherwise plain
 *  text, and both the commodity notes and the template prose carry it.
 *
 *  Split on the tag rather than handing it to dangerouslySetInnerHTML. The
 *  content ships in our own repo, so it is not a live injection risk today —
 *  but an innerHTML sink on a public page is the kind of thing that stops being
 *  safe the moment someone wires this text to a CMS field, and nothing here
 *  needs more than bold. */
export function RichText({ html }: Readonly<{ html: string }>) {
    const parts = html.split(/<\/?strong>/g);
    return (
        <>
            {parts.map((part, i) =>
                i % 2 === 1 ? (
                    <strong key={i} className="font-bold text-navy">
                        {part}
                    </strong>
                ) : (
                    <span key={i}>{part}</span>
                ),
            )}
        </>
    );
}
