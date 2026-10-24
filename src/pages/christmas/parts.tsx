import type { ReactNode } from "react";
import { Gift, Snowflake, TreePine } from "lucide-react";

import { LeadFormDialog } from "@/components/lead/LeadFormDialog";
import { useI18n } from "@/lib/i18n";
import "@/lib/i18n/translations/christmas";
import type { MetaItem, Origin, Product } from "./christmasData";
import { XmasImage } from "./XmasImage";

/** Every "Tư vấn ngay" on the page opens the site's lead form, which posts to
 *  the CMS leads API. The product (if any) pre-fills the message. */
export function ConsultButton({
    className,
    product,
    ariaLabel,
    children,
}: Readonly<{ className: string; product?: string; ariaLabel?: string; children: ReactNode }>) {
    const { t } = useI18n();
    return (
        <LeadFormDialog
            primaryService="fulfill"
            defaultMessage={`${t("christmas.lead_message")}${product ?? ""}`}
            trigger={
                <button type="button" className={className} aria-label={ariaLabel} title={ariaLabel}>
                    {children}
                </button>
            }
        />
    );
}

export function OriginTag({ origin, className = "origin" }: Readonly<{ origin: Origin; className?: string }>) {
    const { t } = useI18n();
    return <span className={`${className} ${origin}`}>{t(`christmas.origin_${origin}`)}</span>;
}

export function MetaList({ meta }: Readonly<{ meta: MetaItem[] }>) {
    const { t } = useI18n();
    return (
        <ul className="meta">
            {meta.map(([kind, value]) => (
                <li key={`${kind}-${value ?? ""}`}>
                    {kind === "spec" ? value : t(`christmas.meta_${kind}`).replace("{v}", value ?? "")}
                </li>
            ))}
        </ul>
    );
}

const CATEGORY_ICON = { gift: Gift, home: TreePine, kitchen: Snowflake, wear: Gift } as const;

export function ProductImage({ product }: Readonly<{ product: Product }>) {
    const { t } = useI18n();
    const Icon = CATEGORY_ICON[product.cat];
    return (
        <XmasImage
            src={product.img}
            alt={`${product.name} – ${t(`christmas.p_${product.id}`)}`}
            width={640}
            height={640}
            fallback={<Icon strokeWidth={1.6} />}
            pendingLabel={t("christmas.img_pending")}
        />
    );
}
