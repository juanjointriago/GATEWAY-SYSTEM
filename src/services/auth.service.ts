/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import { getItemById, setItem } from "../store/firebase/helper";
import { FirestoreUser, newUSer } from "../interface";
import { v6 as uuid } from "uuid";
import { progressSheetInterface } from "../interface/progresssheet.interface";
import { Authstatus } from "../stores";

2;
export class AuthService {
  static login = async (
    email: string,
    password: string
  ): Promise<{ user?: FirestoreUser; status: Authstatus; message: string }> => {
    const auth = getAuth();
    console.debug("✅login", { email, password });
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      console.debug("✅", user.displayName);
      const firebaseUser = await getItemById<FirestoreUser>(
        import.meta.env.VITE_COLLECTION_USERS,
        user.uid
      );
      console.debug("Auth.Service/static login/ getItemById=>", {
        firebaseUser,
      });
      if (firebaseUser && firebaseUser.isActive === false) {
        await signOut(auth);
        return { status: 'pending', message: 'Su usuario está en proceso de aprobación' };
      }
      if (firebaseUser && firebaseUser.isActive) {
        return { status: 'success', user: firebaseUser, message: `Bienvenido ${firebaseUser.name}` };
      }
      return { status: 'error', message: 'Usuario no encontrado' };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.debug({ error });
      return { status: 'error', message: `Error al iniciar sesión: ${error.message}` };
    }
  };

  static resetPassword = async (email: string): Promise<{ status: 'success' | 'error'; message: string }> => {
    const auth = getAuth();
    try {
      console.log('reseteando contrasena', email);
      await sendPasswordResetEmail(auth, email);
      return { status: 'success', message: `Reinicio de Contraseña: Revise la bandeja de ${email}` };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return { status: 'error', message: `Error al enviar correo: ${error.message}` };
    }
  };

  static signUp = async (signUpUser: newUSer): Promise<{ status: 'success' | 'error'; message: string }> => {
    const {
      email,
      password,
      name,
      role,
      address,
      bornDate,
      cc,
      phone,
      city,
      country,
    } = signUpUser;
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password!
      );
      if (userCredential) {
        const { photoURL, uid } = userCredential.user;
        const dataUser = {
          uid,
          id: uid,
          name,
          email,
          role,
          photoUrl: photoURL,
          phone,
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
        await setItem(import.meta.env.VITE_COLLECTION_USERS, dataUser);
        //Add preffered info and Total fee for user
        const contractInfo: progressSheetInterface = {
          id: uuid(),
          uid: uuid(),
          studentId: uid,
          contractNumber: "000",
          headquarters: "",
          inscriptionDate: new Date().toISOString().split('T')[0],
          expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          myPreferredName: name || "",
          contractDate: new Date().toISOString().split('T')[0],
          work: "",
          enterpriseName: "",
          preferredCI: "",
          conventionalPhone: "",
          familiarPhone: "",
          preferredEmail: email || "",
          otherContacts: "",
          program: "",
          observation: "",
          totalFee: 0,
          totalPaid: 0,
          totalDue: 0,
          totalDiscount: 0,
          quotesQty: 0,
          quoteValue: 0,
          dueDate: "",
          progressClasses: [], // Inicialmente vacío
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await setItem(import.meta.env.VITE_COLLECTION_PROGRESS_SHEET, contractInfo);
        await signOut(auth);
        return { status: 'success', message: 'Registro completo: Su cuenta se encuentra en proceso de activación' };
      }
      return { status: 'error', message: 'No se pudo registrar el usuario' };
    } catch (error: any) {
      await signOut(auth);
      return { status: 'error', message: `Error al registrar usuario: ${error.message}` };
    }
  };
  /**
   * @description Login with Google and set on user collection if not exists if exists continue
   * @param action
   * @returns
   */
  static googleSignUpLogin = async (): Promise<{ user?: FirestoreUser; status: 'success' | 'pending' | 'error'; message: string }> => {
    const auth = getAuth();
    const googleAuthProvider = new GoogleAuthProvider();
    googleAuthProvider.setCustomParameters({
      prompt: "select_account ",
    });

    try {
      const { user } = await signInWithPopup(auth, googleAuthProvider);
      const { uid, email, displayName, photoURL } = user;
      const firebaseUser = await getItemById<FirestoreUser>(
        import.meta.env.VITE_COLLECTION_USERS,
        uid
      );
      if (!firebaseUser?.id) {
        const dataUser = {
          uid,
          id: uid,
          name: displayName,
          email,
          role: "student",
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
        await signOut(auth);
        return { status: 'success', message: 'Registro completo: Su cuenta se encuentra en proceso de activación' };
      }
      if (!firebaseUser.isActive) {
        await signOut(auth);
        return { status: 'pending', message: 'Su usuario está en proceso de aprobación' };
      }
      return { status: 'success', user: firebaseUser, message: `Bienvenido ${firebaseUser.name}` };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.debug({ error });
      return { status: 'error', message: `Error al iniciar sesión con GOOGLE: ${error.message}` };
    }
  };

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
        const FirestoreUser = await getItemById<FirestoreUser>(
          import.meta.env.VITE_COLLECTION_USERS,
          user.uid
        );
        return FirestoreUser;
      } catch (error) {
        console.debug(error);
        throw new Error("Unauthorized, invalid token");
      }
    }
  };

  static logout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };
}
