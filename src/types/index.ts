export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

export type Equip = 'Classic'| 'Equipped';

import { WEIGHTCLASSES } from '@/constants';

export type WeightClass = typeof WEIGHTCLASSES[number];

export type Competition = {
    id: number;
    name: string;
    date: string;
    location?: string;
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
    overdue: boolean;
    dueDate: string;
}

export type TrainingBlock ={
    id: number;
    coachId: number;
    athleteId: number;
    startDate: string;
    endDate: string;
}

export type Athlete = {
    id: number;
    name: string;
    gender: Gender;
    dateOfBirth?: string;
    email?: string;
    phone?: string;



    weightClass?: WeightClass;
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


}

export type AthleteCompetition = {
    id: number;
    athleteId: number;
    competitionId: number;
    competition?: Competition;
    date: string;
    weighInTime: string;
    startTime: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
};