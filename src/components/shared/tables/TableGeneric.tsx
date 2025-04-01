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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          {/* Botón para generar PDF */}
          {onGeneratePDF&&<button
            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
            onClick={() => onGeneratePDF && onGeneratePDF(row.original)}
          >
          Imprimir Recibo
          </button>}
          {/* Botón para eliminar */}
          {onDelete&&<button
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
            onClick={() => onDelete && onDelete(row.original)}
          >
            Eliminar
          </button>}
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
    <div className="p-2">
      <div className="flex flex-row">
         {user && user.role === 'admin' && <button className="mr-1 ml-q bg-green-800 mb-5 text-white px-4 py-2 rounded hover:bg-green-700" type="button"
          onClick={handleDownloadExcel}><IoBarChart /> </button>}
          {user && user.role === 'admin' && <button className="bg-red-800 mb-5 text-white px-4 py-2 rounded hover:bg-red-700" type="button"
            onClick={()=>{}}><MdPictureAsPdf /> </button>}
                    </div>
      <table ref={tableRef} className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className="border border-gray-300 px-4 py-2 text-left"
                >
                  {header.isPlaceholder ? null : (
                    <>
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                      {header.column.getCanFilter() ? (
                        <div>
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
        <tbody>
          {table.getRowModel().rows.map((row, index) => (
            <tr
              key={row.id}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100`}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border border-gray-300 px-4 py-2 text-sm"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Página</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Ir a la página:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Mostrar {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>{table.getPrePaginationRowModel().rows.length} Registro(s)</div>
      {environment.production && (
        <>
          <div>
            <button onClick={() => rerender()}>Forzar Rerender</button>
          </div>
          <pre>
            {JSON.stringify(
              { columnFilters: table.getState().columnFilters },
              null,
              2
            )}
          </pre>
        </>
      )}
    </div>
  );
};