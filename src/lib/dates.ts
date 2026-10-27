import { format, parseISO } from "date-fns";

export const toYmd = (d: Date): string => format(d, "yyyy-MM-dd");

// The API sends calendar days as "2026-10-16T00:00:00.000Z" (midnight UTC). Reading that with new Date() or
// parseISO() shifts it into the viewer's timezone. Keep only the yyyy-mm-dd part and treat it as a local calendar day.
export const parseDay = (value: string | Date | null | undefined): Date | null => {
    if (!value) return null;
    const ymd = typeof value === "string" ? value.slice(0, 10) : value.toISOString().slice(0, 10);
    return parseISO(ymd); // a date-only string becomes local midnight, with no shift
};

export const formatDay = (value: string | Date | null | undefined, pattern = "MMM d, yyyy"): string => {
    const d = parseDay(value);
    return d ? format(d, pattern) : "-";
};

export const localTodayYmd = (): string => format(new Date(), "yyyy-MM-dd");

