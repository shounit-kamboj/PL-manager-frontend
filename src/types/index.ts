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
    overdue?: boolean;
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
    athlete: Athlete;
    athleteId: number;
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