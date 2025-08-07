import { StateCreator } from "zustand";
import { AuthService } from "../../services";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { FirestoreUser, newUSer } from "../../interface";
import { immer } from "zustand/middleware/immer";
import { useLevelStore } from "../level/level.store";
import { useSubLevelStore } from "../level/sublevel.store";
import { useUnitStore } from "../units/unit.store";
import { useUserStore } from "../users/user.store";
import { useEventStore } from "../events/event.store";
import { useFeesStore } from "../fees/fess.store";
import { useProgressSheetStore } from "../progress-sheet/progresssheet.store";

export type Authstatus = 'pending' | 'unauthorized' | 'authorized' | 'error' | 'loading' | 'success';
export interface AuthState {
    status: Authstatus;
    user?: FirestoreUser
    sigUpUser: (user:newUSer) => Promise<void>;
    loginUser: (email: string, password: string) => Promise<void>;
    loginGoogle: () => Promise<void>;
    checkAuthStatus: () => Promise<void>;
    logoutUser: () => void;
}

export const storeAPI: StateCreator<AuthState, [["zustand/devtools", never], ["zustand/immer", never]]> = (set, get) => ({
    status: 'pending',
    user: undefined,
    sigUpUser: async (user:newUSer) =>  {await AuthService.signUp(user)},

    loginUser: async (email: string, password: string) => {
        const result = await AuthService.login(email, password);
        console.debug('auth.store/StoreAPI/loginUser ', { result });
        if (result.status === 'success' && result.user) {
            set({ status: 'authorized', user: result.user });
            console.debug("USUARIO almacenado", get().user);
        } else {
            set({ status: 'unauthorized', user: undefined });
            throw new Error(result.message || 'Error al iniciar sesión');
        }
    },

    loginGoogle: async () => {
        const user = await AuthService.googleSignUpLogin();
        if (user) {
            set({ status: 'authorized',  user: user.user });
        }
        else {
            set({ status: 'unauthorized', user: undefined });
            throw new Error('Unable to Google login');
        }
    },

    checkAuthStatus: async () => {
        console.debug('start checkAuthStatus=>')
        const user = await AuthService.checkStatus();
        if (user) {
            // console.debug('✅Authorized', JSON.stringify(user))
            set({ status: 'authorized', user });
        } else {
            // console.debug('❌Unauthorized', JSON.stringify(user))
            set({ status: 'unauthorized', user: undefined });
        }
    },

    logoutUser: () => {
        AuthService.logout();
        set({ status: 'unauthorized', user: undefined });
        useAuthStore.persist.clearStorage();
        useLevelStore.persist.clearStorage();
        useSubLevelStore.persist.clearStorage();
        useUnitStore.persist.clearStorage();
        useUserStore.persist.clearStorage();
        useEventStore.persist.clearStorage();
        useFeesStore.persist.clearStorage()
        useUserStore.persist.clearStorage();
        useProgressSheetStore.persist.clearStorage();
        
    }
})


export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            immer(storeAPI), {
            name: 'auth-store'
        }
        ))
)