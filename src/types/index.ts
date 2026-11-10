export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

export type Equip = 'Classic/Raw'| 'Equipped'|'both';
export type PaymentStatus = "paid" | "unpaid" | "overdue" | "paid_late";
export type highestQualified = "Local" | "Provincial/State" | "Regional" | "National";

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
    createNextAutomatically: boolean
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
    createNextAutomatically: boolean

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
    highestQual: highestQualified;
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

export type RetentionUnit = "days" | "weeks" | "months" | "years";

export type DashboardParams = {
    meetDays: number;      // "meets in the next X days", meetdays = x
    blockDays: number;     // "blocks due in the next Y days", blockdays = y
    retentionUnit: RetentionUnit;
};

export type DashboardStats = {
    //from ath table
    activeAthletes: number; // simple count
    athleteRetentionTime: number; // average of (deleted or current date - joined), in retentionUnit
    retentionUnit: RetentionUnit; // echoed back by the backend
    mrr: number; // sum(price / cycle weeks * 52 / 12) over active athletes

    //from my ath comp table
    numMyAthletesCompetitions: number; // current entries in the next meetDays days
    nextAthleteMeetDate: string | null; // earliest current entry from today on
    nextAthleteMeetName: string | null;

    //from payments table
    numOverduePayments: number; // current payments with status overdue
    moneyMadeMonth: number; // athlete price for payments paid this month

    //training block table
    numBlockToUpdate: number; // current blocks where last update + update days <= today + blockDays
}