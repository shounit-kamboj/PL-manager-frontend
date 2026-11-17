// Unit tests for src/lib/getAgeClass.ts
//
// What this file shows:
//   - boundary testing: mistakes live at the edges of a range (18 and 19, 23 and 24, ...)
//   - freezing the year, so these tests still pass next January

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { competitiveAge, getAgeClass } from "@/lib/getAgeClass";

// Every test here runs as if today were June 15, 2026.
// Without this, a test written in 2026 would start failing on January 1, 2027.
beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 15));
});
afterEach(() => {
    vi.useRealTimers();
});

describe("competitiveAge", () => {
    it("is the current year minus the birth year", () => {
        expect(competitiveAge("2000-08-20")).toBe(26);
    });

    it.todo("ignores the month and day: born 2000-12-31 is also 26 in 2026");
    it.todo("reads the year from the text, so a Jan 1 birthday isn't shifted: 2000-01-01 -> 26");
    it.todo("uses the local year on New Year's Eve: at 11:30 pm on Dec 31, 2026 in BC, born 2000 is still 26 (set the clock to new Date(2026, 11, 31, 23, 30))");
});

describe("getAgeClass", () => {
    // WORKED EXAMPLE: both sides of one boundary.
    // 18 is the last Sub-Junior year and 19 is the first Junior year.
    it.each([
        ["2008-03-10", "SJR"],
        ["2007-03-10", "JR"],
    ])("puts an athlete born %s in %s", (dateOfBirth, expected) => {
        expect(getAgeClass(dateOfBirth)).toBe(expected);
    });

    it.todo("Junior and Open: born 2003 (23) -> JR, born 2002 (24) -> O");
    it.todo("Open and Masters 1: born 1987 (39) -> O, born 1986 (40) -> M1");
    it.todo("Masters 1 and 2: born 1977 (49) -> M1, born 1976 (50) -> M2");
    it.todo("Masters 2 and 3: born 1967 (59) -> M2, born 1966 (60) -> M3");
    it.todo("Masters 3 and 4: born 1957 (69) -> M3, born 1956 (70) -> M4");
    it.todo("moves an athlete up when the year changes: born 2008 is SJR in 2026 and JR in 2027 (move the clock inside the test)");
});
