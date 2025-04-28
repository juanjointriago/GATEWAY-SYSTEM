import { event } from "../../interface";
// import { ColumnProps } from "../../interface/ui/tables.interface";
import { useEventStore } from "../../stores/events/event.store";
import { StudentsList } from "../users/StudentsList";
import {
  useAuthStore,
  useLevelStore,
  useSubLevelStore,
  useUserStore,
} from "../../stores";
import { StudentActions } from "./StudentActions";
import {
  IoCalendarClearOutline,
  IoMail,
  IoPencil,
  IoTrash,
} from "react-icons/io5";
import { MdPerson } from "react-icons/md";
import { NavLink } from "react-router-dom";
// import { TableContainer } from "../../components/shared/tables/TableContainer";
import { FabButton } from "../../components/shared/buttons/FabButton";
import { useMemo, useState } from "react";
import { ModalGeneric } from "../../components/shared/ui/ModalGeneric";
import Swal from "sweetalert2";
// import { getInitials } from "../users/helper";
// import { FormEventControl } from "../../components/shared/forms/FormEventControl";
import { EditEventControl } from "../../components/shared/forms/EditEventControl";
import { ToggleButton } from "../../components/shared/buttons/ToggleButton";
import { footerMail, sendCustomEmail } from "../../store/firebase/helper";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { TableGeneric } from "../../components/shared/tables/TableGeneric";
import { FormUnit } from "../../components/shared/forms/FormUnit";
import { IconType } from "react-icons";

