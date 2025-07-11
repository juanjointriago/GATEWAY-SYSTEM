import { IenterpriseInfo } from "../interface/enterprise.interface";
import { getDocsFromCollection, updateItem } from "../store/firebase/helper";

export class EnterPriseInfoService {
      static getEnterPriseInfo = async ()=> await getDocsFromCollection<IenterpriseInfo>(import.meta.env.VITE_COLLECTION_ENTERPRISEINFO);
      static updateEnterPriseInfo = async (enterpriseInfo: IenterpriseInfo) => await updateItem(import.meta.env.VITE_COLLECTION_ENTERPRISEINFO, enterpriseInfo);

}