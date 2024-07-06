import { course } from "../interface";
import { deleteItem, getDocsFromCollection, setItem, updateItem } from "../store/firebase/helper";

export class CourseService {
    static getCourses = async () => await getDocsFromCollection<course>(import.meta.env.VITE_COLLECTION_COURSES);

    static createLevel = async (course: course) => await setItem(import.meta.env.VITE_COLLECTION_COURSES, course);

    static updateLevelById = async (course: course) => await updateItem(import.meta.env.VITE_COLLECTION_COURSES, course);

    static deleteLevelById = async (id: string) => await deleteItem(import.meta.env.VITE_COLLECTION_COURSES, id);

}