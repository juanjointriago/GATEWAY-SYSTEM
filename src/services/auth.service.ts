import { getAuth, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import Swal from 'sweetalert2';
import { getItemById } from "../store/firebase/helper";

export class AuthService {
    static login = async (email: string, password: string): Promise<User | undefined> => {
        const auth = getAuth();
        console.debug('login', { email, password })
        // try {
        Swal.fire({
            title: "Ingresando al Sistema...",
            text: "Espera un poco...",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = await getItemById("users", user.uid);
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
        Swal.fire("Error", '', "error");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static checkStatus = async (): Promise<User | any> => {
        const auth = getAuth();
        const user = auth.currentUser;
        try {
            user && await getItemById("users", user.uid);
            console.log('checkStatus', JSON.stringify(user))
        } catch (error) {
            console.warn(error)
            throw new Error('Unable to check status');
        }

    }
    static logout = async () => {
        const auth = getAuth();
        await signOut(auth);
        //TODO remove user from
    }
}