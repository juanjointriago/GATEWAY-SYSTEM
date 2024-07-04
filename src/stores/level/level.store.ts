import { create, StateCreator } from "zustand";
import { level } from "../../interface";
import { LevelService } from "../../services/level.service";
import { devtools, persist } from "zustand/middleware";


interface LevelStore {
    levels: level[]
    getLevelById: (id: string) => void;
    getAndSetLevels: () => Promise<void>;
    createLevel: (level: level) => Promise<void>;
    updateLevel: (level: level) => void;
    deleteLevel: (id: string) => void;
}

const storeAPI: StateCreator<LevelStore, [["zustand/devtools", never], ["zustand/immer", never]]> = (set, get) => ({
    levels: [],
    getLevelById: (id: string) => {
        console.log('getLevelById', id)
    },
    getAndSetLevels: async () => {
        try {
            const levels = await LevelService.getLevels()
        console.log('NIVELES ENCONTRADOS',{ levels })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // set({ levels: [...levels] as any})
        levels.forEach((level) => {
            console.log('Elemento iterado',level)
            set({ levels: [...get().levels, ...level] })
        });
        } catch (error) {
            console.warn(error)
        }
    },
    createLevel: async (level: level) => {
        set({ levels: [...get().levels, level] })
        await LevelService.createLevel(level);
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