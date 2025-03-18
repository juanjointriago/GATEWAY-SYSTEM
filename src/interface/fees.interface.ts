export interface fee{
    uid: string;
    studentUid?: string;
    code?:string;
    qty: number;
    reason:string;
    isSigned:boolean;
    ci:string;
    imageUrl?:string;
    isActive: boolean;
    createdAt: number;
    updatedAt: number
}