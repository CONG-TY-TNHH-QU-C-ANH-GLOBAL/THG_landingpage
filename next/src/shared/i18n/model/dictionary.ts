// Foundation-level dictionary domain model. Only the keys required for the locale proof —
// the full Vite translation inventory is NOT migrated in FND-002. Consumers receive a
// deeply read-only type.
export interface Dictionary {
  readonly meta: {
    readonly localeName: string;
    readonly htmlLang: string;
  };
  readonly foundation: {
    readonly title: string;
    readonly description: string;
    readonly localeLabel: string;
  };
}

export type ReadonlyDictionary = Readonly<Dictionary>;
