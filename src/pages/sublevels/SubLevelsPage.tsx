import { IoPencil, IoTrash } from "react-icons/io5"
import { FabButton } from "../../components/shared/buttons/FabButton"
import { SublevelForm } from "../../components/shared/forms/SublevelForm"
import { TableContainer } from "../../components/shared/tables/TableContainer"
import { subLevel } from "../../interface"
import { ColumnProps } from "../../interface/ui/tables.interface"
import { useAuthStore, useSubLevelStore } from "../../stores"
// import { LevelById } from "../levels/LevelById"
import { useState } from "react"
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric"
import { EditSubLEvelForm } from "../../components/shared/forms/EditSubLEvelForm"
import Swal from "sweetalert2"
import { ToggleButton } from "../../components/shared/buttons/ToggleButton"

export const SubLevelsPage = () => {
  const user = useAuthStore(state => state.user);
  const updateSublevel = useSubLevelStore(state => state.updateSubLevel);
  const deleteSubLevel = useSubLevelStore(state => state.deleteSubLevel);
  const isAdmin = user && user.role === 'admin';
  const subLevels = useSubLevelStore(state => state.subLevels);
  const [openModal, setOpenModal] = useState(false);
  const [subLevelToEdit, setSsubLevelToEdit] = useState<string>();
  // console.debug('SUBLEVELS', subLevels)
  const subLevelsCols: Array<ColumnProps<subLevel>> = [
    {
      key: 'createdAt', title: 'Fecha de Creación', render: (_, record) => {
        return new Date(record.createdAt).toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
    },
    { key: 'name', title: 'Nombre' },
    // { key: 'description', title: 'Descripción' },
    // { key: 'parentLevel', title: 'Modalidad', render: (_, record) => record.isActive ? <LevelById levelId={record.parentLevel} /> : <div>No asignado</div> },
    {
      key: 'isActive', title: `${isAdmin ? 'Acciones' : 'Estado'}`, render: (_, record) => {
        //TODO component for generic actions on all tables
        return <>
          {isAdmin ? <ToggleButton isActive={record.isActive} action={() => {

            console.debug(record)
            Swal.fire({
              title: '¿Estás seguro?',
              text: `Estas a punto de ${record.isActive ? 'ocultar' : 'mostrar'} esta Unidad`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Sí, continuar',
              cancelButtonText: 'Cancelar'
            }).then(async (result) => {
              if (result.isConfirmed) {
                console.debug('data for update', { ...record, isActive: record.isActive ? false : true });
                // return
                await updateSublevel({ ...record, isActive: !record.isActive })
                window.location.reload();
              }
            })
          }} /> : <div>{record.isActive ? 'Disponible' : 'No disponible'}</div>}
          {isAdmin && <FabButton isActive tootTipText={''} action={() => {
            setOpenModal(true);
            // setSsubLevelToEdit(record.id)
            setSsubLevelToEdit(record.id)
          }} Icon={IoPencil} />}
          {isAdmin && <FabButton isActive
            Icon={IoTrash}
            action={() => {
              Swal.fire({
                title: '¿Estás seguro?',
                text: `Estas a punto de eliminar esta Unidad (Sub-Nivel)`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, continuar',
                cancelButtonText: 'Cancelar'
              }).then(async(result) => {
                if (result.isConfirmed) {
                  await deleteSubLevel(record.id!);
                }
              })
            }} />}
        </>
          ;
      }
    },

  ]

  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">Unidades</h1>
        {subLevelToEdit && <ModalGeneric title="Actualizar datos" isVisible={openModal} setIsVisible={setOpenModal} children={<EditSubLEvelForm subLevelId={subLevelToEdit} />} />}
        <TableContainer hasAddBtn={isAdmin}
          columns={subLevelsCols}
          data={user && ((user.role === 'admin') ? subLevels : subLevels.filter((sublevel) => sublevel.id === user.subLevel))}
          modalChildren={<SublevelForm />} modalTitle="Crear Unidad" />
      </div>
    </>
  )
}
