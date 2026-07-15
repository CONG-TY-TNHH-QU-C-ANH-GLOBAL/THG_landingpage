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

// Redact any unknown throwable to a safe shape. Unknown errors collapse to `internal`
// with a generic message so no stack, SQL, token or upstream body can leak.
export function toPublicError(err: unknown): PublicErrorShape {
  if (err instanceof PublicError) {
    return { category: err.category, message: err.message };
  }
  return { category: "internal", message: "An unexpected error occurred." };
}
