import { TootipBase } from "../../components/shared/buttons/TootipBase"
import { FormEvent } from "../../components/shared/forms"
import { TableContainer } from "../../components/shared/tables/TableContainer"
import { event } from "../../interface"
import { ColumnProps } from "../../interface/ui/tables.interface"
import { useEventStore } from "../../stores/events/event.store"
import { StudentsList } from "../users/StudentsList"
import { UserInfoTooltip } from "../users/UserInfoTooltip"


const eventCols: Array<ColumnProps<event>> = [
  {
    key: 'name', title: 'Nombre', render: (_, record) => <TootipBase title={record.name} tootTipText={record.name} />
  },
  { key: 'date', title: 'Fecha', render: (_, record) => <>{new Date(record.date).toLocaleDateString()}</> },
  { key: 'date', title: 'Hora', render: (_, record) => <>{new Date(record.date).toLocaleTimeString()}</> },
  { key: 'maxAssistantsNumber', title: 'Max Est.' },
  { key: 'minAssistantsNumber', title: 'Min Est.' },
  { key: 'teacher', title: 'Profesor', render: (_, record) => <UserInfoTooltip userId={record.teacher as string} /> },
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




export const EventsPage = () => {
  const events = useEventStore(state => state.events);
  return (
    <div className="pt-5">
      <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">Reservaciones</h1>
      <TableContainer columns={eventCols} data={events} modalChildren={<FormEvent />} modalTitle="Crear Reservación" />
    </div>
  )
}
