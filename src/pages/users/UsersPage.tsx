import { useEffect, useState } from "react";
import { TableContainer } from "../../components/shared/tables/TableContainer";
import { FirestoreUser } from "../../interface";
import { ColumnProps } from "../../interface/ui/tables.interface";
import { useUserStore } from "../../stores";
import { LevelById } from "../levels/LevelById";
import { SubLevelById } from "../sublevels/SubLevelById";
import { FabButton } from "../../components/shared/buttons/FabButton";
import { IoCheckmarkCircle, IoCheckmarkDone, IoEye } from "react-icons/io5";

export const UsersPage = () => {
  const userCols: Array<ColumnProps<FirestoreUser>> = [
    { key: 'cc', title: 'CC' },
    { key: 'name', title: 'Nombres' },
    // { key: 'email', title: 'Correo' },
    // { key: 'bornDate', title: 'Cumpleaños' },
    // { key: 'address', title: 'Dirección' },
    // { key: 'city', title: 'Ciudad' },
    // { key: 'country', title: 'País' },
    { key: 'level', title: 'Modalidad', render: (_, record) => <LevelById levelId={record.level!} /> },
    { key: 'subLevel', title: 'Curso', render: (_, record) => <SubLevelById subLevelId={record.subLevel!} /> },
    {
      key: 'isActive', title: 'Estado', render: (_, record) => <>
        {record && <div className="flex:1 flex-row justify-center">
          {/* <CheckBox action={() => updateUserById({ ...record, isActive: !record.isActive })} isActive={record.isActive} /> */}
          <FabButton isActive action={()=>updateUserById({ ...record, isActive: !record.isActive })} Icon={record.isActive?IoCheckmarkDone:IoCheckmarkCircle} iconSize={18}/>
          <FabButton isActive action={()=>console.log('Abrir modal para ver datos y en modal poder ver contraseña')} Icon={IoEye}/>
        </div>
        }
      </>
    },
    // { key: 'phone', title: 'Teléfono' },
    // { key: 'role', title: 'Rol' },
    // { key: 'createdAt', title: 'Fecha Alta' },
    // { key: 'updatedAt', title: 'Última act.' },
  ]


  // const usersShallow = useUserStore(useShallow(state => state.users));
  const users = useUserStore(state => state.users);
  const getAllUsers = useUserStore(state => state.getAllUsers);
  const updateUserById = useUserStore(state => state.updateUser);

  useEffect(() => {
    getAllUsers();
  }, [])


  const [filteredData, setFilteredDat6a] = useState<FirestoreUser[]>(users)
  const [searchTerms, setSearchTerms] = useState('')

  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">Usuarios</h1>
        {/* searchInput */}
        <div className="ml-5 p-4 w-1/4 flex justify-end">
          <input type="text" id="table-search"
            placeholder="🔍      Buscar ...   " onChange={(e) => {
              setSearchTerms(e.target.value)
              if (searchTerms.length > 0) {
                const results = users.filter(user =>
                  user["name"].toLowerCase().includes(searchTerms.toLowerCase())
                )
                setFilteredDat6a(results)
              }
            }}
          />
        </div>
        <TableContainer hasAddBtn={false} columns={userCols} data={filteredData} modalChildren={<></>} modalTitle="Registrar usuarios" />
      </div>
    </>
  )
}
