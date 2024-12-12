import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import Swal from 'sweetalert2';
import { getItemById, setItem } from "../store/firebase/helper";
import { FirestoreUser, newUSer } from "../interface";

2
export class AuthService {
    static login = async (email: string, password: string): Promise<FirestoreUser | undefined> => {
        const auth = getAuth();
        console.debug('✅login', { email, password })
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
            console.log('✅',user.displayName)
            const firebaseUser = await getItemById<FirestoreUser>(import.meta.env.VITE_COLLECTION_USERS, user.uid);
            console.log('Auth.Service/static login/ getItemById=>', { firebaseUser });
            Swal.close();
            if (firebaseUser && firebaseUser.isActive === false) {
                // console.log("Caso Usuario inactivo")
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
                Swal.fire({
                    title: `Bienvenido ${firebaseUser.name}`,
                    icon: "success",
                    allowOutsideClick: true,
                    backdrop: true,
                });
                // console.log('Login Exitoso', { firebaseUser });
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

    static resetPassword = async (email: string) => {
        const auth = getAuth();
        try {
            await sendPasswordResetEmail(auth, email);
            Swal.fire({
                title: `Reinicio de Contraseña`,
                text: `Revise la bandeja de ${email}`,
                icon: "success",
                allowOutsideClick: true,
                backdrop: true,
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            Swal.fire({
                title: `Error al enviar correo`,
                text: `${error.message}`,
                icon: "warning",
                allowOutsideClick: true,
                backdrop: true,
            })
        }
    }

    static signUp = async (signUpUser: newUSer) => {
        const { email, password, name, role, address, bornDate, cc, city, country } = signUpUser;
        const auth = getAuth();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password!)
            if (userCredential) {
                const { photoURL, uid } = userCredential.user;
                const dataUser = {
                    uid,
                    id: uid,
                    name,
                    email,
                    role,
                    photoUrl: photoURL,
                    phone: "",
                    address,
                    bornDate,
                    cc,
                    city,
                    country,
                    isActive: false,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                };
                await updateProfile(userCredential.user, { displayName: name });
                // await setDoc(doc(db, import.meta.env.VITE_COLLECTION_USERS, uid), dataUser);//
                await setItem(import.meta.env.VITE_COLLECTION_USERS, dataUser);
                Swal.fire({
                    title: `Registro completo`,
                    text: `Su cuenta se encuentra en proceso de activación`,
                    icon: "success",
                    allowOutsideClick: true,
                    backdrop: true,
                })
                await signOut(auth);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            Swal.fire({
                title: `Error al registrar usuario`,
                text: `${error.message}`,
                icon: "warning",
                allowOutsideClick: true,
                backdrop: true,
            })
            await signOut(auth);
        }

    }
    /**
     * @description Login with Google and set on user collection if not exists if exists continue
     * @param action 
     * @returns 
     */
    static googleSignUpLogin = async () => {
        const auth = getAuth();
        const googleAuthProvider = new GoogleAuthProvider();
        googleAuthProvider.setCustomParameters({
            prompt: "select_account "
        });

        try {
            const { user } = await signInWithPopup(auth, googleAuthProvider);
            Swal.fire({
                title: "Ingresando al Sistema...",
                text: "Espera un poco...",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
            const { uid, email, displayName, photoURL } = user;
            const firebaseUser = await getItemById<FirestoreUser>(import.meta.env.VITE_COLLECTION_USERS, uid);
            if (!firebaseUser?.id) {
                const dataUser = {
                    uid,
                    id: uid,
                    name: displayName,
                    email,
                    role: 'student',
                    photoUrl: photoURL,
                    phone: "",
                    address: "",
                    bornDate: "",
                    cc: "",
                    city: "",
                    country: "",
                    isActive: false,
                    createdAt: Date.now(),
                };
                await setItem(import.meta.env.VITE_COLLECTION_USERS, dataUser);
                Swal.close();
                return;
            }
            if (!firebaseUser.isActive) {
                Swal.fire({
                    title: `Su usuario está en proceso de aprobación`,
                    icon: "info",
                    allowOutsideClick: true,
                    backdrop: true,
                });
                await signOut(auth);
                return;
            }
            Swal.close();
            return firebaseUser;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log({ error })
            Swal.close();
            Swal.fire("Error al iniciar sesión con GOOGLE", `${error.message}`, 'error');
            throw new Error('Error al iniciar sesión');
        }

    }

    // static signUpGateway = async (sigUpUser: FirestoreUser) => {
    //     const auth = getAuth();
    //     const { email, password, name, role, phone, address, bornDate, cc, city, country } = sigUpUser;
    //     const { user } = await createUserWithEmailAndPassword(auth, email, password!)
    //     const { photoURL, uid } = user;
    //     const dataUser = {
    //         uid,
    //         id: uid,
    //         name,
    //         email,
    //         role,
    //         photoUrl: photoURL,
    //         phone,
    //         address,
    //         bornDate,
    //         cc,
    //         city,
    //         country,
    //         isActive: false,
    //         createdAt: Date.now(),
    //     };

    //     await updateProfile(user, { displayName: name });
    //     await setItem(import.meta.env.VITE_COLLECTION_USERS, dataUser);
    //     await signOut(auth);
    // }



    static checkStatus = async (): Promise<FirestoreUser | undefined> => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            try {
                const FirestoreUser = await getItemById<FirestoreUser>(import.meta.env.VITE_COLLECTION_USERS, user.uid);
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