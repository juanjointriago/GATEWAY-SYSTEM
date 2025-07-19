import { FC, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  progressClassesInterface,
  progressSheetInterface,
} from "../../../interface/progresssheet.interface";
import { useProgressSheetStore } from "../../../stores/progress-sheet/progresssheet.store";
import CustomModal from "../../../components/CustomModal";
import { useUserStore } from "../../../stores";
import { useEventStore } from "../../../stores/events/event.store";
import Select, { SingleValue } from "react-select"; // Importar react-select
import { v6 as uuid } from "uuid";

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

  // Estados para CustomModal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<'warn' | 'info' | 'danger' | 'success'>('info');
  const [modalAction, setModalAction] = useState<() => Promise<void> | void>(() => {});
  // Crear automáticamente un progressSheet si no existe
  useEffect(() => {
    const createProgressSheetIfNotExists = async () => {
      if (!currentProgressSheet) {
        try {
          const duuid = uuid();
          setIsLoading(true);
          const newProgressSheet: progressSheetInterface = {
            id: duuid,
            uid: duuid,
            studentId: studentId,
            contractNumber: "000",
            headquarters: "",
            inscriptionDate: new Date().toISOString().split('T')[0],
            expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            myPreferredName: getUserById(studentId)?.name || "",
            contractDate: new Date().toISOString().split('T')[0],
            work: "",
            enterpriseName: "",
            preferredCI: "",
            conventionalPhone: "",
            familiarPhone: "",
            preferredEmail: "",
            otherContacts: "",
            program: "",
            observation: "",
            totalFee: 0,
            totalPaid: 0,
            totalDue: 0,
            totalDiscount: 0,
            quotesQty: 0,
            quoteValue: 0,
            dueDate: "",
            progressClasses: [], // Inicialmente vacío
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          await createProgressSheet(newProgressSheet);
          setCurrentProgressSheet(newProgressSheet); // Actualizar el estado con el nuevo progressSheet
        } catch (error) {
          console.error("Error al crear el Progress Sheet:", error);
          setModalTitle("Error");
          setModalMessage("No se pudo crear el Progress Sheet");
          setModalType("danger");
          setModalAction(() => () => setModalOpen(false));
          setModalOpen(true);
        } finally {
          setIsLoading(false);
        }
      }
    };
    createProgressSheetIfNotExists();
  }, [currentProgressSheet, createProgressSheet, studentId, getUserById]);
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
      // Usar currentProgressSheet si progressSheet no está disponible
      const targetProgressSheet = progressSheet || currentProgressSheet;
      if (!targetProgressSheet) {
        setModalTitle("Error");
        setModalMessage("No se encontró un Progress Sheet para este estudiante");
        setModalType("danger");
        setModalAction(() => () => setModalOpen(false));
        setModalOpen(true);
        return;
      }
      setIsLoading(true); // Mostrar mensaje de carga
      const updatedProgressClasses = [
        ...targetProgressSheet.progressClasses,
        { ...data, createdAt: Date.now(), updatedAt: Date.now() },
      ];
      const updatedProgressSheet: progressSheetInterface = {
        ...targetProgressSheet,
        progressClasses: updatedProgressClasses,
        updatedAt: Date.now(),
      };
      // Actualizar en Firebase
      await updateProgressSheet(updatedProgressSheet);
      // Actualizar el estado local
      setCurrentProgressSheet(updatedProgressSheet);
      setModalTitle("Éxito");
      setModalMessage("El registro se ha agregado correctamente");
      setModalType("success");
      setModalAction(() => () => setModalOpen(false));
      setModalOpen(true);
      // Limpiar el formulario
      reset();
    } catch (error) {
      console.error("Error al agregar el registro:", error);
      setModalTitle("Error");
      setModalMessage("No se pudo agregar el registro");
      setModalType("danger");
      setModalAction(() => () => setModalOpen(false));
      setModalOpen(true);
    } finally {
      setIsLoading(false); // Ocultar mensaje de carga
    }
  };

  // Opciones para el autocompletado
  const eventOptions =
    studentEvents?.map((event) => ({
      value: event.id,
      label: `${event.name} (${new Date(event.date).toLocaleDateString("es-ES")})`, // Mostrar nombre y fecha del evento
    })) ?? [];

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">
        Student:{" "}
        <span className="text-gray-600">
          {getUserById(studentId)?.name || "Estudiante no encontrado"}
        </span>
      </h2>
      
      {isLoading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-600">Cargando...</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Evento */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Evento *</label>
          <Controller
            name="eventInfo"
            control={control}
            rules={{ required: "El evento es obligatorio" }}
            render={({ field }) => (
              <Select
                {...field}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                options={eventOptions as SingleValue<any>[]}
                placeholder="Seleccione un evento donde ha participado el estudiante"
                className="w-full"
                classNamePrefix="react-select"
                isSearchable // Habilitar búsqueda
                noOptionsMessage={() => "No se encontraron eventos"}
              />
            )}
          />
          {errors.eventInfo && (
            <p className="text-red-500 text-sm mt-1">{errors.eventInfo.message}</p>
          )}
        </div>

        {/* Libro */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Libro *</label>
          <input
            type="text"
            {...register("book", { required: "El libro es obligatorio" })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese el libro"
          />
          {errors.book && (
            <p className="text-red-500 text-sm mt-1">{errors.book.message}</p>
          )}
        </div>

        {/* Lección */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Lección *</label>
          <input
            type="text"
            {...register("lesson", { required: "La lección es obligatoria" })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese la lección"
          />
          {errors.lesson && (
            <p className="text-red-500 text-sm mt-1">{errors.lesson.message}</p>
          )}
        </div>

        {/* NA */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">NA *</label>
          <input
            type="text"
            {...register("na", { required: "Este campo es obligatorio" })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese NA"
          />
          {errors.na && (
            <p className="text-red-500 text-sm mt-1">{errors.na.message}</p>
          )}
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Observaciones</label>
          <textarea
            {...register("observation", {
              maxLength: {
                value: 500,
                message: "La observación no puede exceder los 500 caracteres",
              },
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
            placeholder="Ingrese observaciones (opcional)"
          />
          {errors.observation && (
            <p className="text-red-500 text-sm mt-1">{errors.observation.message}</p>
          )}
        </div>

        {/* Parte */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Parte *</label>
          <input
            type="text"
            {...register("part", { required: "Este campo es obligatorio" })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese la parte"
          />
          {errors.part && (
            <p className="text-red-500 text-sm mt-1">{errors.part.message}</p>
          )}
        </div>

        {/* Progreso */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Progreso *</label>
          <input
            type="text"
            {...register("progress", {
              required: "El progreso es obligatorio",
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese el progreso"
          />
          {errors.progress && (
            <p className="text-red-500 text-sm mt-1">{errors.progress.message}</p>
          )}
        </div>

        {/* RW */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">RW *</label>
          <input
            type="text"
            {...register("rw", { required: "Este campo es obligatorio" })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese RW"
          />
          {errors.rw && (
            <p className="text-red-500 text-sm mt-1">{errors.rw.message}</p>
          )}
        </div>

        {/* Prueba */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Prueba *</label>
          <input
            type="text"
            {...register("test", { required: "Este campo es obligatorio" })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese la prueba"
          />
          {errors.test && (
            <p className="text-red-500 text-sm mt-1">{errors.test.message}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            onClick={() => {
              setModalTitle("¿Estás seguro?");
              setModalMessage("Los cambios no guardados se perderán");
              setModalType("warn");
              setModalAction(() => () => { reset(); setModalOpen(false); });
              setModalOpen(true);
            }}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || Object.keys(errors).length > 0}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span>Guardando...</span>
              </div>
            ) : (
              "Agregar Progreso"
            )}
          </button>
        </div>
      </form>
    <CustomModal
      isOpen={modalOpen}
      title={modalTitle}
      message={modalMessage}
      type={modalType}
      onConfirm={modalAction}
      onCancel={() => setModalOpen(false)}
    />
    </div>
  );
};
