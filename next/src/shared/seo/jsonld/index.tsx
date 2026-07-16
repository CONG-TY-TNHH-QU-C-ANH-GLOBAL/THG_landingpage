// Safe JSON-LD emission (FND-003 CONTRACTS §Security, AC-06): the serializer escapes every
// character that could break out of a <script> context, so model-provided strings can never
// inject markup. Typed builders (Organization/Service/Article/…) arrive with their consuming
// slices — they accept landing models only (FND-005), and no such consumer exists in next/ yet.

// ASCII-only pattern source (the two line separators would be invisible as literals).
const UNSAFE_IN_SCRIPT = new RegExp("[<>&\\u2028\\u2029]", "g");

/** JSON.stringify with <, >, & and the JS line separators escaped — safe inside <script>. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(
    UNSAFE_IN_SCRIPT,
    (c) => "\\u" + c.codePointAt(0)!.toString(16).padStart(4, "0"),
  );
}

/** Server Component emitting one JSON-LD script tag. `data` must be a landing-owned model
 *  or literal — never a raw DTO (CONTRACTS §"Input and output"). */
export function JsonLdScript({ data }: { data: unknown }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
  );
}
