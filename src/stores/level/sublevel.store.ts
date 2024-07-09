import { create, StateCreator } from "zustand";
import { subLevel } from "../../interface";
import { SubLevelService } from "../../services";
import { devtools, persist } from "zustand/middleware";

interface SubLevelsStore{
    sublevels: subLevel[];
    getAndSetSubLevels: () => Promise<void>;
    getSubLevelById: (id: string) => subLevel | undefined;
    createSubLevel: (sublevel: subLevel) => Promise<void>;
    updateSubLevel: (sublevel: subLevel) => void;
    deleteSubLevel: (id: string) => void;
}

const storeAPI:StateCreator<SubLevelsStore, [["zustand/devtools", never], ["zustand/immer", never]]> = (set, get) => ({
    sublevels: [],
    getAndSetSubLevels: async () => {
        try {
            const sublevels = await SubLevelService.getSubLevels();
            // console.log('SUBNIVELES ENCONTRADOS', { sublevels })
            set({ sublevels: [...sublevels] })
        } catch (error) {
            console.warn(error)
        }
    },
    getSubLevelById: (id: string) => {
        const foundSubLevel = get().sublevels.find(sublevel => sublevel.id === id);
        // console.log(foundSubLevel)
        return foundSubLevel
    },
    createSubLevel: async (sublevel: subLevel) => {
        await SubLevelService.createSubLevel(sublevel);
        set({ sublevels: [...get().sublevels, sublevel] })
    },
    updateSubLevel: (sublevel: subLevel) => {
        console.log('updateSubLevel', sublevel)
    },
    deleteSubLevel: (id: string) => {
        console.log('deleteSubLevel', id)
    }
})

export const useSubLevelStore = create<SubLevelsStore>()(
    devtools(
        persist(storeAPI, { name: 'sublevel-store' })
    )
)
