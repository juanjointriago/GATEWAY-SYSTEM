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
import { NoGradesMessage } from "./NoGradesMessage";
import Swal from "sweetalert2";
import { v6 as uuid } from "uuid";
import { FaUser, FaBuilding, FaCalendarAlt, FaEnvelope, FaPhone, FaBriefcase, FaIdCard, FaDollarSign, FaGraduationCap, FaFileContract } from "react-icons/fa";


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
        const duuid = uuid();
        const newProgressSheet: progressSheetInterface = {
          id: duuid,
          uid: duuid,
          studentId: uid!,
          contractNumber: "000",
          headquarters: "",
          inscriptionDate: new Date().toISOString().split('T')[0],
          expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          myPreferredName: student?.name || "",
          contractDate: new Date().toISOString().split('T')[0],
          work: "",
          enterpriseName: "",
          preferredCI: "",
          conventionalPhone: "",
          familiarPhone: "",
          preferredEmail: student?.email || "",
          otherContacts: student?.phone || "",
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
        setCurrentProgressSheet(newProgressSheet); // Actualizar el estado con el nuevo ProgressSheet
        setShowModal(true); // Abrir el modal
      } catch (error) {
        console.error("Error al crear el Progress Sheet:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo crear el Progress Sheet",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "Aceptar"
        });
      }
    }
  };

  const columns = useMemo<ColumnDef<progressClassesInterface>[]>(
    () => [
      {
        accessorFn: (row) => row.createdAt,
        id: "createdAt",
        cell: (info) => {
          const timestamp = info.getValue() as number;
          const date = new Date(timestamp);
          return <p className="text-start text-nowrap text-xs">{date.toLocaleDateString()}</p>;
        },
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
        accessorFn: (row) => row.eventInfo?.label || row.eventInfo?.value || "",
        id: "eventId",
        cell: (info) => {
          const eventValue = info.getValue() as string;
          const event = getEventById(eventValue);
          return <p className="text-start text-xs">{event?.name || eventValue || "Sin evento"}</p>;
        },
        header: () => <span>Reservación</span>,
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Progress Sheet
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Estudiante: <span className="font-medium text-gray-900">{student?.name}</span>
              </p>
            </div>
            {user && !isTeacher && (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
                type="button"
                onClick={handleAddProgressSheet}
              >
                <FaFileContract className="w-4 h-4" />
                Add Progress-Sheet
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Información del Contrato - Siempre visible cuando existe progressSheet */}
        {myProgressSheet.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <FaFileContract className="text-white text-2xl" />
                <div>
                  <h2 className="text-xl font-bold text-white">Información del Contrato</h2>
                  <p className="text-blue-100 text-sm">
                    Contrato #{myProgressSheet[0].contractNumber || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Información Personal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FaUser className="text-blue-600" />
                    Información Personal
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FaIdCard className="text-gray-400 w-4 h-4" />
                      <div>
                        <p className="text-sm text-gray-600">Nombre Preferido</p>
                        <p className="font-medium text-gray-900">{myProgressSheet[0].myPreferredName || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaIdCard className="text-gray-400 w-4 h-4" />
                      <div>
                        <p className="text-sm text-gray-600">CI Preferido</p>
                        <p className="font-medium text-gray-900">{myProgressSheet[0].preferredCI || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-gray-400 w-4 h-4" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{myProgressSheet[0].preferredEmail || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-gray-400 w-4 h-4" />
                      <div>
                        <p className="text-sm text-gray-600">Teléfono Convencional</p>
                        <p className="font-medium text-gray-900">{myProgressSheet[0].conventionalPhone || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-gray-400 w-4 h-4" />
                      <div>
                        <p className="text-sm text-gray-600">Teléfono Familiar</p>
                        <p className="font-medium text-gray-900">{myProgressSheet[0].familiarPhone || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-gray-400 w-4 h-4" />
                      <div>
                        <p className="text-sm text-gray-600">Otros Contactos</p>
                        <p className="font-medium text-gray-900">{myProgressSheet[0].otherContacts || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información Laboral */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FaBriefcase className="text-blue-600" />
                    Información Laboral
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FaBuilding className="text-gray-400 w-4 h-4" />
                      <div>
                        <p className="text-sm text-gray-600">Empresa</p>
                        <p className="font-medium text-gray-900">{myProgressSheet[0].enterpriseName || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaBriefcase className="text-gray-400 w-4 h-4" />
                      <div>
                        <p className="text-sm text-gray-600">Trabajo</p>
                        <p className="font-medium text-gray-900">{myProgressSheet[0].work || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaGraduationCap className="text-gray-400 w-4 h-4" />
                      <div>
                        <p className="text-sm text-gray-600">Programa</p>
                        <p className="font-medium text-gray-900">{myProgressSheet[0].program || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaBuilding className="text-gray-400 w-4 h-4" />
                      <div>
                        <p className="text-sm text-gray-600">Sede</p>
                        <p className="font-medium text-gray-900">{myProgressSheet[0].headquarters || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información Financiera */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FaDollarSign className="text-blue-600" />
                    Información Financiera
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm text-gray-600">Total Pagado</p>
                        <p className="font-medium text-green-600">${myProgressSheet[0].totalPaid || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <div>
                        <p className="text-sm text-gray-600">Total Pendiente</p>
                        <p className="font-medium text-red-600">${myProgressSheet[0].totalDue || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm text-gray-600">Total General</p>
                        <p className="font-medium text-blue-600">${myProgressSheet[0].totalFee || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      <div>
                        <p className="text-sm text-gray-600">Total Descuento</p>
                        <p className="font-medium text-purple-600">${myProgressSheet[0].totalDiscount || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                      <div>
                        <p className="text-sm text-gray-600">Cantidad de Cuotas</p>
                        <p className="font-medium text-orange-600">{myProgressSheet[0].quotesQty || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
                      <div>
                        <p className="text-sm text-gray-600">Valor de Cuota</p>
                        <p className="font-medium text-indigo-600">${myProgressSheet[0].quoteValue || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fechas del Contrato */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <FaCalendarAlt className="text-blue-600" />
                  Fechas del Contrato
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600 font-medium">Fecha de Inscripción</p>
                    <p className="text-lg font-bold text-blue-800">
                      {myProgressSheet[0].inscriptionDate ? new Date(myProgressSheet[0].inscriptionDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-600 font-medium">Fecha de Contrato</p>
                    <p className="text-lg font-bold text-green-800">
                      {myProgressSheet[0].contractDate ? new Date(myProgressSheet[0].contractDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm text-orange-600 font-medium">Fecha de Expiración</p>
                    <p className="text-lg font-bold text-orange-800">
                      {myProgressSheet[0].expirationDate ? new Date(myProgressSheet[0].expirationDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-red-600 font-medium">Fecha de Vencimiento</p>
                    <p className="text-lg font-bold text-red-800">
                      {myProgressSheet[0].dueDate ? new Date(myProgressSheet[0].dueDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              {myProgressSheet[0].observation && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Observaciones</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{myProgressSheet[0].observation}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contenido de Progress Classes o Mensaje de No Grades */}
        {myProgressSheet.length > 0 ? (
          myProgressSheet[0].progressClasses && myProgressSheet[0].progressClasses.length > 0 ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaGraduationCap className="text-2xl" />
                  Progress Classes
                </h2>
                <p className="text-green-100 text-sm mt-1">
                  {myProgressSheet[0].progressClasses.length} {myProgressSheet[0].progressClasses.length === 1 ? 'clase registrada' : 'clases registradas'}
                </p>
              </div>
              <div className="p-6">
                <TableGeneric 
                  columns={columns} 
                  data={myProgressSheet[0].progressClasses} 
                />
              </div>
            </div>
          ) : (
            <NoGradesMessage 
              message="Puedes solicitar a tu docente que califique tus asistencias para acceder a tu progress sheet completo." 
            />
          )
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FaFileContract size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay Progress Sheet disponible
            </h3>
            <p className="text-gray-600 mb-4">
              Aún no se ha creado un Progress Sheet para este estudiante.
            </p>
            {user && !isTeacher && (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-colors duration-200"
                type="button"
                onClick={handleAddProgressSheet}
              >
                Crear Progress Sheet
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal para agregar Progress Class */}
      {currentProgressSheet && student && (
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