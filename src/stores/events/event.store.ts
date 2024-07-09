import { create, StateCreator } from "zustand";
import { event } from "../../interface";
import { EventService } from "../../services/events.service";
import { devtools, persist } from "zustand/middleware";

interface EventStore {
    events: event[],
    getAndSetEvents: () => Promise<void>;
    getEventById: (id: string) => event | undefined;
    createEvent: (event: event) => Promise<void>;
    updateEvent: (event: event) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;
}



const storeAPI: StateCreator<EventStore, [["zustand/devtools", never], ["zustand/immer", never]]> = (set, get) => ({
    events: [],
    getAndSetEvents: async () => {
        try {
            const events = await EventService.getEvents();
            set({ events: [...events] })
        } catch (error) {
            console.warn(error);
        }
    },
    getEventById: (id: string) => get().events.find(event => event.id = id),

    createEvent: async (event: event) => {
        await EventService.createEvent(event);
        set({ events: [...get().events, event] })
    },
    updateEvent: async (event: event) => {
        await EventService.updateEvent(event);
        set({ events: [...get().events.map(e => e.id === event.id ? event : e)] })
    },
    deleteEvent: async (id: string) => {
        await EventService.deleteEventById(id);
        set({ events: [...get().events.filter(event => event.id !== id)] })
    }
});


export const useEventStore = create<EventStore>()(
    devtools(
        persist(storeAPI, { name: 'event-store' })
    )
);