import { IoEye, IoEyeOff } from "react-icons/io5"
import { FabButton } from "../../components/shared/buttons/FabButton"
import { SublevelForm } from "../../components/shared/forms/SublevelForm"
import { TableContainer } from "../../components/shared/tables/TableContainer"
import { subLevel } from "../../interface"
import { ColumnProps } from "../../interface/ui/tables.interface"
import { useAuthStore, useSubLevelStore } from "../../stores"
import { LevelById } from "../levels/LevelById"

export const SubLevelsPage = () => {
  const user = useAuthStore(state => state.user);
  const updateSublevel = useSubLevelStore(state => state.updateSubLevel);
  const isAdmin = user && user.role === 'admin';

  const subLevelsCols: Array<ColumnProps<subLevel>> = [
    { key: 'name', title: 'Nombre' },
    // { key: 'description', title: 'Descripción' },
    { key: 'parentLevel', title: 'Modalidad', render: (_, record) => record.isActive ? <LevelById levelId={record.parentLevel} /> : <div>No asignado</div> },
    {
      key: 'isActive', title: 'Público', render: (_, record) => {
        return         <FabButton isActive={record.isActive} Icon={record.isActive ? IoEye : IoEyeOff} action={isAdmin ? () => updateSublevel({ ...record, isActive: !record.isActive }) : () => console.log('')} />
        ;
      }
    },
  ]

  const subLevels = useSubLevelStore(state => state.sublevels);
  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">Unidades</h1>
        <TableContainer hasAddBtn={isAdmin}
          columns={subLevelsCols}
          data={user && ((user.role === 'admin') ? subLevels : subLevels.filter((sublevel) => sublevel.id === user.subLevel))}
          modalChildren={<SublevelForm />} modalTitle="Crear Unidad" />
      </div>
    </>
  )
}
