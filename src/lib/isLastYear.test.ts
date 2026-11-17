// Unit tests for src/lib/isLastYear.ts
//
// What this file shows: testing a true/false function means testing both answers.
// A test that only checks the "true" cases would still pass if the function always returned true.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isLastYearOfAgeClass } from "@/lib/isLastYear";

// run as if today were June 15, 2026 (see getAgeClass.test.ts for why)
beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 15));
});
afterEach(() => {
    vi.useRealTimers();
});

describe("isLastYearOfAgeClass", () => {
    it("is true at 18, the last Sub-Junior year", () => {
        expect(isLastYearOfAgeClass("2008-03-10")).toBe(true);
    });

    it("is false a year earlier", () => {
        expect(isLastYearOfAgeClass("2009-03-10")).toBe(false);
    });

    it.todo("is true at 23, the last Junior year: born 2003");
    it.todo("is true at 49, 59 and 69, the last years of Masters 1, 2 and 3 (use it.each)");
    it.todo("is false in the first year of a class: born 2007 (19)");
    it.todo("is false for Masters 4, which has no last year: born 1950");
    it.todo("DECIDE: is 39 the last year of Open? Today it returns false, because Open isn't in the list");
});
