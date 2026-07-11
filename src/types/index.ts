export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

export type Equip = 'Classic'| 'Equipped';
export type PaymentStatus =  "paid" | "unpaid" | "overdue";

import { WEIGHTCLASSES } from '@/constants';

export type WeightClass = typeof WEIGHTCLASSES[number];

export type Competition = {
    id: number;
    name: string;
    federation?: string;
    startDate: string;
    endDate: string;
    location?: string;
    url?: string;
};


export type CoachRef = {
    id: number;
    name: string;
};



export type Payment = {
    id: number;
    coachId: number;
    athleteId: number;
    amount: number;
    dueDate: string;
    paymentStatus: PaymentStatus;
    overdue?: boolean;
}

export type TrainingBlock ={
    id: number;
    coachId: number;
    athleteId: number;
    startDate: string;
    endDate: string;
    nextUpdateDate: string;
    daysTillUpdate: number;
    url?: string;
    
}

export type Athlete = {
    id: number;
    name: string;
    gender: Gender;
    dateOfBirth: string;
    email?: string;
    phone?: string;



    weightClass: WeightClass;
    equipment?: Equip;
    PRSquat?: number;
    PRBench?: number;
    PRDeadlift?: number;
    PRTotal?: number;

    coachId: number;
    coach?: CoachRef;
    joinedAt: string;
    isActive: boolean;

    nextCompetition?: Competition;
    nextCompetitionDetails?: AthleteCompetition;

    createdAt: string;
    updatedAt: string;

    trainingBlock: TrainingBlock;
    payment: Payment;

    notes?: string;

    deleted: boolean;
    deletedAt?: string;


}

export type AthleteCompetition = {
    id: number;
    athlete: Athlete;
    athleteId: number;
    competitionId: number;
    competition?: Competition;
    date: string;
    weighInTime?: string;
    startTime?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
};

export type CoachTask = {
    id: number;
    coachId: number;
    athleteId?: number; // optional for manual todos
    title: string;
    dueDate?: string;
    completed: boolean;
    type: 'manual' | 'auto';
    status: 'pending' | 'completed' | 'overdue';
    createdAt: string;
};