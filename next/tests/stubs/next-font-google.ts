// `next/font/google` is a build-time transform, not a runtime module: outside `next build` the
// imported font functions do not exist. Any test that pulls in a module tree containing a font
// declaration (the [lang] layout, the homepage corridor root) would otherwise fail at import time
// with "X is not a function", which says nothing about the thing under test.
//
// One named export per face the app actually loads — ESM cannot synthesise named exports, so a new
// font means one more line here. The returned shape is what next/font returns, so the class and
// variable names stay stable and assertable.
type FontResult = { className: string; variable: string; style: { fontFamily: string } };

const face =
  (name: string) =>
  (options?: { variable?: string }): FontResult => ({
    className: `__font_${name}`,
    variable: options?.variable ? `__font_var_${name}` : "",
    style: { fontFamily: name },
  });

export const Inter = face("Inter");
export const Archivo = face("Archivo");
export const Be_Vietnam_Pro = face("Be_Vietnam_Pro");
export const IBM_Plex_Mono = face("IBM_Plex_Mono");
export const JetBrains_Mono = face("JetBrains_Mono");
