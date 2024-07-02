import { getAuth, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import Swal from 'sweetalert2';
import { getItemById } from "../store/firebase/helper";

type role = 'admin' | 'student' | 'teacher';
// interface levels {

// }
export interface FirestoreUser extends User {
    id: string;
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
export class AuthService {
    static login = async (email: string, password: string): Promise<FirestoreUser | undefined> => {
        const auth = getAuth();
        console.debug('login', { email, password })
        Swal.fire({
            title: "Ingresando al Sistema...",
            text: "Espera un poco...",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = await getItemById<FirestoreUser>("users", user.uid);
            console.log('firebaseUser', firebaseUser);
            Swal.close();
            if (firebaseUser && !firebaseUser.isActive) {
                Swal.fire({
                    title: `Su usuario está en proceso de aprobación`,
                    icon: "info",
                    allowOutsideClick: true,
                    backdrop: true,
                });
                await signOut(auth);
                return;
            }
            if (firebaseUser && firebaseUser.isActive) {
                console.log('Login Exitoso', firebaseUser);
                Swal.fire({
                    title: `Bienvenido ${firebaseUser.name}`,
                    icon: "success",
                    allowOutsideClick: true,
                    backdrop: true,
                });
                return firebaseUser;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log({ error })
            Swal.close();
            Swal.fire("Error al iniciar sesión", `${error.message}`, 'error');
            throw new Error('Error al iniciar sesión');
        }


    }

    static checkStatus = async (): Promise<FirestoreUser | undefined> => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            try {
                const FirestoreUser = await getItemById<FirestoreUser>("users", user.uid);
                return FirestoreUser;
            } catch (error) {
                console.log(error);
                throw new Error('Unauthorized, invalid token');
            }
        }
    }

    static logout = async () => {
        const auth = getAuth();
        await signOut(auth);
    }
}