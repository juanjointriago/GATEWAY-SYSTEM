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

  /**
   * @description Update user email in Firebase Authentication
   * @param newEmail - The new email address
   * @param currentPassword - Current password for re-authentication (required by Firebase)
   * @returns Promise with status and message
   * @note This method requires the user to be currently authenticated
   * @note The user will need to re-authenticate before changing their email for security
   */
  static updateEmail = async (
    newEmail: string,
    currentPassword: string
  ): Promise<{ status: 'success' | 'error'; message: string }> => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user || !user.email) {
      return { status: 'error', message: 'No hay usuario autenticado' };
    }

    try {
      // Re-authenticate user before email change (required by Firebase)
      const credential = await signInWithEmailAndPassword(
        auth,
        user.email,
        currentPassword
      );
      
      if (!credential.user) {
        return { status: 'error', message: 'Error al reautenticar usuario' };
      }

      // Update email in Firebase Auth
      const { updateEmail } = await import('firebase/auth');
      await updateEmail(credential.user, newEmail);

      return { 
        status: 'success', 
        message: 'Email actualizado correctamente. Por favor, verifica tu nuevo correo.' 
      };
    } catch (error: any) {
      console.error('Error updating email:', error);
      if (error.code === 'auth/wrong-password') {
        return { status: 'error', message: 'Contraseña incorrecta' };
      }
      if (error.code === 'auth/email-already-in-use') {
        return { status: 'error', message: 'Este email ya está en uso por otra cuenta' };
      }
      return { 
        status: 'error', 
        message: `Error al actualizar email: ${error.message}` 
      };
    }
  };

  /**
   * @description Migrar usuario completo a un nuevo email
   * @param oldUserId - ID del usuario antiguo
   * @param userData - Datos del usuario para crear la nueva cuenta
   * @param newEmail - Nuevo email
   * @param onProgress - Callback para reportar progreso
   * @returns Promise con el nuevo uid y status
   */
  static migrateUserToNewEmail = async (
    oldUserId: string,
    userData: FirestoreUser,
    newEmail: string,
    onProgress?: (step: string, progress: number) => void
  ): Promise<{ 
    status: 'success' | 'error'; 
    message: string; 
    newUid?: string;
    oldUid?: string;
  }> => {
    const auth = getAuth();
    let newUserCredential;
    let tempPassword: string;

    try {
      // Paso 1: Determinar la contraseña temporal
      onProgress?.('Preparando migración...', 10);
      tempPassword = userData.cc || 'estudiante@gateway.corp';
      
      // Paso 2: Crear nuevo usuario en Firebase Auth
      onProgress?.('Creando nueva cuenta de autenticación...', 20);
      try {
        newUserCredential = await createUserWithEmailAndPassword(
          auth,
          newEmail,
          tempPassword
        );
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          return { 
            status: 'error', 
            message: 'El email ya está en uso. Por favor, elija otro email.' 
          };
        }
        throw error;
      }

      const newUid = newUserCredential.user.uid;
      console.debug('Nueva cuenta creada:', { newUid, newEmail });

      // Paso 3: Actualizar perfil del nuevo usuario
      onProgress?.('Actualizando perfil...', 30);
      await updateProfile(newUserCredential.user, { 
        displayName: userData.name,
        photoURL: userData.photoUrl 
      });

      // Paso 4: Crear registro en colección users con nuevo uid
      onProgress?.('Creando registro de usuario...', 40);
      const newUserData = {
        ...userData,
        uid: newUid,
        id: newUid,
        email: newEmail,
        updatedAt: Date.now()
      };
      
      await setItem(import.meta.env.VITE_COLLECTION_USERS, newUserData);

      // Retornar información para que el componente actualice las demás colecciones
      return {
        status: 'success',
        message: 'Usuario migrado exitosamente',
        newUid,
        oldUid: oldUserId
      };

    } catch (error: any) {
      console.error('Error en migración de usuario:', error);
      
      // Si se creó el usuario en Auth pero falló después, intentar limpiarlo
      if (newUserCredential) {
        try {
          await newUserCredential.user.delete();
        } catch (deleteError) {
          console.error('Error al limpiar usuario creado:', deleteError);
        }
      }

      return {
        status: 'error',
        message: `Error al migrar usuario: ${error.message || 'Error desconocido'}`
      };
    } finally {
      // Cerrar sesión del nuevo usuario para permitir que el admin continúe
      await signOut(auth);
    }
  };
}
