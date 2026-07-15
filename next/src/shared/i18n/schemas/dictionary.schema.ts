import { z } from "zod";

// Runtime shape for a foundation dictionary. `.strict()` rejects unexpected keys and required
// fields reject missing keys — so every locale file must have exactly the same key set.
export const dictionarySchema = z
  .object({
    meta: z
      .object({
        localeName: z.string().min(1),
        htmlLang: z.string().min(1),
      })
      .strict(),
    foundation: z
      .object({
        title: z.string().min(1),
        description: z.string().min(1),
        localeLabel: z.string().min(1),
      })
      .strict(),
  })
  .strict();

export type DictionaryShape = z.infer<typeof dictionarySchema>;
