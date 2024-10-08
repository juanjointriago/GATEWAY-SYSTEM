export interface unit {
    id?: string;
    name: string;
    description: string;
    sublevel: string;
    photoUrl: string;
    supportMaterial?: string;
    workSheetUrl: string;
    isActive: boolean;
    orderNumber: number;
    createdAt?: number;
    updatedAt?: number;
}


export type  unitFile  = Blob |ArrayBuffer;
