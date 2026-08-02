import "server-only";

import { cache } from "react";

import { cmsFetch } from "@/shared/cms";
import { CmsError, CmsHttpError, CmsParseError, CmsShapeError } from "@/shared/cms/errors";
import { logCmsFallback, logServiceBlockAnomaly } from "@/shared/cms/log-fallback";
import type { Locale } from "@/shared/i18n";

import {
  faqsResponseSchema,
  serviceBlocksResponseSchema,
  servicesResponseSchema,
} from "../schemas/service-page";
import {
  serviceBlocksFromDto,
  serviceFaqsFromDto,
  serviceRecordFromDto,
} from "../mappers/service-page";
import { isServicePageEmpty } from "../models/service-page";
import type { ServicePageResult, ServicePageSlug } from "../models/service-page";

// Server-only WEB-002 loaders for the generic service pages.
//
// Three reads per page: the service record, the page's blocks, and the page-scoped FAQs. They
// are issued together and settled independently — one missing resource degrades its own
// section, it does not fail the page. The route is `unavailable` only when EVERY read failed,
// because that is the only case where the page can say nothing truthful at all.

type UnavailableReason = "http" | "contract" | "network";

function unavailableReason(err: CmsError): UnavailableReason {
  if (err instanceof CmsHttpError) return "http";
  if (err instanceof CmsShapeError || err instanceof CmsParseError) return "contract";
  return "network";
}

export const loadServicePage = cache(
  async (slug: ServicePageSlug, lang: Locale): Promise<ServicePageResult> => {
    const servicePath = `/services?lang=${lang}`;
    const blocksPath = `/service-blocks?page_slug=${slug}&lang=${lang}`;
    // Scope convention mirrors the Fulfill route (`?scope=fulfill`): the page slug without the
    // `thg-` prefix is the FAQ scope the CMS uses.
    const scope = slug.replace(/^thg-/, "");
    const faqsPath = `/faqs?lang=${lang}&scope=${scope}`;

    const [serviceSettled, blocksSettled, faqsSettled] = await Promise.allSettled([
      cmsFetch(servicePath, servicesResponseSchema, { tags: ["services"] }),
      cmsFetch(blocksPath, serviceBlocksResponseSchema, { tags: [`service-blocks:${slug}`] }),
      cmsFetch(faqsPath, faqsResponseSchema, { tags: ["faqs"] }),
    ]);

    const failures: CmsError[] = [];
    for (const settled of [serviceSettled, blocksSettled, faqsSettled]) {
      if (settled.status !== "rejected") continue;
      // A non-CmsError is a programming fault and must not be swallowed as an outage.
      if (!(settled.reason instanceof CmsError)) throw settled.reason;
      failures.push(settled.reason);
    }
    if (serviceSettled.status === "rejected") logCmsFallback(servicePath, failures[0]);
    if (blocksSettled.status === "rejected") logCmsFallback(blocksPath, blocksSettled.reason as CmsError);
    if (faqsSettled.status === "rejected") logCmsFallback(faqsPath, faqsSettled.reason as CmsError);

    if (failures.length === 3) {
      return { status: "unavailable", reason: unavailableReason(failures[0]) };
    }

    const content = {
      slug,
      service:
        serviceSettled.status === "fulfilled"
          ? serviceRecordFromDto(serviceSettled.value, slug)
          : null,
      blocksByKind:
        blocksSettled.status === "fulfilled"
          ? serviceBlocksFromDto(blocksSettled.value, logServiceBlockAnomaly)
          : {},
      faqs: faqsSettled.status === "fulfilled" ? serviceFaqsFromDto(faqsSettled.value) : [],
    };

    // One owner for "is there anything on this page". This was a second, hand-written copy of
    // the same three-term rule, and the route ALREADY guards with
    // `status === "ready" && !isServicePageEmpty(...)` — belt and braces that only makes sense
    // if the two could disagree. They cannot now: a page cannot be `ready` here and empty (and
    // therefore noindex) downstream, because both answers come from this function.
    return isServicePageEmpty(content)
      ? { status: "empty", content }
      : { status: "ready", content };
  },
);
