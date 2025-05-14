import { useParams } from "react-router-dom";
import { useAuthStore, useUserStore } from "../../stores";
import { TableGeneric } from "../../components/shared/tables/TableGeneric";
import { useProgressSheetStore } from "../../stores/progress-sheet/progresssheet.store";
import { progressClassesInterface, progressSheetInterface } from "../../interface/progresssheet.interface";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useEventStore } from "../../stores/events/event.store";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { AddProgressClass } from "../../components/shared/forms/AddProgressClass";
import Swal from "sweetalert2";
import { v6 as uuid } from "uuid";


export const ProgressSheetPage = () => {
  const { uid } = useParams<{ uid: string }>(); // Obtener el parámetro uid desde la URL
  const getUserById = useUserStore((state) => state.getUserById);
  const student = getUserById(uid!); // Obtener los datos del estudiante desde Zustand
  const getEventById = useEventStore((state) => state.getEventById);
  const getAndSetProgressSheets = useProgressSheetStore((state) => state.getAndSetProgressSheets);
  const createProgressSheet = useProgressSheetStore((state) => state.createProgressSheet); // Función para crear un progressSheet
  const user = useAuthStore((state) => state.user);
  const isTeacher = user && user.role === "teacher";

  const [showModal, setShowModal] = useState(false);
  const [currentProgressSheet, setCurrentProgressSheet] = useState<progressSheetInterface | null>(null);

  const progressSheet = useProgressSheetStore((state) => state.progressSheets);
  const myProgressSheet = progressSheet.filter((ps) => ps.studentId === uid);

  useEffect(() => {
    getAndSetProgressSheets();
  }, [getAndSetProgressSheets]);

  // Verificar o crear el ProgressSheet
  const handleAddProgressSheet = async () => {
    if (myProgressSheet.length > 0) {
      // Si ya existe un ProgressSheet, usar el existente
      setCurrentProgressSheet(myProgressSheet[0]);
      setShowModal(true);
    } else {
      // Si no existe, crear uno nuevo
      try {
        const newProgressSheet: progressSheetInterface = {
          id: uuid(),
          studentId: uid!,
          myPreferredName: student?.name || "",
          otherContacts: student?.phone || "",
          inscriptionDate: Date.now().toString() || "",
          expirationDate:  "",
          progressClasses: [], // Inicialmente vacío
          createdAt: Date.now(),
        };

       await createProgressSheet(newProgressSheet);
        setCurrentProgressSheet(newProgressSheet); // Actualizar el estado con el nuevo ProgressSheet
        setShowModal(true); // Abrir el modal
      } catch (error) {
        console.error("Error al crear el Progress Sheet:", error);
        Swal.fire("Error", "No se pudo crear el Progress Sheet", "error");
      }
    }
  };

  const columns = useMemo<ColumnDef<progressClassesInterface>[]>(
    () => [
      {
        accessorFn: (row) => row.createdAt,
        id: "createdAt",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() as string}</p>,
        header: () => <span>Date</span>,
      },
      {
        accessorKey: "a",
        id: "a",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() as string}</p>,
        header: () => <span>A</span>,
      },
      {
        accessorKey: "book",
        id: "book",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() as string}</p>,
        header: () => <span>Book</span>,
      },
      {
        accessorFn: (row) => row.eventInfo.label,
        id: "eventId",
        cell: (info) => <p className="text-start text-xs">{getEventById(info.getValue() as string)?.name}</p>,
        header: () => <span>Reservacion</span>,
      },
      {
        accessorFn: (row) => row.lesson,
        id: "lesson",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() as string}</p>,
        header: () => <span>Lesson</span>,
      },
      {
        accessorFn: (row) => row.na,
        id: "na",
        cell: (data) => <p className="text-start text-nowrap text-xs">{data.getValue() as string}</p>,
        enableColumnFilter: false,
        header: () => <span>NA</span>,
      },
      {
        accessorFn: (row) => row.observation,
        id: "observation",
        cell: (data) => <p className="text-start text-nowrap text-xs">{data.getValue() as string}</p>,
        enableColumnFilter: false,
        header: () => <span>Observation</span>,
      },
      {
        accessorFn: (row) => row.part,
        id: "part",
        cell: (data) => <p className="text-start text-nowrap text-xs">{data.getValue() as string}</p>,
        enableColumnFilter: false,
        header: () => <span>Part</span>,
      },
      {
        accessorFn: (row) => row.progress,
        id: "progress",
        cell: (data) => <p className="text-start text-nowrap text-xs">{data.getValue() as string}</p>,
        enableColumnFilter: false,
        header: () => <span>Progress</span>,
      },
      {
        accessorFn: (row) => row.rw,
        id: "rw",
        cell: (data) => <p className="text-start text-nowrap text-xs">{data.getValue() as string}</p>,
        enableColumnFilter: false,
        header: () => <span>RW</span>,
      },
      {
        accessorFn: (row) => row.test,
        id: "test",
        cell: (data) => <p className="text-start text-nowrap text-xs">{data.getValue() as string}</p>,
        enableColumnFilter: false,
        header: () => <span>Test</span>,
      },
    ],
    [getEventById]
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Progress Sheet de {student?.name}
      </h1>
      <div className="flex flex-row">
        {user && !isTeacher && (
          <button
            className="mr-1 ml-q bg-blue-500 mb-5 text-white px-4 py-2 rounded"
            type="button"
            onClick={handleAddProgressSheet}
          >
            Add Progress-Sheet
          </button>
        )}
      </div>
      {/* Tabla de progreso */}
      <TableGeneric columns={columns} data={myProgressSheet.length > 0 ? myProgressSheet[0].progressClasses : []} />
      {currentProgressSheet && student &&(
        <ModalGeneric
          key={"frm"}
          isVisible={showModal}
          setIsVisible={setShowModal}
          title={"Add Progress-Sheet"}
          children={<AddProgressClass progressSheet={currentProgressSheet} studentId={student?.uid} />}
        />
      )}
    </div>
  );
};