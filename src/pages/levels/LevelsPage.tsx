// import { useEffect } from "react";
import { TableContainer } from "../../components/shared/tables/TableContainer"
import { level } from "../../interface"
import { ColumnProps } from "../../interface/ui/tables.interface"
import { useLevelStore } from "../../stores";
import { FormLevel } from "../../components/shared/forms";

const levelsCols: Array<ColumnProps<level>> = [
  // { key: 'id', title: 'Código' },
  { key: 'name', title: 'Nombre' },
  { key: 'description', title: 'Descripción' },
  { key: 'isActive', title: 'Activo', render: (_, record) => record.isActive ? <input type="checkbox" checked /> : <input type="checkbox" checked={false} /> },
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

export const LevelsPage = () => {

  const levels = useLevelStore(state => state.levels);

  // console.log({getAllLevels})
  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">Modalidades</h1>
        <TableContainer columns={levelsCols} data={levels} modalChildren={<FormLevel />} modalTitle="Ccrear Niveles" />
      </div>
    </>
  )
}
