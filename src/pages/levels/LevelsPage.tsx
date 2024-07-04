import { useEffect } from "react";
import { TableContainer } from "../../components/shared/tables/TableContainer"
import { level } from "../../interface"
import { ColumnProps } from "../../interface/ui/tables.interface"
import { useLevelStore } from "../../stores";

const levelsCols: Array<ColumnProps<level>> = [
  { key: 'Código', title: 'Código' },
  { key: 'Nombre', title: 'Nombre' },
  { key: 'Descripción', title: 'Descripción' },
  { key: 'Es', title: 'Es Público' },
  {
    key: 'Acciones', title: 'Acciones', render: (_, record) => {
      return <>
        <div className="text-blue-500 font-bold">Editar {record.name}</div>
      </>;
    }
  },
]

export const LevelsPage = () => {
const getAllLevels = useLevelStore(state => state.getAndSetLevels)
const levels = useLevelStore(state => state.levels)

useEffect(() => {
  getAllLevels();
}, [])

// console.log({getAllLevels})
  return (
    <>
      <div>Niveles</div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Crear Nivel</button>
      <TableContainer columns={levelsCols} data={levels}/>
    </>
  )
}
