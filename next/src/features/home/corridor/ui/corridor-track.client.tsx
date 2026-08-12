"use client";

// 01 · Hành lang — the walk itself.
//
// Progressive enhancement, same contract as the existing hero parallax island: the markup rendered
// below IS the complete, readable corridor (eleven articles and their questions, in order). The
// `motion` class is added after mount, and only when motion is allowed — it is what converts that
// list into the pinned camera walk. No-JS and prefers-reduced-motion get the list, never a blank
// screen. Nothing here fetches; it receives only serializable content.
import { useEffect, useRef, useState } from "react";

import { localize } from "@/shared/i18n";
import { CORRIDOR } from "../content";
import { CORRIDOR_GATES, GATE_COUNT } from "../model/gates";
import { CORRIDOR_ASKS, LANE_EXPRESS, LANE_WAREHOUSE, SOURCE_DROP, SOURCE_POD } from "../model/questions";
import { CorridorAsk } from "./corridor-ask";
import { CorridorScene } from "./corridor-scene";
import { useCorridor } from "./corridor-provider.client";
import styles from "./corridor.module.css";

// Camera timing, ported from the reference. The walk does not run at constant speed: it dwells at
// each gate for the first third of that gate's scroll budget and then glides to the next one, which
// is what makes eleven stops read as eleven stops rather than one long slide.
const ENTRY = 0.05;
const EXIT = 0.93;
// Share of each gate's scroll budget the camera spends parked at it before gliding on. The
// reference used 0.34; at 0.5 the stops are longer than the glides, so for most of the scroll
// exactly one gate is legible — which is what "camera dừng ở từng cổng" actually promises, and what
// keeps two headlines off a narrow viewport where the panel is full width.
const DWELL = 0.5;
// ── The camera ───────────────────────────────────────────────────────────────────────────────
//
// Modelled in the reference's own world units rather than in pixels, because the thing that makes
// a corridor read as a corridor is a RATIO, not a size: the camera stands 7 units back from a gate
// that is 7 tall and 10 wide, spaced 9 apart. Hold that and the gate fills the frame and its
// pillars sweep the edges at every viewport; lose it — as the earlier fixed 720×430 box did — and
// the same geometry renders as a small card floating in the middle of the screen, which is exactly
// what "looks like 2D layers" means.
//
// This module owns --u, the perspective and the perspective origin together, because all three are
// functions of the viewport that only make sense in agreement. corridor.module.css consumes them.

/** Vertical field of view, per the reference camera (three.js `cam.fov`). */
const FOV_WIDE = 50;
const FOV_NARROW = 62; // ≤1000px — a long lens in a narrow frame flattens the walk
const FOV_ULTRAWIDE = 46; // aspect > 2.1
/** World unit as a share of viewport height. Free parameter: the projection is identical for any
 *  value, so this only sets how deep into the CSS z-space the corridor is laid out. */
const UNIT_RATIO = 0.2;
/** Camera lateral offset per answered dimension, in world units (reference: 2.4 and 2.6). */
const STRAFE_SOURCE = 2.4;
const STRAFE_LANE = 2.6;
/** The reference aims at `camX * 0.55` sixteen units ahead, so the camera turns partway back
 *  toward the corridor axis as it changes lane. */
const LOOK_AHEAD = 16;
const LOOK_PULL = 0.45;

interface World {
  /** CSS perspective in px — sets how much of the frame a gate fills (fill = perspective / H). */
  perspective: number;
  /** World unit in px. */
  unit: number;
  /** Px the finished projection slides right, clearing the copy panel (reference setViewOffset). */
  viewOffset: number;
}

/** The panel's own width and the page gutter, mirroring the CSS that lays them out — the reference
 *  derives its view offset from exactly these two so the corridor clears the copy by the same
 *  margin at any width. */
function panelMetrics(w: number) {
  const gutter = Math.max(Math.min(Math.max(20, w * 0.045), 72), (w - 1520) / 2);
  const panel = Math.min(Math.max(300, w * 0.3), 420);
  return gutter + panel;
}

