// Unit tests for src/lib/normalTime.ts
//
// What this file shows: writing a test makes you decide what "correct" means.
// The last test settles a case where the function used to be inconsistent.

import { describe, expect, it } from "vitest";
import { normalTime } from "@/lib/normalTime";

describe("normalTime", () => {
    it("shows an afternoon time on the 12-hour clock", () => {
        expect(normalTime("13:05")).toBe("1:05 PM");
    });

    // WORKED EXAMPLE: midnight and noon are where 12-hour clocks go wrong, so they get their own tests
    it("shows half past midnight as 12:30 AM, not 0:30", () => {
        expect(normalTime("00:30")).toBe("12:30 AM");
    });

    it("shows noon as PM: 12:00 -> 12:00 PM", () => {
        expect(normalTime("12:00")).toBe("12:00 PM");
    });

    it("shows the last minute of the morning: 11:59 -> 11:59 AM", () => {
        expect(normalTime("11:59")).toBe("11:59 AM");
    });

    it("shows the last minute of the day: 23:59 -> 11:59 PM", () => {
        expect(normalTime("23:59")).toBe("11:59 PM");
    });

    it("drops the leading zero from a morning hour, like afternoon times: 09:05 -> 9:05 AM", () => {
        expect(normalTime("09:05")).toBe("9:05 AM");
    });
});