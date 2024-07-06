import { create, StateCreator } from "zustand";
import { level } from "../../interface";
import { LevelService } from "../../services/level.service";
import { devtools, persist } from "zustand/middleware";


interface LevelStore {
    levels: level[]
    getLevelById: (id: string) => level | undefined;
    getAndSetLevels: () => Promise<void>;
    createLevel: (level: level) => Promise<void>;
    updateLevel: (level: level) => void;
    deleteLevel: (id: string) => void;
}

const storeAPI: StateCreator<LevelStore, [["zustand/devtools", never], ["zustand/immer", never]]> = (set, get) => ({
    levels: [],
    getLevelById:   (id: string) => {
        // const foundLevel = await LevelService.getLevelById(id);
        const foundLevel =  get().levels.find(level => level.id = id)
        console.log(foundLevel)
        return foundLevel
    },
    getAndSetLevels: async () => {
        try {
            const levels = await LevelService.getLevels()
            console.log('NIVELES ENCONTRADOS', { levels })
            set({ levels: [...levels] })
        } catch (error) {
            console.warn(error)
        }
    },
    createLevel: async (level: level) => {
        await LevelService.createLevel(level);
        set({ levels: [...get().levels, level] })
    },
    updateLevel: (level: level) => {
        console.log('updateLevel', level)
    },
    deleteLevel: (id: string) => {
        console.log('deleteLevel', id)
    }
});

export const useLevelStore = create<LevelStore>()(
    devtools(
        persist(storeAPI, { name: 'level-store' })
    )
);