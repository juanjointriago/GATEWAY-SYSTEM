import { getDocsFromCollectionQuery, updateItem, deleteItem } from "../store/firebase/helper";
import { progressSheetInterface } from "../interface/progresssheet.interface";
import { event } from "../interface/events.interface";

/**
 * Servicio para migrar datos de usuario entre colecciones
 */
export class UserMigrationService {
    
    /**
     * Actualizar todas las hojas de progreso de un estudiante
     */
    static async updateProgressSheets(oldUid: string, newUid: string): Promise<number> {
        try {
            const progressSheets = await getDocsFromCollectionQuery<progressSheetInterface>(
                import.meta.env.VITE_COLLECTION_PROGRESS_SHEET,
                'studentId',
                '==',
                oldUid
            );

            console.debug(`Encontradas ${progressSheets.length} hojas de progreso para migrar`);

            for (const sheet of progressSheets) {
                const updatedSheet = {
                    ...sheet,
                    studentId: newUid,
                    updatedAt: Date.now()
                };
                await updateItem(import.meta.env.VITE_COLLECTION_PROGRESS_SHEET, updatedSheet);
            }

            return progressSheets.length;
        } catch (error) {
            console.error('Error actualizando hojas de progreso:', error);
            throw new Error('Error al actualizar hojas de progreso');
        }
    }

    /**
     * Actualizar todas las referencias del usuario en eventos
     */
    static async updateEventsReferences(oldUid: string, newUid: string): Promise<number> {
        try {
            // Obtener todos los eventos
            const allEvents = await getDocsFromCollectionQuery<event>(
                import.meta.env.VITE_COLLECTION_EVENTS,
                'isActive',
                '==',
                true
            );

            console.debug(`Revisando ${allEvents.length} eventos para actualizar referencias`);

            let updatedCount = 0;

            for (const eventItem of allEvents) {
                // Verificar si el usuario está en los estudiantes del evento
                if (eventItem.students && eventItem.students[oldUid]) {
                    // Crear un nuevo objeto de estudiantes sin el antiguo uid
                    const updatedStudents = { ...eventItem.students };
                    const studentStatus = updatedStudents[oldUid];
                    
                    // Eliminar la referencia antigua
                    delete updatedStudents[oldUid];
                    
                    // Agregar la nueva referencia
                    updatedStudents[newUid] = studentStatus;

                    // Actualizar el evento
                    const updatedEvent = {
                        ...eventItem,
                        students: updatedStudents,
                        updatedAt: Date.now()
                    };

                    await updateItem(import.meta.env.VITE_COLLECTION_EVENTS, updatedEvent);
                    updatedCount++;
                }
            }

            console.debug(`Actualizados ${updatedCount} eventos`);
            return updatedCount;
        } catch (error) {
            console.error('Error actualizando eventos:', error);
            throw new Error('Error al actualizar eventos');
        }
    }

    /**
     * Eliminar el registro antiguo del usuario
     */
    static async deleteOldUserRecord(oldUid: string): Promise<void> {
        try {
            await deleteItem(import.meta.env.VITE_COLLECTION_USERS, oldUid);
            console.debug(`Usuario antiguo ${oldUid} eliminado de la colección`);
        } catch (error) {
            console.error('Error eliminando usuario antiguo:', error);
            throw new Error('Error al eliminar usuario antiguo');
        }
    }

    /**
     * Proceso completo de migración de usuario
     */
    static async migrateUserData(
        oldUid: string, 
        newUid: string,
        onProgress?: (step: string, progress: number) => void
    ): Promise<{ 
        progressSheetsUpdated: number; 
        eventsUpdated: number; 
    }> {
        try {
            // Paso 1: Actualizar hojas de progreso
            onProgress?.('Actualizando hojas de progreso...', 50);
            const progressSheetsUpdated = await this.updateProgressSheets(oldUid, newUid);

            // Paso 2: Actualizar eventos
            onProgress?.('Actualizando eventos...', 70);
            const eventsUpdated = await this.updateEventsReferences(oldUid, newUid);

            // Paso 3: Eliminar usuario antiguo
            onProgress?.('Eliminando datos antiguos...', 90);
            await this.deleteOldUserRecord(oldUid);

            onProgress?.('¡Migración completada!', 100);

            return {
                progressSheetsUpdated,
                eventsUpdated
            };
        } catch (error) {
            console.error('Error en proceso de migración:', error);
            throw error;
        }
    }
}
