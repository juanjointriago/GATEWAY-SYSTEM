import { create, StateCreator } from "zustand";
import { unit } from "../../interface";
import { devtools, persist } from "zustand/middleware";
import { UnitService } from "../../services";

interface UnitStore {
    units: unit[];
    getUnitById: (id: string) => void;
    getAndSetUnits: () => Promise<void>;
    createUnit: (unit: unit) => Promise<void>;
    updateUnit: (unit: unit) => void;
    deleteUnit: (id: string) => void;
}

const storeAPI: StateCreator<UnitStore, [["zustand/devtools", never], ["zustand/immer", never]]> = (set, get) => ({
    units: [],
    getUnitById: (id: string) => {
        console.log('getUnitById', id)
    },
    getAndSetUnits: async () => {
        try {
            const units = await UnitService.getUnits()
            console.log('UNIDADES ENCONTRADAS', { units })
            set({ units: [...units] });
        } catch (error) {
            console.warn(error)
        }
        console.log('getAndSetUnits')
    },
    createUnit: async (unit: unit) => {
        await UnitService.createUnit(unit);
        set({ units: [...get().units, unit] });
        console.log('createUnit', unit)
    },
    updateUnit: (unit: unit) => {
        console.log('updateUnit', unit)
    },
    deleteUnit: (id: string) => {
        console.log('deleteUnit', id)
    }
})

export const useUnitStore = create<UnitStore>()(
    devtools(
        persist(storeAPI, { name: 'unit-store' })
    )
)