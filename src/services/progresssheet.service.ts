import { progressSheetInterface } from "../interface/progresssheet.interface";
import { deleteItem, getDocsFromCollection, setItem, updateItem } from "../store/firebase/helper";

export class ProgressSheetService {
    static getProgressSheet = async ()=> await getDocsFromCollection<progressSheetInterface>(import.meta.env.VITE_COLLECTION_PROGRESS_SHEET);
    static createProgressSheet = async (progressSheet: progressSheetInterface) => await setItem(import.meta.env.VITE_COLLECTION_PROGRESS_SHEET, progressSheet);
    static updateProgressSheet = async (progressSheet: progressSheetInterface) => await updateItem(import.meta.env.VITE_COLLECTION_PROGRESS_SHEET, progressSheet);
    static deleteProgressSheet = async (id: string) => await deleteItem(import.meta.env.VITE_COLLECTION_PROGRESS_SHEET, id );
}
