import "server-only";

import { cache } from "react";

import { cmsFetch } from "@/shared/cms";
import { CmsError, isCmsNotFound } from "@/shared/cms/errors";
import { unavailableReason } from "@/shared/cms/degraded";
import { isRoutableSlug } from "@/shared/cms/slug";
import { logCmsFallback } from "@/shared/cms/log-fallback";
import { SUPPORTED_LOCALES, type Locale } from "@/shared/i18n";

import { jobResponseSchema, jobsResponseSchema } from "../schemas/jobs";
import { jobDetailFromDto, jobSummariesFromDto } from "../mappers/job";
import type { JobDetailResult, JobListResult } from "../models/job";

// Server-only WEB-006 loaders: cmsFetch → feature schema → pure mapper → model.
// The CMS filters to status='open' server-side; the landing never re-derives publish state.

export const loadJobs = cache(async (lang: Locale): Promise<JobListResult> => {
  const path = `/jobs?lang=${lang}`;
  try {
    const jobs = jobSummariesFromDto(await cmsFetch(path, jobsResponseSchema, { tags: ["jobs"] }));
    return jobs.length > 0 ? { status: "ready", jobs } : { status: "empty", jobs };
  } catch (err) {
    if (!(err instanceof CmsError)) throw err;
    logCmsFallback(path, err);
    return { status: "unavailable", jobs: [], reason: unavailableReason(err) };
  }
});

export const loadJob = cache(async (slug: string, lang: Locale): Promise<JobDetailResult> => {
  const path = `/jobs/${encodeURIComponent(slug)}?lang=${lang}`;
  try {
    const job = jobDetailFromDto(
      await cmsFetch(path, jobResponseSchema, { tags: ["jobs", `jobs:${slug}`] }),
    );
    return { status: "ready", job };
  } catch (err) {
    if (!(err instanceof CmsError)) throw err;
    // A closed or never-existing job is the same 404 server-side; both become a real HTTP 404.
    if (isCmsNotFound(err)) return { status: "not-found" };
    logCmsFallback(path, err);
    return { status: "unavailable", reason: unavailableReason(err) };
  }
});

/** {lang, slug} pairs to prerender.
 *
 *  Unlike blog, there is no slug feed for jobs — the list endpoint IS the enumeration, so this
 *  reads it once per locale. A CMS outage yields [] and `dynamicParams` covers the rest; the
 *  build must not require the CMS to be reachable. */
export async function jobStaticParams(): Promise<{ lang: string; slug: string }[]> {
  const perLocale = await Promise.all(
    SUPPORTED_LOCALES.map(async (lang) => {
      const result = await loadJobs(lang);
      // Same slug contract as blog: an out-of-contract value is skipped rather than failing the
      // locale, and dynamicParams still covers it if the CMS is corrected.
      return result.jobs
        .filter((job) => isRoutableSlug(job.slug))
        .map((job) => ({ lang, slug: job.slug }));
    }),
  );
  return perLocale.flat();
}
