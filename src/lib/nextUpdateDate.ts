// src/lib/getNextUpdateDate.ts
import { addDays, format } from 'date-fns';

export function getNextUpdateDate(lastUpdate: string, daysBetweenUpdates: number): string {
    return format(addDays(new Date(lastUpdate), daysBetweenUpdates), 'MMM d, yyyy');
}