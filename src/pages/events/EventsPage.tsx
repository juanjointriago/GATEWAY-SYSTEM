import { event } from "../../interface"
import { ColumnProps } from "../../interface/ui/tables.interface"
import { useEventStore } from "../../stores/events/event.store"
import { StudentsList } from "../users/StudentsList"
import { useAuthStore, useUserStore } from "../../stores"
import { AvatarButton } from "../../components/shared/buttons/AvatarButton"
import { StudentActions } from "./StudentActions"
import { IoCalendarClearOutline, IoPencil, IoTrash } from "react-icons/io5"
import { NavLink } from "react-router-dom"
import { TableContainer } from "../../components/shared/tables/TableContainer"
import { FabButton } from "../../components/shared/buttons/FabButton"
import { useState } from "react"
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric"
import Swal from "sweetalert2"
import { getInitials } from "../users/helper"
import { FormEventControl } from "../../components/shared/forms/FormEventControl"
import { EditEventControl } from "../../components/shared/forms/EditEventControl"
import { ToggleButton } from "../../components/shared/buttons/ToggleButton"


export const EventsPage = () => {
  const users = useUserStore(state => state.users);
  const user = useAuthStore(state => state.user);
  const updateEvent = useEventStore(state => state.updateEvent);
  const deleteEvent = useEventStore(state => state.deleteEvent);
  const isAdmin = user && user.role === 'admin';
  const [openModal, setOpenModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<string>()


  const eventCols: Array<ColumnProps<event>> = [
    {
      key: 'name', title: 'Nombre', render: (_, record) => <div>{record.name} </div>
    },
    { key: 'date', title: 'Fecha', render: (_, record) => <span>{new Date(record.date).toLocaleDateString()}</span> },
    { key: 'date', title: 'Hora', render: (_, record) => <>{record.date && new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })}</> },
    { key: 'limitDate', title: 'Fecha Limite', render: (_, record) => <>{record.limitDate ? record.limitDate : 'No asignado'}</> },

    {
      key: 'teacher', title: 'Profesor', render: (_, record) => {
        return <> {record.teacher && users.find(user => user.id === record.teacher) && <AvatarButton initialLetter={getInitials(users.find(user => user.id === record.teacher)?.name ?? 'XX')} tootTipText={`${users.find(user => user.id === record.teacher)?.name}✨`} isActive />}</>
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
            ? <> {!(record.students.length) ? <StudentsList key={record.id} record={record.students} /> : <div>Sin asistentes</div>} </>
            : <> {user && user.role === 'student' ? <StudentActions userId={user.id!} students={record.students} event={record} Icon={IoCalendarClearOutline} /> : null} </>}
        </>
    },
    {
      key: 'isActive', title: 'Público', render: (_, record) => (
        //TODO component for generic actions on all tables
        <>
          {isAdmin ? <ToggleButton isActive={record.isActive} action={() => {
            Swal.fire({
              title: '¿Estás seguro?',
              text: `Estas a punto de ${record.isActive ? 'ocultar' : 'mostrar'} esta reservación`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Sí, continuar',
              cancelButtonText: 'Cancelar'
            }).then((result) => {
              if (result.isConfirmed) {
                updateEvent({ ...record, isActive: !record.isActive })
              }
            })
          }} /> : <div>{record.isActive ? 'Público' : 'Privado'}</div>}
          {isAdmin && <FabButton isActive tootTipText={''} action={() => {
            setOpenModal(true);
            setEventToEdit(record.id)
          }} Icon={IoPencil} />}
          {isAdmin && <FabButton isActive
            Icon={IoTrash}
            action={() => {
              Swal.fire({
                title: '¿Estás seguro?',
                text: `Estas a punto de eliminar esta reservación`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, continuar',
                cancelButtonText: 'Cancelar'
              }).then((result) => {
                if (result.isConfirmed) {
                  deleteEvent(record.id!);
                }
              })
            }} />}
        </>
      )
    },
  ]

  const events = useEventStore(state => state.events);
  const sortedEvents = events.sort((a, b) => b.date - a.date)
  // .filter(event => event.isActive);
  console.log()
  return (
    <div className="pt-5">
      <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">Reservaciones</h1>
      {eventToEdit && <ModalGeneric title="Actualizar datos" isVisible={openModal} setIsVisible={setOpenModal} children={<EditEventControl eventId={eventToEdit} />} />}
      {sortedEvents && <TableContainer
        hasAddBtn={isAdmin}
        columns={eventCols}
        data={user && ((user.role === 'admin')
          ? sortedEvents
          : (user.role === 'teacher')
            ? sortedEvents.filter((event => event.teacher === user.id))
            : sortedEvents.filter((event) => event.students[user.id!] && event.isActive))}
        modalChildren={<FormEventControl />}
        modalTitle="Crear Reservación" />}
    </div>
  )
}
