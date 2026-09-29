import { describe, expect, it } from "vitest";

import { parseYouTubeId } from "./youtube";

const ID = "q7NiFssAaRE";

describe("parseYouTubeId", () => {
  it.each([
    `https://youtu.be/${ID}`,
    `https://youtu.be/${ID}?si=abc`,
    `https://www.youtube.com/watch?v=${ID}&t=30s`,
    `https://m.youtube.com/watch?v=${ID}`,
    `https://www.youtube.com/shorts/${ID}`,
    `https://www.youtube.com/embed/${ID}`,
    `https://www.youtube.com/live/${ID}`,
    `youtube.com/watch?v=${ID}`,
  ])("reads the id from %s", (url) => {
    expect(parseYouTubeId(url)).toBe(ID);
  });

  it.each([
    "",
    null,
    "https://www.facebook.com/share/p/1Spw5uMYPT/",
    "https://www.youtube.com/@thgfulfillment",
    "https://notyoutube.com/watch?v=q7NiFssAaRE",
  ])("rejects %s", (url) => {
    expect(parseYouTubeId(url)).toBeNull();
  });
});
