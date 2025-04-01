type paymentMethod = 'cash' | 'transference' | 'tc' | 'deposit';

export interface fee{
    id?: string;
    uid: string;
    place?: string;
    customerName: string;
    studentUid?: string;
    code?:string;
    qty: number;
    reason:string;
    paymentMethod: paymentMethod;
    docNumber?: string;
    isSigned:boolean;
    cc:string;
    imageUrl?:string | undefined;
    isActive: boolean;
    createdAt: number;
    updatedAt: number
}