// Inline SVG illustrations for the packaging cards. Inline rather than files so
// they inherit the card's hover transform and cost no extra requests.

const BASE = "pk-art";

export function PolyMailerArt() {
  return (
    <svg className={BASE} viewBox="0 0 120 120" fill="none" aria-hidden="true" focusable="false">
      <g transform="rotate(-7 60 60)">
        <rect x="32" y="20" width="56" height="80" rx="5" fill="#EEF3F8" />
        <path d="M32 25a5 5 0 0 1 5-5h46a5 5 0 0 1 5 5v13H32z" fill="#D9E3ED" />
        <path d="M32 38h56" stroke="#BCCBDA" strokeWidth="1.6" strokeDasharray="4 3" />
        <rect x="41" y="52" width="30" height="4.5" rx="2.2" fill="#B9C8D8" />
        <rect x="41" y="63" width="20" height="4.5" rx="2.2" fill="#CBD7E3" />
        <rect x="41" y="79" width="38" height="10" rx="2" fill="#FFFFFF" stroke="#C6D3E0" strokeWidth="1.4" />
        <path d="M45 84h8M56 84h6M65 84h10" stroke="#9FB2C6" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

const BUBBLE_ROWS = [
  { y: 50, xs: [40, 51, 62, 73] },
  { y: 61, xs: [46, 57, 68, 79] },
  { y: 72, xs: [40, 51, 62, 73] },
  { y: 83, xs: [46, 57, 68, 79] },
];

export function BubbleMailerArt() {
  return (
    <svg className={BASE} viewBox="0 0 120 120" fill="none" aria-hidden="true" focusable="false">
      <g transform="rotate(-7 60 60)">
        <rect x="30" y="22" width="60" height="76" rx="7" fill="#F1F5F9" />
        <path d="M30 29a7 7 0 0 1 7-7h46a7 7 0 0 1 7 7v11H30z" fill="#DCE5EF" />
        <path d="M30 40h60" stroke="#BCCBDA" strokeWidth="1.6" strokeDasharray="4 3" />
        {BUBBLE_ROWS.map((row) =>
          row.xs.map((x) => <circle key={`${x}-${row.y}`} cx={x} cy={row.y} r="3.6" fill="#CBD9E7" />),
        )}
      </g>
    </svg>
  );
}

export function CartonBoxArt() {
  return (
    <svg className={BASE} viewBox="0 0 120 120" fill="none" aria-hidden="true" focusable="false">
      <path d="M26 52 60 68v34L26 86z" fill="#C98F52" />
      <path d="M94 52 60 68v34l34-16z" fill="#B47C41" />
      <path d="M26 52 60 36l34 16-34 16z" fill="#E0AC72" />
      <path d="M60 36 26 52 42 30l18 6z" fill="#EBBE8A" />
      <path d="M60 36 94 52 78 30l-18 6z" fill="#D9A468" />
      <path d="M60 68v34" stroke="#9A6832" strokeWidth="1.2" opacity=".5" />
      <rect x="52" y="60" width="16" height="5" rx="1.4" fill="#F4E3CC" opacity=".9" />
    </svg>
  );
}

export function OwnPackagingArt() {
  return (
    <svg className={BASE} viewBox="0 0 120 120" fill="none" aria-hidden="true" focusable="false">
      <path d="M26 52 60 68v34L26 86z" fill="#43607F" />
      <path d="M94 52 60 68v34l34-16z" fill="#35506D" />
      <path d="M26 52 60 36l34 16-34 16z" fill="#5A7898" />
      <path d="M60 68v34" stroke="#25405C" strokeWidth="1.2" opacity=".5" />
      <circle cx="60" cy="52" r="11" fill="#FFFFFF" opacity=".92" />
      <path
        d="m60 46.5 1.9 3.9 4.3.6-3.1 3 .7 4.3-3.8-2-3.8 2 .7-4.3-3.1-3 4.3-.6z"
        fill="#C8872F"
      />
    </svg>
  );
}
