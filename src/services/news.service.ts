import { getDownloadURL, ref, updateMetadata, uploadBytes } from "firebase/storage";
import { INew, newFile } from "../interface/new.interface";
import { deleteItem, getDocsFromCollection, setItem, updateItem } from "../store/firebase/helper";
import { storage } from "../store/firebase/initialize";


export const NewsService = {
  getNews: async () => await getDocsFromCollection<INew>(import.meta.env.VITE_COLLECTION_NEWS),

  createNew: async (news: INew, file: newFile): Promise<INew> => {
    try {
      const imageRef = ref(storage, `news/${news.title}`);
      const uploadImage = await uploadBytes(imageRef, file);
      const newMetadata = {
        cacheControl: 'public,max-age=2629800000', // 1 month
        contentType: uploadImage.metadata.contentType,
      }
      await updateMetadata(imageRef, newMetadata);
      const imageUrl = await getDownloadURL(imageRef);
      const newWithUrl = { ...news, imageUrl };
      await setItem(import.meta.env.VITE_COLLECTION_NEWS, newWithUrl);
      return newWithUrl; // Devolver la noticia con la URL
    } catch (error) {
      console.error('Error in createNew:', error);
      throw error;
    }
  },
  updateNew: async (news: INew) => await updateItem(import.meta.env.VITE_COLLECTION_NEWS, news),
  deleteNew: async (id: string) => await deleteItem(import.meta.env.VITE_COLLECTION_NEWS, id),
}