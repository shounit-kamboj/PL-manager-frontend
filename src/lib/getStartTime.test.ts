// Unit tests for src/lib/getStartTime.ts
//
// What this file shows: pinning the date for a function that builds its answer on today's date.
// On a day when the clocks change, "two hours later" can come out wrong, and a test that
// only fails two days a year is the hardest kind to track down.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getStartTime } from "@/lib/getStartTime";

// an ordinary day, so every run of these tests sees the same thing
beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 15, 9, 0));
});
afterEach(() => {
    vi.useRealTimers();
});

describe("getStartTime", () => {
    it("is two hours after weigh-in", () => {
        expect(getStartTime("08:00")).toBe("10:00");
    });

    it.todo("keeps the minutes: 07:45 -> 09:45");
    it.todo("wraps past midnight: 22:30 -> 00:30 and 23:00 -> 01:00");
    it.todo("accepts a time with seconds, as the database sends it: 08:00:00 -> 10:00");
});
