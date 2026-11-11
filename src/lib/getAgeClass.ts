import{AGECLASSES} from "@/constants";

// birth year straight from "YYYY-MM-DD", so the timezone can't shift it
export function competitiveAge(dateOfBirth: string): number {
    const birthYear = Number(dateOfBirth.slice(0, 4));
    return new Date().getFullYear() - birthYear;
}

export function getAgeClass(dateOfBirth: string) {
    const age = competitiveAge(dateOfBirth);

    if (age <= 18) {
        return AGECLASSES[0];
    }
    if (age <= 23) {
        return AGECLASSES[1];
    }
    if (age <= 39) {
        return AGECLASSES[2];
    }
    if (age <= 49) {
        return AGECLASSES[3];
    }
    if (age <= 59) {
        return AGECLASSES[4];
    }
    if (age <= 69) {
        return AGECLASSES[5];
    }

    return AGECLASSES[6];
}