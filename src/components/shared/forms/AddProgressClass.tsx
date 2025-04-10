import { FC, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  progressClassesInterface,
  progressSheetInterface,
} from "../../../interface/progresssheet.interface";
import { useProgressSheetStore } from "../../../stores/progress-sheet/progresssheet.store";
import Swal from "sweetalert2";
import { useUserStore } from "../../../stores";
import { useEventStore } from "../../../stores/events/event.store";
import Select, { SingleValue } from "react-select"; // Importar react-select

interface Props {
  progressSheet: progressSheetInterface;
  studentId: string
}




export const AddProgressClass: FC<Props> = ({ progressSheet, studentId }) => {

  const createProgressSheet = useProgressSheetStore((state) => state.createProgressSheet);
  
  const updateProgressSheet = useProgressSheetStore(
    (state) => state.updateProgressSheet
  ); // Función para actualizar en Firebase
  const getUserById = useUserStore((state) => state.getUserById);
  const getEventsByStudentId = useEventStore(
    (state) => state.getEventsByStudentId
  );
  const [currentProgressSheet, setCurrentProgressSheet] = useState<progressSheetInterface | null>(
    progressSheet
  );

  // Crear automáticamente un progressSheet si no existe
  useEffect(() => {
    const createProgressSheetIfNotExists = async () => {
      if (!currentProgressSheet) {
        try {
          setIsLoading(true);
          const newProgressSheet = {
            studentId: '',
            myPreferredName: "",
            otherContacts: "",
            inscriptionDate: "",
            expirationDate: "",
            progressClasses: [], // Inicialmente vacío
            createdAt: Date.now(),
          }
           await createProgressSheet(newProgressSheet);
          setCurrentProgressSheet(newProgressSheet); // Actualizar el estado con el nuevo progressSheet
        } catch (error) {
          console.error("Error al crear el Progress Sheet:", error);
          Swal.fire("Error", "No se pudo crear el Progress Sheet", "error");
        } finally {
          setIsLoading(false);
        }
      }
    };

    createProgressSheetIfNotExists();
  }, [currentProgressSheet, createProgressSheet, studentId]);
  const studentEvents = getEventsByStudentId(studentId);

  const [isLoading, setIsLoading] = useState(false); // Estado para mostrar el mensaje de carga

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<progressClassesInterface>();

  const onSubmit = async (data: progressClassesInterface) => {
    try {
      if (!progressSheet) {
        Swal.fire(
          "Error",
          "No se encontró un Progress Sheet para este estudiante",
          "error"
        );
        return;
      }

      setIsLoading(true); // Mostrar mensaje de carga

      const currentProgressSheet = progressSheet; // Obtener el objeto completo del Progress Sheet
      const updatedProgressClasses = [
        ...currentProgressSheet.progressClasses,
        { ...data, createdAt: Date.now() },
      ];

      const updatedProgressSheet = {
        ...currentProgressSheet,
        progressClasses: updatedProgressClasses,
      };

      // Actualizar en Firebase
      await updateProgressSheet(updatedProgressSheet);

      Swal.fire("Éxito", "El registro se ha agregado correctamente", "success");

      // Limpiar el formulario
      reset();
    } catch (error) {
      console.error("Error al agregar el registro:", error);
      Swal.fire("Error", "No se pudo agregar el registro", "error");
    } finally {
      setIsLoading(false); // Ocultar mensaje de carga
    }
  };

  // Opciones para el autocompletado
  const eventOptions =
    studentEvents?.map((event) => ({
      value: event.id,
      label: event.name,
    })) ?? [];

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">
        Student:{" "}
        <p className="text-gray-600">
          {getUserById(studentId)?.name}
        </p>
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Evento */}
        <div>
          <label className="block text-gray-700">Evento</label>
          <Controller
            name="eventId"
            control={control}
            rules={{ required: "El evento es obligatorio" }}
            render={({ field }) => (
              <Select
                {...field}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                options={eventOptions as SingleValue<any>[]}
                placeholder="Seleccione un evento"
                className="w-full"
                classNamePrefix="react-select"
                isSearchable // Habilitar búsqueda
              />
            )}
          />
          {errors.eventId && (
            <p className="text-red-500 text-sm">{errors.eventId.message}</p>
          )}
        </div>

        {/* Libro */}
        <div>
          <label className="block text-gray-700">Libro</label>
          <input
            type="text"
            {...register("book", { required: "El libro es obligatorio" })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.book && (
            <p className="text-red-500 text-sm">{errors.book.message}</p>
          )}
        </div>

        {/* Lección */}
        <div>
          <label className="block text-gray-700">Lección</label>
          <input
            type="text"
            {...register("lesson", { required: "La lección es obligatoria" })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.lesson && (
            <p className="text-red-500 text-sm">{errors.lesson.message}</p>
          )}
        </div>

        {/* NA */}
        <div>
          <label className="block text-gray-700">NA</label>
          <input
            type="text"
            {...register("na", { required: "Este campo es obligatorio" })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.na && (
            <p className="text-red-500 text-sm">{errors.na.message}</p>
          )}
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-gray-700">Observaciones</label>
          <textarea
            {...register("observation", {
              maxLength: {
                value: 500,
                message: "La observación no puede exceder los 500 caracteres",
              },
            })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.observation && (
            <p className="text-red-500 text-sm">{errors.observation.message}</p>
          )}
        </div>

        {/* Parte */}
        <div>
          <label className="block text-gray-700">Parte</label>
          <input
            type="text"
            {...register("part", { required: "Este campo es obligatorio" })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.part && (
            <p className="text-red-500 text-sm">{errors.part.message}</p>
          )}
        </div>

        {/* Progreso */}
        <div>
          <label className="block text-gray-700">Progreso</label>
          <input
            type="text"
            {...register("progress", {
              required: "El progreso es obligatorio",
            })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.progress && (
            <p className="text-red-500 text-sm">{errors.progress.message}</p>
          )}
        </div>

        {/* RW */}
        <div>
          <label className="block text-gray-700">RW</label>
          <input
            type="text"
            {...register("rw", { required: "Este campo es obligatorio" })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.rw && (
            <p className="text-red-500 text-sm">{errors.rw.message}</p>
          )}
        </div>

        {/* Prueba */}
        <div>
          <label className="block text-gray-700">Prueba</label>
          <input
            type="text"
            {...register("test", { required: "Este campo es obligatorio" })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.test && (
            <p className="text-red-500 text-sm">{errors.test.message}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={() => {
              Swal.fire({
                title: "¿Estás seguro?",
                text: "Los cambios no guardados se perderán",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, cancelar",
                cancelButtonText: "No, continuar",
              }).then((result) => {
                if (result.isConfirmed) {
                  reset();
                }
              });
            }} // Botón para cancelar y limpiar el formulario
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={isLoading || Object.keys(errors).length > 0} // Deshabilitar si hay errores
          >
            {isLoading ? "Guardando..." : "Agregar Progreso"}
          </button>
        </div>
      </form>
    </div>
  );
};
