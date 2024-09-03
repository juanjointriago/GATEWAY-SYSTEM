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

export interface AuthState {
    status: 'pending' | 'unauthorized' | 'authorized';
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
        const user = await AuthService.login(email, password);
        console.log('auth.store/StoreAPI/loginUser ', { user });
        if (user) {
            // console.log('login', { email, password })
            console.log('Caso de que existe usuario =>', { user });
            set({ status: 'authorized', user });
            console.log("USUARIO almacenado", get().user);
        } else {
            set({ status: 'unauthorized', user: undefined });
            throw new Error('Unable to login');
        }
    },

    loginGoogle: async () => {
        const user = await AuthService.googleSignUpLogin();
        if (user) {
            set({ status: 'authorized', ...user });
        }
        else {
            set({ status: 'unauthorized', user: undefined });
            throw new Error('Unable to Google login');
        }
    },

    checkAuthStatus: async () => {
        console.log('start checkAuthStatus=>')
        const user = await AuthService.checkStatus();
        if (user) {
            // console.log('✅Authorized', JSON.stringify(user))
            set({ status: 'authorized', ...user });
        } else {
            // console.log('❌Unauthorized', JSON.stringify(user))
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