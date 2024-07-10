import { create, StateCreator } from "zustand";
import { unit, unitFile } from "../../interface";
import { devtools, persist } from "zustand/middleware";
import { UnitService } from "../../services";

interface UnitStore {
    units: unit[];
    getUnitById: (id: string) => void;
    getAndSetUnits: () => Promise<void>;
    createUnit: (unit: unit, file:unitFile) => Promise<void>;
    updateUnit: (unit: unit) => Promise<void>;
    deleteUnit: (id: string) => Promise<void>;
}

const storeAPI: StateCreator<UnitStore, [["zustand/devtools", never], ["zustand/immer", never]]> = (set, get) => ({
    units: [],
    getUnitById: (id: string) => get().units.find(unit => unit.id = id),
    getAndSetUnits: async () => {
        try {
            const units = await UnitService.getUnits()
            // console.log('UNIDADES ENCONTRADAS', { units })
            set({ units: [...units] });
        } catch (error) {
            console.warn(error)
        }
        // console.log('getAndSetUnits')
    },
    createUnit: async (unit: unit, file: unitFile) => {
        await UnitService.createUnit(unit, file);
        set({ units: [...get().units, unit] });
        // console.log('createUnit', unit)
    },
    updateUnit: async(unit: unit) => await UnitService.updateUnitById(unit),
    deleteUnit: async(id: string) => await UnitService.deleteUnitById(id)
})

export const useUnitStore = create<UnitStore>()(
    devtools(
        persist(storeAPI, { name: 'unit-store' })
    )
)