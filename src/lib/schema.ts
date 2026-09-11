import * as z from 'zod';
import { WEIGHTCLASSES, FEDS } from '@/constants';

export const athleteSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Invalid email address.' }).optional().or(z.literal('')),

    gender: z.enum(['male', 'female', 'non-binary', 'prefer-not-to-say'], {
        message: 'Please select a gender.',
    }),
    weightClass: z.enum(WEIGHTCLASSES, {
        message: 'Please select a weight class.',
    }),
    dateOfBirth: z.string().min(1, { message: 'Date of birth is required.' }),

    phoneNumber: z.string().max(11).optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    timezone: z.string().optional(),

    equipment: z.enum(['Classic/Raw', 'Equipped','both']).optional(),

    paymentPrice: z.coerce.number().positive().optional(),
    paymentCycleLengthWeeks: z.coerce.number().int().positive().optional(),

    prSquat: z.coerce.number().positive().optional(),
    prBench: z.coerce.number().positive().optional(),
    prDeadlift: z.coerce.number().positive().optional(),
    prTotal: z.coerce.number().positive().optional(),

    meetPrSquat: z.coerce.number().positive().optional(),
    meetPrBench: z.coerce.number().positive().optional(),
    meetPrDeadlift: z.coerce.number().positive().optional(),
    meetPrTotal: z.coerce.number().positive().optional(),

    notes: z.string().max(1000).optional(),
    link: z.string().url({ message: 'Must be a valid URL.' }).optional().or(z.literal('')),

    joinedAt: z.string().min(1, { message: 'Joined date is required.' }),
});

export const paymentSchema = z.object({
    athleteId: z.coerce.number().int().positive(),
    dueDate: z.string().min(1, { message: 'Due date is required.' }),
    paymentStatus: z.enum(['paid', 'unpaid', 'overdue', 'paid_late']).default('unpaid'),
    isCurrent: z.boolean().default(true),
});

export const competitionSchema = z.object({
    name: z.string().min(2, { message: 'Competition name must be at least 2 characters.' }).optional(),
    startDate: z.string().min(1, { message: 'Start date is required.' }),
    endDate: z.string().min(1, { message: 'End date is required.' }),
    country: z.string().optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    link: z.string().url({ message: 'Must be a valid URL.' }).optional().or(z.literal('')),
    federation: z.enum(FEDS).optional(),
});

export const athletesAndCompetitionsSchema = z.object({
    athleteId: z.coerce.number().int().positive(),
    compId: z.coerce.number().int().positive(),
    date: z.string().optional(),
    weighInTime: z.string().optional(),
    equipment: z.enum(['Classic/Raw', 'Equipped', 'both']).optional(),
    isCurrent: z.boolean().default(true),
});

export const trainingBlockSchema = z.object({
    athleteId: z.coerce.number().int().positive(),
    startDate: z.string().min(1, { message: 'Start date is required.' }),
    endDate: z.string().min(1, { message: 'End date is required.' }),
    lastUpdate: z.string().min(1, { message: 'Last update date is required.' }),
    daysBetweenUpdates: z.coerce.number().int().positive(),
    sendPostBlockOverviewReminder: z.boolean().default(false),
    link: z.string().url({ message: 'Must be a valid URL.' }).optional().or(z.literal('')),
    isCurrent: z.boolean().default(true),
});

export const coachTaskSchema = z.object({
    athleteId: z.coerce.number().int().positive().optional(),
    trainingBlockId: z.coerce.number().int().positive().optional(),
    title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
    description: z.string().min(2, { message: 'Description must be at least 2 characters.' }),
    dueDate: z.string().optional(),
    completed: z.boolean().default(false),
    status: z.enum(['pending', 'completed', 'overdue']).default('pending'),
});