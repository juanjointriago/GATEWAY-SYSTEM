import { useEffect } from "react";
import { TableContainer } from "../../components/shared/tables/TableContainer"
import { level } from "../../interface"
import { ColumnProps } from "../../interface/ui/tables.interface"
import { useLevelStore } from "../../stores";

const levelsCols: Array<ColumnProps<level>> = [
  { key: 'id', title: 'Código' },
  { key: 'name', title: 'Nombre' },
  { key: 'description', title: 'Descripción' },
  // { key: 'isActive', title: 'Activo?' },
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
  const levels = useLevelStore(state => state.levels);

  useEffect(() => {
    getAllLevels();
  }, [])

  // console.log({getAllLevels})
  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">Niveles</h1>
        <TableContainer columns={levelsCols} data={levels} />
      </div>
    </>
  )
}
