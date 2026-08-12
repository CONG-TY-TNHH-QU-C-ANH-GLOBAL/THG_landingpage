"use client";

// The running waybill — a small fixed readout that appears the moment the seller answers anything,
// so the corridor never feels like it is collecting silently.
//
// Placed bottom-LEFT and desktop-only by architecture, not by taste: the shared FloatingContact
// island already owns the bottom-right corner on desktop and the entire bottom edge on mobile. The
// shell's contact affordance outranks a page-local progress readout, so this never competes for
// that space — and below lg the same numbers are already on the page in the recommendation room and
// in the waybill payload panel, so nothing is lost by hiding it.
import { useEffect, useRef } from "react";

import { localize } from "@/shared/i18n";
import { WAYBILL } from "../content";
import { WAYBILL_ROWS, waybillValue } from "../model/corridor-state";
import { comboLabel } from "../model/lead-mapping";
import { useCorridor } from "./corridor-provider.client";
import styles from "./corridor.module.css";

/** Below this many filled rows the CTA stays dimmed — there is not yet enough for a useful call. */
const USEFUL_ROWS = 3;

export function WaybillDossier() {
  const { lang, answers, recommendation, completion, waybillCode } = useCorridor();
  const ref = useRef<HTMLElement>(null);

  // Stand down once the seller has actually reached the waybill: the dossier's entire job is to get
  // them there, and past that point it only sits on top of the form's own fields. Toggles an
  // attribute through the ref rather than state — nothing else re-renders on scroll.
  useEffect(() => {
    const target = document.getElementById("waybill");
    if (!target || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => ref.current?.setAttribute("data-arrived", String(entry.isIntersecting)),
      { threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const open = completion.filled > 0;
  const ready = completion.filled >= USEFUL_ROWS;
  const combo = comboLabel(lang, recommendation);

  let ctaLabel = localize(lang, WAYBILL.dossierIncomplete);
  if (ready) {
    ctaLabel = combo ? `${localize(lang, WAYBILL.dossierSend)} · ${combo}` : localize(lang, WAYBILL.dossierContinue);
  }

  return (
    <aside ref={ref} className={styles.dossier} data-open={open} data-arrived="false" aria-hidden={!open}>
      <div className={styles.dossierHead}>
        <span className={styles.dossierCode}>
          {localize(lang, WAYBILL.dossierTitle)} #{waybillCode || "—"}
        </span>
        <span className={styles.dossierPercent}>{completion.percent}%</span>
      </div>

      <div className={styles.dossierMeter}>
        <i style={{ transform: `scaleX(${completion.percent / 100})` }} />
      </div>

      <dl className={styles.dossierBody}>
        {WAYBILL_ROWS.map((row) => {
          const value = waybillValue(lang, row.key, answers, recommendation);
          return (
            <div key={row.key} className={styles.dossierRow}>
              <dt>{localize(lang, row.label)}</dt>
              <dd>{value || "—"}</dd>
            </div>
          );
        })}
      </dl>

      {/* A plain anchor, not a scroll handler: the destination is a real section on this page. */}
      <a className={styles.dossierCta} data-dim={!ready} href="#waybill">
        {ctaLabel}
      </a>
    </aside>
  );
}
