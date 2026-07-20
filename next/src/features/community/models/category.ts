// Landing-domain community category. Plain data, no imports (FND-005 model rule).

export interface CommunityCategory {
  slug: string;
  name: string;
}

/** Why the community surface could not be read. `contract` means the CMS answered 2xx
 *  with a payload that failed validation — distinct from an outage, because it needs a
 *  contract fix rather than a retry. Declared here (not imported) so every model file
 *  stays import-free; the union is structural, so all three uses stay compatible. */
export type CommunityUnavailableReason = "http" | "contract" | "network";
