// Generic route renderer — renders any shipping route from CMS data.

import { useCmsShippingRoute } from "@/hooks/useCmsContent";
import { useI18n } from "@/lib/i18n";
import { Sec } from "./PolicyUI";

interface Props {
  slug: string;
}

export function RouteRenderer({ slug }: Props) {
  const { language } = useI18n();
  const { data, isLoading, error } = useCmsShippingRoute(slug, language);

  if (isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground text-sm">Đang tải nội dung...</div>
    );
  }

  if (error || !data?.route) {
    return (
      <div className="py-8 text-center text-muted-foreground text-sm">
        Tuyến vận chuyển này chưa có dữ liệu. Vận hành cập nhật trong CMS.
      </div>
    );
  }

  const route = data.route;

  return (
    <div className="space-y-6">
      {route.body_md && (
        <Sec title={route.title} icon="📦">
          {/* Markdown rendering — for MVP show plain text. Future: react-markdown. */}
          <div className="text-sm leading-relaxed whitespace-pre-line">{route.body_md}</div>
        </Sec>
      )}

      {route.tables.map((table, tIdx) => (
        <Sec key={tIdx} title={table.caption ?? `Bảng ${tIdx + 1}`} icon="⚖">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--pricing-border)]">
                  {table.columns.map((col) => (
                    <th key={col.key} className="text-left px-3 py-2 font-semibold text-navy">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-[var(--pricing-border)] hover:bg-[#fdf6e8]">
                    {table.columns.map((col) => (
                      <td key={col.key} className="px-3 py-1.5">
                        {row[col.key] == null ? "" : String(row[col.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sec>
      ))}

      {route.notes.length > 0 && (
        <Sec title="Lưu ý" icon="⚠">
          <ul className="space-y-1.5 text-sm">
            {route.notes.map((note, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary">•</span>
                <span className="flex-1 leading-relaxed">{note}</span>
              </li>
            ))}
          </ul>
        </Sec>
      )}
    </div>
  );
}
