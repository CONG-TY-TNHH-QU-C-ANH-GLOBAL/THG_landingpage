// The world the camera walks through — eleven gates, a running floor, two lanes and the far door,
// built entirely from CSS 3D transforms.
//
// WHY NOT WebGL: the reference prototype draws this with three.js and a real shadow map. Ported
// literally that is a ~600KB runtime dependency plus a WebGL context on the homepage of an
// otherwise static, SSG marketing site — and the app has no 3D dependency today. Every element the
// direction actually depends on survives the translation: one-point perspective, gates sweeping
// past the sides of the face, contact shadows on the floor (::after planes, rotated flat), the gold
// threshold sill under each gate, running floor dashes for speed, centre-weighted fog, the roof
// opening on the Express lane and the lanes lighting under the seller's choice. What is lost is a
// physically-lit shadow map. That trade — architecture over literal mockup — is the documented
// rule for this integration.
//
// Purely presentational: no state, no effects. The track sets --cam-z/--cam-x and toggles
// data-near; everything else is markup.
import { GATE_COUNT } from "../model/gates";
import styles from "./corridor.module.css";

interface CorridorSceneProps {
  /** Gate elements are handed back so the track can flip `data-near` without re-rendering. */
  readonly gateRef: (index: number, element: HTMLDivElement | null) => void;
  readonly stageRef: React.Ref<HTMLDivElement>;
  /** Lit lane: the sourcing choice lights the left, the delivery lane the right. */
  readonly leftLaneActive: boolean;
  readonly rightLaneActive: boolean;
  /** Express opens the roof from gate 07 onward. */
  readonly roofOpenFromIndex: number | null;
  /** Lateral camera offset in WORLD UNITS, derived from the seller's answers; the scene converts
   *  it to px against --u so the gesture is the same size relative to the corridor everywhere. */
  readonly strafeUnits: number;
  /** Degrees the camera turns back toward the corridor axis while offset. */
  readonly yaw: number;
}

export function CorridorScene({
  gateRef,
  stageRef,
  leftLaneActive,
  rightLaneActive,
  roofOpenFromIndex,
  strafeUnits,
  yaw,
}: CorridorSceneProps) {
  return (
    <div className={styles.scene} aria-hidden="true">
      {/* Lateral strafe is its own layer with its own CSS transition, so the answer-driven lane
          change eases by itself and the scroll-driven depth below it never has to be animated. */}
      <div
        className={styles.strafe}
        style={
          {
            "--cam-x": `calc(${strafeUnits} * var(--u))`,
            "--cam-yaw": yaw.toFixed(2),
          } as React.CSSProperties
        }
      >
        <div ref={stageRef} className={styles.stage} style={{ "--gate-count": GATE_COUNT } as React.CSSProperties}>
          <div className={styles.floor} />
          <div className={`${styles.lane} ${styles.laneLeft}`} data-active={leftLaneActive} />
          <div className={`${styles.lane} ${styles.laneRight}`} data-active={rightLaneActive} />

          {Array.from({ length: GATE_COUNT }, (_, index) => (
            <div
              key={index}
              ref={(element) => gateRef(index, element)}
              className={styles.gate}
              style={{ "--i": index } as React.CSSProperties}
              data-roofless={roofOpenFromIndex !== null && index >= roofOpenFromIndex}
            >
              <span className={`${styles.pillar} ${styles.pillarLeft}`} />
              <span className={`${styles.pillar} ${styles.pillarRight}`} />
              <span className={styles.beam} />
              <span className={styles.sill} />
            </div>
          ))}

          <div className={styles.door} />
        </div>
      </div>
    </div>
  );
}
