import { useState } from "react"
import { TableContainer } from "../../components/shared/tables/TableContainer"
import { FirestoreUser } from "../../interface"
import { ColumnProps } from "../../interface/ui/tables.interface"
import { useUserStore } from "../../stores"
import { LevelById } from "../levels/LevelById"
import { SubLevelById } from "../sublevels/SubLevelById"

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
      key: 'isActive', title: 'Estado', render: (_, record) => <div onClick={() => changeActivationStatus(record.id!)}>
        {record.isActive ? <span className="text-green-500">Activo</span> : <span className="text-red-500">Inactivo</span>}
      </div>
    },
    // { key: 'phone', title: 'Teléfono' },
    // { key: 'role', title: 'Rol' },
    // { key: 'createdAt', title: 'Fecha Alta' },
    // { key: 'updatedAt', title: 'Última act.' },
  ]


  const users = useUserStore(state => state.users);
  const updateUserById = useUserStore(state => state.updateUser);

  const changeActivationStatus = (id: string) => {
    const currentUser = users.find((_,) => _.id === id)
    if (currentUser) {
      updateUserById({ ...currentUser, isActive: !currentUser.isActive })
    }
  }

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
        <TableContainer columns={userCols} data={filteredData} modalChildren={<></>} modalTitle="Registrar usuarios" />
      </div>
    </>
  )
}
