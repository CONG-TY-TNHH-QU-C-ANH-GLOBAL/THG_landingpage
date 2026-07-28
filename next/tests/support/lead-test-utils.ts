// Shared helpers for lead-capture component tests (WEB-002). Extracted to remove the duplicated
// copy-fixture / fetch-mock / request-body-inspection setup that was repeated verbatim across the
// global-dialog and Fulfill-inline specs. Narrowly scoped to lead tests only; each helper stays
// readable at the call site, and callers keep ownership of teardown (they reset the stubbed fetch
// via vi.unstubAllGlobals() in their own afterEach, so no mock state leaks between tests).
import { vi } from "vitest";

import { MARKETING_COPY } from "@/shared/i18n/marketing-copy";
import type { Locale } from "@/shared/i18n";
import type { MarketingCopy } from "@/shared/i18n/marketing";

/** Flatten the tri-locale marketing dictionary to one locale's resolved copy map. */
export function copyForLocale(locale: Locale): MarketingCopy {
  return Object.fromEntries(Object.entries(MARKETING_COPY).map(([k, v]) => [k, v[locale]]));
}

/** Stub global fetch with a 201 lead-accept response; returns the mock for assertions. */
export function mockLeadsFetch() {
  const fn = vi.fn(
    async () =>
      ({ ok: true, status: 201, json: async () => ({ ok: true, id: 1 }) }) as unknown as Response,
  );
  vi.stubGlobal("fetch", fn);
  return fn;
}

/** Parse the JSON body of the most recent fetch call — i.e. the submitted lead request. */
export function lastLeadBody(fetchMock: ReturnType<typeof mockLeadsFetch>) {
  const call = fetchMock.mock.calls.at(-1) as unknown as [string, { body: string }];
  return JSON.parse(call[1].body);
}
