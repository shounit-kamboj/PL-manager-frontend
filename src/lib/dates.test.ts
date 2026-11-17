// Unit tests for src/lib/dates.ts
//
// Run them with:   npm test
//
// What this file shows:
//   - why the timezone is fixed in vitest.config.ts
//   - faking the clock for a function that reads "now"
//   - running one check under several timezones with vi.stubEnv
//
// To write a todo: change  it.todo("name")  into  it("name", () => { ... })

import { afterEach, describe, expect, it, vi } from "vitest";
import { formatDay, localTodayYmd, parseDay, toYmd } from "@/lib/dates";

// put the real clock and the configured timezone back after every test
afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
});

describe("parseDay", () => {
    // WORKED EXAMPLE: the bug this function exists to prevent.
    // The API sends a calendar day as midnight UTC. In BC that moment is still the evening before,
    // so new Date(...).getDate() would say 15. parseDay must say 16.
    it("keeps the calendar day of a midnight-UTC string", () => {
        const day = parseDay("2026-10-16T00:00:00.000Z");

        expect(day?.getFullYear()).toBe(2026);
        expect(day?.getMonth()).toBe(9); // months count from 0, so 9 is October
        expect(day?.getDate()).toBe(16);
    });

    it.todo("accepts a plain yyyy-mm-dd string: 2026-10-16 -> Oct 16");
    it.todo("returns null for null, undefined and an empty string");
    it.todo("DECIDE: a Date is read by its UTC day, so 8 pm on Oct 16 in BC comes back as Oct 17. Is the Date branch needed at all?");
    it.todo("DECIDE: what should text that isn't a date return? Today parseDay('garbage') gives an Invalid Date, not null");
});

describe("formatDay", () => {
    it("formats a day with the default pattern", () => {
        expect(formatDay("2026-10-16T00:00:00.000Z")).toBe("Oct 16, 2026");
    });

    // WORKED EXAMPLE: the same check under three timezones.
    // vi.stubEnv changes TZ for one test, and the afterEach at the top puts it back.
    it.each(["America/Vancouver", "UTC", "Asia/Tokyo"])("shows the same day to a coach in %s", (zone) => {
        vi.stubEnv("TZ", zone);

        expect(formatDay("2026-10-16T00:00:00.000Z")).toBe("Oct 16, 2026");
    });

    it.todo("returns '-' for null and undefined");
    it.todo("uses a custom pattern: formatDay('2026-10-16', 'yyyy/MM/dd') -> 2026/10/16");
    it.todo("DECIDE: should text that isn't a date show '-'? Today formatDay('garbage') throws, which would break the table it is in");
});

describe("toYmd", () => {
    it("writes a local date as yyyy-mm-dd", () => {
        // new Date(year, monthIndex, day) builds a LOCAL date, and month 10 is November
        expect(toYmd(new Date(2026, 10, 11))).toBe("2026-11-11");
    });

    it.todo("zero-pads the month and day: new Date(2026, 2, 5) -> 2026-03-05");
    it.todo("uses the local day late in the evening: new Date(2026, 10, 11, 23, 30) -> 2026-11-11");
});

describe("localTodayYmd", () => {
    // WORKED EXAMPLE: freeze "now", then ask what today is.
    // 06:30 UTC on Nov 11 is the evening of Nov 10 in BC. A server on UTC would say Nov 11;
    // the coach's browser must say Nov 10. This is the value every list sends as ?today=
    it("returns the coach's local date, not the UTC date", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-11-11T06:30:00Z"));

        expect(localTodayYmd()).toBe("2026-11-10");
    });

    it.todo("returns the new day after local midnight: 2026-11-11T08:30:00Z -> 2026-11-11");
    it.todo("follows the coach's timezone: at 2026-11-11T06:30:00Z it is already 2026-11-11 in Asia/Tokyo (use vi.stubEnv)");
});
