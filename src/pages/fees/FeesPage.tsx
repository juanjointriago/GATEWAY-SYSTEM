import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fee } from "../../interface/fees.interface";
import { TableGeneric } from "../../components/shared/tables/TableGeneric";
import { useFeesStore } from "../../stores/fees/fess.store";
import { useAuthStore, useUserStore } from "../../stores";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { AddFeeForm } from "../../components/shared/forms/AddFeeForm";
import PDFPreview from "../../components/shared/pdf/PDFPreview";
import { MdPictureAsPdf } from "react-icons/md";

export const FeesPage = () => {
  const getAndSetFees = useFeesStore((state) => state.getAndSetFees);
  const fees = useFeesStore((state) => state.fees);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user && user.role === "admin";
  const isTeacher = user && user.role === "teacher";
  const getUserById = useUserStore((state) => state.getUserById);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<fee | null>(null); // Estado para la fila seleccionada
  const [showPreview, setShowPreview] = useState(false); // Estado para

  const handleGeneratePDF = useCallback((row: fee) => {
    setSelectedRow(row); // Guardar la fila seleccionada
    setShowPreview(true); // Mostrar la vista previa
  }, []);

  const handleClosePreview = useCallback(() => {
    setSelectedRow(null); // Limpiar la fila seleccionada
    setShowPreview(false); // Ocultar la vista previa
  }, []);

  const columns = useMemo<ColumnDef<fee>[]>(
    () => [
      {
        accessorKey: "code",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() as string}</p>,
        header: () => <span>Nro.</span>,
      },
      {
        accessorKey: "docNumber",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() ? info.getValue() as string :'Efectivo'}</p>,
        header: () => <span>Comprobante</span>,
      },
      {
        accessorFn: (row) => row.place,
        id: "place",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() as string}</p>,
        header: () => <span>Lugar</span>,
      },
      {
        accessorFn: (row) => row.createdAt,
        id: "createdAt",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() as string}</p>,
        header: () => <span>Fecha</span>,
      },
      {
        accessorFn: (row) => row.reason,
        id: "reason",
        cell: (info) => <p className="text-start text-xs">{info.getValue() as string}</p>,
        header: () => <span>Motivo</span>,
      },
      {
        accessorFn: (row) => row.cc,
        id: "cc",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() as string}</p>,
        header: () => <span>CI Estudiante</span>,
      },
      {
        accessorFn: (row) => row.paymentMethod,
        id: "paymentMethod",
        cell: (info) => (
            <span className="text-start text-xs">
              {info.getValue() === "cash"
                ? "💵 Cash"
                : ((info.getValue() === "transference" || "deposit") as string)
                ? "📄 Trasnference / Deposit"
                : "💳 Credit/Debit Card"}
            </span>
        ),
        enableColumnFilter: false,
        header: () => <span>Forma de pago</span>,
      },
      {
        accessorFn: (row) => row.qty,
        id: "qty",
        cell: (info) => <p className="text-start text-nowrap text-xs">{"$"+info.getValue() as string}</p>,
        header: () => <span>Valor</span>,
      },
      {
        accessorFn: (row) => row.imageUrl,
        id: "imageUrl",
        cell: (data) => (
          <>
          {
            data.getValue()?<img
            src={data.getValue() as string}
            alt="No disponible"
            className="w-20 h-20 rounded-full object-cover"
          />:<p className="text-start text-nowrap text-xs">{data.getValue() as string}</p>
          }
          </>
        ),
        enableColumnFilter: false,
        header: () => <span>Evidencia</span>,
      },
      {
        id: "actions",
        header: () => <span>Acciones</span>,
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 text-xs sm:text-sm font-medium whitespace-nowrap"
              onClick={() => handleGeneratePDF(row.original)}
              title="Imprimir recibo"
            >
              <MdPictureAsPdf className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
          </div>
        ),
      },
      // { accessorFn: row =>row.studentUid, id: "studentUid", cell: (info) => info.getValue(), header:(item)=><span>{getStudentByUid(item.column)}</span> },
    ],
    [handleGeneratePDF]
  );
  const studentColumns = useMemo<ColumnDef<fee>[]>(
    () => [
      {
        accessorFn: (row) => row.createdAt,
        id: "createdAt",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() as string}</p>,
        header: () => <span>Fecha</span>,
      },
      {
        accessorKey: "code",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() as string}</p>,
        header: () => <span>Nro.</span>,
      },
      {
        accessorKey: "docNumber",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() ? info.getValue() as string :'Efectivo'}</p>,
        header: () => <span>Comprobante</span>,
      },
      {
        accessorFn: (row) => row.reason,
        id: "reason",
        cell: (info) => <p className="text-start text-xs">{info.getValue() as string}</p>,
        header: () => <span>Motivo</span>,
      },
      {
        accessorFn: (row) => row.paymentMethod,
        id: "paymentMethod",
        cell: (info) => (
            <span className="text-start text-xs">
              {info.getValue() === "cash"
                ? "💵 Cash"
                : ((info.getValue() === "transference" || "deposit") as string)
                ? "📄 Trasnference / Deposit"
                : "💳 Credit/Debit Card"}
            </span>
        ),
        enableColumnFilter: false,
        header: () => <span>Forma de pago</span>,
      },
      {
        accessorFn: (row) => row.qty,
        id: "qty",
        cell: (info) => <p className="text-start text-nowrap text-xs">{"$"+info.getValue() as string}</p>,
        header: () => <span>Valor</span>,
      },
      {
        accessorFn: (row) => row.imageUrl,
        id: "imageUrl",
        cell: (data) => (
          <>
          {
            data.getValue()?<img
            src={data.getValue() as string}
            alt="No disponible"
            className="w-20 h-20 rounded-full object-cover"
          />:<p className="text-start text-nowrap text-xs">{data.getValue() as string}</p>
          }
          </>
        ),
        enableColumnFilter: false,
        header: () => <span>Evidencia</span>,
      },
      {
        id: "actions",
        header: () => <span>Acciones</span>,
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 text-xs sm:text-sm font-medium whitespace-nowrap"
              onClick={() => handleGeneratePDF(row.original)}
              title="Imprimir recibo"
            >
              <MdPictureAsPdf className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
          </div>
        ),
      },
      // { accessorFn: row =>row.studentUid, id: "studentUid", cell: (info) => info.getValue(), header:(item)=><span>{getStudentByUid(item.column)}</span> },
    ],
    [handleGeneratePDF]
  );
  useEffect(() => {
    getAndSetFees();
  }, [getAndSetFees]);

  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          {isAdmin ? 'Pagos recibidos' : 'Mis pagos'}
        </h1>
        
        {/* Modal para registrar pago */}
        <ModalGeneric
          key={"frm"}
          isVisible={showModal}
          setIsVisible={setShowModal}
          title={"Registro de pago"}
          children={<AddFeeForm />}
        />
        
        {/* Botón para registrar pago */}
        {user && !isTeacher && (
          <div className="mb-6 flex justify-end">
            <button 
              onClick={() => setShowModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
            >
              + Registrar Pago 💸
            </button>
          </div>
        )}
        
        {/* Tabla con TableGeneric */}
        <TableGeneric
          columns={isAdmin ? columns : studentColumns}
          data={isAdmin ? fees : fees.filter(f => f.studentUid === user?.uid)}
        />
        
        {/* Modal para vista previa PDF */}
        {showPreview && selectedRow && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">Vista Previa - Recibo de Pago</h2>
                <button
                  onClick={handleClosePreview}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 font-medium"
                >
                  Cerrar
                </button>
              </div>
              <div className="p-4">
                <PDFPreview row={selectedRow} studentName={getUserById(selectedRow!.studentUid!)!.name}/>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
