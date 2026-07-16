import { describe, it, expect } from "vitest";
import { toPublicError, PublicError } from "../../src/shared/errors/index";
import { readServerEnv } from "../../src/shared/config/env.server";

describe("public-safe errors", () => {
  it("redacts unknown errors to the generic internal message", () => {
    expect(toPublicError(new Error("db password=hunter2"))).toEqual({
      category: "internal",
      message: "An unexpected error occurred.",
    });
  });

  it("redacts an internal PublicError's detail to the generic message", () => {
    expect(toPublicError(new PublicError("internal", "conn string postgres://user:pw@host"))).toEqual({
      category: "internal",
      message: "An unexpected error occurred.",
    });
  });

  it("passes safe non-internal PublicError messages through unchanged", () => {
    expect(toPublicError(new PublicError("not_found", "gone"))).toEqual({ category: "not_found", message: "gone" });
    expect(toPublicError(new PublicError("rate_limited", "slow down"))).toEqual({
      category: "rate_limited",
      message: "slow down",
    });
  });
});

function withEnv(vars: Record<string, string | undefined>, fn: () => void) {
  const prev = Object.keys(vars).map((k) => [k, process.env[k]] as const);
  for (const [k, v] of Object.entries(vars)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  try {
    fn();
  } finally {
    for (const [k, v] of prev) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
}

describe("server env validation", () => {
  it("defaults NODE_ENV to development when missing", () => {
    withEnv({ NODE_ENV: undefined }, () => expect(readServerEnv().nodeEnv).toBe("development"));
  });

  it("accepts each valid NODE_ENV", () => {
    for (const env of ["development", "production", "test"] as const) {
      withEnv({ NODE_ENV: env }, () => expect(readServerEnv().nodeEnv).toBe(env));
    }
  });

  it("rejects an invalid NODE_ENV such as staging", () => {
    withEnv({ NODE_ENV: "staging" }, () => expect(() => readServerEnv()).toThrow(/Invalid NODE_ENV/));
  });

  it("rejects an invalid PORT", () => {
    withEnv({ PORT: "not-a-port" }, () => expect(() => readServerEnv()).toThrow(/Invalid PORT/));
  });

  it("accepts a valid PORT", () => {
    withEnv({ PORT: "3000" }, () => expect(readServerEnv().port).toBe(3000));
  });
});
