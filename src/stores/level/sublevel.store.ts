import { create, StateCreator } from "zustand";
import { subLevel } from "../../interface";
import { SubLevelService } from "../../services";
import { devtools, persist } from "zustand/middleware";

interface SubLevelsStore{
    subLevels: subLevel[];
    getAndSetSubLevels: () => Promise<void>;
    getSubLevelById: (id: string) => subLevel | undefined;
    createSubLevel: (sublevel: subLevel) => Promise<void>;
    updateSubLevel: (sublevel: subLevel) => Promise<void>;
    deleteSubLevel: (id: string) => void;
}

const storeAPI:StateCreator<SubLevelsStore, [["zustand/devtools", never], ["zustand/immer", never]]> = (set, get) => ({
    subLevels: [],
    getAndSetSubLevels: async () => {
        try {
            const subLevels = await SubLevelService.getSubLevels();
            // console.log('SUBNIVELES ENCONTRADOS', { subLevels })
            set({ subLevels: [...subLevels] })
        } catch (error) {
            console.warn(error)
        }
    },
    getSubLevelById: (id: string) => {
        const foundSubLevel = get().subLevels.find(sublevel => sublevel.id === id);
        // console.log(foundSubLevel)
        return foundSubLevel
    },
    createSubLevel: async (sublevel: subLevel) => {
        await SubLevelService.createSubLevel(sublevel);
        set({ subLevels: [...get().subLevels, sublevel] })
    },
    updateSubLevel: async (sublevel: subLevel) => {
        await SubLevelService.updateSubLevel(sublevel);
        const updatedSubLevels = get().subLevels.map(sub => sub.id === sublevel.id ? sublevel : sub);
        set({ subLevels: updatedSubLevels })
    },
    deleteSubLevel: async (id: string) => {
        await SubLevelService.deleteSubLevelById(id);
        const updatedSubLevels = get().subLevels.filter(sub => sub.id !== id);
        set({ subLevels: updatedSubLevels });
        window.location.reload();
    }
})

export const useSubLevelStore = create<SubLevelsStore>()(
    devtools(
        persist(storeAPI, { name: 'sublevel-store' })
    )
)
