// src/lib/getNextUpdateDate.ts
import { addDays, format } from 'date-fns';
import { parseDay } from '@/lib/dates';

export function getNextUpdateDate(lastUpdate: string, daysBetweenUpdates: number): string {
    const lastUpd = parseDay(lastUpdate);
    if(lastUpd == null) return "-";
    return format(addDays(lastUpd, daysBetweenUpdates), 'MMM d, yyyy');
}