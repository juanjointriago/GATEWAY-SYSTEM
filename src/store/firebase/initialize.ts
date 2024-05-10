import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: import.meta.env.VITE.VITE_APIKEY,
    authDomain: import.meta.env.VITE.VITE_AUTHDOMAIN,
    projectId: import.meta.env.VITE.VITE_PROJECTID,
    storageBucket: import.meta.env.VITE.VITE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE.VITE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE.VITE_APPID,
    measurementId: import.meta.env.VITE.VITE_MEASUREMENTID,
}




const app =initializeApp(firebaseConfig);
const db =  getFirestore(app);
const auth = getAuth(app);

const googleAuthProvider = new GoogleAuthProvider();


export { db, auth, googleAuthProvider };