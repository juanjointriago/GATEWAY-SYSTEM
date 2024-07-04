import { level } from "../interface";
import { deleteItem, getDocsFromCollection, setItem, updateItem } from "../store/firebase/helper"

export class LevelService {
    static getLevels = async () => {
        const levels = await getDocsFromCollection<level[]>(import.meta.env.VITE_COLLECTION_LEVELS)
        return levels;
    };


    static createLevel = async (level: level) => {
        await setItem(import.meta.env.VITE_COLLECTION_LEVELS, level);
    }

    static updateLevelById = async (level: level) => {
        // const levelRef = doc(db, `${levels_collection}`, level.id);
        await updateItem(import.meta.env.VITE_COLLECTION_LEVELS, level);

    }
    static deleteLevelById = async (id: string) => {
        await deleteItem(import.meta.env.VITE_COLLECTION_LEVELS, id);
    }
}