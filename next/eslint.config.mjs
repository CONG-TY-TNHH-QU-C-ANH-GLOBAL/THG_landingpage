import next from "eslint-config-next";

// Architecture import boundaries (FND-001 §10). The vitest architecture test
// (tests/architecture/boundaries.test.ts) is the deterministic gate; these ESLint rules
// are the complementary, editor-time guard.
const boundary = (files, patterns, message) => ({
  files,
  rules: {
    "no-restricted-imports": [
      "error",
      { patterns: patterns.map((group) => ({ group: [group], message })) },
    ],
  },
});

const config = [
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts", "tests/performance/**"] },
  ...next,
  // contracts: no framework / app / features / integrations / UI
  boundary(
    ["src/contracts/**"],
    ["react", "react-dom", "next", "next/*", "@/app/*", "@/features/*", "@/integrations/*", "@/shared/ui/*"],
    "contracts must not import framework, application, UI, DB or provider modules",
  ),
  // shared: no app / features / integrations
  boundary(
    ["src/shared/**"],
    ["@/app/*", "@/features/*", "@/integrations/*"],
    "shared must not import app, features or integrations",
  ),
  // integrations: only contracts + shared/config + shared/errors
  boundary(
    ["src/integrations/**"],
    ["@/app/*", "@/features/*"],
    "integrations may import only contracts, shared/config and shared/errors",
  ),
];

export default config;
