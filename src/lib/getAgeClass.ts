import{AGECLASSES} from "@/constants";

export function getAgeClass(dateOfBirth: string) {
    const dob = new Date(dateOfBirth);
    const birthYear = dob.getFullYear();
    const currentYear = new Date().getFullYear();

    const competitiveAge = currentYear - birthYear;

    if (competitiveAge <= 18) {
        return AGECLASSES[0];
    }
    if (competitiveAge <= 23) {
        return AGECLASSES[1];
    }
    if (competitiveAge <= 39) {
        return AGECLASSES[2];
    }
    if (competitiveAge <= 49) {
        return AGECLASSES[3];
    }
    if (competitiveAge <= 59) {
        return AGECLASSES[4];
    }
    if (competitiveAge <= 69) {
        return AGECLASSES[5];
    }

    return AGECLASSES[6];
}