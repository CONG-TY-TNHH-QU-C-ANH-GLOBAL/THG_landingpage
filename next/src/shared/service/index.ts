// Shared Service Experience template (R2) — the public surface of the presentation layer.
//
// Content-agnostic by construction: nothing here imports a feature model, a CMS type or an icon
// library. A service feature maps its own model to these view props and passes already-rendered
// glyphs and islands as slots, which is what lets THG Fulfill, Express, Warehouse and Order share
// one template while keeping their genuinely different content pipelines apart.
export { ServiceSectionHeader, type ServiceSectionHeading } from "./service-section-header";
export { ServiceHero, type ServiceTrustPoint } from "./service-hero";
export { ServiceWorkflow, type ServiceWorkflowStep } from "./service-workflow";
export { ServiceFeatureGrid, type ServiceFeature } from "./service-feature-grid";
export { ServiceIntegrationFlow, type ServiceFlowStage } from "./service-integration-flow";
export { ServiceFaq, type ServiceFaqItem, type ServiceCommunityLink } from "./service-faq";
export { ServiceVideo } from "./service-video";
export { default as serviceStyles } from "./service.module.css";
