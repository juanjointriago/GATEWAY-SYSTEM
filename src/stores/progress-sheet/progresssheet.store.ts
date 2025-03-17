import { create, StateCreator } from "zustand";
import { progressSheetInterface } from "../../interface/progresssheet.interface";
import { ProgressSheetService } from "../../services/progresssheet.service";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface ProgressSheetStore{
    progressSheets:progressSheetInterface[];
    getAndSetProgressSheets: ()=> Promise<void>;
    getAllProgressSheets: ()=> Promise<void>;
    getProgressSheetById: (id: string) => progressSheetInterface | undefined;
    createProgressSheet: (progressSheet: progressSheetInterface) => Promise<void>;
    updateProgressSheet: (progressSheet: progressSheetInterface) => Promise<void>;
    deleteProgressSheet: (id: string) => Promise<void>;
}

const storeAPI: StateCreator<ProgressSheetStore, 
[["zustand/devtools", never], ["zustand/immer", never]], [], ProgressSheetStore> = (set, get) => ({
    progressSheets: [],
    getAndSetProgressSheets: async () => {
        try {
            const progressSheets = await ProgressSheetService.getProgressSheet();
            set({ progressSheets: [...progressSheets] })
        } catch (error) {
            console.warn(error);
        }
    },
    getAllProgressSheets: async () => {
        const progressSheets = await ProgressSheetService.getProgressSheet();
        set({ progressSheets: [...progressSheets] })
    },

    getProgressSheetById: (id: string) => get().progressSheets.find(progressSheet => progressSheet.id === id),
    createProgressSheet: async (progressSheet: progressSheetInterface) => {
        await ProgressSheetService.createProgressSheet(progressSheet);
        set({ progressSheets: [...get().progressSheets, progressSheet] })
    },
    updateProgressSheet: async (progressSheet: progressSheetInterface) => {
        await ProgressSheetService.updateProgressSheet(progressSheet);
        set({ progressSheets: get().progressSheets.map(ps => ps.id === progressSheet.id ? progressSheet : ps) })
    },
    deleteProgressSheet: async (id: string) => {
        await ProgressSheetService.deleteProgressSheet(id);
        set({ progressSheets: get().progressSheets.filter(ps => ps.id !== id) })
    }
});

export const useProgressSheetStore = create<ProgressSheetStore>()(
    devtools(
        immer(
            persist(storeAPI, { name: 'progresssheet-store' })
        )
    )
)