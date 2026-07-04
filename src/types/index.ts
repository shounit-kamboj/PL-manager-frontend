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
    joinedAt: string;
    isActive: boolean;

    nextCompetition?: Competition;

    createdAt: string;
    updatedAt: string;

}