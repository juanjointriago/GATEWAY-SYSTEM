import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import { unit } from "../../interface";
import { TableGeneric } from "../../components/shared/tables/TableGeneric";
import { useUnitStore } from "../../stores";

export const LocationsPage = () => {
const getAllUnits = useUnitStore(state => state.getAndSetUnits);
const books = useUnitStore(state => state.units);


  const columns = useMemo<ColumnDef<unit>[]>(
    () => [
      { accessorKey: "orderNumber", cell: (info) => info.getValue(), header:()=><span>Nro.</span> },
      { accessorFn: row =>row.sublevel, id: "sublevel", cell: (info) => info.getValue(), header:()=><span>Unidad</span> },
      { accessorFn: row =>row.name, id: "name", cell: (info) => info.getValue(), header:()=><span>Nombre</span> },
      { accessorFn: row =>row.supportMaterial, id: "supportMaterial", cell: (info) => info.getValue(), header:()=><span>Mat. de Apoyo</span> },
      
    ],
    []
  );


    useEffect(() => {
      getAllUnits();
    }, [getAllUnits]);

  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">
          Nuevo componente de Tabla
        </h1>
        {/**Table comp */}
        <TableGeneric columns={columns} data={books} />
      </div>
    </>
  );
};
