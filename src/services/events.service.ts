import { WhereFilterOp } from "firebase/firestore";
import { event } from "../interface";
import { deleteItem, getDocsFromCollection, getDocsFromCollectionQuery, setItem, updateItem } from "../store/firebase/helper";

export class EventService {
    static getEvents = async () => await getDocsFromCollection<event>(import.meta.env.VITE_COLLECTION_EVENTS);

    static getEventsQuery = async (field: string, clausule: WhereFilterOp, compareValue: string | number | boolean) => await getDocsFromCollectionQuery<event>(import.meta.env.VITE_COLLECTION_EVENTS, field, clausule, compareValue);

    static createEvent = async (event: event) => await setItem(import.meta.env.VITE_COLLECTION_EVENTS, event);

    static updateEvent = async (event: event) => await updateItem(import.meta.env.VITE_COLLECTION_EVENTS, event);

    static deleteEventById = async (id: string) => await deleteItem(import.meta.env.VITE_COLLECTION_EVENTS, id);
}