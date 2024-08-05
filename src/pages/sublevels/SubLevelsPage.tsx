import { IoEye, IoEyeOff, IoPencil } from "react-icons/io5"
import { FabButton } from "../../components/shared/buttons/FabButton"
import { SublevelForm } from "../../components/shared/forms/SublevelForm"
import { TableContainer } from "../../components/shared/tables/TableContainer"
import { subLevel } from "../../interface"
import { ColumnProps } from "../../interface/ui/tables.interface"
import { useAuthStore, useSubLevelStore } from "../../stores"
import { LevelById } from "../levels/LevelById"
import { useState } from "react"
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric"
import { EditSubLEvelForm } from "../../components/shared/forms/EditSubLEvelForm"
import Swal from "sweetalert2"

export const SubLevelsPage = () => {
  const user = useAuthStore(state => state.user);
  const updateSublevel = useSubLevelStore(state => state.updateSubLevel);
  const isAdmin = user && user.role === 'admin';
  const subLevels = useSubLevelStore(state => state.subLevels);
  const [openModal, setOpenModal] = useState(false);
  const [subLevelToEdit, setSsubLevelToEdit] = useState<subLevel>();
  // console.log('SUBLEVELS', subLevels)
  const subLevelsCols: Array<ColumnProps<subLevel>> = [
    { key: 'name', title: 'Nombre' },
    // { key: 'description', title: 'Descripción' },
    { key: 'parentLevel', title: 'Modalidad', render: (_, record) => record.isActive ? <LevelById levelId={record.parentLevel} /> : <div>No asignado</div> },
    {
      key: 'isActive', title: 'Público', render: (_, record) => {
        //TODO component for generic actions on all tables
        return <>
          <FabButton isActive Icon={record.isActive ? IoEye : IoEyeOff} action={isAdmin ? () => {
            Swal.fire({
              title: '¿Estás seguro?',
              text: `Estás a punto ${record.isActive ? 'Desactivar' : 'Activar'} ${record.name} la unidad`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Sí, estoy seguro',
              cancelButtonText: 'No, cancelar',
            }).then((result) => {
              if (result.isConfirmed) {
                updateSublevel({ ...record, isActive: !record.isActive })
                Swal.fire('¡Hecho!', `La unidad ha sido ${record.isActive ? 'desactivada' : 'activada'}`, 'success')
              }
            })
          } : () => console.log('')} />
          {isAdmin && <FabButton isActive tootTipText={''} action={() => {
            setOpenModal(true);
            // setSsubLevelToEdit(record.id)
            setSsubLevelToEdit(record)
          }} Icon={IoPencil} />}
        </>
          ;
      }
    },
  ]

  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">Unidades</h1>
        {subLevelToEdit && <ModalGeneric title="Actualizar datos" isVisible={openModal} setIsVisible={setOpenModal} children={<EditSubLEvelForm subLevel={subLevelToEdit} />} />}
        <TableContainer hasAddBtn={isAdmin}
          columns={subLevelsCols}
          data={user && ((user.role === 'admin') ? subLevels : subLevels.filter((sublevel) => sublevel.id === user.subLevel))}
          modalChildren={<SublevelForm />} modalTitle="Crear Unidad" />
      </div>
    </>
  )
}
