import { FirestoreUser } from "../interface";
import { deleteItem, getDocsFromCollection, updateItem } from "../store/firebase/helper";

export class UserService {
    static getUsers = async () => await getDocsFromCollection<FirestoreUser>(import.meta.env.VITE_COLLECTION_USERS);

    updateUsers = async (user: FirestoreUser) => await updateItem(import.meta.env.VITE_COLLECTION_USERS, user); 

    deleteUserById = async (id: string) => await deleteItem(import.meta.env.VITE_COLLECTION_USERS, id);
}