function readWorld(): World {
  const h = window.innerHeight;
  const w = window.innerWidth;
  const narrow = w <= 1000;
  const fov = narrow ? FOV_NARROW : w / h > 2.1 ? FOV_ULTRAWIDE : FOV_WIDE;
  return {
    perspective: h / 2 / Math.tan((fov * Math.PI) / 360),
    unit: h * UNIT_RATIO,
    // Below 1000px the panel goes full width and the corridor recentres — no offset.
    viewOffset: narrow ? 0 : Math.min(panelMetrics(w) * 0.52, w * 0.2),
  };
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Quintic smoothstep — the reference's `smoother`. */
const smoother = (x: number) => x * x * x * (x * (x * 6 - 15) + 10);

/** Float gate position (0 … GATE_COUNT-1) for a 0–1 scroll progress, with the per-gate dwell. */
export function gatePosition(progress: number): number {
  const u = clamp01((progress - ENTRY) / (EXIT - ENTRY)) * (GATE_COUNT - 1);
  const index = Math.floor(u);
  if (index >= GATE_COUNT - 1) return GATE_COUNT - 1;
  return index + smoother(clamp01((u - index - DWELL) / (1 - DWELL)));
}

/** How present gate `index` is at a given camera position, 0–1. A narrow Gaussian: mid-glide two
 *  neighbours do overlap, but only briefly and faintly — wide enough and two headlines sit on top
 *  of each other, which is unreadable on a narrow viewport where the panel is full-width. */
export function gatePresence(position: number, index: number): number {
  return Math.exp(-Math.pow((position - index) / 0.34, 2));
}

export function CorridorTrack() {
  const { lang, answers, setAsk } = useCorridor();
  const trackRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const tickRefs = useRef<(HTMLLIElement | null)[]>([]);
  const gateRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Which question is currently at the camera. -1 = none. Set from the scroll loop, but only when
  // it actually changes, so a whole walk costs a handful of renders rather than one per frame.
  const [openAsk, setOpenAsk] = useState(-1);
  // Skipping is not render state — nothing displays it — so it lives in a ref the scroll loop can
  // read without being torn down and rebuilt every time a question is dismissed.
  const skippedRef = useRef<Set<number>>(new Set());
  const openAskRef = useRef(-1);

  function skipAsk(index: number) {
    skippedRef.current.add(index);
    openAskRef.current = -1;
    setOpenAsk(-1);
  }

  useEffect(() => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    const stage = stageRef.current;
    if (!track || !sticky || !stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    track.classList.add(styles.motion);

    let world = readWorld();
    function applyWorld() {
      world = readWorld();
      const scene = stage!.closest(`.${styles.scene}`) as HTMLElement | null;
      if (!scene) return;
      scene.style.perspective = `${world.perspective.toFixed(1)}px`;
      scene.style.setProperty("--u", `${world.unit.toFixed(2)}px`);
      // The offset moves this element, so the haze inside it rides along and stays on the
      // vanishing point without any correction of its own.
      scene.style.setProperty("--view-offset", `${world.viewOffset.toFixed(1)}px`);
    }
    applyWorld();

    const nearState: boolean[] = new Array(GATE_COUNT).fill(false);
    const hitState: boolean[] = new Array(GATE_COUNT).fill(false);
    const passedState: boolean[] = new Array(GATE_COUNT).fill(false);

    function render() {
      const travel = track!.offsetHeight - window.innerHeight;
      const progress = travel <= 0 ? 0 : clamp01(-track!.getBoundingClientRect().top / travel);
      const position = gatePosition(progress);

      // Keep the eye exactly 7 units off the gate being read. In CSS the viewer sits `perspective`
      // in front of the z = 0 plane, so eye-to-gate = perspective + (gateZ - camZ); solving that
      // for 7u gives the line below. It is the whole camera.
      stage!.style.setProperty(
        "--cam-z",
        (world.perspective + (9 * position - 7) * world.unit).toFixed(1),
      );

      for (let i = 0; i < GATE_COUNT; i += 1) {
        const presence = gatePresence(position, i);

        const step = stepRefs.current[i];
        if (step) {
          step.style.opacity = presence.toFixed(3);
          step.style.transform = `translateY(calc(-50% + ${((1 - presence) * 14).toFixed(1)}px))`;
        }

        const hit = presence > 0.45;
        if (hit !== hitState[i]) {
          hitState[i] = hit;
          tickRefs.current[i]?.setAttribute("data-hit", String(hit));
        }

        const near = Math.abs(position - i) < 0.9;
        if (near !== nearState[i]) {
          nearState[i] = near;
          gateRefs.current[i]?.setAttribute("data-near", String(near));
        }

        // Near clipping plane, done by hand — see the .gate[data-passed] rule. 0.45 of a gate past
        // the camera the geometry is already wider than the frame, so it contributes nothing but
        // its beam sliding across the top as an opaque slab. That artefact is worst on narrow
        // viewports, where the 62° lens engulfs the gate entirely.
        const passed = position - i > 0.45;
        if (passed !== passedState[i]) {
          passedState[i] = passed;
          gateRefs.current[i]?.setAttribute("data-passed", String(passed));
        }
      }

      const found = CORRIDOR_ASKS.findIndex(
        (ask, i) => !skippedRef.current.has(i) && Math.abs(position - ask.atGateIndex) < 0.3,
      );
      if (found !== openAskRef.current) {
        openAskRef.current = found;
        setOpenAsk(found);
      }
    }

    let scheduled = false;
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        render();
      });
    };
    const onResize = () => {
      applyWorld();
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    render();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Answer-driven camera — plain derived values, no scroll involved. Expressed in world units and
  // converted to px by the scene, so a lane change moves the camera the same distance relative to
  // the corridor at every viewport.
  const strafeUnits =
    (answers.source === SOURCE_POD ? -STRAFE_SOURCE : answers.source === SOURCE_DROP ? STRAFE_SOURCE : 0) +
    (answers.lane === LANE_EXPRESS ? -STRAFE_LANE : answers.lane === LANE_WAREHOUSE ? STRAFE_LANE : 0);
  // Turning back toward the axis by LOOK_PULL of the offset, LOOK_AHEAD units out.
  const yaw = -(Math.atan2(strafeUnits * LOOK_PULL, LOOK_AHEAD) * 180) / Math.PI;

  return (
    <section
      ref={trackRef}
      id="corridor"
      className={styles.track}
      aria-label={localize(lang, CORRIDOR.regionLabel)}
    >
      <div ref={stickyRef} className={styles.sticky} data-asking={openAsk >= 0}>
        <CorridorScene
          stageRef={stageRef}
          gateRef={(index, element) => {
            gateRefs.current[index] = element;
          }}
          leftLaneActive={answers.source === SOURCE_POD || answers.lane === LANE_EXPRESS}
          rightLaneActive={answers.source === SOURCE_DROP || answers.lane === LANE_WAREHOUSE}
          roofOpenFromIndex={answers.lane === LANE_EXPRESS ? 6 : null}
          strafeUnits={strafeUnits}
          yaw={yaw}
        />
        <div className={styles.corridorWash} aria-hidden="true" />

        <div className={styles.panel}>
          <ol className={styles.panelPin}>
            {CORRIDOR_GATES.map((gate, index) => (
              <li key={gate.number}>
                <article
                  ref={(element) => {
                    stepRefs.current[index] = element;
                  }}
                  className={styles.step}
                >
                  <span className={styles.stepCount}>
                    {localize(lang, CORRIDOR.counter).replace("{n}", String(gate.number).padStart(2, "0"))}
                  </span>
                  <h2 className={styles.stepTitle}>{localize(lang, gate.title)}</h2>
                  <p className={styles.stepOwned}>{localize(lang, gate.owned)}</p>
                  <div className={styles.stepBreak}>
                    <span className={styles.stepBreakLabel}>{localize(lang, CORRIDOR.breakLabel)}</span>
                    <p className={styles.stepBreakBody}>
                      {localize(lang, gate.breakTitle)} — {localize(lang, gate.breakBody)}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>

        {/* The three in-corridor questions are siblings of the panel, not children of it: under
            `motion` each rises as a card anchored to the viewport, and its containing block has to
            be the pinned frame rather than the (transformed) copy stack. Statically they fall
            after the eleven gates and still write to exactly the same answers. */}
        {CORRIDOR_ASKS.map((ask, askIndex) => (
          <CorridorAsk
            key={ask.field}
            lang={lang}
            ask={ask}
            selected={answers[ask.field]}
            open={openAsk === askIndex}
            onChoose={(value) => setAsk(ask.field, value)}
            onSkip={() => skipAsk(askIndex)}
          />
        ))}

        <ol className={styles.ruler} aria-label={localize(lang, CORRIDOR.depthRulerLabel)}>
          {CORRIDOR_GATES.map((gate, index) => (
            <li
              key={gate.number}
              ref={(element) => {
                tickRefs.current[index] = element;
              }}
              className={styles.rulerTick}
              data-hit="false"
            >
              <span>{String(gate.number).padStart(2, "0")}</span>
              <i />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
