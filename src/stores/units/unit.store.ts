import { create, StateCreator } from "zustand";
import { unit, unitFile } from "../../interface";
import { devtools, persist } from "zustand/middleware";
import { UnitService } from "../../services";

interface UnitStore {
    units: unit[];
    getUnitById: (id: string) => unit | undefined;
    getAndSetUnits: () => Promise<void>;
    createUnit: (unit: unit, file: unitFile) => Promise<void>;
    updateUnit: (unit: unit, file?: unitFile) => Promise<void>;
    deleteUnit: (id: string) => Promise<void>;
}

const storeAPI: StateCreator<UnitStore, [["zustand/devtools", never], ["zustand/immer", never]]> = (set, get) => ({
    units: [],
    getUnitById: (id: string) => get().units.find(unit => unit.id === id),
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
        const newUnit = await UnitService.createUnit(unit, file);
        set({ units: [...get().units, newUnit] });
        // console.log('createUnit', unit)
    },
    updateUnit: async (unit: unit, file: unitFile | null | undefined = null) => {
        const updatedUnits = get().units.map(u => u.id === unit.id ? unit : u);
        set({ units: updatedUnits })
        await UnitService.updateUnitById(unit, file)
    },
    deleteUnit: async (id: string) => {
        const updatedUnits = get().units.filter(unit => unit.id !== id);
        set({ units: updatedUnits });
        await UnitService.deleteUnitById(id)
    }
})

export const useUnitStore = create<UnitStore>()(
    devtools(
        persist(storeAPI, { name: 'unit-store' })
    )
)