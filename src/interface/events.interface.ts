
export type status = 'COMMING' | 'MAYBE' | 'CONFIRMED' | 'DECLINED';

interface user {
    id: string;
    status: status;
}

interface levelSubLevel {
    level: string
    sublevels: string[]
}

export interface Level {
    level: string;
    subLevels: string[];
}

export interface students { [key: string]: { status: status } }


export interface event {
    id?: string;
    isActive: boolean;
    levels: levelSubLevel;
    maxAssistantsNumber: number;
    minAssistantsNumber: number;
    name: string;
    status: string;
    students: students;
    teacher: string;
    updatedAt: number;
    createdAt: number;
    limitDate?: number;
    meetLink?:string;
    date: number;
}


export interface Student { status: string; }


export interface EventPrev {
    id: string;
    name: string;
    maxAssistantsNumber: number;
    minAssistantsNumber: number;
    status: status
    students: students[]
    teacher: user[] | user | string
    levels: levelSubLevel
    isActive: boolean;
    date: number;
    createdAt: number;
    updatedAt: number;
}