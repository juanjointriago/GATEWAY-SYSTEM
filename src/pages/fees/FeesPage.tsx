import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { fee } from "../../interface/fees.interface";
import { TableGeneric } from "../../components/shared/tables/TableGeneric";
import { useFeesStore } from "../../stores/fees/fess.store";
import { useAuthStore, useUserStore } from "../../stores";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { AddFeeForm } from "../../components/shared/forms/AddFeeForm";
import PDFPreview from "../../components/shared/pdf/PDFPreview";

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
      // { accessorFn: row =>row.studentUid, id: "studentUid", cell: (info) => info.getValue(), header:(item)=><span>{getStudentByUid(item.column)}</span> },
    ],
    []
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
        header: () => <span>Imagen</span>,
      },
      // { accessorFn: row =>row.studentUid, id: "studentUid", cell: (info) => info.getValue(), header:(item)=><span>{getStudentByUid(item.column)}</span> },
    ],
    []
  );
  useEffect(() => {
    getAndSetFees();
  }, [getAndSetFees]);

  const handleGeneratePDF = (row: fee) => {
    setSelectedRow(row); // Guardar la fila seleccionada
    setShowPreview(true); // Mostrar la vista previa
  };

  const handleClosePreview = () => {
    setSelectedRow(null); // Limpiar la fila seleccionada
    setShowPreview(false); // Ocultar la vista previa
  };

  return (
    <div className="pt-5">
      <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-6x">
        {isAdmin?'Pagos recibidos':'Mis pagos'}
      </h1>
      <div className="flex flex-row">
        {user && !isTeacher && (
          <button
            className="mr-1 ml-q bg-blue-500 mb-5 text-white px-4 py-2 rounded"
            type="button"
            onClick={() => setShowModal(true)}
          >
            Registrar Pago 💸
          </button>
        )}
        {/* {user && user.role === 'admin' && <button className="mr-1 ml-q bg-green-800 mb-5 text-white px-4 py-2 rounded hover:bg-green-700" type="button"
                        onClick={handleDownloadExcel}><IoBarChart /> </button>} */}
        {/* {user && user.role === 'admin' && <button className="bg-red-800 mb-5 text-white px-4 py-2 rounded hover:bg-red-700" type="button"
                        onClick={handleDownloadPDF}><MdPictureAsPdf /> </button>} */}
      </div>
      {/**Table comp */}
      <ModalGeneric
        key={"frm"}
        isVisible={showModal}
        setIsVisible={setShowModal}
        title={"Registro de pago"}
        children={<AddFeeForm />}
      />
      <TableGeneric
        hasActions
        // onGeneratePDF={async(row: fee) => await generatePDF(row)}
        onGeneratePDF={handleGeneratePDF}
        columns={isAdmin?columns: studentColumns}
        data={isAdmin?fees:fees.filter(f=>f.studentUid===user?.uid)}
      />
      {showPreview && selectedRow && (
        <div className="modal">
          <div className="modal-content">
            <button
              onClick={handleClosePreview}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Cerrar Vista Previa
            </button>
            <PDFPreview row={selectedRow} studentName={getUserById(selectedRow!.studentUid!)!.name}/>
          </div>
        </div>
      )}
    </div>
  );
};
