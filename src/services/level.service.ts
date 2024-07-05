import { level } from "../interface";
import { deleteItem, getDocsFromCollection, setItem, updateItem } from "../store/firebase/helper"

export class LevelService {
    static getLevels = async () => await getDocsFromCollection<level>(import.meta.env.VITE_COLLECTION_LEVELS);

    static createLevel = async (level: level) => await setItem(import.meta.env.VITE_COLLECTION_LEVELS, level);

    static updateLevelById = async (level: level) => await updateItem(import.meta.env.VITE_COLLECTION_LEVELS, level);

    static deleteLevelById = async (id: string) => await deleteItem(import.meta.env.VITE_COLLECTION_LEVELS, id);
}