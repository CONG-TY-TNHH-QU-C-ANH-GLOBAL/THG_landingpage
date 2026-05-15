import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════
   LogisticsAnimationSection  –  v2 "Live Ops" edition
   ───────────────────────────────────────────────────────
   Dark navy section between IntegrationsSection and
   TestimonialsSection. Features:
     • SVG animated flight route  VN → CN → US
     • JS-driven cycling pipeline with live status cards
     • Count-up stats on scroll
     • Gold CTA → https://hub.thgfulfill.com
   Drop-in: no external deps beyond React itself.
═══════════════════════════════════════════════════════ */

const STEPS = [
  { emoji: "🛒", num: "01", title: "Order Placed",     desc: "Auto-synced from your store"    },
  { emoji: "🖨️", num: "02", title: "POD Printing",     desc: "Printed at our HCMC facility"   },
  { emoji: "📦", num: "03", title: "Packed & Labeled",  desc: "QC passed, carrier label ready" },
  { emoji: "✈️", num: "04", title: "Dispatched",        desc: "Carrier network activated"      },
  { emoji: "🏠", num: "05", title: "Delivered",         desc: "At customer's doorstep"         },
];

const ROUTE = "M 115,108 C 205,52 315,46 378,84 C 482,136 642,52 768,108";
const PLEN  = 920;

