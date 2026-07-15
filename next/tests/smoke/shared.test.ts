import { describe, it, expect } from "vitest";
import { toPublicError, PublicError } from "../../src/shared/errors/index";
import { readServerEnv } from "../../src/shared/config/env.server";

describe("public-safe errors", () => {
  it("redacts unknown errors to internal (no leak)", () => {
    expect(toPublicError(new Error("db password=hunter2"))).toEqual({
      category: "internal",
      message: "An unexpected error occurred.",
    });
  });

  it("passes a PublicError through unchanged", () => {
    expect(toPublicError(new PublicError("not_found", "gone"))).toEqual({
      category: "not_found",
      message: "gone",
    });
  });
});

describe("server env validation", () => {
  it("rejects an invalid PORT", () => {
    const prev = process.env.PORT;
    process.env.PORT = "not-a-port";
    try {
      expect(() => readServerEnv()).toThrow(/Invalid PORT/);
    } finally {
      if (prev === undefined) delete process.env.PORT;
      else process.env.PORT = prev;
    }
  });

  it("accepts a valid PORT", () => {
    const prev = process.env.PORT;
    process.env.PORT = "3000";
    try {
      expect(readServerEnv().port).toBe(3000);
    } finally {
      if (prev === undefined) delete process.env.PORT;
      else process.env.PORT = prev;
    }
  });
});
