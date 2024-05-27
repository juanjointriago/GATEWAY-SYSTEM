import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { db } from "./initialize"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type data = any

/**
 * 
 * @param collectionName 
 * @param object 
 * @returns 
 */
export const adddItem = async (collectionName: string, object: data) => {
    return await setDoc(doc(db, collectionName, object.id.toString()), object)
}

/**
 * 
 * @param collectionName 
 * @param data 
 * @returns 
 */
export const setItem = async (collectionName: string, data: data) => {
    return await setDoc(doc(db, collectionName, data.id), data)
}

export const deleteItem = async (collectionName: string, id: string) => {
    return await deleteDoc(doc(db, collectionName, id))
}

export const getDocsFromCollection = async (collectionName: string) => {
    const data: data = [];
    (await getDocs(collection(db, collectionName))).forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() })
    });
    return data
}

export const getItemById = async (collectionName: string, id: string) => {
    const docSnap = await getDoc(doc(db, `${collectionName}/${id}`));
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
    }
    return null;
}

