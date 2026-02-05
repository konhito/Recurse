export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Confidence = 1 | 2 | 3 | 4 | 5; // 1 = Low, 5 = High
export type RevisionStatus = 'locked' | 'due' | 'completed' | 'overdue';

export interface Revision {
    number: number; // 1, 2, 3
    scheduledDate: string; // ISO Date String
    completedDate?: string; // ISO Date String
}

export interface Problem {
    id: string; // UUID
    title: string;
    url: string;
    difficulty: Difficulty;
    tags: string[];
    addedAt: string; // ISO Date
    notes: string;

    // Revisions
    revisions: Revision[];

    // Analytics
    confidenceHistory: { date: string; level: Confidence }[];

    isArchived: boolean;
}

export interface AppState {
    problems: Problem[];
}
