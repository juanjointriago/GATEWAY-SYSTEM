import { useState } from "react";
import { ColumnProps } from "../../../interface/ui/tables.interface";
import { ModalGeneric } from "../ui/ModalGeneric";
import { FormLevel } from "../forms";


type Props<T> = {
  columns: Array<ColumnProps<T>>;
  data?: T[];
};



export const TableContainer = <T,>({ data, columns }: Props<T>) => {
  const [showModal, setShowModal] = useState(false);
  const headers = columns.map((column, index) => {
    return (
      <th key={`headCell-${index}`} scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
        {column.title}
      </th>
    );
  });

  const rows = !data?.length ? (
    <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
      <td colSpan={columns.length} className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        No hay registros
      </td>
    </tr>
  ) : (
    data?.map((row, index) => {
      return (
        <tr key={`row-${index}`} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
          {columns.map((column, index2) => {
            const value = column.render
              ? column.render(column, row as T)
              : (row[column.key as keyof typeof row] as string);

            return <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap" key={`cell-${index2}`}>{value}</td>;
          })}
        </tr>
      );
    })
  );

  return (
    <div className="w-[97%] mx-auto overflow-auto">
      {/* <div className="bg-green-100"> */}
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            {/* boton de nuevo registro */}
            {<button className="bg-blue-500 mb-5 text-white px-4 py-2 rounded"  type="button"
        onClick={() => setShowModal(true)}>+ </button>}
            <div className="overflow-hidden">
              <table className="min-w-full ">
                <thead className="bg-gray-200 border-b">
                  <tr>{headers}</tr>
                </thead>
                <tbody>{rows}</tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Modal */}
        <ModalGeneric isVisible={showModal} setIsVisible={setShowModal} title="Crear Nivel" children={<FormLevel/>} />
      </div>
    </div>
  )
}
