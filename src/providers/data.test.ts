// Unit tests for normalizeDates in src/providers/data.ts
//
// What this file shows: toEqual compares whole objects and arrays, field by field.
// Use toBe for single values such as text and numbers, and toEqual for anything with parts.

import { describe, expect, it } from "vitest";
import { normalizeDates } from "@/providers/data";

describe("normalizeDates", () => {
    it("cuts a midnight-UTC string down to the day", () => {
        expect(normalizeDates("2026-10-16T00:00:00.000Z")).toBe("2026-10-16");
    });

    // WORKED EXAMPLE: one record in, the whole expected record out
    it("converts the dates inside a record and leaves the other fields alone", () => {
        const record = { id: 7, name: "Peak", startDate: "2026-10-16T00:00:00.000Z", link: null };

        expect(normalizeDates(record)).toEqual({ id: 7, name: "Peak", startDate: "2026-10-16", link: null });
    });

    it.todo("leaves a real timestamp alone: 2026-10-16T08:30:00.000Z keeps its time");
    it.todo("accepts the short form without milliseconds: 2026-10-16T00:00:00Z -> 2026-10-16");
    it.todo("converts the dates inside an array of records");
    it.todo("converts a date in a nested record: { competition: { startDate: ... } }");
    it.todo("leaves numbers, booleans, null and undefined unchanged");
    it.todo("does not change the record that was passed in");
});
