// Unit tests for the form rules in src/lib/schema.ts
//
// What this file shows: testing validation.
//   - parse      returns the cleaned data, or throws. Use it when the input should be accepted.
//   - safeParse  never throws and reports success true or false. Use it when the input should be refused.
//
// These tests don't check that zod works. They check the rules written with it:
// which fields are required, what counts as valid, and what the defaults are.

import { describe, expect, it } from "vitest";
import { athleteSchema, paymentSchema } from "@/lib/schema";

// one valid athlete; each test copies it and changes a single field
const validAthlete = {
    name: "Test Lifter",
    gender: "male",
    weightClass: "83",
    dateOfBirth: "2000-01-01",
    joinedAt: "2026-01-01",
};

describe("athleteSchema", () => {
    it("accepts an athlete with only the required fields", () => {
        expect(athleteSchema.safeParse(validAthlete).success).toBe(true);
    });

    // WORKED EXAMPLE: start from the valid athlete and break one thing
    it("rejects a one-letter name", () => {
        const result = athleteSchema.safeParse({ ...validAthlete, name: "A" });

        expect(result.success).toBe(false);
    });

    it.todo("accepts an empty email, because the field is optional");
    it.todo("rejects an email without an @");
    it.todo("rejects a weight class that isn't in the list: '999'");
    it.todo("accepts an empty link and rejects one that isn't a URL");
    it.todo("turns a number typed into a form into a real number: paymentPrice '120' -> 120");
    it.todo("DECIDE: a number field that was typed in and then cleared arrives as ''. Today paymentPrice '' is refused and prSquat '' becomes 0. Should both mean 'left blank'?");
});

describe("paymentSchema", () => {
    // WORKED EXAMPLE: toMatchObject checks the fields you list and ignores the rest
    it("turns the athlete id into a number and fills in the defaults", () => {
        const payment = paymentSchema.parse({ athleteId: "3", dueDate: "2026-11-11" });

        expect(payment).toMatchObject({
            athleteId: 3,
            paymentStatus: "unpaid",
            createNextAutomatically: false,
        });
    });

    it.todo("rejects a missing athlete");
    it.todo("rejects an empty due date");
});

describe("trainingBlockSchema", () => {
    it.todo("trims the block name: '  Peak  ' -> 'Peak'");
    it.todo("accepts a name of exactly 100 characters and rejects 101");
    it.todo("turns daysBetweenUpdates '7' into the number 7");
    it.todo("rejects daysBetweenUpdates of 0 and of 2.5");
    it.todo("defaults createNextAutomatically to false");
});
