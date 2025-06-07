export interface INew {
    uuid?: string;
    id?: string;
    title: string;
    description: string;
    imageUrl: string;
    altText?: string;
    isActive?: boolean;
    createdAt: number;
    updatedAt: number;
}

export type  newFile  = Blob |ArrayBuffer;
