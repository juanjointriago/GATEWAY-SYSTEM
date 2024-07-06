import { useEffect } from "react";
import { unit } from "../../interface"
import { ColumnProps } from "../../interface/ui/tables.interface"
import { useUnitStore } from "../../stores";
import { LevelById } from "../levels/LevelById";
import { TableContainer } from "../../components/shared/tables/TableContainer";
import { FormUnit } from "../../components/shared/forms/FormUnit";


const unitsCols :Array<ColumnProps<unit>> = [
  { key: 'name', title: 'Nombre' },
  { key: 'description', title: 'Descripción' },
  { key: 'level', title: 'Nivel', render: (_,record) => <LevelById  levelId={record.id}/>},
  { key: 'isActive', title: 'Activo' },
  {
    key: 'Acciones', title: 'Acciones', render: (_, record) => {
      return <div className="flex flex-row justify-between">
        <div className="text-blue-500 font-bold" onClick={() => console.log("Editar", { record })}>✚ </div>
        <div className="text-blue-500 font-bold" onClick={() => console.log('Activar registro por id', record.id)}>✅ </div>
        <div className="text-blue-500 font-bold" onClick={() => console.log('Eliminar por id', record.id)}>🗑️ </div>
      </div>;
    }
  },
]


export const UnitsPage = () => {
  const getAllUnits = useUnitStore(state => state.getAndSetUnits);
  const units = useUnitStore(state => state.units);
  useEffect(() => {
    getAllUnits();
  }, []);

  return (
    <>
    <div className="pt-5">
      <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">Unidades</h1>
      <TableContainer columns={unitsCols} data={units} modalChildren={<FormUnit/>} modalTitle="Crear Unidades"/>
    </div>
  </>
  )
}
