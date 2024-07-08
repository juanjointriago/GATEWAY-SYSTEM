import { create, StateCreator } from "zustand";
import { FirestoreUser } from "../../interface";
import { UserService } from "../../services";
import { devtools, persist } from "zustand/middleware";
import Swal from "sweetalert2";

interface UsersStore {
    users: FirestoreUser[];
    getAllUsers: () => void;
    getUserById: (id: string) => void;
    createUser: (user: FirestoreUser) => void;
    updateUser: (user: FirestoreUser) => void;
    deleteUserById: (id: string) => void;
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

    getUserById: async (id: string) => {
        try {
            const user = await UserService.getUserById(id);
            console.log({ user });
        } catch (error) {
            console.warn(error);
        }
    },

    createUser: async (user: FirestoreUser) => {
        try {
            await UserService.createUser(user);
            set({ users: [...get().users, user] });
        } catch (error) {
            console.warn(error);
        }
    },

    updateUser: async (user: FirestoreUser) => {
        try {
            await UserService.updateUsers(user);
            set({ users: get().users.map(u => u.id === user.id ? user : u) });
            Swal.fire('Usuario actualizado', `El usuario ${user.name} ha sido actualizado`, 'success');
        } catch (error) {
            console.warn(error);
        }
    },

    deleteUserById: async (id: string) => {
        try {
            await UserService.deleteUserById(id);
            set({ users: get().users.filter(u => u.id !== id) });
        } catch (error) {
            console.warn(error);
        }
    }
})


export const useUserStore = create<UsersStore>()(
    devtools(
        persist(storeAPI, { name: 'user-store' })
    )
);