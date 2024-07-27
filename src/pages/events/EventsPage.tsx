import { event } from "../../interface"
import { ColumnProps } from "../../interface/ui/tables.interface"
import { useEventStore } from "../../stores/events/event.store"
import { StudentsList } from "../users/StudentsList"
import { useAuthStore, useUserStore } from "../../stores"
import { AvatarButton } from "../../components/shared/buttons/AvatarButton"
import { StudentActions } from "./StudentActions"
import { IoCalendarClearOutline, IoEye, IoEyeOff, IoPencil } from "react-icons/io5"
import { NavLink } from "react-router-dom"
import { FormEvent } from "../../components/shared/forms"
import { TableContainer } from "../../components/shared/tables/TableContainer"
import { FabButton } from "../../components/shared/buttons/FabButton"
import { useState } from "react"
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric"
import { EditEventForm } from "../../components/shared/forms/EditEventForm"


export const EventsPage = () => {
  const users = useUserStore(state => state.users);
  const user = useAuthStore(state => state.user);
  const updateEvent = useEventStore(state => state.updateEvent);
  const isAdmin = user && user.role === 'admin';
  const [openModal, setOpenModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<string>()


  const eventCols: Array<ColumnProps<event>> = [
    {
      key: 'name', title: 'Nombre', render: (_, record) => <div className="truncate  w-[10rem] max-w-[10rem]">
        <p >{record.name}</p>
      </div>
    },
    { key: 'date', title: 'Fecha', render: (_, record) => <span>{new Date(record.date).toLocaleDateString()}</span> },
    { key: 'date', title: 'Hora', render: (_, record) => <>{record.date && new Date(record.date).toLocaleTimeString()}</> },
    // { key: 'limitDate', title: 'Fecha Limite', render: (_, record) => <>{ record.limitDate ? new Date(record.limitDate.toLocaleString()): 'No asignado'}</> },

    {
      key: 'teacher', title: 'Profesor', render: (_, record) => {
        return <> {record.teacher && users.find(user => user.id === record.teacher) && <AvatarButton initialLetter={users.find(user => user.id === record.teacher)?.name.slice(0,1).toUpperCase()} tootTipText={`${users.find(user => user.id === record.teacher)?.name}✨`} isActive />}</>
      }
    },
    {
      key: 'meetLink', title: 'Enlace de Meet', render: (_, record) =>
        <>{record.meetLink
          ? <NavLink to={record.meetLink} target="_blank" end rel="noreferrer noopener" >
            <span className="text-sm text-blue-500 hidden md:block">🧑‍💻 Ir a reunión</span>
          </NavLink>
          : <span className="text-sm  text-blue-500 hidden md:block">Sin enlace configurado</span>
        }
        </>
    },
    {
      key: 'students', title: isAdmin ? 'Estudiantes' : 'Gestión clase', render: (_, record) =>
        <>
          {isAdmin
            //TODO editable form for students
            ? <> {(!!record.students) ? <StudentsList key={record.id} record={record.students} /> : <div>Sin asistentes</div>} </>
            : <> {user && <StudentActions userId={user.id!} students={record.students} event={record} Icon={IoCalendarClearOutline} />} </>}
        </>
    },
    {
      key: 'isActive', title: 'Público', render: (_, record) => (
        //TODO component for generic actions on all tables
        <>
        <FabButton isActive Icon={record.isActive ? IoEye : IoEyeOff} action={isAdmin ? () => updateEvent({ ...record, isActive: !record.isActive }) : () => console.log('')} />
        {isAdmin && <FabButton isActive tootTipText={''} action={() => {
          setOpenModal(true);
          setEventToEdit(record.id)
        }} Icon={IoPencil} />}
        </>
      )
    },
  ]

  const events = useEventStore(state => state.events);
  const sortedEvents = events.sort((a, b) => b.date - a.date)
  // .filter(event => event.isActive);
  return (
    <div className="pt-5">
      <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">Reservaciones</h1>
      {eventToEdit && <ModalGeneric title="Actualizar datos" isVisible={openModal} setIsVisible={setOpenModal} children={<EditEventForm eventId={eventToEdit} />} />}
      <TableContainer
        hasAddBtn={isAdmin}
        columns={eventCols}
        data={user && ((user.role === 'admin')
          ? sortedEvents
          : (user.role === 'teacher')
            ? sortedEvents.filter((event => event.teacher === user.id))
            : sortedEvents.filter((event) => event.students[user.id!]))}
        modalChildren={<FormEvent />}
        modalTitle="Crear Reservación" />
    </div>
  )
}
