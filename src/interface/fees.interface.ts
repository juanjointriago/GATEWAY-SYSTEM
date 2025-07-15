type paymentMethod = 'cash' | 'transference' | 'tc' | 'deposit' | 'voucher_tc';

export interface fee{
    id?: string;
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