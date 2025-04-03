import { useParams } from "react-router-dom";
import { useUserStore } from "../../stores";
import { TableGeneric } from "../../components/shared/tables/TableGeneric";
import { useProgressSheetStore } from "../../stores/progress-sheet/progresssheet.store";

export const ProgressSheetPage = () => {
  const { uid } = useParams<{ uid: string }>(); // Obtener el parámetro uid desde la URL
  const getUserById = useUserStore((state) => state.getUserById);
  const student = getUserById(uid!); // Obtener los datos del estudiante desde Zustand

  // Suponiendo que el progreso del estudiante está en student.progress
  // const progressData = student?.progress || [];
  const progressSheet = useProgressSheetStore(state => state.progressSheets);

  // Configurar las columnas de la tabla
  const columns = [
    { accessorKey: "date", header: "Fecha" },
    { accessorKey: "activity", header: "Actividad" },
    { accessorKey: "score", header: "Puntaje" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Progress Sheet de {student?.name}
      </h1>
      {progressSheet.length > 0 ? (
        <TableGeneric columns={columns} data={progressSheet} />
      ) : (
        <p>No hay datos de progreso para este estudiante.</p>
      )}
    </div>
  );
};