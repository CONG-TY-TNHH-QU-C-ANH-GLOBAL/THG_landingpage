// Khung "xem màu" — tô đúng màu đang chọn lên một hình minh hoạ.
//
// VÌ SAO TỒN TẠI: API catalog không có ảnh riêng cho từng màu (xem
// variantColors.ts). Ảnh mockup là ảnh dùng chung cho cả 6 series. Nên khi
// khách bấm "Light Brown", không có tấm ảnh nâu nào để hiện.
//
// Khung này vẽ ra màu đó. Nó là HÌNH MINH HOẠ, không phải ảnh chụp, và nhãn
// trên khung nói rõ điều đó — khách đặt hàng theo thứ họ nhìn thấy, nên không
// được để họ tưởng đây là ảnh sản phẩm thật.
//
// Size cũng đổi hình: dáng co giãn theo vị trí trong dải size. Đây là TƯƠNG
// ĐỐI, không phải số đo — dữ liệu variant có `length`/`width` nhưng toàn null,
// nên không có cm thật để vẽ. Nhãn ghi rõ "tương đối" vì cùng lý do trên.

import { useMemo } from "react";
import type { VariantSwatch } from "./variantColors";

interface ColorPreviewProps {
  swatch: VariantSwatch;
  colorName: string;
  /** Size đang chọn, ví dụ "L". Bỏ trống thì không vẽ phần co giãn. */
  size?: string | null;
  /** Cả dải size của series này, theo đúng thứ tự hiển thị. */
  sizeRun?: string[];
  /** Danh mục sản phẩm — quyết định vẽ hình gì. */
  category?: string | null;
  /** Nhãn hiển thị, đã dịch sẵn ở nơi gọi. */
  labels: {
    illustration: string;
    relativeSize: string;
  };
}

/** Bốn dáng đủ cho toàn bộ danh mục hiện có. Danh mục lạ rơi về khối vuông —
 *  thà một hình trung tính còn hơn vẽ nhầm cái áo cho một chiếc cốc. */
type Shape = "shirt" | "mug" | "phone" | "block";

const shapeFor = (category?: string | null): Shape => {
  const c = (category || "").toLowerCase();
  if (c.includes("apparel") || c.includes("shirt") || c.includes("hoodie")) return "shirt";
  if (c.includes("drinkware") || c.includes("mug") || c.includes("tumbler")) return "mug";
  if (c.includes("phone")) return "phone";
  return "block";
};

const PATHS: Record<Shape, string> = {
  // Áo phông nhìn thẳng: vai, tay, thân.
  shirt:
    "M70 38 L104 24 Q128 44 152 24 L186 38 L206 76 L176 92 L172 196 "
    + "Q128 206 84 196 L80 92 L50 76 Z",
  // Cốc có quai.
  mug:
    "M74 58 L166 58 L160 186 Q128 196 96 186 Z "
    + "M166 78 Q200 82 200 112 Q200 142 166 146 L166 130 Q184 128 184 112 "
    + "Q184 96 166 94 Z",
  // Ốp lưng điện thoại.
  phone: "M92 26 L164 26 Q176 26 176 40 L176 190 Q176 204 164 204 L92 204 Q80 204 80 190 L80 40 Q80 26 92 26 Z",
  // Khối chung cho Home & Living, Wall Art, Jewelry…
  block: "M66 50 L190 50 Q198 50 198 58 L198 182 Q198 190 190 190 L66 190 Q58 190 58 182 L58 58 Q58 50 66 50 Z",
};

export function ColorPreview({
  swatch,
  colorName,
  size,
  sizeRun,
  category,
  labels,
}: ColorPreviewProps) {
  const shape = shapeFor(category);

  // Co giãn theo vị trí trong dải size, không theo số đo. Dải một size thì
  // không co giãn — vẽ to nhỏ khi chỉ có một lựa chọn là vô nghĩa.
  const scale = useMemo(() => {
    if (shape !== "shirt" || !size || !sizeRun || sizeRun.length < 2) return 1;
    const index = sizeRun.indexOf(size);
    if (index < 0) return 1;
    const ratio = index / (sizeRun.length - 1);
    return 0.88 + ratio * 0.2; // 0.88 → 1.08
  }, [shape, size, sizeRun]);

  const showsScale = shape === "shirt" && !!size && (sizeRun?.length ?? 0) > 1;
  const outline = swatch.isLight ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.28)";

  return (
    <figure className="w-full h-full flex flex-col items-center justify-center gap-3 m-0">
      <svg
        viewBox="0 0 256 232"
        role="img"
        aria-label={`${colorName}${size ? ` · ${size}` : ""}`}
        className="w-full max-w-[280px] h-auto"
      >
        <defs>
          {/* Nếp vải/khối: một lớp sáng chéo để hình không bị bẹt như mảng màu. */}
          <linearGradient id="thg-preview-sheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.30" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.16" />
          </linearGradient>
          <filter id="thg-preview-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#0f172a" floodOpacity="0.16" />
          </filter>
        </defs>

        <g
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "128px 128px",
            transition: "transform 380ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <path
            d={PATHS[shape]}
            fill={swatch.hex}
            stroke={outline}
            strokeWidth="1.5"
            filter="url(#thg-preview-shadow)"
            style={{ transition: "fill 320ms ease" }}
          />
          <path d={PATHS[shape]} fill="url(#thg-preview-sheen)" pointerEvents="none" />
        </g>

        {showsScale && (
          <text
            x="128"
            y="222"
            textAnchor="middle"
            fontSize="12"
            fontWeight="600"
            fill="currentColor"
            className="text-muted-foreground"
          >
            {size}
          </text>
        )}
      </svg>

      <figcaption className="flex flex-col items-center gap-1 text-center px-4">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <span
            className="w-3.5 h-3.5 rounded-full border border-black/15"
            style={{ background: swatch.hex }}
          />
          {colorName}
          {size ? <span className="text-muted-foreground font-normal">· {size}</span> : null}
        </span>
        <span className="text-[11px] leading-snug text-muted-foreground">
          {labels.illustration}
          {showsScale ? ` · ${labels.relativeSize}` : ""}
        </span>
      </figcaption>
    </figure>
  );
}

export default ColorPreview;
