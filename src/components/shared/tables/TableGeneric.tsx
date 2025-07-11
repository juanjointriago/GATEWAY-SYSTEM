import {
  ColumnDef,
  ColumnFiltersState,
  RowData,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useReducer, useRef, useState } from "react";
import { Filter } from "./Filter";
import { environment } from "../../../environment";
import { WorkBook, utils, writeFileXLSX } from 'xlsx';
import { IoBarChart } from "react-icons/io5";
import { MdPictureAsPdf } from "react-icons/md";
import { useAuthStore } from "../../../stores";



interface Props<T> {
  columns: ColumnDef<T>[];
  data: T[];
  hasActions?: boolean;
  onGeneratePDF?: (row: T) => void; // Callback para generar PDF
  onDelete?: (row: T) => void; // Callback para eliminar
}

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
  }
}

export const TableGeneric = <T,>({
  data,
  columns,
  hasActions,
  onGeneratePDF,
  onDelete,
}: Props<T>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const rerender = useReducer(() => ({}), {})[1];
    const tableRef = useRef<HTMLTableElement | null>(null);
    const user = useAuthStore(state => state.user);

  

   const handleDownloadExcel = () => {
      const wb: WorkBook = utils.table_to_book(tableRef.current);
      writeFileXLSX(wb, `${crypto.randomUUID()}.xlsx`);
    }

  // Agregar columna de acciones dinámicamente
  const columnsWithActions = hasActions?[
    ...columns,
    {
      id: "actions",
      header: "Acciones",
      enableSorting: false,
      enableColumnFilter: false,
      size: 200,
      minSize: 120,
      maxSize: 250,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => (
        <div className="flex gap-1 sm:gap-2 flex-wrap">
          {/* Botón para generar PDF */}
          {onGeneratePDF && (
            <button
              className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 text-xs sm:text-sm font-medium whitespace-nowrap"
              onClick={() => onGeneratePDF(row.original)}
              title="Imprimir"
            >
              <MdPictureAsPdf className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
          )}
          {/* Botón para eliminar */}
          {onDelete && (
            <button
              className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 text-xs sm:text-sm font-medium whitespace-nowrap"
              onClick={() => onDelete(row.original)}
              title="Eliminar"
            >
              <span>🗑️</span>
              <span className="hidden sm:inline">Eliminar</span>
            </button>
          )}
        </div>
      ),
    },
  ]:columns;

  const table = useReactTable({
    data,
    columns: columnsWithActions,
    filterFns: {},
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg overflow-visible">
      {/* Header con botones de acción - responsivo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">Tabla de Datos</h3>
          <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
            {table.getPrePaginationRowModel().rows.length} registro(s)
          </span>
        </div>
        
        {user && user.role === 'admin' && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button 
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 sm:px-4 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 text-sm"
              type="button"
              onClick={handleDownloadExcel}
            >
              <IoBarChart className="w-4 h-4" />
              <span className="font-medium">Exportar Excel</span>
            </button>
            <button 
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 sm:px-4 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 text-sm"
              type="button"
              onClick={() => {}}
            >
              <MdPictureAsPdf className="w-4 h-4" />
              <span className="font-medium">Exportar PDF</span>
            </button>
          </div>
        )}
      </div>
      {/* Tabla con diseño moderno y responsivo */}
      <div className="overflow-x-auto overflow-y-visible rounded-lg border border-gray-200 shadow-sm relative">
        <table ref={tableRef} className="min-w-full divide-y divide-gray-200 relative z-0">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={`px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 ${
                      header.column.id === 'actions' ? 'sticky right-0 bg-gradient-to-r from-gray-50 to-gray-100 z-10 min-w-[120px] sm:min-w-[200px]' : 'min-w-[120px]'
                    }`}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center gap-2 hover:text-blue-600 transition-colors duration-200"
                              : "flex items-center gap-2",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <span className="text-gray-400">
                            {{
                              asc: "🔼",
                              desc: "🔽",
                            }[header.column.getIsSorted() as string] ?? (
                              header.column.getCanSort() ? "↕️" : null
                            )}
                          </span>
                        </div>
                        {header.column.getCanFilter() ? (
                          <div className="mt-2">
                            <Filter column={header.column} />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td 
                  colSpan={columnsWithActions.length} 
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-6xl">📋</div>
                    <div className="text-lg font-medium">No hay datos disponibles</div>
                    <div className="text-sm text-gray-400">
                      No se encontraron registros para mostrar
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition-colors duration-200`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`px-3 sm:px-6 py-4 text-sm text-gray-900 ${
                        cell.column.id === 'actions' 
                          ? 'sticky right-0 bg-inherit z-10 min-w-[120px] sm:min-w-[200px]' 
                          : 'min-w-[120px] truncate max-w-[200px]'
                      }`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Paginación moderna y responsiva */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-gray-50 px-4 sm:px-6 py-4 rounded-lg gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              className="p-2 rounded-lg border border-gray-300 hover:bg-white hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              title="Primera página"
            >
              {"<<"}
            </button>
            <button
              className="p-2 rounded-lg border border-gray-300 hover:bg-white hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              title="Página anterior"
            >
              {"<"}
            </button>
            <button
              className="p-2 rounded-lg border border-gray-300 hover:bg-white hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              title="Página siguiente"
            >
              {">"}
            </button>
            <button
              className="p-2 rounded-lg border border-gray-300 hover:bg-white hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              title="Última página"
            >
              {">>"}
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <span className="hidden sm:inline">Página</span>
            <strong className="text-gray-800">
              {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </strong>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <span className="hidden sm:inline">Ir a:</span>
            <input
              type="number"
              min="1"
              max={table.getPageCount()}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1 w-12 sm:w-16 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
            />
          </div>
          
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Información de debug solo en desarrollo */}
      {!environment.production && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => rerender()}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Forzar Rerender
            </button>
          </div>
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium text-gray-700">
              Ver filtros aplicados
            </summary>
            <pre className="mt-2 text-xs bg-white p-3 rounded border overflow-auto">
              {JSON.stringify(
                { columnFilters: table.getState().columnFilters },
                null,
                2
              )}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};