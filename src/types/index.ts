export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

export type Equip = 'Classic/Raw'| 'Equipped'|'both';
export type PaymentStatus =  "paid" | "unpaid" | "overdue";

import { WEIGHTCLASSES } from '@/constants';

export type WeightClass = typeof WEIGHTCLASSES[number];

export type Competition = {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    location?: string;
    link?: string;
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
    amountCAD: number;
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
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};


export type ApiErrorResponse = {
    message: string;
};

// ============================================
// FUTURE — CREATE/UPDATE PAYLOAD TYPES
// Uncomment and adjust once building create/edit forms
// ============================================

// export type CreateAthletePayload = Omit<Athlete, 'id' | 'createdAt' | 'updatedAt' | 'coach' | 'trainingBlock' | 'payment'>;

// export type UpdateAthletePayload = Partial<CreateAthletePayload>;

// export type CreatePaymentPayload = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;

// export type CreateTrainingBlockPayload = Omit<TrainingBlock, 'id' | 'createdAt' | 'updatedAt' | 'nextUpdateDate'>;

// export type CreateAthleteCompetitionPayload = Omit<AthleteCompetition, 'id' | 'athleteName' | 'competition'>;

// export type CreateCoachTaskPayload = Omit<CoachTask, 'id' | 'createdAt' | 'completed' | 'status'>;


// ============================================
// FUTURE — BETTER AUTH TYPES
// Uncomment once Better Auth is wired up; replaces AuthResponse/CoachRef auth usage
// ============================================

// export type Session = {
//     user: {
//         id: string;       // text, not number — Better Auth's user.id
//         name: string;
//         email: string;
//     };
//     expiresAt: string;
// };