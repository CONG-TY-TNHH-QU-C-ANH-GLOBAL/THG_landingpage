// Shared careers types + CMS adapters, used by both the /careers list page and
// the per-JD /careers/:slug detail page so the surface mapping lives in one place.

export interface Benefit {
  i: string;
  t: string;
  d: string;
}

export interface Job {
  id: string; // slug
  cat: string;
  filter: string;
  hot?: boolean;
  badge: string;
  tagline: string;
  title: string;
  desc: string;
  salary: string;
  salaryUnit: string;
  salaryNote: string;
  location: string;
  type: string;
  deadline: string;
  experience: string;
  lead: string;
  responsibilities: Record<string, string[]>;
  requirements: string[];
  benefits: Benefit[];
  bonuses: string[];
}

// Accent colors keyed by CMS category. Add new categories here when needed.
export const ACCENT: Record<string, string> = {
  ai: "#2E6F8E",
  finance: "#6B8E5A",
  "sales-pod": "#C17B5E",
  "sales-ship": "#5A7A8E",
  "sales-wh": "#8B6B9A",
  sales: "#5A7A8E",
  ops: "#D4A548",
  sourcing: "#B85C6E",
  marketing: "#7B5EA0",
};
export const DEFAULT_ACCENT = "#A67845";

export function accentFor(cat: string | null | undefined): string {
  return (cat && ACCENT[cat]) || DEFAULT_ACCENT;
}

/** Map CMS category → filter group (left chip filters). */
export function categoryToFilter(cat: string | null | undefined): string {
  if (!cat) return "other";
  if (cat === "ai" || cat === "finance" || cat === "ops" || cat === "sourcing") return cat;
  if (cat.startsWith("sales")) return "sales";
  return cat;
}

// Shapes returned by the CMS public jobs API (subset we consume).
interface CmsJobListItem {
  slug: string;
  position: number;
  category: string | null;
  hot: boolean;
  badge: string | null;
  tagline: string | null;
  title: string;
  location: string | null;
  employment_type: string | null;
  salary: string | null;
  salary_unit: string | null;
  salary_note: string | null;
  deadline: string | null;
  experience: string | null;
}

interface CmsJobDetail {
  lead: string | null;
  responsibilities: Record<string, string[]>;
  requirements: string[];
  benefits: Benefit[];
  bonuses: string[];
}

/** CMS list item → card-level Job (rich fields empty until detail loads). */
export function jobFromCmsListItem(j: CmsJobListItem): Job {
  return {
    id: j.slug,
    cat: j.category ?? "other",
    filter: categoryToFilter(j.category),
    hot: j.hot,
    badge: j.badge ?? "",
    tagline: j.tagline ?? "",
    title: j.title,
    desc: j.tagline ?? "",
    salary: j.salary ?? "",
    salaryUnit: j.salary_unit ?? "",
    salaryNote: j.salary_note ?? "",
    location: j.location ?? "",
    type: j.employment_type ?? "",
    deadline: j.deadline ?? "",
    experience: j.experience ?? "",
    lead: "",
    responsibilities: {},
    requirements: [],
    benefits: [],
    bonuses: [],
  };
}

/** Merge the per-slug detail payload onto a summary Job. */
export function withCmsDetail(summary: Job, d: CmsJobDetail): Job {
  return {
    ...summary,
    lead: d.lead ?? "",
    responsibilities: d.responsibilities ?? {},
    requirements: d.requirements ?? [],
    benefits: d.benefits ?? [],
    bonuses: d.bonuses ?? [],
  };
}
