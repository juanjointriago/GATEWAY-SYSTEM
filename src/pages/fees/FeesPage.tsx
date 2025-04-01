import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { fee } from "../../interface/fees.interface";
import { TableGeneric } from "../../components/shared/tables/TableGeneric";
import { useFeesStore } from "../../stores/fees/fess.store";
import { useAuthStore } from "../../stores";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { AddFeeForm } from "../../components/shared/forms/AddFeeForm";
import PDFPreview from "../../components/shared/pdf/PDFPreview";

export const FeesPage = () => {
  const getAndSetFees = useFeesStore((state) => state.getAndSetFees);
  const fees = useFeesStore((state) => state.fees);
  const user = useAuthStore((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<fee | null>(null); // Estado para la fila seleccionada
  const [showPreview, setShowPreview] = useState(false); // Estado para
  const columns = useMemo<ColumnDef<fee>[]>(
    () => [
      {
        accessorKey: "code",
        cell: (info) => info.getValue(),
        header: () => <span>Nro.</span>,
      },
      {
        accessorFn: (row) => row.place,
        id: "place",
        cell: (info) => info.getValue(),
        header: () => <span>Lugar</span>,
      },
      {
        accessorFn: (row) => row.createdAt,
        id: "createdAt",
        cell: (info) => info.getValue(),
        header: () => <span>Fecha</span>,
      },
      {
        accessorFn: (row) => row.reason,
        id: "reason",
        cell: (info) => info.getValue(),
        header: () => <span>Motivo</span>,
      },
      {
        accessorFn: (row) => row.studentUid,
        id: "studentUid",
        cell: (data) => data.getValue(),
        header: () => <span>Estudiante</span>,
      },
      {
        accessorFn: (row) => row.imageUrl,
        id: "imageUrl",
        cell: (data) => (
          <img
            src={data.getValue() as string}
            alt="No disponible"
            className="w-20 h-20 rounded-full object-cover"
          />
        ),
        header: () => <span>Imagen</span>,
      },
      {
        accessorFn: (row) => row.qty,
        id: "qty",
        cell: (info) => <div>{"$" + info.getValue()}</div>,
        header: () => <span>Valor</span>,
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
      <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">
        Pagos recibidos
      </h1>
      <div className="flex flex-row">
        {user && user.role === "admin" && (
          <button
            className="mr-1 ml-q bg-blue-500 mb-5 text-white px-4 py-2 rounded"
            type="button"
            onClick={() => setShowModal(true)}
          >
            +{" "}
          </button>
        )}
        {/* {user && user.role === 'admin' && <button className="mr-1 ml-q bg-green-800 mb-5 text-white px-4 py-2 rounded hover:bg-green-700" type="button"
                        onClick={handleDownloadExcel}><IoBarChart /> </button>} */}
        {/* {user && user.role === 'admin' && <button className="bg-red-800 mb-5 text-white px-4 py-2 rounded hover:bg-red-700" type="button"
                        onClick={handleDownloadPDF}><MdPictureAsPdf /> </button>} */}
      </div>
      {/**Table comp */}
      <ModalGeneric
      key={'frm'}
        isVisible={showModal}
        setIsVisible={setShowModal}
        title={"Registro de pago"}
        children={<AddFeeForm />}
      />
      <TableGeneric
        hasActions
        // onGeneratePDF={async(row: fee) => await generatePDF(row)}
        onGeneratePDF={handleGeneratePDF}
        columns={columns}
        data={fees}
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
            <PDFPreview row={selectedRow} />
          </div>
        </div>
      )}
    </div>
  );
};
