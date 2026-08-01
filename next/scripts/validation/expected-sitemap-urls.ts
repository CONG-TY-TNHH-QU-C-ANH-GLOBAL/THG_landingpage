#!/usr/bin/env bun
// Emit the sitemap URLs the approved route registry says must exist, one per line.
//
// WHY THIS EXISTS
//
// scripts/validation/seo-acceptance.sh asserted `LOCS == 3` with the comment
// "WEB-001: exactly the home rows". That was true when the homepage was the only migrated
// route. It became a SECOND, hand-maintained source of truth the moment a route slice added
// one — and it broke on PR83 with "got 12" while every other SEO assertion passed. Bumping it
// to 12 would only move the breakage to PR84.
//
// The count is not the invariant. The invariant is:
//
//     sitemap = approved static indexable route templates x supported locales
//
// Both sides of that already have a canonical owner — `shared/seo/indexable-routes` and
// `shared/i18n` — so the acceptance script derives its expectation from them instead of
// restating it. When PR84 adds /blog and /careers to the registry, this emitter and the
// running sitemap change together and the gate keeps passing for the right reason.
//
// NOT TAUTOLOGICAL. This reads the registry, never the served sitemap. It proves the packaged
// standalone artifact serves exactly what the registry declares — a build-and-runtime property
// that unit tests cannot reach. The registry's own correctness (every template resolves to a
// real page.tsx, blocked routes stay out, no duplicate template, locale-prefix-free paths) is
// proven independently in tests/integration/seo.test.ts, which does NOT consult the sitemap
// output. The shell adds structural checks that need no knowledge of N at all.

import { SUPPORTED_LOCALES } from "../../src/shared/i18n";
import { localeUrl } from "../../src/shared/seo";
import { expandIndexableRoutes } from "../../src/shared/seo/indexable-routes";

const urls = expandIndexableRoutes(SUPPORTED_LOCALES, localeUrl).map(({ url }) => url);

// Sorted so the shell can diff against a sorted copy of the served document; ordering inside
// the sitemap itself is asserted separately by the unit tests.
for (const url of [...urls].sort((a, b) => a.localeCompare(b, "en-US"))) {
  console.log(url);
}
