import { unit } from "../interface";
import { deleteItem, getDocsFromCollection, setItem, updateItem } from "../store/firebase/helper";

export class UnitService {
    static getUnits = async () => await getDocsFromCollection<unit>(import.meta.env.VITE_COLLECTION_UNITS);

    static createUnit = async (unit: unit) => await setItem(import.meta.env.VITE_COLLECTION_UNITS, unit);

    static updateUnitById = async (unit: unit) => await updateItem(import.meta.env.VITE_COLLECTION_UNITS, unit);

    static deleteUnitById = async (id: string) => await deleteItem(import.meta.env.VITE_COLLECTION_UNITS, id);
}