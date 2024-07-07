import { TableContainer } from "../../components/shared/tables/TableContainer"
import { subLevel } from "../../interface"
import { ColumnProps } from "../../interface/ui/tables.interface"
import { useSubLevelStore } from "../../stores"

export const SubLevelsPage = () => {
  const subLevelsCols:Array<ColumnProps<subLevel>> = [
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

  const subLevels = useSubLevelStore(state => state.sublevels);
  return (
    <>
    <div className="pt-5">
    <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">Cursos</h1>
      <TableContainer columns={subLevelsCols} data={subLevels} modalChildren={<></>} modalTitle="Crear Curso"/>
    </div>
    </>
  )
}
