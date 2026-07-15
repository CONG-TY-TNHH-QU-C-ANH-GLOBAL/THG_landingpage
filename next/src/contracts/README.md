# contracts/

Versioned **cross-product** contracts only. Pure, framework-free type/shape definitions
shared across products. **No contract is implemented in FND-001**; this reserves ownership.

| Contract area | Purpose |
|---|---|
| `experience/` | cross-product experience/UI-envelope contracts |
| `intake/` | cross-product intake (lead/application) contracts |
| `events/` | cross-product event contracts |
| `attribution/` | cross-product attribution contracts |

## Import rule (enforced by ESLint + `tests/architecture`)

Contract code may **not** import: React; Next.js; database models; provider SDKs; UI
component types; CMS transport implementation. Contracts are the lowest layer — they depend
on nothing in this application. Do not implement speculative Growth OS behavior in FND-001.
