// THE SIGNAL BAR — the device that says "this system is running", and the only one that may.
//
// Presentational only. It receives a reading and renders it; it never fetches, polls, subscribes or
// holds state. Antigravity owns the transport and the client state; this file owns what truth looks
// like once it arrives.
//
// ── THE HONESTY LADDER ────────────────────────────────────────────────────────────────────────────
// A live indicator that keeps claiming LIVE after its connection drops is worse than no indicator at
// all, so the degradation is designed rather than left to chance:
//
//   live     < 30s   "LIVE"          dot breathing        UPDATED 12s AGO
//   stale    > 90s   "STALE"         dot hollow, still    LAST SEEN 4m AGO
//   offline          "UNAVAILABLE"   no dot               SIGNAL LOST   (last values greyed)
//   unknown  SSR     "——"            no dot               no timestamp
//
// The timestamp always counts up. It is never frozen at a last-good value, because a frozen clock is
// the most convincing lie a status bar can tell.
//
// The bar renders completely in the `unknown` state, which is what the server produces. Live state
// DECORATES a finished page; it never constitutes one.
import { StateChip, type SignalFreshness } from "./state-chip";

/** One production location, as served by the Experience API. Every field nullable. */
export interface ProductionNode {
  id: string;
  label: string;
  /** A closed set, so the UI never has to interpret free text. */
  availability: "ACCEPTING" | "PAUSED" | "UNAVAILABLE" | null;
}

/** One sales-channel integration. `connected: null` means the reading is absent, not that it is down. */
export interface ChannelLink {
  id: string;
  label: string;
  connected: boolean | null;
}

export interface SignalReading {
  freshness: SignalFreshness | "unknown";
  nodes: readonly ProductionNode[];
  channels: readonly ChannelLink[];
  hubReachable: boolean | null;
  /** Pre-formatted by the caller — this component never reads a clock. */
  observedLabel: string | null;
}

export interface SignalBarCopy {
  live: string;
  stale: string;
  offline: string;
  unknown: string;
  regionLabel: string;
  hub: string;
  channels: string;
  lastSeen: string;
}

interface Props {
  reading: SignalReading;
  copy: SignalBarCopy;
  /** Session context, once the visitor has set a lens. Rendered on the projected plane. */
  lens?: string | null;
  /** The handoff reference, once a plan has resolved. */
  payloadRef?: string | null;
}

const STATUS_WORD: Readonly<Record<SignalReading["freshness"], keyof SignalBarCopy>> = {
  live: "live",
  stale: "stale",
  offline: "offline",
  unknown: "unknown",
};

export function SignalBar({ reading, copy, lens, payloadRef }: Readonly<Props>) {
  const { freshness, nodes, channels, hubReachable, observedLabel } = reading;
  const isReading = freshness === "live" || freshness === "stale";
  // Once the signal is lost the last values stay on screen but recede, and the label says why. Hiding
  // them would lose information; presenting them at full strength would misrepresent their age.
  const valueTone = isReading ? "text-foreground" : "text-muted-foreground";

  const connected = channels.filter((c) => c.connected === true).length;
  const countable = channels.filter((c) => c.connected !== null).length;

  return (
    <section
      aria-label={copy.regionLabel}
      className="w-full border-b border-border bg-card/60 backdrop-blur-none"
    >
      <div className="container mx-auto flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2 md:px-8">
        {/* Status word. Never "LIVE" unless the reading is actually fresh. */}
        <StateChip
          plane={freshness === "unknown" ? "unknown" : "system"}
          freshness={freshness === "unknown" ? "offline" : freshness}
        >
          {copy[STATUS_WORD[freshness]]}
        </StateChip>

        {/* Production nodes, abbreviated. The full table lives in the surface movement below. */}
        {nodes.length > 0 ? (
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 m-0 p-0 list-none">
            {nodes.map((node) => (
              <li
                key={node.id}
                className={`font-mono text-[length:var(--step-label)] uppercase tracking-[0.1em] ${valueTone}`}
              >
                <span>{node.label}</span>{" "}
                <span className={node.availability ? "" : "text-muted-foreground"}>
                  {node.availability ?? "——"}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        {/* Hub reachability and the integration count. A count of INTEGRATIONS is configuration, not
            business volume, so it is publishable — unlike a count of orders, which never appears. */}
        <p
          className={`m-0 font-mono text-[length:var(--step-label)] uppercase tracking-[0.1em] ${valueTone}`}
        >
          <span className="text-muted-foreground">{copy.hub}</span>{" "}
          {hubReachable === null ? "——" : hubReachable ? "REACHABLE" : "UNREACHABLE"}
          {countable > 0 ? (
            <>
              <span aria-hidden="true" className="mx-2 text-border">
                ·
              </span>
              <span className="text-muted-foreground">{copy.channels}</span>{" "}
              {connected}/{countable}
            </>
          ) : null}
        </p>

        {/* Session context — projected plane, so it can never be mistaken for a live reading. */}
        {lens ? (
          <StateChip plane="projected">{lens}</StateChip>
        ) : null}
        {payloadRef ? (
          <StateChip plane="projected">{payloadRef}</StateChip>
        ) : null}

        {/* Timestamp, right-aligned. Always counting; never frozen. */}
        <p className="m-0 ml-auto font-mono text-[length:var(--step-label)] uppercase tracking-[0.1em] text-muted-foreground">
          {freshness === "offline"
            ? copy.lastSeen
            : observedLabel ?? <span aria-hidden="true">——</span>}
        </p>
      </div>
    </section>
  );
}
