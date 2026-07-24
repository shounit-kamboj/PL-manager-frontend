// src/lib/getStartTime.ts
export function getStartTime(weighInTime: string): string {
    const [hours, minutes] = weighInTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    date.setHours(date.getHours() + 2);
    return date.toTimeString().slice(0, 5); // "HH:MM"
}