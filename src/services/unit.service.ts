import { getDownloadURL, ref, updateMetadata, uploadBytes } from "firebase/storage";
import { unit, unitFile } from "../interface";
import { deleteItem, getDocsFromCollection, setItem, updateItem } from "../store/firebase/helper";
import { storage } from "../store/firebase/initialize";

export class UnitService {
    static getUnits = async () => await getDocsFromCollection<unit>(import.meta.env.VITE_COLLECTION_UNITS);

    // static createUnit = async (unit: unit) => await setItem(import.meta.env.VITE_COLLECTION_UNITS, unit);
    static createUnit = async (unit: unit, unitFile: unitFile) => {
        const imageRef = ref(storage, `units/${unit.name}`);
        const uploadImage = await uploadBytes(imageRef, unitFile);
        const newMetadata = {
            cacheControl: 'public,max-age=2629800000', // 1 month
            contentType: uploadImage.metadata.contentType,
        }
        await updateMetadata(imageRef, newMetadata);
        const supportMaterial = await getDownloadURL(imageRef);
        const newUnit = { ...unit, supportMaterial }
        await setItem(import.meta.env.VITE_COLLECTION_UNITS, newUnit);
    };


    static updateUnitById = async (unit: unit) => await updateItem(import.meta.env.VITE_COLLECTION_UNITS, unit);

    static deleteUnitById = async (id: string) => await deleteItem(import.meta.env.VITE_COLLECTION_UNITS, id);
}