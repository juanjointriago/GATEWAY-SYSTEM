import { create, StateCreator } from "zustand";
import { event } from "../../interface";
import { EventService } from "../../services/events.service";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface EventStore {
    events: event[],
    getAndSetEvents: () => Promise<void>;
    getAllEvents: () => Promise<void>;
    getEventsQuery: () => Promise<void>;
    getEventById: (id: string) => event | undefined;
    getEventsByStudentId: (id: string) => event[] ;
    createEvent: (event: event) => Promise<void>;
    updateEvent: (event: event) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;
    clearCache: () => void;
}



const storeAPI: StateCreator<EventStore, [["zustand/devtools", never], ["zustand/immer", never]]> = (set, get) => ({
    events: [],
    getAndSetEvents: async () => {
        try {
            const events = await EventService.getEvents();
            set({ events: [...events] })
            console.debug('ALL EVENT FOUNDED ===>', { events })
        } catch (error) {
            console.warn(error);
        }
    },
    getAllEvents: async () => {
        const events = await EventService.getEvents();
        set({ events: [...events] })
    },
    getEventsQuery: async () => {
        const year = new Date().getFullYear();
        const month = new Date().getMonth()-4;
        const day = new Date().getDate();
        const date = new Date(year, month, day);
        const events = await EventService.getEventsQuery('date', '>=', date.getTime());
        set({ events: [...events] })
    },
    getEventById: (id: string) => get().events.find(event => event.id === id),
    
    getEventsByStudentId: (id: string) => get().events.filter(event => event.students[id]),
    createEvent: async (event: event) => {
        await EventService.createEvent(event);
        // Después de crear en Firebase, refrescar los eventos desde la base de datos
        const events = await EventService.getEvents();
        set({ events: [...events] });
    },
    updateEvent: async (event: event) => {
        await EventService.updateEvent(event);
        // Después de actualizar en Firebase, refrescar los eventos desde la base de datos
        const events = await EventService.getEvents();
        set({ events: [...events] });
    },
    deleteEvent: async (id: string) => {
        await EventService.deleteEventById(id);
        // Después de eliminar en Firebase, refrescar los eventos desde la base de datos
        const events = await EventService.getEvents();
        set({ events: [...events] });
    },
    clearCache: () => {
        set({ events: [] });
    }
});


export const useEventStore = create<EventStore>()(
    devtools(
        immer(
            persist(storeAPI, { name: 'event-store' })
        )
    )
);