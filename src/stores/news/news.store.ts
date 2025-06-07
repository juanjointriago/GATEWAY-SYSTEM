import { create, StateCreator } from "zustand";
import { INew, newFile } from "../../interface/new.interface";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { NewsService } from "../../services/news.service";

interface NewsStore {
  news: INew[];
  getAndSetNews: () => Promise<void>;
  getAllNews: () => INew[];
  getNewsById: (id: string) => INew | undefined;
  createNews: (news: INew, file: newFile) => Promise<void>;
  updateNews: (news: INew) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
}

const storeAPI: StateCreator<
  NewsStore,
  [["zustand/devtools", never], ["zustand/immer", never]],
  [],
  NewsStore
> = (set, get) => ({
  news: [],
  getAndSetNews: async () => {
    try {
      const news = await NewsService.getNews();
      set({ news: [...news] });
    } catch (error) {
      console.warn(error);
    }
  },
  getAllNews: () => get().news,
  getNewsById: (id: string) => get().news.find((news) => news.id === id),
  createNews: async (news: INew, file: newFile) => {
    try {
      await NewsService.createNew(news, file);
      set({ news: [...get().news, news] });
    } catch (error) {
      console.error("Error creating news:", error);
      throw error;
    }
  },
  updateNews: async (news: INew) => {
    try {
      await NewsService.updateNew(news);
      const updatedNews = { ...news };
      set({
        news: get().news.map((n) => (n.id === news.id ? updatedNews : n)),
      });
    } catch (error) {
      console.error("Error updating news:", error);
      throw error;
    }
  },
  deleteNews: async (id: string) => {
    try {
      await NewsService.deleteNew(id);
      set({ news: get().news.filter((n) => n.id !== id) });
    } catch (error) {
      console.error("Error deleting news:", error);
      throw error;
    }
  },
});

export const useNewsStore = create<NewsStore>()(
  devtools(immer(persist(storeAPI, { name: "news-store" })))
);
