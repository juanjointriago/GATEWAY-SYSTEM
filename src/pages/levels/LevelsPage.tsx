// import { useEffect } from "react";
import { TableContainer } from "../../components/shared/tables/TableContainer"
import { level } from "../../interface"
import { ColumnProps } from "../../interface/ui/tables.interface"
import { useAuthStore, useLevelStore } from "../../stores";
import { FormLevel } from "../../components/shared/forms";
import Swal from "sweetalert2";
import { ToggleButton } from "../../components/shared/buttons/ToggleButton";
import { FabButton } from "../../components/shared/buttons/FabButton";
import { useState } from "react";
import { IoPencil, IoTrash } from "react-icons/io5";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { EditLevelControl } from "../../components/shared/forms/EditLevelControl";


export const LevelsPage = () => {
  const user = useAuthStore(state => state.user);
  const isAdmin = user && user.role === 'admin';
  const levels = useLevelStore(state => state.levels);
  const updateLevel = useLevelStore(state => state.updateLevel);
  const deleteLevel = useLevelStore(state => state.deleteLevel);
  const [openModal, setOpenModal] = useState(false);
  const [levelToEdit, setLevelToEdit] = useState<string>();


  // console.log("LEVELS", levels);
  const levelsCols: Array<ColumnProps<level>> = [
    // { key: 'id', title: 'Código' },
    { key: 'name', title: 'Nombre' },
    { key: 'description', title: 'Descripción' },
    {
      key: 'isActive', title: `${isAdmin ? 'Acciones' : 'Estado'}`, render: (_, record) => (
        //TODO component for generic actions on all tables
        <>
          {isAdmin ? <ToggleButton isActive={record.isActive} action={() => {
            Swal.fire({
              title: '¿Estás seguro?',
              text: `Estas a punto de ${record.isActive ? 'ocultar' : 'mostrar'} esta modalidad`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Sí, continuar',
              cancelButtonText: 'Cancelar'
            }).then(async(result) => {
              if (result.isConfirmed) {
                await updateLevel({ ...record, isActive: !record.isActive })
                window.location.reload();
              }
            })
          }} /> : <div>{record.isActive ? 'Público' : 'Privado'}</div>}
          {isAdmin && <FabButton isActive tootTipText={''} action={() => {
            setOpenModal(true);
            setLevelToEdit(record.id)
          }} Icon={IoPencil} />}
          {isAdmin && <FabButton isActive
            Icon={IoTrash}
            action={() => {
              Swal.fire({
                title: '¿Estás seguro?',
                text: `Estas a punto de eliminar esta modalidad`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, continuar',
                cancelButtonText: 'Cancelar'
              }).then(async(result) => {
                if (result.isConfirmed) {
                  await deleteLevel(record.id!);
                }
              })
            }} />}
        </>
      )
    },
  ]

  // console.log({getAllLevels})
  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">Modalidades</h1>
      {levelToEdit && <ModalGeneric title="Actualizar datos" isVisible={openModal} setIsVisible={setOpenModal} children={<EditLevelControl levelId={levelToEdit} />} />}
        <TableContainer columns={levelsCols} data={levels} modalChildren={<FormLevel />} modalTitle="Crear Modalidades" />
      </div>
    </>
  )
}
