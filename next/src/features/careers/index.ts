// Public API of the careers feature (WEB-006): landing models, server loaders and composed
// views. Wire schemas and DTO types never cross this boundary (FND-005).
// Applicant submission is CONV-002's surface and is deliberately absent here.

export type {
  JobSummary,
  JobDetail,
  Benefit,
  ResponsibilityGroup,
  JobListResult,
  JobDetailResult,
} from "./models/job";
export { isExpired } from "./models/job";
export type { SchemaEmploymentType } from "./models/employment-type";
export { schemaEmploymentType } from "./models/employment-type";

export { loadJobs, loadJob, jobStaticParams } from "./server/loaders";
export { CareersList, JobDetailView, JobUnavailable } from "./ui/careers-views";
