// import { useEffect } from "react";
import { TableContainer } from "../../components/shared/tables/TableContainer"
import { level } from "../../interface"
import { ColumnProps } from "../../interface/ui/tables.interface"
import { useAuthStore, useLevelStore } from "../../stores";
import { FormLevel } from "../../components/shared/forms";
import { FabButton } from "../../components/shared/buttons/FabButton";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Swal from "sweetalert2";


export const LevelsPage = () => {
  const user = useAuthStore(state => state.user);
  const isAdmin = user && user.role === 'admin';
  const levels = useLevelStore(state => state.levels);
  const updateLevel = useLevelStore(state => state.updateLevel);
  
  // console.log("LEVELS", levels);
  const levelsCols: Array<ColumnProps<level>> = [
    // { key: 'id', title: 'Código' },
    { key: 'name', title: 'Nombre' },
    { key: 'description', title: 'Descripción' },
    { key: 'isActive', title: 'Activo', render: (_, record) => (
      //TODO component for generic actions on all tables
      <FabButton isActive Icon={record.isActive ? IoEye : IoEyeOff} action={isAdmin ? () => {
        Swal.fire({
          title: '¿Está seguro?',
          text: `¿Está seguro de ${record.isActive ? 'desactivar' : 'activar'} la modalidad ${record.name}?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, desactivarla',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            updateLevel({ ...record, isActive: !record.isActive })
          }
        })
      } : () => console.log('')} />
    )
  },
  ]

  // console.log({getAllLevels})
  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">Modalidades</h1>
        <TableContainer columns={levelsCols} data={levels} modalChildren={<FormLevel />} modalTitle="Crear Modalidades" />
      </div>
    </>
  )
}
