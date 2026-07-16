# shared/

Cross-cutting primitives owned centrally. **shared may not import `app`, `features` or
`integrations`** (enforced by ESLint + `tests/architecture`). No generic dumping grounds
(`utils`, `helpers`, `common`, `misc`, ambiguous `lib`, generic root components).

| Module | Owner / purpose | Status |
|---|---|---|
| `config/` | typed env validation (server vs public split) | **implemented** (`env.server.ts`, `env.public.ts`) |
| `errors/` | public-safe error surface + redaction | **implemented** (`index.ts`) |
| `i18n/` | canonical locale model/config, `vi/en/zh` dictionaries + schema, server `getDictionary`, pure routing primitive | **implemented** — FND-002 |
| `seo/` | canonical site origin + safe joining, `buildPageMetadata`/`buildAlternates` (canonical + hreflang vi/en/zh-CN/x-default), safe JSON-LD serializer | **implemented** — FND-003 |
| `analytics/` | consent store, `trackEvent` fan-out, UTM | reserved — FND-007 |
| `security/` | headers, CSP/HSTS runtime | reserved — FND-009 |
| `ui/` | ported shadcn primitives, site shell (navbar/footer/floating-contact), lead-form island, marketing-copy helpers | **implemented** — WEB-001 |
| `testing/` | shared test helpers/fixtures | reserved — first real consumer |

Reserved modules are documented here and are **not** pre-generated as empty directories
(GOV-008: no speculative scaffolding). They are created by their owning spec on first use.
