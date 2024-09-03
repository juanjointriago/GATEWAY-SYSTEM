import { TableContainer } from "../../components/shared/tables/TableContainer";
import { FirestoreUser } from "../../interface";
import { ColumnProps } from "../../interface/ui/tables.interface";
import { useAuthStore, useUserStore } from "../../stores";
import { LevelById } from "../levels/LevelById";
import { SubLevelById } from "../sublevels/SubLevelById";
import { FabButton } from "../../components/shared/buttons/FabButton";
import { IoBook, IoPencil } from "react-icons/io5";
import { useState } from "react";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { EditUserform } from "../../components/shared/forms/EditUserform";
import Swal from "sweetalert2";
import { EditUserUnits } from "../../components/shared/forms/EditUserUnits";
import { ToggleButton } from "../../components/shared/buttons/ToggleButton";
import { environment } from "../../environment";

export const UsersPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openUnitModal, setOpenUnitModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<string>();
  const [userforUnit, setUserforUnit] = useState<string>();
  const user = useAuthStore(state => state.user);
  const isAdmin = user && user.role === 'admin';
  const users = useUserStore(state => state.users);
  // const getAllUsers = useUserStore(state => state.getAllUsers);
  const updateUserById = useUserStore(state => state.updateUser);
  // const getUserById = useUserStore(state => state.getUserById);
  const userCols: Array<ColumnProps<FirestoreUser>> = [
    { key: 'cc', title: 'CC' },
    { key: 'name', title: 'Nombres' },
    { key: 'level', title: 'Modalidad', render: (_, record) => <LevelById levelId={record.level!} /> },
    { key: 'subLevel', title: 'Curso', render: (_, record) => <SubLevelById subLevelId={record.subLevel!} /> },
    { key: 'createdAt', title: 'Fecha de Creacion', render: (_, record) => <div>{record.createdAt && new Date(record.createdAt).toDateString()}</div> },
    {
      key: 'isActive', title: `${isAdmin ? 'Acciones' : 'Estado'}`, render: (_, record) => <>
        {isAdmin ? <ToggleButton isActive={record.isActive} action={() => {
          Swal.fire({
            title: '¿Estás seguro?',
            text: `Estas a punto de ${record.isActive ? 'desactivar' : 'activar'}  el usuario ${record.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'Cancelar'
          }).then(async(result) => {
            if (result.isConfirmed) {
              await updateUserById({ ...record, isActive: !record.isActive });
              window.location.reload();
            }
          })
        }} /> : <div>{record.isActive ? 'Disponible' : 'No disponible'}</div>}
        {isAdmin && <FabButton isActive tootTipText={''} action={() => { setOpenModal(true); setUserToEdit(record.id) }} Icon={IoPencil} />}
        {isAdmin && <FabButton isActive tootTipText={''} action={() => { setOpenUnitModal(true); setUserforUnit(record.id) }} Icon={IoBook} />}
      </>
    },
  ]
  const sortedUsers = users.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime() )

  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">Usuarios</h1>
        {environment.production && <div className=" ml-10 bg-red-600 w-1/5">
          <select aria-placeholder="Modalidad"
            onChange={(e) => console.log(e.target.value)}
            className="h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500">
            <option>---- Filtros ----</option>
            <option value={'Docente'}>Docente</option>
            <option value={'Estudiante'}>Estudiante</option>
            <option value={'Administrativo'}>Administrativo</option>
            <option value={'Activo'}>Activo</option>
            <option value={'Inactivo'}>Inactivo</option>
          </select>
        </div>}
        {isAdmin && userToEdit && <ModalGeneric title="Actualizar datos" isVisible={openModal} setIsVisible={setOpenModal} children={<EditUserform userId={userToEdit} />} />}
        {isAdmin && userforUnit && <ModalGeneric title="Administrar Libros" isVisible={openUnitModal} setIsVisible={setOpenUnitModal} children={<EditUserUnits userId={userforUnit} />} />}
        {isAdmin ? <TableContainer hasAddBtn={false} columns={userCols} data={sortedUsers} modalChildren={<></>} modalTitle="Registrar usuarios" />
          : <TableContainer hasAddBtn={isAdmin} columns={userCols} data={users} />}
      </div>
    </>
  )
}
