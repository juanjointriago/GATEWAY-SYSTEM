import { create, StateCreator } from "zustand";
import { fee } from "../../interface/fees.interface";
import { FeesService } from "../../services/fees.service";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface FeesStore{
    fees: fee[];
    getAndSetFees: () => Promise<void>;
    getFees: () => fee[];
    createFee: (fee: fee) => Promise<void>;
    updateFee: (fee: fee) => Promise<void>;
    deleteFee: (id: string) => Promise<void>;
}

const storeAPI: StateCreator<FeesStore,
[["zustand/devtools", never], [ "zustand/immer", never ]]> = (set, get)=>({
    fees: [],
    getAndSetFees: async () => {
        try {
            const fees = await FeesService.getFees();
            set({ fees: [...fees] })
            // console.debug('ALL FEES FOUNDED ===>', { fees })
        } catch (error) {
            console.warn(error)
        }
    },
    getFees: () => get().fees,
    createFee: async (fee: fee) => {
        await FeesService.createFee(fee);
        set({ fees: [...get().fees, fee] })
    },
    updateFee: async (fee: fee) => {
        await FeesService.updateFee(fee);
        set({ fees: get().fees.map(f => f.id === fee.id ? fee : f) })
    },
    deleteFee: async (id: string) => {
        await FeesService.deleteFee(id);
        set({ fees: get().fees.filter(f => f.id !== id) })
    }
})

export const useFeesStore = create<FeesStore>()(
    devtools(
        immer(
            persist(storeAPI, { name: 'fees-store' })
        )
    )
)