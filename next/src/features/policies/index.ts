// Public API of the policies feature (WEB-007): landing models, server loaders and the
// composed page views. Wire schemas and DTO types never cross this boundary (FND-005).

export type { PolicySummary, PolicyDetail, PolicyTextBlock, PolicyPageResult } from "./models/policy";
export type {
  ShippingRouteSummary,
  ShippingRouteDetail,
  ShippingTable,
  ShippingPageResult,
} from "./models/shipping";

export { loadPolicies, loadShippingRoutes } from "./server/loaders";
export { PolicyDocument } from "./ui/policy-document";
export { ShippingDocument } from "./ui/shipping-document";
