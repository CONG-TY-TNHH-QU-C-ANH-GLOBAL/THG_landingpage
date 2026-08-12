// Public surface of the "Khoảng giữa" homepage slice. The route composes these six pieces; nothing
// outside reaches into ui/ or model/ directly.
export { CorridorRoot } from "./ui/corridor-root";
export { CorridorProvider } from "./ui/corridor-provider.client";
export { ThresholdSection } from "./ui/threshold-section";
export { CorridorTrack } from "./ui/corridor-track.client";
export { MatrixSection } from "./ui/matrix-section.client";
export { DiagnosticSection } from "./ui/diagnostic-section.client";
export { RecommendationSection } from "./ui/recommendation-section.client";
export { WaybillSection } from "./ui/waybill-section.client";
export { WaybillDossier } from "./ui/waybill-dossier.client";
