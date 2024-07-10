import { ReactElement, useMemo, useState } from "react";
import { ColumnProps } from "../../../interface/ui/tables.interface";
import { ModalGeneric } from "../ui/ModalGeneric";


type Props<T> = {
  columns: Array<ColumnProps<T>>;
  data?: T[];
  modalChildren: ReactElement;
  modalTitle: string;
  hasAddBtn?: boolean;
};



export const TableContainer = <T,>({ data, columns, hasAddBtn = true, modalChildren, modalTitle }: Props<T>) => {
  const [rowsLimit] = useState(20);
  const [rowsToShow, setRowsToShow] = useState(data?.slice(0, rowsLimit));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customPagination, setCustomPagination] = useState<any>([]);
  const [totalPage] = useState(Math.ceil(data!.length / rowsLimit));
  const [currentPage, setCurrentPage] = useState(0);
  const nextPage = () => {
    const startIndex = rowsLimit * (currentPage + 1);
    const endIndex = startIndex + rowsLimit;
    const newArray = data?.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(currentPage + 1);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const changePage = (value: any) => {
    const startIndex = value * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = data?.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(value);
  };
  const previousPage = () => {
    const startIndex = (currentPage - 1) * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = data?.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(0);
    }
  };

  useMemo(() => {
    setCustomPagination(
      Array(Math.ceil(data!.length / rowsLimit)).fill(null)
    );
  }, []);

  const [showModal, setShowModal] = useState(false);
  const headers = columns.map((column, index) => {
    return (
      <th key={`headCell-${index}`} scope="col" className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
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
    rowsToShow?.map((row, index) => {
      return (
        <tr key={`row-${index}`}
          className={`bg-white border-b transition duration-300 ease-in-out hover:bg-indigo-200`}>
          {columns.map((column, index2) => {
            const value = column.render
              ? column.render(column, row as T)
              : (row[column.key as keyof typeof row] as string);

            return <td className="text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap" key={`cell-${index2}`}>{value}</td>;
          })}
        </tr>
      );
    })
  );

  return (
    <div className="w-[97%] mx-auto overflow-auto">
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            {hasAddBtn && <button className="bg-blue-500 mb-5 text-white px-4 py-2 rounded" type="button"
              onClick={() => setShowModal(true)}>+ </button>}
            <div className="w-full overflow-x-scroll md:overflow-auto  max-w-7xl 2xl:max-w-none mt-2">
              <table className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter border ">
                <thead className="rounded-lg text-base text-white font-semibold w-full"> <tr className="bg-[#222E3A]/[6%]">{headers}</tr></thead>
                <tbody>{rows}</tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="w-full  flex justify-center sm:justify-between flex-col sm:flex-row gap-5 mt-1.5 px-1 items-center">
              <div className="tex-lg">
                👁️ {currentPage == 0 ? 1 : currentPage * rowsLimit + 1} /
                {currentPage === totalPage - 1
                  ? data?.length
                  : (currentPage + 1) * rowsLimit}{" "}
                = {data?.length} registros
              </div>
              <div className="flex">
                <ul className="flex justify-center items-center gap-x-[10px] z-30"
                  role="navigation"
                  aria-label="Pagination">
                  <li className={` prev-btn flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] disabled] ${currentPage == 0
                    ? "bg-[#cccccc] pointer-events-none"
                    : " cursor-pointer"
                    }`}
                    onClick={previousPage}>
                    <img src="https://www.tailwindtap.com/assets/travelagency-admin/leftarrow.svg" />
                  </li>
                  {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    customPagination?.map((data: any, index: number) => (
                      <li className={`flex items-center justify-center w-[36px] rounded-[6px] h-[34px] border-[1px] border-solid border-[2px] bg-[#FFFFFF] cursor-pointer ${currentPage == index
                        ? "text-blue-600  border-sky-500"
                        : "border-[#E4E4EB] "
                        }`}
                        onClick={() => changePage(index)}
                        key={index}>
                        {index + 1}
                      </li>
                    ))}
                  <li
                    className={`flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] ${currentPage == totalPage - 1
                        ? "bg-[#cccccc] pointer-events-none"
                        : " cursor-pointer"
                      }`}
                    onClick={nextPage}
                  >
                    <img src="https://www.tailwindtap.com/assets/travelagency-admin/rightarrow.svg" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Modal */}
        <ModalGeneric isVisible={showModal} setIsVisible={setShowModal} title={modalTitle} children={modalChildren} />
      </div>
    </div>
  )
}
