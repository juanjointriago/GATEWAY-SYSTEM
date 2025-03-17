import { ColumnDef } from "@tanstack/react-table";
import { 
  // useEffect,
   useMemo } from "react";
import { TableGeneric } from "../../components/shared/tables/TableGeneric";
// import {   useUserStore  } from "../../stores";
import { fee } from "../../interface/fees.interface";
// import { useProgressSheetStore } from "../../stores/progress-sheet/progresssheet.store";

export const LocationsPage = () => {
// const getStudentByUid = useUserStore(state => state.getUserById);
// const getAllProgressSheets = useProgressSheetStore(state => state.getAllProgressSheets);
// const progressSheets = useProgressSheetStore(state => state.progressSheets);



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


    // useEffect(() => {
    //   getAllProgressSheets();
    // }, [getAllProgressSheets]);


  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">
          Nuevo componente de Tabla
        </h1>
        {/**Table comp */}
        <TableGeneric columns={columns} data={[]} />
      </div>
    </>
  );
};
