import { describe, expect, it } from "vitest";

import { leadershipResponseSchema } from "@/lib/cmsSchemas";

describe("leadershipResponseSchema", () => {
  it("accepts cards representing one person or a team", () => {
    const result = leadershipResponseSchema.parse({
      leadership: [
        {
          id: 1,
          position: 1,
          name: "Johnny",
          role: "Founder",
          quote: "Build for trust.",
          avatars: [{ url: "https://cdn.example/johnny.webp", alt: "Johnny" }],
        },
        {
          id: 2,
          position: 2,
          name: "Technology Team",
          role: "Technology",
          quote: null,
          avatars: [
            { url: "https://cdn.example/tech-1.webp", alt: "Member one" },
            { url: "https://cdn.example/tech-2.webp", alt: "Member two" },
          ],
        },
      ],
    });

    expect(result.leadership.map((member) => member.avatars.length)).toEqual([1, 2]);
  });

  it("rejects an avatar without a resolved public URL", () => {
    expect(() =>
      leadershipResponseSchema.parse({
        leadership: [
          {
            id: 1,
            position: 1,
            name: "Johnny",
            role: null,
            quote: null,
            avatars: [{ alt: "Johnny" }],
          },
        ],
      }),
    ).toThrow();
  });
});
