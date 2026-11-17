// Unit tests for src/lib/normalTime.ts
//
// What this file shows: writing a test makes you decide what "correct" means.
// The last todo is a case where the function is inconsistent today.

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

    it.todo("shows noon as PM: 12:00 -> 12:00 PM");
    it.todo("shows the last minute of the morning: 11:59 -> 11:59 AM");
    it.todo("shows the last minute of the day: 23:59 -> 11:59 PM");
    it.todo("DECIDE: should a morning time keep its leading zero? Today 09:05 -> '09:05 AM' but 13:05 -> '1:05 PM'. Pick one, write the test, then make the code match");
});
