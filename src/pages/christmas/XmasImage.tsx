import { useEffect, useRef, useState, type ReactNode } from "react";
import { Gift } from "lucide-react";

interface Props {
    src: string;
    alt: string;
    className?: string;
    /** Shown until the photo loads, and for good if it is missing. */
    fallback?: ReactNode;
    /** Caption under the fallback icon, e.g. "Photo coming soon". */
    pendingLabel?: string;
    priority?: boolean;
    width?: number;
    height?: number;
}

/** A photo over a branded gradient. The photo fades in once it has loaded; if
 *  the file is missing (marketing has not supplied it yet) the gradient and
 *  icon stay and no broken-image glyph ever shows. Dropping a file with the
 *  same name into public/christmas/ is all it takes to swap it in. */
export function XmasImage({ src, alt, className, fallback, pendingLabel, priority, width, height }: Readonly<Props>) {
    const [state, setState] = useState<"loading" | "loaded" | "failed">("loading");
    const ref = useRef<HTMLImageElement>(null);

    // A cached image can finish before React attaches onLoad.
    useEffect(() => {
        const img = ref.current;
        if (img?.complete) setState(img.naturalWidth > 0 ? "loaded" : "failed");
    }, [src]);

    return (
        <div className={`xm-img${className ? ` ${className}` : ""}`}>
            {state !== "loaded" && (
                <div className="xm-fallback" aria-hidden="true">
                    {fallback ?? <Gift strokeWidth={1.6} />}
                    {state === "failed" && pendingLabel && <small>{pendingLabel}</small>}
                </div>
            )}
            {state !== "failed" && (
                <img
                    ref={ref}
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    loading={priority ? "eager" : "lazy"}
                    decoding="async"
                    className={state === "loaded" ? "is-loaded" : undefined}
                    onLoad={() => setState("loaded")}
                    onError={() => setState("failed")}
                />
            )}
        </div>
    );
}
