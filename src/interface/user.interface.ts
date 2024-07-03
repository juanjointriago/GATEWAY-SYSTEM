import { User } from "firebase/auth";

type role = 'admin' | 'student' | 'teacher';
// interface levels {

// }
export interface FirestoreUser extends User {
    id: string;
    password?:string;
    uid: string;
    cc: string;
    name: string;
    email: string;
    bornDate: string;
    address: string;
    city: string;
    country: string;
    level: string;
    subLevel: string;
    phone: string;
    photoUrl: string;
    role: role
    isActive: boolean;
    createdAt: number;
}