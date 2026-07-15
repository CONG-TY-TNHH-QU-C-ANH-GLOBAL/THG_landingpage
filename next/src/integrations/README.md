# integrations/

External-system boundaries. An integration owns transport/config/validation for one
external system and exposes a public API only. Integrations may import **contracts**,
**shared/config** and **shared/errors** — nothing from `app` or `features`. **No integration
client is implemented in FND-001**; this directory reserves ownership.

| Integration | Owner spec | Responsibility | Must NOT |
|---|---|---|---|
| `cms/` | FND-004 | public content transport; generated OpenAPI types; runtime DTO validation; transport/config/errors only | own domain logic |
| `catalog/` | WEB-004 | public catalog API boundary | own order, inventory, shipment or workspace-private authority |
| `hub/` | WEB-008 | approved Hub origin; safe link/deep-link builders | call a tracking API; call a private Hub API; build an arbitrary redirect URL; forward order IDs, tracking IDs or raw query strings |
| `growth-os/` | (future) | future cross-product boundary only | any implementation in FND-001 |

Do not create speculative transports or clients. Boundary documentation reserves ownership
until a real integration is implemented by its owning spec.
