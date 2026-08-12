import type { ReactNode } from "react";

import styles from "./corridor.module.css";

/**
 * Render `**marked**` spans in gold. Same authoring convention the existing hero section already
 * uses for its CMS-editable title, so copy authors have one syntax across the homepage rather than
 * two. Odd-indexed chunks of the split are the matches.
 */
export function withEmphasis(raw: string): ReactNode[] {
  return raw.split(/\*\*([^*]+)\*\*/g).map((chunk, index) =>
    index % 2 === 1 ? (
      <b key={`${index}-${chunk}`} className={styles.emphasis}>
        {chunk}
      </b>
    ) : (
      chunk
    ),
  );
}
