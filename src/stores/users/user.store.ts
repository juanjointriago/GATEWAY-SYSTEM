import { create, StateCreator } from "zustand";
import { FirestoreUser } from "../../interface";
import { AuthService, UserService } from "../../services";
import { devtools, persist } from "zustand/middleware";
import { role } from '../../interface/user.interface';

interface UsersStore {
    users: FirestoreUser[];
    getAllUsers: () => void;
    getUserById: (id: string) => FirestoreUser | undefined;
    getUserByRole: (id: role) => FirestoreUser[] | [];
    createUser: (user: FirestoreUser) => Promise<void>;
    updateUser: (user: FirestoreUser) => Promise<void>;
    deleteUserById: (id: string) => Promise<void>;
    resetPasswordByEmail: (email: string) => Promise<void>;
}


const storeAPI: StateCreator<UsersStore, [["zustand/devtools", never], ["zustand/immer", never]]> = (set, get) => ({

    users: [],
    getAllUsers: async () => {
        try {
            const users = await UserService.getUsers();
            set({ users: [...users] });
        } catch (error) {
            console.warn(error);
        }
    },

    getUserById: (id: string) => {
        const user = get().users.find(user => user.id === id)
        // console.debug('FOUND USER =>',{user})
        return user;
    },
    getUserByRole: (role: role) => get().users.filter((user) => user.role === role),

    createUser: async (user: FirestoreUser) => {
        try {
            await UserService.createUser(user);
            set({ users: [...get().users, user] });
        } catch (error) {
            console.warn(error);
        }
    },

    updateUser: async (user: FirestoreUser) => {
        console.debug(' 👀=====> Editando a ', { user })
        // return 
        await UserService.updateUsers(user);
        set({ users: get().users.map(u => u.id === user.id ? user : u) });

    },

    deleteUserById: async (id: string) => {
        try {
            await UserService.deleteUserById(id);
            set({ users: get().users.filter(u => u.id !== id) });
        } catch (error) {
            console.warn(error);
        }
    },
    resetPasswordByEmail: async (email: string) => {
        AuthService.resetPassword(email);
    }
})


export const useUserStore = create<UsersStore>()(
    devtools(
        persist(storeAPI, { name: 'user-store' })
    )
);