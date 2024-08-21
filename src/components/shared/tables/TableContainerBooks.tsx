import { ReactElement, useMemo, useRef, useState } from "react";
import { ColumnProps } from "../../../interface/ui/tables.interface";
import { ModalGeneric } from "../ui/ModalGeneric";
import { WorkBook, utils, writeFileXLSX } from 'xlsx';
import { IoBarChart } from "react-icons/io5";
import { MdPictureAsPdf } from "react-icons/md";
import { useAuthStore, useSubLevelStore } from "../../../stores";
import Swal from "sweetalert2";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { unit } from "../../../interface";




type Props = {
    columns: Array<ColumnProps<unit>>;
    data?: unit[];
    modalChildren: ReactElement;
    modalTitle: string;
    hasAddBtn?: boolean;
};


export const TableContainerBooks = ({ data, columns, hasAddBtn = true, modalChildren, modalTitle }: Props) => {
    const [searchTerms, setSearchTerms] = useState('')//send Terms to table for table filter on data
    const animatedComponents = makeAnimated();

    const tableRef = useRef<HTMLTableElement | null>(null);
    const user = useAuthStore(state => state.user);
    const units = useSubLevelStore(state => state.subLevels);
    const handleDownloadExcel = () => {
        const wb: WorkBook = utils.table_to_book(tableRef.current);
        writeFileXLSX(wb, `${crypto.randomUUID()}.xlsx`);
    }
    const handleDownloadPDF = () => {
        Swal.fire({
            title: 'PDF',
            text: 'Funcion en construcción 😅',
            icon: 'info',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#2563EB'
        })
    }
    const [rowsLimit] = useState(25);
    const [rowsToShow, setRowsToShow] = useState(data?.sort((a, b) => a.orderNumber - b.orderNumber).slice(0, rowsLimit));
    const [selectedUnit, setSelectedUnit] = useState<string>('');
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
        const newArray = data?.slice(startIndex, endIndex);
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
            Array(Math.ceil(rowsToShow!.length / rowsLimit)).fill(null)
        );
    }, [rowsToShow, rowsLimit]);


    const [showModal, setShowModal] = useState(false);
    const headers = columns.map((column, index) => {
        return (
            <th key={`headCell-${index}`} scope="col" className="py-3 px-3 w-[auto] text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                {column.title}
            </th>
        );
    });

    const rows = (!rowsToShow?.length) || (!data?.length) ? (
        <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-indigo-200">
            <td colSpan={columns.length} className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                No tiene libros asignados ...{" "}
            </td>
        </tr>
    ) : (
        rowsToShow?.sort((a, b) => {
            return a.orderNumber - b.orderNumber;
            // return b.orderNumber - a.orderNumber;
        }).filter(unit => unit.isActive).map((row, index) => {
            return (
                <tr key={`row-${index}`}
                    className={`bg-white border-b transition duration-300 ease-in-out hover:bg-indigo-200 `}>
                    {columns.map((column, index2) => {
                        const value = column.render
                            ? column.render(column, row as unit)
                            : (row[column.key as keyof typeof row] as string);

                        return <td className="text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap" key={`cell-${index2}`}>{value}</td>;
                    })}
                </tr>
            );
        })
    );

    return (
        <>
            <div className="ml-5 p-4 w-[17rem] flex justify-end">
                <div className="flex:1 flex-row">
                    {/* searchInput */}
                    <input type="search"
                        className="block w-[15rem] p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        id="table-search"
                        placeholder="🔍 Buscar por nombre ... "
                        onEmptied={() => {
                            setSearchTerms('');
                            if (selectedUnit === '') {
                                setRowsToShow(data);
                                return;
                            }
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            setRowsToShow(data?.filter((record: any) => (record.sublevel as keyof typeof data) === selectedUnit));
                        }}
                        onChange={(e) => {
                            // console.log(e.target)
                            setSearchTerms(e.target.value.trim())
                            const results = data && (selectedUnit !== ''
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                ? data.filter((item: any) => item.sublevel === selectedUnit).filter((data: any) =>
                                    data["name"].toLowerCase().includes(searchTerms.toLowerCase()))
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                : data.filter((data: any) =>
                                    data["name"].toLowerCase().includes(searchTerms.toLowerCase()))
                            )
                            console.log("resultados encontrados: ", results)
                            setRowsToShow(results as unit[])
                        }}
                    />
                    {(user && ((user.unitsForBooks)||(user.role === 'admin'))) && <Select
                        //   console.log('BOOKS',books.filter((book) => user!.unitsForBooks.includes(book.id!)) )
                        components={animatedComponents}
                        placeholder="-- Unidades -- "
                        options={user && (user.role === 'admin'
                            ? units.sort((a, b) => a.name > b.name ? 1 : -1).map((item) => ({ value: item.id, label: item.name })).sort()
                            : units.filter((unit) => user.unitsForBooks.includes(unit.id!)).map((item) => ({ value: item.id, label: item.name })).sort())}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={(e: any) => {
                            console.log(e.value)
                            setSelectedUnit(e.value);
                            const results = data && data.filter((record) => (record.sublevel as keyof typeof data) === e.value)
                            setRowsToShow(results as unit[])

                        }}
                    />}
                </div>
            </div>
            <div className="w-[97%] mx-auto overflow-auto">
                <div className="flex flex-col">
                    <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
                        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="flex flex-row">
                                {user && hasAddBtn && user.role === 'admin' && <button className="mr-1 ml-q bg-blue-500 mb-5 text-white px-4 py-2 rounded" type="button"
                                    onClick={() => setShowModal(true)}>+ </button>}
                                {user && user.role === 'admin' && <button className="mr-1 ml-q bg-green-800 mb-5 text-white px-4 py-2 rounded hover:bg-green-700" type="button"
                                    onClick={handleDownloadExcel}><IoBarChart /> </button>}
                                {user && user.role === 'admin' && <button className="bg-red-800 mb-5 text-white px-4 py-2 rounded hover:bg-red-700" type="button"
                                    onClick={handleDownloadPDF}><MdPictureAsPdf /> </button>}
                            </div>

                            <div className="w-full overflow-x-scroll md:overflow-auto  max-w-7xl 2xl:max-w-none mt-2">
                                <table ref={tableRef} className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter border ">
                                    <thead className="rounded-lg text-base text-white font-semibold w-full">
                                        <tr className="bg-[#222E3A]/[6%]">{headers}</tr>
                                    </thead>
                                    <tbody className="overflow-x-auto">{rows}</tbody>
                                </table>
                                {/* Pagination */}
                                <div className="w-full  flex justify-center sm:justify-between flex-col sm:flex-row gap-5 mt-1.5 px-1 items-center">
                                    <div className="tex-lg">
                                        👁️ {currentPage == 0 ? 1 : currentPage * rowsLimit + 1} /
                                        {currentPage === totalPage - 1
                                            ? rowsToShow?.length
                                            : (currentPage + 1) * rowsLimit}{" "}
                                        = {rowsToShow?.length} registros
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
                    </div>
                    {/* Modal */}
                    <ModalGeneric isVisible={showModal} setIsVisible={setShowModal} title={modalTitle} children={modalChildren} />
                </div>
            </div>
        </>
    )
}
