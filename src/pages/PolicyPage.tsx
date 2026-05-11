import Navbar from "@/components/Navbar";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLd";

import ContactSection from "@/components/ContactSection";
import { useCmsPolicies, useCmsPolicy } from "@/hooks/useCmsContent";
import { useI18n } from "@/lib/i18n";
import { useMemo, useState } from "react";
import PolicyImageViewer from "@/components/policy/PolicyImageViewer";
import PolicyTextRenderer from "@/components/policy/PolicyTextRenderer";

/* ── TikTok SVG Icon ── */
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h.05A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z" />
  </svg>
);

/** Render section icon — emoji hoặc TikTok SVG */
const SectionIcon = ({ icon }: { icon: string }) => {
  if (icon === "tiktok") return <TikTokIcon className="w-4 h-4" />;
  return <span>{icon}</span>;
};

interface DisplaySection {
  id: string;
  title: string;
  icon: string;
}

const PolicyPage = () => {
  const { t, effectiveLanguage, language } = useI18n();
  const cmsList = useCmsPolicies(language);
  const [activeSection, setActiveSection] = useState(0);

  const sections: DisplaySection[] = useMemo(() => {
    if (!cmsList.data) return [];
    return cmsList.data.policies
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((p) => ({ id: p.slug, title: p.title, icon: p.icon ?? "📄" }));
  }, [cmsList.data]);

  const current = sections[activeSection] ?? sections[0];

  // Per-slug fetch for image_list.
  const cmsDetail = useCmsPolicy(current ? current.id : "", language);
  const images = cmsDetail.data?.policy.image_list ?? [];

  /* Dual-mode: VI = ảnh gốc, EN/ZH = text (GTranslate dịch tự động) */
  const isVietnamese = effectiveLanguage === "vi";

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <SeoHead
        title={`${t("policy.title")} — THG Fulfill`}
        description={t("policy.subtitle")}
        path="/policy"
      />
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "https://thgfulfill.com/" },
          { name: t("policy.title"), url: "https://thgfulfill.com/policy" },
        ]}
      />
      <Navbar />
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* ── Header ── */}
        <h1 className="text-xl font-semibold text-navy mb-1">{t("policy.title")}</h1>
        <p className="text-[13px] text-muted-foreground mb-6 notranslate" translate="no">
          {t("policy.subtitle")}
        </p>



        {/* ── Section Tabs ── */}
        <div className="flex gap-2 flex-wrap mb-6">
          {sections.map((section, i) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(i)}
              className={`flex items-center gap-1.5 px-4 py-2 border-[1.5px] rounded-lg text-[13px] font-medium transition-all ${activeSection === i
                ? "bg-primary border-primary text-white"
                : "border-[#d4b96a] bg-white text-navy hover:bg-[#fdf6e8]"
                }`}
            >
              <SectionIcon icon={section.icon} />
              <span className="notranslate" translate="no">{section.title}</span>
            </button>
          ))}
        </div>

        {/* Loading / empty states */}
        {cmsList.isLoading && (
          <div className="text-center text-muted-foreground py-12 text-sm">Đang tải chính sách...</div>
        )}
        {!cmsList.isLoading && sections.length === 0 && (
          <div className="text-center text-muted-foreground py-12 text-sm">Chưa có chính sách nào.</div>
        )}

        {/* ── Content: Dual-mode rendering ── */}
        {current && (
          <>
            <PolicyImageViewer
              key={`${current.id}-img`}
              images={images}
              title={current.title}
            />
            <p className="text-center text-[12px] text-muted-foreground mt-4 mb-6 notranslate" translate="no">
              {current.title} — {images.length} {effectiveLanguage === 'vi' ? 'trang' : effectiveLanguage === 'zh' ? '页' : 'pages'}
            </p>

            {!isVietnamese && (
              <div className="mt-8">
                <PolicyTextRenderer key={`${current.id}-txt`} sectionId={current.id} />
              </div>
            )}
          </>
        )}
      </div>
      <ContactSection />

    </div>
  );
};

export default PolicyPage;
