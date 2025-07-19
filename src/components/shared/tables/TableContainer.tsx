import { ReactElement, useMemo, useRef, useState } from "react";
import { ColumnProps } from "../../../interface/ui/tables.interface";
import { ModalGeneric } from "../ui/ModalGeneric";
import { IoBarChart, IoTrash } from "react-icons/io5";
import { MdPictureAsPdf } from "react-icons/md";
import { useAuthStore } from "../../../stores";
import CustomModal from "../../CustomModal";
import { dateToMiliseconds } from "../../../helpers/date.helper";



type Props<T> = {
  columns: Array<ColumnProps<T>>;
  data?: T[];
  modalChildren?: ReactElement;
  modalTitle?: string;
  hasAddBtn?: boolean;
};



export const TableContainer = <T,>({ data, columns, hasAddBtn = true, modalChildren, modalTitle }: Props<T>) => {
  const [searchTerms, setSearchTerms] = useState('')//send Terms to table for table filter on data
  console.debug(searchTerms)
  const tableRef = useRef<HTMLTableElement | null>(null);
  //for date range
  const [startDate, setStartDate] = useState<number | undefined>();
  const [endDate, setEndDate] = useState<number>(Date.now());

  const user = useAuthStore(state => state.user);
  const [modalInfo, setModalInfo] = useState<{ open: boolean; title: string; message: string }>({ open: false, title: '', message: '' });

  const handleDownloadExcel = () => {
    setModalInfo({
      open: true,
      title: 'Excel',
      message: 'Función de exportación temporalmente deshabilitada. Use los botones de exportación de la página principal.'
    });
  };
  const handleDownloadPDF = () => {
    setModalInfo({
      open: true,
      title: 'PDF',
      message: 'Función en construcción 😅'
    });
  };
  const [rowsLimit] = useState(50);
  const [rowsToShow, setRowsToShow] = useState(data?.slice(0, rowsLimit));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customPagination, setCustomPagination] = useState<any>([]);
  const [totalPage] = useState(Math.ceil(rowsToShow!.length / rowsLimit));
  const [currentPage, setCurrentPage] = useState(0);
  const nextPage = () => {
    const startIndex = rowsLimit * (currentPage + 1);
    const endIndex = startIndex + rowsLimit;
    const newArray = rowsToShow?.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(currentPage + 1);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const changePage = (value: any) => {
    const startIndex = value * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = rowsToShow?.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(value);
  };
  const previousPage = () => {
    const startIndex = (currentPage - 1) * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = rowsToShow?.slice(startIndex, endIndex);
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
  }, [data, rowsLimit]);



  const [showModal, setShowModal] = useState(false);
  const headers = columns.map((column, index) => {
    return (
      <th key={`headCell-${index}`} scope="col" className="py-3 px-3 w-[auto] text-[#212B36] sm:text-base font-bold whitespace-nowrap">
        {column.title}
      </th>
    );
  });

  const rows = !rowsToShow?.length ? (
    <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-indigo-200">
      <td colSpan={columns.length} className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        No hay registros{" "}
      </td>
    </tr>
  ) : (
    rowsToShow?.map((row, index) => {
      return (
        <tr key={`row-${index}`}
          className={`bg-white border-b transition duration-300 ease-in-out hover:bg-indigo-200 `}>
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
    <>
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-2 py-4">
        {/* searchInput */}
        <div className="flex-1 flex items-center max-w-full">
          <input
            type="search"
            className="block w-full p-3 md:p-4 ps-10 text-sm md:text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            id="table-search"
            placeholder="🔍 Buscar ..."
            onEmptied={() => { setSearchTerms(''); setRowsToShow(data); }}
            onAbort={() => { setSearchTerms(''); setRowsToShow(data); }}
            onChange={(e) => {
              setSearchTerms(e.target.value.trim());
              if (e.target.value.trim().length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const results = data && data.filter((data: any) => {
                  if (data['email']) {
                    return data["email"] && data["email"].toLowerCase().includes(e.target.value.trim().toLowerCase());
                  }
                  return data["name"] && data["name"].toLowerCase().includes(e.target.value.trim().toLowerCase());
                });
                setRowsToShow(results as T[]);
              } else {
                setRowsToShow(data);
              }
            }}
          />
        </div>
      </div>
      {/* Range DatePicker */}
      {user && user.role === 'admin' && (
        <div id="date-range-picker" className="flex flex-wrap items-center gap-2 md:gap-4 px-2 mb-2">
          <span className="text-gray-500">Desde</span>
          <div className="relative">
            <input
              id={'start-date'}
              name={'start-date'}
              type="date"
              className="border rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
              onChange={e => {
                setStartDate(dateToMiliseconds(e.target.value));
                if (startDate && endDate) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const results = data?.filter((record: any) => {
                    return record.updatedAt >= startDate && record.updatedAt <= endDate;
                  });
                  setRowsToShow(results as T[]);
                }
              }}
            />
          </div>
          <span className="text-gray-500">Hasta</span>
          <div className="relative">
            <input
              id={'end-date'}
              name={'end-date'}
              type="date"
              className="border rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
              onChange={e => {
                setEndDate(dateToMiliseconds(e.target.value));
                if (startDate && endDate) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const results = data?.filter((record: any) => {
                    return record.updatedAt >= startDate && record.updatedAt <= endDate;
                  });
                  setRowsToShow(results as T[]);
                }
              }}
            />
          </div>
          <button
            type="button"
            className="ml-2 p-1 rounded bg-gray-200 hover:bg-gray-300 transition"
            title="Limpiar filtro"
            onClick={() => window.location.reload()}
          >
            <IoTrash size={20} />
          </button>
        </div>
      )}
      {/* rest */}
      <div className="w-full max-w-full mx-auto overflow-auto">
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div className="flex flex-row flex-wrap gap-2 mb-3">
                {user && hasAddBtn && user.role === 'admin' && (
                  <button
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
                    type="button"
                    onClick={() => setShowModal(true)}
                  >
                    <span className="text-lg font-bold">+</span> Nuevo
                  </button>
                )}
                {user && user.role === 'admin' && (
                  <button
                    className="flex items-center gap-2 bg-green-800 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                    type="button"
                    onClick={handleDownloadExcel}
                  >
                    <IoBarChart />
                    Excel
                  </button>
                )}
                {user && user.role === 'admin' && (
                  <button
                    className="flex items-center gap-2 bg-red-800 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
                    type="button"
                    onClick={handleDownloadPDF}
                  >
                    <MdPictureAsPdf />
                    PDF
                  </button>
                )}
              </div>

              <div className="w-full overflow-x-scroll md:overflow-auto  md:max-w-7xl max-w-7xl 2xl:max-w-none mt-2">
                <table ref={tableRef} className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter border ">
                  <thead className="rounded-lg text-base text-white font-semibold w-full">
                    <tr className="bg-[#222E3A]/[6%]">{headers}</tr>
                  </thead>
                  <tbody className="overflow-x-auto">{rows}</tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="w-ful overflow-x-scroll md:overflow-scroll md:max-w-5xl l:max-w-7xl xl:max-w-7xl  3xl:max-w-none flex justify-center sm:justify-center flex-col sm:flex-row gap-5 mt-1.5 px-1 items-center self-center">
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
                    <li className={` prev-btn flex items-center justify-center w-[30px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] disabled] ${currentPage == 0
                      ? "bg-[#cccccc] pointer-events-none"
                      : " cursor-pointer"
                      }`}
                      onClick={previousPage}>
                      <img src="https://www.tailwindtap.com/assets/travelagency-admin/leftarrow.svg" />
                    </li>
                    {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      customPagination?.map((_: any, index: number) => (
                        <li className={`flex items-center justify-center w-[30px] rounded-[6px] h-[34px] border-[1px] border-solid bg-[#FFFFFF] cursor-pointer ${currentPage == index
                          ? "text-blue-600  border-sky-500"
                          : "border-[#E4E4EB] "
                          }`}
                          onClick={() => changePage(index)}
                          key={index}>
                          {index + 1}
                        </li>
                      )
                      )}
                    <li
                      className={`flex items-center justify-center w-[30px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] ${currentPage == totalPage - 1
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
          {/* Modal para agregar/editar */}
          {modalChildren && (
            <ModalGeneric isVisible={showModal} setIsVisible={setShowModal} title={modalTitle}>
              {modalChildren}
            </ModalGeneric>
          )}
          {/* Modal de información (reemplazo de Swal) */}
          <CustomModal
            isOpen={modalInfo.open}
            title={modalInfo.title}
            message={modalInfo.message}
            onCancel={() => setModalInfo({ ...modalInfo, open: false })}
            type="info"
            onConfirm={() => setModalInfo({ ...modalInfo, open: false })}
          />
        </div>
      </div>
    </>
  )
}
