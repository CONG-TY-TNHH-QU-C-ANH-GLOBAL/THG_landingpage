import { Star } from "lucide-react";
import { useMemo } from "react";

import { useI18n } from "@/lib/i18n";
import { useCmsTestimonials } from "@/hooks/useCmsContent";
import ScrollReveal from "@/components/ScrollReveal";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * Static fallback. The CMS has owned this content since the testimonials table
 * shipped — table, admin screen at /admin/content/testimonials, AI translation
 * pipeline and a public endpoint — but this section never read it, so four
 * operator-authored quotes sat unpublished while these four rendered.
 *
 * Kept as a fallback rather than deleted: it is what shows before the CMS query
 * resolves and if the endpoint is unreachable, which is the same fail-soft posture
 * the rest of the landing takes toward CMS content.
 */
const fallbackTestimonials = [
  { nameKey: "testimonials.t1_name", roleKey: "testimonials.t1_role", quoteKey: "testimonials.t1_quote", avatar: "🇻🇳" },
  { nameKey: "testimonials.t2_name", roleKey: "testimonials.t2_role", quoteKey: "testimonials.t2_quote", avatar: "🇺🇸" },
  { nameKey: "testimonials.t3_name", roleKey: "testimonials.t3_role", quoteKey: "testimonials.t3_quote", avatar: "🇻🇳" },
  { nameKey: "testimonials.t4_name", roleKey: "testimonials.t4_role", quoteKey: "testimonials.t4_quote", avatar: "🇺🇸" },
];

/** Every star is filled. The CMS testimonials table has no rating column, and
 *  the static rows were all hard-coded to 5 — so this is a design constant, not
 *  data. Reading it off a record would mean inventing a field. */
const STAR_COUNT = 5;

interface Card {
  avatar: string;
  name: string;
  role: string;
  quote: string;
}

/**
 * Operators author the flag into the name field — every live row reads
 * "🇻🇳 Nguyễn Minh Tuấn". The design puts that flag in the avatar circle and the
 * name beside it, so the leading pictograph is split off rather than rendered
 * twice. A name with no leading emoji falls back to its first character, which
 * is what a Latin-only name would want anyway.
 */
function splitAvatar(authorName: string): { avatar: string; name: string } {
  const match = /^(?:\p{Regional_Indicator}{2}|\p{Extended_Pictographic})/u.exec(authorName);
  if (!match) return { avatar: [...authorName][0] ?? "•", name: authorName };
  return { avatar: match[0], name: authorName.slice(match[0].length).trim() };
}

const TestimonialsSection = () => {
  const { tVi, language } = useI18n();
  const { data } = useCmsTestimonials(language);

  const cards = useMemo<Card[]>(() => {
    const rows = data?.testimonials ?? [];
    if (rows.length > 0) {
      return rows.map((r) => {
        const { avatar, name } = splitAvatar(r.author_name);
        return { avatar, name, role: r.author_role ?? "", quote: r.quote };
      });
    }
    return fallbackTestimonials.map((t) => ({
      avatar: t.avatar,
      name: tVi(t.nameKey),
      role: tVi(t.roleKey),
      quote: tVi(t.quoteKey),
    }));
  }, [data, tVi]);

  return (
    <section className="py-28 bg-background relative overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <SectionHeader
            size="lg"
            eyebrow={tVi("testimonials.subtitle")}
            title={tVi("testimonials.title")}
            titleHighlight={tVi("testimonials.title_highlight")}
          />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {cards.map((item, i) => (
            <ScrollReveal key={`${item.name}-${i}`} delay={i * 100}>
              <div className="glass-card rounded-2xl p-7 tilt-card h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: STAR_COUNT }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-sm text-foreground/80 leading-relaxed flex-1 italic">
                  "{item.quote}"
                </p>
                {/* Author */}
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border/50">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
                    {item.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">{item.name}</p>
                    {item.role && <p className="text-xs text-muted-foreground">{item.role}</p>}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
