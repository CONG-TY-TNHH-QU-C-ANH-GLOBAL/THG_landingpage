// CMS employment text → schema.org JobPosting.employmentType. Pure, no imports (FND-005).
//
// The CMS stores `employment_type` as free text an operator types, and the detail route was
// emitting it into structured data verbatim. schema.org expects one of a controlled set, so
// "Toàn thời gian" or "Full time" in that property is invalid structured data — the kind of
// error that costs a domain its job rich results rather than just this one posting.
//
// UNRECOGNIZED INPUT IS OMITTED, NOT MAPPED TO `OTHER`. `OTHER` is a positive claim that the
// role uses an employment mode outside the standard list; a value this mapper simply does not
// recognize — a typo, a new locale's phrasing, an operator writing "Thực tập sinh part-time" —
// is not that claim. Omitting the property leaves the rest of the posting valid and costs
// nothing, whereas a wrong enum is a false statement about the job. Only add a mapping here
// once a real CMS value is known.
//
// The human-facing label is untouched: the detail page keeps rendering the operator's own
// wording. This value exists solely for the JSON-LD.

/** The controlled values Google documents for JobPosting.employmentType. */
export type SchemaEmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACTOR"
  | "TEMPORARY"
  | "INTERN"
  | "VOLUNTEER"
  | "PER_DIEM"
  | "OTHER";

/** Recognized spellings, keyed by the input reduced to lowercase alphanumerics.
 *
 *  Keys are normalized rather than listed per punctuation variant, so "Full-time", "full time",
 *  "FULL_TIME" and "FullTime" all arrive as `fulltime` and need one entry. Vietnamese and
 *  Chinese phrasings are included because the CMS is authored per locale. */
const RECOGNIZED: Readonly<Record<string, SchemaEmploymentType>> = {
  fulltime: "FULL_TIME",
  toanthoigian: "FULL_TIME",
  quanzhi: "FULL_TIME",
  parttime: "PART_TIME",
  banthoigian: "PART_TIME",
  jianzhi: "PART_TIME",
  contract: "CONTRACTOR",
  contractor: "CONTRACTOR",
  hopdong: "CONTRACTOR",
  freelance: "CONTRACTOR",
  freelancer: "CONTRACTOR",
  temporary: "TEMPORARY",
  temp: "TEMPORARY",
  thoivu: "TEMPORARY",
  seasonal: "TEMPORARY",
  intern: "INTERN",
  internship: "INTERN",
  thuctap: "INTERN",
  thuctapsinh: "INTERN",
  volunteer: "VOLUNTEER",
  tinhnguyen: "VOLUNTEER",
  perdiem: "PER_DIEM",
};

/** Reduce an operator's phrasing to a lookup key: fold diacritics, drop everything that is not
 *  an ASCII letter or digit. "Toàn thời gian" and "toan-thoi-gian" both become `toanthoigian`. */
function lookupKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Mark}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** The schema.org value for a CMS employment string, or null when it is not recognized. */
export function schemaEmploymentType(value: string | null): SchemaEmploymentType | null {
  if (!value) return null;
  return RECOGNIZED[lookupKey(value)] ?? null;
}
