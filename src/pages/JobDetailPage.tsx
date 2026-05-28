import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { ArrowLeft } from "lucide-react";

import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLdBreadcrumb, JsonLdJobPosting } from "@/components/seo/JsonLd";
import { JobDetailContent } from "@/components/careers/JobDetailContent";
import { useCmsJob } from "@/hooks/useCmsContent";
import { useI18n } from "@/lib/i18n";
import { accentFor, jobFromCmsListItem, withCmsDetail, type Job } from "@/lib/careers";

const SITE = "https://thgfulfill.com";

/** Build a plain-text description for meta + JobPosting schema from the job's
 *  lead + responsibilities + requirements (Google wants a substantive desc). */
function buildDescription(job: Job): string {
  const parts: string[] = [];
  if (job.lead) parts.push(job.lead);
  else if (job.tagline) parts.push(job.tagline);
  const resp = Object.values(job.responsibilities).flat();
  if (resp.length) parts.push("Công việc: " + resp.slice(0, 6).join("; "));
  if (job.requirements.length) parts.push("Yêu cầu: " + job.requirements.slice(0, 6).join("; "));
  return parts.join(" ").slice(0, 300) || `${job.title} — THG Fulfill`;
}

const JobDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useI18n();
  const cms = useCmsJob(slug ?? "", language);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const job: Job | undefined = useMemo(() => {
    const d = cms.data?.job;
    if (!d) return undefined;
    // The detail endpoint returns both the surface + rich fields, so adapt it
    // straight into a full Job (no separate list fetch needed).
    const summary = jobFromCmsListItem({
      slug: d.slug,
      position: 0,
      category: d.category,
      hot: d.hot,
      badge: d.badge,
      tagline: d.tagline,
      title: d.title,
      location: d.location,
      employment_type: d.employment_type,
      salary: d.salary,
      salary_unit: d.salary_unit,
      salary_note: d.salary_note,
      deadline: d.deadline,
      experience: d.experience,
    });
    return withCmsDetail(summary, {
      lead: d.lead,
      responsibilities: d.responsibilities,
      requirements: d.requirements,
      benefits: d.benefits,
      bonuses: d.bonuses,
    });
  }, [cms.data]);

  if (!job) {
    if (cms.isLoading) {
      return (
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="pt-28 pb-20 text-center text-muted-foreground">Đang tải...</div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-background">
        <SeoHead title="Not found — THG Fulfill" description="" path={`/careers/${slug ?? ""}`} noindex />
        <Navbar />
        <div className="pt-28 pb-20 text-center">
          <p className="text-xl text-muted-foreground">Vị trí này không còn tồn tại hoặc đã đóng.</p>
          <Link to="/careers" className="text-primary font-semibold mt-4 inline-block hover:underline">
            ← Xem tất cả vị trí
          </Link>
        </div>
      </div>
    );
  }

  const accent = accentFor(job.cat);
  const description = buildDescription(job);
  const url = `${SITE}/careers/${job.id}`;

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={`${job.title} — Tuyển dụng THG Fulfill`}
        description={description}
        path={`/careers/${job.id}`}
        ogType="article"
      />
      <JsonLdJobPosting
        title={job.title}
        description={description}
        url={url}
        location={job.location}
        employmentType={job.type}
        validThrough={job.deadline}
      />
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: `${SITE}/` },
          { name: t("careers.title") || "Careers", url: `${SITE}/careers` },
          { name: job.title, url },
        ]}
      />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 mb-5">
          <Link to="/careers" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Tất cả vị trí
          </Link>
        </div>
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          <JobDetailContent job={job} accent={accent} />
        </div>
      </div>
      <ContactSection />
    </div>
  );
};

export default JobDetailPage;
