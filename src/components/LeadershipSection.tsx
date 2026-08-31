import ScrollReveal from "@/components/ScrollReveal";
import { useCmsLeadership } from "@/hooks/useCmsContent";
import { useI18n } from "@/lib/i18n";
import type { CmsLeadershipAvatar, CmsLeadershipMember } from "@/lib/cmsSchemas";

const MAX_VISIBLE_AVATARS = 4;

const LeadershipSection = () => {
  const { tVi } = useI18n();
  const { data } = useCmsLeadership();
  const members = data?.leadership ?? [];

  // Drafts are filtered by the CMS. An empty or temporarily unavailable API
  // should not leave a heading with no people underneath it.
  if (members.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#173b63] via-[#315b86] to-[#dce8f3] py-24">
      <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-white/20 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <ScrollReveal>
          <div className="mx-auto mb-12 max-w-3xl text-center lg:text-left lg:mx-0">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-[#ff6a13]">
              {tVi("leadership.eyebrow")}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {tVi("leadership.title")}{" "}
              <span className="text-[#ff8a42]">{tVi("leadership.title_highlight")}</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
              {tVi("leadership.desc")}
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-wrap justify-center gap-7">
          {members.map((member, index) => (
            <ScrollReveal
              key={member.id}
              delay={Math.min(index, 5) * 80}
              className="w-full md:w-[calc(50%-0.875rem)] xl:w-[calc(33.333%-1.25rem)]"
            >
              <LeadershipCard member={member} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

function LeadershipCard({ member }: Readonly<{ member: CmsLeadershipMember }>) {
  return (
    <article className="flex h-full min-h-[360px] flex-col items-center rounded-2xl border border-white/50 bg-white px-6 py-9 text-center shadow-[0_18px_50px_rgba(12,34,60,0.16)] transition-transform duration-300 hover:-translate-y-1 sm:px-8">
      <AvatarGroup avatars={member.avatars} fallbackName={member.name} />

      <h3 className="mt-6 text-xl font-bold text-[#102b49]">{member.name}</h3>
      {member.role && (
        <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#f05a0b] sm:text-sm">
          {member.role}
        </p>
      )}
      {member.quote && (
        <blockquote className="mt-5 max-w-md text-sm italic leading-7 text-slate-500 sm:text-base">
          “{member.quote}”
        </blockquote>
      )}
    </article>
  );
}

function AvatarGroup({
  avatars,
  fallbackName,
}: Readonly<{ avatars: CmsLeadershipAvatar[]; fallbackName: string }>) {
  if (avatars.length === 0) {
    const initials = fallbackName
      .split(/\s+/)
      .filter(Boolean)
      .slice(-2)
      .map((part) => [...part][0])
      .join("")
      .toUpperCase();

    return (
      <div className="flex h-28 w-28 items-center justify-center rounded-full border-[3px] border-[#f05a0b] bg-slate-100 text-2xl font-bold text-[#173b63]">
        {initials || "THG"}
      </div>
    );
  }

  if (avatars.length === 1) {
    return <Avatar avatar={avatars[0]} className="h-28 w-28" />;
  }

  const visible = avatars.slice(0, MAX_VISIBLE_AVATARS);
  const remaining = avatars.length - visible.length;

  return (
    <div
      className="flex min-h-28 items-center justify-center pl-5"
      role="group"
      aria-label={fallbackName}
    >
      {visible.map((avatar, index) => (
        <Avatar key={`${avatar.url}-${index}`} avatar={avatar} className="-ml-5 h-16 w-16" />
      ))}
      {remaining > 0 && (
        <div className="-ml-5 flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#f05a0b] bg-[#173b63] text-sm font-bold text-white shadow-md">
          +{remaining}
        </div>
      )}
    </div>
  );
}

function Avatar({
  avatar,
  className,
}: Readonly<{ avatar: CmsLeadershipAvatar; className: string }>) {
  return (
    <img
      src={avatar.url}
      alt={avatar.alt}
      loading="lazy"
      className={`${className} shrink-0 rounded-full border-[3px] border-[#f05a0b] bg-white object-cover shadow-md`}
    />
  );
}

export default LeadershipSection;
