"use client";

// Ported from the approved Open Design artifact
// (homepage-concept-global-fulfillment-orbit.html #heroScene / #globeStage script) —
// see IMPLEMENTATION_BASELINE.md "Motion phases and interaction rules" for the P1-P4
// spec this mirrors. Client island boundary (WEB-001A): receives only pre-rendered,
// serializable layer content as props — no data fetching, no CMS import here (enforced
// by tests/architecture/home-content-boundaries.test.ts "no Client Component imports the
// home server loaders"). The server-rendered markup below IS the complete static/
// reduced-motion scene; this effect only ever adds the "motionOn" class and inline
// transforms post-hydration, so first paint and hydration always match.
//
// The scrolling headline/CTA column (#hero-copy) is rendered by the Server Component
// sibling (hero-section.tsx), not by this island — mirroring the source script's own
// `document.getElementById('heroCopy')` lookup rather than threading a ref across the
// server/client boundary, which would force the whole hero into a client component.
import { useEffect, useRef } from "react";
import styles from "./hero-parallax-scene.module.css";

interface HeroParallaxNodeContent {
  readonly value: string;
  readonly caption: string;
}

interface HeroParallaxSceneProps {
  readonly imageSrc: string;
  readonly imageSrcAvif: string;
  readonly imageSrcWebp: string;
  readonly imageAlt: string;
  /** Always active (p >= 0) — Vietnam/China is the always-on regional anchor. */
  readonly apac: HeroParallaxNodeContent;
  /** Activates at scroll progress 0.20, per the approved P2 phase mapping. */
  readonly us: HeroParallaxNodeContent;
  /** Activates at scroll progress 0.30, per the approved P2 phase mapping. */
  readonly eu: HeroParallaxNodeContent;
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
function smoothstep(a: number, b: number, x: number): number {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

const US_EU_ROUTE = "M70,150 Q200,40 330,90";
const US_APAC_ROUTE = "M70,150 Q160,260 330,300";
const EU_APAC_ROUTE = "M330,90 Q380,190 330,300";

export function HeroParallaxScene({ imageSrc, imageSrcAvif, imageSrcWebp, imageAlt, apac, us, eu }: HeroParallaxSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const globeTiltRef = useRef<HTMLDivElement>(null);
  const lGlobeRef = useRef<HTMLDivElement>(null);
  const lGridRef = useRef<HTMLDivElement>(null);
  const lRoutesRef = useRef<HTMLDivElement>(null);
  const lNodesRef = useRef<HTMLDivElement>(null);
  const lFgRef = useRef<HTMLDivElement>(null);
  const routeUsEuRef = useRef<SVGPathElement>(null);
  const routeUsApacRef = useRef<SVGPathElement>(null);
  const routeEuApacRef = useRef<SVGPathElement>(null);
  const dotARef = useRef<SVGCircleElement>(null);
  const dotBRef = useRef<SVGCircleElement>(null);
  const nodeUsRef = useRef<HTMLDivElement>(null);
  const nodeEuRef = useRef<HTMLDivElement>(null);
  const nodeApacRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = sceneRef.current;
    const stage = stageRef.current;
    if (reduceMotion || !scene || !stage || !("IntersectionObserver" in window)) return;

    scene.classList.add(styles.motionOn);

    const heroCopy = document.getElementById("hero-copy");
    const globeTilt = globeTiltRef.current;
    const lGlobe = lGlobeRef.current;
    const lGrid = lGridRef.current;
    const lRoutes = lRoutesRef.current;
    const lNodes = lNodesRef.current;
    const lFg = lFgRef.current;
    const routePaths = [routeUsEuRef.current, routeUsApacRef.current, routeEuApacRef.current].filter(
      (el): el is SVGPathElement => el !== null,
    );
    const dots = [dotARef.current, dotBRef.current].filter((el): el is SVGCircleElement => el !== null);
    const nodes = [
      { el: nodeUsRef.current, activeAt: 0.2 },
      { el: nodeEuRef.current, activeAt: 0.3 },
      { el: nodeApacRef.current, activeAt: 0 },
    ].filter((n): n is { el: HTMLDivElement; activeAt: number } => n.el !== null);
    if (!globeTilt || !lGlobe || !lGrid || !lRoutes || !lNodes || !lFg) return;

    let heroInView = true;
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) heroInView = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    visibilityObserver.observe(scene);

    let depthScale = 1;
    function readDepthScale() {
      const v = Number.parseFloat(getComputedStyle(scene as HTMLDivElement).getPropertyValue("--depth-scale"));
      depthScale = Number.isNaN(v) ? 1 : v;
    }
    readDepthScale();

    // Pointer state — secondary to scroll, capped, desktop fine-pointer only (WEB-001A:
    // "mobile không pointer parallax"), smoothed via CSS transition rather than a
    // persistent rAF loop.
    let ptrX = 0;
    let ptrY = 0;
    const onPointerMove = (e: MouseEvent) => {
      if (!heroInView) return;
      const r = stage.getBoundingClientRect();
      ptrX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ptrY = ((e.clientY - r.top) / r.height - 0.5) * 2;
      render();
    };
    const onPointerLeave = () => {
      ptrX = 0;
      ptrY = 0;
      render();
    };
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (finePointer) {
      stage.addEventListener("mousemove", onPointerMove);
      stage.addEventListener("mouseleave", onPointerLeave);
    }

    function computeProgress(): number {
      const rect = scene!.getBoundingClientRect();
      const total = scene!.offsetHeight - window.innerHeight;
      if (total <= 0) return 1;
      return clamp01(-rect.top / total);
    }

    function render() {
      const p = computeProgress();
      const ds = depthScale;

      lGrid!.style.transform = `translateY(${(p * 14 * ds).toFixed(1)}px)`;
      lGrid!.style.opacity = String(1 - smoothstep(0.78, 1, p) * 0.6);

      lRoutes!.style.transform = `translateY(${(p * 22 * ds).toFixed(1)}px)`;
      for (const path of routePaths) {
        const start = Number.parseFloat(path.dataset.revealStart ?? "0");
        const end = Number.parseFloat(path.dataset.revealEnd ?? "1");
        const revealed = smoothstep(start, end, p);
        path.style.opacity = String(revealed * 0.55);
        path.classList.toggle(styles.pulse, revealed >= 1 && heroInView && p < 0.88);
      }

      const scaleUp = lerp(0.9, 1.04, smoothstep(0, 0.5, p));
      const settle = lerp(0, 0.04, smoothstep(0.5, 0.78, p));
      const recede = lerp(0, 0.1, smoothstep(0.78, 1, p));
      const scale = scaleUp - settle - recede;
      const rotBase = lerp(-4, 4, smoothstep(0, 1, p));
      const rotY = rotBase + ptrX * 2.5;
      const rotX = -ptrY * 2.5;
      globeTilt!.style.transform = `scale(${scale.toFixed(3)}) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`;
      lGlobe!.style.transform = `translateY(${((p * 18 + smoothstep(0.78, 1, p) * 14) * ds).toFixed(1)}px)`;

      lNodes!.style.transform = `translateY(${(p * 30 * ds).toFixed(1)}px)`;
      for (const node of nodes) {
        node.el.classList.toggle(styles.active, p >= node.activeAt);
      }

      lFg!.style.transform = `translate(${(ptrX * 8).toFixed(1)}px, ${(p * 40 * ds).toFixed(1)}px)`;
      lFg!.style.opacity = String(0.5 * (1 - smoothstep(0.85, 1, p)));

      const dotsActive = heroInView && p > 0.28 && p < 0.86;
      for (const dot of dots) dot.style.animationPlayState = dotsActive ? "running" : "paused";

      if (heroCopy) {
        const headlineOpacity = 1 - smoothstep(0.8, 1, p) * 0.85;
        heroCopy.style.transform = `translateY(-${(p * 10).toFixed(1)}px)`;
        heroCopy.style.opacity = String(headlineOpacity);
        heroCopy.style.pointerEvents = headlineOpacity < 0.2 ? "none" : "";
      }
    }

    let scrollScheduled = false;
    const onScroll = () => {
      if (scrollScheduled) return;
      scrollScheduled = true;
      requestAnimationFrame(() => {
        scrollScheduled = false;
        render();
      });
    };
    let resizeScheduled = false;
    const onResize = () => {
      if (resizeScheduled) return;
      resizeScheduled = true;
      requestAnimationFrame(() => {
        resizeScheduled = false;
        readDepthScale();
        render();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    render();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (finePointer) {
        stage.removeEventListener("mousemove", onPointerMove);
        stage.removeEventListener("mouseleave", onPointerLeave);
      }
      visibilityObserver.disconnect();
    };
  }, []);

  return (
    <div ref={sceneRef} className={styles.heroScene} data-testid="hero-parallax-scene">
      <div ref={stageRef} className={styles.globeStage} data-testid="hero-globe-stage">
        {/* Layer 1: coordinate atmosphere */}
        <div ref={lGridRef} className={`${styles.globeLayer} ${styles.lGrid}`} />
        {/* Layer 2: global route network — each path reveals (opacity) across its own
            scroll-progress window, then pulses once fully drawn and in view */}
        <div ref={lRoutesRef} className={`${styles.globeLayer} ${styles.lRoutes}`}>
          <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
            <path ref={routeUsEuRef} className={styles.routePath} data-reveal-start="0.40" data-reveal-end="0.55" d={US_EU_ROUTE} />
            <path ref={routeUsApacRef} className={styles.routePath} data-reveal-start="0.20" data-reveal-end="0.36" d={US_APAC_ROUTE} />
            <path ref={routeEuApacRef} className={styles.routePath} data-reveal-start="0.30" data-reveal-end="0.48" d={EU_APAC_ROUTE} />
            <circle ref={dotARef} className={`${styles.shipmentDot} ${styles.a}`} r="3.2">
              <animateMotion dur="5.2s" repeatCount="indefinite" path={US_EU_ROUTE} />
            </circle>
            <circle ref={dotBRef} className={`${styles.shipmentDot} ${styles.b}`} r="3.2">
              <animateMotion dur="6.4s" repeatCount="indefinite" path={US_APAC_ROUTE} />
            </circle>
          </svg>
        </div>
        {/* Layer 3: the globe (real asset) — principal visual anchor */}
        <div ref={lGlobeRef} className={`${styles.globeLayer} ${styles.lGlobe}`}>
          <div ref={globeTiltRef} className={styles.globeTilt}>
            <div className={styles.globeGlow} />
            <div className={styles.globeImgWrap}>
              <picture>
                <source srcSet={imageSrcAvif} type="image/avif" />
                <source srcSet={imageSrcWebp} type="image/webp" />
                <img src={imageSrc} alt={imageAlt} width={1024} height={1024} fetchPriority="high" decoding="async" />
              </picture>
            </div>
          </div>
        </div>
        {/* Layer 4: warehouse nodes + operational labels, attached to their route */}
        <div ref={lNodesRef} className={`${styles.globeLayer} ${styles.lNodes}`}>
          <div ref={nodeUsRef} className={`${styles.node} ${styles.nodeUs}`}>
            <span className={styles.nodeDot} />
            <span className={styles.nodeChip}>
              <strong>{us.value}</strong> {us.caption}
            </span>
          </div>
          <div ref={nodeEuRef} className={`${styles.node} ${styles.nodeEu}`}>
            <span className={styles.nodeDot} />
            <span className={styles.nodeChip}>
              <strong>{eu.value}</strong> {eu.caption}
            </span>
          </div>
          <div ref={nodeApacRef} className={`${styles.node} ${styles.nodeApac}`}>
            <span className={styles.nodeChip}>
              {apac.value} — {apac.caption}
            </span>
          </div>
        </div>
        {/* Layer 5: restrained foreground depth marker, fastest layer */}
        <div ref={lFgRef} className={`${styles.globeLayer} ${styles.lFg}`} />
      </div>
    </div>
  );
}
