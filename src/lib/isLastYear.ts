import {getAgeClass} from "@/lib/getAgeClass.ts";

export function competitiveAge(dateOfBirth: string): number {
    const birthYear = Number(dateOfBirth.slice(0, 4));
    return new Date().getFullYear() - birthYear;
}

export const isLastYearOfAgeClass = (dateOfBirth: string): boolean => {

    const age = competitiveAge(dateOfBirth)// Junior is 19-23, last year is 23
    // Sub-Junior is under 19, last year is 18
    // Master 1 is 40-49, last year is 49
    const lastYears: Record<string, number> = {
        'SJR': 18,
        'JR': 23,
        'M1': 49,
        'M2': 59,
        'M3': 69,
    };

    const ageClass = getAgeClass(dateOfBirth);
    return age === lastYears[ageClass];
};