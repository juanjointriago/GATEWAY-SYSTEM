export interface level {
    id?: string;
    description: string;
    name: string;
    isActive: boolean;
    createdAt?: number;
    updatedAt?: number;
}

export interface subLevel {
    id: string;
    name: string;
    parentLevel:string;
    maxAssistantsNumber: number;
    minAssistantsNumber: number;
    isActive: boolean;
    createdAt: number;
    updatedAt: number;
}