export const EventsPage = () => {
  const [showModal, setShowModal] = useState(false);
  
  const users = useUserStore((state) => state.users);
  const user = useAuthStore((state) => state.user);
  const sublevels = useSubLevelStore((state) => state.subLevels);
  const levels = useLevelStore((state) => state.levels);
  const updateEvent = useEventStore((state) => state.updateEvent);
  const deleteEvent = useEventStore((state) => state.deleteEvent);
  const isAdmin = user && user.role === "admin";
  const isTeacher = user && user.role === "teacher";
  const [openModal, setOpenModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<string>();

  const iconEdit:IconType = isAdmin?IoPencil:MdPerson

  const columns = useMemo<ColumnDef<event>[]>(
    
    () => {
      const teacherFilter: FilterFn<event> = (row, columnId, filterValue) => {
        const teacherId = row.getValue<string>(columnId);
        const teacher = users.find((user) => user.id === teacherId);
        return teacher?.name?.toLowerCase().includes(filterValue.toLowerCase()) || false;
      };
      return [
      {
        accessorFn: (row) => row.date,
        id: "date",
        cell: (info) => {
          const dateValue = info.getValue() as string;
          if (!dateValue) return "Sin fecha";
          const date = new Date(dateValue);
          const formattedDate = date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric", // Año completo
          });
          const formattedTime = date.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          });
          return `${formattedDate} ${formattedTime}`;
        },
        header: () => <span>Fecha</span>,
        filterFn: "includesString", // Filtrado por texto
        enableColumnFilter: true,
      },
      {
        accessorKey: "name",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() as string}</p>,
        header: () => <span>Name</span>,
      },
      {
        accessorKey: "limitDate",
        cell: (info) => {
          const dateValue = info.getValue() as string;
          if (!dateValue) return "Sin fecha";
          const date = new Date(dateValue);
          const formattedDate = date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric", // Año completo
          });
          const formattedTime = date.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          });
          return `${formattedDate} ${formattedTime}`;
        },
          filterFn: "includesString",
        header: () => <span className="text-xs">F. Limite Resevarcion</span>,
      },
      {
        accessorKey: "teacher",
        cell: (info) => {
          const teacher = users.find(
            (user) => user.id === info.getValue() as string
          );
          return teacher ? <span>{teacher.name}</span> : <span>Sin docente</span>;
        },
        header: () => <span>Docente</span>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filterFn: teacherFilter,
        enableColumnFilter: true,
      },
      {
        accessorKey: "meetLink",
        id: "meetLink",
        cell: (info) => {
          console.log('meetLink =>',info.row.original);
          return (
          <>
            {info.getValue() ? (
              <NavLink
                to={info.getValue() as string}
                target="_blank"
                end
                rel="noreferrer noopener"
              >
                <span className="text-sm text-blue-500 md:block">
                  🧑‍💻 Ir a reunión
                </span>
              </NavLink>
            ) : (
              <span className="text-sm  text-blue-500 md:block">
                Sin enlace configurado
              </span>
            )}
          </>
        )},
        header: () => <span>MeetLink</span>,
        enableColumnFilter: false,

      },
      {
        accessorKey: "students",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cell: (record) => {
          return (
            <>
              {isAdmin || isTeacher ? (
                <>
                  {" "}
                  {!record.row.original.students.length ? (
                    <StudentsList key={record.row.original.id} record={record.row.original.students} />
                  ) : (
                    <div>Sin asistentes</div>
                  )}{" "}
                </>
              ) : (
                <>
                  {" "}
                  {user && user.role === "student" ? (
                    <StudentActions
                      userId={user.id!}
                      students={record.row.original.students}
                      event={record.row.original}
                      Icon={IoCalendarClearOutline}
                    />
                  ) : null}{" "}
                </>
              )}
            </>
          );
        },
        header: () => <span>Asistentes</span>,
        enableColumnFilter: false,
      },
      {
        accessorKey: "isActive",
        header: () => <span>Acciones</span>,
        cell: (info) => {
         return (
          <div className="flex flex-direction-row">
            {/* //Cambiar estado */}
            {isAdmin ? (
              <ToggleButton
                isActive={info.getValue() as boolean}
                action={() => {
                  Swal.fire({
                    title: "¿Estás seguro?",
                    text: `Estas a punto de ${
                      info.getValue() as boolean ? "ocultar" : "mostrar"
                    } esta reservación`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, continuar",
                    cancelButtonText: "Cancelar",
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      await updateEvent({
                        ...info.row.original,
                        isActive: !info.getValue() as boolean,
                      });
                      window.location.reload();
                    }
                  });
                }}
              />
            ) : (
              <div>{info.getValue() as boolean ? "Público" : "Privado"}</div>
            )}
            {/* //Editar reservación */}
            {isAdmin && (
              <FabButton
                isActive
                tootTipText={""}
                action={() => {
                  setOpenModal(true);
                  setEventToEdit(info.row.original.id);
                }}
                Icon={iconEdit}
              />
            )}
            {/* //Eliminar reservación */}
            {isAdmin && (
              <FabButton
                isActive
                Icon={IoTrash}
                action={() => {
                  Swal.fire({
                    title: "¿Estás seguro?",
                    text: `Estas a punto de eliminar esta reservación`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, continuar",
                    cancelButtonText: "Cancelar",
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      await deleteEvent(info.row.original.id!);
                      window.location.reload();
                    }
                  });
                }}
              />
            )}
            {/* //envio correo Admin */}
            {isAdmin && (
              <FabButton
                isActive
                tootTipText={""}
                action={() => {
                  Swal.fire({
                    title: "¿Estás seguro?",
                    text: `Estas a punto de enviar un correo al docente de esta reservación`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, continuar",
                    cancelButtonText: "Cancelar",
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      const text = `Le recordamos que tiene asignado un horario de clase con fecha y hora : ${new Date(
                        info.row.original.date
                      ).toLocaleTimeString([], {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })} con el nombre de ${
                        info.row.original.name
                      }, con estudiantes de la(s) unidad(es) ${info.row.original.levels[0].subLevels
                        .map(
                          (sublevel) =>
                            sublevels.find((sub) => sub.id === sublevel)?.name
                        )
                        .join(", ")}, en modalida de ${
                        levels.find(
                          (level) => level.id === info.row.original.levels[0].level
                        )?.name
                      }.`;
                      await sendCustomEmail({
                        to: [
                          users.find((user) => user.id === info.row.original.teacher)!
                            .email!,
                        ],
                        message: {
                          subject: "Recordatorio de reservación",
                          text: `Hola, ${
                            users.find((user) => user.id === info.row.original.teacher)?.name
                          } ${text}`,
                          html: `<h1>Hola, ${
                            users.find((user) => user.id === info.row.original.teacher)?.name
                          }</h1> <p>${text}</p> ${footerMail}`,
                        },
                      }).then(async () => {
                        await Swal.fire({
                          title: "Correo enviado",
                          text: `Se ha enviado un correo a ${
                            users.find((user) => user.id === info.row.original.teacher)?.name
                          }`,
                          icon: "success",
                          confirmButtonColor: "#3085d6",
                          confirmButtonText: "Continuar",
                        });
                      });
                    }
                  });
                }}
                Icon={IoMail}
              />
            )}
          </div>
        ) 
        },
        enableColumnFilter: false,
      }
    ]},
    [ isAdmin, levels, sublevels, users, updateEvent, deleteEvent, setEventToEdit, isTeacher, user, ]
  );



  const events = useEventStore((state) => state.events);
  const sortedEvents = events.filter(event => event.isActive).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  console.log('events', events.length)
  return (
    <div className="pt-5">
      <h1 className="ml-11 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6x">
        Reservaciones
      </h1>
      {user && user.role === 'admin' && <button className="mr-1 ml-q bg-blue-500 mb-5 text-white px-4 py-2 rounded" type="button"
                  onClick={() => setShowModal(true)}>+ </button>}
      {eventToEdit && (
        <ModalGeneric
          title={isAdmin ? "Actualizar datos" : " Progress Sheet"}
          isVisible={openModal}
          setIsVisible={setOpenModal}
          children={
            isAdmin ? (
              <EditEventControl eventId={eventToEdit} />
            ) : (
              <>Formulario para Progress sheet {eventToEdit}</>
            )
          }
        />
      )}
      {events && (
        <TableGeneric
          columns={columns}
          data={(user &&
                (user.role === "admin"
                  ? sortedEvents
                  : user.role === "teacher"
                  ? sortedEvents.filter((event) => event.teacher === user.id)
                  : sortedEvents.filter(
                      (event) =>
                        event.students[user.id!] &&
                        event.isActive &&
                        event.levels[0].level === user.level
                    )) )?? []}
        />
       
      )}
          {<ModalGeneric isVisible={showModal} setIsVisible={setShowModal} title={"Crear Unidades"} children={<FormUnit/>} />}
    </div>
  );
};


 // <TableContainer
        //   hasAddBtn={isAdmin}
        //   columns={eventCols}
        //   data={
        //     user &&
        //     (user.role === "admin"
        //       ? sortedEvents
        //       : user.role === "teacher"
        //       ? sortedEvents.filter((event) => event.teacher === user.id)
        //       : sortedEvents.filter(
        //           (event) =>
        //             event.students[user.id!] &&
        //             event.isActive &&
        //             event.levels[0].level === user.level
        //         ))
        //   }
        //   modalChildren={<FormEventControl />}
        //   modalTitle="Crear Reservación"
        // />



  // const eventCols: Array<ColumnProps<event>> = [
  //   {
  //     key: "date",
  //     title: "Fecha - Hora",
  //     render: (_, record) => (
  //       <span>
  //         {new Date(record.date).toLocaleTimeString([], {
  //           year: "2-digit",
  //           month: "2-digit",
  //           day: "2-digit",
  //           hour: "2-digit",
  //           minute: "2-digit",
  //         })}
  //       </span>
  //     ),
  //   },
  //   // { key: 'date', title: 'Hora', render: (_, record) => <>{record.date && new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })}</> },
  //   {
  //     key: "name",
  //     title: "Nombre",
  //     render: (_, record) => <div>{record.name} </div>,
  //   },
  //   {
  //     key: "limitDate",
  //     title: "Fecha Limite Para reservar",
  //     render: (_, record) => (
  //       <>{record.limitDate ? record.limitDate : "No asignado"}</>
  //     ),
  //   },
  //   {
  //     key: "teacher",
  //     title: "Profesor",
  //     render: (_, record) => {
  //       return (
  //         <>
  //           {" "}
  //           {record.teacher &&
  //             users.find((user) => user.id === record.teacher) && (
  //               <AvatarButton
  //                 initialLetter={getInitials(
  //                   users.find((user) => user.id === record.teacher)?.name ??
  //                     "XX"
  //                 )}
  //                 tootTipText={`${
  //                   users.find((user) => user.id === record.teacher)?.name
  //                 }✨`}
  //                 isActive
  //               />
  //             )}
  //         </>
  //       );
  //     },
  //   },
  //   {
  //     key: "meetLink",
  //     title: "Enlace de Meet",
  //     render: (_, record) => (
  //       <>
  //         {record.meetLink ? (
  //           <NavLink
  //             to={record.meetLink}
  //             target="_blank"
  //             end
  //             rel="noreferrer noopener"
  //           >
  //             <span className="text-sm text-blue-500 md:block">
  //               🧑‍💻 Ir a reunión
  //             </span>
  //           </NavLink>
  //         ) : (
  //           <span className="text-sm  text-blue-500 md:block">
  //             Sin enlace configurado
  //           </span>
  //         )}
  //       </>
  //     ),
  //   },
  //   {
  //     key: "students",
  //     title: isAdmin || isTeacher ? "Estudiantes" : "Gestión clase",
  //     render: (_, record) => (
  //       <>
  //         {isAdmin || isTeacher ? (
  //           <>
  //             {" "}
  //             {!record.students.length ? (
  //               <StudentsList key={record.id} record={record.students} />
  //             ) : (
  //               <div>Sin asistentes</div>
  //             )}{" "}
  //           </>
  //         ) : (
  //           <>
  //             {" "}
  //             {user && user.role === "student" ? (
  //               <StudentActions
  //                 userId={user.id!}
  //                 students={record.students}
  //                 event={record}
  //                 Icon={IoCalendarClearOutline}
  //               />
  //             ) : null}{" "}
  //           </>
  //         )}
  //       </>
  //     ),
  //   },
  //   {
  //     key: "isActive",
  //     title: `${isAdmin ? "Acciones" : "Estado"}`,
  //     render: (_, record) => (
  //       <>
  //         {/* //Cambiar estado */}
  //         {isAdmin ? (
  //           <ToggleButton
  //             isActive={record.isActive}
  //             action={() => {
  //               Swal.fire({
  //                 title: "¿Estás seguro?",
  //                 text: `Estas a punto de ${
  //                   record.isActive ? "ocultar" : "mostrar"
  //                 } esta reservación`,
  //                 icon: "warning",
  //                 showCancelButton: true,
  //                 confirmButtonColor: "#3085d6",
  //                 cancelButtonColor: "#d33",
  //                 confirmButtonText: "Sí, continuar",
  //                 cancelButtonText: "Cancelar",
  //               }).then(async (result) => {
  //                 if (result.isConfirmed) {
  //                   await updateEvent({
  //                     ...record,
  //                     isActive: !record.isActive,
  //                   });
  //                   window.location.reload();
  //                 }
  //               });
  //             }}
  //           />
  //         ) : (
  //           <div>{record.isActive ? "Público" : "Privado"}</div>
  //         )}
  //         {/* //Editar reservación */}
  //         {isAdmin && (
  //           <FabButton
  //             isActive
  //             tootTipText={""}
  //             action={() => {
  //               setOpenModal(true);
  //               setEventToEdit(record.id);
  //             }}
  //             Icon={IoPencil}
  //           />
  //         )}
  //         {/* //Eliminar reservación */}
  //         {isAdmin && (
  //           <FabButton
  //             isActive
  //             Icon={IoTrash}
  //             action={() => {
  //               Swal.fire({
  //                 title: "¿Estás seguro?",
  //                 text: `Estas a punto de eliminar esta reservación`,
  //                 icon: "warning",
  //                 showCancelButton: true,
  //                 confirmButtonColor: "#3085d6",
  //                 cancelButtonColor: "#d33",
  //                 confirmButtonText: "Sí, continuar",
  //                 cancelButtonText: "Cancelar",
  //               }).then(async (result) => {
  //                 if (result.isConfirmed) {
  //                   await deleteEvent(record.id!);
  //                   window.location.reload();
  //                 }
  //               });
  //             }}
  //           />
  //         )}
  //         {/* //envio correo Admin */}
  //         {isAdmin && (
  //           <FabButton
  //             isActive
  //             tootTipText={""}
  //             action={() => {
  //               Swal.fire({
  //                 title: "¿Estás seguro?",
  //                 text: `Estas a punto de enviar un correo al docente de esta reservación`,
  //                 icon: "warning",
  //                 showCancelButton: true,
  //                 confirmButtonColor: "#3085d6",
  //                 cancelButtonColor: "#d33",
  //                 confirmButtonText: "Sí, continuar",
  //                 cancelButtonText: "Cancelar",
  //               }).then(async (result) => {
  //                 if (result.isConfirmed) {
  //                   const text = `Le recordamos que tiene asignado un horario de clase con fecha y hora : ${new Date(
  //                     record.date
  //                   ).toLocaleTimeString([], {
  //                     year: "2-digit",
  //                     month: "2-digit",
  //                     day: "2-digit",
  //                     hour: "2-digit",
  //                     minute: "2-digit",
  //                   })} con el nombre de ${
  //                     record.name
  //                   }, con estudiantes de la(s) unidad(es) ${record.levels[0].subLevels
  //                     .map(
  //                       (sublevel) =>
  //                         sublevels.find((sub) => sub.id === sublevel)?.name
  //                     )
  //                     .join(", ")}, en modalida de ${
  //                     levels.find(
  //                       (level) => level.id === record.levels[0].level
  //                     )?.name
  //                   }.`;
  //                   await sendCustomEmail({
  //                     to: [
  //                       users.find((user) => user.id === record.teacher)!
  //                         .email!,
  //                     ],
  //                     message: {
  //                       subject: "Recordatorio de reservación",
  //                       text: `Hola, ${
  //                         users.find((user) => user.id === record.teacher)?.name
  //                       } ${text}`,
  //                       html: `<h1>Hola, ${
  //                         users.find((user) => user.id === record.teacher)?.name
  //                       }</h1> <p>${text}</p> ${footerMail}`,
  //                     },
  //                   }).then(async () => {
  //                     await Swal.fire({
  //                       title: "Correo enviado",
  //                       text: `Se ha enviado un correo a ${
  //                         users.find((user) => user.id === record.teacher)?.name
  //                       }`,
  //                       icon: "success",
  //                       confirmButtonColor: "#3085d6",
  //                       confirmButtonText: "Continuar",
  //                     });
  //                   });
  //                 }
  //               });
  //             }}
  //             Icon={IoMail}
  //           />
  //         )}
  //       </>
  //     ),
  //   },
  // ];
