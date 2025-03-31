export interface fee{
    id?: string;
    uid: string;
    place?: string;
    customerName: string;
    studentUid?: string;
    code?:string;
    qty: number;
    reason:string;
    isSigned:boolean;
    cc:string;
    imageUrl?:string;
    isActive: boolean;
    createdAt: number;
    updatedAt: number
}