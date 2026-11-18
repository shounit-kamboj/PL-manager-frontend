// Unit tests for the form rules in src/lib/schema.ts
//
// What this file shows: testing validation.
//   - parse      returns the cleaned data, or throws. Use it when the input should be accepted.
//   - safeParse  never throws and reports success true or false. Use it when the input should be refused.
//
// These tests don't check that zod works. They check the rules written with it:
// which fields are required, what counts as valid, and what the defaults are.

import { describe, expect, it } from "vitest";
import { athleteSchema, paymentSchema, trainingBlockSchema } from "@/lib/schema";

// one valid athlete; each test copies it and changes a single field
const validAthlete = {
    name: "Test Lifter",
    gender: "male",
    weightClass: "83",
    dateOfBirth: "2000-01-01",
    joinedAt: "2026-01-01",
};

// one valid training block, used the same way
const validBlock = {
    athleteId: "3",
    name: "Peak",
    startDate: "2026-11-01",
    endDate: "2026-11-28",
    lastUpdate: "2026-11-01",
    daysBetweenUpdates: "7",
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

    it("accepts an empty email, because the field is optional", () => {
        expect(athleteSchema.safeParse({ ...validAthlete, email: "" }).success).toBe(true);
    });

    it("rejects an email without an @", () => {
        expect(athleteSchema.safeParse({ ...validAthlete, email: "lifter.example.com" }).success).toBe(false);
    });

    it("rejects a weight class that isn't in the list: '67'", () => {
        expect(athleteSchema.safeParse({ ...validAthlete, weightClass: "67" }).success).toBe(false);
    });

    it("accepts an empty link and rejects one that isn't a URL", () => {
        expect(athleteSchema.safeParse({ ...validAthlete, link: "" }).success).toBe(true);
        expect(athleteSchema.safeParse({ ...validAthlete, link: "not a url" }).success).toBe(false);
    });

    it("turns a number typed into a form into a real number: paymentPrice '120' -> 120", () => {
        const athlete = athleteSchema.parse({ ...validAthlete, paymentPrice: "120" });

        expect(athlete.paymentPrice).toBe(120);
    });

    // This test records how the schema behaves today. Number('') is 0, so a cleared field becomes 0:
    // the price is then refused because it must be greater than 0, while a PR of 0 is allowed.
    it("treats a cleared number field as 0: paymentPrice '' is refused, prSquat '' becomes 0", () => {
        expect(athleteSchema.safeParse({ ...validAthlete, paymentPrice: "" }).success).toBe(false);
        expect(athleteSchema.parse({ ...validAthlete, prSquat: "" }).prSquat).toBe(0);
    });
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

    it("rejects a missing athlete", () => {
        expect(paymentSchema.safeParse({ dueDate: "2026-11-11" }).success).toBe(false);
    });

    it("rejects an empty due date", () => {
        expect(paymentSchema.safeParse({ athleteId: "3", dueDate: "" }).success).toBe(false);
    });
});

describe("trainingBlockSchema", () => {
    it("trims the block name: '  Peak  ' -> 'Peak'", () => {
        const block = trainingBlockSchema.parse({ ...validBlock, name: "  Peak  " });

        expect(block.name).toBe("Peak");
    });

    it("accepts a name of exactly 100 characters and rejects 101", () => {
        expect(trainingBlockSchema.safeParse({ ...validBlock, name: "a".repeat(100) }).success).toBe(true);
        expect(trainingBlockSchema.safeParse({ ...validBlock, name: "a".repeat(101) }).success).toBe(false);
    });

    it("turns daysBetweenUpdates '7' into the number 7", () => {
        expect(trainingBlockSchema.parse(validBlock).daysBetweenUpdates).toBe(7);
    });

    it("rejects daysBetweenUpdates of 0 and of 2.5", () => {
        expect(trainingBlockSchema.safeParse({ ...validBlock, daysBetweenUpdates: "0" }).success).toBe(false);
        expect(trainingBlockSchema.safeParse({ ...validBlock, daysBetweenUpdates: "2.5" }).success).toBe(false);
    });

    it("defaults createNextAutomatically to false", () => {
        expect(trainingBlockSchema.parse(validBlock).createNextAutomatically).toBe(false);
    });
});