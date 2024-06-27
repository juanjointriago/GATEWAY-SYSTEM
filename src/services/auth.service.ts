import { getAuth, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import Swal from 'sweetalert2';
import { getItemById } from "../store/firebase/helper";

export class AuthService {
    static login = async (email: string, password: string) => {
        const auth = getAuth();
        console.debug('login', { email, password })
        try {
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
            } else {
                console.log('Login Exitoso', firebaseUser);
                Swal.fire({
                    title: `Bienvenido ${firebaseUser.name}`,
                    icon: "success",
                    allowOutsideClick: true,
                    backdrop: true,
                });
                //TODO set user in store
            } return firebaseUser;
        } catch (error) {
            Swal.fire("Error", '', "error");
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static checkStatus = async (): Promise<User | any> => {
        const auth = getAuth();
        const user = auth.currentUser;
        try {
            user && await getItemById("users", user.uid);
        } catch (error) {
            console.warn(error)
        }

    }
    static logout = async () => {
        const auth = getAuth();
        await signOut(auth);
        //TODO remove user from
    }
}