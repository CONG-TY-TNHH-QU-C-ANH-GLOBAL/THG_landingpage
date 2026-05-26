import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // Phase D5 — Zod ↔ OpenAPI cross-checks live in *.test-d.ts files.
    // Vitest's typecheck mode runs `tsc` against the test-d files; any
    // expectTypeOf mismatch surfaces as a normal TS error (with the
    // offending property path and type quote) at `bun run test` time.
    // Compile-time only — no runtime side effects.
    typecheck: {
      enabled: true,
      include: ["src/**/*.test-d.ts"],
      tsconfig: "./tsconfig.app.json",
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
