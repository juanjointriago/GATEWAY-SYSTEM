import { TableContainer } from "../../components/shared/tables/TableContainer";
import { FirestoreUser } from "../../interface";
import { ColumnProps } from "../../interface/ui/tables.interface";
import { useAuthStore, useUserStore } from "../../stores";
import { LevelById } from "../levels/LevelById";
import { SubLevelById } from "../sublevels/SubLevelById";
import { FabButton } from "../../components/shared/buttons/FabButton";
import { IoEye, IoKey, IoLockClosed } from "react-icons/io5";

export const UsersPage = () => {
  const user = useAuthStore(state => state.user);
  const isAdmin = user && user.role === 'admin';
  const userCols: Array<ColumnProps<FirestoreUser>> = [
    { key: 'cc', title: 'CC' },
    { key: 'name', title: 'Nombres' },
    { key: 'level', title: 'Modalidad', render: (_, record) => <LevelById levelId={record.level!} /> },
    { key: 'subLevel', title: 'Curso', render: (_, record) => <SubLevelById subLevelId={record.subLevel!} /> },
    {
      key: 'isActive', title: 'Estado', render: (_, record) => <>
        {record && <div className="flex:1 flex-row justify-center">
          {/* TODO validate update with swal confirm */}
          <FabButton isActive action={() => updateUserById({ ...record, isActive: !record.isActive })} Icon={record.isActive ? IoKey : IoLockClosed} iconSize={18} />
          <FabButton isActive tootTipText={record.password ?? 'ssss'} action={() => { console.log(getUserById(record.id!)) }} Icon={IoEye} />
        </div>
        }
      </>
    },
  ]
  const users = useUserStore(state => state.users);
  // const getAllUsers = useUserStore(state => state.getAllUsers);
  const updateUserById = useUserStore(state => state.updateUser);
  const getUserById = useUserStore(state => state.getUserById);
  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">Usuarios</h1>
        <TableContainer hasAddBtn={isAdmin} columns={userCols} data={users} modalChildren={<></>} modalTitle="Registrar usuarios" />
      </div>
    </>
  )
}
