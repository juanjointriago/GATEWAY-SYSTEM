import { TableContainer } from "../../components/shared/tables/TableContainer";
import { FirestoreUser } from "../../interface";
import { ColumnProps } from "../../interface/ui/tables.interface";
import { useAuthStore, useUserStore } from "../../stores";
import { LevelById } from "../levels/LevelById";
import { SubLevelById } from "../sublevels/SubLevelById";
import { FabButton } from "../../components/shared/buttons/FabButton";
import { IoBook, IoEye, IoEyeOff, IoPencil } from "react-icons/io5";
import { useState } from "react";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import { EditUserform } from "../../components/shared/forms/EditUserform";
import Swal from "sweetalert2";

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
    {
      key: 'isActive', title: 'Estado', render: (_, record) => <>
        {record && <div className="flex:1 flex-row justify-center">
          {/* TODO validate update with swal confirm */}
          <FabButton isActive action={() => {
            Swal.fire({
              title: '¿Estas seguro?',
              text: `Deseas ${record.isActive ? 'desactivar' : 'activar'} el usuario ${record.name}`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, estoy seguro'
            }).then((result) => {
              if (result.isConfirmed) {
                updateUserById({ ...record, isActive: !record.isActive });
                Swal.fire(
                  'Actualizado!',
                  'El usuario ha sido actualizado.',
                  'success'
                )
              }

            })
            // updateUserById({ ...record, isActive: !record.isActive });

          }} Icon={record.isActive ? IoEye : IoEyeOff} iconSize={18} />
          {isAdmin && <FabButton isActive tootTipText={''} action={() => { setOpenModal(true); setUserToEdit(record.id) }} Icon={IoPencil} />}
          {isAdmin && <FabButton isActive tootTipText={''} action={() => { setOpenUnitModal(true); setUserforUnit(record.id) }} Icon={IoBook} />}
        </div>}
      </>
    },
  ]

  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">Usuarios</h1>
        {userToEdit && <ModalGeneric title="Actualizar datos" isVisible={openModal} setIsVisible={setOpenModal} children={<EditUserform userId={userToEdit} />} />}
        {userforUnit && <ModalGeneric title="Actualizar datos" isVisible={openUnitModal} setIsVisible={setOpenUnitModal} children={<EditUserform userId={userforUnit} />} />}
        {isAdmin ? <TableContainer hasAddBtn={false} columns={userCols} data={users} modalChildren={<></>} modalTitle="Registrar usuarios" />
          : <TableContainer hasAddBtn={isAdmin} columns={userCols} data={users} modalChildren={<></>} modalTitle="Registrar usuarios" />}
      </div>
    </>
  )
}
