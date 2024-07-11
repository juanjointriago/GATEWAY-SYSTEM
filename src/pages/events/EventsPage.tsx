import { FormEvent } from "../../components/shared/forms"
import { TableContainer } from "../../components/shared/tables/TableContainer"
import { event } from "../../interface"
import { ColumnProps } from "../../interface/ui/tables.interface"
import { useEventStore } from "../../stores/events/event.store"
import { StudentsList } from "../users/StudentsList"
import { useUserStore } from "../../stores"
import { AvatarButton } from "../../components/shared/buttons/AvatarButton"






export const EventsPage = () => {
  const users = useUserStore(state => state.users);
  const eventCols: Array<ColumnProps<event>> = [
    { key: 'name', title: 'Nombre', render: (_, record) => <p className="truncate">{record.name}</p> },
    { key: 'date', title: 'Fecha', render: (_, record) => <span>{new Date(record.date).toLocaleDateString()}</span> },
    { key: 'date', title: 'Hora', render: (_, record) => <>{new Date(record.date).toLocaleTimeString()}</> },
    {
      key: 'teacher', title: 'Profesor', render: (_, record) => {
        return <>
          {users.find(user => user.id === record.teacher) && <AvatarButton tootTipText={`${users.find(user => user.id === record.teacher)?.name}✨`} isActive />}
        </>
      }
    },
    {
      key: 'students', title: 'Estudiantes', render: (_, record) => <>
        {record.students
          ? <StudentsList record={record.students} />
          : <div>Sin asistentes</div>}</>
    },
    //TODO OPEN LIST ON TABLE FOR STUDENTS
    // { key: 'levels', title: 'Es Público' },
    // { key: 'Acciones', title: 'Acciones' },
  ]

  const events = useEventStore(state => state.events);
  return (
    <div className="pt-5">
      <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">Reservaciones</h1>
      <TableContainer columns={eventCols} data={events} modalChildren={<FormEvent />} modalTitle="Crear Reservación" />
    </div>
  )
}
