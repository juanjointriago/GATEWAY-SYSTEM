import { getDownloadURL, ref, updateMetadata, uploadBytes } from "firebase/storage";
import { INew, newFile } from "../interface/new.interface";
import { deleteItem, getDocsFromCollection, setItem, updateItem } from "../store/firebase/helper";
import { storage } from "../store/firebase/initialize";


export class NewsService {
    static getNews = async () => await getDocsFromCollection<INew>(import.meta.env.VITE_COLLECTION_NEWS);

    static createNew = async (news: INew, newFile: newFile ) =>{
        const imageRef = ref(storage, `news/${news.title}`);
        const uploadImage = await uploadBytes(imageRef, newFile);
        const newMetadata = {
            cacheControl: 'public,max-age=2629800000', // 1 month
            contentType: uploadImage.metadata.contentType,
        }
        await updateMetadata(imageRef, newMetadata);
        const imageUrl = await getDownloadURL(imageRef);
        const newNews = { ...news, imageUrl };
        await setItem(import.meta.env.VITE_COLLECTION_NEWS, newNews);
        return newNews;
    }
    static updateNew = async (news: INew) => await updateItem(import.meta.env.VITE_COLLECTION_NEWS, news);
    static deleteNew = async (id: string) => await deleteItem(import.meta.env.VITE_COLLECTION_NEWS, id);
}