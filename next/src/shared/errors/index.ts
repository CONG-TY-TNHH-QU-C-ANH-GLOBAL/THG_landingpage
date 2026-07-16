// Public-safe error surface. Internal error details never reach the client.
export type PublicErrorCategory =
  | "not_found"
  | "invalid_input"
  | "upstream_unavailable"
  | "rate_limited"
  | "forbidden"
  | "internal";

export class PublicError extends Error {
  constructor(
    readonly category: PublicErrorCategory,
    message: string,
  ) {
    super(message);
    this.name = "PublicError";
  }
}

export interface PublicErrorShape {
  category: PublicErrorCategory;
  message: string;
}

// Redact any unknown throwable — and any `internal` PublicError — to a safe shape. Only
// non-internal PublicError messages (deliberate, safe categories) pass through; everything
// else collapses to the generic `internal` message so no stack, SQL, token, upstream body or
// arbitrary internal detail can leak.
const REDACTED_INTERNAL: PublicErrorShape = { category: "internal", message: "An unexpected error occurred." };

export function toPublicError(err: unknown): PublicErrorShape {
  if (err instanceof PublicError && err.category !== "internal") {
    return { category: err.category, message: err.message };
  }
  return { ...REDACTED_INTERNAL };
}
