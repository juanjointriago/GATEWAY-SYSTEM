import { addDoc, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, query, setDoc, updateDoc, where, WhereFilterOp } from "firebase/firestore"
import { db } from "./initialize"

// eslint-disable-next-line @typescript-eslint/no-explicit-any

/**
 * @description Add a new item
 * @param collectionName 
 * @param data 
 * @returns 
 */
export const adddItem = async (collectionName: string, data: DocumentData) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), { data })
        console.log('Document written with ID: ', docRef.id);
    } catch (error) {
        console.warn("Error adding document: ", error)

    }
}

/**
 * @description Set a new item
 * @param collectionName 
 * @param data 
 * @returns 
 */
export const setItem = async (collectionName: string, data: DocumentData) => {
    return await setDoc(doc(db, collectionName, data.id), data)
}


export const updateItem = async (collectionName: string, data: DocumentData) => {
    return await updateDoc(doc(db, collectionName, data.id), data);
    // return await setDoc(doc(db, collectionName, data.uid), data);

}

export const deleteItem = async (collectionName: string, id: string) => {
    return await deleteDoc(doc(db, collectionName, id))
}

export const getDocsFromCollection = async <T>(collectionName: string) => {
    const data: T[] = [];
    (await getDocs(collection(db, collectionName))).forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as T)
        // data.push({ ...doc.data() } as T)

    });
    return data
}

export const getDocsFromCollectionQuery = async <T>(collectionName: string, field: string, clausule: WhereFilterOp, compareValue: string | number | boolean ) => {
    const data: T[] = [];
    const q =  query(collection(db, collectionName), where(field,clausule,compareValue));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as T)
        // data.push({ ...doc.data() } as T)

    });
    return data
}


/**
 * 
 * @param collectionName 
 * @param id 
 * @returns 
 */
export const getItemById = async <T>(collectionName: string, id: string) => {

    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    console.log('Document data:',`${collectionName}`, docSnap.data());
    if (docSnap.exists()) {
        return  { id: docSnap.id, ...docSnap.data() } as T
    }
    else {
        return {} as T;
    }

}


export const sendCustomEmail = async (email: string, subject: string, message: string) => {
    
    console.log('Sending email to: ', email);
    console.log('Subject: ', subject);
    console.log('Message: ', message);
}

