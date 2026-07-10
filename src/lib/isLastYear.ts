import {getAgeClass} from "@/lib/getAgeClass.ts";

export const isLastYearOfAgeClass = (dateOfBirth: string): boolean => {
    const dob = new Date(dateOfBirth);
    const birthYear = dob.getFullYear();
    const currentYear = new Date().getFullYear();
    const competitiveAge = currentYear - birthYear;    // Junior is 19-23, last year is 23
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
    return competitiveAge === lastYears[ageClass];
};