export default function LogisticsAnimationSection() {
  const [active,  setActive]  = useState(0);
  const [counts,  setCounts]  = useState([0, 0, 0]);
  const [counted, setCounted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setActive(p => (p + 1) % STEPS.length), 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!statsRef.current || counted) return;
    const targets = [48, 99.2, 150];
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setCounted(true);
      targets.forEach((target, i) => {
        let v = 0;
        const step = target / 55;
        const timer = setInterval(() => {
          v = Math.min(v + step, target);
          setCounts(prev => { const n = [...prev]; n[i] = v; return n; });
          if (v >= target) clearInterval(timer);
        }, 28);
      });
    }, { threshold: 0.5 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, [counted]);

  const fmt = (v: number, i: number) =>
    i === 1 ? v.toFixed(1) : Math.round(v).toString();

  return (
    <section className="g2">
      <style>{STYLES}</style>

      <div className="g2-glow g2-glow-a" />
      <div className="g2-glow g2-glow-b" />

      <div className="g2-wrap">

        {/* ── HEADER ── */}
        <div className="g2-hd">
          <span className="g2-eye">FULFILLMENT IN MOTION</span>
          <h2 className="g2-h2">
            Your Order,&nbsp;<span className="g2-gold">Our Pipeline</span>
          </h2>
          <p className="g2-sub">
            From storefront to doorstep — every step automated, tracked, and delivered on time.
          </p>
        </div>

        {/* ── ROUTE SVG ── */}
        <div className="g2-map-wrap">
          <svg className="g2-map" viewBox="0 0 900 190" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="g2dots" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="16" cy="16" r="1" fill="rgba(255,255,255,0.04)" />
              </pattern>
            </defs>

            <rect width="900" height="190" fill="url(#g2dots)" />

            {/* hidden reference path for animateMotion */}
            <path id="g2rt" d={ROUTE} fill="none" stroke="none" />

            {/* faint dotted baseline */}
            <path d={ROUTE} fill="none"
              stroke="rgba(180,145,68,0.18)" strokeWidth="2" strokeDasharray="7 8" />

            {/* glow trail */}
            <path d={ROUTE} fill="none" stroke="hsl(40,65%,65%)"
              strokeWidth="12" strokeLinecap="round"
              strokeDasharray={PLEN} strokeDashoffset={PLEN}
              style={{ filter: "blur(9px)" }}>
              <animate attributeName="stroke-dashoffset"
                from={PLEN} to="0" dur="3.8s" repeatCount="indefinite" />
              <animate attributeName="opacity"
                values="0;0.28;0" keyTimes="0;0.55;1" dur="3.8s" repeatCount="indefinite" />
            </path>

            {/* primary gold path */}
            <path d={ROUTE} fill="none" stroke="hsl(36,55%,60%)"
              strokeWidth="2.5" strokeLinecap="round"
              strokeDasharray={PLEN} strokeDashoffset={PLEN}>
              <animate attributeName="stroke-dashoffset"
                from={PLEN} to="0" dur="3.8s" repeatCount="indefinite" />
            </path>

            {/* ── Plane ── */}
            <g>
              <animateMotion dur="3.8s" repeatCount="indefinite" rotate="auto">
                <mpath href="#g2rt" />
              </animateMotion>
              <circle r="13" fill="hsl(36,55%,55%)" opacity="0.22" />
              <polygon points="-11,4.5 12,0 -11,-4.5 -6,0"
                fill="hsl(40,75%,76%)" stroke="hsl(36,55%,58%)" strokeWidth="0.6" />
            </g>

            {/* ── Node: Vietnam ── */}
            <g>
              <circle cx="115" cy="108" r="7" fill="hsl(36,58%,58%)" />
              <circle cx="115" cy="108" r="9" fill="none" stroke="hsl(36,58%,58%)" strokeWidth="1.5">
                <animate attributeName="r" from="9" to="26" dur="2.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.7" to="0" dur="2.6s" repeatCount="indefinite" />
              </circle>
              <text x="115" y="148" textAnchor="middle"
                fill="rgba(255,255,255,0.85)" fontSize="11" fontFamily="inherit">🇻🇳 Ho Chi Minh City</text>
              <text x="115" y="163" textAnchor="middle"
                fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="inherit" fontWeight="600" letterSpacing="1.5">ORIGIN</text>
            </g>

            {/* ── Node: China ── */}
            <g>
              <circle cx="378" cy="84" r="7" fill="hsl(36,58%,58%)" />
              <circle cx="378" cy="84" r="9" fill="none" stroke="hsl(36,58%,58%)" strokeWidth="1.5">
                <animate attributeName="r" from="9" to="26" dur="2.6s" begin="0.9s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.7" to="0" dur="2.6s" begin="0.9s" repeatCount="indefinite" />
              </circle>
              <text x="378" y="68" textAnchor="middle"
                fill="rgba(255,255,255,0.85)" fontSize="11" fontFamily="inherit">🇨🇳 Dongguan</text>
              <text x="378" y="54" textAnchor="middle"
                fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="inherit" fontWeight="600" letterSpacing="1.5">TRANSIT HUB</text>
            </g>

            {/* ── Node: USA ── */}
            <g>
              <circle cx="768" cy="108" r="7" fill="hsl(36,58%,58%)" />
              <circle cx="768" cy="108" r="9" fill="none" stroke="hsl(36,58%,58%)" strokeWidth="1.5">
                <animate attributeName="r" from="9" to="26" dur="2.6s" begin="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.7" to="0" dur="2.6s" begin="1.8s" repeatCount="indefinite" />
              </circle>
              <text x="768" y="148" textAnchor="middle"
                fill="rgba(255,255,255,0.85)" fontSize="11" fontFamily="inherit">🇺🇸 North Carolina</text>
              <text x="768" y="163" textAnchor="middle"
                fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="inherit" fontWeight="600" letterSpacing="1.5">DESTINATION</text>
            </g>
          </svg>
        </div>

        {/* ── PIPELINE ── */}
        <div className="g2-pipe">
          {STEPS.map((s, i) => (
            <div key={i} className="g2-pitem">
              <div className={[
                "g2-card",
                i === active && "g2-card-on",
                i <  active  && "g2-card-done",
              ].filter(Boolean).join(" ")}>
                {i < active && <span className="g2-check">✓</span>}
                <span className="g2-sn">{s.num}</span>
                <span className="g2-ico">{s.emoji}</span>
                <span className="g2-nm">{s.title}</span>
                <span className="g2-ds">{s.desc}</span>
                <span className="g2-bar" />
              </div>
              {i < 4 && (
                <div className={[
                  "g2-conn",
                  i <  active  && "g2-conn-done",
                  i === active && "g2-conn-live",
                ].filter(Boolean).join(" ")} />
              )}
            </div>
          ))}
        </div>

        {/* ── STATS ── */}
        <div className="g2-stats" ref={statsRef}>
          {[
            { suf: "h",  lbl: "Avg fulfillment time" },
            { suf: "%",  lbl: "Order accuracy"       },
            { suf: "+",  lbl: "Daily shipments"      },
          ].map((s, i) => (
            <div key={i} className="g2-stat">
              <span className="g2-sv">{fmt(counts[i], i)}{s.suf}</span>
              <span className="g2-sl">{s.lbl}</span>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="g2-cta-row">
          <a href="https://hub.thgfulfill.com" target="_blank" rel="noopener noreferrer" className="g2-cta">
            <span>Get Started</span>
            <span className="g2-arr">→</span>
            <span className="g2-shine" />
          </a>
          <p className="g2-note">Free onboarding · No minimum volume · Cancel anytime</p>
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   Scoped CSS – all prefixed g2- / g2  (no leakage)
═══════════════════════════════════════════════════════ */
const STYLES = `
.g2 {
  position: relative;
  overflow: hidden;
  padding: 0;
  background: linear-gradient(160deg, hsl(220,46%,7%) 0%, hsl(224,38%,11%) 100%);
}
.g2::before, .g2::after {
  content: '';
  position: absolute;
  left: 0; right: 0;
  height: 90px;
  pointer-events: none;
  z-index: 4;
}
.g2::before { top: 0;    background: linear-gradient(to bottom, hsl(40,20%,97%), transparent); }
.g2::after  { bottom: 0; background: linear-gradient(to top,    hsl(40,20%,97%), transparent); }

.g2-glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(110px);
}
.g2-glow-a {
  width: 560px; height: 560px;
  top: -160px; left: -120px;
  background: rgba(160,115,50,0.12);
}
.g2-glow-b {
  width: 440px; height: 440px;
  bottom: -100px; right: -80px;
  background: rgba(60,80,180,0.09);
}

.g2-wrap {
  position: relative;
  z-index: 3;
  max-width: 1100px;
  margin: 0 auto;
  padding: 6.5rem 1.5rem 6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3.5rem;
}

/* Header */
.g2-hd { text-align: center; }
.g2-eye {
  display: inline-block;
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.24em;
  color: hsl(36,58%,62%);
  margin-bottom: 0.65rem;
}
.g2-h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 0.75rem;
}
.g2-gold {
  background: linear-gradient(130deg, hsl(36,55%,58%) 0%, hsl(42,68%,74%) 50%, hsl(36,55%,58%) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  background-size: 200% auto;
  animation: g2GoldShift 4s linear infinite;
}
@keyframes g2GoldShift {
  0%   { background-position: 0% center; }
  100% { background-position: 200% center; }
}
.g2-sub {
  font-size: 0.97rem;
  color: rgba(255,255,255,0.46);
  max-width: 490px;
  margin: 0 auto;
  line-height: 1.65;
}

/* Map */
.g2-map-wrap {
  width: 100%;
  max-width: 880px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 20px;
  background: rgba(15,20,40,0.55);
  border: 1px solid rgba(255,255,255,0.06);
  padding: 0.5rem 0;
}
.g2-map {
  width: 100%;
  min-width: 560px;
  height: auto;
  display: block;
}

/* Pipeline */
.g2-pipe {
  display: flex;
  align-items: center;
  width: 100%;
}
.g2-pitem {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.g2-card {
  flex: 1;
  min-width: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.3rem 0.6rem 1.4rem;
  border-radius: 16px;
  background: hsl(220,36%,13%);
  border: 1px solid rgba(255,255,255,0.07);
  gap: 5px;
  overflow: hidden;
  transition: border-color 0.35s, background 0.35s, box-shadow 0.35s;
  cursor: default;
  user-select: none;
}
.g2-card-on {
  background: hsl(220,34%,16%);
  border-color: rgba(190,148,72,0.6);
  animation: g2CardPulse 2.4s ease-in-out infinite;
}
.g2-card-done {
  border-color: rgba(80,170,110,0.32);
}
@keyframes g2CardPulse {
  0%,100% { box-shadow: 0 0 0 1px rgba(190,148,72,0.1), 0 6px 30px rgba(140,100,40,0.18); }
  50%     { box-shadow: 0 0 0 2px rgba(210,172,90,0.28), 0 14px 44px rgba(140,100,40,0.34); }
}

.g2-check {
  position: absolute;
  top: 7px; right: 9px;
  font-size: 0.65rem;
  font-weight: 800;
  color: hsl(140,52%,54%);
}
.g2-sn {
  font-size: 0.57rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: hsl(36,58%,60%);
  opacity: 0.7;
}
.g2-ico {
  font-size: 1.7rem;
  line-height: 1;
  transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  margin: 2px 0;
}
.g2-card-on .g2-ico  { transform: scale(1.22) translateY(-2px); }
.g2-card-done .g2-ico { opacity: 0.5; }

.g2-nm {
  font-size: 0.7rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
}
.g2-card-done .g2-nm { color: rgba(255,255,255,0.4); }

.g2-ds {
  font-size: 0.58rem;
  color: rgba(255,255,255,0.3);
  line-height: 1.45;
}

.g2-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: hsl(36,60%,62%);
  transform: scaleX(0);
  transform-origin: left center;
  border-radius: 0 0 2px 2px;
}
.g2-card-on .g2-bar {
  animation: g2BarFill 2.4s linear infinite;
}
@keyframes g2BarFill {
  0%   { transform: scaleX(0); opacity: 1; }
  72%  { transform: scaleX(1); opacity: 1; }
  100% { transform: scaleX(1); opacity: 0; }
}

/* Connectors */
.g2-conn {
  width: 18px;
  flex-shrink: 0;
  height: 2px;
  background: rgba(255,255,255,0.08);
  position: relative;
  overflow: hidden;
  transition: background 0.4s;
}
.g2-conn-done { background: hsl(36,48%,44%); }
.g2-conn-live::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, hsl(40,68%,70%), transparent);
  animation: g2Flow 0.9s linear infinite;
}
@keyframes g2Flow {
  from { transform: translateX(-100%); }
  to   { transform: translateX(200%); }
}

/* Stats */
.g2-stats {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}
.g2-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 1.3rem 1.9rem;
  background: hsl(220,36%,13%);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  min-width: 115px;
}
.g2-sv {
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1;
  background: linear-gradient(130deg, hsl(36,55%,58%), hsl(42,68%,74%));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.g2-sl {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.4);
  font-weight: 500;
  white-space: nowrap;
}

/* CTA */
.g2-cta-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
}
.g2-cta {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 1rem 2.6rem;
  border-radius: 9999px;
  background: hsl(36,52%,48%);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  overflow: hidden;
  transition: background 0.22s, transform 0.22s, box-shadow 0.22s;
  box-shadow: 0 4px 28px rgba(140,100,40,0.45);
  letter-spacing: 0.01em;
}
.g2-cta:hover {
  background: hsl(36,56%,40%);
  transform: translateY(-2px);
  box-shadow: 0 10px 42px rgba(140,100,40,0.56);
}
.g2-arr { font-size: 1.1rem; transition: transform 0.22s; }
.g2-cta:hover .g2-arr { transform: translateX(5px); }

.g2-shine {
  position: absolute;
  top: 0; left: -80%;
  width: 50%;
  height: 100%;
  background: linear-gradient(118deg, transparent 28%, rgba(255,255,255,0.22) 50%, transparent 72%);
  transform: skewX(-22deg);
  animation: g2Shine 4.2s ease-in-out infinite;
}
@keyframes g2Shine {
  0%   { left: -80%; }
  32%  { left: 130%; }
  100% { left: 130%; }
}
.g2-note {
  font-size: 0.74rem;
  color: rgba(255,255,255,0.3);
  letter-spacing: 0.03em;
}

/* Responsive */
@media (max-width: 820px) {
  .g2-pipe { flex-wrap: wrap; gap: 0.5rem; justify-content: center; }
  .g2-pitem { flex: 0 0 calc(33.333% - 0.4rem); }
  .g2-conn  { display: none; }
  .g2-wrap  { gap: 2.8rem; }
}
@media (max-width: 520px) {
  .g2-pitem { flex: 0 0 calc(50% - 0.4rem); }
  .g2-wrap  { gap: 2.2rem; padding: 5.5rem 1rem 5rem; }
}
@media (max-width: 380px) {
  .g2-pitem { flex: 0 0 100%; }
}
`;
