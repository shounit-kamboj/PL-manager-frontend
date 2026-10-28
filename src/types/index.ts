import Dashboard from "@/pages/dashboard.tsx";

export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

export type Equip = 'Classic/Raw'| 'Equipped'|'both';
export type PaymentStatus = "paid" | "unpaid" | "overdue" | "paid_late";

import { WEIGHTCLASSES } from '@/constants';

export type WeightClass = typeof WEIGHTCLASSES[number];

import {FEDS} from "@/constants";
export type FED =  typeof FEDS[keyof typeof FEDS];

export type Competition = {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    city?: string;
    province?: string;
    country?: string;
    link?: string;
    federation: FED;
    isOwn?: boolean;
};


export type CoachRef = {
    id: number;
    name: string;
    email: string;
    bio?: string;
    createdAt?: string;

};



export type Payment = {
    id: number;
    coachId: number;
    athleteId: number;
    paidAt?: string | null
    dueDate: string;
    paymentStatus: PaymentStatus;
    isCurrent?: boolean;
}

export type TrainingBlock ={
    id: number;
    coachId: number;
    athleteId: number;
    startDate: string;
    endDate: string;
    nextUpdateDate?: string;
    daysBetweenUpdates: number;
    lastUpdate: string;
    link?: string;
    sendOverviewReminder: boolean;
    isCurrent: boolean;
    athleteName: string;
    name: string;

}

export type Athlete = {
    id: number;
    name: string;
    gender: Gender;
    dateOfBirth: string;
    email?: string;
    phoneNumber?: string;
    country?: string;
    city?: string;
    province?: string;
    timezone?: string;
    link?: string; //for openpl/arenapl

    paymentPrice?: number;
    paymentCycleLengthWeeks?: number;



    weightClass: WeightClass;
    equipment?: Equip;
    prSquat?: number;
    prBench?: number;
    prDeadlift?: number;
    prTotal?: number;

    meetPrSquat?: number;
    meetPrBench?: number;
    meetPrDeadlift?: number;
    meetPrTotal?: number;

    coachId: number;
    coach?: CoachRef;
    joinedAt: string;
    isActive: boolean;

    createdAt: string;
    updatedAt: string;

    trainingBlock?: TrainingBlock | null;
    payment?: Payment | null;

    notes: string;

    deleted: boolean;
    deletedAt?: string;


}

export type AthleteCompetition = {
    id: number;
    athleteId: number;
    athleteName?: string;
    competitionId: number;
    competition?: Competition;
    date: string;
    weighInTime?: string;
    notes?: string;
    equipment?: Equip;
    isCurrent: boolean;
};

//todo: will be added when todo list is added
export type CoachTask = {
    id: number;
    coachId: number;
    trainingBlockId?: number;
    title: string;
    description: string;
    dueDate?: string;
    completed: boolean;
    status: 'pending' | 'completed' | 'overdue';
    createdAt: string;
};

export type AuthResponse = {
    coach: CoachRef;
    token: string;
};

// ============================================
// API RESPONSE TYPES
// ============================================

export type ApiListResponse<T = unknown> = {
    data?: T[];
    page?: number;
    limit?: number;
    total?: number | string;
    totalPages?: number;
};

export type ApiErrorResponse = {
    message: string;
};

/////////////////
///Dashboard////
///////////////


export type DashboardParams = {
    meetDays: number;      // "meets in the next X days", meetdays = x
    blockDays: number;     // "blocks due in the next Y days", blockdays = y
};

export type DashboardData = {
    numAthletes: number; // simple count
    avgAthleteRetentionMonths: number; // calculated from sum(athlete's joined - deleted or current date)/n
    mrr: number; // sum(payment price)/cyclelen/7 * days this month or /cyclelen x 52/12
    numMyAthletesCompetitions: number; //count is current
    nextAthleteMeet: string; //myathcomp,sorteddesc(?) by date limit 1
    numOverduePayments: number; //count where status = overdue
    moneyMadeMonth: number; //payment price where paidat month == this month
    numBlockToUpdate: number; //count of blocks where last update + update days < today + blockdays
}

