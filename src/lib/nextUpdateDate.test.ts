// Unit tests for src/lib/nextUpdateDate.ts

import { describe, expect, it } from "vitest";
import { getNextUpdateDate } from "@/lib/nextUpdateDate";

describe("getNextUpdateDate", () => {
    it("adds the days to the last update and formats the result", () => {
        expect(getNextUpdateDate("2026-10-16", 7)).toBe("Oct 23, 2026");
    });

    it("accepts the API's midnight-UTC format: 2026-10-16T00:00:00.000Z + 20 -> Nov 5, 2026", () => {
        expect(getNextUpdateDate("2026-10-16T00:00:00.000Z", 20)).toBe("Nov 5, 2026");
    });

    it("crosses a year end: 2026-12-28 + 7 -> Jan 4, 2027", () => {
        expect(getNextUpdateDate("2026-12-28", 7)).toBe("Jan 4, 2027");
    });

    it("returns '-' when there is no last update: an empty string", () => {
        expect(getNextUpdateDate("", 7)).toBe("-");
    });

    it("returns '-' when the last update isn't a real day", () => {
        expect(getNextUpdateDate("2026-02-31", 7)).toBe("-");
    });
});