export interface progressClassesInterface {
    eventId:string
    a:string
    book:string
    lesson:string
    na: string
    observation: string
    part: string
    progress: string
    rw: string
    test: string
    createdAt?: number
    updatedAt?: number
}

export interface progressSheetInterface {
    id?: string
    inscriptionDate: string
    expirationDate: string
    myPreferredName: string
    otherContacts: string
    progressClasses: progressClassesInterface[];
    studentId: string;
    createdAt?: number
    updatedAt?: number
}