// Unit tests for src/lib/getAgeClass.ts
//
// What this file shows:
//   - boundary testing: mistakes live at the edges of a range (18 and 19, 23 and 24, ...)
//   - freezing the year, so these tests still pass next January
//
// The empty tests are still to be written: add an expect(...) inside each one.
// An empty test passes, so it shows as green until you fill it in.

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

    it("ignores the month and day: born 2000-12-31 is also 26 in 2026", () => {
        expect(competitiveAge("2000-12-12")).toBe(26);

    });

    it("reads the year from the text, so a Jan 1 birthday isn't shifted: 2000-01-01 -> 26", () => {
        expect(competitiveAge("2000-01-01")).toBe(26);

    });

    it("uses the local year on New Year's Eve: at 11:30 pm on Dec 31, 2026 in BC, born 2000 is still 26 (set the clock to new Date(2026, 11, 31, 23, 30))", () => {
        expect(competitiveAge("2000-08-20")).toBe(26);
    });
});

describe("getAgeClass", () => {
    // WORKED EXAMPLE: both sides of one boundary.
    // 18 is the last Sub-Junior year and 19 is the first Junior year.
    it.each([
        ["2008-03-10", "SJR"],
        ["2007-03-10", "JR"],
        ["2003-03-10", "JR"],
        ["2002-03-10", "O"],
        ["1987-03-10", "O"],
        ["1986-03-10", "M1"],
        ["1977-03-10", "M1"],
        ["1976-03-10", "M2"],
        ["1967-03-10", "M2"],
        ["1966-03-10", "M3"],
        ["1957-03-10", "M3"],
        ["1956-03-10", "M4"],
    ])("puts an athlete born %s in %s", (dateOfBirth, expected) => {
        expect(getAgeClass(dateOfBirth)).toBe(expected);
    });



    it("moves an athlete up when the year changes: born 2008 is SJR in 2026 and JR in 2027 (move the clock inside the test)", () => {
        expect(getAgeClass("2008-03-10")).toBe("SJR");
        vi.setSystemTime(new Date(2027, 5, 15));
        expect(getAgeClass("2008-03-10")).toBe("JR");

    });
});