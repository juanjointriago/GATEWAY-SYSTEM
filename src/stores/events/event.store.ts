import { create, StateCreator } from "zustand";
import { event } from "../../interface";
import { EventService } from "../../services/events.service";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface EventStore {
    events: event[],
    getAndSetEvents: () => Promise<void>;
    getEventsQuery: () => Promise<void>;
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
            console.log('ALL EVENT FOUNDED ===>', { events })
        } catch (error) {
            console.warn(error);
        }
    },
    getEventsQuery: async () => {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() - 4;
        const day = new Date().getDate();
        const date = new Date(year, month, day);
        const events = await EventService.getEventsQuery('date', '>=', date.getTime());
        set({ events: [...events] })
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
        immer(
            persist(storeAPI, { name: 'event-store' })
        )
    )
);