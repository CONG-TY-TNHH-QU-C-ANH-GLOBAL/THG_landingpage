// Roving-tabindex key resolution, shared by every exclusive-selection group on the site.
//
// One tab stop for the group, arrows move AND select, Home/End jump, and the ends wrap. Extracted
// so the keyboard contract is identical wherever it applies — two groups that each hand-roll this
// drift within a release, and the drift is invisible to anyone reviewing with a mouse.
//
// Returns the index to move to, or null when the key is not ours to handle (so the caller knows not
// to preventDefault and swallow a key the browser should have).

/** Horizontal and vertical arrows both apply: a group's orientation is a layout decision, and a
 *  keyboard user should not have to guess which pair of arrows the author had in mind. */
export function rovingIndex(key: string, active: number, last: number): number | null {
  switch (key) {
    case "ArrowDown":
    case "ArrowRight":
      return active === last ? 0 : active + 1;
    case "ArrowUp":
    case "ArrowLeft":
      return active === 0 ? last : active - 1;
    case "Home":
      return 0;
    case "End":
      return last;
    default:
      return null;
  }
}
