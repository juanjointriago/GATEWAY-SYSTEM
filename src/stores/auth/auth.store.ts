import { StateCreator } from "zustand";
import { AuthService, FirestoreUser } from "../../services";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface AuthState {
    status: 'pending' | 'unauthorized' | 'authorized';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: FirestoreUser
    loginUser: (email: string, password: string) => Promise<void>;
    checkAuthStatus: () => Promise<void>;
    logoutUser: () => void
}

export const storeAPI: StateCreator<AuthState> = (set) => ({
    status: 'pending',
    user: undefined,

    loginUser: async (email: string, password: string) => {
        const user = await AuthService.login(email, password);
        if (user) {
            console.log('login', { email, password })
            set({ status: 'authorized', ...user });
        } else {
            set({ status: 'unauthorized', user: undefined });
            throw new Error('Unable to login');
        }
    },

    checkAuthStatus: async () => {
        console.log('start checkAuthStatus=>')
        const user = await AuthService.checkStatus();
        if (user) {
            console.log('✅Authorized', JSON.stringify(user))
            set({ status: 'authorized', ...user });
        } else {
            console.log('❌Unauthorized', JSON.stringify(user))
            set({ status: 'unauthorized', user: undefined });
        }
    },

    logoutUser: () => {
        AuthService.logout();
        useAuthStore.persist.clearStorage()
    }
})


export const useAuthStore = create<AuthState>()(
    devtools(persist(
        storeAPI, {
        name: 'auth-store'
    }
    ))
)