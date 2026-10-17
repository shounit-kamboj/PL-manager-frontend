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

    paymentPrice: z.coerce
        .number({ invalid_type_error: 'Please enter a valid payment amount.' })
        .positive({ message: 'Payment amount must be greater than 0.' })
        .optional(),
    paymentCycleLengthWeeks: z.coerce
        .number({ invalid_type_error: 'Please enter the payment cycle length in weeks.' })
        .int({ message: 'Payment cycle length must be a whole number of weeks.' })
        .positive({ message: 'Payment cycle length must be greater than 0.' })
        .optional(),

    prSquat: z.coerce
        .number({ invalid_type_error: 'Please enter a valid squat PR.' })
        .nonnegative({ message: 'Squat PR must be 0 or more.' })
        .optional(),
    prBench: z.coerce
        .number({ invalid_type_error: 'Please enter a valid bench PR.' })
        .nonnegative({ message: 'Bench PR must be 0 or more.' })
        .optional(),
    prDeadlift: z.coerce
        .number({ invalid_type_error: 'Please enter a valid deadlift PR.' })
        .nonnegative({ message: 'Deadlift PR must be 0 or more.' })
        .optional(),
    prTotal: z.coerce
        .number({ invalid_type_error: 'Please enter a valid total PR.' })
        .nonnegative({ message: 'Total PR must be 0 or more.' })
        .optional(),

    meetPrSquat: z.coerce
        .number({ invalid_type_error: 'Please enter a valid meet squat PR.' })
        .nonnegative({ message: 'Meet squat PR must be 0 or more.' })
        .optional(),
    meetPrBench: z.coerce
        .number({ invalid_type_error: 'Please enter a valid meet bench PR.' })
        .nonnegative({ message: 'Meet bench PR must be 0 or more.' })
        .optional(),
    meetPrDeadlift: z.coerce
        .number({ invalid_type_error: 'Please enter a valid meet deadlift PR.' })
        .nonnegative({ message: 'Meet deadlift PR must be 0 or more.' })
        .optional(),
    meetPrTotal: z.coerce
        .number({ invalid_type_error: 'Please enter a valid meet total PR.' })
        .nonnegative({ message: 'Meet total PR must be 0 or more.' })
        .optional(),

    isActive: z.boolean().optional(),

    notes: z.string().max(1000).optional(),
    link: z.string().url({ message: 'Must be a valid URL.' }).optional().or(z.literal('')),

    joinedAt: z.string().min(1, { message: 'Joined date is required.' }),
});

export const paymentSchema = z.object({
    athleteId: z.coerce
        .number({ invalid_type_error: 'Please select an athlete.' })
        .int({ message: 'Please select a valid athlete.' })
        .positive({ message: 'Please select an athlete.' }),
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
    athleteId: z.coerce
        .number({ invalid_type_error: 'Please select an athlete.' })
        .int({ message: 'Please select a valid athlete.' })
        .positive({ message: 'Please select an athlete.' }),
    compId: z.coerce
        .number({ invalid_type_error: 'Please select a competition.' })
        .int({ message: 'Please select a valid competition.' })
        .positive({ message: 'Please select a competition.' }),
    date: z.string().optional(),
    weighInTime: z.string().optional(),
    equipment: z.enum(['Classic/Raw', 'Equipped', 'both']).optional(),
});

export const trainingBlockSchema = z.object({
    athleteId: z.coerce
        .number({ invalid_type_error: 'Please select an athlete.' })
        .int({ message: 'Please select a valid athlete.' })
        .positive({ message: 'Please select an athlete.' }),
    startDate: z.string().min(1, { message: 'Start date is required.' }),
    endDate: z.string().min(1, { message: 'End date is required.' }),
    lastUpdate: z.string().min(1, { message: 'Last update date is required.' }),
    daysBetweenUpdates: z.coerce
        .number({ invalid_type_error: 'Please enter days between updates.' })
        .int({ message: 'Days between updates must be a whole number.' })
        .positive({ message: 'Days between updates must be greater than 0.' }),
    sendPostBlockOverviewReminder: z.boolean().default(false),
    link: z.string().url({ message: 'Must be a valid URL.' }).optional().or(z.literal('')),
    isCurrent: z.boolean().default(true),
});

export const coachTaskSchema = z.object({
    athleteId: z.coerce
        .number({ invalid_type_error: 'Please select a valid athlete.' })
        .int({ message: 'Please select a valid athlete.' })
        .positive({ message: 'Please select a valid athlete.' })
        .optional(),
    trainingBlockId: z.coerce
        .number({ invalid_type_error: 'Please select a valid training block.' })
        .int({ message: 'Please select a valid training block.' })
        .positive({ message: 'Please select a valid training block.' })
        .optional(),
    title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
    description: z.string().min(2, { message: 'Description must be at least 2 characters.' }),
    dueDate: z.string().optional(),
    completed: z.boolean().default(false),
    status: z.enum(['pending', 'completed', 'overdue']).default('pending'),
});
export const athletesAndCompetitionsEditSchema = athletesAndCompetitionsSchema.pick({
    date: true,
    weighInTime: true,
    equipment: true,
});