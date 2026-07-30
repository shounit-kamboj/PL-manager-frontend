// src/lib/isOverdue.ts
import { Payment } from '@/types';

export function isOverdue(payment?: Payment | null): boolean {
    return payment?.paymentStatus === 'overdue';
}