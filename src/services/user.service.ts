import { FirestoreUser } from "../interface";
import { deleteItem, getDocsFromCollection, getItemById, setItem, updateItem } from "../store/firebase/helper";

export class UserService {
    static getUsers = async () => await getDocsFromCollection<FirestoreUser>(import.meta.env.VITE_COLLECTION_USERS);

    static createUser = async (user: FirestoreUser) => await setItem(import.meta.env.VITE_COLLECTION_USERS, user);
    
    static getUserById = async (id: string) => await getItemById<FirestoreUser>(import.meta.env.VITE_COLLECTION_USERS, id);

    static updateUsers = async (user: FirestoreUser) => await updateItem(import.meta.env.VITE_COLLECTION_USERS, user); 

    static deleteUserById = async (id: string) => await deleteItem(import.meta.env.VITE_COLLECTION_USERS, id);
}