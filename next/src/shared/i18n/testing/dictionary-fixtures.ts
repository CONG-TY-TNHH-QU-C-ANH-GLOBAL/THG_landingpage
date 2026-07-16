import type { Dictionary } from "../model/dictionary";

// Fixtures for dictionary schema/parity tests. Not shipped to any runtime bundle.
export const validDictionaryFixture: Dictionary = {
  meta: { localeName: "Test", htmlLang: "en" },
  foundation: {
    title: "Test title",
    description: "Test description",
    localeLabel: "Test locale label",
  },
};

/** Missing `foundation.localeLabel` and `meta.htmlLang` — must fail schema validation. */
export const missingKeyDictionaryFixture: unknown = {
  meta: { localeName: "Test" },
  foundation: { title: "Test title", description: "Test description" },
};

/** Contains an unexpected extra key — must fail strict schema validation. */
export const extraKeyDictionaryFixture: unknown = {
  meta: { localeName: "Test", htmlLang: "en" },
  foundation: {
    title: "Test title",
    description: "Test description",
    localeLabel: "Test locale label",
    unexpected: "nope",
  },
};
