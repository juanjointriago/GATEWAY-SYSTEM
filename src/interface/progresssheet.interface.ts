type EventInfo = {
  label: string;
  value: string;
}
export interface progressClassesInterface {
    eventInfo:EventInfo
    // a:string
    book:string
    lesson:string
    // na: string
    observation: string
    part: string
    progress: string
    // rw: string
    test: string
    createdAt?: number
    updatedAt?: number
}

export interface progressSheetInterface {
    id?: string
    uid?: string
    contractNumber?: string
    headquarters?: string
    inscriptionDate: string
    expirationDate: string
    myPreferredName: string
    
    contractDate?: string
    work: string
    enterpriseName: string
    preferredCI?: string
    conventionalPhone?: string
    familiarPhone?: string
    preferredEmail?: string

    otherContacts: string
    progressClasses: progressClassesInterface[];
    totalFee?: number;//total adeudado
    totalPaid?: number;// total pagado
    totalDue?: number;// total pendiente
    totalDiscount?: number;// total descuento
    observation?: string;// observacion
    adminObservation?: string; // Observación del administrador
    quotesQty?: number;// cantidad de cuotas
    quoteValue?: number;// valor de la cuota
    dueDate?: string;// fecha de vencimiento
    program?: string;// programa
    studentId: string;
    createdAt?: number
    updatedAt?: number
}




// types/progress-sheet.ts
export interface ProgressEntry {
    date: string;
    hour: string;
    book: string;
    progress: string;
    part: string;
    test: string;
    teacher: string;
    observation: string;
  }
  
  export interface StudentInfo {
    headline?: string;
    preferredName: string;
    fullName: string;
    idNumber: string;
    regNumber: string;
    inscriptionDate: string;
    expirationDate: string;
    occupation: string;
    age: string;
    birthday: string;
    phone: string;
    otherContacts: string;
    observation: string;
    gender: 'male' | 'female' | 'undefined';
    progressEntries: ProgressEntry[];
  }