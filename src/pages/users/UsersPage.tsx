import { TableContainer } from "../../components/shared/tables/TableContainer"
import { FirestoreUser } from "../../interface"
import { ColumnProps } from "../../interface/ui/tables.interface"
import { useUserStore } from "../../stores"

export const UsersPage = () => {

  const userCols: Array<ColumnProps<FirestoreUser>> = [
    { key: 'cc', title: 'CC' },
    { key: 'name', title: 'Nombres' },
    { key: 'email', title: 'Correo' },
    { key: 'bornDate', title: 'Cumpleaños' },
    { key: 'address', title: 'Dirección' },
    { key: 'city', title: 'Ciudad' },
    { key: 'country', title: 'País' },
    { key: 'level', title: 'Nivel' },
    { key: 'subLevel', title: 'Subnivel' },
    { key: 'phone', title: 'Teléfono' },
    { key: 'role', title: 'Rol' },
    { key: 'createdAt', title: 'Fecha Alta' },
    { key: 'updatedAt', title: 'Última act.' },
  ]


  const users = useUserStore(state => state.users);

  return (
    <>
      <div className="pt-5">
        <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">Usuarios</h1>
        <TableContainer columns={userCols} data={users} modalChildren={<></>} modalTitle="Registrar usuarios" />
      </div>
    </>
  )
}
