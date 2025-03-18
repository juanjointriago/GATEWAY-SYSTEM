import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { fee } from "../../interface/fees.interface";
import { TableGeneric } from "../../components/shared/tables/TableGeneric";
import { useFeesStore } from "../../stores/fees/fess.store";
import { useAuthStore } from "../../stores";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { AddFeeForm } from "../../components/shared/forms/AddFeeForm";

export const FeesPage = () => {
  const getAndSetFees = useFeesStore((state) => state.getAndSetFees);
  const user = useAuthStore((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const columns = useMemo<ColumnDef<fee>[]>(
    () => [
      {
        accessorKey: "code",
        cell: (info) => info.getValue(),
        header: () => <span>Nro.</span>,
      },
      {
        accessorFn: (row) => row.code,
        id: "code",
        cell: (info) => info.getValue(),
        header: () => <span>Nro</span>,
      },
      {
        accessorFn: (row) => row.reason,
        id: "reason",
        cell: (info) => info.getValue(),
        header: () => <span>Motivo</span>,
      },
      {
        accessorFn: (row) => row.qty,
        id: "qty",
        cell: (info) => info.getValue(),
        header: () => <span>Cantidad</span>,
      },
      // { accessorFn: row =>row.studentUid, id: "studentUid", cell: (info) => info.getValue(), header:(item)=><span>{getStudentByUid(item.column)}</span> },
    ],
    []
  );
  useEffect(() => {
    getAndSetFees();
  }, [getAndSetFees]);

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
        isVisible={showModal}
        setIsVisible={setShowModal}
        title={"Registro de pago"}
        children={<AddFeeForm/>}
      />
      <TableGeneric columns={columns} data={[]} />
    </div>
  );
};
