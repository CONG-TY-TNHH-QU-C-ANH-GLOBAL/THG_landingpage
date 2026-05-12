import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PolicyImageViewerProps {
    images: string[];
    title: string;
}

/**
 * Gallery component hiển thị hình ảnh chính sách.
 * Hỗ trợ prev/next, indicator dots, lazy loading.
 */
const PolicyImageViewer = ({ images, title }: PolicyImageViewerProps) => {
    const [current, setCurrent] = useState(0);
    const total = images.length;

    const prev = useCallback(() => setCurrent((c) => (c > 0 ? c - 1 : total - 1)), [total]);
    const next = useCallback(() => setCurrent((c) => (c < total - 1 ? c + 1 : 0)), [total]);

    if (total === 0) return null;

    return (
        <div className="select-none">
            {/* ── Image Container ── */}
            <div className="relative group rounded-2xl overflow-hidden bg-white border border-[var(--pricing-border)] shadow-sm">
                <img
                    key={current}
                    src={images[current]}
                    alt={`${title} — trang ${current + 1}/${total}`}
                    className="w-full h-auto block"
                    loading="lazy"
                    draggable={false}
                />

                {/* Prev / Next arrows */}
                {total > 1 && (
                    <>
                        <button
                            onClick={prev}
                            aria-label="Trang trước"
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={next}
                            aria-label="Trang sau"
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Page counter badge */}
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[11px] font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                    {current + 1} / {total}
                </div>
            </div>

            {/* ── Indicator Dots ── */}
            {total > 1 && total <= 30 && (
                <div className="flex justify-center gap-1.5 mt-4 flex-wrap">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            aria-label={`Đi đến trang ${i + 1}`}
                            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${i === current
                                    ? "bg-primary scale-125"
                                    : "bg-[#d4c9b0] hover:bg-primary/50"
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* ── Thumbnail Strip (for sections > 30 images, fallback to mini-scroll) ── */}
            {total > 30 && (
                <div className="flex gap-1.5 mt-4 overflow-x-auto pb-2 scrollbar-thin">
                    {images.map((src, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setCurrent(i)}
                            aria-label={`Open page ${i + 1} of ${total}`}
                            aria-current={i === current ? "true" : undefined}
                            className={`shrink-0 w-12 h-8 rounded border-2 overflow-hidden transition-all cursor-pointer ${i === current ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                        >
                            <img src={src} alt="" aria-hidden="true" className="w-full h-full object-cover" loading="lazy" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PolicyImageViewer;
