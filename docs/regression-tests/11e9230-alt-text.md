# Regression test — incident 11e9230 (alt_text nullable drift)

**Status**: kill switch verified (Phase D5.4, 2026-05-26)
**Class**: silent contract drift between landing Zod schema and backend OpenAPI spec
**Original incident**: commit `11e9230` on `THG_landingpage/main` (2026-05-23)

## What this document is

This is the documentation artifact closing Phase D5 — the
incident-prevention work for the contract layer between
THG_landingpage (frontend) and cmsthgfulfill (backend CMS).

It captures **verbatim CI evidence** that the D5.x bidirectional
Zod ↔ OpenAPI cross-checks (`src/lib/cmsSchemas.cross-check.test-d.ts`)
fail at PR-time when someone re-introduces the exact regression that
caused incident 11e9230 — and that the failure points precisely at
the offending field rather than surfacing as a downstream consumer
crash.

## Background — what happened in 11e9230

Commit [`11e9230`](https://github.com/CONG-TY-TNHH-QU-C-ANH-GLOBAL/THG_landingpage/commit/11e9230)
was a merge between two unrelated git histories. The merge resolution
silently regressed `blogPostSlideSchema.alt_text` from `z.string()` to
`z.string().nullable()` in `src/lib/cmsSchemas.ts`, even though:

- DB constraint (`cmsthgfulfill/db/migrations/0001_init.sql:263`):
  `blog_slides.alt_text TEXT NOT NULL`
- Backend service type (`cmsthgfulfill/src/features/blog/blog.service.ts:34`):
  `alt_text: string`
- Backend editor validation (`cmsthgfulfill/src/features/blog/blog.actions.ts:64`):
  `z.string().max(200).default("")`

Nothing in the standard CI pipeline (lint / typecheck / unit tests /
e2e / vite build) caught the regression at the schema layer. It
surfaced only as a `tsc` error during the post-merge build:

```
Type '{ slug: string; category: string; date: string; title: string;
       excerpt: string; slides: { src: string; alt_text: string | null }[];
     } | undefined' is not assignable to type 'DisplayArticle | undefined'.
    at src/pages/BlogDetailPage.tsx:27
```

A consumer-level symptom in a UI route, far away from the schema
file that drifted. Debugging required tracing back from a
`DisplayArticle` mismatch to a single `.nullable()` call in a schema
file that the merge had touched. See Phase A stabilization PR for
the recovery.

## The kill switch (Phase D5)

Phase D5 installed bidirectional cross-checks between landing's Zod
schemas and the OpenAPI-derived types (`src/lib/cms-generated.d.ts`).
For each annotated endpoint:

```ts
// File: src/lib/cmsSchemas.cross-check.test-d.ts
describe("D5.2 — /api/v1/blog/{slug} ...", () => {
  it("forward — source: Zod, target: OpenAPI-generated ...", () => {
    expectTypeOf<BlogPostResponseFromZod>().toExtend<BlogPostResponseFromOpenApi>();
  });
  it("backward — source: OpenAPI-generated, target: Zod ...", () => {
    expectTypeOf<BlogPostResponseFromOpenApi>().toExtend<BlogPostResponseFromZod>();
  });
});
```

The bidirectional `toExtend` call fails asymmetrically when the two
sides disagree. The named direction of the failing `it()` block tells
the reviewer which side is the source of the drift.

## Replay reproduction

Deliberately re-introduce the exact 11e9230 regression on a local
branch, run the test suite, and observe the gate fire.

### Reproduction commands

```bash
git checkout -b throwaway-d5-replay  # never push or PR this

# Inject the regression (same change as commit 11e9230's resolution)
sed -i 's/^  alt_text: z\.string(),$/  alt_text: z.string().nullable(),/' \
  src/lib/cmsSchemas.ts
grep -A 1 "blogPostSlideSchema" src/lib/cmsSchemas.ts  # confirm change

bun run test 2>&1 | tee /tmp/d5-replay-output.txt  # CI step that fires the gate

# Restore — never commit the regression
git checkout -- src/lib/cmsSchemas.ts
git checkout main && git branch -D throwaway-d5-replay
```

### Captured output (verbatim, ANSI stripped)

The full transcript is preserved here as the evidence of record.
Two error blocks fire in the same run:

#### Block 1 — D5 cross-check (the kill switch) — fires FIRST

```
❯ TS src/lib/cmsSchemas.cross-check.test-d.ts (20 tests | 1 failed)
  ...
× D5.2 — /api/v1/blog/{slug} Zod ↔ OpenAPI cross-check
   (detail, heightened-watch: slides[].alt_text non-null)
   > forward — source: Zod, target: OpenAPI-generated
     (Zod is not stricter than contract)

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

FAIL src/lib/cmsSchemas.cross-check.test-d.ts
  > D5.2 — /api/v1/blog/{slug} Zod ↔ OpenAPI cross-check
    (detail, heightened-watch: slides[].alt_text non-null)
  > forward — source: Zod, target: OpenAPI-generated
    (Zod is not stricter than contract)

TypeCheckError: Type '... post { ...; slides { src string; alt_text string|null; }[]; } ...'
  does not satisfy the constraint
  '... post { ...; slides { src string; alt_text "Expected string, Actual null"; }[]; } ...'.
  The types of 'post.slides' are incompatible between these types.
    Type '{ src string; alt_text string|null; }[]' is not assignable
      to type '{ src string; alt_text "Expected string, Actual null"; }[]'.
      Type '{ src string; alt_text string|null; }' is not assignable
        to type '{ src string; alt_text "Expected string, Actual null"; }'.
        Types of property 'alt_text' are incompatible.
          Type 'string|null' is not assignable to
            type '"Expected string, Actual null"'.

❯ src/lib/cmsSchemas.cross-check.test-d.ts:113:54
  111| describe("D5.2 — /api/v1/blog/{slug} Zod ↔ OpenAPI cross-check (detail…
  112|   it("forward — source: Zod, target: OpenAPI-generated (Zod is not str…
  113|     expectTypeOf<BlogPostResponseFromZod>().toExtend<BlogPostResponseF…
                                                     ^
```

#### Block 2 — original incident consumer error — also fires (downstream)

```
⎯⎯⎯⎯⎯⎯ Unhandled Errors ⎯⎯⎯⎯⎯⎯

⎯⎯⎯ Unhandled Source Error ⎯⎯⎯
TypeCheckError: Type '{ slug string; category string; date string;
  title string; excerpt string; slides { src string; alt_text string|null; }[];
  } | undefined' is not assignable to type 'DisplayArticle | undefined'.
  Type '{ slug string; ... slides { src string; alt_text string|null; }[]; }'
    is not assignable to type 'DisplayArticle'.
    Types of property 'slides' are incompatible.
      Type '{ src string; alt_text string|null; }[]' is not assignable
        to type '{ src string; alt_text string; }[]'.
        Type '{ src string; alt_text string|null; }'
          is not assignable to type '{ src string; alt_text string; }'.
          Types of property 'alt_text' are incompatible.
            Type 'string|null' is not assignable to type 'string'.
              Type 'null' is not assignable to type 'string'.

❯ src/pages/BlogDetailPage.tsx:27:11
```

#### Summary line

```
Test Files: 1 failed | 1 passed (2)
Tests:      1 failed | 20 passed (21)
Type Errors: 1 failed
exit code 1
```

## Why this proves the kill switch works

Three independent properties hold in the captured run:

1. **The D5 gate fires as a named test failure**, not as a stray
   diagnostic. The failing `it()` block carries the full context:
   _D5.2 → /api/v1/blog/{slug} → forward — source: Zod, target:
   OpenAPI-generated_. A reviewer reading CI output knows
   immediately:
   - which endpoint drifted (`/api/v1/blog/{slug}`),
   - which side is the source of the drift (Zod),
   - which field is incompatible (`post.slides[].alt_text`),
   - which mismatch type (`string|null` vs `"Expected string,
     Actual null"`).

2. **The original incident-11e9230 consumer error reproduces
   verbatim** in block 2 — same file, same line, same message as
   the production-time failure. This proves the regression I
   injected is the same class as the original incident, not a
   related-but-different bug.

3. **The remaining 19 cross-checks still pass cleanly**
   (`20 passed (21)`). The gate is precisely scoped: only the
   affected endpoint's check fires, no collateral false positives
   on FAQ / testimonials / contact-locations / integrations /
   translations / blog-list / marquee / jobs / jobs-detail.

## What still needs human review (the bypass)

The D3.3 CI step (`.github/workflows/deploy.yml`) has a documented
escape hatch: if a repo admin sets the repository variable
`SKIP_CMS_TYPE_CHECK=1`, the type drift step is skipped and an
audit `::notice` annotation is emitted in PR Checks. That bypass
exists for CMS infra outages where the codegen step itself can't
reach the worker; it does NOT affect this D5 gate, which is a
vitest assertion and always runs as part of `bun run test`.

In other words: **the D5 gate cannot be bypassed without removing
the cross-check from `src/lib/cmsSchemas.cross-check.test-d.ts`**.
Any such PR is plainly visible in code review.

## Out of scope for this regression test

- Annotating additional CMS endpoints (`services`, `homepage`,
  `site-settings`, `pricing`, `policies`) — that work is Phase
  D2.5–D2.7. After those land, D5 will add cross-checks for them
  using the same pattern.
- Runtime validation of CMS response bodies — landing's Zod
  schemas at `src/lib/cmsSchemas.ts` are the runtime validator,
  this gate is compile-time only.
- Validation of editor inputs at the CMS admin side — separate
  surface, handled by backend Zod (`cmsthgfulfill/src/features/<f>/<f>.actions.ts`).

## Maintenance — keeping this test honest

If incident 11e9230 ever recurs in a different shape, append a new
section to this document with:

- the new offending field path,
- the captured CI output from the failing D5 cross-check,
- a one-line note on which describe-block caught it.

Do not modify the captured output above; it's the evidence of
record for this specific regression class.
