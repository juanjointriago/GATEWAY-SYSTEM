import { ColumnProps } from "../../../interface/ui/tables.interface";

type Props<T> = {
    columns: Array<ColumnProps<T>>;
    data?: T[];
  };
export const Table =<T,> ({data, columns}:Props<T>) => {
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
            No existen registros
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
    <div className="flex flex-col">
        <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-200 border-b">
                  <tr>{headers}</tr>
                </thead>
                <tbody>{rows}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  )
}
