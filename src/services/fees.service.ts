import { fee } from "../interface/fees.interface";
import { deleteItem, getDocsFromCollection, setItem, updateItem } from "../store/firebase/helper";

export class FeesService {
      static getFees = async ()=> await getDocsFromCollection<fee>(import.meta.env.VITE_COLLECTION_FEES);
      static createFee = async (fee: fee) => await setItem(import.meta.env.VITE_COLLECTION_FEES, fee);
      static updateFee = async (fee: fee) => await updateItem(import.meta.env.VITE_COLLECTION_FEES, fee);
      static deleteFee = async (id: string) => await deleteItem(import.meta.env.VITE_COLLECTION_FEES, id);
  
}