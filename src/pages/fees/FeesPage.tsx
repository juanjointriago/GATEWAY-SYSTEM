import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import { fee } from "../../interface/fees.interface";
import { TableGeneric } from "../../components/shared/tables/TableGeneric";

export const FeesPage = () => {

  const getFees = ()=>{};
    const columns = useMemo<ColumnDef<fee>[]>(
      () => [
        { accessorKey: "code", cell: (info) => info.getValue(), header:()=><span>Nro.</span> },
        { accessorFn: row =>row.code, id: "code", cell: (info) => info.getValue(), header:()=><span>Nro</span> },
        { accessorFn: row =>row.reason, id: "reason", cell: (info) => info.getValue(), header:()=><span>Motivo</span> },
        { accessorFn: row =>row.qty, id: "qty", cell: (info) => info.getValue(), header:()=><span>Cantidad</span> },
        // { accessorFn: row =>row.studentUid, id: "studentUid", cell: (info) => info.getValue(), header:(item)=><span>{getStudentByUid(item.column)}</span> },
        
      ],
      []
    );
        useEffect(() => {
          getFees();
    }, [getFees]);
  return (
     <div className="pt-5">
            <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">
              Pagos recibidos
            </h1>
            {/**Table comp */}
            <TableGeneric columns={columns} data={[]} />
          </div>
  )
}
