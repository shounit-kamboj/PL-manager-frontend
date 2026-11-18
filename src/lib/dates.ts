import { isValid, parseISO, format } from "date-fns";

export const toYmd = (d: Date): string => format(d, "yyyy-MM-dd");

const isValidYmd = (s: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    const d = parseISO(s);
    return isValid(d) && format(d, "yyyy-MM-dd") === s;
};

// The API sends calendar days as "2026-10-16T00:00:00.000Z" (midnight UTC). Reading that with new Date() or
// parseISO() shifts it into the viewer's timezone. Keep only the yyyy-mm-dd part and treat it as a local calendar day.
export const parseDay = (value: string | null | undefined): Date | null => {
    if (!value || !isValidYmd(value.slice(0, 10))) return null;

    return parseISO(value.slice(0, 10));
};

export const formatDay = (value: string  | null | undefined, pattern = "MMM d, yyyy"): string => {
    const d = parseDay(value);
    return d ? format(d, pattern) : "-";
};

export const localTodayYmd = (): string => format(new Date(), "yyyy-MM-dd");

