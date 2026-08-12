// The typographic and palette scope for the homepage.
//
// Fonts are loaded here, route-scoped, via next/font/google — the same pattern the Fulfill route
// already uses for its mono face (no manifest change, no manual asset copy, self-hosted, no
// external font CDN at runtime). Three faces, each earning its place:
//
//  · Archivo — the reference's display face, and specifically its WIDTH axis. The headlines are set
//    at wdth 108–123; without the variable axis they collapse into an ordinary bold grotesque and
//    the whole direction goes with them. This is the one font that is not substitutable.
//  · IBM Plex Mono — every label, counter, eyebrow and payload row in this design is mono. It feeds
//    `--font-mono-face`, the hook globals.css already declares for exactly this purpose.
//  · Be Vietnam Pro at 300/500 — the reference's body face. The shell already ships this family for
//    display at 600–800, so this adds light weights of a face the site already uses rather than a
//    fourth typeface.
//
// zh keeps working because the composite stacks in globals.css end in Noto Sans SC: none of these
// three ships CJK glyphs, and every rule below chains to `var(--font-display)` / `var(--font-body)`
// / `var(--font-mono)` rather than naming a face directly.
import type { ReactNode } from "react";
import { Archivo, Be_Vietnam_Pro, IBM_Plex_Mono } from "next/font/google";

import styles from "./corridor.module.css";

const displayFace = Archivo({
  subsets: ["latin", "vietnamese"],
  axes: ["wdth"],
  variable: "--font-corridor-display",
  display: "swap",
});

const bodyFace = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "500"],
  variable: "--font-corridor-body",
  display: "swap",
});

const monoFace = IBM_Plex_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  variable: "--font-mono-face",
  display: "swap",
});

export function CorridorRoot({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className={`${styles.root} ${displayFace.variable} ${bodyFace.variable} ${monoFace.variable}`}>
      {children}
    </div>
  );
}
