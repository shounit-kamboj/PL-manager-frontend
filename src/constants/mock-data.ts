// import { Athlete, AthleteCompetition, Competition } from "@/types";
// import { BaseRecord } from "@refinedev/core";
//
// export const mockAthletes: Athlete[] = [
//     {
//         id: 1,
//         name: "Shounit Kamboj",
//         gender: "male",
//         dateOfBirth: "2003-04-15",
//         email: "shounit@email.com",
//         phoneNumber: "604-000-0000",
//         weightClass: "93",
//         equipment: "Classic/Raw",
//         prSquat: 220,
//         prBench: 140,
//         prDeadlift: 260,
//         prTotal: 620,
//         coachId: 1,
//         coach: { id: 1, name: "Coach Mike",email:" " },
//         joinedAt: "2024-01-10",
//         isActive: true,
//
//         trainingBlock: {
//             id: 1,
//             coachId: 1,
//             athleteId: 1,
//             startDate: "2026-06-01",
//             endDate: "2026-08-01",
//             nextUpdateDate: "2026-07-14",
//             daysBetweenUpdates: 7,
//             lastUpdate: "2026-07-7",
//             sendOverviewReminder: false,
//
//         },
//
//         payment: {
//             id: 1,
//             coachId: 1,
//             athleteId: 1,
//             amountCAD: 150,
//             overdue: true,
//             dueDate: "2026-06-10",
//             paymentStatus: "overdue",
//         },
//
//
//         createdAt: "2024-01-10",
//         updatedAt: "2026-07-01",
//         notes: "",
//         deleted: false,
//     },
//
//     {
//         id: 2,
//         name: "Alex Chen",
//         gender: "male",
//         dateOfBirth: "2002-09-22",
//         email: "alex@email.com",
//         weightClass: "74",
//         equipment: "Classic/Raw",
//         prSquat: 180,
//         prBench: 120,
//         prDeadlift: 220,
//         prTotal: 520,
//         coachId: 1,
//         coach: { id: 1, name: "Coach Mike",email:" " },
//         joinedAt: "2024-03-01",
//         isActive: true,
//
//         trainingBlock: {
//             id: 2,
//             coachId: 1,
//             athleteId: 2,
//             startDate: "2026-06-01",
//             endDate: "2026-08-01",
//             nextUpdateDate: "2026-07-21",
//             daysBetweenUpdates: 14,
//             lastUpdate: "2026-07-7",
//             sendOverviewReminder: false
//         },
//
//         payment: {
//             id: 2,
//             coachId: 1,
//             athleteId: 2,
//             amountCAD: 150,
//             overdue: false,
//             dueDate: "2026-07-30",
//             paymentStatus: "paid",
//         },
//
//         createdAt: "2024-03-01",
//         updatedAt: "2026-07-01",
//         notes: "",
//         deleted: false,
//     },
//
//     {
//         id: 3,
//         name: "Jordan Park",
//         gender: "female",
//         dateOfBirth: "2009-12-05",
//         email: "jordan@email.com",
//         weightClass: "59",
//         equipment: "Equipped",
//         prSquat: 140,
//         prBench: 80,
//         prDeadlift: 160,
//         prTotal: 380,
//         coachId: 1,
//         coach: { id: 1, name: "Coach Mike",email:" " },
//         joinedAt: "2025-01-15",
//         isActive: false,
//
//         trainingBlock: {
//             id: 3,
//             coachId: 1,
//             athleteId: 3,
//             startDate: "2026-06-15",
//             endDate: "2026-09-01",
//             nextUpdateDate: "2026-07-28",
//             daysBetweenUpdates: 21,
//             lastUpdate: "2026-07-7",
//             sendOverviewReminder: false
//
//         },
//
//         payment: {
//             id: 3,
//             coachId: 1,
//             athleteId: 3,
//             amountCAD: 150,
//             overdue: false,
//             dueDate: "2026-08-01",
//             paymentStatus: "unpaid",
//         },
//
//
//
//         createdAt: "2025-01-15",
//         updatedAt: "2026-07-01",
//         notes: "",
//         deleted: false,
//     },
// ];
//
// export const mockCompetitions: Competition[] = [
//     {
//         id: 1,
//         name: "CPU Nationals 2026",
//         startDate: "2026-08-02",
//         endDate: "2026-08-04",
//         location: "Toronto, ON",
//        // url: "https://www.cpu.ca",
//     },
//     {
//         id: 2,
//         name: "BC Provincials 2026",
//         startDate: "2026-09-05",
//         endDate: "2026-09-06",
//         location: "Vancouver, BC",
//         url: "https://bc-powerlifting.com/calendar/",
//     },
//     {
//         id: 3,
//         name: "USAPL Raw Nationals 2026",
//         startDate: "2026-11-10",
//         endDate: "2026-11-14",
//         location: "Spokane, WA",
//         url: "https://www.usapowerlifting.com",
//     },
// ];
//
// export const mockAthleteCompetitions: AthleteCompetition[] = [
//     {
//         id: 1,
//         athlete: mockAthletes[0],
//         athleteId: 1,
//         competitionId: 1,
//         competition: mockCompetitions[0],
//         date: "2026-08-02",
//         weighInTime: "07:00",
//         equipment:'Classic/Raw',
//         isCurrent: true,
//
//     },
//     {
//         id: 2,
//         athlete: mockAthletes[2],
//         athleteId: 3,
//         competitionId: 2,
//         competition: mockCompetitions[1],
//         date: "2026-09-05",
//         weighInTime: "08:00",
//         isCurrent: true,
//     }
// ];
//
// export const mockData: Record<string, BaseRecord[]> = {
//     athletes: mockAthletes,
//     competitions: mockCompetitions,
//     "athlete-competitions": mockAthleteCompetitions,
// };