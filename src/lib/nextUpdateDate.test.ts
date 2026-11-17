// Unit tests for src/lib/nextUpdateDate.ts

import { describe, expect, it } from "vitest";
import { getNextUpdateDate } from "@/lib/nextUpdateDate";

describe("getNextUpdateDate", () => {
    it("adds the days to the last update and formats the result", () => {
        expect(getNextUpdateDate("2026-10-16", 7)).toBe("Oct 23, 2026");
    });

    it.todo("accepts the API's midnight-UTC format: 2026-10-16T00:00:00.000Z + 20 -> Nov 5, 2026");
    it.todo("crosses a year end: 2026-12-28 + 7 -> Jan 4, 2027");
    it.todo("returns the same day for 0 days");
    it.todo("returns '-' when there is no last update: an empty string");
});
