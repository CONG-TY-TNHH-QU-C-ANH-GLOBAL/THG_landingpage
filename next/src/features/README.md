# features/

Vertical feature packages. Each feature owns its slice end-to-end and exposes a single
public API via `index.ts`. **No feature is implemented in FND-001** — this directory
reserves the boundary; features are created by their owning specs (M2+).

## Ownership map (target)

| Feature | Owner spec | Notes |
|---|---|---|
| `shell/` | WEB-001 | global shell / layout composition |
| `home/` | WEB-001 | homepage — content layer implemented (FND-005: schemas/mappers/models/server loaders; UI lands with WEB-001) |
| `services/` | WEB-002 | thg-fulfill/express/warehouse/order |
| `pricing/` | WEB-003 | pricing tables + calculator/export islands |
| `catalog/` | WEB-004 | **public catalog discovery** for sellers (browse/filter/reference) |
| `blog/` | WEB-005 | |
| `careers/` | WEB-006 | |
| `policies/` | WEB-007 | |
| `shipping-routes/` | WEB-007 | |
| `community/questions/` | COM-001 | |
| `community/reviews/` | COM-002 | |
| `ask-thg/` | (future) | |
| `lead-capture/` | CONV-001 | |
| `job-application/` | CONV-002 | |
| `campaign-experience/` | (future) | |
| `assistant/` | AI-* | **deferred; no implementation now** |

## Ownership boundary — tracking

The Landing owns **public catalog discovery** for sellers. The Landing does **not** own
order, shipment or tracking truth. **Do not define `features/tracking`.** The legacy
`/{lang}/tracking` route becomes a safe deep-link to the authenticated THG Hub under
WEB-008 (via `integrations/hub`) — not implemented in FND-001.

## Standard feature package (convention — see ARCHITECTURE.md §feature-package)

`model/ schemas/ mappers/ server/ actions/ ui/ client/ tests/ index.ts README.md`. A
feature creates only the subdirectories it uses, but may not invent a different topology
without an approved architecture change. Raw CMS DTOs may never become public React
component props.
