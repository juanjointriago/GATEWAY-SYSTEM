import { subLevel } from "../interface";
import { deleteItem, getDocsFromCollection, getItemById, setItem, updateItem } from "../store/firebase/helper";

export class SubLevelService {
    static getSubLevels = async () => await getDocsFromCollection<subLevel>(import.meta.env.VITE_COLLECTION_SUB_LEVELS);
    
    static getSubLevelById = async (id: string) => await getItemById<subLevel>(import.meta.env.VITE_COLLECTION_SUB_LEVELS, id);

    static createSubLevel = async (sublevel: subLevel) => await setItem(import.meta.env.VITE_COLLECTION_SUB_LEVELS, sublevel);
    
    static updateSubLevel = async (sublevel: subLevel) => await updateItem(import.meta.env.VITE_COLLECTION_SUB_LEVELS, sublevel);

    static deleteSubLevelById = async (id: string) => await deleteItem(import.meta.env.VITE_COLLECTION_SUB_LEVELS, id);
}