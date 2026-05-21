interface ImageMarqueeProps {
    images: string[];
    speed?: number;
    height?: string;
    className?: string;
}

const ImageMarquee = ({
    images,
    speed = 40,
    height = "220px",
    className = "",
}: ImageMarqueeProps) => {
    const duplicated = [...images, ...images];

    return (
        <div className={`w-full overflow-hidden ${className}`}>
            <div
                className="flex marquee-track hover:[animation-play-state:paused]"
                style={{
                    animation: `marquee-scroll ${speed}s linear infinite`,
                    width: "max-content",
                }}
            >
                {duplicated.map((img, idx) => (
                    <div
                        key={idx}
                        className="flex-shrink-0 mx-2 rounded-xl overflow-hidden border border-border/40 group"
                        style={{ width: "300px", height }}
                    >
                        <img
                            src={img}
                            alt={`Gallery ${(idx % images.length) + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>
            <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
        </div>
    );
};

export default ImageMarquee;
