import { level, subLevel } from "./levels.interface";

type status = 'COMMING' | 'MAYBE' | 'CONFIRMED' |  'DECLINED';

interface user {
    id: string;
    status: status;
}

export interface event {
    id: string;
    name: string;
    maxAssistantsNumber: number;
    minAssistantsNumber: number;
    status: status
    students: user[]
    teacher: user[]
    levels:level[]
    sublevels: subLevel[]
    isActive: boolean;
    date: number;
    createdAt: number;
    updatedAt: number;
}