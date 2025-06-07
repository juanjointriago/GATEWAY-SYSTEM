import { create, StateCreator } from "zustand";
import { level } from "../../interface";
import { LevelService } from "../../services/level.service";
import { devtools, persist } from "zustand/middleware";


interface LevelStore {
    levels: level[]
    getLevelById: (id: string) => level | undefined;
    getAndSetLevels: () => Promise<void>;
    createLevel: (level: level) => Promise<void>;
    updateLevel: (level: level) => Promise<void>;
    deleteLevel: (id: string) => Promise<void>;
}

const storeAPI: StateCreator<LevelStore, [["zustand/devtools", never], ["zustand/immer", never]]> = (set, get) => ({
    levels: [],
    getLevelById: (id: string) => get().levels.find(level => level.id === id)
    ,
    getAndSetLevels: async () => {
        try {
            const levels = await LevelService.getLevels()
            // console.debug('NIVELES ENCONTRADOS', { levels })
            set({ levels: [...levels] })
        } catch (error) {
            console.warn(error)
        }
    },
    createLevel: async (level: level) => {
        await LevelService.createLevel(level);
        set({ levels: [...get().levels, level] })
    },
    updateLevel: async (level: level) => {
        await LevelService.updateLevel(level);
        set({ levels: [...get().levels.map(l => l.id === level.id ? level : l)] });
    },
    deleteLevel: async (id: string) => {
        await LevelService.deleteLevelById(id);
        set({ levels: [...get().levels.filter(level => level.id !== id)] });
        window.location.reload();
    }
});

export const useLevelStore = create<LevelStore>()(
    devtools(
        persist(storeAPI, { name: 'level-store' })
    )
);