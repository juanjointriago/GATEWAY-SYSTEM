import { User } from "firebase/auth";
import { StateCreator } from "zustand";
import { AuthService } from "../../services";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface AuthState {
    status: 'pending' | 'unauthorized' | 'authorized';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: User | any;
    loginUser: (email: string, password: string) => Promise<void>;
    checkAuthStatus: () => Promise<void>;
    logoutUser: () => void
}

export const storeAPI: StateCreator<AuthState> = (set) => ({
    status: 'pending',
    user: undefined,
    loginUser: async (email: string, password: string) => {
        try {
            const { user } = await AuthService.login(email, password);
            console.debug('login', { email, password })
            set({ status: 'authorized', ...user });
        } catch (error) {
            set({ status: 'unauthorized', user: undefined });
            throw new Error('Unable to login');
        }
    },

    checkAuthStatus: async () => {
        console.log('here')
        // try {
        const user = await AuthService.checkStatus();
        if (user) {
            console.log(user)
            set({ status: 'authorized', user });
        } else {

            set({ status: 'unauthorized', user: undefined });
        }
        // } catch (error) {
        // }
    },

    logoutUser: () => {
        set({ status: 'unauthorized', user: undefined });
    }
})


export const useAuthStore = create<AuthState>()(
    devtools(persist(
        storeAPI, {
        name: 'auth-store'
    }
    ))
)