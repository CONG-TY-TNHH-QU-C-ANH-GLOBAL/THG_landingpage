import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Isolated test config so the app never inherits the repo-root Vite vitest config.
export default defineConfig({
  resolve: {
    alias: [
      // `server-only` throws outside a React Server Component; stub it for node unit tests.
      { find: /^server-only$/, replacement: fileURLToPath(new URL("./tests/stubs/server-only.ts", import.meta.url)) },
    ],
  },
  test: {
    root: import.meta.dirname,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**", "tests/performance/**", "tests/stubs/**"],
  },
});
